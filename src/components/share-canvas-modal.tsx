import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Switch } from "@astryxdesign/core/Switch";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Token } from "@astryxdesign/core/Token";
import { Check, Copy, Loader2, Share2, UserPlus, UserX } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useUIStore } from "#/stores/ui";
import {
    listAvailableUsers,
    setCanvasPublic,
    shareCanvas,
    unshareCanvas,
} from "../services/canvases";

export function ShareCanvasModal() {
    const isOpen = useUIStore((s) => s.shareModal.isOpen);
    const canvasId = useUIStore((s) => s.shareModal.canvasId);
    const owner = useUIStore((s) => s.shareModal.owner);
    const isOwner = useUIStore((s) => s.shareModal.isOwner);
    const sharedWith = useUIStore((s) => s.shareModal.sharedWith);
    const isPublic = useUIStore((s) => s.shareModal.isPublic);
    const targetUser = useUIStore((s) => s.shareModal.targetUser);
    const availableUsers = useUIStore((s) => s.shareModal.availableUsers);
    const isSharing = useUIStore((s) => s.shareModal.isSharing);
    const isTogglingPublic = useUIStore((s) => s.shareModal.isTogglingPublic);
    const unsharingUser = useUIStore((s) => s.shareModal.unsharingUser);
    const errorMsg = useUIStore((s) => s.shareModal.errorMsg);
    const copied = useUIStore((s) => s.shareModal.copied);
    const publicCopied = useUIStore((s) => s.shareModal.publicCopied);
    const closeShareCanvas = useUIStore((s) => s.closeShareCanvas);
    const setShareTargetUser = useUIStore((s) => s.setShareTargetUser);
    const setShareAvailableUsers = useUIStore((s) => s.setShareAvailableUsers);
    const setShareIsSharing = useUIStore((s) => s.setShareIsSharing);
    const setShareIsTogglingPublic = useUIStore((s) => s.setShareIsTogglingPublic);
    const setShareIsPublic = useUIStore((s) => s.setShareIsPublic);
    const setShareUnsharingUser = useUIStore((s) => s.setShareUnsharingUser);
    const setShareErrorMsg = useUIStore((s) => s.setShareErrorMsg);
    const setShareCopied = useUIStore((s) => s.setShareCopied);
    const setSharePublicCopied = useUIStore((s) => s.setSharePublicCopied);

    const onOpenChange = (open: boolean) => {
        if (!open) closeShareCanvas();
    };
    const onShareChange = () => {
        globalThis.dispatchEvent(new Event("canvas-updated"));
    };

    const loadUsers = useCallback(async () => {
        try {
            const users = await listAvailableUsers();
            setShareAvailableUsers(users);
        } catch (error) {
            console.error("Failed to load users for sharing:", error);
        }
    }, [setShareAvailableUsers]);

    useEffect(() => {
        if (isOpen) {
            void loadUsers();
            setShareErrorMsg(null);
            setShareTargetUser("");
            setShareCopied(false);
        }
    }, [isOpen, loadUsers, setShareErrorMsg, setShareTargetUser, setShareCopied]);

    if (!canvasId) return null;

    async function handleAddShare(usernameToShare: string) {
        if (!canvasId) return;
        const username = usernameToShare.trim();
        if (!username) return;
        setShareIsSharing(true);
        setShareErrorMsg(null);
        try {
            await shareCanvas(canvasId, username);
            setShareTargetUser("");
            onShareChange();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to share canvas.";
            setShareErrorMsg(message);
        } finally {
            setShareIsSharing(false);
        }
    }

    async function handleRemoveShare(usernameToRemove: string) {
        if (!canvasId) return;
        setShareUnsharingUser(usernameToRemove);
        setShareErrorMsg(null);
        try {
            await unshareCanvas(canvasId, usernameToRemove);
            onShareChange();
        } catch (error: unknown) {
            throw new Error(`${error}`);
        } finally {
            setShareUnsharingUser(null);
        }
    }

    function handleCopyLink() {
        const url = `${window.location.origin}/canvas/${canvasId}`;
        void navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    }

    function handleCopyPublicLink() {
        const url = `${window.location.origin}/view/${canvasId}`;
        void navigator.clipboard.writeText(url);
        setSharePublicCopied(true);
        setTimeout(() => setSharePublicCopied(false), 2000);
    }

    async function handleTogglePublic(next: boolean) {
        if (!canvasId || !isOwner) return;
        setShareIsTogglingPublic(true);
        setShareErrorMsg(null);
        try {
            await setCanvasPublic(canvasId, next);
            setShareIsPublic(next);
            onShareChange();
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to update link sharing.";
            setShareErrorMsg(message);
        } finally {
            setShareIsTogglingPublic(false);
        }
    }

    const unsharedAvailableUsers = availableUsers.filter(
        (u) => u !== owner && !sharedWith.includes(u),
    );

    return (
        <Dialog isOpen={isOpen} onOpenChange={onOpenChange} width={520}>
            <Layout
                header={
                    <DialogHeader
                        title="Share canvas"
                        startContent={<Icon icon={Share2} size="sm" />}
                        onOpenChange={onOpenChange}
                    />
                }
                content={
                    <LayoutContent padding={4}>
                        <VStack gap={4}>
                            {/* Link section */}
                            <VStack gap={2}>
                                <Text weight="medium">Canvas Link</Text>
                                <HStack gap={2} align="center">
                                    <TextInput
                                        label="Canvas link"
                                        isLabelHidden
                                        value={`${window.location.origin}/canvas/${canvasId}`}
                                        isReadOnly
                                        width="100%"
                                        size="sm"
                                    />
                                    <Button
                                        label={copied ? "Copied" : "Copy link"}
                                        variant="secondary"
                                        size="sm"
                                        icon={<Icon icon={copied ? Check : Copy} size="sm" />}
                                        onClick={handleCopyLink}
                                    />
                                </HStack>
                            </VStack>

                            <Divider />

                            {/* Public link section — read-only, no account needed */}
                            <VStack gap={2}>
                                <Switch
                                    label="Anyone with the link can view"
                                    description="read-only share."
                                    value={isPublic}
                                    onChange={(checked) => void handleTogglePublic(checked)}
                                    isLoading={isTogglingPublic}
                                    isDisabled={!isOwner}
                                    disabledMessage={
                                        !isOwner
                                            ? "Only the owner can manage link sharing."
                                            : undefined
                                    }
                                />
                                {isPublic && (
                                    <HStack gap={2} align="center">
                                        <TextInput
                                            label="Public view link"
                                            isLabelHidden
                                            value={`${window.location.origin}/view/${canvasId}`}
                                            isReadOnly
                                            width="100%"
                                            size="sm"
                                        />
                                        <Button
                                            label={publicCopied ? "Copied" : "Copy link"}
                                            variant="secondary"
                                            size="sm"
                                            icon={
                                                <Icon
                                                    icon={publicCopied ? Check : Copy}
                                                    size="sm"
                                                />
                                            }
                                            onClick={handleCopyPublicLink}
                                        />
                                    </HStack>
                                )}
                            </VStack>

                            <Divider />

                            {/* Add User Section */}
                            {isOwner && (
                                <VStack gap={2}>
                                    <Text weight="medium">Share with people</Text>
                                    <HStack gap={2} align="center">
                                        <TextInput
                                            label="Target username"
                                            isLabelHidden
                                            placeholder="Enter username..."
                                            value={targetUser}
                                            onChange={(val) => setShareTargetUser(val)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && targetUser.trim()) {
                                                    void handleAddShare(targetUser);
                                                }
                                            }}
                                            size="sm"
                                            width="100%"
                                        />
                                        <Button
                                            label="Share"
                                            size="sm"
                                            icon={<Icon icon={UserPlus} size="sm" />}
                                            isLoading={isSharing}
                                            isDisabled={!targetUser.trim()}
                                            onClick={() => handleAddShare(targetUser)}
                                        />
                                    </HStack>

                                    {unsharedAvailableUsers.length > 0 && (
                                        <VStack gap={1}>
                                            <Text type="supporting">Registered users:</Text>
                                            <HStack gap={1} wrap="wrap">
                                                {unsharedAvailableUsers.map((user) => (
                                                    <Button
                                                        key={user}
                                                        label={`+ ${user}`}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShareTargetUser(user);
                                                            void handleAddShare(user);
                                                        }}
                                                    />
                                                ))}
                                            </HStack>
                                        </VStack>
                                    )}

                                    {errorMsg && <Text type="supporting">{errorMsg}</Text>}
                                </VStack>
                            )}

                            {isOwner && <Divider />}

                            {/* People with access list */}
                            <VStack gap={2}>
                                <Text weight="medium">People with access</Text>
                                <VStack gap={2}>
                                    {/* Owner item */}
                                    <HStack justify="between" align="center">
                                        <VStack gap={0}>
                                            <Text weight="medium">{owner}</Text>
                                            <Text type="supporting">Canvas Owner</Text>
                                        </VStack>
                                        <Token label="Owner" />
                                    </HStack>

                                    {/* Shared users */}
                                    {sharedWith.map((user) => (
                                        <HStack key={user} justify="between" align="center">
                                            <VStack gap={0}>
                                                <Text weight="medium">{user}</Text>
                                                <Text type="supporting">Can view and edit</Text>
                                            </VStack>
                                            {isOwner &&
                                                (unsharingUser === user ? (
                                                    <Icon icon={Loader2} size="sm" />
                                                ) : (
                                                    <IconButton
                                                        label={`Remove ${user}`}
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<Icon icon={UserX} size="sm" />}
                                                        onClick={() => handleRemoveShare(user)}
                                                        tooltip="Remove access"
                                                    />
                                                ))}
                                        </HStack>
                                    ))}

                                    {sharedWith.length === 0 && (
                                        <Text type="supporting">Not shared with anyone yet.</Text>
                                    )}
                                </VStack>
                            </VStack>
                        </VStack>
                    </LayoutContent>
                }
            />
        </Dialog>
    );
}