import type { LibraryItem } from "@excalidraw/excalidraw/types";
import type {
	ExcalidrawLibrary,
	ExcalidrawLibraryFile,
	SavedLibrary,
} from "./types";

/** Number of items shown for a saved library (names first, content as fallback). */
export function libraryItemCount(library: SavedLibrary): number {
	if (!library) return 0;
	if (Array.isArray(library.item_names) && library.item_names.length > 0) {
		return library.item_names.length;
	}
	return Array.isArray(library.items) ? library.items.length : 0;
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
		return raw.map((rawItem: any) => {
			const elements = Array.isArray(rawItem)
				? rawItem
				: Array.isArray(rawItem?.elements)
					? rawItem.elements
					: [];
			const id = rawItem?.id || "";
			const status = rawItem?.status || "published";
			const created = rawItem?.created || Date.now();
			const name = rawItem?.name;
			const error = rawItem?.error;

			const elementIds = elements
				.map((element: any) => element?.id)
				.filter(Boolean)
				.sort()
				.join(",");
			const suffix = elementIds
				? hashString(elementIds)
				: hashString(`${libraryId}${id}`);

			return {
				id: `${libraryId}-${suffix}`,
				status,
				elements,
				created,
				name,
				error,
			} as LibraryItem;
		});
	} catch (error) {
		console.error("Failed to normalize library items:", error);
		return [];
	}
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
			lib.authors.some((author) =>
				author.name.toLowerCase().includes(lowerQuery),
			),
	);
}
