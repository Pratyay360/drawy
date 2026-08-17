-- Canvas drawings, isolated per tenant (Supabase auth user) via RLS.
create table if not exists public.canvases (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default 'Untitled',
  elements    jsonb not null default '[]'::jsonb,
  app_state   jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Most queries are "my canvases, newest first".
create index if not exists canvases_user_id_updated_at_idx
  on public.canvases (user_id, updated_at desc);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists canvases_set_updated_at on public.canvases;
create trigger canvases_set_updated_at
  before update on public.canvases
  for each row execute function public.set_updated_at();

-- Row Level Security: every row is owned by the user who created it.
alter table public.canvases enable row level security;

drop policy if exists canvases_select on public.canvases;
create policy canvases_select on public.canvases
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists canvases_insert on public.canvases;
create policy canvases_insert on public.canvases
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists canvases_update on public.canvases;
create policy canvases_update on public.canvases
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists canvases_delete on public.canvases;
create policy canvases_delete on public.canvases
  for delete to authenticated
  using (auth.uid() = user_id);

-- Stream canvas changes to subscribed clients (Supabase Realtime respects RLS).
alter publication supabase_realtime add table public.canvases;
