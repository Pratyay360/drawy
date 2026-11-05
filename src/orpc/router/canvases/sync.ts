import { ORPCError } from "@orpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/lib/db";
import { canvasAttachments, canvasSnapshots, canvases } from "#/lib/db/schema";
import { s3CreatePresignedPutUrl, s3Enabled, attachmentKey, s3PublicUrl } from "#/lib/storage/s3";
import { base } from "../../context";
import { canWriteCanvas } from "./helpers";

export const sync = base
  .input(z.object({ id: z.string() }))
  .output(
    z.object({
      id: z.string(),
      title: z.string(),
      checkpointSeq: z.number(),
      lastSeq: z.number(),
      snapshotVersion: z.number().nullable(),
      snapshotKey: z.string().nullable(),
      snapshotAt: z.string().nullable(),
    }).nullable()
  )
  .handler(async ({ input }) => {
    const [row] = await db.select().from(canvases).where(eq(canvases.id, input.id)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      checkpointSeq: row.checkpointSeq ?? 0,
      lastSeq: row.lastSeq ?? 0,
      snapshotVersion: row.snapshotVersion ?? null,
      snapshotKey: row.snapshotKey ?? null,
      snapshotAt: row.snapshotAt?.toISOString() ?? null,
    };
  });

export const listSnapshots = base
  .input(z.object({ canvasId: z.string() }))
  .output(
    z.array(
      z.object({
        id: z.string(),
        version: z.number(),
        s3Key: z.string(),
        checkpointSeq: z.number(),
        createdAt: z.string(),
      })
    )
  )
  .handler(async ({ input }) => {
    const rows = await db
      .select()
      .from(canvasSnapshots)
      .where(eq(canvasSnapshots.canvasId, input.canvasId))
      .orderBy(desc(canvasSnapshots.version));
    return rows.map((r) => ({
      id: r.id,
      version: r.version,
      s3Key: r.s3Key,
      checkpointSeq: r.checkpointSeq ?? 0,
      createdAt: r.createdAt?.toISOString() ?? "",
    }));
  });

export const presignAttachment = base
  .input(
    z.object({
      canvasId: z.string(),
      fileId: z.string().min(1).max(128),
      mimeType: z.string().min(1).max(128),
      sizeBytes: z.number().int().min(1).max(50 * 1024 * 1024),
    })
  )
  .output(z.object({ url: z.string(), key: z.string(), publicUrl: z.string().nullable(), enabled: z.boolean() }))
  .handler(async ({ input, context }) => {
    const username = context.user?.username;
    if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
    const [row] = await db
      .select({ userId: canvases.userId, appState: canvases.appState })
      .from(canvases)
      .where(eq(canvases.id, input.canvasId))
      .limit(1);
    if (!row) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
    if (!canWriteCanvas(row, username)) throw new ORPCError("FORBIDDEN", { message: "No permission to upload attachments" });
    if (!s3Enabled()) throw new ORPCError("CONFLICT", { message: "S3 not configured" });
    const key = attachmentKey(input.canvasId, input.fileId);
    const url = await s3CreatePresignedPutUrl(key, input.mimeType);
    if (!url) throw new ORPCError("CONFLICT", { message: "S3 presign failed" });
    await db
      .insert(canvasAttachments)
      .values({ canvasId: input.canvasId, fileId: input.fileId, s3Key: key, mimeType: input.mimeType, sizeBytes: input.sizeBytes, createdBy: username })
      .onConflictDoUpdate({ target: [canvasAttachments.canvasId, canvasAttachments.fileId], set: { s3Key: key, mimeType: input.mimeType, sizeBytes: input.sizeBytes, createdBy: username, createdAt: new Date() } });
    return { url, key, publicUrl: s3PublicUrl(key), enabled: true };
  });

export const confirmAttachment = base
  .input(z.object({ canvasId: z.string(), fileId: z.string() }))
  .output(z.object({ ok: z.boolean(), publicUrl: z.string().nullable() }))
  .handler(async ({ input }) => {
    const [att] = await db
      .select()
      .from(canvasAttachments)
      .where(sql`${canvasAttachments.canvasId} = ${input.canvasId} AND ${canvasAttachments.fileId} = ${input.fileId}`)
      .limit(1);
    if (!att) throw new ORPCError("NOT_FOUND", { message: "Attachment not found" });
    return { ok: true, publicUrl: s3PublicUrl(att.s3Key) };
  });

export const listAttachments = base
  .input(z.object({ canvasId: z.string() }))
  .output(z.array(z.object({ fileId: z.string(), s3Key: z.string(), mimeType: z.string().nullable(), createdAt: z.string() })))
  .handler(async ({ input }) => {
    const rows = await db
      .select()
      .from(canvasAttachments)
      .where(eq(canvasAttachments.canvasId, input.canvasId))
      .orderBy(desc(canvasAttachments.createdAt));
    return rows.map((r) => ({ fileId: r.fileId, s3Key: r.s3Key, mimeType: r.mimeType, createdAt: r.createdAt?.toISOString() ?? "" }));
  });
