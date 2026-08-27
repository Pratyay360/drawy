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

// Load Excalidraw dynamically on the client to avoid server-side window errors
const isClient = true;

import { useCallback, useEffect, useRef, useState } from "react";

const [__dummy] = [] as any;

// We'll dynamically import the Excalidraw module and CSS at runtime (client only).
// The actual module is stored in state below inside the component so tooling still
// understands type-only imports that follow.
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
  Layers,
  Loader2,
  Pencil,
  PenTool,
  Save,
  Share2,
  Upload,
} from "lucide-react";
// We'll import React hooks (useCallback/useEffect/...) above via the earlier dynamic placeholder.
import { getCurrentUser } from "#/lib/session";
import { useTheme } from "../hooks/usetheme";
import {
  type CanvasData,
  loadCanvas,
  sanitizeExcalidrawAppState,
  saveCanvas,
  updateCanvasTitle,
  uploadCanvasAsset,
} from "../services/canvases";
import { getUserLibrary, onLibraryItemsInstalled, setUserLibrary } from "../services/libraries";
import { pruneUnusedFiles, uploadPendingAssets } from "../utils/assets";
import { CanvasRealtime, mergeElements, type ScenePayload } from "../utils/canvas-realtime";
import { subscribeCanvasEvents } from "../utils/realtime";
import { LibraryPanelTab } from "./library-panel-tab";
import { RealtimeCursors } from "./realtime-cursors";
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
  if (!appState) return {};
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
  username?: string;
}

