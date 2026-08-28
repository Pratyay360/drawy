import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useCanvasStore } from "#/stores/canvas";
import {
	loadCanvas,
	sanitizeExcalidrawAppState,
	saveCanvas,
} from "../../services/canvases";
import { getUserLibrary } from "../../services/libraries";
import { pruneUnusedFiles } from "../../utils/assets";
import {
	CanvasRealtime,
	mergeElements,
	type ScenePayload,
} from "../../utils/canvas-realtime";
import { subscribeCanvasEvents } from "../../utils/realtime";
import {
	areAppStatesEqual,
	areElementsEqual,
	getPersistentAppState,
} from "./utils";

interface UseCanvasLifecycleOptions {
	id: string;
}

export function useCanvasLifecycle({ id }: UseCanvasLifecycleOptions) {
	const navigate = useNavigate();

	const canvasData = useCanvasStore((s) => s.canvasData);
	const loading = useCanvasStore((s) => s.loading);
	const isChangingCanvas = useCanvasStore((s) => s.isChangingCanvas);
	const elements = useCanvasStore((s) => s.elements);
	const appState = useCanvasStore((s) => s.appState);
	const excalidrawAPI = useCanvasStore((s) => s.excalidrawAPI);
	const excalidrawModule = useCanvasStore((s) => s.excalidrawModule);
	const saveStatus = useCanvasStore((s) => s.saveStatus);
	const collaborators = useCanvasStore((s) => s.collaborators);
	const username = useCanvasStore((s) => s.username);
	const {
		setCanvasData,
		setLoading,
		setIsChangingCanvas,
		setElements,
		setAppState,
		setExcalidrawAPI,
		setExcalidrawModule,
		setSaveStatus,
		setCollaborators,
		reset: resetCanvas,
	} = useCanvasStore.getState();

	const filesRef = useRef<BinaryFiles>({});
	const initialLibraryItemsRef = useRef<Promise<
		import("@excalidraw/excalidraw/types").LibraryItems
	> | null>(null);
	if (!initialLibraryItemsRef.current) {
		initialLibraryItemsRef.current = getUserLibrary();
	}
	const isSavingRef = useRef(false);
	const realtimeRef = useRef<CanvasRealtime | null>(null);
	const applyingRemoteRef = useRef(false);
	const lastLocalEditRef = useRef(0);
	const lastSavedData = useRef<{
		elements: { id: string; version: number }[];
		appState: Partial<import("@excalidraw/excalidraw/types").AppState>;
	}>({
		elements: [],
		appState: {},
	});

	useEffect(() => {
		if (typeof window === "undefined") return;
		let cancelled = false;
		(async () => {
			try {
				const mod = await import("@excalidraw/excalidraw");
				await import("@excalidraw/excalidraw/index.css");
				if (!cancelled) setExcalidrawModule(mod);
			} catch (err) {
				console.error("Failed to load Excalidraw:", err);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [setExcalidrawModule]);

	// --- Fetch canvas ---
	const fetchCanvas = useCallback(
		async (canvasId: string, isInitialMount: boolean) => {
			if (isInitialMount) {
				setLoading(true);
			} else {
				setIsChangingCanvas(true);
			}

			try {
				const data = await loadCanvas(canvasId);
				if (data) {
					const sanitizedAppState = sanitizeExcalidrawAppState(data.appState);
					const resolvedElements = data.elements || [];
					const resolvedFiles = data.files || {};

					filesRef.current = resolvedFiles;
					setCanvasData({
						...data,
						appState: sanitizedAppState,
						files: resolvedFiles,
					});
					setElements(resolvedElements);
					setAppState(sanitizedAppState);

					lastSavedData.current = {
						elements: resolvedElements.map((e) => ({
							id: e.id,
							version: e.version,
						})),
						appState: getPersistentAppState(sanitizedAppState),
					};

					if (excalidrawAPI) {
						if (resolvedFiles && Object.keys(resolvedFiles).length > 0) {
							excalidrawAPI.addFiles(Object.values(resolvedFiles));
						}
						// SAFETY: sanitizedAppState is Partial<AppState> produced by sanitizeExcalidrawAppState.
						excalidrawAPI.updateScene({
							elements: resolvedElements,
							appState: {
								...sanitizedAppState,
							} as import("@excalidraw/excalidraw/types").AppState,
						});
					}
				} else {
					void navigate({ to: "/" });
				}
			} catch (error) {
				console.error("Failed to load canvas:", error);
			} finally {
				if (isInitialMount) {
					setLoading(false);
				} else {
					setIsChangingCanvas(false);
				}
			}
		},
		[
			excalidrawAPI,
			navigate,
			setCanvasData,
			setElements,
			setAppState,
			setLoading,
			setIsChangingCanvas,
		],
	);

	useEffect(() => {
		if (!id) return;
		setSaveStatus("saved");
		const isInitialMount = !excalidrawAPI;
		void fetchCanvas(id, isInitialMount);
	}, [id, excalidrawAPI, fetchCanvas, setSaveStatus]);

	// --- Subscribe to canvas events ---
	useEffect(() => {
		const refreshCanvas = () => {
			if (!id) return;
			void fetchCanvas(id, false);
		};

		addEventListener("canvas-updated", refreshCanvas);
		const unsubscribe = subscribeCanvasEvents(refreshCanvas);
		return () => {
			removeEventListener("canvas-updated", refreshCanvas);
			unsubscribe();
		};
	}, [id, fetchCanvas]);

	// --- Realtime sync ---
	useEffect(() => {
		if (!id || !excalidrawAPI) return;
		const rt = new CanvasRealtime(id);
		realtimeRef.current = rt;
		rt.connect();

		const offScene = rt.onScene((payload: ScenePayload) => {
			const api = excalidrawAPI;
			if (!api) return;
			if (payload.files && Object.keys(payload.files).length > 0) {
				filesRef.current = { ...filesRef.current, ...payload.files };
				api.addFiles(Object.values(payload.files));
			}
			const local = api.getSceneElements();
			const merged = mergeElements(local, payload.elements);
			applyingRemoteRef.current = true;
			lastSavedData.current = {
				elements: merged.map((e) => ({ id: e.id, version: e.version })),
				appState: lastSavedData.current.appState,
			};
			api.updateScene({ elements: merged });
			applyingRemoteRef.current = false;
		});

		const offSaved = rt.onSaved(() => {
			if (!id) return;
			// Don't clobber the local user's in-progress edits.
			if (Date.now() - lastLocalEditRef.current < 4000) return;
			void fetchCanvas(id, false);
		});

		const offPresence = rt.onPresence((count) => setCollaborators(count));

		return () => {
			offScene();
			offSaved();
			offPresence();
			rt.disconnect();
			realtimeRef.current = null;
		};
	}, [id, excalidrawAPI, fetchCanvas, setCollaborators]);

	// --- Auto-save ---
	useEffect(() => {
		if (loading || isChangingCanvas || !id || saveStatus !== "unsaved") return;

		const timer = setTimeout(async () => {
			setSaveStatus("saving");
			isSavingRef.current = true;
			try {
				const prunedFiles = pruneUnusedFiles(filesRef.current, elements);
				filesRef.current = prunedFiles;
				await saveCanvas(id, elements, appState, prunedFiles);
				setSaveStatus("saved");
				realtimeRef.current?.broadcastSaved();
			} catch (error) {
				console.error("Failed to auto-save canvas:", error);
				setSaveStatus("unsaved");
			} finally {
				isSavingRef.current = false;
			}
		}, 1500);

		return () => clearTimeout(timer);
	}, [
		elements,
		appState,
		id,
		loading,
		isChangingCanvas,
		saveStatus,
		setSaveStatus,
	]);

	// --- Reset store state on unmount ---
	useEffect(() => {
		return () => {
			resetCanvas();
		};
	}, [resetCanvas]);

	return {
		// State
		canvasData,
		loading,
		isChangingCanvas,
		elements,
		appState,
		excalidrawAPI,
		excalidrawModule,
		saveStatus,
		collaborators,
		username,
		// Refs
		filesRef,
		initialLibraryItemsRef,
		isSavingRef,
		realtimeRef,
		applyingRemoteRef,
		lastLocalEditRef,
		lastSavedData,
		// Setters
		setCanvasData,
		setElements,
		setAppState,
		setExcalidrawAPI,
		setSaveStatus,
		setIsEditingTitle: useCanvasStore.getState().setIsEditingTitle,
		setTitleInput: useCanvasStore.getState().setTitleInput,
		// Functions
		fetchCanvas,
	};
}
