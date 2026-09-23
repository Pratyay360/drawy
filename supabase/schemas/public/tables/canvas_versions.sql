CREATE TABLE "public"."canvas_versions" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "canvas_id"  uuid,
  "title"      text,
  "elements"   jsonb,
  "app_state"  jsonb,
  "created_by" text,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "canvas_versions_pkey" PRIMARY KEY (id),
  CONSTRAINT "canvas_versions_canvas_id_fkey" FOREIGN KEY (canvas_id) REFERENCES public.canvases(id) ON DELETE CASCADE
);

ALTER TABLE "public"."canvas_versions"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_canvas_versions_canvas_id ON public.canvas_versions USING btree (canvas_id);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."canvas_versions" TO "anon", "authenticated", "postgres", "service_role";
