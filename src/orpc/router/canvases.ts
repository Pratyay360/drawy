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

const SharedWithFieldSchema = z.object({ sharedWith: z.array(z.string()) });
const CanvasAppStateSchema = z.object({}).loose();

interface CanvasAppState {
  sharedWith: string[];
}

function parseCanvasAppState(
  raw: Parameters<typeof CanvasAppStateSchema.safeParse>[0],
): CanvasAppState {
  const parsed = CanvasAppStateSchema.safeParse(raw);
  if (!parsed.success) return { sharedWith: [] } satisfies CanvasAppState;
  const shared = SharedWithFieldSchema.safeParse(parsed.data);
  return shared.success ? shared.data : ({ sharedWith: [] } satisfies CanvasAppState);
}

function getSharedWith(appState: CanvasAppState): string[] {
  return appState.sharedWith;
}

function toMeta(row: CanvasRow, currentUser?: string) {
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

function toData(row: CanvasRow, currentUser?: string) {
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

function fail(error: { message: string }): never {
  throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}

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
      const shared = getSharedWith(parseCanvasAppState(row.app_state));
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
        files: z.any().optional(),
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
    const sharedWith = getSharedWith(parseCanvasAppState(row.app_state));
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

const BUCKET_NAME = "canvas-assets";
let bucketInitialized = false;

async function ensureStorageBucket(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  if (bucketInitialized) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760,
      });
    }
    bucketInitialized = true;
  } catch (err) {
    console.error("Failed to ensure storage bucket:", err);
  }
}

export const uploadAsset = base
  .input(
    z.object({
      canvasId: z.string(),
      fileId: z.string(),
      mimeType: z.string(),
      base64Data: z.string(),
    }),
  )
  .output(
    z.object({
      fileId: z.string(),
      url: z.string(),
      mimeType: z.string(),
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
      .eq("id", input.canvasId)
      .maybeSingle();

    if (fetchErr) return fail(fetchErr);
    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
    }

    const isOwner = existing.user_id === username;
    const sharedWith = getSharedWith(parseCanvasAppState(existing.app_state));
    if (!isOwner && !sharedWith.includes(username)) {
      throw new ORPCError("FORBIDDEN", {
        message: "You do not have permission to upload assets to this canvas.",
      });
    }

    await ensureStorageBucket(supabase);

    let cleanBase64 = input.base64Data;
    const commaIdx = cleanBase64.indexOf(",");
    if (commaIdx !== -1) {
      cleanBase64 = cleanBase64.slice(commaIdx + 1);
    }

    const buffer = Buffer.from(cleanBase64, "base64");
    const extension = input.mimeType.split("/")[1]?.replace("+xml", "") || "bin";
    const filePath = `${input.canvasId}/${input.fileId}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: input.mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", { message: uploadError.message });
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      fileId: input.fileId,
      url: publicUrlData.publicUrl,
      mimeType: input.mimeType,
    };
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

export const share = base
  .input(z.object({ id: z.string(), targetUsername: z.string() }))
  .handler(async ({ input, context }) => {
    const username = context.user?.username;
    if (!username) {
      throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
    }
    const target = input.targetUsername.trim().toLowerCase();
    if (!target) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Target username is required",
      });
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
      throw new ORPCError("NOT_FOUND", {
        message: `User "${target}" does not exist.`,
      });
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

    const currentShared = getSharedWith(parseCanvasAppState(canvas.app_state));
    if (currentShared.includes(target)) {
      return;
    }

    const updatedShared = [...currentShared, target];
    const appStateBase = parseCanvasAppState(canvas.app_state);
    const newAppState = {
      ...appStateBase,
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

    const currentShared = getSharedWith(parseCanvasAppState(canvas.app_state));
    const updatedShared = currentShared.filter((u) => u !== target);

    const appStateBase = parseCanvasAppState(canvas.app_state);
    const newAppState = {
      ...appStateBase,
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
