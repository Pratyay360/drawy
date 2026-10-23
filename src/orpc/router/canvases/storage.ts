import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/lib/db";
import { canvases } from "#/lib/db/schema";
import { s3Upload } from "#/lib/s3";
import { base } from "../../context";
import { parseCanvasAppState } from "./helpers";

export const uploadAsset = base
    .input(
        z.object({
            canvasId: z.string(),
            fileId: z.string(),
            mimeType: z.string(),
            base64Data: z.string(),
        }),
    )
    .output(z.object({ fileId: z.string(), url: z.string(), mimeType: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const [existing] = await db
            .select({ userId: canvases.userId, appState: canvases.appState })
            .from(canvases)
            .where(eq(canvases.id, input.canvasId))
            .limit(1);

        if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });

        const shared = parseCanvasAppState(existing.appState).sharedWith;
        if (existing.userId !== username && !shared.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "No permission to upload assets to this canvas.",
            });
        }

        let cleanBase64 = input.base64Data;
        const commaIdx = cleanBase64.indexOf(",");
        if (commaIdx !== -1) cleanBase64 = cleanBase64.slice(commaIdx + 1);

        const ext = input.mimeType.split("/")[1]?.replace("+xml", "") || "bin";
        void `/canvas/${input.canvasId}/${input.fileId}.${ext}`;
        if (!cleanBase64 || cleanBase64.length === 0)
            throw new ORPCError("BAD_REQUEST", { message: "Empty image data" });
        if (!/^[A-Za-z0-9+/=_-]+$/.test(cleanBase64.slice(0, 1000))) {
            throw new ORPCError("BAD_REQUEST", {
                message: "Invalid base64 image data",
            });
        }
        const buffer = Buffer.from(cleanBase64, "base64");
        if (buffer.length === 0)
            throw new ORPCError("BAD_REQUEST", {
                message: "Invalid base64 string.",
            });

        const url = await s3Upload(buffer);

        return {
            fileId: input.fileId,
            url: `${url}?v=${Date.now()}`,
            mimeType: input.mimeType,
        };
    });