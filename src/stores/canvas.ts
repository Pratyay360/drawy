import type * as ExcalidrawModule from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { create } from "zustand";
import type { CanvasData } from "#/services/canvases";

export type SaveStatus = "saved" | "unsaved" | "saving";

interface CanvasState {
	canvasData: CanvasData | null;
	loading: boolean;
	loadError: string | null;
	isChangingCanvas: boolean;
	elements: ExcalidrawElement[];
	appState: Partial<AppState>;
	excalidrawAPI: ExcalidrawImperativeAPI | null;
	excalidrawModule: typeof ExcalidrawModule | null;
	moduleError: string | null;
	saveStatus: SaveStatus;
	collaborators: number;
    isEditingTitle: boolean;
    titleInput: string;
    username: string;

    setCanvasData: (data: CanvasData | null) => void;
    setLoading: (loading: boolean) => void;
    setLoadError: (error: string | null) => void;
    setIsChangingCanvas: (changing: boolean) => void;
    setElements: (elements: ExcalidrawElement[]) => void;
    setAppState: (appState: Partial<AppState>) => void;
    setExcalidrawAPI: (api: ExcalidrawImperativeAPI | null) => void;
    setExcalidrawModule: (mod: typeof ExcalidrawModule | null) => void;
    setModuleError: (error: string | null) => void;
    setSaveStatus: (status: SaveStatus) => void;
    setCollaborators: (count: number) => void;
    setIsEditingTitle: (editing: boolean) => void;
    setTitleInput: (title: string) => void;
    setUsername: (username: string) => void;
	reset: () => void;
}

const initialState = {
    canvasData: null as CanvasData | null,
    loading: true,
    loadError: null as string | null,
    isChangingCanvas: false,
    elements: [] as ExcalidrawElement[],
    appState: {} as Partial<AppState>,
    excalidrawAPI: null as ExcalidrawImperativeAPI | null,
    excalidrawModule: null as typeof ExcalidrawModule | null,
    moduleError: null as string | null,
    saveStatus: "saved" as SaveStatus,
    collaborators: 0,
    isEditingTitle: false,
    titleInput: "",
    username: "",
};

export const useCanvasStore = create<CanvasState>((set) => ({
    ...initialState,

    setCanvasData: (canvasData) => set({ canvasData }),
    setLoading: (loading) => set({ loading }),
    setLoadError: (loadError) => set({ loadError }),
    setIsChangingCanvas: (isChangingCanvas) => set({ isChangingCanvas }),
    setElements: (elements) => set({ elements }),
    setAppState: (appState) => set({ appState }),
    setExcalidrawAPI: (excalidrawAPI) => set({ excalidrawAPI }),
    setExcalidrawModule: (excalidrawModule) => set({ excalidrawModule }),
    setModuleError: (moduleError) => set({ moduleError }),
    setSaveStatus: (saveStatus) => set({ saveStatus }),
    setCollaborators: (collaborators) => set({ collaborators }),
    setIsEditingTitle: (isEditingTitle) => set({ isEditingTitle }),
    setTitleInput: (titleInput) => set({ titleInput }),
    setUsername: (username) => set({ username }),
    reset: () => set({ ...initialState }),
}));
