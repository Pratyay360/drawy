import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "#/utils/server-supabase";
import { base } from "../context";

interface CanvasRow {
    id: string;
    user_id: string;
    title: string;
    elements: unknown;
    app_state: unknown;
    created_at: string;
    updated_at: string;
}

function getSharedWith(appState: unknown): string[] {
    if (
        appState &&
        typeof appState === "object" &&
        "sharedWith" in appState &&
        Array.isArray((appState as { sharedWith: unknown }).sharedWith)
    ) {
        return (appState as { sharedWith: unknown[] }).sharedWith.filter(
            (u): u is string => typeof u === "string",
        );
    }
    return [];
}

function toMeta(row: CanvasRow, currentUser?: string) {
    const owner = row.user_id || "Anonymous";
    const sharedWith = getSharedWith(row.app_state);
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

function toData(row: CanvasRow, currentUser?: string) {
    return {
        ...toMeta(row, currentUser),
        elements: row.elements ?? [],
        appState: row.app_state ?? {},
    };
}

function fail(error: { message: string }): never {
    throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}

// Canvases are visible only to their owner or users they are explicitly shared with.
export const list = base
    .output(
        z.array(
            z.object({
                id: z.string(),
                title: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
                owner: z.string(),
                isOwner: z.boolean(),
                sharedWith: z.array(z.string()),
            }),
        ),
    )
    .handler(async ({ context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const supabase = createSupabaseAdminClient();
        const { data, error } = await supabase
            .from("canvases")
            .select("id, user_id, title, app_state, created_at, updated_at")
            .order("updated_at", { ascending: false });
        if (error) return fail(error);

        const rows = data as CanvasRow[];
        const filtered = rows.filter((row) => {
            if (row.user_id === username) return true;
            const shared = getSharedWith(row.app_state);
            return shared.includes(username);
        });

        return filtered.map((row) => toMeta(row, username));
    });

export const get = base
    .input(z.object({ id: z.string() }))
    .output(
        z
            .object({
                id: z.string(),
                title: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
                owner: z.string(),
                isOwner: z.boolean(),
                sharedWith: z.array(z.string()),
                elements: z.any(),
                appState: z.any(),
            })
            .nullable(),
    )
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const supabase = createSupabaseAdminClient();
        const { data, error } = await supabase
            .from("canvases")
            .select("*")
            .eq("id", input.id)
            .maybeSingle();
        if (error) return fail(error);
        if (!data) return null;

        const row = data as CanvasRow;
        const sharedWith = getSharedWith(row.app_state);
        const isOwner = row.user_id === username;
        if (!isOwner && !sharedWith.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "You do not have access to this canvas.",
            });
        }

        return toData(row, username);
    });

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
        const sharedWith = getSharedWith(existing.app_state);
        if (!isOwner && !sharedWith.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "You do not have permission to edit this canvas.",
            });
        }

        const mergedAppState = {
            ...(typeof input.appState === "object" && input.appState ? input.appState : {}),
            sharedWith,
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
    });

export const share = base
    .input(z.object({ id: z.string(), targetUsername: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const target = input.targetUsername.trim().toLowerCase();
        if (!target) {
            throw new ORPCError("BAD_REQUEST", { message: "Target username is required" });
        }
        if (target === username) {
            throw new ORPCError("BAD_REQUEST", {
                message: "You are already the owner of this canvas",
            });
        }

        const supabase = createSupabaseAdminClient();
        const { data: targetUser } = await supabase
            .from("app_users")
            .select("username")
            .eq("username", target)
            .maybeSingle();

        if (!targetUser) {
            throw new ORPCError("NOT_FOUND", { message: `User "${target}" does not exist.` });
        }

        const { data: canvas, error: fetchErr } = await supabase
            .from("canvases")
            .select("user_id, app_state")
            .eq("id", input.id)
            .maybeSingle();

        if (fetchErr) return fail(fetchErr);
        if (!canvas) {
            throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        }

        if (canvas.user_id !== username) {
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can manage sharing permissions.",
            });
        }

        const currentShared = getSharedWith(canvas.app_state);
        if (currentShared.includes(target)) {
            return;
        }

        const updatedShared = [...currentShared, target];
        const newAppState = {
            ...(typeof canvas.app_state === "object" && canvas.app_state ? canvas.app_state : {}),
            sharedWith: updatedShared,
        };

        const { error } = await supabase
            .from("canvases")
            .update({ app_state: newAppState, updated_at: new Date().toISOString() })
            .eq("id", input.id);

        if (error) return fail(error);
    });

export const unshare = base
    .input(z.object({ id: z.string(), targetUsername: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username) {
            throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
        }
        const target = input.targetUsername.trim().toLowerCase();
        const supabase = createSupabaseAdminClient();

        const { data: canvas, error: fetchErr } = await supabase
            .from("canvases")
            .select("user_id, app_state")
            .eq("id", input.id)
            .maybeSingle();

        if (fetchErr) return fail(fetchErr);
        if (!canvas) {
            throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        }

        if (canvas.user_id !== username) {
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can manage sharing permissions.",
            });
        }

        const currentShared = getSharedWith(canvas.app_state);
        const updatedShared = currentShared.filter((u) => u !== target);

        const newAppState = {
            ...(typeof canvas.app_state === "object" && canvas.app_state ? canvas.app_state : {}),
            sharedWith: updatedShared,
        };

        const { error } = await supabase
            .from("canvases")
            .update({ app_state: newAppState, updated_at: new Date().toISOString() })
            .eq("id", input.id);

        if (error) return fail(error);
    });

export const listUsers = base.output(z.array(z.string())).handler(async ({ context }) => {
    const username = context.user?.username;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("app_users")
        .select("username")
        .order("username", { ascending: true });

    if (error) return fail(error);
    return (data || []).map((u) => u.username).filter((u) => u !== username);
});