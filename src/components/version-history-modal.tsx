import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { History, Loader2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useUIStore } from "#/stores/ui";
import { type CanvasVersion, listCanvasVersions, restoreCanvasVersion } from "../services/canvases";

function formatVersionDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function VersionHistoryModal() {
    const isOpen = useUIStore((s) => s.versionModal.isOpen);
    const canvasId = useUIStore((s) => s.versionModal.canvasId);
    const closeVersionHistory = useUIStore((s) => s.closeVersionHistory);

    const [versions, setVersions] = useState<CanvasVersion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [restoringId, setRestoringId] = useState<string | null>(null);

    const loadVersions = useCallback(async () => {
        if (!canvasId) return;
        setIsLoading(true);
        setErrorMsg(null);
        try {
            setVersions(await listCanvasVersions(canvasId));
        } catch (error) {
            console.error("Failed to load version history:", error);
            setErrorMsg(error instanceof Error ? error.message : "Failed to load version history.");
        } finally {
            setIsLoading(false);
        }
    }, [canvasId]);

    useEffect(() => {
        if (isOpen) void loadVersions();
    }, [isOpen, loadVersions]);

    if (!canvasId) return null;

    async function handleRestore(versionId: string) {
        if (!canvasId) return;
        setRestoringId(versionId);
        setErrorMsg(null);
        try {
            await restoreCanvasVersion(canvasId, versionId);
            closeVersionHistory();
        } catch (error) {
            console.error("Failed to restore version:", error);
            setErrorMsg(error instanceof Error ? error.message : "Failed to restore version.");
        } finally {
            setRestoringId(null);
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) closeVersionHistory();
            }}
            width={520}
        >
            <Layout
                header={
                    <DialogHeader
                        title="Version history"
                        startContent={<Icon icon={History} size="sm" />}
                        onOpenChange={(open) => {
                            if (!open) closeVersionHistory();
                        }}
                    />
                }
                content={
                    <LayoutContent padding={4}>
                        <VStack gap={3}>
                            <Text type="supporting">
                                Snapshots are recorded automatically every few minutes while you
                                edit. Restoring replaces the current canvas.
                            </Text>
                            <Divider />
                            {isLoading ? (
                                <HStack gap={2} align="center">
                                    <Icon icon={Loader2} size="sm" />
                                    <Text type="supporting">Loading versions…</Text>
                                </HStack>
                            ) : versions.length > 0 ? (
                                <VStack gap={2}>
                                    {versions.map((version) => (
                                        <HStack key={version.id} justify="between" align="center">
                                            <VStack gap={0}>
                                                <Text weight="medium" maxLines={1}>
                                                    {version.title || "Untitled"}
                                                </Text>
                                                <Text type="supporting">
                                                    {formatVersionDate(version.createdAt)}
                                                    {version.createdBy
                                                        ? ` · by ${version.createdBy}`
                                                        : ""}
                                                </Text>
                                            </VStack>
                                            <Button
                                                label="Restore"
                                                variant="ghost"
                                                size="sm"
                                                icon={<Icon icon={RotateCcw} size="sm" />}
                                                isLoading={restoringId === version.id}
                                                isDisabled={restoringId !== null}
                                                onClick={() => handleRestore(version.id)}
                                            />
                                        </HStack>
                                    ))}
                                </VStack>
                            ) : (
                                <Text type="supporting">
                                    {errorMsg ??
                                        "No versions yet — keep editing and snapshots will appear here."}
                                </Text>
                            )}
                            {errorMsg && versions.length > 0 && (
                                <Text type="supporting">{errorMsg}</Text>
                            )}
                        </VStack>
                    </LayoutContent>
                }
            />
        </Dialog>
    );
}