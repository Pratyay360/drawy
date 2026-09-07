import { AppShell } from "@astryxdesign/core/AppShell";
import { Button } from "@astryxdesign/core/Button";
import { Center } from "@astryxdesign/core/Center";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Token } from "@astryxdesign/core/Token";
import { useNavigate } from "@tanstack/react-router";
import { Eye, Loader2, LogIn, PenTool, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
    type CanvasData,
    loadPublicCanvas,
    sanitizeExcalidrawAppState,
} from "../services/canvases";

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

export function CanvasViewer({ id }: { id: string }) {
    const navigate = useNavigate();
    const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [excalidrawModule, setExcalidrawModule] = useState<
        typeof import("@excalidraw/excalidraw") | null
    >(null);
    const [moduleError, setModuleError] = useState<string | null>(null);
    const fetchCanvas = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setLoadError(null);
        try {
            const data = await withTimeout(loadPublicCanvas(id), 12000, "Loading canvas");
            if (!data) {
                setLoadError(
                    "This drawing isn't available. It may not exist or link sharing may be turned off.",
                );
                setCanvasData(null);
            } else {
                setCanvasData({
                    ...data,
                    appState: sanitizeExcalidrawAppState(data.appState),
                });
            }
        } catch (error) {
            console.error("Failed to load shared canvas:", error);
            setLoadError(
                error instanceof Error
                    ? error.message
                    : "Failed to load canvas — check network and retry",
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchCanvas();
    }, [fetchCanvas]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        let cancelled = false;
        (async () => {
            try {
                const mod = await withTimeout(
                    import("@excalidraw/excalidraw"),
                    15000,
                    "Loading editor",
                );
                await import("@excalidraw/excalidraw/index.css");
                if (!cancelled) setExcalidrawModule(mod);
            } catch (err) {
                console.error("Failed to load Excalidraw:", err);
                if (!cancelled) {
                    setModuleError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load viewer — slow network, please retry",
                    );
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <AppShell contentPadding={0}>
                <Center height="100%">
                    <VStack gap={2} hAlign="center">
                        <Icon icon={Loader2} size="lg" />
                        <Text type="supporting">Loading shared drawing…</Text>
                    </VStack>
                </Center>
            </AppShell>
        );
    }

    if (loadError || !canvasData) {
        return (
            <AppShell contentPadding={0}>
                <Center height="100%">
                    <VStack gap={3} hAlign="center" maxWidth={400}>
                        <Icon icon={Eye} size="lg" />
                        <Text weight="medium">Drawing unavailable</Text>
                        <Text type="supporting" justify="center">
                            {loadError ?? "This drawing could not be loaded."}
                        </Text>
                        <HStack gap={2}>
                            <Button
                                label="Retry"
                                icon={<Icon icon={RefreshCw} size="sm" />}
                                onClick={() => void fetchCanvas()}
                            />
                            <Button
                                label="Sign in"
                                variant="ghost"
                                icon={<Icon icon={LogIn} size="sm" />}
                                onClick={() => navigate({ to: "/login" })}
                            />
                        </HStack>
                    </VStack>
                </Center>
            </AppShell>
        );
    }

    return (
        <AppShell contentPadding={0}>
            <Layout
                height="fill"
                header={
                    <LayoutHeader hasDivider padding={2}>
                        <HStack justify="between" align="center">
                            <HStack gap={2} align="center">
                                <Icon icon={PenTool} size="sm" />
                                <Text weight="medium" maxLines={1}>
                                    {canvasData.title || "Untitled"}
                                </Text>
                                <Text type="supporting">by {canvasData.owner}</Text>
                                <Token label="Read-only" />
                            </HStack>
                            <HStack gap={2} align="center">
                                <Button
                                    label="Reload"
                                    variant="ghost"
                                    size="sm"
                                    icon={<Icon icon={RefreshCw} size="sm" />}
                                    onClick={() => void fetchCanvas()}
                                />
                                <Button
                                    label="Sign in to edit"
                                    variant="secondary"
                                    size="sm"
                                    icon={<Icon icon={LogIn} size="sm" />}
                                    onClick={() => navigate({ to: "/login" })}
                                />
                            </HStack>
                        </HStack>
                    </LayoutHeader>
                }
                content={
                    <LayoutContent isScrollable={false} padding={0}>
                        <div className="relative h-full w-full overflow-hidden">
                            <div className="absolute inset-0">
                                {excalidrawModule ? (
                                    <excalidrawModule.Excalidraw
                                        theme="light"
                                        viewModeEnabled
                                        initialData={{
                                            elements: canvasData.elements,
                                            appState: {
                                                ...canvasData.appState,
                                                viewModeEnabled: true,
                                            },
                                            files: canvasData.files,
                                        }}
                                    />
                                ) : moduleError ? (
                                    <Center height="100%">
                                        <VStack gap={2} hAlign="center" maxWidth={360}>
                                            <Text weight="medium">Viewer failed to load</Text>
                                            <Text type="supporting" justify="center">
                                                {moduleError}
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
                                            <Text type="supporting">Loading viewer...</Text>
                                        </VStack>
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