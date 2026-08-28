import { LIBRARIES_API_URL } from "./constants";
import type { ExcalidrawLibrary, ExcalidrawLibraryFile } from "./types";

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
		console.error(
			`Failed to fetch library content for ${library.name}:`,
			error,
		);
		return null;
	}
}
