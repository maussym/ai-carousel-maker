-- 0001_initial_schema.sql
-- AI Carousel Maker - initial schema (4 tables, per product brief §8).
-- Run via Supabase Dashboard → SQL Editor, or `supabase db push` with the CLI linked.

-- =====================================================================
-- TABLES
-- =====================================================================

-- users - mirror of auth.users with app-specific fields.
-- id references auth.users so the row is keyed to the Supabase Auth identity.
create table public.users (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text,
  created_at         timestamptz not null default now(),
  stripe_customer_id text,
  plan               text not null default 'free' check (plan in ('free', 'pro'))
);

-- carousels - one row per generated carousel. slides_json is an array of {title, body}.
create table public.carousels (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  input_text  text,
  template    text check (template in ('bold', 'soft', 'quote')),
  slide_count int  check (slide_count in (5, 7, 10)),
  slides_json jsonb,
  created_at  timestamptz not null default now()
);

-- usage - append-only log of generate/download actions, used for plan limits.
create table public.usage (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  action     text check (action in ('generate', 'download')),
  created_at timestamptz not null default now()
);

-- anonymous_usage - per-IP daily counter for the anonymous (logged-out) limit.
create table public.anonymous_usage (
  ip_hash text not null,
  date    date not null,
  count   int  not null default 0,
  primary key (ip_hash, date)
);

-- Foreign-key indexes (Postgres does not create these automatically).
create index carousels_user_id_idx on public.carousels (user_id);
create index usage_user_id_idx     on public.usage (user_id);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
-- Every table gets RLS enabled. Logged-in users may only touch rows where
-- user_id = auth.uid(). anonymous_usage gets RLS enabled with NO policies, so
-- the anon/authenticated API roles are denied everything and only the
-- service_role key (which bypasses RLS) can read/write it from the server.

alter table public.users           enable row level security;
alter table public.carousels       enable row level security;
alter table public.usage           enable row level security;
alter table public.anonymous_usage enable row level security;

-- ---- users -------------------------------------------------------------
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---- carousels ---------------------------------------------------------
create policy "Users can view own carousels"
  on public.carousels for select
  using (auth.uid() = user_id);

create policy "Users can insert own carousels"
  on public.carousels for insert
  with check (auth.uid() = user_id);

create policy "Users can update own carousels"
  on public.carousels for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own carousels"
  on public.carousels for delete
  using (auth.uid() = user_id);

-- ---- usage -------------------------------------------------------------
-- Read/insert own rows. NOTE: real limit enforcement must still happen
-- server-side (service role), since a client could simply not insert a row.
create policy "Users can view own usage"
  on public.usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage for insert
  with check (auth.uid() = user_id);

-- anonymous_usage: intentionally NO policies (server-only via service role).

-- =====================================================================
-- AUTH TRIGGER - mirror new auth.users rows into public.users
-- =====================================================================
-- Google OAuth (and any other provider) inserts into auth.users. This trigger
-- mirrors that insert into public.users so the app always has a profile row.
-- SECURITY DEFINER lets the trigger write to public.users regardless of the
-- caller; search_path = '' forces every reference to be schema-qualified.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
