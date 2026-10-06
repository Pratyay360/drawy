import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "#/utils/server-supabase";
import { base } from "../../context";
import {
	fail,
	getSharedWith,
	parseCanvasAppState,
	toData,
	toMeta,
} from "./helpers";
import type { CanvasRow } from "./types";

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
		if (!username) {
			throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
		}
		const supabase = createSupabaseAdminClient();
		const { data, error } = await supabase
			.from("canvases")
			.select(
				"id, user_id, title, app_state, created_at, updated_at, is_public",
			)
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

/**
 * Anonymous read-only access. Returns the canvas only when the owner has
 * enabled link sharing (`is_public`); otherwise 404 so private canvas IDs
 * are not distinguishable from missing ones.
 */
export const getPublic = base
	.input(z.object({ id: z.string() }))
	.output(canvasDataSchema.nullable())
	.handler(async ({ input, context }) => {
		const supabase = createSupabaseAdminClient();
		const { data, error } = await supabase
			.from("canvases")
			.select("*")
			.eq("id", input.id)
			.maybeSingle();
		if (error) return fail(error);
		if (!data) return null;
		const row = data as CanvasRow;
		if (row.is_public !== true) return null;
		return toData(row, context.user?.username);
	});
