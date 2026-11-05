CREATE TABLE "canvas_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canvas_id" uuid NOT NULL,
	"file_id" text NOT NULL,
	"s3_key" text NOT NULL,
	"mime_type" text,
	"size_bytes" integer,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canvas_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canvas_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"s3_key" text NOT NULL,
	"checkpoint_seq" bigint NOT NULL,
	"size_bytes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canvas_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canvas_id" uuid NOT NULL,
	"seq" bigint NOT NULL,
	"update" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "canvases" ADD COLUMN "checkpoint_seq" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "canvases" ADD COLUMN "snapshot_version" integer;--> statement-breakpoint
ALTER TABLE "canvases" ADD COLUMN "snapshot_key" text;--> statement-breakpoint
ALTER TABLE "canvases" ADD COLUMN "last_seq" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "canvases" ADD COLUMN "snapshot_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "canvas_attachments" ADD CONSTRAINT "canvas_attachments_canvas_id_canvases_id_fk" FOREIGN KEY ("canvas_id") REFERENCES "public"."canvases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canvas_snapshots" ADD CONSTRAINT "canvas_snapshots_canvas_id_canvases_id_fk" FOREIGN KEY ("canvas_id") REFERENCES "public"."canvases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canvas_updates" ADD CONSTRAINT "canvas_updates_canvas_id_canvases_id_fk" FOREIGN KEY ("canvas_id") REFERENCES "public"."canvases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "canvas_attachments_canvas_file_idx" ON "canvas_attachments" USING btree ("canvas_id","file_id");--> statement-breakpoint
CREATE INDEX "canvas_snapshots_canvas_version_idx" ON "canvas_snapshots" USING btree ("canvas_id","version");--> statement-breakpoint
CREATE INDEX "canvas_updates_canvas_seq_idx" ON "canvas_updates" USING btree ("canvas_id","seq");