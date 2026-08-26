import "@excalidraw/excalidraw/index.css";
import { AppShell } from "@astryxdesign/core/AppShell";
import { AvatarGroup } from "@astryxdesign/core/AvatarGroup";
import { Button } from "@astryxdesign/core/Button";
import { Center } from "@astryxdesign/core/Center";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import {
    DefaultSidebar,
    Excalidraw,
    Sidebar as ExcalidrawSidebar,
    exportToBlob,
    exportToSvg,
    MainMenu,
    WelcomeScreen,
} from "@excalidraw/excalidraw";
import type {
    ExcalidrawElement,
    OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import type {
    AppState,
    BinaryFiles,
    ExcalidrawImperativeAPI,
    LibraryItem,
    LibraryItems,
} from "@excalidraw/excalidraw/types";
import { useNavigate } from "@tanstack/react-router";
import {
    ArrowLeft,
    Download,
    FileCode,
    Image,
    Loader2,
    Pencil,
    PenTool,
    Save,
    Shapes,
    Share2,
    Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usernameError } from "#/lib/username";
import { RealtimeCursors } from "@/components/realtime-cursors";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "../hooks/usetheme";
import {
    type CanvasData,
    loadCanvas,
    sanitizeExcalidrawAppState,
    saveCanvas,
    updateCanvasTitle,
} from "../services/canvases";
import { getUserLibrary, onLibraryItemsInstalled, setUserLibrary } from "../services/libraries";
import { CanvasRealtime, mergeElements, type ScenePayload } from "../utils/canvas-realtime";
import { subscribeCanvasEvents } from "../utils/realtime";
import { LibraryPanelTab } from "./library-panel-tab";
import { ShareCanvasModal } from "./share-canvas-modal";
import { Sidebar } from "./sidebar";

type ElementSignature = { id: string; version: number };

function areElementsEqual(a: ElementSignature[], b: ElementSignature[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id || a[i].version !== b[i].version) {
            return false;
        }
    }
    return true;
}

function areAppStatesEqual(a: Partial<AppState>, b: Partial<AppState>): boolean {
    return (
        a.gridSize === b.gridSize &&
        a.zenModeEnabled === b.zenModeEnabled &&
        a.gridModeEnabled === b.gridModeEnabled &&
        a.viewModeEnabled === b.viewModeEnabled
    );
}

function getPersistentAppState(appState: Partial<AppState>): Partial<AppState> {
    if (!appState || typeof appState !== "object") return {};
    return {
        viewBackgroundColor: appState.viewBackgroundColor,
        gridSize: appState.gridSize,
        zenModeEnabled: appState.zenModeEnabled,
        gridModeEnabled: appState.gridModeEnabled,
        viewModeEnabled: appState.viewModeEnabled,
    };
}

interface CanvasEditorProps {
    id: string;
}

