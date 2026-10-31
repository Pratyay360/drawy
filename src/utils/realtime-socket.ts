/** A small reconnecting WebSocket for the realtime rooms.
 *
 * Replaces `partysocket` now that /parties/* is served directly by the
 * app's own Durable Objects: it builds the room URL, queues sends while the
 * socket is not open yet and reconnects with capped exponential backoff. */

const MIN_RETRY_DELAY_MS = 250;
const MAX_RETRY_DELAY_MS = 10_000;
const CONNECT_TIMEOUT_MS = 5_000;
/** A connection that stayed open this long resets the retry budget. */
const STABLE_CONNECTION_MS = 5_000;

/** Local/private hosts talk plain ws:// in development; everything else goes
 * through wss://. */
function isLocalHost(host: string): boolean {
    return (
        host.startsWith("localhost:") ||
        host.startsWith("127.0.0.1:") ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        (host.startsWith("172.") &&
            Number(host.split(".")[1]) >= 16 &&
            Number(host.split(".")[1]) <= 31) ||
        host.startsWith("[::ffff:7f00:1]:")
    );
}

/** Connection id sent as `_pk`, stable across reconnects of one socket;
 * the rooms use it only for tracing. */
function connectionId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface RoomUrlOptions {
    /** Host (and optional port) of the worker, with or without a protocol. */
    host: string;
    /** Party namespace: `main` for editor rooms, `rooms` for occupancy. */
    party: string;
    room: string;
    query?: Record<string, string | undefined>;
}

/** Build `wss://host/parties/:party/:room?...` for one room connection. */
export function buildRoomUrl({ host, party, room, query }: RoomUrlOptions): string {
    let cleanHost = host.replace(/^(http|https|ws|wss):\/\//, "");
    if (cleanHost.endsWith("/")) cleanHost = cleanHost.slice(0, -1);
    const protocol = isLocalHost(cleanHost) ? "ws" : "wss";
    const params = new URLSearchParams([["_pk", connectionId()]]);
    for (const [key, value] of Object.entries(query ?? {})) {
        if (value !== null && value !== undefined) params.append(key, value);
    }
    return `${protocol}://${cleanHost}/parties/${party}/${room}?${params.toString()}`;
}

export class RealtimeSocket {
    /** Fires every time the underlying socket opens, reconnects included. */
    onopen: (() => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    /** Fires when an open connection drops, before the reconnect starts. */
    onclose: (() => void) | null = null;

    readonly url: string;

    private ws: WebSocket | null = null;
    private closed = false;
    private retryCount = 0;
    private retryTimer: ReturnType<typeof setTimeout> | null = null;
    private connectTimer: ReturnType<typeof setTimeout> | null = null;
    private openedAt = 0;
    private queue: (string | ArrayBuffer | ArrayBufferView)[] = [];

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    get readyState(): number {
        if (this.ws) return this.ws.readyState;
        return this.closed ? WebSocket.CLOSED : WebSocket.CONNECTING;
    }

    /** Send immediately when open, otherwise queue until the socket opens. */
    send(data: string | ArrayBuffer | ArrayBufferView): void {
        if (this.closed) return;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(data);
            return;
        }
        this.queue.push(data);
    }

    /** Permanently close: no reconnect, queued messages are dropped. */
    close(): void {
        this.closed = true;
        this.clearTimers();
        const ws = this.ws;
        this.ws = null;
        this.queue = [];
        if (ws) {
            try {
                ws.close(1000, "client closed");
            } catch {
                // Already closed.
            }
        }
    }

    private connect(): void {
        if (this.closed) return;
        let ws: WebSocket;
        try {
            ws = new WebSocket(this.url);
        } catch {
            this.scheduleReconnect();
            return;
        }
        ws.binaryType = "arraybuffer";
        this.ws = ws;

        this.connectTimer = setTimeout(() => {
            // A socket stuck in CONNECTING counts as a failed attempt; the
            // close event that follows routes through handleDrop.
            if (this.ws === ws && ws.readyState === WebSocket.CONNECTING) {
                try {
                    ws.close();
                } catch {
                    // handleDrop still runs from the close event.
                }
            }
        }, CONNECT_TIMEOUT_MS);

        ws.addEventListener("open", () => {
            if (this.ws !== ws) return;
            this.clearConnectTimer();
            this.openedAt = Date.now();
            const queued = this.queue;
            this.queue = [];
            for (const data of queued) ws.send(data);
            this.onopen?.();
        });
        ws.addEventListener("message", (event: MessageEvent) => {
            if (this.ws === ws) this.onmessage?.(event);
        });
        ws.addEventListener("close", () => this.handleDrop(ws));
        ws.addEventListener("error", () => {
            // The close event that follows does the reconnect bookkeeping.
        });
    }

    private handleDrop(ws: WebSocket): void {
        if (this.ws !== ws) return;
        this.ws = null;
        this.clearConnectTimer();
        if (this.closed) return;
        if (this.openedAt !== 0 && Date.now() - this.openedAt >= STABLE_CONNECTION_MS) {
            this.retryCount = 0;
        }
        this.onclose?.();
        this.scheduleReconnect();
    }

    private scheduleReconnect(): void {
        if (this.closed || this.retryTimer) return;
        const delay = Math.min(MIN_RETRY_DELAY_MS * 2 ** this.retryCount, MAX_RETRY_DELAY_MS);
        this.retryCount += 1;
        this.retryTimer = setTimeout(() => {
            this.retryTimer = null;
            this.connect();
        }, delay);
    }

    private clearConnectTimer(): void {
        if (this.connectTimer) clearTimeout(this.connectTimer);
        this.connectTimer = null;
    }

    private clearTimers(): void {
        this.clearConnectTimer();
        if (this.retryTimer) clearTimeout(this.retryTimer);
        this.retryTimer = null;
    }
}
