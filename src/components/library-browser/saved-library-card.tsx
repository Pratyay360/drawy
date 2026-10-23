import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { BookmarkX, Eye, Library, RefreshCw } from "lucide-react";
import { getLibraryAssetUrl, libraryItemCount, type SavedLibrary } from "../../services/libraries";

interface SavedLibraryCardProps {
    saved: SavedLibrary;
    refreshing: boolean;
    removing: boolean;
    onRefresh: (saved: SavedLibrary) => void;
    onBrowse: (id: string) => void;
    onRemove: (saved: SavedLibrary) => void;
}

function formatFetchedAt(fetchedAt: string | null): string {
    if (!fetchedAt) return "Content not downloaded";
    const date = new Date(fetchedAt);
    if (Number.isNaN(date.getTime())) return "Content not downloaded";
    return `Updated ${date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    })}`;
}

export function SavedLibraryCard({
    saved,
    refreshing,
    removing,
    onRefresh,
    onBrowse,
    onRemove,
}: SavedLibraryCardProps) {
    return (
        <Card padding={3}>
            <VStack gap={2}>
                <HStack gap={3} align="center">
                    {saved.preview ? (
                        <img
                            src={getLibraryAssetUrl(saved.preview)}
                            alt={`${saved.name} preview`}
                            className="h-10 w-20 shrink-0 rounded object-cover"
                        />
                    ) : (
                        <Card variant="muted" width={80} height={40} padding={1}>
                            <Center>
                                <Icon icon={Library} size="sm" />
                            </Center>
                        </Card>
                    )}
                    <VStack gap={0} width="100%">
                        <Text weight="medium" maxLines={1}>
                            {saved.name}
                        </Text>
                        <Text type="supporting">
                            {libraryItemCount(saved)} items · {formatFetchedAt(saved.fetched_at)}
                        </Text>
                    </VStack>
                </HStack>
                <HStack gap={1}>
                    <Button
                        label="Refresh"
                        variant="ghost"
                        size="sm"
                        icon={<Icon icon={RefreshCw} size="sm" />}
                        isLoading={refreshing}
                        isDisabled={removing}
                        onClick={() => onRefresh(saved)}
                        tooltip="Download latest content"
                    />
                    <Button
                        label="Browse"
                        variant="ghost"
                        size="sm"
                        icon={<Icon icon={Eye} size="sm" />}
                        isDisabled={refreshing || removing}
                        onClick={() => onBrowse(saved.id)}
                        tooltip={`Browse items in ${saved.name}`}
                    />
                    <Button
                        label="Remove"
                        variant="ghost"
                        size="sm"
                        icon={<Icon icon={BookmarkX} size="sm" />}
                        isLoading={removing}
                        isDisabled={refreshing}
                        onClick={() => onRemove(saved)}
                        tooltip="Remove bookmark (items stay in your library panel)"
                    />
                </HStack>
            </VStack>
        </Card>
    );
}