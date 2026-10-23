import { z } from "zod";

export const SharedWithFieldSchema = z.object({
    sharedWith: z.array(z.string()),
});
export const CanvasAppStateSchema = z.object({}).loose();