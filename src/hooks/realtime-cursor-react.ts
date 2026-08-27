import {
	REALTIME_SUBSCRIBE_STATES,
	type RealtimeChannel,
} from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

import { useRealtimeCursorStore } from "#/stores/realtime-cursor";
import { createClient } from "../lib/supabase/client";

const useThrottleCallback = <Params extends unknown[], Return>(
	callback: (...args: Params) => Return,
	delay: number,
) => {
	const lastCall = useRef(0);
	const timeout = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		(...args: Params) => {
			const now = Date.now();
			const remainingTime = delay - (now - lastCall.current);

			if (remainingTime <= 0) {
				if (timeout.current) {
					clearTimeout(timeout.current);
					timeout.current = null;
				}
				lastCall.current = now;
				callback(...args);
			} else if (!timeout.current) {
				timeout.current = setTimeout(() => {
					lastCall.current = Date.now();
					timeout.current = null;
					callback(...args);
				}, remainingTime);
			}
		},
		[callback, delay],
	);
};

const supabase = createClient();

const generateRandomColor = () =>
	`hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;

const generateClientId = () => {
	const c = globalThis.crypto;
	if (c?.randomUUID) return c.randomUUID();
	return `client-${Math.random().toString(36).slice(2)}`;
};

const EVENT_NAME = "realtime-cursor-move";

export type CursorEventPayload = {
	position: {
		x: number;
		y: number;
	};
	user: {
		id: string;
		name: string;
	};
	color: string;
	timestamp: number;
};

export const useRealtimeCursors = ({
	roomName,
	username,
	throttleMs,
}: {
	roomName: string;
	username: string;
	throttleMs: number;
}) => {
	const [color] = useState(generateRandomColor());
	const [userId] = useState(generateClientId());
	const setCursors = useRealtimeCursorStore((s) => s.setCursors);
	const cursors = useRealtimeCursorStore((s) => s.cursors);
	const cursorPayload = useRef<CursorEventPayload>(null);

	const channelRef = useRef<RealtimeChannel>(null);

	const callback = useCallback(
		(event: MouseEvent) => {
			const { clientX, clientY } = event;

			const payload: CursorEventPayload = {
				position: {
					x: clientX,
					y: clientY,
				},
				user: {
					id: userId,
					name: username,
				},
				color: color,
				timestamp: Date.now(),
			};

			cursorPayload.current = payload;

			void channelRef.current?.send({
				type: "broadcast",
				event: EVENT_NAME,
				payload: payload,
			});
		},
		[color, userId, username],
	);

	const handleMouseMove = useThrottleCallback(callback, throttleMs);

	useEffect(() => {
		const channel = supabase.channel(roomName, {
			config: { presence: { key: userId } },
		});

		channel
			.on("presence", { event: "leave" }, ({ leftPresences }) => {
				leftPresences.forEach((element) => {
					setCursors((prev) => {
						if (prev[element.key]) {
							delete prev[element.key];
						}

						return { ...prev };
					});
				});
			})
			.on("presence", { event: "join" }, () => {
				if (!cursorPayload.current) return;
				void channelRef.current?.send({
					type: "broadcast",
					event: EVENT_NAME,
					payload: cursorPayload.current,
				});
			})
			.on(
				"broadcast",
				{ event: EVENT_NAME },
				(data: { payload: CursorEventPayload }) => {
					const { user } = data.payload;
					if (user.id === userId) return;
					setCursors((prev) => {
						if (prev[userId]) {
							delete prev[userId];
						}

						return {
							...prev,
							[user.id]: data.payload,
						};
					});
				},
			)
			.subscribe(async (status) => {
				if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
					await channel.track({ id: userId });
					channelRef.current = channel;
				} else {
					setCursors({});
					channelRef.current = null;
				}
			});

		return () => {
			void channel.unsubscribe();
			channelRef.current = null;
		};
	}, [roomName, userId, setCursors]);

	useEffect(() => {
		addEventListener("mousemove", handleMouseMove);
		return () => {
			removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	return { cursors };
};
