import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import router from "#/orpc/router";

/**
 * Procedures whose payload carries the whole scene (elements + embedded
 * files). Those requests can be megabytes, so a slow uplink needs a real
 * budget instead of the metadata timeout — otherwise every save on a slow
 * connection is aborted mid-upload and retried forever.
 */
const HEAVY_PATHS = new Set([
    "canvases.get",
    "canvases.getPublic",
    "canvases.save",
    "canvases.uploadAsset",
    "canvases.versions.get",
]);
const DEFAULT_TIMEOUT_MS = 30_000;
const HEAVY_TIMEOUT_MS = 60_000;

const getORPCClient = createIsomorphicFn()
    .server(() =>
        createRouterClient(router, {
            context: () => ({
                request: { headers: getRequestHeaders() },
            }),
        }),
    )
    .client((): RouterClient<typeof router> => {
        const link = new RPCLink({
            url: `${location.origin}/api/rpc`,
            fetch: (request, init, _options, path) => {
                const controller = new AbortController();
                const timeoutMs = HEAVY_PATHS.has(path.join("."))
                    ? HEAVY_TIMEOUT_MS
                    : DEFAULT_TIMEOUT_MS;
                const timeout = setTimeout(
                    () =>
                        controller.abort(
                            new DOMException("Request timed out — slow network", "AbortError"),
                        ),
                    timeoutMs,
                );
                // The abort signal of the request itself is on the Request
                // object; `init` only carries the redirect mode.
                request.signal.addEventListener(
                    "abort",
                    () => controller.abort(request.signal.reason),
                    { once: true },
                );
                return fetch(request, { ...init, signal: controller.signal }).finally(() =>
                    clearTimeout(timeout),
                );
            },
        });
        return createORPCClient(link);
    });

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);