import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "#/stores/canvas";
import { loadCanvas, sanitizeExcalidrawAppState, saveCanvas } from "../../services/canvases";
import { getUserLibrary } from "../../services/libraries";
import { pruneUnusedFiles } from "../../utils/assets/pruning";
import { CanvasRealtime, mergeElements, type ScenePayload } from "../../utils/canvas-realtime";
import { CANVAS_SCENE_REPLACED_EVENT, subscribeCanvasEvents } from "../../utils/realtime";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(
            () => reject(new Error(`${label} timed out after ${ms}ms — slow network`)),
            ms,
        );
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

interface UseCanvasLifecycleOptions {
    id: string;
}

const AUTO_SAVE_DELAY_MS = 1500;
const AUTO_SAVE_MAX_RETRY_DELAY_MS = 30000;

export function useCanvasLifecycle({ id }: UseCanvasLifecycleOptions) {
    const navigate = useNavigate();

    const canvasData = useCanvasStore((s) => s.canvasData);
    const loading = useCanvasStore((s) => s.loading);
    const loadError = useCanvasStore((s) => s.loadError);
    const isChangingCanvas = useCanvasStore((s) => s.isChangingCanvas);
    const elements = useCanvasStore((s) => s.elements);
    const appState = useCanvasStore((s) => s.appState);
    const excalidrawAPI = useCanvasStore((s) => s.excalidrawAPI);
    const excalidrawModule = useCanvasStore((s) => s.excalidrawModule);
    const moduleError = useCanvasStore((s) => s.moduleError);
    const saveStatus = useCanvasStore((s) => s.saveStatus);
    const collaborators = useCanvasStore((s) => s.collaborators);
    const username = useCanvasStore((s) => s.username);
    const {
        setCanvasData,
        setLoading,
        setLoadError,
        setIsChangingCanvas,
        setElements,
        setAppState,
        setExcalidrawAPI,
        setExcalidrawModule,
        setModuleError,
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
    const autoSaveFailuresRef = useRef(0);
    const realtimeRef = useRef<CanvasRealtime | null>(null);
    const [awareness, setAwareness] = useState<
        import("y-protocols/awareness").Awareness | undefined
    >(undefined);
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
                setModuleError(null);
				// Excalidraw needs a longer timeout than metadata requests.
                const mod = await withTimeout(
                    import("@excalidraw/excalidraw"),
                    30000,
                    "Loading editor",
                );
                await import("@excalidraw/excalidraw/index.css");
                if (!cancelled) {
                    setExcalidrawModule(mod);
                    setModuleError(null);
                }
            } catch (err) {
                console.error("Failed to load Excalidraw:", err);
                if (!cancelled) {
                    setModuleError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load editor — slow network, please retry",
                    );
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [setExcalidrawModule, setModuleError]);

	const fetchSeqRef = useRef(0);
	const fetchCanvas = useCallback(
		async (canvasId: string, mode: "load" | "refresh") => {
			// Refresh only metadata; replacing the Yjs scene can erase edits made
			// while the HTTP request is in flight.
			const applyScene = mode === "load";
            if (applyScene) {
                setLoadError(null);
            } else if (useCanvasStore.getState().loadError) {
				// Only an explicit retry may clear a visible load error.
				return;
            }

            const seq = ++fetchSeqRef.current;
            const isInitialMount = applyScene && !excalidrawAPI;
            if (applyScene) {
                if (isInitialMount) setLoading(true);
                else setIsChangingCanvas(true);
            }

            try {
				// The RPC link owns the timeout so retries cannot overlap a live request.
				const data = await loadCanvas(canvasId);
                if (seq !== fetchSeqRef.current) return;
                if (data) {
                    const sanitizedAppState = sanitizeExcalidrawAppState(data.appState);
                    const resolvedElements = data.elements || [];
                    const resolvedFiles = data.files || {};

                    setCanvasData({
                        ...data,
                        appState: sanitizedAppState,
                        files: resolvedFiles,
                    });
                    setLoadError(null);

                    if (!applyScene) {
						// Local uploads in flight take precedence over the server copy.
                        const missing = Object.entries(resolvedFiles).filter(
                            ([fileId]) => !filesRef.current[fileId],
                        );
                        filesRef.current = { ...resolvedFiles, ...filesRef.current };
                        if (excalidrawAPI && missing.length > 0) {
                            excalidrawAPI.addFiles(missing.map(([, file]) => file));
                        }
                        return;
                    }

                    filesRef.current = resolvedFiles;
                    setElements(resolvedElements);
                    setAppState(sanitizedAppState);

                    lastSavedData.current = {
                        elements: resolvedElements.map((e) => ({
                            id: e.id,
                            version: e.version,
                        })),
						appState: sanitizeExcalidrawAppState(sanitizedAppState),
                    };

                    if (excalidrawAPI) {
                        if (resolvedFiles && Object.keys(resolvedFiles).length > 0) {
                            excalidrawAPI.addFiles(Object.values(resolvedFiles));
                        }
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
                if (seq !== fetchSeqRef.current) return;
                console.error("Failed to load canvas:", error);
				// A failed metadata refresh does not invalidate the visible scene.
                if (applyScene) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load canvas — check network and retry",
                    );
                }
            } finally {
				// Stale requests must not change the current loading state.
                if (seq === fetchSeqRef.current && applyScene) {
                    if (isInitialMount) {
                        setLoading(false);
                    } else {
                        setIsChangingCanvas(false);
                    }
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
            setLoadError,
            setIsChangingCanvas,
        ],
    );

    useEffect(() => {
        if (!id) return;
        setSaveStatus("saved");
        void fetchCanvas(id, "load");
    }, [id, fetchCanvas, setSaveStatus]);

	useEffect(() => {
        const refreshCanvas = () => {
            if (!id) return;
			// Ignore the event echoed by our own in-flight save.
            if (isSavingRef.current) return;
            void fetchCanvas(id, "refresh");
        };
		// A version restore replaces the scene and requires a full reload.
        const reloadScene = () => {
            if (!id) return;
            void fetchCanvas(id, "load");
        };

        addEventListener("canvas-updated", refreshCanvas);
        addEventListener(CANVAS_SCENE_REPLACED_EVENT, reloadScene);
        const unsubscribe = subscribeCanvasEvents(refreshCanvas);
        return () => {
            removeEventListener("canvas-updated", refreshCanvas);
            removeEventListener(CANVAS_SCENE_REPLACED_EVENT, reloadScene);
            unsubscribe();
        };
    }, [id, fetchCanvas]);

	useEffect(() => {
        if (!id || !excalidrawAPI) return;
        const rt = new CanvasRealtime(id, username || "Anonymous");
        realtimeRef.current = rt;
        rt.connect();
        setAwareness(rt.getAwareness());


		// Read directly to avoid reconnecting whenever the scene changes.
		const initialElements = useCanvasStore.getState().elements;
		if (initialElements.length > 0) rt.pushLocalScene(initialElements);

        const offScene = rt.onScene((payload: ScenePayload) => {
            const api = excalidrawAPI;
            if (!api) return;
            if (payload.files && Object.keys(payload.files).length > 0) {
                filesRef.current = { ...filesRef.current, ...payload.files };
                api.addFiles(Object.values(payload.files));
            }
            const local = api.getSceneElements();
            const merged = mergeElements(local, payload.elements);
            if (merged.length === 0) return;
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
            if (Date.now() - lastLocalEditRef.current < 4000) return;
			void fetchCanvas(id, "refresh");
        });

        const offPresence = rt.onPresence((count) => setCollaborators(count));

        return () => {
            offScene();
            offSaved();
            offPresence();
            rt.disconnect();
            realtimeRef.current = null;
            setAwareness(undefined);
        };
    }, [id, excalidrawAPI, fetchCanvas, setCollaborators, username]);

	useEffect(() => {
        if (loading || isChangingCanvas || !id || saveStatus !== "unsaved") return;

        let cancelled = false;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const schedule = (delay: number) => {
            if (cancelled) return;
            timer = setTimeout(runSave, delay);
        };

        const runSave = async () => {
            if (cancelled) return;
			// Avoid overlapping full-scene uploads.
            if (isSavingRef.current) {
                schedule(1000);
                return;
            }
            const editAtStart = lastLocalEditRef.current;
            setSaveStatus("saving");
            isSavingRef.current = true;
            try {
                const { elements: currentElements, appState: currentAppState } =
                    useCanvasStore.getState();
                const prunedFiles = pruneUnusedFiles(filesRef.current, currentElements);
                filesRef.current = prunedFiles;
                await saveCanvas(id, currentElements, currentAppState, prunedFiles);
                realtimeRef.current?.broadcastSaved();
				autoSaveFailuresRef.current = 0;
				// Edits made during this save remain dirty. A cancelled effect may
				// update the status only while no newer save has claimed it.
                if (!cancelled || useCanvasStore.getState().saveStatus === "saving") {
                    setSaveStatus(lastLocalEditRef.current > editAtStart ? "unsaved" : "saved");
                }
            } catch (error) {
                console.error("Failed to auto-save canvas:", error);
				autoSaveFailuresRef.current = Math.min(autoSaveFailuresRef.current + 1, 5);
				// Failed saves remain dirty and are rescheduled.
                if (!cancelled || useCanvasStore.getState().saveStatus === "saving") {
                    setSaveStatus("unsaved");
                }
            } finally {
                isSavingRef.current = false;
            }
        };

        const retryDelay = Math.min(
            AUTO_SAVE_DELAY_MS * 2 ** autoSaveFailuresRef.current,
            AUTO_SAVE_MAX_RETRY_DELAY_MS,
        );
        schedule(retryDelay);

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [id, loading, isChangingCanvas, saveStatus, setSaveStatus]);

	useEffect(() => {
		if (saveStatus === "saved") autoSaveFailuresRef.current = 0;
	}, [saveStatus]);

	useEffect(() => {
        return () => {
            resetCanvas();
        };
    }, [resetCanvas]);

	return {
		awareness,
		canvasData,
        loading,
        loadError,
        isChangingCanvas,
        elements,
        appState,
        excalidrawAPI,
        excalidrawModule,
        moduleError,
        saveStatus,
		collaborators,
		username,
		filesRef,
        initialLibraryItemsRef,
        isSavingRef,
        realtimeRef,
        applyingRemoteRef,
		lastLocalEditRef,
		lastSavedData,
		setCanvasData,
		setExcalidrawAPI,
		fetchCanvas,
	};
}
