import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "#/utils/server-supabase";
import { base } from "../../context";
import {
    canReadCanvas,
    canWriteCanvas,
    fail,
    recordVersionSnapshot,
    toVersionMeta,
    VERSION_RETENTION_LIMIT,
} from "./helpers";
import type { CanvasRow, CanvasVersionRow } from "./types";

const versionMetaSchema = z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.string(),
    createdBy: z.string().nullable(),
});

async function requireReadableCanvas(
    supabase: ReturnType<typeof createSupabaseAdminClient>,
    canvasId: string,
    username: string | undefined,
) {
    const { data, error } = await supabase
        .from("canvases")
        .select("user_id, app_state, is_public")
        .eq("id", canvasId)
        .maybeSingle();
    if (error) return fail(error);
    if (!data) {
        throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
    }
    const row = data as Pick<CanvasRow, "user_id" | "app_state" | "is_public">;
    if (!canReadCanvas(row, username)) {
        throw new ORPCError("FORBIDDEN", {
            message: "You do not have access to this canvas.",
        });
    }
}

async function requireWritableCanvas(
    supabase: ReturnType<typeof createSupabaseAdminClient>,
    canvasId: string,
    username: string | undefined,
) {
    if (!username) {
        throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
    }
    const { data, error } = await supabase
        .from("canvases")
        .select("user_id, app_state")
        .eq("id", canvasId)
        .maybeSingle();
    if (error) return fail(error);
    if (!data) {
        throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
    }
    const row = data as Pick<CanvasRow, "user_id" | "app_state">;
    if (!canWriteCanvas(row, username)) {
        throw new ORPCError("FORBIDDEN", {
            message: "You do not have permission to edit this canvas.",
        });
    }
}

export const list = base
    .input(z.object({ canvasId: z.string() }))
    .output(z.array(versionMetaSchema))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        const supabase = createSupabaseAdminClient();
        await requireReadableCanvas(supabase, input.canvasId, username);
        const { data, error } = await supabase
            .from("canvas_versions")
            .select("id, title, created_by, created_at")
            .eq("canvas_id", input.canvasId)
            .order("created_at", { ascending: false })
            .limit(VERSION_RETENTION_LIMIT);
        if (error) return fail(error);
        return (data as CanvasVersionRow[]).map(toVersionMeta);
    });

export const get = base
    .input(z.object({ canvasId: z.string(), versionId: z.string() }))
    .output(
        z.object({
            id: z.string(),
            title: z.string(),
            createdAt: z.string(),
            createdBy: z.string().nullable(),
            elements: z.any(),
            appState: z.any(),
        }),
    )
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        const supabase = createSupabaseAdminClient();
        await requireReadableCanvas(supabase, input.canvasId, username);
        const { data, error } = await supabase
            .from("canvas_versions")
            .select("*")
            .eq("id", input.versionId)
            .eq("canvas_id", input.canvasId)
            .maybeSingle();
        if (error) return fail(error);
        if (!data) {
            throw new ORPCError("NOT_FOUND", { message: "Version not found" });
        }
        const row = data as CanvasVersionRow;
        return {
            id: row.id,
            title: row.title,
            createdAt: row.created_at,
            createdBy: row.created_by,
            elements: row.elements,
            appState: row.app_state,
        };
    });

export const restore = base
    .input(z.object({ canvasId: z.string(), versionId: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        const supabase = createSupabaseAdminClient();
        await requireWritableCanvas(supabase, input.canvasId, username);

        const { data: version, error: versionError } = await supabase
            .from("canvas_versions")
            .select("*")
            .eq("id", input.versionId)
            .eq("canvas_id", input.canvasId)
            .maybeSingle();
        if (versionError) return fail(versionError);
        if (!version) {
            throw new ORPCError("NOT_FOUND", { message: "Version not found" });
        }
        const snapshot = version as CanvasVersionRow;

        const { data: canvas, error: canvasError } = await supabase
            .from("canvases")
            .select("app_state")
            .eq("id", input.canvasId)
            .maybeSingle();
        if (canvasError) return fail(canvasError);
        if (!canvas) {
            throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        }
        const currentAppState =
            canvas.app_state && typeof canvas.app_state === "object"
                ? (canvas.app_state as Record<string, unknown>)
                : {};
        const snapshotAppState =
            snapshot.app_state && typeof snapshot.app_state === "object"
                ? (snapshot.app_state as Record<string, unknown>)
                : {};
        // Preserve access control + binary file references, which live in app_state.
        const mergedAppState = {
            ...snapshotAppState,
            sharedWith: (currentAppState.sharedWith ?? []) as unknown,
            files: (currentAppState.files ?? {}) as unknown,
        };

        const { error: updateError } = await supabase
            .from("canvases")
            .update({
                title: snapshot.title,
                elements: snapshot.elements,
                app_state: mergedAppState,
                updated_at: new Date().toISOString(),
            })
            .eq("id", input.canvasId);
        if (updateError) return fail(updateError);

        // Restores are explicit user actions: always leave a snapshot behind.
        await recordVersionSnapshot(supabase, input.canvasId, {
            title: snapshot.title,
            elements: snapshot.elements,
            appState: mergedAppState,
            createdBy: username,
        });
    });