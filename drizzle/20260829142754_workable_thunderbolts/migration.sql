CREATE TABLE "app_users" (
	"username" text PRIMARY KEY,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canvases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"title" text DEFAULT 'Untitled' NOT NULL,
	"elements" jsonb DEFAULT '"[]"' NOT NULL,
	"app_state" jsonb DEFAULT '"{}"' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"shared_with" text[] DEFAULT '{}'::text[] NOT NULL
);
