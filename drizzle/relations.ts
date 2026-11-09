import { relations } from "drizzle-orm/relations";
import { canvases, canvasUpdates, canvasVersions, canvasSnapshots, canvasAttachments } from "./schema";

export const canvasUpdatesRelations = relations(canvasUpdates, ({one}) => ({
	canvase: one(canvases, {
		fields: [canvasUpdates.canvasId],
		references: [canvases.id]
	}),
}));

export const canvasesRelations = relations(canvases, ({many}) => ({
	canvasUpdates: many(canvasUpdates),
	canvasVersions: many(canvasVersions),
	canvasSnapshots: many(canvasSnapshots),
	canvasAttachments: many(canvasAttachments),
}));

export const canvasVersionsRelations = relations(canvasVersions, ({one}) => ({
	canvase: one(canvases, {
		fields: [canvasVersions.canvasId],
		references: [canvases.id]
	}),
}));

export const canvasSnapshotsRelations = relations(canvasSnapshots, ({one}) => ({
	canvase: one(canvases, {
		fields: [canvasSnapshots.canvasId],
		references: [canvases.id]
	}),
}));

export const canvasAttachmentsRelations = relations(canvasAttachments, ({one}) => ({
	canvase: one(canvases, {
		fields: [canvasAttachments.canvasId],
		references: [canvases.id]
	}),
}));