export function CanvasEditor({ id, username: propUsername }: CanvasEditorProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [username, setUsername] = useState(propUsername || "");

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
  }, [propUsername]);

  const [excalidrawModule, setExcalidrawModule] = useState<any | null>(null);
  useEffect(() => {
    if (!isClient) return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@excalidraw/excalidraw");
        // load CSS after module so styles apply only on client
        await import("@excalidraw/excalidraw/index.css");
        if (!cancelled) setExcalidrawModule(mod);
      } catch (err) {
        console.error("Failed to load Excalidraw:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChangingCanvas, setIsChangingCanvas] = useState(false);
  const [elements, setElements] = useState<ExcalidrawElement[]>([]);
  const [appState, setAppState] = useState<Partial<AppState>>({});
  const filesRef = useRef<BinaryFiles>({});
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const initialLibraryItemsRef = useRef<Promise<LibraryItems> | null>(null);
  if (!initialLibraryItemsRef.current) {
    initialLibraryItemsRef.current = getUserLibrary();
  }
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
          const resolvedFiles = data.files || {};

          filesRef.current = resolvedFiles;
          setCanvasData({
            ...data,
            appState: sanitizedAppState,
            files: resolvedFiles,
          });
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
            if (resolvedFiles && Object.keys(resolvedFiles).length > 0) {
              excalidrawAPI.addFiles(Object.values(resolvedFiles));
            }
            // SAFETY: sanitizedAppState is Partial<AppState> produced by sanitizeExcalidrawAppState.
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
  }, [id, excalidrawAPI, fetchCanvas]);

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
  }, [elements, appState, id, loading, isChangingCanvas, saveStatus]);

  const handleManualSave = useCallback(async () => {
    if (!id || isSavingRef.current || saveStatus !== "unsaved") return;

    setSaveStatus("saving");
    isSavingRef.current = true;
    try {
      const prunedFiles = pruneUnusedFiles(filesRef.current, elements);
      filesRef.current = prunedFiles;
      await saveCanvas(id, elements, appState, prunedFiles);
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
    (excalidrawElements: readonly OrderedExcalidrawElement[], files?: BinaryFiles) => {
      realtimeRef.current?.broadcastScene(excalidrawElements, files);
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
      newFiles: BinaryFiles,
    ) => {
      if (loading || isChangingCanvas) return;

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
                if (excalidrawAPI) {
                  excalidrawAPI.addFiles(Object.values(updatedFiles));
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
      const appStateChanged = !areAppStatesEqual(currentPersistentState, savedPersistentState);

      if (!elementsChanged && !appStateChanged && !filesChanged) return;

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

      if (elementsChanged || filesChanged) {
        broadcastScene(excalidrawElements, currentFiles);
      }
    },
    [loading, isChangingCanvas, broadcastScene, id, excalidrawAPI],
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

  const handleExportToJSON = useCallback(() => {
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
          // SAFETY: FileReader onload result is always a string when readAsText is used.
          const imported = JSON.parse(event.target?.result as string);
          if (imported && Array.isArray(imported.elements)) {
            if (excalidrawAPI) {
              const importedAppState = getPersistentAppState(imported.appState || {});
              if (imported.files && typeof imported.files === "object") {
                filesRef.current = { ...filesRef.current, ...imported.files };
                excalidrawAPI.addFiles(Object.values(imported.files));
              }
              // SAFETY: importedAppState is Partial<AppState> produced by getPersistentAppState.
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
  }, [excalidrawAPI, canvasData]);

  const handleExportToSVG = useCallback(async () => {
    if (!excalidrawAPI || !canvasData) return;
    try {
      const currentElements = excalidrawAPI.getSceneElements();
      const currentAppState = excalidrawAPI.getAppState();
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
                {collaborators >= 1 && (
                  <Text type="supporting">
                    {collaborators} active {collaborators === 1 ? "user" : "users"}
                  </Text>
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
                <RealtimeCursors roomName={id} username={username || "Anonymous"} />
                {excalidrawModule ? (
                  <excalidrawModule.Excalidraw
                    excalidrawAPI={setExcalidrawAPI}
                    theme={theme}
                    isCollaborating
                    onPointerUpdate={handlePointerUpdate}
                    initialData={{
                      elements: elements,
                      appState: appState,
                      files: filesRef.current,
                      libraryItems: initialLibraryItemsRef.current ?? undefined,
                    }}
                    onChange={handleExcalidrawChange}
                    onLibraryChange={handleLibraryChange}
                  >
                    <excalidrawModule.MainMenu>
                      <excalidrawModule.MainMenu.DefaultItems.ClearCanvas />
                      <excalidrawModule.MainMenu.Separator />
                      <excalidrawModule.MainMenu.Item
                        onSelect={handleExportToJSON}
                        icon={<Icon icon={Download} size="sm" />}
                      >
                        Export File (.excalidraw)
                      </excalidrawModule.MainMenu.Item>
                      <excalidrawModule.MainMenu.Item
                        onSelect={handleImportFromJSON}
                        icon={<Icon icon={Upload} size="sm" />}
                      >
                        Import File (.excalidraw)
                      </excalidrawModule.MainMenu.Item>
                      <excalidrawModule.MainMenu.Separator />
                      <excalidrawModule.MainMenu.Item
                        onSelect={handleExportToPNG}
                        icon={<Icon icon={Image} size="sm" />}
                      >
                        Export as PNG
                      </excalidrawModule.MainMenu.Item>
                      <excalidrawModule.MainMenu.Item
                        onSelect={handleExportToSVG}
                        icon={<Icon icon={FileCode} size="sm" />}
                      >
                        Export as SVG
                      </excalidrawModule.MainMenu.Item>
                      <excalidrawModule.MainMenu.Separator />
                      <excalidrawModule.MainMenu.DefaultItems.Help />
                    </excalidrawModule.MainMenu>
                    <excalidrawModule.WelcomeScreen>
                      <excalidrawModule.WelcomeScreen.Center>
                        <excalidrawModule.WelcomeScreen.Center.Logo>
                          <Icon icon={PenTool} size="lg" />
                        </excalidrawModule.WelcomeScreen.Center.Logo>
                        <excalidrawModule.WelcomeScreen.Center.Heading>
                          Drawy
                        </excalidrawModule.WelcomeScreen.Center.Heading>
                        <excalidrawModule.WelcomeScreen.Center.MenuItemHelp />
                        <Text type="supporting" justify="center">
                          Sketch, add shapes, or use templates. Changes save automatically.
                        </Text>
                      </excalidrawModule.WelcomeScreen.Center>
                    </excalidrawModule.WelcomeScreen>

                    <excalidrawModule.DefaultSidebar>
                      <excalidrawModule.DefaultSidebar.TabTriggers>
                        <excalidrawModule.Sidebar.TabTrigger
                          tab="drawy-libraries"
                          title="Drawy libraries"
                          aria-label="Drawy libraries"
                        >
                          <Icon icon={Layers} size="sm" />
                        </excalidrawModule.Sidebar.TabTrigger>
                      </excalidrawModule.DefaultSidebar.TabTriggers>
                      <excalidrawModule.Sidebar.Tab tab="drawy-libraries">
                        <LibraryPanelTab />
                      </excalidrawModule.Sidebar.Tab>
                    </excalidrawModule.DefaultSidebar>
                  </excalidrawModule.Excalidraw>
                ) : (
                  <Center height="100%">
                    <VStack gap={2} hAlign="center">
                      <Icon icon={Loader2} size="lg" />
                      <Text type="supporting">Loading editor...</Text>
                    </VStack>
                  </Center>
                )}

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
