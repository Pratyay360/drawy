-- Periodic canvas version history + public link sharing.
-- Application code enforces authorization through the admin
-- (service-role) client which bypasses RLS, following 0002_app_auth.sql.

alter table public.canvases
  add column if not exists is_public boolean not null default false;

create table if not exists public.canvas_versions (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid not null references public.canvases (id) on delete cascade,
  title text not null default 'Untitled',
  elements jsonb not null default '[]'::jsonb,
  app_state jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists canvas_versions_canvas_created_idx
  on public.canvas_versions (canvas_id, created_at desc);

alter table public.canvas_versions enable row level security;

revoke all on table public.canvas_versions from anon, authenticated;
