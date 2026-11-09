import { pgTable, text, timestamp, index, foreignKey, uuid, bigint, jsonb, boolean, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const appUsers = pgTable("app_users", {
	username: text().primaryKey().notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const canvasUpdates = pgTable("canvas_updates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	canvasId: uuid("canvas_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	seq: bigint({ mode: "number" }).notNull(),
	update: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("canvas_updates_canvas_seq_idx").using("btree", table.canvasId.asc().nullsLast().op("int8_ops"), table.seq.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.canvasId],
			foreignColumns: [canvases.id],
			name: "canvas_updates_canvas_id_canvases_id_fk"
		}).onDelete("cascade"),
]);

export const canvasVersions = pgTable("canvas_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	canvasId: uuid("canvas_id").notNull(),
	title: text().default('Untitled').notNull(),
	elements: jsonb().default([]).notNull(),
	appState: jsonb("app_state").default({}).notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.canvasId],
			foreignColumns: [canvases.id],
			name: "canvas_versions_canvas_id_canvases_id_fk"
		}).onDelete("cascade"),
]);

export const canvases = pgTable("canvases", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	title: text().default('Untitled').notNull(),
	elements: jsonb().default([]).notNull(),
	appState: jsonb("app_state").default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	sharedWith: text("shared_with").array().default([""]).notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	checkpointSeq: bigint("checkpoint_seq", { mode: "number" }).default(0).notNull(),
	snapshotVersion: integer("snapshot_version"),
	snapshotKey: text("snapshot_key"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lastSeq: bigint("last_seq", { mode: "number" }).default(0).notNull(),
	snapshotAt: timestamp("snapshot_at", { withTimezone: true, mode: 'string' }),
});

export const canvasSnapshots = pgTable("canvas_snapshots", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	canvasId: uuid("canvas_id").notNull(),
	version: integer().notNull(),
	s3Key: text("s3_key").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	checkpointSeq: bigint("checkpoint_seq", { mode: "number" }).notNull(),
	sizeBytes: integer("size_bytes"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("canvas_snapshots_canvas_version_idx").using("btree", table.canvasId.asc().nullsLast().op("int4_ops"), table.version.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.canvasId],
			foreignColumns: [canvases.id],
			name: "canvas_snapshots_canvas_id_canvases_id_fk"
		}).onDelete("cascade"),
]);

export const canvasAttachments = pgTable("canvas_attachments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	canvasId: uuid("canvas_id").notNull(),
	fileId: text("file_id").notNull(),
	s3Key: text("s3_key").notNull(),
	mimeType: text("mime_type"),
	sizeBytes: integer("size_bytes"),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("canvas_attachments_canvas_file_idx").using("btree", table.canvasId.asc().nullsLast().op("text_ops"), table.fileId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.canvasId],
			foreignColumns: [canvases.id],
			name: "canvas_attachments_canvas_id_canvases_id_fk"
		}).onDelete("cascade"),
]);
