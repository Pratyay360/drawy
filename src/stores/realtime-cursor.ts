import { create } from "zustand";
import type { CursorEventPayload } from "../hooks/realtime-cursor-react";

interface RealtimeCursorState {
    /** Map of peer client id -> latest cursor position/presence. */
    cursors: Record<string, CursorEventPayload>;

    setCursors: (
        value:
            | Record<string, CursorEventPayload>
            | ((prev: Record<string, CursorEventPayload>) => Record<string, CursorEventPayload>),
    ) => void;
    reset: () => void;
}

const initialState = {
    cursors: {} as Record<string, CursorEventPayload>,
};

export const useRealtimeCursorStore = create<RealtimeCursorState>((set) => ({
    ...initialState,

    setCursors: (value) =>
        set((state) => ({
            cursors: typeof value === "function" ? value(state.cursors) : value,
        })),
    reset: () => set({ ...initialState }),
}));