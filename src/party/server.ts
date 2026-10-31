import { DurableObject } from "cloudflare:workers";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";
import { SINGLETON_ROOM_ID } from "./room-id";
import type { RoomsEnv } from "./rooms";

const messageSync = 0;
const messageAwareness = 1;
const messageQueryAwareness = 3;

type IncomingMessage = string | ArrayBuffer | ArrayBufferView;

export type Env = RoomsEnv & {
    Main: DurableObjectNamespace<EditorServer>;
};

function isBlobLike(value: unknown): value is Blob {
    return typeof Blob !== "undefined" && value instanceof Blob;
}

/** Normalize any binary frame to a Uint8Array without dragging in the whole
 * underlying buffer when the frame arrives as a view, awaiting Blobs. */
async function toFrameBytes(data: unknown): Promise<Uint8Array> {
    if (isBlobLike(data)) return new Uint8Array(await data.arrayBuffer());
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
    throw new Error("Unsupported WebSocket frame");
}

function isTruncatedUpdate(error: unknown): boolean {
    return error instanceof Error && error.message.includes("Unexpected end of array");
}

interface Client {
    /** Which broadcasts this connection subscribed to: the `scene` socket
     * carries JSON scene/cursor messages, the `presence` socket carries the
     * Yjs sync + awareness stream. Read from the `kind` query parameter when
     * the socket is accepted, the equivalent of PartyServer's connection
     * tags. */
    kind: string | null;
    /** Awareness client ids this connection is responsible for, so its
     * presence is withdrawn when it disconnects. */
    controlledStates: Set<number>;
}

/** One drawing room: a Yjs document relay plus JSON scene broadcasts.
 *
 * A plain Cloudflare Durable Object (replacing PartyServer's `Server` base
 * class). Sockets are accepted with the non-hibernating API (`ws.accept()`
 * plus event listeners), so the in-memory Yjs document and awareness state
 * survive exactly as long as the connections that depend on them. Nothing is
 * persisted to storage: the browser saves each canvas to Postgres. */
export class EditorServer extends DurableObject<Env> {
    doc: Y.Doc | null = null;
    awareness: awarenessProtocol.Awareness | null = null;

    private clients = new Map<WebSocket, Client>();
    private legacyStorageCleaned = false;

    /** Accept a WebSocket upgrade for this room. The worker entry routes
     * `/parties/main/:room` here; everything else is a client mistake. */
    async fetch(request: Request): Promise<Response> {
        if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
            return new Response("This Durable Object only accepts WebSocket connections.", {
                status: 405,
            });
        }

        const kind = new URL(request.url).searchParams.get("kind");
        const pair = new WebSocketPair();
        const client = pair[0];
        const server = pair[1];
        server.accept();
        // Some runtimes default binaryType to "blob"; a Blob has no .buffer,
        // so its frames decode as "Unexpected end of array". Forcing
        // arraybuffer fixes that; toFrameBytes still handles Blobs too.
        try {
            server.binaryType = "arraybuffer";
        } catch {
            // Some runtimes may refuse the assignment.
        }

        this.clients.set(server, { kind, controlledStates: new Set() });
        server.addEventListener("message", (event: { data: unknown }) => {
            void this.onMessage(server, event.data as IncomingMessage).catch((error) => {
                console.error("[drawy] room message handler failed:", error);
            });
        });
        server.addEventListener("close", () => this.removeClient(server));
        server.addEventListener("error", () => this.removeClient(server));

