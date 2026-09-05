import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "#/utils/server-supabase";
import { base } from "../../context";
import { fail, getSharedWith, parseCanvasAppState } from "./helpers";

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

export const listUsers = base
	.output(z.array(z.string()))
	.handler(async ({ context }) => {
		const username = context.user?.username;
		const supabase = createSupabaseAdminClient();
		const { data, error } = await supabase
			.from("app_users")
			.select("username")
			.order("username", { ascending: true });

		if (error) return fail(error);
		return (data || []).map((u) => u.username).filter((u) => u !== username);
	});
