-- App-owned auth replaces Supabase Auth.
-- The app server uses a Supabase secret key; browser clients no longer need
-- Supabase sessions or auth tokens.

create table if not exists public.app_users (
  username text primary key,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.app_users enable row level security;

revoke all on table public.app_users from anon, authenticated;

-- The canvases RLS policies reference user_id (and auth.uid()), so they must be
-- dropped before its type can change from uuid to text. Authorization is now
-- enforced in application code through the admin (service-role) client, which
-- bypasses RLS, so the policies are not recreated.
drop policy if exists canvases_select on public.canvases;
drop policy if exists canvases_insert on public.canvases;
drop policy if exists canvases_update on public.canvases;
drop policy if exists canvases_delete on public.canvases;

alter table public.canvases
  drop constraint if exists canvases_user_id_fkey;

alter table public.canvases
  alter column user_id type text using user_id::text;
