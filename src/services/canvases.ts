import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";
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
}

export interface CanvasData extends Canvas {
    elements: ExcalidrawElement[];
    appState: Partial<AppState>;
}

const CANVAS_UPDATED_EVENT = "canvas-updated";

function notifyCanvasUpdated() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(CANVAS_UPDATED_EVENT));
}

function toCanvasData(row: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    owner: string;
    isOwner: boolean;
    sharedWith: string[];
    elements?: unknown;
    appState?: unknown;
}): CanvasData {
    return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        owner: row.owner,
        isOwner: row.isOwner,
        sharedWith: row.sharedWith || [],
        elements: Array.isArray(row.elements) ? (row.elements as ExcalidrawElement[]) : [],
        appState: (row.appState as Partial<AppState>) ?? {},
    };
}

export async function listCanvases(): Promise<Canvas[]> {
    return client.canvases.list();
}

export async function createCanvas(title: string): Promise<Canvas> {
    const canvas = await client.canvases.create({ title });
    notifyCanvasUpdated();
    publishCanvasEvent();
    publishCanvasListChanged();
    return canvas;
}

export async function deleteCanvas(id: string): Promise<void> {
    await client.canvases.remove({ id });
    notifyCanvasUpdated();
    publishCanvasEvent();
    publishCanvasListChanged();
}

export async function loadCanvas(id: string): Promise<CanvasData | null> {
    const canvas = await client.canvases.get({ id });
    if (!canvas) return null;
    return toCanvasData(canvas);
}

export async function saveCanvas(
    id: string,
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
): Promise<void> {
    await client.canvases.save({
        id,
        elements: [...elements],
        appState: sanitizeExcalidrawAppState(appState),
    });
    notifyCanvasUpdated();
    publishCanvasEvent();
}

export async function updateCanvasTitle(id: string, title: string): Promise<void> {
    await client.canvases.rename({ id, title });
    notifyCanvasUpdated();
    publishCanvasEvent();
    publishCanvasListChanged();
}

export async function shareCanvas(id: string, targetUsername: string): Promise<void> {
    await client.canvases.share({ id, targetUsername });
    notifyCanvasUpdated();
    publishCanvasEvent();
    publishCanvasListChanged();
}

export async function unshareCanvas(id: string, targetUsername: string): Promise<void> {
    await client.canvases.unshare({ id, targetUsername });
    notifyCanvasUpdated();
    publishCanvasEvent();
    publishCanvasListChanged();
}

export async function listAvailableUsers(): Promise<string[]> {
    return client.canvases.listUsers();
}

/** Keep only the app-state fields we persist, dropping transient editor state. */
export function sanitizeExcalidrawAppState(appState: Partial<AppState>): Partial<AppState> {
    if (!appState || typeof appState !== "object") return {};
    return {
        viewBackgroundColor: appState.viewBackgroundColor,
        gridSize: appState.gridSize,
        zenModeEnabled: appState.zenModeEnabled,
        gridModeEnabled: appState.gridModeEnabled,
        viewModeEnabled: appState.viewModeEnabled,
    };
}