import { create } from "zustand";
import type { Canvas } from "#/services/canvases";

export interface DisplayUser {
    username: string;
}

const SIDEBAR_COLLAPSED_KEY = "drawy-sidebar-collapsed";

function readSidebarCollapsed(): boolean {
    if (import.meta.env.SSR) return false;
    try {
        return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
        return false;
    }
}

interface SidebarState {
    isCollapsed: boolean;
    canvases: Canvas[];
    isLoadingCanvases: boolean;
    canvasesError: string | null;
    isCreating: boolean;
    deletingId: string | null;
    user: DisplayUser | null;
    signingOut: boolean;

    setIsCollapsed: (collapsed: boolean) => void;
    setCanvases: (canvases: Canvas[]) => void;
    setIsLoadingCanvases: (loading: boolean) => void;
    setCanvasesError: (error: string | null) => void;
    setIsCreating: (creating: boolean) => void;
    setDeletingId: (id: string | null) => void;
    setUser: (user: DisplayUser | null) => void;
    setSigningOut: (signingOut: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isCollapsed: readSidebarCollapsed(),
    canvases: [],
    isLoadingCanvases: true,
    canvasesError: null,
    isCreating: false,
    deletingId: null,
    user: null,
    signingOut: false,

    setIsCollapsed: (isCollapsed) => {
        if (!import.meta.env.SSR) {
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
        }
        set({ isCollapsed });
    },
    setCanvases: (canvases) => set({ canvases }),
    setIsLoadingCanvases: (isLoadingCanvases) => set({ isLoadingCanvases }),
    setCanvasesError: (canvasesError) => set({ canvasesError }),
    setIsCreating: (isCreating) => set({ isCreating }),
    setDeletingId: (deletingId) => set({ deletingId }),
    setUser: (user) => set({ user }),
    setSigningOut: (signingOut) => set({ signingOut }),
}));