import { ORPCError } from "@orpc/server";
import type { CanvasAppState, CanvasRow, CanvasVersionRow } from "./types";
import { CanvasAppStateSchema, SharedWithFieldSchema } from "./types";

export function parseCanvasAppState(
    raw: Parameters<typeof CanvasAppStateSchema.safeParse>[0],
): CanvasAppState {
    const parsed = CanvasAppStateSchema.safeParse(raw);
    if (!parsed.success) return { sharedWith: [] } satisfies CanvasAppState;
    const shared = SharedWithFieldSchema.safeParse(parsed.data);
    return shared.success ? shared.data : ({ sharedWith: [] } satisfies CanvasAppState);
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
        isPublic: row.is_public === true,
    };
}

export function toVersionMeta(row: CanvasVersionRow) {
    return {
        id: row.id,
        title: row.title,
        createdAt: row.created_at,
        createdBy: row.created_by,
    };
}

export function canReadCanvas(
    row: Pick<CanvasRow, "user_id" | "app_state" | "is_public">,
    username?: string,
): boolean {
    if (row.is_public === true) return true;
    if (!username) return false;
    if (row.user_id === username) return true;
    return getSharedWith(parseCanvasAppState(row.app_state)).includes(username);
}

export function canWriteCanvas(
    row: Pick<CanvasRow, "user_id" | "app_state">,
    username?: string,
): boolean {
    if (!username) return false;
    if (row.user_id === username) return true;
    return getSharedWith(parseCanvasAppState(row.app_state)).includes(username);
}

/** Record a version-history snapshot at most this often per canvas. */
export const VERSION_SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000;
/** Keep only the newest N snapshots per canvas. */
export const VERSION_RETENTION_LIMIT = 50;

type AdminClient = ReturnType<typeof import("#/utils/server-supabase").createSupabaseAdminClient>;

/** Insert a snapshot row, then trim old snapshots beyond the retention limit. */
export async function recordVersionSnapshot(
    supabase: AdminClient,
    canvasId: string,
    snapshot: {
        title: string;
        elements: unknown;
        appState: unknown;
        createdBy?: string;
    },
) {
    const { error: insertError } = await supabase.from("canvas_versions").insert({
        canvas_id: canvasId,
        title: snapshot.title,
        elements: snapshot.elements,
        app_state: snapshot.appState,
        created_by: snapshot.createdBy ?? null,
    });
    if (insertError) {
        console.error("Failed to record canvas version:", insertError);
        return;
    }
    const { data: oldVersions } = await supabase
        .from("canvas_versions")
        .select("id")
        .eq("canvas_id", canvasId)
        .order("created_at", { ascending: false })
        .range(VERSION_RETENTION_LIMIT, 200);
    const staleIds = (oldVersions ?? []).map((v) => v.id);
    if (staleIds.length > 0) {
        const { error: deleteError } = await supabase
            .from("canvas_versions")
            .delete()
            .in("id", staleIds);
        if (deleteError) {
            console.error("Failed to trim old canvas versions:", deleteError);
        }
    }
}

/** Record a snapshot only if the newest one is older than the interval. */
export async function maybeRecordPeriodicVersion(
    supabase: AdminClient,
    canvasId: string,
    snapshot: {
        title: string;
        elements: unknown;
        appState: unknown;
        createdBy?: string;
    },
) {
    const { data: latest, error } = await supabase
        .from("canvas_versions")
        .select("created_at")
        .eq("canvas_id", canvasId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        console.error("Failed to check canvas version history:", error);
        return;
    }
    if (latest) {
        const age = Date.now() - new Date(latest.created_at).getTime();
        if (Number.isFinite(age) && age < VERSION_SNAPSHOT_INTERVAL_MS) return;
    }
    await recordVersionSnapshot(supabase, canvasId, snapshot);
}

export function toData(row: CanvasRow, currentUser?: string) {
    const rawAppState = (
        row.app_state && typeof row.app_state === "object" ? row.app_state : {}
    ) as Record<string, unknown>;
    const files = (
        rawAppState.files && typeof rawAppState.files === "object" ? rawAppState.files : {}
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