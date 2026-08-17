-- Canvas sharing support: track which users a canvas has been shared with.
alter table public.canvases
  add column if not exists shared_with text[] not null default '{}'::text[];

create table if not exists public.canvas_shares (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid not null references public.canvases (id) on delete cascade,
  shared_with_user text not null references public.app_users (username) on delete cascade,
  created_at timestamptz not null default now(),
  unique (canvas_id, shared_with_user)
);
