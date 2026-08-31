import { Center } from "@astryxdesign/core/Center";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { Section } from "@astryxdesign/core/Section";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Loader2, Search } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect } from "react";
import { useLibraryStore } from "#/stores/library";
import {
    type ExcalidrawLibrary,
    fetchLibraries,
    fetchLibraryContent,
    getSavedLibraries,
    installLibraryItems,
    onLibraryConfigUpdated,
    removeLibraryFromConfig,
    type SavedLibrary,
    saveLibraryContent,
    saveLibraryToConfig,
    searchLibraries,
    toLibraryItems,
} from "../../services/libraries";
import { LibraryTable } from "./library-table";
import { SavedLibraryCard } from "./saved-library-card";

const LibraryItemBrowser = lazy(() =>
    import("../library-item-browser.tsx").then((m) => ({
        default: m.LibraryItemBrowser,
    })),
);

interface LibraryBrowserProps {
    onLibrarySelect?: (library: ExcalidrawLibrary) => void;
    initialBrowseId?: string | null;
    source?: "sidebar" | "canvas";
}

export function LibraryBrowser({
    onLibrarySelect,
    initialBrowseId = null,
    source = "canvas",
}: LibraryBrowserProps) {
    const libraries = useLibraryStore((s) => s.libraries);
    const filteredLibraries = useLibraryStore((s) => s.filteredLibraries);
    const savedLibraries = useLibraryStore((s) => s.savedLibraries);
    const savingId = useLibraryStore((s) => s.savingId);
    const refreshingId = useLibraryStore((s) => s.refreshingId);
    const removingId = useLibraryStore((s) => s.removingId);
    const loading = useLibraryStore((s) => s.loading);
    const savedLoaded = useLibraryStore((s) => s.savedLoaded);
    const searchQuery = useLibraryStore((s) => s.searchQuery);
    const browsingId = useLibraryStore((s) => s.browsingId);
    const pendingBrowseId = useLibraryStore((s) => s.pendingBrowseId);
    const {
        init,
        setLibraries,
        setFilteredLibraries,
        setSavedLibraries,
        setSavingId,
        setRefreshingId,
        setRemovingId,
        setLoading,
        setSavedLoaded,
        setSearchQuery,
        setBrowsingId,
        setPendingBrowseId,
    } = useLibraryStore.getState();

    const refreshSaved = useCallback(async () => {
        const saved = await getSavedLibraries();
        setSavedLibraries(saved);
        setSavedLoaded(true);
    }, [setSavedLibraries, setSavedLoaded]);

    // Seed browse state whenever the modal is (re)opened at a different library.
    useEffect(() => {
        init(initialBrowseId);
    }, [initialBrowseId, init]);

    useEffect(() => {
        if (pendingBrowseId == null) return;
        if (savedLibraries.some((lib) => lib.id === pendingBrowseId)) {
            setBrowsingId(pendingBrowseId);
            setPendingBrowseId(null);
        } else if (savedLoaded) {
            setPendingBrowseId(null);
        }
    }, [pendingBrowseId, savedLibraries, savedLoaded, setBrowsingId, setPendingBrowseId]);

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
    }, [refreshSaved, setLibraries, setFilteredLibraries, setLoading]);

    useEffect(() => {
        if (searchQuery) {
            setFilteredLibraries(searchLibraries(libraries, searchQuery));
        } else {
            setFilteredLibraries(libraries);
        }
    }, [searchQuery, libraries, setFilteredLibraries]);

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
                fetched_at: "",
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
            <Suspense
                fallback={
                    <Center>
                        <Icon icon={Loader2} size="lg" />
                    </Center>
                }
            >
                <LibraryItemBrowser
                    library={browsingLibrary}
                    source={source}
                    onBack={() => setBrowsingId(null)}
                    onRefreshContent={() => handleRefreshLibrary(browsingLibrary)}
                />
            </Suspense>
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
                        {savedLibraries.map((saved) => (
                            <SavedLibraryCard
                                key={saved.id}
                                saved={saved}
                                refreshing={refreshingId === saved.id}
                                removing={removingId === saved.id}
                                onRefresh={handleRefreshLibrary}
                                onBrowse={(id) => setBrowsingId(id)}
                                onRemove={handleRemoveLibrary}
                            />
                        ))}
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
                <LibraryTable
                    libraries={libraries}
                    filteredLibraries={filteredLibraries}
                    savedLibraries={savedLibraries}
                    savingId={savingId}
                    onLibrarySelect={onLibrarySelect}
                    onToggleSave={handleToggleSave}
                />
            </Section>
        </VStack>
    );
}