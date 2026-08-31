import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "#/utils/server-supabase";
import { base } from "../../context";
import { fail, getSharedWith, parseCanvasAppState, toMeta } from "./helpers";
import type { CanvasRow } from "./types";

const BUCKET_NAME = "canvas-assets";

export const create = base
    .input(z.object({ title: z.string() }))
    .output(
        z.object({
            id: z.string(),
            title: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
            owner: z.string(),
            isOwner: z.boolean(),
            sharedWith: z.array(z.string()),
        }),
    )
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const supabase = createSupabaseAdminClient();
        const now = new Date().toISOString();
        const title = input.title.trim() || "Untitled";
        const initialAppState = { sharedWith: [] };
        const { data, error } = await supabase
            .from("canvases")
            .insert({
                user_id: username,
                title,
                elements: [],
                app_state: initialAppState,
                created_at: now,
                updated_at: now,
            })
            .select("id, user_id, title, app_state, created_at, updated_at")
            .single();
        if (error) return fail(error);
        return toMeta(data as CanvasRow, username);
    });

export const save = base
    .input(
        z.object({
            id: z.string(),
            elements: z.any(),
            appState: z.any(),
            files: z.record(z.string(), z.any()).optional(),
        }),
    )
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const supabase = createSupabaseAdminClient();
        const { data: existing, error: fetchErr } = await supabase
            .from("canvases")
            .select("user_id, app_state")
            .eq("id", input.id)
            .maybeSingle();

        if (fetchErr) return fail(fetchErr);
        if (!existing) {
            throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        }

        const isOwner = existing.user_id === username;
        const sharedWith = getSharedWith(parseCanvasAppState(existing.app_state));
        if (!isOwner && !sharedWith.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "You do not have permission to edit this canvas.",
            });
        }

        const existingAppState = (
            existing.app_state && typeof existing.app_state === "object" ? existing.app_state : {}
        ) as Record<string, unknown>;
        const existingFiles = (
            existingAppState.files && typeof existingAppState.files === "object"
                ? existingAppState.files
                : {}
        ) as Record<string, unknown>;

        const appStateBase = parseCanvasAppState(input.appState);
        const mergedAppState = {
            ...appStateBase,
            sharedWith,
            files: input.files !== undefined ? input.files : existingFiles,
        };

        const { error } = await supabase
            .from("canvases")
            .update({
                elements: input.elements,
                app_state: mergedAppState,
                updated_at: new Date().toISOString(),
            })
            .eq("id", input.id);
        if (error) return fail(error);
    });

export const rename = base
    .input(z.object({ id: z.string(), title: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const supabase = createSupabaseAdminClient();
        const { data: existing, error: fetchErr } = await supabase
            .from("canvases")
            .select("user_id, app_state")
            .eq("id", input.id)
            .maybeSingle();

        if (fetchErr) return fail(fetchErr);
        if (!existing) {
            throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        }

        const isOwner = existing.user_id === username;
        const sharedWith = getSharedWith(existing.app_state);
        if (!isOwner && !sharedWith.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "You do not have permission to rename this canvas.",
            });
        }

        const { error } = await supabase
            .from("canvases")
            .update({
                title: input.title.trim() || "Untitled",
                updated_at: new Date().toISOString(),
            })
            .eq("id", input.id);
        if (error) return fail(error);
    });

export const remove = base
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const supabase = createSupabaseAdminClient();
        const { data: existing, error: fetchErr } = await supabase
            .from("canvases")
            .select("user_id")
            .eq("id", input.id)
            .maybeSingle();

        if (fetchErr) return fail(fetchErr);
        if (!existing) return;

        if (existing.user_id !== username) {
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can delete this canvas.",
            });
        }

        const { error } = await supabase.from("canvases").delete().eq("id", input.id);
        if (error) return fail(error);

        try {
            const { data: files } = await supabase.storage.from(BUCKET_NAME).list(input.id);
            if (files && files.length > 0) {
                const pathsToRemove = files.map((f) => `${input.id}/${f.name}`);
                await supabase.storage.from(BUCKET_NAME).remove(pathsToRemove);
            }
        } catch (err) {
            console.error("Failed to delete canvas storage assets:", err);
        }
    });