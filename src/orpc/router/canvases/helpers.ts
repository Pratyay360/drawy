import { ORPCError } from "@orpc/server";
import type { CanvasAppState, CanvasRow } from "./types";
import { CanvasAppStateSchema, SharedWithFieldSchema } from "./types";

export function parseCanvasAppState(
	raw: Parameters<typeof CanvasAppStateSchema.safeParse>[0],
): CanvasAppState {
	const parsed = CanvasAppStateSchema.safeParse(raw);
	if (!parsed.success) return { sharedWith: [] } satisfies CanvasAppState;
	const shared = SharedWithFieldSchema.safeParse(parsed.data);
	return shared.success
		? shared.data
		: ({ sharedWith: [] } satisfies CanvasAppState);
}

export function getSharedWith(appState: CanvasAppState): string[] {
	return appState.sharedWith;
}

export function toMeta(row: CanvasRow, currentUser?: string) {
	const owner = row.user_id || "Anonymous";
	const sharedWith = getSharedWith(parseCanvasAppState(row.app_state));
	const isOwner = currentUser ? row.user_id === currentUser : false;
	return {
		id: row.id,
		title: row.title,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		owner,
		isOwner,
		sharedWith,
	};
}

export function toData(row: CanvasRow, currentUser?: string) {
	const rawAppState = (
		row.app_state && typeof row.app_state === "object" ? row.app_state : {}
	) as Record<string, unknown>;
	const files = (
		rawAppState.files && typeof rawAppState.files === "object"
			? rawAppState.files
			: {}
	) as Record<string, unknown>;
	return {
		...toMeta(row, currentUser),
		elements: row.elements,
		appState: row.app_state,
		files,
	};
}

export function fail(error: { message: string }): never {
	throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}
