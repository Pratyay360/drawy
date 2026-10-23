import { useCallback, useEffect, useState } from "react";
import type { Awareness } from "y-protocols/awareness";
import { useRealtimeCursorStore } from "#/stores/realtime-cursor";
import { useThrottleCallback } from "./use-throttle-callback";

export type CursorEventPayload = {
    position: { x: number; y: number };
    user: { id: string; name: string };
    color: string;
    timestamp: number;
};

type CursorState = {
    cursor?: CursorEventPayload;
    user?: { name?: string; color?: string };
};

/**
 * Publishes the local pointer position through Yjs awareness and mirrors the
 * other connected users' cursors into the realtime cursor store. Peers
 * without a cursor field (connected, not yet moved) are simply not shown —
 * presence counts come from `CanvasRealtime.onPresence`.
 */
export const useRealtimeCursors = ({
    username,
    throttleMs,
    awareness,
}: {
    username: string;
    throttleMs: number;
    awareness?: Awareness;
}) => {
    const [color] = useState(() => `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`);
    const [userId] = useState(
        () => globalThis.crypto?.randomUUID?.() ?? `client-${Math.random().toString(36).slice(2)}`,
    );
    const setCursors = useRealtimeCursorStore((s) => s.setCursors);
    const cursors = useRealtimeCursorStore((s) => s.cursors);

    const callback = useCallback(
        (event: MouseEvent) => {
            if (!awareness) return;
            const payload: CursorEventPayload = {
                position: { x: event.clientX, y: event.clientY },
                user: { id: userId, name: username },
                color,
                timestamp: Date.now(),
            };
            awareness.setLocalStateField("cursor", payload);
        },
        [color, userId, username, awareness],
    );

    const handleMouseMove = useThrottleCallback(callback, throttleMs);

    useEffect(() => {
        if (!awareness) return;
        const handler = () => {
            const states = awareness.getStates();
            const next: Record<string, CursorEventPayload> = {};
            states.forEach((state, clientId) => {
                if (clientId === awareness.clientID) return;
                const cursor = (state as CursorState).cursor;
                if (cursor) next[cursor.user.id] = cursor;
            });
            setCursors(next);
        };
        handler();
        awareness.on("change", handler);
        return () => {
            awareness.off("change", handler);
            // Drop this user's cursor so peers clean it up promptly on unmount.
            awareness.setLocalStateField("cursor", null);
        };
    }, [awareness, setCursors]);

    useEffect(() => {
        if (!awareness) return;
        addEventListener("mousemove", handleMouseMove);
        return () => removeEventListener("mousemove", handleMouseMove);
    }, [awareness, handleMouseMove]);

    return { cursors };
};