import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "#/utils/server-supabase";
import { base } from "../../context";
import { getSharedWith, parseCanvasAppState } from "./helpers";
import type { CanvasRow } from "./types";

const BUCKET_NAME = "canvas-assets";
let bucketInitPromise: Promise<void>;

export async function ensureStorageBucket(supabase: ReturnType<typeof createSupabaseAdminClient>) {
    if (bucketInitPromise) return bucketInitPromise;
    bucketInitPromise = (async () => {
        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const exists = buckets?.some((b) => b.name === BUCKET_NAME);
            if (!exists) {
                await supabase.storage.createBucket(BUCKET_NAME, {
                    public: true,
                    fileSizeLimit: 10485760,
                });
            }
        } catch (err) {
            console.error("Failed to ensure storage bucket:", err);
            return bucketInitPromise;
        }
    })();
    return bucketInitPromise;
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

        if (fetchErr) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: fetchErr.message,
            });
        }
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
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: uploadError.message,
            });
        }

        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

        // Append a cache-busting parameter so the browser doesn't serve a stale
        // version when the file is re-uploaded (upsert) with the same path.
        const cacheBustedUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

        return {
            fileId: input.fileId,
            url: cacheBustedUrl,
            mimeType: input.mimeType,
        };
    });