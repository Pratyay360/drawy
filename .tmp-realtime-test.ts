/* Temporary end-to-end test for the /parties/* Durable Objects.
 * Run: bun .tmp-realtime-test.ts  (requires `wrangler dev` on :8787)
 * Deleted after use. */
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";

const HOST = "127.0.0.1:8787";
const BASE = `http://${HOST}`;

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
    if (!ok) failures++;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function waitFor(cond: () => boolean, timeout = 4000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (cond()) return true;
        await sleep(30);
    }
    return cond();
}

function roomUrl(party: string, room: string, kind?: string): string {
    const u = new URL(`${BASE}/parties/${party}/${room}`);
    u.searchParams.set("_pk", crypto.randomUUID());
    if (kind) u.searchParams.set("kind", kind);
    return u.toString().replace(/^http/, "ws");
}

class S {
    ws: WebSocket;
    msgs: (string | ArrayBuffer)[] = [];
    ready: Promise<void>;
    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";
        this.ready = new Promise<void>((resolve, reject) => {
            this.ws.addEventListener("open", () => resolve());
            this.ws.addEventListener("error", () => reject(new Error(`ws error ${url}`)));
        });
        this.ready.catch(() => {});
        this.ws.addEventListener("message", (e: MessageEvent) => {
            this.msgs.push(e.data as string | ArrayBuffer);
        });
    }
    send(data: string | Uint8Array) {
        this.ws.send(data);
    }
    strings(): string[] {
        return this.msgs.filter((m): m is string => typeof m === "string");
    }
    binaries(): Uint8Array[] {
        return this.msgs.filter((m): m is ArrayBuffer => !(typeof m === "string")).map((m) => new Uint8Array(m as ArrayBuffer));
    }
    parsed(): unknown[] {
        return this.strings().map((s) => {
            try {
                return JSON.parse(s);
            } catch {
                return { unparseable: s };
            }
        });
    }
    close() {
        try {
            this.ws.close();
        } catch {
            /* already gone */
        }
    }
}

function applySyncFrame(doc: Y.Doc, bytes: Uint8Array): number {
    const decoder = decoding.createDecoder(bytes);
    const type = decoding.readVarUint(decoder);
    if (type !== 0) return -1;
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, 0);
    syncProtocol.readSyncMessage(decoder, encoder, doc, "test");
    return 0;
}

function hasJson(msgs: unknown[], pred: (m: any) => boolean): boolean {
    return msgs.some((m) => typeof m === "object" && m !== null && pred(m));
}

const sockets: S[] = [];
function open(party: string, room: string, kind?: string): Promise<S> {
    const s = new S(roomUrl(party, room, kind));
    sockets.push(s);
    return s.ready.then(() => s);
}

