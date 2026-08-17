import type { LibraryItem, LibraryItems } from "@excalidraw/excalidraw/types";

interface ExcalidrawLibraryFile {
    type?: string;
    libraryItems?: unknown;
    library?: unknown;
}

export interface ExcalidrawLibrary {
    name: string;
    description: string;
    authors: { name: string; url?: string }[];
    source: string;
    preview: string;
    created: string;
    updated: string;
    version: number;
    id: string;
    itemNames?: string[];
}

export interface SavedLibrary {
    id: string;
    name: string;
    description: string;
    authors: { name: string; url?: string }[];
    source: string;
    preview: string;
    created: string;
    updated: string;
    version: number;
    item_names: string[];
    /** Normalized v2 library items persisted locally (empty until content is fetched). */
    items: LibraryItem[];
    /** ISO timestamp of the last successful content fetch, or null. */
    fetched_at: string | null;
}

const LIBRARIES_API_URL = "https://libraries.excalidraw.com/libraries.json";

/** Number of items shown for a saved library (names first, content as fallback). */
export function libraryItemCount(library: SavedLibrary | null | undefined): number {
    if (!library) return 0;
    if (Array.isArray(library.item_names) && library.item_names.length > 0) {
        return library.item_names.length;
    }
    return Array.isArray(library.items) ? library.items.length : 0;
}

const SAVED_LIBRARIES_KEY = "drawy_saved_libraries";
const USER_LIBRARY_KEY = "drawy_user_library";

const LIBRARY_CONFIG_UPDATED_EVENT = "library-config-updated";
const LIBRARY_ITEMS_INSTALLED_EVENT = "library-items-installed";
const LIBRARY_BROWSE_REQUESTED_EVENT = "library-browse-requested";

function notifyLibraryConfigUpdated() {
    globalThis.dispatchEvent(new Event(LIBRARY_CONFIG_UPDATED_EVENT));
}

export function onLibraryConfigUpdated(callback: () => void): () => void {
    globalThis.addEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
    return () => globalThis.removeEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
}

function notifyLibraryItemsInstalled(items: readonly LibraryItem[]) {
    globalThis.dispatchEvent(new CustomEvent(LIBRARY_ITEMS_INSTALLED_EVENT, { detail: items }));
}

/** Ask the app to open the library browser modal, optionally at a saved library. */
export function requestLibraryBrowse(libraryId: string | null): void {
    globalThis.dispatchEvent(
        new CustomEvent(LIBRARY_BROWSE_REQUESTED_EVENT, {
            detail: { libraryId },
        }),
    );
}

export function onLibraryBrowseRequested(callback: (libraryId: string | null) => void): () => void {
    const handler = (event: Event) => {
        const libraryId = (event as CustomEvent).detail?.libraryId ?? null;
        callback(libraryId);
    };
    globalThis.addEventListener(LIBRARY_BROWSE_REQUESTED_EVENT, handler);
    return () => globalThis.removeEventListener(LIBRARY_BROWSE_REQUESTED_EVENT, handler);
}

/** Subscribe to libraries being installed/refreshed so canvases can merge them in. */
export function onLibraryItemsInstalled(
    callback: (items: readonly LibraryItem[]) => void,
): () => void {
    const handler = (event: Event) => {
        const detail = (event as CustomEvent).detail;
        if (Array.isArray(detail)) callback(detail);
    };
    globalThis.addEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
    return () => globalThis.removeEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
}

export function getLibraryAssetUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    return `https://libraries.excalidraw.com/libraries/${path}`;
}

