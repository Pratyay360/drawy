import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "./supabase-browser";

const GLOBAL_CHANNEL = "drawy:canvases";

export interface ScenePayload {
    elements: readonly ExcalidrawElement[];
}

export function mergeElements(
    local: readonly ExcalidrawElement[],
    remote: readonly ExcalidrawElement[] | null | undefined,
): ExcalidrawElement[] {
    if (!remote || remote.length === 0) return [...local];
    const byId = new Map<string, ExcalidrawElement>();
    for (const el of local) byId.set(el.id, el);
    for (const r of remote) {
        const existing = byId.get(r.id);
        const rv = r.version ?? 0;
        // SAFETY: existing?.version ?? 0 always produces a number.
        const lv = (existing?.version ?? 0) as number;
        if (!existing || rv >= lv) byId.set(r.id, r);
    }
    return [...byId.values()];
}

type SceneCb = (payload: ScenePayload) => void;
type SavedCb = () => void;
type PresenceCb = (count: number) => void;

export class CanvasRealtime {
    private client = getSupabaseBrowserClient();
    private channel: RealtimeChannel | null = null;
    private readonly canvasId: string;
    private sceneCbs = new Set<SceneCb>();
    private savedCbs = new Set<SavedCb>();
    private presenceCbs = new Set<PresenceCb>();
    private sceneTimer: ReturnType<typeof setTimeout> | null = null;
    private pendingScene: ScenePayload | null = null;

    constructor(canvasId: string) {
        this.canvasId = canvasId;
    }

    connect() {
        if (!this.client || this.channel) return;

        const channel = this.client.channel(`drawy:canvas:${this.canvasId}`, {
            config: {
                broadcast: { self: false },
                presence: { key: `client-${Math.random().toString(36).slice(2)}` },
            },
        });

        channel.on("broadcast", { event: "scene" }, ({ payload }) => {
            // SAFETY: broadcast payload conforms to ScenePayload contract.
            this.sceneCbs.forEach((fn) => fn(payload as ScenePayload));
        });
        channel.on("broadcast", { event: "saved" }, () => {
            this.savedCbs.forEach((fn) => fn());
        });
        channel.on("presence", { event: "sync" }, () => {
            const state = channel.presenceState();
            const count = Object.keys(state).length;
            this.presenceCbs.forEach((fn) => fn(count));
        });

        channel.subscribe((status) => {
            if (status === "SUBSCRIBED") {
                void channel.track({ at: Date.now() });
            }
        });

        this.channel = channel;
    }

    broadcastScene(elements: readonly ExcalidrawElement[]) {
        if (!this.channel) return;
        this.pendingScene = { elements };
        if (this.sceneTimer) return;
        this.sceneTimer = setTimeout(() => {
            this.sceneTimer = null;
            const payload = this.pendingScene;
            this.pendingScene = null;
            if (payload && this.channel) {
                void this.channel.send({ type: "broadcast", event: "scene", payload });
            }
        }, 250);
    }

    broadcastSaved() {
        if (!this.channel) return;
        void this.channel.send({ type: "broadcast", event: "saved", payload: {} });
    }

    onScene(cb: SceneCb): () => void {
        this.sceneCbs.add(cb);
        return () => {
            this.sceneCbs.delete(cb);
        };
    }

    onSaved(cb: SavedCb): () => void {
        this.savedCbs.add(cb);
        return () => {
            this.savedCbs.delete(cb);
        };
    }

    onPresence(cb: PresenceCb): () => void {
        this.presenceCbs.add(cb);
        if (this.channel) {
            const state = this.channel.presenceState();
            cb(Object.keys(state).length);
        }
        return () => {
            this.presenceCbs.delete(cb);
        };
    }

    disconnect() {
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
            this.sceneTimer = null;
        }
        if (this.channel) {
            void this.channel.unsubscribe();
            this.channel = null;
        }
        this.sceneCbs.clear();
        this.savedCbs.clear();
        this.presenceCbs.clear();
    }
}

let globalChannel: RealtimeChannel | null = null;
const globalListeners = new Set<() => void>();

function ensureGlobalChannel(): RealtimeChannel | null {
    const client = getSupabaseBrowserClient();
    if (!client) return null;
    if (globalChannel) return globalChannel;

    const channel = client.channel(GLOBAL_CHANNEL, {
        config: { broadcast: { self: false } },
    });
    channel.on("broadcast", { event: "list-changed" }, () => {
        globalListeners.forEach((fn) => fn());
    });
    channel.subscribe();
    globalChannel = channel;
    return channel;
}

/** Tell other clients (and the workspace/sidebar) that the canvas list changed. */
export function publishCanvasListChanged() {
    const channel = ensureGlobalChannel();
    if (channel) {
        void channel.send({
            type: "broadcast",
            event: "list-changed",
            payload: {},
        });
    }
}

/** Subscribe to canvas-list changes coming from other users. */
export function subscribeCanvasListChanged(cb: () => void): () => void {
    ensureGlobalChannel();
    globalListeners.add(cb);
    return () => {
        globalListeners.delete(cb);
    };
}