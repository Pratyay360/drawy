CREATE TABLE "public"."app_users" (
  "username"      text                     NOT NULL,
  "password_hash" text                     NOT NULL,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "app_users_pkey" PRIMARY KEY (username)
);

ALTER TABLE "public"."app_users"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny client access" ON "public"."app_users"
  FOR ALL
  TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."app_users" TO "postgres", "service_role";
