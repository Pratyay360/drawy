import { AppShell } from "@astryxdesign/core/AppShell";
import { Button } from "@astryxdesign/core/Button";
import { Center } from "@astryxdesign/core/Center";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import type { AppState } from "@excalidraw/excalidraw/types";
import { useNavigate } from "@tanstack/react-router";
import {
    ArrowLeft,
    Download,
    FileCode,
    Image,
    Layers,
    Loader2,
    Pencil,
    PenTool,
    Save,
    Share2,
    Upload,
} from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import { getCurrentUser } from "#/lib/session";
import { useCanvasStore } from "#/stores/canvas";
import { useUIStore } from "#/stores/ui";
import { useTheme } from "../../hooks/usetheme";
import { updateCanvasTitle } from "../../services/canvases";
import { onLibraryItemsInstalled, setUserLibrary } from "../../services/libraries";
import { LibraryPanelTab } from "../library-panel-tab";
import { Sidebar } from "../sidebar";
import { useCanvasHandlers } from "./use-canvas-handlers";
import { useCanvasLifecycle } from "./use-canvas-lifecycle";

const RealtimeCursors = lazy(() =>
    import("../realtime-cursors").then((m) => ({ default: m.RealtimeCursors })),
);

interface CanvasEditorProps {
    id: string;
    username?: string;
}

