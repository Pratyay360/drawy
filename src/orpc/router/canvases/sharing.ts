import { ORPCError } from "@orpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/lib/db";
import { appUsers, canvases } from "#/lib/db/schema";
import { base } from "../../context";
import { parseCanvasAppState } from "./helpers";

export const share = base
    .input(z.object({ id: z.string(), targetUsername: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });
        const target = input.targetUsername.trim().toLowerCase();
        if (!target)
            throw new ORPCError("BAD_REQUEST", {
                message: "Target username is required",
            });
        if (target === username)
            throw new ORPCError("BAD_REQUEST", {
                message: "You are already the owner",
            });

        const [targetUser] = await db
            .select({ username: appUsers.username })
            .from(appUsers)
            .where(eq(appUsers.username, target))
            .limit(1);
        if (!targetUser)
            throw new ORPCError("NOT_FOUND", {
                message: `User "${target}" does not exist.`,
            });

        const [canvas] = await db
            .select({ userId: canvases.userId, appState: canvases.appState })
            .from(canvases)
            .where(eq(canvases.id, input.id))
            .limit(1);
        if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        if (canvas.userId !== username)
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can manage sharing.",
            });

        const current = parseCanvasAppState(canvas.appState).sharedWith;
        if (current.includes(target)) return;

        await db
            .update(canvases)
            .set({
                appState: {
                    ...parseCanvasAppState(canvas.appState),
                    sharedWith: [...current, target],
                },
                updatedAt: new Date(),
            })
            .where(eq(canvases.id, input.id));
    });

export const unshare = base
    .input(z.object({ id: z.string(), targetUsername: z.string() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });
        const target = input.targetUsername.trim().toLowerCase();

        const [canvas] = await db
            .select({ userId: canvases.userId, appState: canvases.appState })
            .from(canvases)
            .where(eq(canvases.id, input.id))
            .limit(1);
        if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        if (canvas.userId !== username)
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can manage sharing.",
            });

        const current = parseCanvasAppState(canvas.appState).sharedWith;
        const updated = current.filter((u) => u !== target);

        await db
            .update(canvases)
            .set({
                appState: {
                    ...parseCanvasAppState(canvas.appState),
                    sharedWith: updated,
                },
                updatedAt: new Date(),
            })
            .where(eq(canvases.id, input.id));
    });

export const setPublic = base
    .input(z.object({ id: z.string(), isPublic: z.boolean() }))
    .output(z.object({ isPublic: z.boolean() }))
    .handler(async ({ input, context }) => {
        const username = context.user?.username;
        if (!username)
            throw new ORPCError("UNAUTHORIZED", {
                message: "Not authenticated",
            });

        const [canvas] = await db
            .select({ userId: canvases.userId })
            .from(canvases)
            .where(eq(canvases.id, input.id))
            .limit(1);
        if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
        if (canvas.userId !== username)
            throw new ORPCError("FORBIDDEN", {
                message: "Only the owner can manage link sharing.",
            });

        await db
            .update(canvases)
            .set({ isPublic: input.isPublic, updatedAt: new Date() })
            .where(eq(canvases.id, input.id));

        return { isPublic: input.isPublic };
    });

export const listUsers = base.output(z.array(z.string())).handler(async ({ context }) => {
    const rows = await db
        .select({ username: appUsers.username })
        .from(appUsers)
        .orderBy(asc(appUsers.username));
    return rows.map((u) => u.username).filter((u) => u !== context.user?.username);
});