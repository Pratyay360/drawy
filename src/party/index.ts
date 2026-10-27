import nitroWorker from "../../.output/server/index.mjs";
import { routePartykitRequest } from "partyserver";
import type { Env } from "./server";
import { EditorServer } from "./server";
import { OccupancyServer } from "./rooms";

export { EditorServer, OccupancyServer };

/** One worker serves both the site (Nitro) and the realtime rooms
 * (PartyServer Durable Objects): /parties/* is answered by the Durable
 * Objects, everything else — SSR and static assets — falls through to Nitro. */
export default {
  ...nitroWorker,
  async fetch(request: Request, env: Env, context: unknown): Promise<Response> {
    const partyResponse = await routePartykitRequest(request, env);
    if (partyResponse) return partyResponse;
    return nitroWorker.fetch(request, env, context);
  },
};
