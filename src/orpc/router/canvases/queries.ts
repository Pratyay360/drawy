import { ORPCError } from "@orpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/lib/db";
import { canvases } from "#/lib/db/schema";
import { base } from "../../context";
import { parseCanvasAppState, toData, toMeta } from "./helpers";

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
                isPublic: z.boolean(),
            }),
        ),
    )
    .handler(async ({ context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const rows = await db.select().from(canvases).orderBy(desc(canvases.updatedAt));
        return rows
            .filter(
                (row) =>
                    row.userId === username ||
                    parseCanvasAppState(row.appState).sharedWith.includes(username),
            )
            .map((row) => toMeta(row, username));
    });

const canvasDataSchema = z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    owner: z.string(),
    isOwner: z.boolean(),
    sharedWith: z.array(z.string()),
    isPublic: z.boolean(),
    elements: z.any(),
    appState: z.any(),
    files: z.any().optional(),
});

export const get = base
    .input(z.object({ id: z.string() }))
    .output(canvasDataSchema.nullable())
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const [row] = await db.select().from(canvases).where(eq(canvases.id, input.id)).limit(1);
        if (!row) return null;

        const shared = parseCanvasAppState(row.appState).sharedWith;
        if (row.userId !== username && !shared.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "No access to this canvas.",
            });
        }
        return toData(row, username);
    });

/**
 * Anonymous read-only access. Returns the canvas only when the owner has
 * enabled link sharing (`is_public`); otherwise null so private canvas IDs
 * are not distinguishable from missing ones.
 */
export const getPublic = base
    .input(z.object({ id: z.string() }))
    .output(canvasDataSchema.nullable())
    .handler(async ({ input, context }) => {
        const [row] = await db.select().from(canvases).where(eq(canvases.id, input.id)).limit(1);
        if (!row) return null;
        if (row.isPublic !== true) return null;
        return toData(row, context.user?.username);
    });