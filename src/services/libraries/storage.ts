import type { LibraryItem } from "@excalidraw/excalidraw/types";
import { SAVED_LIBRARIES_KEY, USER_LIBRARY_KEY } from "./constants";
import { notifyLibraryConfigUpdated, notifyLibraryItemsInstalled } from "./events";
import type { SavedLibrary } from "./types";

export async function getSavedLibraries(): Promise<SavedLibrary[]> {
    try {
        const data = localStorage.getItem(SAVED_LIBRARIES_KEY);
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
    if (typeof window === "undefined") return;
    const saved = await getSavedLibraries();
    const next = saved.filter((lib) => lib.id !== library.id);
    next.push(library);
    localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
    notifyLibraryConfigUpdated();
}

/** Persist fetched content (item names + normalized items) for a saved library. */
export async function saveLibraryContent(
    id: string,
    itemNames: string[],
    items: readonly LibraryItem[],
): Promise<void> {
    // if (typeof window === "undefined") return;
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
    localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
    notifyLibraryConfigUpdated();
}

export async function removeLibraryFromConfig(id: string): Promise<void> {
    const saved = await getSavedLibraries();
    localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(saved.filter((lib) => lib.id !== id)));
    notifyLibraryConfigUpdated();
}

/** The user's full in-editor library (downloaded + hand-added items), persisted. */
export async function getUserLibrary(): Promise<LibraryItem[]> {
    const data = localStorage.getItem(USER_LIBRARY_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
}

export async function setUserLibrary(items: readonly LibraryItem[]): Promise<void> {
    localStorage.setItem(USER_LIBRARY_KEY, JSON.stringify(items));
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
            const existingIds = new Set(current.map((item) => item.id));
            const newItems = items.filter((item) => !existingIds.has(item.id));
            await setUserLibrary([...current, ...newItems]);
        } catch (error) {
            console.error("Failed to persist installed library items:", error);
        }
        notifyLibraryItemsInstalled(items);
    });
    installQueue = task.catch(() => {});
    return task;
}