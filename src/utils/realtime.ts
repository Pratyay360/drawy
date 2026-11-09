const REALTIME_CHANNEL = "canvas-updated";
const BROADCAST_CHANNEL = "drawy-canvas-updates";
/** Fired when the scene was replaced server-side (version restore). */
export const CANVAS_SCENE_REPLACED_EVENT = "canvas-scene-replaced";

export function publishCanvasEvent(opts?: { sceneReplaced?: boolean }) {
    dispatchEvent(new Event(REALTIME_CHANNEL));
    if (opts?.sceneReplaced) dispatchEvent(new Event(CANVAS_SCENE_REPLACED_EVENT));
    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.postMessage({
        type: REALTIME_CHANNEL,
        sceneReplaced: opts?.sceneReplaced === true,
    });
    channel.close();
}

export function subscribeCanvasEvents(cb: () => void): () => void {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    const handler = (event: MessageEvent) => {
        if (event.data?.type !== REALTIME_CHANNEL) return;
        // A restore in another tab replaced the scene — reload it here too.
        if (event.data.sceneReplaced) dispatchEvent(new Event(CANVAS_SCENE_REPLACED_EVENT));
        cb();
    };

    channel.addEventListener("message", handler);
    return () => {
        channel.removeEventListener("message", handler);
        channel.close();
    };
}