        try {
            await this.onConnect(server);
        } catch (error) {
            console.error("[drawy] room handshake failed:", error);
            try {
                server.close(1011, "session setup failed");
            } catch {
                // Already gone; the client will reconnect.
            }
        }
        return new Response(null, { status: 101, webSocket: client });
    }

    /** Initial handshake: request the client's missing state and share
     * the awareness states we already know about. */
    private async onConnect(conn: WebSocket) {
        await this.cleanLegacyStorage();
        this.ensureDoc();
        const { doc, awareness } = this;
        if (!doc || !awareness) return;

        try {
            const syncEncoder = encoding.createEncoder();
            encoding.writeVarUint(syncEncoder, messageSync);
            syncProtocol.writeSyncStep1(syncEncoder, doc);
            conn.send(encoding.toUint8Array(syncEncoder));

            const states = Array.from(awareness.getStates().keys());
            if (states.length > 0) {
                const awarenessEncoder = encoding.createEncoder();
                encoding.writeVarUint(awarenessEncoder, messageAwareness);
                encoding.writeVarUint8Array(
                    awarenessEncoder,
                    awarenessProtocol.encodeAwarenessUpdate(awareness, states),
                );
                conn.send(encoding.toUint8Array(awarenessEncoder));
            }
        } catch {
            // The handshake is best effort; the client's own sync step 1
            // recovers anything that was not sent.
        }
    }

    private async onMessage(conn: WebSocket, message: IncomingMessage) {
        if (typeof message === "string") {
            let data: Record<string, unknown>;
            try {
                data = JSON.parse(message) as Record<string, unknown>;
            } catch {
                return;
            }
            if (
                data.type === "scene" ||
                data.type === "saved" ||
                data.event === "realtime-cursor-move"
            ) {
                this.broadcastToTag("scene", message, conn);
            }
            return;
        }

        let bytes: Uint8Array;
        try {
            bytes = await toFrameBytes(message);
        } catch {
            return;
        }
        try {
            this.handleYjsMessage(conn, bytes);
        } catch {
            // A malformed frame must not tear down the room.
        }
    }

    private removeClient(conn: WebSocket) {
        const client = this.clients.get(conn);
        if (!client) return;
        this.clients.delete(conn);
        if (this.awareness && client.controlledStates.size > 0) {
            awarenessProtocol.removeAwarenessStates(
                this.awareness,
                Array.from(client.controlledStates),
                null,
            );
        }
        void this.reportOccupancy();
    }

    /** Publish this room's connection count to the occupancy singleton so
     * canvases the user is not editing can still show live presence. */
    private async reportOccupancy() {
        try {
            const room = this.ctx.id.name;
            if (room === undefined) return;
            const rooms = this.env.Rooms.getByName(SINGLETON_ROOM_ID);
            await rooms.fetch(
                new Request("https://occupancy.local/", {
                    method: "POST",
                    body: JSON.stringify({ room, count: this.countByKind("presence") }),
                }),
            );
        } catch {
            // Reporting occupancy is best effort; a failure here is not worth
            // interrupting the session for.
        }
    }

    private countByKind(kind: string): number {
        let count = 0;
        for (const client of this.clients.values()) if (client.kind === kind) count++;
        return count;
    }

    private broadcastToTag(tag: string, message: string | Uint8Array, exclude?: WebSocket | null) {
        for (const [conn, client] of this.clients) {
            if (client.kind !== tag || conn === exclude) continue;
            try {
                conn.send(message);
            } catch {
                // A dead connection is cleaned up by its close/error handler.
            }
        }
    }

    /** One-time cleanup of corrupted persisted Yjs chunks left behind by the
     * old y-partykit `persist: true` storage format. Nothing is persisted
     * anymore, so after this wipe the storage stays empty. */
    private async cleanLegacyStorage() {
        if (this.legacyStorageCleaned) return;
        this.legacyStorageCleaned = true;
        try {
            const entries = await this.ctx.storage.list({ limit: 1 });
            if (entries.size > 0) await this.ctx.storage.deleteAll();
        } catch {
            // Cleaning up legacy chunks is best effort.
        }
    }

    private ensureDoc() {
        if (this.doc && this.awareness) return;

        const doc = new Y.Doc({ gc: true });
        const awareness = new awarenessProtocol.Awareness(doc);
        awareness.setLocalState(null);

        awareness.on(
            "update",
            (
                { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
                origin: unknown,
            ) => {
                const sender = origin as WebSocket | null;
                const changed = [...added, ...updated, ...removed];
                if (sender !== null) {
                    const client = this.clients.get(sender);
                    if (client) {
                        for (const id of added) client.controlledStates.add(id);
                        for (const id of removed) client.controlledStates.delete(id);
                    }
                }
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, messageAwareness);
                encoding.writeVarUint8Array(
                    encoder,
                    awarenessProtocol.encodeAwarenessUpdate(awareness, changed),
                );
                const bytes = encoding.toUint8Array(encoder);
                this.broadcastToTag("presence", bytes);
            },
        );

        // Doc updates (from sync step 2 or diff updates) are relayed to every
        // other peer. Applying an update twice is idempotent in Yjs, but
        // skipping the origin keeps traffic minimal.
        doc.on("update", (update: Uint8Array, origin: unknown) => {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeUpdate(encoder, update);
            const bytes = encoding.toUint8Array(encoder);
            const sender = origin as WebSocket;
            this.broadcastToTag("presence", bytes, this.clients.has(sender) ? sender : null);
        });

        this.doc = doc;
        this.awareness = awareness;
    }

    private handleYjsMessage(conn: WebSocket, bytes: Uint8Array) {
        const doc = this.doc;
        const awareness = this.awareness;
        if (!doc || !awareness) return;

        const decoder = decoding.createDecoder(bytes);
        const encoder = encoding.createEncoder();
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
            case messageSync: {
                encoding.writeVarUint(encoder, messageSync);
                // Handles sync step 1 (replies with missing state), step 2 and
                // updates (applies them; the doc "update" listener relays).
                syncProtocol.readSyncMessage(decoder, encoder, doc, conn);
                if (encoding.length(encoder) > 1) {
                    conn.send(encoding.toUint8Array(encoder));
                }
                break;
            }
            case messageAwareness: {
                const update = decoding.readVarUint8Array(decoder);
                try {
                    awarenessProtocol.applyAwarenessUpdate(awareness, update, conn);
                } catch (e) {
                    if (isTruncatedUpdate(e)) {
                        return;
                    }
                    throw e;
                }
                break;
            }
            case messageQueryAwareness: {
                const states = Array.from(awareness.getStates().keys());
                if (states.length === 0) break;
                encoding.writeVarUint(encoder, messageAwareness);
                encoding.writeVarUint8Array(
                    encoder,
                    awarenessProtocol.encodeAwarenessUpdate(awareness, states),
                );
                conn.send(encoding.toUint8Array(encoder));
                break;
            }
            default:
        }
    }
}
