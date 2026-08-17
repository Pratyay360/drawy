import "#/polyfill";

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "#/lib/session";
import router from "#/orpc/router";

const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            console.error(error);
        }),
    ],
});

async function handle({ request }: { request: Request }) {
    const user = await getCurrentUser();
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
        });
    }

    const { response } = await handler.handle(request, {
        prefix: "/api/rpc",
        context: { request, user },
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