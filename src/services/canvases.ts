import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { client } from "#/orpc/client";
import { publishCanvasListChanged } from "#/utils/canvas-realtime";
import { publishCanvasEvent } from "#/utils/realtime";

export interface Canvas {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    owner: string;
    isOwner: boolean;
    sharedWith: string[];
    isPublic: boolean;
}

export interface CanvasVersion {
    id: string;
    title: string;
    createdAt: string;
    createdBy: string | null;
}

export interface CanvasData extends Canvas {
    elements: ExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
}

const CANVAS_UPDATED_EVENT = "canvas-updated";

function publishCanvasUpdated() {
	dispatchEvent(new Event(CANVAS_UPDATED_EVENT));
	publishCanvasEvent();
}

function publishCanvasListUpdated() {
	publishCanvasUpdated();
	publishCanvasListChanged();
}

function toCanvasData(row: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    owner: string;
    isOwner: boolean;
    sharedWith: string[];
    isPublic: boolean;
    elements?: unknown;
    appState?: unknown;
    files?: unknown;
}): CanvasData {
    return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        owner: row.owner,
        isOwner: row.isOwner,
        sharedWith: row.sharedWith,
        isPublic: row.isPublic,
        elements: Array.isArray(row.elements) ? (row.elements as ExcalidrawElement[]) : [],
		appState: (row.appState ?? {}) as Partial<AppState>,
		files: (row.files ?? {}) as BinaryFiles,
    };
}

export async function listCanvases(): Promise<Canvas[]> {
    return client.canvases.list();
}

export async function createCanvas(title: string): Promise<Canvas> {
	const canvas = await client.canvases.create({ title });
	publishCanvasListUpdated();
    return canvas;
}

export async function deleteCanvas(id: string): Promise<void> {
	await client.canvases.remove({ id });
	publishCanvasListUpdated();
}

export async function loadCanvas(id: string): Promise<CanvasData | null> {
    const canvas = await client.canvases.get({ id });
    if (!canvas) return null;
    return toCanvasData(canvas);
}

/** Anonymous read-only load. Returns null unless the owner enabled link sharing. */
export async function loadPublicCanvas(id: string): Promise<CanvasData | null> {
    const canvas = await client.canvases.getPublic({ id });
    if (!canvas) return null;
    return toCanvasData(canvas);
}

export async function setCanvasPublic(id: string, isPublic: boolean): Promise<void> {
    await client.canvases.setPublic({ id, isPublic });
	publishCanvasListUpdated();
}

export async function listCanvasVersions(canvasId: string): Promise<CanvasVersion[]> {
    return client.canvases.versions.list({ canvasId });
}

export async function restoreCanvasVersion(canvasId: string, versionId: string): Promise<void> {
	await client.canvases.versions.restore({ canvasId, versionId });
	dispatchEvent(new Event(CANVAS_UPDATED_EVENT));
	publishCanvasEvent({ sceneReplaced: true });
}

export async function saveCanvas(
    id: string,
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
    files?: BinaryFiles,
): Promise<void> {
    await client.canvases.save({
        id,
        elements: [...elements],
        appState: sanitizeExcalidrawAppState(appState),
		files: files ?? {},
	});
	publishCanvasUpdated();
}

export async function updateCanvasTitle(id: string, title: string): Promise<void> {
	await client.canvases.rename({ id, title });
	publishCanvasListUpdated();
}

export async function shareCanvas(id: string, targetUsername: string): Promise<void> {
	await client.canvases.share({ id, targetUsername });
	publishCanvasListUpdated();
}

export async function unshareCanvas(id: string, targetUsername: string): Promise<void> {
	await client.canvases.unshare({ id, targetUsername });
	publishCanvasListUpdated();
}

export async function listAvailableUsers(): Promise<string[]> {
    return client.canvases.listUsers();
}

export async function uploadCanvasAsset(
    canvasId: string,
    fileId: string,
    mimeType: string,
    base64Data: string,
): Promise<{ fileId: string; url: string; mimeType: string }> {
    return client.canvases.uploadAsset({
        canvasId,
        fileId,
        mimeType,
        base64Data,
    });
}

export async function presignAttachment(
    canvasId: string,
    fileId: string,
    mimeType: string,
    sizeBytes: number,
): Promise<{
    url: string;
    key: string;
    publicUrl: string | null;
    enabled: boolean;
}> {
    return client.canvases.presignAttachment({
        canvasId,
        fileId,
        mimeType,
        sizeBytes,
    });
}

export function sanitizeExcalidrawAppState(appState: Partial<AppState>): Partial<AppState> {
	return {
        viewBackgroundColor: appState.viewBackgroundColor,
        gridSize: appState.gridSize,
        zenModeEnabled: appState.zenModeEnabled,
        gridModeEnabled: appState.gridModeEnabled,
        viewModeEnabled: appState.viewModeEnabled,
    };
}
