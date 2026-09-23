CREATE TABLE "public"."canvases" (
  "id"          uuid                     NOT NULL,
  "user_id"     text,
  "title"       text,
  "elements"    jsonb,
  "app_state"   jsonb,
  "created_at"  timestamp with time zone DEFAULT now(),
  "updated_at"  timestamp with time zone DEFAULT now(),
  "shared_with" jsonb                    DEFAULT '[]'::jsonb,
  "is_public"   boolean                  DEFAULT false,
  CONSTRAINT "canvases_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."canvases"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_canvases_user_id ON public.canvases USING btree (user_id);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."canvases" TO "anon", "authenticated", "postgres", "service_role";
