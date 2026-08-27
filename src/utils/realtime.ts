const REALTIME_CHANNEL = "canvas-updated";
const BROADCAST_CHANNEL = "drawy-canvas-updates";

export function publishCanvasEvent() {
	dispatchEvent(new Event(REALTIME_CHANNEL));
	const channel = new BroadcastChannel(BROADCAST_CHANNEL);
	channel.postMessage({ type: REALTIME_CHANNEL });
	channel.close();
}

export function subscribeCanvasEvents(cb: () => void): () => void {
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
