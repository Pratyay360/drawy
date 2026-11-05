import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import PartySocket from "partysocket";
import YProvider from "y-partyserver/provider";
import * as Y from "yjs";
import { SINGLETON_ROOM_ID } from "../party/room-id";
import { applyElementsToDoc, hydrateElements } from "./yjs-binding";

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_URL;

function getPartykitHost(): string | undefined {
  return PARTYKIT_HOST || (typeof window !== "undefined" ? window.location.host : undefined);
}

function pickPresenceColor(): string {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
}

export interface ScenePayload {
  elements: readonly ExcalidrawElement[];
  files?: BinaryFiles;
}

export function mergeElements(
  local: readonly ExcalidrawElement[],
  remote: readonly ExcalidrawElement[],
): ExcalidrawElement[] {
  if (!remote || remote.length === 0) return [...local];
  const byId = new Map<string, ExcalidrawElement>();
  for (const el of local) byId.set(el.id, el);
  for (const r of remote) {
    const existing = byId.get(r.id);
    if (!existing || (r.version ?? 0) >= (existing.version ?? 0)) byId.set(r.id, r);
  }
  return [...byId.values()];
}

type SceneCb = (payload: ScenePayload) => void;
type SavedCb = () => void;
type PresenceCb = (count: number) => void;

export class CanvasRealtime {
  private socket: PartySocket | undefined;
  private ydoc: Y.Doc | undefined;
  private provider: YProvider | undefined;
  private presenceSocket: PartySocket | undefined;
  private sceneCbs = new Set<SceneCb>();
  private savedCbs = new Set<SavedCb>();
  private presenceCbs = new Set<PresenceCb>();
  private lastRooms: Record<string, number> = {};
  private sceneTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingScene: ScenePayload | null = null;
  private teardownAwareness: (() => void) | null = null;
  private readonly presenceColor = pickPresenceColor();

  constructor(
    private readonly canvasId: string,
    private readonly username: string = "Anonymous",
  ) {}

