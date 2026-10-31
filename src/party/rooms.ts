import { DurableObject } from "cloudflare:workers";

/** Rooms with no reported occupancy for this long stop appearing in the
 * list, so a crashed editor party can't leave a phantom count behind. */
const STALE_ROOM_MS = 5 * 60 * 1000;

type RoomReport = { room: string; count: number; at: number };

export type RoomsEnv = {
  Rooms: DurableObjectNamespace<OccupancyServer>;
};

/** The occupancy singleton behind `/parties/rooms/:room`.
 *
 * A plain Cloudflare Durable Object (replacing PartyServer's `Server` base
 * class): connected sockets get the current occupancy snapshot on accept and
 * live updates whenever a room reports in, and the editor rooms POST their
 * connection counts here. */
export class OccupancyServer extends DurableObject<RoomsEnv> {
  private rooms = new Map<string, RoomReport>();
  private clients = new Set<WebSocket>();

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      return this.acceptClient();
    }
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    try {
      const { room, count } = (await request.json()) as {
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

  private acceptClient(): Response {
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();
    this.clients.add(server);

    server.addEventListener("message", (event: { data: unknown }) => {
      if (typeof event.data !== "string") return;
      this.onMessage(server, event.data);
    });
    server.addEventListener("close", () => this.clients.delete(server));
    server.addEventListener("error", () => this.clients.delete(server));

    server.send(JSON.stringify({ type: "rooms", rooms: this.getOccupancies() }));
    return new Response(null, { status: 101, webSocket: client });
  }

  private onMessage(sender: WebSocket, message: string) {
    let data: { type?: string };
    try {
      data = JSON.parse(message) as { type?: string };
    } catch {
      return;
    }
    if (data.type === "canvas-list-changed") {
      this.broadcast(message, sender);
    }
  }

  private broadcast(message: string, exclude?: WebSocket) {
    for (const client of this.clients) {
      if (client === exclude) continue;
      try {
        client.send(message);
      } catch {
        // A dead connection is cleaned up by its close/error handler.
      }
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