export function CanvasEditor({ id, username: propUsername }: CanvasEditorProps) {
    const navigate = useNavigate();
    const { theme } = useTheme();

    // --- Lifecycle hook (loading, saving, realtime) ---
    const lifecycle = useCanvasLifecycle({ id });

    // --- Handlers hook (export, import, save, change) ---
    const handlers = useCanvasHandlers({
        id,
        filesRef: lifecycle.filesRef,
        excalidrawAPI: lifecycle.excalidrawAPI,
        isSavingRef: lifecycle.isSavingRef,
        realtimeRef: lifecycle.realtimeRef,
        applyingRemoteRef: lifecycle.applyingRemoteRef,
        lastLocalEditRef: lifecycle.lastLocalEditRef,
        lastSavedData: lifecycle.lastSavedData,
        fetchCanvas: lifecycle.fetchCanvas,
    });

    const openShareCanvas = useUIStore((s) => s.openShareCanvas);

    // --- Username initialization ---
    const setUsername = useCanvasStore((s) => s.setUsername);
    useEffect(() => {
        if (propUsername) {
            setUsername(propUsername);
            return;
        }
        let cancelled = false;
        void getCurrentUser().then((currentUser) => {
            if (!cancelled && currentUser?.username) {
                setUsername(currentUser.username);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [propUsername, setUsername]);

    // --- Library change handler ---
    const librarySaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingLibraryRef = useRef<import("@excalidraw/excalidraw/types").LibraryItem[] | null>(
        null,
    );

    const handleLibraryChange = useCallback(
        (items: readonly import("@excalidraw/excalidraw/types").LibraryItem[]) => {
            pendingLibraryRef.current = [...items];
            if (librarySaveTimerRef.current !== null) {
                globalThis.clearTimeout(librarySaveTimerRef.current);
            }
            librarySaveTimerRef.current = globalThis.setTimeout(() => {
                const toSave = pendingLibraryRef.current;
                pendingLibraryRef.current = null;
                if (toSave) void setUserLibrary(toSave);
            }, 300);
        },
        [],
    );

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

    useEffect(() => {
        if (!lifecycle.excalidrawAPI) return;
        return onLibraryItemsInstalled((items) => {
            void lifecycle.excalidrawAPI?.updateLibrary({
                libraryItems: items,
                merge: true,
            });
        });
    }, [lifecycle.excalidrawAPI]);

    // --- Title editing ---
    const isEditingTitle = useCanvasStore((s) => s.isEditingTitle);
    const titleInput = useCanvasStore((s) => s.titleInput);
    const setIsEditingTitle = useCanvasStore((s) => s.setIsEditingTitle);
    const setTitleInput = useCanvasStore((s) => s.setTitleInput);

    const handleTitleSave = useCallback(async () => {
        if (!id || !titleInput.trim()) return;
        try {
            const withTimeout = <T,>(p: Promise<T>) =>
                Promise.race([
                    p,
                    new Promise<never>((_, rej) =>
                        setTimeout(
                            () => rej(new Error("Saving title timed out — slow network")),
                            12000,
                        ),
                    ),
                ]);
            await withTimeout(updateCanvasTitle(id, titleInput.trim()));
            if (lifecycle.canvasData) {
                lifecycle.setCanvasData({
                    ...lifecycle.canvasData,
                    title: titleInput.trim(),
                });
            }
            setIsEditingTitle(false);
            globalThis.dispatchEvent(new Event("canvas-updated"));
        } catch (error) {
            console.error("Failed to update title:", error);
        }
    }, [id, titleInput, lifecycle.canvasData, lifecycle.setCanvasData, setIsEditingTitle]);

    const handleTitleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                void handleTitleSave();
            } else if (e.key === "Escape") {
                setTitleInput(lifecycle.canvasData?.title || "");
                setIsEditingTitle(false);
            }
        },
        [handleTitleSave, lifecycle.canvasData?.title, setTitleInput, setIsEditingTitle],
    );

    // --- Loading / error states (slow-network aware) ---
    if (lifecycle.loading) {
        return (
            <AppShell contentPadding={0} sideNav={<Sidebar />}>
                <Center height="100%">
                    <VStack gap={2} hAlign="center">
                        <Icon icon={Loader2} size="lg" />
                        <Text type="supporting">Loading canvas…</Text>
                        <Text type="supporting">Slow network — hang tight</Text>
                    </VStack>
                </Center>
            </AppShell>
        );
    }

    if (lifecycle.loadError) {
        return (
            <AppShell contentPadding={0} sideNav={<Sidebar />}>
                <Center height="100%">
                    <VStack gap={3} hAlign="center" maxWidth={400}>
                        <Text weight="medium">Failed to load canvas</Text>
                        <Text type="supporting" justify="center">
                            {lifecycle.loadError}
                        </Text>
                        <HStack gap={2}>
                            <Button
                                label="Retry"
                                icon={<Icon icon={Loader2} size="sm" />}
                                onClick={() => void lifecycle.fetchCanvas(id, true)}
                            />
                            <Button
                                label="Back to workspace"
                                variant="ghost"
                                icon={<Icon icon={ArrowLeft} size="sm" />}
                                onClick={() => navigate({ to: "/" })}
                            />
                        </HStack>
                    </VStack>
                </Center>
            </AppShell>
        );
    }

    if (lifecycle.moduleError) {
        return (
            <AppShell contentPadding={0} sideNav={<Sidebar />}>
                <Center height="100%">
                    <VStack gap={3} hAlign="center" maxWidth={400}>
                        <Text weight="medium">Failed to load editor</Text>
                        <Text type="supporting" justify="center">
                            {lifecycle.moduleError}
                        </Text>
                        <Button label="Retry" onClick={() => globalThis.location.reload()} />
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
                                        label={lifecycle.canvasData?.title || "Untitled"}
                                        variant="ghost"
                                        size="sm"
                                        icon={<Icon icon={Pencil} size="sm" />}
                                        onClick={() => setIsEditingTitle(true)}
                                        tooltip="Click to rename"
                                    />
                                )}
                            </HStack>

                            <HStack gap={2} align="center">
                                {lifecycle.collaborators >= 1 && (
                                    <Text type="supporting">
                                        {lifecycle.collaborators} active{" "}
                                        {lifecycle.collaborators === 1 ? "user" : "users"}
                                    </Text>
                                )}
                                <Text type="supporting">
                                    {lifecycle.saveStatus === "saving"
                                        ? "Saving..."
                                        : lifecycle.saveStatus === "saved"
                                          ? "Saved"
                                          : "Unsaved"}
                                </Text>
                                <IconButton
                                    label="Save"
                                    variant="ghost"
                                    icon={<Icon icon={Save} size="sm" />}
                                    tooltip="Save"
                                    isLoading={lifecycle.saveStatus === "saving"}
                                    isDisabled={lifecycle.saveStatus === "saved"}
                                    onClick={handlers.handleManualSave}
                                />
                                <Button
                                    label="Share"
                                    variant="secondary"
                                    size="sm"
                                    icon={<Icon icon={Share2} size="sm" />}
                                    onClick={() =>
                                        lifecycle.canvasData &&
                                        openShareCanvas({
                                            canvasId: id,
                                            owner: lifecycle.canvasData.owner,
                                            isOwner: lifecycle.canvasData.isOwner,
                                            sharedWith: lifecycle.canvasData.sharedWith,
                                        })
                                    }
                                />
                            </HStack>
                        </HStack>
                    </LayoutHeader>
                }
                content={
                    <LayoutContent isScrollable={false} padding={0}>
                        <div className="relative h-full w-full overflow-hidden">
                            <div className="absolute inset-0">
                                <Suspense fallback={null}>
                                    <RealtimeCursors
                                        roomName={id}
                                        username={lifecycle.username || "Anonymous"}
                                    />
                                </Suspense>
                                {lifecycle.excalidrawModule ? (
                                    <lifecycle.excalidrawModule.Excalidraw
                                        excalidrawAPI={lifecycle.setExcalidrawAPI}
                                        theme={theme}
                                        isCollaborating
                                        onPointerUpdate={() => {}}
                                        initialData={{
                                            elements: lifecycle.elements,
                                            appState: lifecycle.appState,
                                            files: lifecycle.filesRef.current,
                                            libraryItems:
                                                lifecycle.initialLibraryItemsRef.current ??
                                                undefined,
                                        }}
                                        onChange={handlers.handleExcalidrawChange}
                                        onLibraryChange={handleLibraryChange}
                                    >
                                        <lifecycle.excalidrawModule.MainMenu>
                                            <lifecycle.excalidrawModule.MainMenu.DefaultItems.ClearCanvas />
                                            <lifecycle.excalidrawModule.MainMenu.Separator />
                                            <lifecycle.excalidrawModule.MainMenu.Item
                                                onSelect={handlers.handleExportToJSON}
                                                icon={<Icon icon={Download} size="sm" />}
                                            >
                                                Export File (.excalidraw)
                                            </lifecycle.excalidrawModule.MainMenu.Item>
                                            <lifecycle.excalidrawModule.MainMenu.Item
                                                onSelect={handlers.handleImportFromJSON}
                                                icon={<Icon icon={Upload} size="sm" />}
                                            >
                                                Import File (.excalidraw)
                                            </lifecycle.excalidrawModule.MainMenu.Item>
                                            <lifecycle.excalidrawModule.MainMenu.Separator />
                                            <lifecycle.excalidrawModule.MainMenu.Item
                                                onSelect={handlers.handleExportToPNG}
                                                icon={<Icon icon={Image} size="sm" />}
                                            >
                                                Export as PNG
                                            </lifecycle.excalidrawModule.MainMenu.Item>
                                            <lifecycle.excalidrawModule.MainMenu.Item
                                                onSelect={handlers.handleExportToSVG}
                                                icon={<Icon icon={FileCode} size="sm" />}
                                            >
                                                Export as SVG
                                            </lifecycle.excalidrawModule.MainMenu.Item>
                                            <lifecycle.excalidrawModule.MainMenu.Separator />
                                            <lifecycle.excalidrawModule.MainMenu.DefaultItems.Help />
                                        </lifecycle.excalidrawModule.MainMenu>
                                        <lifecycle.excalidrawModule.WelcomeScreen>
                                            <lifecycle.excalidrawModule.WelcomeScreen.Center>
                                                <lifecycle.excalidrawModule.WelcomeScreen.Center.Logo>
                                                    <Icon icon={PenTool} size="lg" />
                                                </lifecycle.excalidrawModule.WelcomeScreen.Center.Logo>
                                                <lifecycle.excalidrawModule.WelcomeScreen.Center.Heading>
                                                    Drawy
                                                </lifecycle.excalidrawModule.WelcomeScreen.Center.Heading>
                                                <lifecycle.excalidrawModule.WelcomeScreen.Center.MenuItemHelp />
                                                <Text type="supporting" justify="center">
                                                    Sketch, add shapes, or use templates. Changes
                                                    save automatically.
                                                </Text>
                                            </lifecycle.excalidrawModule.WelcomeScreen.Center>
                                        </lifecycle.excalidrawModule.WelcomeScreen>

                                        <lifecycle.excalidrawModule.DefaultSidebar>
                                            <lifecycle.excalidrawModule.DefaultSidebar.TabTriggers>
                                                <lifecycle.excalidrawModule.Sidebar.TabTrigger
                                                    tab="drawy-libraries"
                                                    title="Drawy libraries"
                                                    aria-label="Drawy libraries"
                                                >
                                                    <Icon icon={Layers} size="sm" />
                                                </lifecycle.excalidrawModule.Sidebar.TabTrigger>
                                            </lifecycle.excalidrawModule.DefaultSidebar.TabTriggers>
                                            <lifecycle.excalidrawModule.Sidebar.Tab tab="drawy-libraries">
                                                <LibraryPanelTab />
                                            </lifecycle.excalidrawModule.Sidebar.Tab>
                                        </lifecycle.excalidrawModule.DefaultSidebar>
                                    </lifecycle.excalidrawModule.Excalidraw>
                                ) : lifecycle.moduleError ? (
                                    <Center height="100%">
                                        <VStack gap={2} hAlign="center" maxWidth={360}>
                                            <Text weight="medium">Editor failed to load</Text>
                                            <Text type="supporting" justify="center">
                                                {lifecycle.moduleError}
                                            </Text>
                                            <Button
                                                label="Retry"
                                                onClick={() => globalThis.location.reload()}
                                            />
                                        </VStack>
                                    </Center>
                                ) : (
                                    <Center height="100%">
                                        <VStack gap={2} hAlign="center">
                                            <Icon icon={Loader2} size="lg" />
                                            <Text type="supporting">Loading editor...</Text>
                                            <Text type="supporting">
                                                Slow network — this can take a moment
                                            </Text>
                                        </VStack>
                                    </Center>
                                )}

                                {lifecycle.isChangingCanvas && (
                                    <Center height="100%">
                                        <Icon icon={Loader2} size="lg" />
                                    </Center>
                                )}
                            </div>
                        </div>
                    </LayoutContent>
                }
            />
        </AppShell>
    );
}