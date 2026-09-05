import type { AppState } from "@excalidraw/excalidraw/types";

type ElementSignature = { id: string; version: number };

export function areElementsEqual(
	a: ElementSignature[],
	b: ElementSignature[],
): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i].id !== b[i].id || a[i].version !== b[i].version) {
			return false;
		}
	}
	return true;
}

export function areAppStatesEqual(
	a: Partial<AppState>,
	b: Partial<AppState>,
): boolean {
	return (
		a.gridSize === b.gridSize &&
		a.zenModeEnabled === b.zenModeEnabled &&
		a.gridModeEnabled === b.gridModeEnabled &&
		a.viewModeEnabled === b.viewModeEnabled
	);
}

export function getPersistentAppState(
	appState: Partial<AppState>,
): Partial<AppState> {
	if (!appState) return {};
	return {
		viewBackgroundColor: appState.viewBackgroundColor,
		gridSize: appState.gridSize,
		zenModeEnabled: appState.zenModeEnabled,
		gridModeEnabled: appState.gridModeEnabled,
		viewModeEnabled: appState.viewModeEnabled,
	};
}
