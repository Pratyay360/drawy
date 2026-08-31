import type { LibraryItem } from "@excalidraw/excalidraw/types";

export interface ExcalidrawLibraryFile {
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
    items: LibraryItem[];
    fetched_at: string;
}