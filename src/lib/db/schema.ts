import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

export type Canvas = typeof canvases.$inferSelect;
export type CanvasVersion = typeof canvasVersions.$inferSelect;
