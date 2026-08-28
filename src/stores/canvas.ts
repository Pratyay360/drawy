import type * as ExcalidrawModule from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type {
	AppState,
	ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";
import { create } from "zustand";
import type { CanvasData } from "#/services/canvases";

export type SaveStatus = "saved" | "unsaved" | "saving";

interface CanvasState {
	/** Persisted canvas metadata + last loaded scene. */
	canvasData: CanvasData | null;
	/** Initial load in progress (full-screen loading shell). */
	loading: boolean;
	/** Switching to a different canvas without a remount. */
	isChangingCanvas: boolean;
	/** Current scene elements (React-facing copy; files live in a ref). */
	elements: ExcalidrawElement[];
	/** Persisted app-state slice (view bg, grid/zen/view modes). */
	appState: Partial<AppState>;
	/** Imperative Excalidraw API instance. */
	excalidrawAPI: ExcalidrawImperativeAPI | null;
	/** The dynamically imported Excalidraw module (Excalidraw + export helpers). */
	excalidrawModule: typeof ExcalidrawModule | null;
	saveStatus: SaveStatus;
	/** Number of other people present in the realtime room. */
	collaborators: number;
	isEditingTitle: boolean;
	titleInput: string;
	username: string;

	setCanvasData: (data: CanvasData | null) => void;
	setLoading: (loading: boolean) => void;
	setIsChangingCanvas: (changing: boolean) => void;
	setElements: (elements: ExcalidrawElement[]) => void;
	setAppState: (appState: Partial<AppState>) => void;
	setExcalidrawAPI: (api: ExcalidrawImperativeAPI | null) => void;
	setExcalidrawModule: (mod: typeof ExcalidrawModule) => void;
	setSaveStatus: (status: SaveStatus) => void;
	setCollaborators: (count: number) => void;
	setIsEditingTitle: (editing: boolean) => void;
	setTitleInput: (title: string) => void;
	setUsername: (username: string) => void;
	/** Reset all canvas state (used on editor unmount). */
	reset: () => void;
}

const initialState = {
	canvasData: null as CanvasData | null,
	loading: true,
	isChangingCanvas: false,
	elements: [] as ExcalidrawElement[],
	appState: {} as Partial<AppState>,
	excalidrawAPI: null as ExcalidrawImperativeAPI | null,
	excalidrawModule: null as typeof ExcalidrawModule | null,
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
	setIsChangingCanvas: (isChangingCanvas) => set({ isChangingCanvas }),
	setElements: (elements) => set({ elements }),
	setAppState: (appState) => set({ appState }),
	setExcalidrawAPI: (excalidrawAPI) => set({ excalidrawAPI }),
	setExcalidrawModule: (excalidrawModule) => set({ excalidrawModule }),
	setSaveStatus: (saveStatus) => set({ saveStatus }),
	setCollaborators: (collaborators) => set({ collaborators }),
	setIsEditingTitle: (isEditingTitle) => set({ isEditingTitle }),
	setTitleInput: (titleInput) => set({ titleInput }),
	setUsername: (username) => set({ username }),
	reset: () => set({ ...initialState }),
}));
