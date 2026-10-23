import { ORPCError } from "@orpc/server";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "#/lib/db";
import type { Canvas } from "#/lib/db/schema";
import { canvasVersions } from "#/lib/db/schema";
import { CanvasAppStateSchema, SharedWithFieldSchema } from "./types";

export function parseCanvasAppState(raw: unknown): { sharedWith: string[] } {
    const parsed = CanvasAppStateSchema.safeParse(raw);
    if (!parsed.success) return { sharedWith: [] };
    const shared = SharedWithFieldSchema.safeParse(parsed.data);
    return shared.success ? shared.data : { sharedWith: [] };
}

export function toMeta(row: Canvas, currentUser?: string) {
    const shared = parseCanvasAppState(row.appState).sharedWith;
    return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt?.toISOString() ?? "",
        updatedAt: row.updatedAt?.toISOString() ?? "",
        owner: row.userId || "Anonymous",
        isOwner: currentUser ? row.userId === currentUser : false,
        sharedWith: shared,
        isPublic: row.isPublic === true,
    };
}

export function canReadCanvas(
    row: Pick<Canvas, "userId" | "appState" | "isPublic">,
    username?: string,
) {
    if (row.isPublic === true) return true;
    if (!username) return false;
    if (row.userId === username) return true;
    return parseCanvasAppState(row.appState).sharedWith.includes(username);
}

export function canWriteCanvas(row: Pick<Canvas, "userId" | "appState">, username?: string) {
    if (!username) return false;
    if (row.userId === username) return true;
    return parseCanvasAppState(row.appState).sharedWith.includes(username);
}
export const VERSION_SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000;
export const VERSION_RETENTION_LIMIT = 50;

export async function recordVersionSnapshot(
    canvasId: string,
    snapshot: {
        title: string;
        elements: unknown;
        appState: unknown;
        createdBy?: string;
    },
) {
    try {
        await db.insert(canvasVersions).values({
            canvasId,
            title: snapshot.title,
            elements: snapshot.elements,
            appState: snapshot.appState,
            createdBy: snapshot.createdBy ?? null,
        });
    } catch (error) {
        console.error("Failed to record canvas version:", error);
        return;
    }
    try {
        const stale = await db
            .select({ id: canvasVersions.id })
            .from(canvasVersions)
            .where(eq(canvasVersions.canvasId, canvasId))
            .orderBy(desc(canvasVersions.createdAt))
            .offset(VERSION_RETENTION_LIMIT)
            .limit(200);
        const staleIds = stale.map((v) => v.id);
        // drizzle-orm `delete` has no LIMIT; trim stale rows by id.
        if (staleIds.length > 0) {
            await db.delete(canvasVersions).where(inArray(canvasVersions.id, staleIds));
        }
    } catch (error) {
        console.error("Failed to trim old canvas versions:", error);
    }
}

/** Record a snapshot only if the newest one is older than the interval. */
export async function maybeRecordPeriodicVersion(
    canvasId: string,
    snapshot: {
        title: string;
        elements: unknown;
        appState: unknown;
        createdBy?: string;
    },
) {
    try {
        const [latest] = await db
            .select({ createdAt: canvasVersions.createdAt })
            .from(canvasVersions)
            .where(eq(canvasVersions.canvasId, canvasId))
            .orderBy(desc(canvasVersions.createdAt))
            .limit(1);
        if (latest?.createdAt) {
            const age = Date.now() - new Date(latest.createdAt).getTime();
            if (Number.isFinite(age) && age < VERSION_SNAPSHOT_INTERVAL_MS) return;
        }
    } catch (error) {
        console.error("Failed to check canvas version history:", error);
        return;
    }
    await recordVersionSnapshot(canvasId, snapshot);
}

export function toData(row: Canvas, currentUser?: string) {
    const raw = (row.appState && typeof row.appState === "object" ? row.appState : {}) as Record<
        string,
        unknown
    >;
    const files = (raw.files && typeof raw.files === "object" ? raw.files : {}) as Record<
        string,
        unknown
    >;
    return {
        ...toMeta(row, currentUser),
        elements: row.elements,
        appState: row.appState,
        files,
    };
}

export function fail(error: { message: string }): never {
    throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}