import { routePartykitRequest } from "partyserver";
import nitroWorker from "../../.output/server/index.mjs";
import { OccupancyServer } from "./rooms";
import { EditorServer } from "./server";

export { EditorServer, OccupancyServer };

/** One worker serves both the site (Nitro) and the realtime rooms
 * (PartyServer Durable Objects): /parties/* is answered by the Durable
 * Objects, everything else — SSR and static assets — falls through to Nitro. */
export default {
    ...nitroWorker,
    async fetch(request: Request, env: Env, context: unknown): Promise<Response> {
        const partyResponse = await routePartykitRequest(request, env as never);
        if (partyResponse) return partyResponse;
        return nitroWorker.fetch(request, env as never, context);
    },
};