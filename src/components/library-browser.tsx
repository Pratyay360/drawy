import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { Section } from "@astryxdesign/core/Section";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from "@astryxdesign/core/Table";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import {
    BookmarkCheck,
    BookmarkPlus,
    BookmarkX,
    Eye,
    Library,
    Loader2,
    RefreshCw,
    Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
    type ExcalidrawLibrary,
    fetchLibraries,
    fetchLibraryContent,
    getLibraryAssetUrl,
    getSavedLibraries,
    installLibraryItems,
    libraryItemCount,
    onLibraryConfigUpdated,
    removeLibraryFromConfig,
    type SavedLibrary,
    saveLibraryContent,
    saveLibraryToConfig,
    searchLibraries,
    toLibraryItems,
} from "../services/libraries.ts";
import { LibraryItemBrowser } from "./library-item-browser.tsx";

interface LibraryBrowserProps {
    onLibrarySelect?: (library: ExcalidrawLibrary) => void;
    initialBrowseId?: string | null;
    source?: "sidebar" | "canvas";
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

export function LibraryBrowser({
    onLibrarySelect,
    initialBrowseId = null,
    source = "canvas",
}: LibraryBrowserProps) {
    const [libraries, setLibraries] = useState<ExcalidrawLibrary[]>([]);
    const [filteredLibraries, setFilteredLibraries] = useState<ExcalidrawLibrary[]>([]);
    const [savedLibraries, setSavedLibraries] = useState<SavedLibrary[]>([]);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [refreshingId, setRefreshingId] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [savedLoaded, setSavedLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [browsingId, setBrowsingId] = useState<string | null>(initialBrowseId);
    const [pendingBrowseId, setPendingBrowseId] = useState<string | null>(initialBrowseId);

    const refreshSaved = useCallback(async () => {
        const saved = await getSavedLibraries();
        setSavedLibraries(saved);
        setSavedLoaded(true);
    }, []);

    useEffect(() => {
        if (pendingBrowseId == null) return;
        if (savedLibraries.some((lib) => lib.id === pendingBrowseId)) {
            setBrowsingId(pendingBrowseId);
            setPendingBrowseId(null);
        } else if (savedLoaded) {
            // The library isn't saved anymore — fall back to the main view.
            setPendingBrowseId(null);
        }
    }, [pendingBrowseId, savedLibraries, savedLoaded]);

    useEffect(() => {
        void fetchLibraries().then((libs) => {
            setLibraries(libs);
            setFilteredLibraries(libs);
            setLoading(false);
        });
        void refreshSaved();
        return onLibraryConfigUpdated(() => {
            void refreshSaved();
        });
    }, [refreshSaved]);

    useEffect(() => {
        if (searchQuery) {
            setFilteredLibraries(searchLibraries(libraries, searchQuery));
        } else {
            setFilteredLibraries(libraries);
        }
    }, [searchQuery, libraries]);

    const isSaved = useCallback(
        (libraryId: string) => savedLibraries.some((lib) => lib.id === libraryId),
        [savedLibraries],
    );

    async function handleToggleSave(library: ExcalidrawLibrary) {
        if (isSaved(library.id)) {
            try {
                await removeLibraryFromConfig(library.id);
                setSavedLibraries((prev) => prev.filter((lib) => lib.id !== library.id));
            } catch (error) {
                console.error("Failed to remove library from config:", error);
            }
            return;
        }

        setSavingId(library.id);
        try {
            const saved: SavedLibrary = {
                id: library.id,
                name: library.name,
                description: library.description,
                authors: library.authors,
                source: library.source,
                preview: library.preview,
                created: library.created,
                updated: library.updated,
                version: library.version,
                item_names: library.itemNames || [],
                items: [],
                fetched_at: null,
            };
            await saveLibraryToConfig(saved);
            setSavedLibraries((prev) => [...prev.filter((lib) => lib.id !== library.id), saved]);
            const content = await fetchLibraryContent(library);
            if (content) {
                const items = await toLibraryItems(content, library.id);
                await saveLibraryContent(library.id, library.itemNames || [], items);
                await installLibraryItems(items);
                await refreshSaved();
            }
        } catch (error) {
            console.error("Failed to save library to config:", error);
        } finally {
            setSavingId(null);
        }
    }

    async function handleRefreshLibrary(saved: SavedLibrary) {
        setRefreshingId(saved.id);
        try {
            const catalogLibrary = libraries.find((lib) => lib.id === saved.id);
            const library: ExcalidrawLibrary = catalogLibrary ?? {
                id: saved.id,
                name: saved.name,
                description: saved.description,
                authors: saved.authors,
                source: saved.source,
                preview: saved.preview,
                created: saved.created,
                updated: saved.updated,
                version: saved.version,
            };
            const content = await fetchLibraryContent(library);
            if (content) {
                const items = await toLibraryItems(content, saved.id);
                await saveLibraryContent(saved.id, library.itemNames || [], items);
                await installLibraryItems(items);
            }
            await refreshSaved();
        } catch (error) {
            console.error("Failed to refresh library:", error);
        } finally {
            setRefreshingId(null);
        }
    }

    async function handleRemoveLibrary(saved: SavedLibrary) {
        setRemovingId(saved.id);
        try {
            await removeLibraryFromConfig(saved.id);
            setSavedLibraries((prev) => prev.filter((lib) => lib.id !== saved.id));
        } catch (error) {
            console.error("Failed to remove library from config:", error);
        } finally {
            setRemovingId(null);
        }
    }

    const browsingLibrary = savedLibraries.find((lib) => lib.id === browsingId) ?? null;

    if (loading || (pendingBrowseId != null && !savedLoaded)) {
        return (
            <Center>
                <Icon icon={Loader2} size="lg" />
            </Center>
        );
    }

    if (browsingLibrary) {
        return (
            <LibraryItemBrowser
                library={browsingLibrary}
                source={source}
                onBack={() => setBrowsingId(null)}
                onRefreshContent={() => handleRefreshLibrary(browsingLibrary)}
            />
        );
    }

    return (
        <VStack gap={5}>
            <VStack gap={1}>
                <Heading level={2}>Excalidraw Libraries</Heading>
                <Text type="supporting">
                    Save a library to download its components into your library panel — they stay
                    available offline
                </Text>
            </VStack>

            {savedLibraries.length > 0 && (
                <Section>
                    <HStack gap={2} vAlign="center">
                        <Heading level={3}>Saved libraries</Heading>
                        <Text type="supporting">({savedLibraries.length})</Text>
                    </HStack>
                    <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
                        {savedLibraries.map((saved) => {
                            const refreshing = refreshingId === saved.id;
                            const removing = removingId === saved.id;
                            return (
                                <Card key={saved.id} padding={3}>
                                    <VStack gap={2}>
                                        <HStack gap={3} align="center">
                                            {saved.preview ? (
                                                <img
                                                    src={getLibraryAssetUrl(saved.preview)}
                                                    alt={`${saved.name} preview`}
                                                    className="h-10 w-20 shrink-0 rounded object-cover"
                                                />
                                            ) : (
                                                <Card
                                                    variant="muted"
                                                    width={80}
                                                    height={40}
                                                    padding={1}
                                                >
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
                                                    {libraryItemCount(saved)} items ·{" "}
                                                    {formatFetchedAt(saved.fetched_at)}
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
                                                onClick={() => handleRefreshLibrary(saved)}
                                                tooltip="Download latest content"
                                            />
                                            <Button
                                                label="Browse"
                                                variant="ghost"
                                                size="sm"
                                                icon={<Icon icon={Eye} size="sm" />}
                                                isDisabled={refreshing || removing}
                                                onClick={() => setBrowsingId(saved.id)}
                                                tooltip={`Browse items in ${saved.name}`}
                                            />
                                            <Button
                                                label="Remove"
                                                variant="ghost"
                                                size="sm"
                                                icon={<Icon icon={BookmarkX} size="sm" />}
                                                isLoading={removing}
                                                isDisabled={refreshing}
                                                onClick={() => handleRemoveLibrary(saved)}
                                                tooltip="Remove bookmark (items stay in your library panel)"
                                            />
                                        </HStack>
                                    </VStack>
                                </Card>
                            );
                        })}
                    </Grid>
                </Section>
            )}

            <Section>
                <Heading level={3}>Browse libraries</Heading>
                <TextInput
                    label="Search libraries"
                    isLabelHidden
                    placeholder="Search libraries..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    startIcon={Search}
                    hasClear
                    width={320}
                />
                <Table density="compact" hasHover dividers="rows">
                    <TableHeader>
                        <TableRow isHeaderRow>
                            <TableHeaderCell>Preview</TableHeaderCell>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Description</TableHeaderCell>
                            <TableHeaderCell>Author</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLibraries.map((library, index) => {
                            const saved = savedLibraries.find((lib) => lib.id === library.id);
                            const saving = savingId === library.id;
                            return (
                                <TableRow
                                    key={library.id ?? `${library.source}-${index}`}
                                    onClick={() => onLibrarySelect?.(library)}
                                >
                                    <TableCell>
                                        {library.preview && (
                                            <img
                                                src={getLibraryAssetUrl(library.preview)}
                                                alt={`${library.name} preview`}
                                                className="h-12 w-16 rounded object-cover"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Text weight="medium" maxLines={1}>
                                            {library.name}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text type="supporting" maxLines={1}>
                                            {library.description}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text maxLines={1}>
                                            {library.authors[0]?.name || "Unknown"}
                                        </Text>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            label={
                                                saved ? `${libraryItemCount(saved)} items` : "Save"
                                            }
                                            variant="ghost"
                                            size="sm"
                                            icon={
                                                saving ? (
                                                    <Icon icon={Loader2} size="sm" />
                                                ) : saved ? (
                                                    <Icon icon={BookmarkCheck} size="sm" />
                                                ) : (
                                                    <Icon icon={BookmarkPlus} size="sm" />
                                                )
                                            }
                                            isLoading={saving}
                                            onClick={() => handleToggleSave(library)}
                                            tooltip={
                                                saved
                                                    ? `Remove ${library.name}`
                                                    : `Save ${library.name}`
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {filteredLibraries.length === 0 && (
                    <Text type="supporting" justify="center">
                        No libraries found matching your search.
                    </Text>
                )}

                <Text type="supporting">
                    {filteredLibraries.length} of {libraries.length} libraries ·{" "}
                    {savedLibraries.length} saved
                </Text>
            </Section>
        </VStack>
    );
}