import type { LibraryItem } from "@excalidraw/excalidraw/types";
import { useUIStore } from "#/stores/ui";
import {
	LIBRARY_CONFIG_UPDATED_EVENT,
	LIBRARY_ITEMS_INSTALLED_EVENT,
} from "./constants";

export function notifyLibraryConfigUpdated() {
	globalThis.dispatchEvent(new Event(LIBRARY_CONFIG_UPDATED_EVENT));
}

export function onLibraryConfigUpdated(callback: () => void): () => void {
	globalThis.addEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
	return () =>
		globalThis.removeEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
}

export function notifyLibraryItemsInstalled(items: readonly LibraryItem[]) {
	globalThis.dispatchEvent(
		new CustomEvent(LIBRARY_ITEMS_INSTALLED_EVENT, { detail: items }),
	);
}

export function requestLibraryBrowse(libraryId: string | null): void {
	useUIStore.getState().openLibraryBrowser(libraryId);
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
	return () =>
		globalThis.removeEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
}