export async function fetchLibraries(): Promise<ExcalidrawLibrary[]> {
    try {
        const response = await fetch(LIBRARIES_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch libraries:", error);
        return [];
    }
}

export async function fetchLibraryContent(
    library: ExcalidrawLibrary,
): Promise<ExcalidrawLibraryFile | null> {
    const contentUrl = getLibraryAssetUrl(library.source);
    try {
        const response = await fetch(contentUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch library content for ${library.name}:`, error);
        return null;
    }
}

function hashString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
}

/**
 * Normalize a fetched `.excalidrawlib` payload into Excalidraw v2 library items.
 * Item ids are content-addressed (`<libraryId>-<hash of element ids>`) so
 * re-merging the same content never duplicates items, persisted content stays
 * stable across refetches, and upstream reordering of items doesn't shift ids.
 */
export async function toLibraryItems(
    content: ExcalidrawLibraryFile | null | undefined,
    libraryId: string,
): Promise<LibraryItem[]> {
    const raw = content?.libraryItems ?? content?.library;
    if (!Array.isArray(raw)) return [];
    try {
        // Lazy import keeps Excalidraw (and its JSON imports) out of the SSR bundle.
        const { restoreLibraryItems } = await import("@excalidraw/excalidraw");
        const restored = restoreLibraryItems(raw, "published") as LibraryItems;
        return restored.map((item) => {
            const elementIds = (item.elements || [])
                .map((element) => element.id)
                .sort()
                .join(",");
            const suffix = elementIds
                ? hashString(elementIds)
                : hashString(`${libraryId}${item.id}`);
            return { ...item, id: `${libraryId}-${suffix}` };
        });
    } catch (error) {
        console.error("Failed to normalize library items:", error);
        return [];
    }
}

export async function getSavedLibraries(): Promise<SavedLibrary[]> {
    if (typeof window === "undefined") return [];
    try {
        const data = window.localStorage.getItem(SAVED_LIBRARIES_KEY);
        if (!data) return [];
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((lib: SavedLibrary) => ({
            ...lib,
            items: Array.isArray(lib.items) ? lib.items : [],
            item_names: Array.isArray(lib.item_names) ? lib.item_names : [],
        }));
    } catch (error) {
        console.error("Failed to parse saved libraries:", error);
        return [];
    }
}

/** Upsert the metadata bookmark for a library (content is managed separately). */
export async function saveLibraryToConfig(library: SavedLibrary): Promise<void> {
    const saved = await getSavedLibraries();
    const next = saved.filter((lib) => lib.id !== library.id);
    next.push(library);
    window.localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
    notifyLibraryConfigUpdated();
}

/** Persist fetched content (item names + normalized items) for a saved library. */
export async function saveLibraryContent(
    id: string,
    itemNames: string[],
    items: readonly LibraryItem[],
): Promise<void> {
    const saved = await getSavedLibraries();
    const next = saved.map((lib) =>
        lib.id === id
            ? {
                  ...lib,
                  item_names: itemNames,
                  items,
                  fetched_at: new Date().toISOString(),
              }
            : lib,
    );
    window.localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
    notifyLibraryConfigUpdated();
}

export async function removeLibraryFromConfig(id: string): Promise<void> {
    const saved = await getSavedLibraries();
    window.localStorage.setItem(
        SAVED_LIBRARIES_KEY,
        JSON.stringify(saved.filter((lib) => lib.id !== id)),
    );
    notifyLibraryConfigUpdated();
}

/** The user's full in-editor library (downloaded + hand-added items), persisted. */
export async function getUserLibrary(): Promise<LibraryItem[]> {
    if (typeof window === "undefined") return [];
    const data = window.localStorage.getItem(USER_LIBRARY_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
}

export async function setUserLibrary(items: readonly LibraryItem[]): Promise<void> {
    window.localStorage.setItem(USER_LIBRARY_KEY, JSON.stringify(items));
}

// Installs are serialized so concurrent saves (e.g. saving two libraries back-
// to-back) can't interleave their read-modify-write and lose items.
let installQueue: Promise<void> = Promise.resolve();

/**
 * Install library items: merge them into the persisted user library (deduped)
 * and notify any mounted canvas to merge them into the editor library.
 */
export function installLibraryItems(items: readonly LibraryItem[]): Promise<void> {
    if (!Array.isArray(items) || items.length === 0) {
        return Promise.resolve();
    }
    const task = installQueue.then(async () => {
        try {
            const current = await getUserLibrary();
            // Lazy import keeps Excalidraw (and its JSON imports) out of the SSR bundle.
            const { mergeLibraryItems } = await import("@excalidraw/excalidraw");
            await setUserLibrary(mergeLibraryItems(current, items));
        } catch (error) {
            console.error("Failed to persist installed library items:", error);
        }
        notifyLibraryItemsInstalled(items);
    });
    installQueue = task.catch(() => {});
    return task;
}

export function searchLibraries(
    libraries: ExcalidrawLibrary[],
    query: string,
): ExcalidrawLibrary[] {
    const lowerQuery = query.toLowerCase();
    return libraries.filter(
        (lib) =>
            lib.name.toLowerCase().includes(lowerQuery) ||
            lib.description.toLowerCase().includes(lowerQuery) ||
            lib.authors.some((author) => author.name.toLowerCase().includes(lowerQuery)),
    );
}