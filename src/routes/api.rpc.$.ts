import "#/polyfill";

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "#/lib/session";
import router from "#/orpc/router";

const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            // The cause carries the useful detail (a dropped connection, a
            // constraint violation); the message alone does not.
            const failure = error as {
                message?: string;
                cause?: { code?: string; message?: string };
            };
            const cause = failure.cause;
            console.error(
                "[rpc] request failed:",
                failure.message ?? "unknown error",
                cause ? `(${cause.code ?? "unknown"}: ${cause.message ?? "no detail"})` : "",
            );
        }),
    ],
});

async function handle({ request }: { request: Request }) {
    const user = await getCurrentUser();

    // Anonymous requests are allowed through — individual procedures enforce
    // authentication (e.g. `getPublic` is a public read-only endpoint).
    const { response } = await handler.handle(request, {
        prefix: "/api/rpc",
        context: { request, user: user ?? undefined },
    });

    return response ?? new Response("Not Found", { status: 404 });
}

export const Route = createFileRoute("/api/rpc/$")({
    server: {
        handlers: {
            HEAD: handle,
            GET: handle,
            POST: handle,
            PUT: handle,
            PATCH: handle,
            DELETE: handle,
        },
    },
});