async function main() {
    /* ---- HTTP routing (worker entry) ---- */
    const r1 = await fetch(`${BASE}/parties/nope/x`);
    check("unknown party → 400", r1.status === 400, String(r1.status));
    const r2 = await fetch(`${BASE}/parties/main/t1`);
    check("editor DO without upgrade → 405", r2.status === 405, String(r2.status));
    const r3 = await fetch(`${BASE}/`, { redirect: "manual" });
    check("non-/parties falls through to Nitro", [200, 301, 302, 307, 308].includes(r3.status), String(r3.status));

    /* ---- T1: scene JSON broadcast, sender + presence excluded ---- */
    const a = await open("main", "t1", "scene");
    const b = await open("main", "t1", "scene");
    const c = await open("main", "t1", "presence");
    check("T1 presence socket got handshake", await waitFor(() => c.binaries().length >= 1));
    a.send(JSON.stringify({ type: "scene", n: 1 }));
    check("T1 scene message relayed to other scene socket", await waitFor(() => b.strings().some((s) => s.includes('"n":1'))));
    a.send(JSON.stringify({ event: "realtime-cursor-move", x: 9 }));
    check("T1 cursor event relayed", await waitFor(() => b.strings().some((s) => s.includes("realtime-cursor-move"))));
    await sleep(400);
    check("T1 sender excluded from its own broadcast", a.strings().length === 0, `${a.strings().length} msgs`);
    check("T1 presence socket got no scene JSON", c.strings().length === 0, `${c.strings().length} msgs`);
    a.close();
    b.close();
    c.close();

    /* ---- T2: Yjs doc update relay between presence sockets ---- */
    const pA = await open("main", "t2", "presence");
    const pB = await open("main", "t2", "presence");
    check("T2 both presence sockets got handshake", await waitFor(() => pA.binaries().length >= 1 && pB.binaries().length >= 1));
    const before = pB.binaries().length;
    const doc = new Y.Doc();
    doc.getMap("t").set("k", "v");
    const enc = encoding.createEncoder();
    encoding.writeVarUint(enc, 0);
    syncProtocol.writeUpdate(enc, Y.encodeStateAsUpdate(doc));
    pA.send(encoding.toUint8Array(enc));
    check("T2 update relayed to other presence socket", await waitFor(() => pB.binaries().length > before));
    const received = new Y.Doc();
    const fresh = pB.binaries().slice(before);
    let applied = false;
    for (const frame of fresh) {
        try {
            if (applySyncFrame(received, frame) === 0 && received.getMap("t").get("k") === "v") applied = true;
        } catch {
            /* not this frame */
        }
    }
    check("T2 relayed update decodes to the sent value", applied);
    await sleep(400);
    check("T2 sender excluded from its own update relay", pA.binaries().length === 1, `${pA.binaries().length} frames`);
    pA.close();
    pB.close();

    /* ---- T3: awareness relay + withdrawal on disconnect ---- */
    const qA = await open("main", "t3", "presence");
    const qB = await open("main", "t3", "presence");
    check("T3 both presence sockets connected", await waitFor(() => qA.binaries().length >= 1 && qB.binaries().length >= 1));
    const aw = new awarenessProtocol.Awareness(new Y.Doc());
    aw.setLocalState({ cursor: { x: 5 } });
    const awFrame = encoding.createEncoder();
    encoding.writeVarUint(awFrame, 1);
    encoding.writeVarUint8Array(awFrame, awarenessProtocol.encodeAwarenessUpdate(aw, [aw.clientID]));
    const awBefore = qB.binaries().length;
    qA.send(encoding.toUint8Array(awFrame));
    const awB = new awarenessProtocol.Awareness(new Y.Doc());
    const gotAwareness = await waitFor(() => {
        for (const frame of qB.binaries().slice(awBefore)) {
            try {
                const dec = decoding.createDecoder(frame);
                if (decoding.readVarUint(dec) !== 1) continue;
                awarenessProtocol.applyAwarenessUpdate(awB, decoding.readVarUint8Array(dec), "test");
            } catch {
                /* not an awareness frame */
            }
        }
        return awB.states.get(aw.clientID)?.cursor?.x === 5;
    });
    check("T3 awareness state relayed", gotAwareness);
    qA.close();
    const withdrawn = await waitFor(() => !awB.states.has(aw.clientID));
    check("T3 awareness withdrawn when sender disconnects", withdrawn);
    qB.close();

    /* ---- T4: occupancy snapshots, POST reports, canvas-list-changed ---- */
    const rA = await open("rooms", "index");
    const rB = await open("rooms", "index");
    check(
        "T4 snapshot on connect",
        await waitFor(() => hasJson(rA.parsed(), (m) => m.type === "rooms") && hasJson(rB.parsed(), (m) => m.type === "rooms")),
    );
    const post = await fetch(`${BASE}/parties/rooms/index`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ room: "canvasA", count: 2 }),
    });
    check("T4 occupancy POST accepted", post.status === 200, String(post.status));
    check(
        "T4 report broadcast to connected watchers",
        await waitFor(() => hasJson(rA.parsed(), (m) => m.type === "rooms" && m.rooms?.canvasA === 2) && hasJson(rB.parsed(), (m) => m.type === "rooms" && m.rooms?.canvasA === 2)),
    );
    const rAClcCount = rA.parsed().length;
    const clcCount = rB.parsed().length;
    rA.send(JSON.stringify({ type: "canvas-list-changed", room: "canvasA" }));
    check(
        "T4 canvas-list-changed relayed to other watcher",
        await waitFor(() => rB.parsed().slice(clcCount).some((m: any) => m?.type === "canvas-list-changed")),
    );
    await sleep(400);
    check("T4 sender excluded from canvas-list-changed", !rA.parsed().slice(rAClcCount).some((m: any) => m?.type === "canvas-list-changed"));
    const r4RemoveIndex = rB.parsed().length;
    await fetch(`${BASE}/parties/rooms/index`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ room: "canvasA", count: 0 }),
    });
    check(
        "T4 count 0 removes the room",
        await waitFor(() => rB.parsed().slice(r4RemoveIndex).some((m: any) => m?.type === "rooms" && !("canvasA" in (m.rooms ?? {})))),
    );

    /* ---- T5: editor room reports occupancy to the singleton ---- */
    const e1 = await open("main", "occt", "presence");
    const e2 = await open("main", "occt", "presence");
    check("T5 presence sockets connected", await waitFor(() => e1.binaries().length >= 1 && e2.binaries().length >= 1));
    const rX = await open("rooms", "index");
    check("T5 watcher connected", await waitFor(() => rX.parsed().length >= 1));
    e1.close();
    check(
        "T5 disconnect reports remaining presence count",
        await waitFor(() => hasJson(rX.parsed(), (m) => m.type === "rooms" && m.rooms?.occt === 1)),
    );
    e2.close();
    const r5RemoveIndex = rX.parsed().length;
    check(
        "T5 last disconnect clears the room",
        await waitFor(() => rX.parsed().slice(r5RemoveIndex).some((m: any) => m?.type === "rooms" && !("occt" in (m.rooms ?? {})))),
    );

    for (const s of sockets) s.close();
    aw.destroy();
    awB.destroy();
    console.log(failures === 0 ? "\nALL PASSED" : `\n${failures} FAILURES`);
    process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
    console.error("FATAL", error);
    process.exit(1);
});
