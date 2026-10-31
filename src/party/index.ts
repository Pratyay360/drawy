import nitroWorker from "../../.output/server/index.mjs";
import { EditorServer } from "./server";
import { OccupancyServer } from "./rooms";
import type { Env } from "./server";

export { EditorServer, OccupancyServer };

/** Route `/parties/:party/:room` to the matching Durable Object: `main` is
 * the editor rooms, `rooms` the occupancy singleton, both addressed by name
 * (`getByName`) so the URL segment picks the instance. Returns null for any
 * other path so the request falls through to Nitro; unknown parties get the
 * same 400 the old PartyServer router produced. */
async function routeRealtimeRequest(request: Request, env: Env): Promise<Response | null> {
    const parts = new URL(request.url).pathname.split("/").filter(Boolean);
    if (parts[0] !== "parties" || parts.length < 3) return null;
    const [, party, room] = parts;

    switch (party) {
        case "main":
            return env.Main.getByName(room).fetch(request);
        case "rooms":
            return env.Rooms.getByName(room).fetch(request);
        default:
            return new Response("Invalid request", { status: 400 });
    }
}

/** One worker serves both the site (Nitro) and the realtime rooms
 * (Durable Objects): /parties/* is answered by the Durable Objects,
 * everything else (SSR and static assets) falls through to Nitro. */
export default {
    ...nitroWorker,
    async fetch(request: Request, env: Env, context: unknown): Promise<Response> {
        const realtimeResponse = await routeRealtimeRequest(request, env);
        if (realtimeResponse) return realtimeResponse;
        return nitroWorker.fetch(request, env, context);
    },
};
