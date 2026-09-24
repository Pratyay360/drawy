import "#/polyfill";

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "#/lib/session";
import { isClientDisconnect } from "#/orpc/is-client-disconnect";
import router from "#/orpc/router";

const handler = new RPCHandler(router, {
	interceptors: [
		onError((error) => {
			// Client navigated away / cancelled mid-request — not a server bug.
			if (!isClientDisconnect(error)) console.error(error);
		}),
	],
});

async function handle({ request }: { request: Request }) {
	const user = await getCurrentUser();

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
