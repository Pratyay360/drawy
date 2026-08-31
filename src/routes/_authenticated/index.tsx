import { AppShell } from "@astryxdesign/core/AppShell";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Token } from "@astryxdesign/core/Token";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, PenTool, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { type Canvas, createCanvas, deleteCanvas, listCanvases } from "../../services/canvases";
import { subscribeCanvasEvents } from "../../utils/realtime";

export const Route = createFileRoute("/_authenticated/")({ component: Home });

function formatUpdatedAt(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const now = new Date();
    const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
    if (sameDay) {
        return `Today at ${date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

function Home() {
    const navigate = useNavigate();
    const [canvases, setCanvases] = useState<Canvas[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const canvasesRef = useRef(canvases);
    canvasesRef.current = canvases;

    const loadCanvases = useCallback(async () => {
        const hasStale = canvasesRef.current.length > 0;
        if (!hasStale) setIsLoading(true);
        setLoadError(null);
        try {
            const result = await withTimeout(listCanvases(), 12000, "Loading canvases");
            setCanvases(result);
            setLoadError(null);
        } catch (error) {
            console.error("Failed to load canvases:", error);
            setLoadError(
                error instanceof Error
                    ? error.message
                    : "Failed to load canvases — slow network, please retry",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCanvases();
        const onUpdate = () => void loadCanvases();
        addEventListener("canvas-updated", onUpdate);
        const unsubscribe = subscribeCanvasEvents(onUpdate);
        return () => {
            removeEventListener("canvas-updated", onUpdate);
            unsubscribe();
        };
    }, [loadCanvases]);

    async function handleCreate() {
        setIsCreating(true);
        try {
            const now = new Date();
            const title = now.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            const canvas = await withTimeout(createCanvas(title), 12000, "Create canvas");
            void navigate({ to: "/canvas/$id", params: { id: canvas.id } });
        } catch (error) {
            console.error("Failed to create canvas:", error);
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDelete(canvasId: string, event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        setDeletingId(canvasId);
        try {
            await withTimeout(deleteCanvas(canvasId), 12000, "Delete canvas");
        } catch (error) {
            console.error("Failed to delete canvas:", error);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <AppShell contentPadding={4} sideNav={<Sidebar />}>
            <VStack gap={5} maxWidth={960}>
                <HStack justify="between" align="center">
                    <VStack gap={1}>
                        <Heading level={1}>Drawings</Heading>
                        <Text type="supporting">
                            {canvases.length === 0
                                ? "Create your first drawing to get started."
                                : `${canvases.length} ${canvases.length === 1 ? "drawing" : "drawings"} · your canvases and drawings shared with you`}
                        </Text>
                    </VStack>
                    <Button
                        label="New canvas"
                        icon={<Icon icon={Plus} size="sm" />}
                        onClick={handleCreate}
                        isLoading={isCreating}
                    />
                </HStack>

                {isLoading && canvases.length === 0 ? (
                    <Card variant="muted" padding={6}>
                        <Center>
                            <VStack gap={2} hAlign="center">
                                <Icon icon={Loader2} size="lg" />
                                <Text type="supporting">Loading drawings…</Text>
                                <Text type="supporting">Slow network — hang tight</Text>
                            </VStack>
                        </Center>
                    </Card>
                ) : loadError ? (
                    <Card variant="muted" padding={6}>
                        <Center>
                            <VStack gap={3} hAlign="center" maxWidth={400}>
                                <Text weight="medium">Failed to load drawings</Text>
                                <Text type="supporting" justify="center">
                                    {loadError}
                                </Text>
                                <Button
                                    label="Retry"
                                    icon={<Icon icon={Loader2} size="sm" />}
                                    onClick={loadCanvases}
                                />
                                {canvases.length > 0 && (
                                    <Text type="supporting">Showing cached drawings below</Text>
                                )}
                            </VStack>
                        </Center>
                    </Card>
                ) : canvases.length > 0 ? (
                    <>
                        {isLoading && (
                            <HStack gap={2} align="center">
                                <Icon icon={Loader2} size="sm" />
                                <Text type="supporting">Refreshing…</Text>
                            </HStack>
                        )}
                        <Grid columns={{ minWidth: 220, max: 3 }} gap={3}>
                            {canvases.map((canvas) => (
                                <Card
                                    key={canvas.id}
                                    padding={3}
                                    onClick={() =>
                                        navigate({
                                            to: "/canvas/$id",
                                            params: { id: canvas.id },
                                        })
                                    }
                                >
                                    <VStack gap={2}>
                                        <HStack justify="between" align="center" gap={2}>
                                            <VStack gap={0} width="100%">
                                                <HStack align="center" gap={1}>
                                                    <Text weight="medium" maxLines={1}>
                                                        {canvas.title}
                                                    </Text>
                                                    {!canvas.isOwner && (
                                                        <Token
                                                            label={`Shared by ${canvas.owner}`}
                                                        />
                                                    )}
                                                </HStack>
                                                <Text type="supporting">
                                                    {formatUpdatedAt(canvas.updatedAt)}
                                                </Text>
                                            </VStack>
                                            {canvas.isOwner &&
                                                (deletingId === canvas.id ? (
                                                    <Icon icon={Loader2} size="sm" />
                                                ) : (
                                                    <IconButton
                                                        label="Delete drawing"
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<Icon icon={Trash2} size="sm" />}
                                                        onClick={(e) => handleDelete(canvas.id, e)}
                                                        tooltip="Delete drawing"
                                                    />
                                                ))}
                                        </HStack>
                                    </VStack>
                                </Card>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <Card variant="muted" padding={6}>
                        <Center>
                            <VStack gap={3} hAlign="center">
                                <Icon icon={PenTool} size="lg" />
                                <VStack gap={1} hAlign="center">
                                    <Text weight="medium">No drawings yet</Text>
                                    <Text type="supporting">
                                        Start sketching — changes save automatically.
                                    </Text>
                                </VStack>
                                <Button
                                    label="Create your first drawing"
                                    icon={<Icon icon={Plus} size="sm" />}
                                    onClick={handleCreate}
                                    isLoading={isCreating}
                                />
                            </VStack>
                        </Center>
                    </Card>
                )}
            </VStack>
        </AppShell>
    );
}