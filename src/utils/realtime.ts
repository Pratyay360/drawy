const REALTIME_CHANNEL = "canvas-updated";
const BROADCAST_CHANNEL = "drawy-canvas-updates";

/**
 * Canvas updates are broadcast locally and across tabs so the sidebar and
 * open editors can refresh without relying on Supabase auth/realtime.
 */
export function publishCanvasEvent() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(REALTIME_CHANNEL));

    if (!("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.postMessage({ type: REALTIME_CHANNEL });
    channel.close();
}

/**
 * Subscribe to canvas update broadcasts for the current browser session.
 * Returns an unsubscribe function.
 */
export function subscribeCanvasEvents(cb: () => void): () => void {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
        return () => {};
    }

    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    const handler = (event: MessageEvent) => {
        if (event.data?.type === REALTIME_CHANNEL) cb();
    };

    channel.addEventListener("message", handler);
    return () => {
        channel.removeEventListener("message", handler);
        channel.close();
    };
}