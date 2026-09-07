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
            fetch: (input, init) => {
                const controller = new AbortController();
                const timeout = setTimeout(
                    () =>
                        controller.abort(
                            new DOMException("Request timed out — slow network", "AbortError"),
                        ),
                    15000,
                );
                if (init?.signal) {
                    init.signal.addEventListener(
                        "abort",
                        () => controller.abort((init.signal as AbortSignal).reason),
                        { once: true },
                    );
                }
                return fetch(input, { ...init, signal: controller.signal }).finally(() =>
                    clearTimeout(timeout),
                );
            },
        });
        return createORPCClient(link);
    });

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);