import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/lib/db";
import { canvases } from "#/lib/db/schema";
import { base } from "../../context";
import { fail, maybeRecordPeriodicVersion, parseCanvasAppState, toMeta } from "./helpers";

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
            isPublic: z.boolean(),
        }),
    )
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });
        const now = new Date();
        const rows = await db
            .insert(canvases)
            .values({
                userId: username,
                title: input.title.trim() || "Untitled",
                elements: [],
                appState: { sharedWith: [] },
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        const row = rows[0];
        if (!row) return fail({ message: "Failed to create canvas" });
        return toMeta(row, username);
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
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const [existing] = await db
            .select({
                userId: canvases.userId,
                appState: canvases.appState,
                title: canvases.title,
            })
            .from(canvases)
            .where(eq(canvases.id, input.id))
            .limit(1);
        if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });

        const shared = parseCanvasAppState(existing.appState).sharedWith;
        if (existing.userId !== username && !shared.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "No permission to edit this canvas.",
            });
        }

        const ex = (
            existing.appState && typeof existing.appState === "object" ? existing.appState : {}
        ) as Record<string, unknown>;
        const exFiles = (ex.files && typeof ex.files === "object" ? ex.files : {}) as Record<
            string,
            unknown
        >;
        const mergedAppState = {
            ...parseCanvasAppState(input.appState),
            sharedWith: shared,
            files: input.files ?? exFiles,
        };

        await db
            .update(canvases)
            .set({
                elements: input.elements,
                appState: mergedAppState,
                updatedAt: new Date(),
            })
            .where(eq(canvases.id, input.id));

        // Periodic version history: snapshot at most once per interval.
        await maybeRecordPeriodicVersion(input.id, {
            title: existing.title ?? "Untitled",
            elements: input.elements,
            appState: mergedAppState,
            createdBy: username,
        });
    });

export const rename = base
    .input(z.object({ id: z.string(), title: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const [existing] = await db
            .select({ userId: canvases.userId, appState: canvases.appState })
            .from(canvases)
            .where(eq(canvases.id, input.id))
            .limit(1);
        if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });

        const shared = parseCanvasAppState(existing.appState).sharedWith;
        if (existing.userId !== username && !shared.includes(username)) {
            throw new ORPCError("FORBIDDEN", {
                message: "No permission to rename this canvas.",
            });
        }

        await db
            .update(canvases)
            .set({
                title: input.title.trim() || "Untitled",
                updatedAt: new Date(),
            })
            .where(eq(canvases.id, input.id));
    });

export const remove = base
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const [existing] = await db
            .select({ userId: canvases.userId })
            .from(canvases)
            .where(eq(canvases.id, input.id))
            .limit(1);
        if (!existing) return;
        if (existing.userId !== username)
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can delete this canvas.",
            });

        await db.delete(canvases).where(eq(canvases.id, input.id));
    });