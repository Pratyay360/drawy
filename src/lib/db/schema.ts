import { bigint, boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appUsers = pgTable("app_users", {
  username: text("username").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const canvases = pgTable("canvases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull().default("Untitled"),
  elements: jsonb("elements").notNull().default("[]"),
  appState: jsonb("app_state").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  sharedWith: text("shared_with").array().notNull().default([]),
  isPublic: boolean("is_public").notNull().default(false),
  // Yjs checkpoint: seq of last update folded into the latest S3 snapshot.
  checkpointSeq: bigint("checkpoint_seq", { mode: "number" }).notNull().default(0),
  snapshotVersion: integer("snapshot_version"),
  snapshotKey: text("snapshot_key"),
  lastSeq: bigint("last_seq", { mode: "number" }).notNull().default(0),
  snapshotAt: timestamp("snapshot_at", { withTimezone: true }),
});

export const canvasVersions = pgTable("canvas_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  canvasId: uuid("canvas_id")
    .notNull()
    .references(() => canvases.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Untitled"),
  elements: jsonb("elements").notNull().default("[]"),
  appState: jsonb("app_state").notNull().default("{}"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const canvasUpdates = pgTable(
  "canvas_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    canvasId: uuid("canvas_id")
      .notNull()
      .references(() => canvases.id, { onDelete: "cascade" }),
    seq: bigint("seq", { mode: "number" }).notNull(),
    update: text("update").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    canvasSeqIdx: index("canvas_updates_canvas_seq_idx").on(t.canvasId, t.seq),
  }),
);

export const canvasSnapshots = pgTable("canvas_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  canvasId: uuid("canvas_id")
    .notNull()
    .references(() => canvases.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  s3Key: text("s3_key").notNull(),
  checkpointSeq: bigint("checkpoint_seq", { mode: "number" }).notNull(),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  canvasVersionIdx: index("canvas_snapshots_canvas_version_idx").on(t.canvasId, t.version),
}));

export const canvasAttachments = pgTable("canvas_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  canvasId: uuid("canvas_id")
    .notNull()
    .references(() => canvases.id, { onDelete: "cascade" }),
  fileId: text("file_id").notNull(),
  s3Key: text("s3_key").notNull(),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  canvasFileIdx: index("canvas_attachments_canvas_file_idx").on(t.canvasId, t.fileId),
}));

export type Canvas = typeof canvases.$inferSelect;
export type CanvasVersion = typeof canvasVersions.$inferSelect;
export type CanvasUpdate = typeof canvasUpdates.$inferSelect;
export type CanvasSnapshot = typeof canvasSnapshots.$inferSelect;
export type CanvasAttachment = typeof canvasAttachments.$inferSelect;
