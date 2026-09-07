CREATE TABLE "public"."canvas_shares" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "canvas_id"        uuid                     NOT NULL,
  "shared_with_user" text                     NOT NULL,
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "canvas_shares_canvas_id_shared_with_user_key" UNIQUE (canvas_id, shared_with_user),
  CONSTRAINT "canvas_shares_pkey" PRIMARY KEY (id),
  CONSTRAINT "canvas_shares_shared_with_user_fkey" FOREIGN KEY (shared_with_user) REFERENCES public.app_users(username) ON DELETE CASCADE,
  CONSTRAINT "canvas_shares_canvas_id_fkey" FOREIGN KEY (canvas_id) REFERENCES public.canvases(id) ON DELETE CASCADE
);

ALTER TABLE "public"."canvas_shares"
  ENABLE ROW LEVEL SECURITY;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."canvas_shares" TO "anon", "authenticated", "postgres", "service_role";
