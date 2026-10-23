import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Section } from "@astryxdesign/core/Section";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { ArrowLeft, CloudDownload, Download, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLibraryItemStore } from "#/stores/library-item";
import type { SavedLibrary } from "../../services/libraries";
import { LibraryItemThumbnail } from "./library-item-thumbnail";
import { getItemName, getItemSearchText } from "./utils";

interface LibraryItemBrowserProps {
    library: SavedLibrary;
    source: "sidebar" | "canvas";
    onBack: () => void;
    onRefreshContent: () => Promise<void>;
}

export function LibraryItemBrowser({ library, onBack, onRefreshContent }: LibraryItemBrowserProps) {
    const query = useLibraryItemStore((s) => s.query);
    const refreshing = useLibraryItemStore((s) => s.refreshing);
    const setQuery = useLibraryItemStore((s) => s.setQuery);
    const setRefreshing = useLibraryItemStore((s) => s.setRefreshing);

    const hasContent = Array.isArray(library.items) && library.items.length > 0;
    const items = useMemo(() => {
        const raw = Array.isArray(library.items) ? library.items : [];
        const itemNames = Array.isArray(library.item_names) ? library.item_names : [];
        const lowerQuery = query.trim().toLowerCase();
        return raw
            .map((item, index) => ({
                item,
                name: getItemName(item, index, itemNames),
                searchText: getItemSearchText(item, index, itemNames),
            }))
            .filter(
                ({ name, searchText }) =>
                    !lowerQuery ||
                    name.toLowerCase().includes(lowerQuery) ||
                    searchText.includes(lowerQuery),
            );
    }, [library.items, library.item_names, query]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (query.trim()) {
                setQuery("");
            } else {
                onBack();
            }
        };
        globalThis.addEventListener("keydown", handler);
        return () => globalThis.removeEventListener("keydown", handler);
    }, [query, onBack, setQuery]);

    useEffect(() => () => useLibraryItemStore.getState().reset(), []);

    async function handleRefresh() {
        setRefreshing(true);
        try {
            await onRefreshContent();
        } finally {
            setRefreshing(false);
        }
    }

    return (
        <Section>
            <HStack gap={2} align="center">
                <IconButton
                    label="Back to libraries"
                    variant="ghost"
                    icon={<Icon icon={ArrowLeft} size="sm" />}
                    onClick={onBack}
                    tooltip="Back to libraries"
                />
                <VStack gap={0} width="100%">
                    <HStack gap={2} align="center">
                        <Heading level={2} maxLines={1}>
                            {library.name}
                        </Heading>
                        <Text type="supporting">
                            {hasContent ? `${library.items.length} items` : "No items"}
                        </Text>
                    </HStack>
                    <Text type="supporting" maxLines={1}>
                        {library.description || "Saved library"}
                    </Text>
                </VStack>
                <Button
                    label="Refresh"
                    variant="ghost"
                    size="sm"
                    icon={<Icon icon={RefreshCw} size="sm" />}
                    isLoading={refreshing}
                    onClick={handleRefresh}
                    tooltip="Download latest content"
                />
            </HStack>

            {hasContent ? (
                <VStack gap={3}>
                    <TextInput
                        label={`Search ${library.items.length} items`}
                        isLabelHidden
                        placeholder={`Search ${library.items.length} items...`}
                        value={query}
                        onChange={setQuery}
                        startIcon={Search}
                        hasClear
                    />

                    {items.length > 0 ? (
                        <Grid columns={{ minWidth: 160, max: 4 }} gap={3}>
                            {items.map(({ item, name }, index) => (
                                <Card key={item.id || `${library.id}-${index}`} padding={2}>
                                    <VStack gap={2}>
                                        <Card variant="muted" height={110} padding={1}>
                                            <Center>
                                                <LibraryItemThumbnail
                                                    itemId={item.id || `${library.id}-${index}`}
                                                    elements={item.elements || []}
                                                />
                                            </Center>
                                        </Card>
                                        <Text type="supporting" maxLines={1} justify="center">
                                            {name}
                                        </Text>
                                    </VStack>
                                </Card>
                            ))}
                        </Grid>
                    ) : (
                        <Text type="supporting" justify="center">
                            No items match your search.
                        </Text>
                    )}
                </VStack>
            ) : (
                <Center>
                    <VStack gap={3} hAlign="center">
                        <Icon icon={CloudDownload} size="lg" />
                        <VStack gap={1} hAlign="center">
                            <Text weight="medium">Content not downloaded yet</Text>
                            <Text type="supporting">
                                Download this library to browse and use its items.
                            </Text>
                        </VStack>
                        <Button
                            label="Download items"
                            variant="secondary"
                            size="sm"
                            icon={<Icon icon={Download} size="sm" />}
                            isLoading={refreshing}
                            onClick={handleRefresh}
                        />
                    </VStack>
                </Center>
            )}
        </Section>
    );
}