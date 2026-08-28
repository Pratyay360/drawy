import type { LibraryItem } from "@excalidraw/excalidraw/types";
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

/** Ask the app to open the library browser modal, optionally at a saved library. */
export function requestLibraryBrowse(libraryId: string | null): void {
	// Delegated to the zustand UI store so any component can open the modal
	// without prop drilling or global custom events.
	const { useUIStore } = require("#/stores/ui");
	useUIStore.getState().openLibraryBrowser(libraryId);
}

/** Subscribe to libraries being installed/refreshed so canvases can merge them in. */
export function onLibraryItemsInstalled(
	callback: (items: readonly LibraryItem[]) => void,
): () => void {
	const handler = (event: Event) => {
		// SAFETY: Event dispatched via CustomEvent with items array detail.
		const detail = (event as CustomEvent).detail;
		if (Array.isArray(detail)) callback(detail);
	};
	globalThis.addEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
	return () =>
		globalThis.removeEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
}
