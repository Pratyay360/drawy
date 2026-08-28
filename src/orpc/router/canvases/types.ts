import { z } from "zod";

export interface CanvasRow {
	id: string;
	user_id: string;
	title: string;
	elements: unknown;
	app_state: unknown;
	created_at: string;
	updated_at: string;
}

export const SharedWithFieldSchema = z.object({
	sharedWith: z.array(z.string()),
});
export const CanvasAppStateSchema = z.object({}).loose();

export interface CanvasAppState {
	sharedWith: string[];
}
