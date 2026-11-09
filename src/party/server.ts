import { eq, sql } from "drizzle-orm";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import type { Connection, ConnectionContext } from "partyserver";
import { getServerByName, Server } from "partyserver";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";
import { db } from "#/lib/db";
import { canvases, canvasSnapshots, canvasUpdates } from "#/lib/db/schema";
import { redisEnabled, redisPublish, redisRemovePresence, redisSetPresence } from "#/lib/redis";
import { getSnapshot, putSnapshot, s3DeleteObject, s3Enabled } from "#/lib/storage/s3";
import { decodeStoredUpdate, encodeStoredUpdate } from "#/lib/storage/update-crypto";
import { REDIS_PRESENCE_TTL, SNAPSHOT_DEBOUNCE_MS, SNAPSHOT_RETENTION } from "./constants";
import { SINGLETON_ROOM_ID } from "./room-id";

const messageSync = 0;
const messageAwareness = 1;
const messageQueryAwareness = 3;
const BATCH_SENTINEL = "y-pk-batch";

type IncomingMessage = string | ArrayBuffer | ArrayBufferView;

function toBytes(data: ArrayBuffer | ArrayBufferView): Uint8Array {
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

async function toBytesAsync(data: ArrayBuffer | ArrayBufferView | Blob): Promise<Uint8Array> {
    if (typeof Blob !== "undefined" && data instanceof Blob)
        return new Uint8Array(await data.arrayBuffer());
    return toBytes(data as ArrayBuffer | ArrayBufferView);
}

function createMessageReceiver(receive: (data: Uint8Array) => void) {
    let chunks: Uint8Array[] | null = null;
    let start: { id: string; count: number; size: number } | null = null;
    let failed = false;
    return async (message: IncomingMessage): Promise<boolean> => {
        if (typeof message === "string") {
            if (!message.startsWith(BATCH_SENTINEL)) return false;
            try {
                const marker = JSON.parse(message.slice(message.indexOf("#") + 1)) as {
                    type: "start" | "end";
                    id: string;
                    count: number;
                    size: number;
                };
                if (marker.type === "start") {
                    chunks = [];
                    start = marker;
                    failed = false;
                } else if (marker.type === "end" && chunks && start) {
                    const batch = chunks;
                    const expected = start;
                    chunks = null;
                    start = null;
                    const size = batch.reduce((s, c) => s + c.byteLength, 0);
                    if (
                        !failed &&
                        expected.id === marker.id &&
                        expected.count === batch.length &&
                        expected.size === size
                    ) {
                        const bytes = new Uint8Array(size);
                        let off = 0;
                        for (const c of batch) {
                            bytes.set(c, off);
                            off += c.byteLength;
                        }
                        receive(bytes);
                    }
                }
            } catch {
                chunks = null;
                start = null;
                failed = true;
            }
            return true;
        }
        if (typeof Blob !== "undefined" && message instanceof Blob) {
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

function isTruncatedUpdate(e: unknown) {
    return e instanceof Error && e.message.includes("Unexpected end of array");
}

interface Client {
    controlledStates: Set<number>;
    receive: (message: IncomingMessage) => Promise<boolean>;
}

async function loadDocument(roomId: string, env: Env): Promise<{
    doc: Y.Doc;
    checkpointSeq: number;
    lastSeq: number;
    snapshotVersion: number;
}> {
    const doc = new Y.Doc({ gc: true });
    const [canvas] = await db
        .select()
        .from(canvases)
        .where(eq(canvases.id, roomId))
        .limit(1)
        .catch(() => []);
    const checkpointSeq = canvas?.checkpointSeq ?? 0;
    let lastSeq = canvas?.lastSeq ?? 0;
    const snapshotVersion = canvas?.snapshotVersion ?? 0;

	let snapshot: Uint8Array | null = null;
	if (canvas?.snapshotKey) {
		snapshot = await getSnapshot(roomId, canvas.snapshotKey, env).catch(() => null);
	}
	if (!snapshot && canvas?.snapshotVersion) {
		snapshot = await getSnapshot(roomId, canvas.snapshotVersion, env).catch(() => null);
    }
    if (snapshot) {
        try {
            Y.applyUpdate(doc, snapshot);
        } catch {
            /* start from empty if corrupt */
        }
    }

	try {
        const rows = await db
            .select()
            .from(canvasUpdates)
            .where(
                sql`${canvasUpdates.canvasId} = ${roomId} AND ${canvasUpdates.seq} > ${checkpointSeq}`,
            )
            .orderBy(canvasUpdates.seq);
        for (const r of rows) {
            try {
                Y.applyUpdate(doc, decodeStoredUpdate(r.update));
            } catch {}
            if (r.seq > lastSeq) lastSeq = r.seq;
        }
        if (rows.length === 0 && canvas?.lastSeq) lastSeq = canvas.lastSeq;
    } catch {}

    return { doc, checkpointSeq, lastSeq, snapshotVersion };
}

export class EditorServer extends Server<Env, Record<string, unknown>> {
    doc: Y.Doc | null = null;
    awareness: awarenessProtocol.Awareness | null = null;
    private clients = new Map<Connection, Client>();
    private legacyStorageCleaned = false;
    private redisLogged = false;
    private checkpointSeq = 0;
    private lastSeq = 0;
    private snapshotVersion = 0;
    private snapshotTimer: ReturnType<typeof setTimeout> | null = null;
    private pendingSnapshot = false;

    getConnectionTags(_connection: Connection, context: ConnectionContext) {
        const kind = new URL(context.request.url).searchParams.get("kind");
        return kind ? [kind] : [];
    }

    async onConnect(conn: Connection) {
        if (!this.redisLogged) {
            this.redisLogged = true;
            console.log(
                `[redis] collaboration bus ${redisEnabled() ? "enabled" : "disabled (UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set)"}`,
            );
        }
        try {
            (conn as unknown as { binaryType?: string }).binaryType = "arraybuffer";
        } catch {}
        await this.cleanLegacyStorage();
        await this.ensureDoc();

        const { doc, awareness } = this;
        if (!doc || !awareness) return;

        this.clients.set(conn, {
            controlledStates: new Set(),
            receive: createMessageReceiver((bytes) => {
                try {
                    this.handleYjsMessage(conn, bytes);
                } catch {}
            }),
        });

		if (redisEnabled()) {
            void redisSetPresence(this.name, conn.id, { at: Date.now() }, REDIS_PRESENCE_TTL);
        }

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

    async onMessage(sender: Connection, message: IncomingMessage) {
        const client = this.clients.get(sender);
        if (client && (await client.receive(message))) return;
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
		if (data.type === "snapshot") {
            this.scheduleSnapshot(0);
        }
    }

    onClose(conn: Connection) {
        this.removeClient(conn);
    }
    onError(conn: Connection, _e: Error) {
        this.removeClient(conn);
    }

    private removeClient(conn: Connection) {
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
        if (redisEnabled()) void redisRemovePresence(this.name, conn.id);
        void this.reportOccupancy();
        if (this.clients.size === 0) void this.snapshotNow();
    }

    private async reportOccupancy() {
        try {
            const rooms = await getServerByName(this.env.Rooms as never, SINGLETON_ROOM_ID);
            await (rooms as unknown as { fetch: (r: Request) => Promise<Response> }).fetch(
                new Request("https://occupancy.local/", {
                    method: "POST",
                    body: JSON.stringify({
                        room: this.name,
                        count: Array.from(this.getConnections("presence")).length,
                    }),
                }),
            );
        } catch {}
    }

    private broadcastToTag(tag: string, message: string | Uint8Array, excludeId?: string) {
        for (const conn of this.getConnections(tag)) {
            if (conn.id === excludeId) continue;
            try {
                conn.send(message);
            } catch {}
        }
    }

    private async cleanLegacyStorage() {
        if (this.legacyStorageCleaned) return;
        this.legacyStorageCleaned = true;
        try {
            const entries = await this.ctx.storage.list({ limit: 1 });
            if (entries.size > 0) await this.ctx.storage.deleteAll();
        } catch {}
    }

    private async ensureDoc() {
        if (this.doc && this.awareness) return;

		const { doc, checkpointSeq, lastSeq, snapshotVersion } = await loadDocument(
			this.name,
			this.env,
		);
        this.checkpointSeq = checkpointSeq;
        this.lastSeq = lastSeq;
        this.snapshotVersion = snapshotVersion;

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
                const sender = origin as Connection | null;
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

        doc.on("update", (update: Uint8Array, origin: unknown) => {
			const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeUpdate(encoder, update);
            const bytes = encoding.toUint8Array(encoder);
            this.broadcastToTag("presence", bytes, (origin as Connection | null)?.id);

			void this.persistUpdate(update);

			if (redisEnabled()) {
                void redisPublish(this.name, {
                    type: "y-update",
                    room: this.name,
                    update: Buffer.from(update).toString("base64"),
                });
            }

            this.scheduleSnapshot();
        });

        this.doc = doc;
        this.awareness = awareness;
    }

    private async persistUpdate(update: Uint8Array) {
        try {
            const nextSeq = ++this.lastSeq;
            await db
                .insert(canvasUpdates)
                .values({
                    canvasId: this.name,
                    seq: nextSeq,
                    update: encodeStoredUpdate(update),
                })
                .onConflictDoNothing();
            await db
                .update(canvases)
                .set({ lastSeq: nextSeq, updatedAt: new Date() })
                .where(eq(canvases.id, this.name));
        } catch (e) {
            console.error("[EditorServer] persistUpdate failed", e);
        }
    }

    private scheduleSnapshot(delayMs = SNAPSHOT_DEBOUNCE_MS) {
        if (this.snapshotTimer) {
            clearTimeout(this.snapshotTimer);
        }
        this.pendingSnapshot = true;
        this.snapshotTimer = setTimeout(() => {
            void this.snapshotNow();
        }, delayMs);
    }

    private async snapshotNow() {
        if (this.snapshotTimer) {
            clearTimeout(this.snapshotTimer);
            this.snapshotTimer = null;
        }
        if (!this.pendingSnapshot || !this.doc) return;
        this.pendingSnapshot = false;

        const seq = this.lastSeq;
        const version = this.snapshotVersion + 1;
        const snapshot = Y.encodeStateAsUpdate(this.doc);

		try {
			const result = await putSnapshot(this.name, version, snapshot, this.env);
			if (!result.enabled) return;

			if (!result.verified) {
                console.warn("[snapshot] S3 verify failed, not checkpointing");
                return;
            }

            await db.execute(sql`
                WITH checkpoint AS (
                    UPDATE ${canvases}
                    SET
                        ${sql.identifier(canvases.checkpointSeq.name)} = ${seq},
                        ${sql.identifier(canvases.snapshotVersion.name)} = ${version},
                        ${sql.identifier(canvases.snapshotKey.name)} = ${result.key},
                        ${sql.identifier(canvases.snapshotAt.name)} = NOW(),
                        ${sql.identifier(canvases.updatedAt.name)} = NOW(),
                        ${sql.identifier(canvases.lastSeq.name)} = ${seq}
                    WHERE ${canvases.id} = ${this.name}
                    RETURNING ${canvases.id}
                ), record_snapshot AS (
                    INSERT INTO ${canvasSnapshots} (
                        ${sql.identifier(canvasSnapshots.canvasId.name)},
                        ${sql.identifier(canvasSnapshots.version.name)},
                        ${sql.identifier(canvasSnapshots.s3Key.name)},
                        ${sql.identifier(canvasSnapshots.checkpointSeq.name)},
                        ${sql.identifier(canvasSnapshots.sizeBytes.name)}
                    )
                    SELECT
                        ${sql.identifier("checkpoint")}.${sql.identifier(canvases.id.name)},
                        ${version},
                        ${result.key},
                        ${seq},
                        ${snapshot.byteLength}
                    FROM checkpoint
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM ${canvasSnapshots}
                        WHERE ${canvasSnapshots.canvasId} =
                            ${sql.identifier("checkpoint")}.${sql.identifier(canvases.id.name)}
                            AND ${canvasSnapshots.version} = ${version}
                    )
                    ON CONFLICT DO NOTHING
                )
                DELETE FROM ${canvasUpdates}
                WHERE ${canvasUpdates.canvasId} = ${this.name}
                    AND ${canvasUpdates.seq} <= ${seq}
                    AND ${seq > this.checkpointSeq}
                    AND EXISTS (SELECT 1 FROM checkpoint)
            `);
            this.checkpointSeq = seq;
            this.snapshotVersion = version;

			try {
                const rows = await db
                    .select()
                    .from(canvasSnapshots)
                    .where(eq(canvasSnapshots.canvasId, this.name))
                    .orderBy(sql`${canvasSnapshots.version} DESC`)
                    .limit(SNAPSHOT_RETENTION + 10);
                const old = rows.slice(SNAPSHOT_RETENTION);
                for (const r of old) {
                    await db.delete(canvasSnapshots).where(eq(canvasSnapshots.id, r.id));
					if (s3Enabled(this.env)) await s3DeleteObject(r.s3Key, this.env);
                }
            } catch {}
        } catch (e) {
            console.error("[snapshot] failed", e);
        }
    }

    private handleYjsMessage(conn: Connection, bytes: Uint8Array) {
        const doc = this.doc;
        const awareness = this.awareness;
        if (!doc || !awareness) return;
        const decoder = decoding.createDecoder(bytes);
        const encoder = encoding.createEncoder();
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
            case messageSync: {
                encoding.writeVarUint(encoder, messageSync);
                syncProtocol.readSyncMessage(decoder, encoder, doc, conn);
                if (encoding.length(encoder) > 1) conn.send(encoding.toUint8Array(encoder));
                break;
            }
            case messageAwareness: {
                const update = decoding.readVarUint8Array(decoder);
                try {
                    awarenessProtocol.applyAwarenessUpdate(awareness, update, conn);
                } catch (e) {
                    if (!isTruncatedUpdate(e)) throw e;
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
        }
    }
}
