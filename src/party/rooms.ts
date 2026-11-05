import { Server } from "partyserver";
import type { Connection } from "partyserver";

/** Rooms with no reported occupancy for this long stop appearing in the
 * list, so a crashed editor party can't leave a phantom count behind. */
const STALE_ROOM_MS = 5 * 60 * 1000;

type RoomReport = { room: string; count: number; at: number };

export type RoomsEnv = {
  Rooms: DurableObjectNamespace<OccupancyServer>;
  ASSETS: Fetcher;
  SESSION_SECRET: string;
  DATABASE_URL: string;
  S3_BUCKET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  PARTYKIT_SECRET: string;
  VITE_PARTYKIT_URL: string;
  SENTRY_AUTH_TOKEN: string;
  VITE_SITE_URL: string;
  Main: DurableObjectNamespace<never>;
};

export class OccupancyServer extends Server<RoomsEnv, Record<string, unknown>> {
  private rooms = new Map<string, RoomReport>();

  onConnect(connection: Connection) {
    connection.send(JSON.stringify({ type: "rooms", rooms: this.getOccupancies() }));
  }

  onMessage(sender: Connection, message: string) {
    let data: { type?: string };
    try {
      data = JSON.parse(message) as { type?: string };
    } catch {
      return;
    }
    if (data.type === "canvas-list-changed") {
      this.broadcast(message, [sender.id]);
    }
  }

  async onRequest(req: Request) {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    try {
      const { room, count } = (await req.json()) as {
        room?: string;
        count?: number;
      };
      if (typeof room !== "string" || typeof count !== "number") {
        return Response.json({ error: "Invalid payload" }, { status: 400 });
      }
      if (count > 0) {
        this.rooms.set(room, { room, count, at: Date.now() });
      } else {
        this.rooms.delete(room);
      }
      this.broadcast(JSON.stringify({ type: "rooms", rooms: this.getOccupancies() }));
      return Response.json({ ok: true });
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  private getOccupancies(): Record<string, number> {
    const now = Date.now();
    const result: Record<string, number> = {};
    for (const report of this.rooms.values()) {
      if (now - report.at > STALE_ROOM_MS) {
        this.rooms.delete(report.room);
        continue;
      }
      result[report.room] = report.count;
    }
    return result;
  }
}
