import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
    SideNav,
    SideNavCollapseButton,
    SideNavHeading,
    SideNavItem,
    SideNavSection,
    useSideNavCollapse,
} from "@astryxdesign/core/SideNav";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { FileText, Library, Loader2, PenTool, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useSidebarStore } from "#/stores/sidebar";
import { subscribeCanvasListChanged } from "#/utils/canvas-realtime";
import { createCanvas, deleteCanvas, listCanvases } from "../../services/canvases";
import { requestLibraryBrowse } from "../../services/libraries";
import { subscribeCanvasEvents } from "../../utils/realtime";
import { ThemeToggle } from "../theme-toggle";
import { groupCanvasesByDate } from "./canvas-grouping";
import { SidebarFooter } from "./sidebar-footer";

function SidebarNewCanvasButton({
    onClick,
    isLoading,
}: {
    onClick: () => void;
    isLoading: boolean;
}) {
    const { isCollapsed } = useSideNavCollapse();
    if (isCollapsed) {
        return (
            <IconButton
                label="New canvas"
                tooltip="New canvas"
                icon={<Icon icon={Plus} size="sm" />}
                onClick={onClick}
                isLoading={isLoading}
                variant="primary"
            />
        );
    }
    return (
        <Button
            label="New canvas"
            icon={<Icon icon={Plus} size="sm" />}
            onClick={onClick}
            isLoading={isLoading}
            width="100%"
        />
    );
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

export function Sidebar() {
    const isCollapsed = useSidebarStore((s) => s.isCollapsed);
    const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);
    const canvases = useSidebarStore((s) => s.canvases);
    const setCanvases = useSidebarStore((s) => s.setCanvases);
    const isLoadingCanvases = useSidebarStore((s) => s.isLoadingCanvases);
    const setIsLoadingCanvases = useSidebarStore((s) => s.setIsLoadingCanvases);
    const canvasesError = useSidebarStore((s) => s.canvasesError);
    const setCanvasesError = useSidebarStore((s) => s.setCanvasesError);
    const isCreating = useSidebarStore((s) => s.isCreating);
    const setIsCreating = useSidebarStore((s) => s.setIsCreating);
    const deletingId = useSidebarStore((s) => s.deletingId);
    const setDeletingId = useSidebarStore((s) => s.setDeletingId);
    const { id: currentCanvasId } = useParams({ strict: false });
    const navigate = useNavigate();
    const loadSeqRef = useRef(0);

    const loadCanvases = useCallback(async () => {
        const seq = ++loadSeqRef.current;
        // Keep stale data visible while reloading; only show spinner if we have no data yet
        const hasStale = useSidebarStore.getState().canvases.length > 0;
        if (!hasStale) setIsLoadingCanvases(true);
        setCanvasesError(null);
        try {
            const result = await withTimeout(listCanvases(), 12000, "Loading canvases");
            if (seq !== loadSeqRef.current) return;
            setCanvases(result);
            setCanvasesError(null);
        } catch (error) {
            if (seq !== loadSeqRef.current) return;
            console.error("Failed to load canvases:", error);
            setCanvasesError(error instanceof Error ? error.message : "Failed to load canvases");
        } finally {
            if (seq === loadSeqRef.current) setIsLoadingCanvases(false);
        }
    }, [setCanvases, setIsLoadingCanvases, setCanvasesError]);

    useEffect(() => {
        void loadCanvases();
        const onUpdate = () => void loadCanvases();
        addEventListener("canvas-updated", onUpdate);
        const unsubscribe = subscribeCanvasEvents(onUpdate);
        const unsubscribeList = subscribeCanvasListChanged(onUpdate);
        return () => {
            removeEventListener("canvas-updated", onUpdate);
            unsubscribe();
            unsubscribeList();
        };
    }, [loadCanvases]);

    async function handleCreateCanvas() {
        setIsCreating(true);
        try {
            const now = new Date();
            const title = now.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            const newCanvas = await withTimeout(createCanvas(title), 12000, "Create canvas");
            dispatchEvent(new Event("canvas-updated"));
            void navigate({ to: "/canvas/$id", params: { id: newCanvas.id } });
        } catch (error) {
            console.error("Failed to create canvas:", error);
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteCanvas(canvasId: string, event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        setDeletingId(canvasId);
        try {
            await withTimeout(deleteCanvas(canvasId), 12000, "Delete canvas");
            dispatchEvent(new Event("canvas-updated"));
            if (canvasId === currentCanvasId) {
                void navigate({ to: "/" });
            }
        } catch (error) {
            console.error("Failed to delete canvas:", error);
        } finally {
            setDeletingId(null);
        }
    }

    const grouped = groupCanvasesByDate(canvases);

    return (
        <SideNav
            collapsible={{
                isCollapsed,
                onCollapsedChange: setIsCollapsed,
                hasButton: false,
            }}
            resizable={{
                defaultWidth: 240,
                minWidth: 200,
                maxWidth: 320,
                autoSaveId: "drawy-sidebar-width",
            }}
            header={
                <SideNavHeading
                    heading="Drawy"
                    icon={<Icon icon={PenTool} size="sm" />}
                    headingHref="/"
                    as={Link}
                />
            }
            topContent={
                <SidebarNewCanvasButton onClick={handleCreateCanvas} isLoading={isCreating} />
            }
            footerIcons={
                <>
                    <IconButton
                        label="Libraries"
                        tooltip="Libraries"
                        variant="ghost"
                        icon={<Icon icon={Library} size="sm" />}
                        onClick={() => requestLibraryBrowse(null)}
                    />
                    <ThemeToggle />
                    <SideNavCollapseButton />
                </>
            }
            footer={<SidebarFooter />}
        >
            {isLoadingCanvases && canvases.length === 0 ? (
                <SideNavSection title="Loading" isHeaderHidden>
                    <VStack gap={2} hAlign="center" padding={3}>
                        <Icon icon={Loader2} size="sm" />
                        <Text type="supporting">Loading drawings…</Text>
                        <Text type="supporting">Slow network — hang tight</Text>
                    </VStack>
                </SideNavSection>
            ) : canvasesError ? (
                <SideNavSection title="Error" isHeaderHidden>
                    <VStack gap={2} hAlign="center" padding={3}>
                        <Text type="supporting" maxLines={3}>
                            {canvasesError}
                        </Text>
                        <Button
                            label="Retry"
                            variant="ghost"
                            size="sm"
                            icon={<Icon icon={Loader2} size="sm" />}
                            onClick={loadCanvases}
                        />
                        {canvases.length > 0 && (
                            <Text type="supporting">Showing cached drawings</Text>
                        )}
                    </VStack>
                </SideNavSection>
            ) : (
                <>
                    {grouped.Today.length > 0 && (
                        <SideNavSection title="Today">
                            {grouped.Today.map((canvas) => (
                                <SideNavItem
                                    key={canvas.id}
                                    label={canvas.title}
                                    icon={FileText}
                                    href={`/canvas/${canvas.id}`}
                                    as={Link}
                                    isSelected={canvas.id === currentCanvasId}
                                    endContent={
                                        canvas.isOwner ? (
                                            deletingId === canvas.id ? (
                                                <Icon icon={Loader2} size="sm" />
                                            ) : (
                                                <IconButton
                                                    label="Delete canvas"
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<Icon icon={Trash2} size="sm" />}
                                                    onClick={(e) =>
                                                        handleDeleteCanvas(canvas.id, e)
                                                    }
                                                />
                                            )
                                        ) : null
                                    }
                                />
                            ))}
                        </SideNavSection>
                    )}

                    {grouped.Older.length > 0 && (
                        <SideNavSection title="Older">
                            {grouped.Older.map((canvas) => (
                                <SideNavItem
                                    key={canvas.id}
                                    label={canvas.title}
                                    icon={FileText}
                                    href={`/canvas/${canvas.id}`}
                                    as={Link}
                                    isSelected={canvas.id === currentCanvasId}
                                    endContent={
                                        canvas.isOwner ? (
                                            deletingId === canvas.id ? (
                                                <Icon icon={Loader2} size="sm" />
                                            ) : (
                                                <IconButton
                                                    label="Delete canvas"
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<Icon icon={Trash2} size="sm" />}
                                                    onClick={(e) =>
                                                        handleDeleteCanvas(canvas.id, e)
                                                    }
                                                />
                                            )
                                        ) : null
                                    }
                                />
                            ))}
                        </SideNavSection>
                    )}

                    {canvases.length === 0 && (
                        <SideNavSection title="Drawings" isHeaderHidden>
                            <VStack gap={2} hAlign="center" padding={3}>
                                <Text type="supporting">No drawings yet</Text>
                                <Button
                                    label="Create one"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCreateCanvas}
                                />
                            </VStack>
                        </SideNavSection>
                    )}
                    {isLoadingCanvases && canvases.length > 0 && (
                        <VStack gap={1} hAlign="center" padding={2}>
                            <Icon icon={Loader2} size="sm" />
                            <Text type="supporting">Refreshing…</Text>
                        </VStack>
                    )}
                </>
            )}
        </SideNav>
    );
}