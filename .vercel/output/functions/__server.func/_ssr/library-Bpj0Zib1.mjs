if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { create } from "../_libs/zustand.mjs";
import { LIBRARIES_API_URL } from "./libraries-DLCIDk6W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-Bpj0Zib1.js
function getLibraryAssetUrl(path) {
	if (!path) return "";
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	return `https://libraries.excalidraw.com/libraries/${path}`;
}
async function fetchLibraries() {
	try {
		const response = await fetch(LIBRARIES_API_URL);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error("Failed to fetch libraries:", error);
		return [];
	}
}
async function fetchLibraryContent(library) {
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
/** Number of items shown for a saved library (names first, content as fallback). */
function libraryItemCount(library) {
	if (!library) return 0;
	if (Array.isArray(library.item_names) && library.item_names.length > 0) return library.item_names.length;
	return Array.isArray(library.items) ? library.items.length : 0;
}
function hashString(input) {
	let hash = 0;
	for (let i = 0; i < input.length; i++) hash = hash * 31 + input.charCodeAt(i) | 0;
	return Math.abs(hash).toString(36);
}
/**
* Normalize a fetched `.excalidrawlib` payload into Excalidraw v2 library items.
* Item ids are content-addressed (`<libraryId>-<hash of element ids>`) so
* re-merging the same content never duplicates items, persisted content stays
* stable across refetches, and upstream reordering of items doesn't shift ids.
*/
async function toLibraryItems(content, libraryId) {
	const raw = content?.libraryItems ?? content?.library;
	if (!Array.isArray(raw)) return [];
	try {
		return raw.map((rawItem) => {
			const elements = Array.isArray(rawItem) ? rawItem : Array.isArray(rawItem?.elements) ? rawItem.elements : [];
			const id = rawItem?.id || "";
			const status = rawItem?.status || "published";
			const created = rawItem?.created || Date.now();
			const name = rawItem?.name;
			const error = rawItem?.error;
			const elementIds = elements.map((element) => element?.id).filter(Boolean).sort().join(",");
			return {
				id: `${libraryId}-${elementIds ? hashString(elementIds) : hashString(`${libraryId}${id}`)}`,
				status,
				elements,
				created,
				name,
				error
			};
		});
	} catch (error) {
		console.error("Failed to normalize library items:", error);
		return [];
	}
}
function searchLibraries(libraries, query) {
	const lowerQuery = query.toLowerCase();
	return libraries.filter((lib) => lib.name.toLowerCase().includes(lowerQuery) || lib.description.toLowerCase().includes(lowerQuery) || lib.authors.some((author) => author.name.toLowerCase().includes(lowerQuery)));
}
var initialState = {
	libraries: [],
	filteredLibraries: [],
	savedLibraries: [],
	savingId: null,
	refreshingId: null,
	removingId: null,
	loading: true,
	savedLoaded: false,
	searchQuery: "",
	browsingId: null,
	pendingBrowseId: null
};
var useLibraryStore = create((set) => ({
	...initialState,
	init: (initialBrowseId) => set({
		browsingId: initialBrowseId,
		pendingBrowseId: initialBrowseId
	}),
	setLibraries: (libraries) => set({ libraries }),
	setFilteredLibraries: (filteredLibraries) => set({ filteredLibraries }),
	setSavedLibraries: (savedLibraries) => set((state) => ({ savedLibraries: typeof savedLibraries === "function" ? savedLibraries(state.savedLibraries) : savedLibraries })),
	setSavingId: (savingId) => set({ savingId }),
	setRefreshingId: (refreshingId) => set({ refreshingId }),
	setRemovingId: (removingId) => set({ removingId }),
	setLoading: (loading) => set({ loading }),
	setSavedLoaded: (savedLoaded) => set({ savedLoaded }),
	setSearchQuery: (searchQuery) => set({ searchQuery }),
	setBrowsingId: (browsingId) => set({ browsingId }),
	setPendingBrowseId: (pendingBrowseId) => set({ pendingBrowseId }),
	reset: () => set({ ...initialState })
}));
//#endregion
export { fetchLibraries, fetchLibraryContent, getLibraryAssetUrl, libraryItemCount, searchLibraries, toLibraryItems, useLibraryStore };
