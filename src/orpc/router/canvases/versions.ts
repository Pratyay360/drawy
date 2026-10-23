import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/lib/db";
import type { CanvasVersion } from "#/lib/db/schema";
import { canvases, canvasVersions } from "#/lib/db/schema";
import { base } from "../../context";
import {
    canReadCanvas,
    canWriteCanvas,
    recordVersionSnapshot,
    VERSION_RETENTION_LIMIT,
} from "./helpers";

const versionMetaSchema = z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.string(),
    createdBy: z.string().nullable(),
});

async function requireReadableCanvas(canvasId: string, username: string | undefined) {
    const [row] = await db
        .select({
            userId: canvases.userId,
            appState: canvases.appState,
            isPublic: canvases.isPublic,
        })
        .from(canvases)
        .where(eq(canvases.id, canvasId))
        .limit(1);
    if (!row) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
    if (!canReadCanvas(row, username)) {
        throw new ORPCError("FORBIDDEN", {
            message: "You do not have access to this canvas.",
        });
    }
}

async function requireWritableCanvas(canvasId: string, username: string | undefined) {
    if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
    const [row] = await db
        .select({ userId: canvases.userId, appState: canvases.appState })
        .from(canvases)
        .where(eq(canvases.id, canvasId))
        .limit(1);
    if (!row) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
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
        await requireReadableCanvas(input.canvasId, username);
        const rows = await db
            .select({
                id: canvasVersions.id,
                title: canvasVersions.title,
                createdBy: canvasVersions.createdBy,
                createdAt: canvasVersions.createdAt,
            })
            .from(canvasVersions)
            .where(eq(canvasVersions.canvasId, input.canvasId))
            .orderBy(desc(canvasVersions.createdAt))
            .limit(VERSION_RETENTION_LIMIT);
        return rows.map((row) => ({
            id: row.id,
            title: row.title,
            createdAt: row.createdAt?.toISOString() ?? "",
            createdBy: row.createdBy,
        }));
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
        await requireReadableCanvas(input.canvasId, username);
        const [row] = await db
            .select()
            .from(canvasVersions)
            .where(
                and(
                    eq(canvasVersions.id, input.versionId),
                    eq(canvasVersions.canvasId, input.canvasId),
                ),
            )
            .limit(1);
        if (!row) throw new ORPCError("NOT_FOUND", { message: "Version not found" });
        const version = row as CanvasVersion;
        return {
            id: version.id,
            title: version.title,
            createdAt: version.createdAt?.toISOString() ?? "",
            createdBy: version.createdBy,
            elements: version.elements,
            appState: version.appState,
        };
    });

export const restore = base
    .input(z.object({ canvasId: z.string(), versionId: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        await requireWritableCanvas(input.canvasId, username);

        const [snapshotRow] = await db
            .select()
            .from(canvasVersions)
            .where(
                and(
                    eq(canvasVersions.id, input.versionId),
                    eq(canvasVersions.canvasId, input.canvasId),
                ),
            )
            .limit(1);
        if (!snapshotRow) throw new ORPCError("NOT_FOUND", { message: "Version not found" });
        const snapshot = snapshotRow as CanvasVersion;

        const [canvas] = await db
            .select({ appState: canvases.appState })
            .from(canvases)
            .where(eq(canvases.id, input.canvasId))
            .limit(1);
        if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });

        const currentAppState = (
            canvas.appState && typeof canvas.appState === "object" ? canvas.appState : {}
        ) as Record<string, unknown>;
        const snapshotAppState = (
            snapshot.appState && typeof snapshot.appState === "object" ? snapshot.appState : {}
        ) as Record<string, unknown>;
        // Preserve access control + binary file references, which live in app_state.
        const mergedAppState = {
            ...snapshotAppState,
            sharedWith: currentAppState.sharedWith ?? [],
            files: currentAppState.files ?? {},
        };

        await db
            .update(canvases)
            .set({
                title: snapshot.title,
                elements: snapshot.elements,
                appState: mergedAppState,
                updatedAt: new Date(),
            })
            .where(eq(canvases.id, input.canvasId));

        // Restores are explicit user actions: always leave a snapshot behind.
        await recordVersionSnapshot(input.canvasId, {
            title: snapshot.title,
            elements: snapshot.elements,
            appState: mergedAppState,
            createdBy: username,
        });
    });