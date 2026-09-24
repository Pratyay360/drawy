-- Restore default UUID generation for canvases.id.
-- The live schema lost the `default gen_random_uuid()` from 0001_init.sql,
-- causing inserts without an explicit id to fail with:
--   null value in column "id" of relation "canvases" violates not-null constraint
-- App code now sends an explicit id, but restore the DB default as a safety net.

alter table public.canvases
  alter column id set default gen_random_uuid();
