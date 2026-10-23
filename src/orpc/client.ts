import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import router from "#/orpc/router";

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
            fetch: (request, init) => {
                const controller = new AbortController();
                const timeout = setTimeout(
                    () =>
                        controller.abort(
                            new DOMException("Request timed out — slow network", "AbortError"),
                        ),
                    15000,
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