  connect() {
    if (this.socket) return;
    const host = getPartykitHost();
    if (!host) return;
    const socket = new PartySocket({
      host,
      party: "main",
      room: this.canvasId,
      query: { kind: "scene" },
    });
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "scene") this.sceneCbs.forEach((fn) => fn(data?.payload));
        else if (data.type === "saved") this.savedCbs.forEach((fn) => fn());
      } catch {}
    };
    this.socket = socket;

    // Yjs doc is the source of truth for scene content — JSON broadcast stays legacy fallback.
    const ydoc = new Y.Doc();
    const provider = new YProvider(host, this.canvasId, ydoc, {
      party: "main",
      params: { kind: "presence" },
    });
    const awareness = provider.awareness;
    awareness.setLocalStateField("user", {
      name: this.username,
      color: this.presenceColor,
    });

    const onAwareness = () => {
      const count = awareness.getStates().size;
      this.presenceCbs.forEach((fn) => fn(count));
    };
    awareness.on("change", onAwareness);
    const initialTimer = setTimeout(onAwareness, 300);
    this.teardownAwareness = () => {
      clearTimeout(initialTimer);
      awareness.off("change", onAwareness);
    };

    // Remote Yjs updates -> Excalidraw
    const onYUpdate = () => {
      const els = hydrateElements(ydoc);
      if (els.length === 0) return;
      this.sceneCbs.forEach((fn) => fn({ elements: els }));
    };
    ydoc.on("update", onYUpdate);
    this.teardownAwareness = () => {
      clearTimeout(initialTimer);
      awareness.off("change", onAwareness);
      ydoc.off("update", onYUpdate);
    };

    this.ydoc = ydoc;
    this.provider = provider;

    const pSocket = new PartySocket({
      host,
      party: "rooms",
      room: SINGLETON_ROOM_ID,
    });
    pSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "rooms" && data.rooms) {
          this.lastRooms = data.rooms;
          if (awareness.getStates().size <= 1) {
            const count = data.rooms[this.canvasId] ?? 0;
            this.presenceCbs.forEach((fn) => fn(count));
          }
        }
      } catch {}
    };
    this.presenceSocket = pSocket;
  }

  getYDoc() { return this.ydoc; }
  getAwareness() { return this.provider?.awareness; }

  pushLocalScene(elements: readonly ExcalidrawElement[]) {
    if (!this.ydoc) return;
    applyElementsToDoc(this.ydoc, elements, "local");
  }

  broadcastScene(elements: readonly ExcalidrawElement[], files?: BinaryFiles) {
    // Yjs is primary now; keep JSON broadcast as no-op to avoid double-send.
    // If Y.Doc missing, fall back to legacy.
    if (this.ydoc) { this.pushLocalScene(elements); return; }
    if (!this.socket) return;
    this.pendingScene = { elements, files: files && Object.keys(files).length > 0 ? files : undefined };
    if (this.sceneTimer) return;
    this.sceneTimer = setTimeout(() => {
      this.sceneTimer = null;
      const payload = this.pendingScene; this.pendingScene = null;
      if (payload && this.socket) this.socket.send(JSON.stringify({ type: "scene", payload }));
    }, 250);
  }

  broadcastSaved() { if (this.socket) this.socket.send(JSON.stringify({ type: "saved", payload: {} })); }

  triggerSnapshot() { if (this.socket) this.socket.send(JSON.stringify({ type: "snapshot" })); }

  onScene(cb: SceneCb): () => void { this.sceneCbs.add(cb); return () => this.sceneCbs.delete(cb); }
  onSaved(cb: SavedCb): () => void { this.savedCbs.add(cb); return () => this.savedCbs.delete(cb); }
  onPresence(cb: PresenceCb): () => void {
    this.presenceCbs.add(cb);
    const cnt = this.provider?.awareness.getStates().size;
    if (cnt !== undefined && cnt > 0) cb(cnt);
    else if (Object.keys(this.lastRooms).length > 0) cb(this.lastRooms[this.canvasId] ?? 0);
    return () => this.presenceCbs.delete(cb);
  }

  disconnect() {
    if (this.sceneTimer) { clearTimeout(this.sceneTimer); this.sceneTimer = null; }
    this.teardownAwareness?.(); this.teardownAwareness = null;
    this.socket?.close(); this.socket = undefined;
    this.provider?.destroy(); this.ydoc?.destroy();
    this.presenceSocket?.close();
    this.ydoc = undefined; this.provider = undefined; this.presenceSocket = undefined;
    this.sceneCbs.clear(); this.savedCbs.clear(); this.presenceCbs.clear();
  }
}

let globalSocket: PartySocket | null = null;
const globalListeners = new Set<() => void>();
const pendingGlobalMessages: string[] = [];

function ensureGlobalSocket(): PartySocket | null {
  if (typeof window === "undefined") return null;
  if (globalSocket) return globalSocket;
  const host = getPartykitHost();
  if (!host) return null;
  const socket = new PartySocket({ host, party: "rooms", room: SINGLETON_ROOM_ID });
  socket.onmessage = (event) => {
    try { const data = JSON.parse(event.data); if (data.type === "canvas-list-changed") globalListeners.forEach((fn) => fn()); } catch {}
  };
  socket.onopen = () => { let next: string | undefined; while ((next = pendingGlobalMessages.shift()) !== undefined) socket.send(next); };
  globalSocket = socket;
  return socket;
}

export function publishCanvasListChanged() {
  const socket = ensureGlobalSocket();
  const msg = JSON.stringify({ type: "canvas-list-changed" });
  if (socket?.readyState === WebSocket.OPEN) socket.send(msg); else pendingGlobalMessages.push(msg);
}

export function subscribeCanvasListChanged(cb: () => void): () => void {
  ensureGlobalSocket(); globalListeners.add(cb); return () => globalListeners.delete(cb);
}
