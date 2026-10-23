import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import type * as Party from "partykit/server";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";
import { SINGLETON_ROOM_ID } from "./rooms";

const messageSync = 0;
const messageAwareness = 1;
const messageQueryAwareness = 3;
const BATCH_SENTINEL = "y-pk-batch";

type IncomingMessage = string | ArrayBuffer | ArrayBufferView;

function isBlobLike(value: unknown): value is Blob {
    return typeof Blob !== "undefined" && value instanceof Blob;
}

interface BatchMarker {
    type: "start" | "end";
    id: string;
    count: number;
    size: number;
}

/** Copy a WebSocket frame into a Uint8Array without dragging in the whole
 * underlying buffer when the frame arrives as a view. */
function toBytes(data: ArrayBuffer | ArrayBufferView): Uint8Array {
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

/** Normalize any binary frame to a Uint8Array, awaiting Blobs. */
async function toBytesAsync(data: ArrayBuffer | ArrayBufferView | Blob): Promise<Uint8Array> {
    if (isBlobLike(data)) return new Uint8Array(await data.arrayBuffer());
    return toBytes(data);
}

function createMessageReceiver(
    receive: (data: Uint8Array) => void,
): (message: IncomingMessage) => Promise<boolean> {
    let chunks: Uint8Array[] | null = null;
    let start: BatchMarker | null = null;
    let failed = false;

    const abortBatch = () => {
        chunks = null;
        start = null;
        failed = true;
    };

    return async (message: IncomingMessage): Promise<boolean> => {
        if (typeof message === "string") {
            if (!message.startsWith(BATCH_SENTINEL)) return false;
            const json = message.slice(message.indexOf("#") + 1);
            try {
                const marker = JSON.parse(json) as BatchMarker;
                if (marker.type === "start") {
                    chunks = [];
                    start = marker;
                    failed = false;
                } else if (marker.type === "end" && chunks && start) {
                    const batch = chunks;
                    const expected = start;
                    chunks = null;
                    start = null;
                    const size = batch.reduce((sum, c) => sum + c.byteLength, 0);
                    if (
                        !failed &&
                        expected.id === marker.id &&
                        expected.count === batch.length &&
                        expected.size === size
                    ) {
                        const bytes = new Uint8Array(size);
                        let offset = 0;
                        for (const chunk of batch) {
                            bytes.set(chunk, offset);
                            offset += chunk.byteLength;
                        }
                        receive(bytes);
                    } else {
                    }
                }
            } catch {
                abortBatch();
            }
            return true;
        }
        if (isBlobLike(message)) {
            const bytes = await toBytesAsync(message);
            if (chunks) chunks.push(bytes);
            else receive(bytes);
            return true;
        }
        if (chunks) {
            chunks.push(toBytes(message));
            return true;
        }
        receive(toBytes(message));
        return true;
    };
}

function isTruncatedUpdate(error: unknown): boolean {
    return error instanceof Error && error.message.includes("Unexpected end of array");
}

interface Client {
    controlledStates: Set<number>;
    receive: (message: IncomingMessage) => Promise<boolean>;
}

export default class EditorServer implements Party.Server {
    doc: Y.Doc | null = null;
    awareness: awarenessProtocol.Awareness | null = null;

    private clients = new Map<Party.Connection, Client>();
    private legacyStorageCleaned = false;

    constructor(public room: Party.Room) {}

    getConnectionTags(_connection: Party.Connection, context: Party.ConnectionContext) {
        const kind = new URL(context.request.url).searchParams.get("kind");
        return kind ? [kind] : [];
    }

    async onConnect(conn: Party.Connection) {
        // Normalize binary frames to ArrayBuffer. PartyKit's local dev
        // runtime (undici WebSocket) defaults binaryType to "blob", which
        // delivers binary frames as Blob — a Blob has no .buffer, so the
        // old toBytes produced an empty Uint8Array that decoded as
        // "Unexpected end of array". Setting arraybuffer fixes dev/prod parity.
        try {
            // Connection extends WebSocket; binaryType may be absent on
            // some runtimes, so guard with an optional cast.
            (conn as unknown as { binaryType?: string }).binaryType = "arraybuffer";
        } catch {
            // Some runtimes don't expose binaryType; toBytesAsync handles Blobs.
        }
        await this.cleanLegacyStorage();
        this.ensureDoc();
        const { doc, awareness } = this;
        if (!doc || !awareness) return;

        this.clients.set(conn, {
            controlledStates: new Set(),
            receive: createMessageReceiver((bytes) => {
                try {
                    this.handleYjsMessage(conn, bytes);
                } catch {
                    // pass
                }
            }),
        });

        // Initial handshake: request the client's missing state and share
        // the awareness states we already know about.
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
        } catch {}
    }

    async onMessage(message: IncomingMessage, sender: Party.Connection) {
        const client = this.clients.get(sender);
        if (client && (await client.receive(message))) {
            return;
        }
        if (typeof message !== "string") return;

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
            this.broadcastToTag("scene", message, sender.id);
        }
    }

    onClose(conn: Party.Connection) {
        this.removeClient(conn);
    }

    onError(conn: Party.Connection, _error: Error) {
        this.removeClient(conn);
    }

    private removeClient(conn: Party.Connection) {
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
            const rooms = this.room.context.parties["rooms"];
            if (!rooms) return;
            await rooms.get(SINGLETON_ROOM_ID).fetch("/", {
                method: "POST",
                body: JSON.stringify({
                    room: this.room.id,
                    count: Array.from(this.room.getConnections("presence")).length,
                }),
            });
        } catch {
            // Reporting occupancy is best effort; a failure here is not worth
            // interrupting the session for.
        }
    }

    private broadcastToTag(tag: string, message: string | Uint8Array, excludeId?: string) {
        for (const conn of this.room.getConnections(tag)) {
            if (conn.id === excludeId) continue;
            try {
                conn.send(message);
            } catch {
                // A dead connection is cleaned up by onClose/onError.
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
            const entries = await this.room.storage.list({ limit: 1 });
            if (entries.size > 0) await this.room.storage.deleteAll();
        } catch {}
    }

    private ensureDoc() {
        if (this.doc && this.awareness) return;

        const doc = new Y.Doc({ gc: true });
        const awareness = new awarenessProtocol.Awareness(doc);
        awareness.setLocalState(null);

        awareness.on(
            "update",
            (
                {
                    added,
                    updated,
                    removed,
                }: { added: number[]; updated: number[]; removed: number[] },
                origin: unknown,
            ) => {
                const sender = origin as Party.Connection | null;
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
            this.broadcastToTag("presence", bytes, (origin as Party.Connection | null)?.id);
        });

        this.doc = doc;
        this.awareness = awareness;
    }

    private handleYjsMessage(conn: Party.Connection, bytes: Uint8Array) {
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
                        // console.warn("[drawy] corrupted awareness update dropped");
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
            // console.warn("[drawy] unknown yjs message type", messageType);
        }
    }
}