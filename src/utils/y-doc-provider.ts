import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import type * as Y from "yjs";
import { RealtimeSocket } from "./realtime-socket";

const messageSync = 0;
const messageAwareness = 1;
const messageQueryAwareness = 3;

/** A minimal Yjs provider for the app's own realtime rooms.
 *
 * Replaces `y-partyserver`'s YProvider: it speaks the same wire protocol the
 * EditorServer understands (y-websocket style sync + awareness messages) over
 * a plain reconnecting WebSocket, and mirrors the old provider's behaviour:
 * sync step 1 and a local awareness announcement on open, remote awareness
 * states dropped on disconnect, frames sent only while connected (a
 * reconnect performs a full resync instead of replaying stale frames). */
export class YDocProvider {
    readonly awareness: awarenessProtocol.Awareness;

    private socket: RealtimeSocket | null = null;

    constructor(
        private readonly url: string,
        private readonly doc: Y.Doc,
        options: { connect?: boolean } = {},
    ) {
        this.awareness = new awarenessProtocol.Awareness(doc);
        // The server is the source of truth for liveness: it withdraws a
        // peer's awareness state when its socket closes, so the local
        // outdated-timeout sweep is not needed (and would leak an interval
        // past destroy()).
        clearInterval(
            (this.awareness as unknown as { _checkInterval?: ReturnType<typeof setInterval> })
                ._checkInterval,
        );

        this.doc.on("update", this.handleDocUpdate);
        this.awareness.on("update", this.handleAwarenessUpdate);

        if (options.connect !== false) this.connect();
    }

    connect(): void {
        if (this.socket) return;
        const socket = new RealtimeSocket(this.url);

        socket.onopen = () => {
            // Ask the room for everything we are missing...
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeSyncStep1(encoder, this.doc);
            socket.send(encoding.toUint8Array(encoder));

            // ...and announce our own awareness state, which may have been
            // set before the connection was open or changed while offline.
            if (this.awareness.getLocalState() !== null) {
                const awarenessEncoder = encoding.createEncoder();
                encoding.writeVarUint(awarenessEncoder, messageAwareness);
                encoding.writeVarUint8Array(
                    awarenessEncoder,
                    awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
                        this.doc.clientID,
                    ]),
                );
                socket.send(encoding.toUint8Array(awarenessEncoder));
            }
        };
        socket.onmessage = (event) => this.handleMessage(event.data);
        // Remote peers vanish with their connection; the server does the
        // same on its side when the socket closes.
        socket.onclose = () => this.dropRemoteAwareness();

        this.socket = socket;
    }

    destroy(): void {
        this.doc.off("update", this.handleDocUpdate);
        this.awareness.off("update", this.handleAwarenessUpdate);
        const socket = this.socket;
        this.socket = null;
        socket?.close();
    }

    private send(bytes: Uint8Array): void {
        // Unlike the JSON sockets, Yjs frames are dropped while disconnected
        // instead of queued: the sync handshake on reconnect covers the gap.
        if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(bytes);
    }

    private handleMessage(data: unknown): void {
        // Strings on this socket would be y-partyserver's `__YPS:` custom
        // messages, which this app never sends.
        if (typeof data === "string") return;
        if (!(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data)) return;
        const bytes =
            data instanceof ArrayBuffer
                ? new Uint8Array(data)
                : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

        const decoder = decoding.createDecoder(bytes);
        const encoder = encoding.createEncoder();
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
            case messageSync: {
                encoding.writeVarUint(encoder, messageSync);
                // Handles sync step 1 (replies with missing state), step 2 and
                // updates (applies them; `handleDocUpdate` skips echoing back
                // updates that came from the server).
                syncProtocol.readSyncMessage(decoder, encoder, this.doc, this);
                if (encoding.length(encoder) > 1) this.send(encoding.toUint8Array(encoder));
                break;
            }
            case messageAwareness:
                awarenessProtocol.applyAwarenessUpdate(
                    this.awareness,
                    decoding.readVarUint8Array(decoder),
                    this,
                );
                break;
            case messageQueryAwareness: {
                const states = Array.from(this.awareness.getStates().keys());
                if (states.length === 0) break;
                encoding.writeVarUint(encoder, messageAwareness);
                encoding.writeVarUint8Array(
                    encoder,
                    awarenessProtocol.encodeAwarenessUpdate(this.awareness, states),
                );
                this.send(encoding.toUint8Array(encoder));
                break;
            }
        }
    }

    private dropRemoteAwareness(): void {
        const remote = Array.from(this.awareness.getStates().keys()).filter(
            (id) => id !== this.doc.clientID,
        );
        if (remote.length === 0) return;
        awarenessProtocol.removeAwarenessStates(this.awareness, remote, this);
        for (const id of remote) this.awareness.meta.delete(id);
    }

    private readonly handleDocUpdate = (update: Uint8Array, origin: unknown) => {
        if (origin === this) return;
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.writeUpdate(encoder, update);
        this.send(encoding.toUint8Array(encoder));
    };

    private readonly handleAwarenessUpdate = ({
        added,
        updated,
        removed,
    }: {
        added: number[];
        updated: number[];
        removed: number[];
    }): void => {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageAwareness);
        encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
                ...added,
                ...updated,
                ...removed,
            ]),
        );
        this.send(encoding.toUint8Array(encoder));
    };
}
