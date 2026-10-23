import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { useCallback } from "react";
import { useCanvasStore } from "#/stores/canvas";
import { saveCanvas, uploadCanvasAsset } from "../../services/canvases";
import { pruneUnusedFiles, uploadPendingAssets } from "../../utils/assets";
import { areAppStatesEqual, areElementsEqual, getPersistentAppState } from "./utils";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

interface UseCanvasHandlersOptions {
    id: string;
    filesRef: React.RefObject<BinaryFiles>;
    excalidrawAPI: import("@excalidraw/excalidraw/types").ExcalidrawImperativeAPI | null;
    isSavingRef: React.RefObject<boolean>;
    realtimeRef: React.RefObject<import("../../utils/canvas-realtime").CanvasRealtime | null>;
    applyingRemoteRef: React.RefObject<boolean>;
    lastLocalEditRef: React.RefObject<number>;
    lastSavedData: React.RefObject<{
        elements: { id: string; version: number }[];
        appState: Partial<AppState>;
    }>;
}

export function useCanvasHandlers({
    id,
    filesRef,
    excalidrawAPI,
    isSavingRef,
    realtimeRef,
    applyingRemoteRef,
    lastLocalEditRef,
    lastSavedData,
}: UseCanvasHandlersOptions) {
    const setElements = useCanvasStore((s) => s.setElements);
    const setAppState = useCanvasStore((s) => s.setAppState);
    const setSaveStatus = useCanvasStore((s) => s.setSaveStatus);

    const handleManualSave = useCallback(async () => {
        const {
            elements: currentElements,
            appState: currentAppState,
            saveStatus: currentStatus,
        } = useCanvasStore.getState();
        if (!id || isSavingRef.current || currentStatus !== "unsaved") return;

        setSaveStatus("saving");
        isSavingRef.current = true;
        try {
            const prunedFiles = pruneUnusedFiles(filesRef.current, currentElements);
            filesRef.current = prunedFiles;
            await withTimeout(
                saveCanvas(id, currentElements, currentAppState, prunedFiles),
                12000,
                "Saving canvas",
            );
            setSaveStatus("saved");
            realtimeRef.current?.broadcastSaved();
        } catch (error) {
            console.error("Failed to save canvas:", error);
            setSaveStatus("unsaved");
        } finally {
            isSavingRef.current = false;
        }
    }, [id, setSaveStatus, isSavingRef, filesRef, realtimeRef]);

    const broadcastScene = useCallback(
        (
            excalidrawElements: readonly import("@excalidraw/excalidraw/element/types").OrderedExcalidrawElement[],
            files?: BinaryFiles,
        ) => {
            realtimeRef.current?.broadcastScene(excalidrawElements, files);
        },
        [realtimeRef],
    );

    const handleExcalidrawChange = useCallback(
        (
            excalidrawElements: readonly import("@excalidraw/excalidraw/element/types").OrderedExcalidrawElement[],
            excalidrawAppState: AppState,
            newFiles: BinaryFiles,
        ) => {
            const {
                loading: currentLoading,
                isChangingCanvas: currentChanging,
                excalidrawAPI: api,
            } = useCanvasStore.getState();
            if (currentLoading || currentChanging) return;

            let filesChanged = false;
            let currentFiles = filesRef.current;

            if (newFiles && Object.keys(newFiles).length > 0) {
                currentFiles = { ...currentFiles, ...newFiles };
                filesRef.current = currentFiles;
                filesChanged = true;

                if (id) {
                    void uploadPendingAssets(id, currentFiles, uploadCanvasAsset).then(
                        ({ updatedFiles, hasNewUploads }) => {
                            if (hasNewUploads) {
                                // Merge with current state to avoid overwriting files
                                // that were added between the snapshot and upload completion.
                                filesRef.current = {
                                    ...filesRef.current,
                                    ...updatedFiles,
                                };
                                if (api) {
                                    api.addFiles(Object.values(updatedFiles));
                                }
                            }
                        },
                    );
                }
            }

            const currentElementsSig = excalidrawElements.map((e) => ({
                id: e.id,
                version: e.version,
            }));
            const currentPersistentState = getPersistentAppState(excalidrawAppState);

            const savedElementsSig = lastSavedData.current?.elements || [];
            const savedPersistentState = lastSavedData.current?.appState || {};

            const elementsChanged = !areElementsEqual(currentElementsSig, savedElementsSig);
            const appStateChanged = !areAppStatesEqual(
                currentPersistentState,
                savedPersistentState,
            );

            if (!elementsChanged && !appStateChanged && !filesChanged) return;

            setElements([...excalidrawElements]);
            setAppState(currentPersistentState);
            if (applyingRemoteRef.current) {
                lastSavedData.current = {
                    elements: currentElementsSig,
                    appState: currentPersistentState,
                };
                return;
            }

            lastLocalEditRef.current = Date.now();
            setSaveStatus("unsaved");

            lastSavedData.current = {
                elements: currentElementsSig,
                appState: currentPersistentState,
            };

            if (elementsChanged || filesChanged) {
                broadcastScene(excalidrawElements, currentFiles);
            }
        },
        [
            id,
            broadcastScene,
            setElements,
            setAppState,
            setSaveStatus,
            filesRef,
            lastSavedData,
            lastLocalEditRef,
            applyingRemoteRef,
        ],
    );

    const handleExportToJSON = useCallback(() => {
        const { canvasData, elements, appState } = useCanvasStore.getState();
        if (!canvasData) return;
        const exportData = {
            type: "excalidraw",
            version: 2,
            elements: elements,
            appState: appState,
            files: filesRef.current,
        };
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${canvasData.title || "untitled"}.excalidraw`;
        link.click();
        URL.revokeObjectURL(url);
    }, [filesRef]);

    const handleImportFromJSON = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json,.excalidraw";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    // SAFETY: FileReader onload result is always a string when readAsText is used.
                    const imported = JSON.parse(event.target?.result as string);
                    if (imported && Array.isArray(imported.elements)) {
                        if (excalidrawAPI) {
                            const importedAppState = getPersistentAppState(imported.appState || {});
                            if (imported.files) {
                                filesRef.current = {
                                    ...filesRef.current,
                                    ...imported.files,
                                };
                                excalidrawAPI.addFiles(Object.values(imported.files));
                            }
                            excalidrawAPI.updateScene({
                                elements: imported.elements,
                                appState: {
                                    ...importedAppState,
                                } as AppState,
                            });

                            setElements(imported.elements);
                            setAppState(importedAppState);
                            setSaveStatus("unsaved");
                        }
                    } else {
                        alert("Invalid Excalidraw file structure.");
                    }
                } catch (err) {
                    console.error("Failed to parse imported file:", err);
                    alert("Failed to parse the imported file.");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }, [excalidrawAPI, setElements, setAppState, setSaveStatus, filesRef]);

    const handleExportToPNG = useCallback(async () => {
        if (!excalidrawAPI) return;
        const { canvasData } = useCanvasStore.getState();
        if (!canvasData) return;
        try {
            const currentElements = excalidrawAPI.getSceneElements();
            const currentAppState = excalidrawAPI.getAppState();
            const excalidrawModule = useCanvasStore.getState().excalidrawModule;
            const blob = await excalidrawModule?.exportToBlob?.({
                elements: currentElements,
                appState: currentAppState,
                files: filesRef.current,
                mimeType: "image/png",
                exportPadding: 15,
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${canvasData.title || "drawing"}.png`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export PNG:", error);
        }
    }, [excalidrawAPI, filesRef]);

    const handleExportToSVG = useCallback(async () => {
        if (!excalidrawAPI) return;
        const { canvasData } = useCanvasStore.getState();
        if (!canvasData) return;
        try {
            const currentElements = excalidrawAPI.getSceneElements();
            const currentAppState = excalidrawAPI.getAppState();
            const excalidrawModule = useCanvasStore.getState().excalidrawModule;
            const svg = await excalidrawModule?.exportToSvg?.({
                elements: currentElements,
                appState: currentAppState,
                files: filesRef.current,
                exportPadding: 15,
            });
            const svgString = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgString], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${canvasData.title || "drawing"}.svg`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export SVG:", error);
        }
    }, [excalidrawAPI, filesRef]);

    return {
        handleManualSave,
        broadcastScene,
        handleExcalidrawChange,
        handleExportToJSON,
        handleImportFromJSON,
        handleExportToPNG,
        handleExportToSVG,
    };
}