export function CanvasEditor({ id }: CanvasEditorProps) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isChangingCanvas, setIsChangingCanvas] = useState(false);
    const [elements, setElements] = useState<ExcalidrawElement[]>([]);
    const [appState, setAppState] = useState<Partial<AppState>>({});
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const initialLibraryItemsRef = useRef<Promise<LibraryItems> | null>(null);
    // if (typeof window !== "undefined" && !initialLibraryItemsRef.current) {
    initialLibraryItemsRef.current = getUserLibrary();
    // }s

    const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
    const [collaborators, setCollaborators] = useState(0);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState("");
    const [isShareOpen, setIsShareOpen] = useState(false);

    const lastSavedData = useRef<{
        elements: ElementSignature[];
        appState: Partial<AppState>;
    }>({
        elements: [],
        appState: {},
    });

    const isSavingRef = useRef(false);
    const librarySaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingLibraryRef = useRef<LibraryItem[]>(null);
    const realtimeRef = useRef<CanvasRealtime | null>(null);
    const applyingRemoteRef = useRef(false);
    const lastLocalEditRef = useRef(0);
    const handleLibraryChange = useCallback((items: readonly LibraryItem[]) => {
        pendingLibraryRef.current = [...items];
        if (librarySaveTimerRef.current !== null) {
            globalThis.clearTimeout(librarySaveTimerRef.current);
        }
        librarySaveTimerRef.current = globalThis.setTimeout(() => {
            const toSave = pendingLibraryRef.current;
            pendingLibraryRef.current = null;
            if (toSave) void setUserLibrary(toSave);
        }, 300);
    }, []);

    useEffect(() => {
        return () => {
            if (librarySaveTimerRef.current !== null) {
                clearTimeout(librarySaveTimerRef.current);
                librarySaveTimerRef.current = null;
            }
            const toSave = pendingLibraryRef.current;
            pendingLibraryRef.current = null;
            if (toSave) void setUserLibrary(toSave);
        };
    }, []);

    // Libraries installed/refreshed from the library browser are merged into
    // the editor library (never replacing what's already there).
    useEffect(() => {
        if (!excalidrawAPI) return;
        return onLibraryItemsInstalled((items) => {
            void excalidrawAPI.updateLibrary({ libraryItems: items, merge: true });
        });
    }, [excalidrawAPI]);

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

                    setCanvasData({ ...data, appState: sanitizedAppState });
                    setElements(resolvedElements);
                    setAppState(sanitizedAppState);
                    setTitleInput(data.title);

                    lastSavedData.current = {
                        elements: resolvedElements.map((e) => ({
                            id: e.id,
                            version: e.version,
                        })),
                        appState: getPersistentAppState(sanitizedAppState),
                    };

                    if (excalidrawAPI) {
                        excalidrawAPI.updateScene({
                            elements: resolvedElements,
                            appState: {
                                ...sanitizedAppState,
                            } as AppState,
                        });
                    }
                } else {
                    // The drawing doesn't exist (deleted or bad link) — go home.
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
        [excalidrawAPI, navigate],
    );

    useEffect(() => {
        if (!id) return;
        setSaveStatus("saved");
        const isInitialMount = !excalidrawAPI;
        void fetchCanvas(id, isInitialMount);
    }, [id, excalidrawAPI, fetchCanvas]);

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

    useEffect(() => {
        if (!id || !excalidrawAPI) return;
        const rt = new CanvasRealtime(id);
        realtimeRef.current = rt;
        rt.connect();

        const offScene = rt.onScene((payload: ScenePayload) => {
            const api = excalidrawAPI;
            if (!api) return;
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
    }, [id, excalidrawAPI, fetchCanvas]);

    useEffect(() => {
        if (loading || isChangingCanvas || !id || saveStatus !== "unsaved") return;

        const timer = setTimeout(async () => {
            setSaveStatus("saving");
            isSavingRef.current = true;
            try {
                await saveCanvas(id, elements, appState);
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
    }, [elements, appState, id, loading, isChangingCanvas, saveStatus]);

    const handleManualSave = useCallback(async () => {
        if (!id || isSavingRef.current || saveStatus !== "unsaved") return;

        setSaveStatus("saving");
        isSavingRef.current = true;
        try {
            await saveCanvas(id, elements, appState);
            setSaveStatus("saved");
            realtimeRef.current?.broadcastSaved();
        } catch (error) {
            console.error("Failed to save canvas:", error);
            setSaveStatus("unsaved");
        } finally {
            isSavingRef.current = false;
        }
    }, [id, elements, appState, saveStatus]);

    const broadcastScene = useCallback(
        (excalidrawElements: readonly OrderedExcalidrawElement[]) => {
            realtimeRef.current?.broadcastScene(excalidrawElements);
        },
        [],
    );

    const handlePointerUpdate = useCallback(
        (_payload: { pointer: { x: number; y: number }; button: "down" | "up" }) => {},
        [],
    );

    const handleExcalidrawChange = useCallback(
        (
            excalidrawElements: readonly OrderedExcalidrawElement[],
            excalidrawAppState: AppState,
            _files: BinaryFiles,
        ) => {
            if (loading || isChangingCanvas) return;

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

            if (!elementsChanged && !appStateChanged) return;

            setElements([...excalidrawElements]);
            setAppState(currentPersistentState);

            // Remote-applied scenes already advanced lastSavedData, so here we only
            // keep React state in sync and must not mark the canvas as unsaved.
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

            if (elementsChanged) {
                broadcastScene(excalidrawElements);
            }
        },
        [loading, isChangingCanvas, broadcastScene],
    );

    async function handleTitleSave() {
        if (!id || !titleInput.trim()) return;
        try {
            await updateCanvasTitle(id, titleInput.trim());
            if (canvasData) {
                setCanvasData({ ...canvasData, title: titleInput.trim() });
            }
            setIsEditingTitle(false);
            globalThis.dispatchEvent(new Event("canvas-updated"));
        } catch (error) {
            console.error("Failed to update title:", error);
        }
    }

    function handleTitleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            void handleTitleSave();
        } else if (e.key === "Escape") {
            setTitleInput(canvasData?.title || "");
            setIsEditingTitle(false);
        }
    }

    useEffect(() => {
        if (!excalidrawAPI) return;

        excalidrawAPI.updateScene({
            elements: elements,
            appState: appState as AppState,
        });
    }, [excalidrawAPI, elements, appState]);

    const handleExportToJSON = useCallback(() => {
        if (!canvasData) return;
        const exportData = {
            type: "excalidraw",
            version: 2,
            elements: elements,
            appState: appState,
        };
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${canvasData.title || "untitled"}.excalidraw`;
        link.click();
        URL.revokeObjectURL(url);
    }, [canvasData, elements, appState]);

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
                    const imported = JSON.parse(event.target?.result as string);
                    if (imported && Array.isArray(imported.elements)) {
                        if (excalidrawAPI) {
                            const importedAppState = getPersistentAppState(imported.appState || {});
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
    }, [excalidrawAPI]);

    const handleExportToPNG = useCallback(async () => {
        if (!excalidrawAPI || !canvasData) return;
        try {
            const currentElements = excalidrawAPI.getSceneElements();
            const currentAppState = excalidrawAPI.getAppState();
            const blob = await exportToBlob({
                elements: currentElements,
                appState: currentAppState,
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
    }, [excalidrawAPI, canvasData]);

    const handleExportToSVG = useCallback(async () => {
        if (!excalidrawAPI || !canvasData) return;
        try {
            const currentElements = excalidrawAPI.getSceneElements();
            const currentAppState = excalidrawAPI.getAppState();
            const svg = await exportToSvg({
                elements: currentElements,
                appState: currentAppState,
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
    }, [excalidrawAPI, canvasData]);

    if (loading) {
        return (
            <AppShell contentPadding={0} sideNav={<Sidebar />}>
                <Center height="100%">
                    <VStack gap={2} hAlign="center">
                        <Icon icon={Loader2} size="lg" />
                        <Text type="supporting">Loading...</Text>
                    </VStack>
                </Center>
            </AppShell>
        );
    }

    return (
        <AppShell contentPadding={0} sideNav={<Sidebar />}>
            <Layout
                height="fill"
                header={
                    <LayoutHeader hasDivider padding={2}>
                        <HStack justify="between" align="center">
                            <HStack gap={2} align="center">
                                <IconButton
                                    label="Back to workspace"
                                    variant="ghost"
                                    icon={<Icon icon={ArrowLeft} size="sm" />}
                                    onClick={() => navigate({ to: "/" })}
                                    tooltip="Back to workspace"
                                />
                                <Divider orientation="vertical" />
                                {isEditingTitle ? (
                                    <TextInput
                                        label="Canvas title"
                                        isLabelHidden
                                        value={titleInput}
                                        onChange={setTitleInput}
                                        onKeyDown={handleTitleKeyDown}
                                        hasAutoFocus
                                        size="sm"
                                        width={280}
                                    />
                                ) : (
                                    <Button
                                        label={canvasData?.title || "Untitled"}
                                        variant="ghost"
                                        size="sm"
                                        icon={<Icon icon={Pencil} size="sm" />}
                                        onClick={() => setIsEditingTitle(true)}
                                        tooltip="Click to rename"
                                    />
                                )}
                            </HStack>

                            <HStack gap={2} align="center">
                                {collaborators > 1 && (
                                    <Text type="supporting">{collaborators} online</Text>
                                )}
                                <Text type="supporting">
                                    {saveStatus === "saving"
                                        ? "Saving..."
                                        : saveStatus === "saved"
                                          ? "Saved"
                                          : "Unsaved"}
                                </Text>
                                <IconButton
                                    label="Save"
                                    variant="ghost"
                                    icon={<Icon icon={Save} size="sm" />}
                                    tooltip="Save"
                                    isLoading={saveStatus === "saving"}
                                    isDisabled={saveStatus === "saved"}
                                    onClick={handleManualSave}
                                />
                                <Button
                                    label="Share"
                                    variant="secondary"
                                    size="sm"
                                    icon={<Icon icon={Share2} size="sm" />}
                                    onClick={() => setIsShareOpen(true)}
                                />
                            </HStack>
                        </HStack>
                    </LayoutHeader>
                }
                content={
                    <LayoutContent isScrollable={false} padding={0}>
                        <div className="relative h-full w-full overflow-hidden">
                            <div className="absolute inset-0">
                                <RealtimeCursors roomName={id as string} username={usernameError} />
                                <Excalidraw
                                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                                    theme={theme}
                                    isCollaborating
                                    onPointerUpdate={handlePointerUpdate}
                                    initialData={{
                                        elements: elements,
                                        appState: appState,
                                        libraryItems: initialLibraryItemsRef.current ?? undefined,
                                    }}
                                    onChange={handleExcalidrawChange}
                                    onLibraryChange={handleLibraryChange}
                                >
                                    <MainMenu>
                                        <MainMenu.DefaultItems.ClearCanvas />
                                        <MainMenu.Separator />
                                        <MainMenu.Item
                                            onSelect={handleExportToJSON}
                                            icon={<Icon icon={Download} size="sm" />}
                                        >
                                            Export File (.excalidraw)
                                        </MainMenu.Item>
                                        <MainMenu.Item
                                            onSelect={handleImportFromJSON}
                                            icon={<Icon icon={Upload} size="sm" />}
                                        >
                                            Import File (.excalidraw)
                                        </MainMenu.Item>
                                        <MainMenu.Separator />
                                        <MainMenu.Item
                                            onSelect={handleExportToPNG}
                                            icon={<Icon icon={Image} size="sm" />}
                                        >
                                            Export as PNG
                                        </MainMenu.Item>
                                        <MainMenu.Item
                                            onSelect={handleExportToSVG}
                                            icon={<Icon icon={FileCode} size="sm" />}
                                        >
                                            Export as SVG
                                        </MainMenu.Item>
                                        <MainMenu.Separator />
                                        <MainMenu.DefaultItems.Help />
                                    </MainMenu>
                                    <WelcomeScreen>
                                        <WelcomeScreen.Center>
                                            <WelcomeScreen.Center.Logo>
                                                <Icon icon={PenTool} size="lg" />
                                            </WelcomeScreen.Center.Logo>
                                            <WelcomeScreen.Center.Heading>
                                                Drawy
                                            </WelcomeScreen.Center.Heading>
                                            <WelcomeScreen.Center.MenuItemHelp />
                                            <Text type="supporting" justify="center">
                                                Sketch, add shapes, or use templates. Changes save
                                                automatically.
                                            </Text>
                                        </WelcomeScreen.Center>
                                    </WelcomeScreen>

                                    <DefaultSidebar>
                                        <DefaultSidebar.TabTriggers>
                                            <ExcalidrawSidebar.TabTrigger
                                                tab="drawy-libraries"
                                                title="Drawy libraries"
                                                aria-label="Drawy libraries"
                                            >
                                                <Icon icon={Shapes} size="sm" />
                                            </ExcalidrawSidebar.TabTrigger>
                                        </DefaultSidebar.TabTriggers>
                                        <ExcalidrawSidebar.Tab tab="drawy-libraries">
                                            <LibraryPanelTab />
                                        </ExcalidrawSidebar.Tab>
                                    </DefaultSidebar>
                                </Excalidraw>

                                {isChangingCanvas && (
                                    <Center height="100%">
                                        <Icon icon={Loader2} size="lg" />
                                    </Center>
                                )}
                            </div>
                        </div>
                    </LayoutContent>
                }
            />
            {canvasData && (
                <ShareCanvasModal
                    isOpen={isShareOpen}
                    onOpenChange={setIsShareOpen}
                    canvasId={id}
                    owner={canvasData.owner}
                    isOwner={canvasData.isOwner}
                    sharedWith={canvasData.sharedWith}
                    onShareChange={() => fetchCanvas(id, false)}
                />
            )}
        </AppShell>
    );
}