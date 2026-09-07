CREATE TABLE "public"."canvases" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     text                     NOT NULL,
  "title"       text                     NOT NULL DEFAULT 'Untitled'::text,
  "elements"    jsonb                    NOT NULL DEFAULT '[]'::jsonb,
  "app_state"   jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "shared_with" text[]                   NOT NULL DEFAULT '{}'::text[],
  CONSTRAINT "canvases_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."canvases"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX canvases_user_id_updated_at_idx ON public.canvases USING btree (user_id, updated_at DESC);

CREATE TRIGGER canvases_set_updated_at
  BEFORE UPDATE ON public.canvases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."canvases" TO "anon", "authenticated", "postgres", "service_role";
