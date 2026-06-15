-- ============================================================
-- e-rizika.sk — databázová schéma (verzia 2)
-- Spustite celé v Supabase SQL editore.
-- ============================================================

-- Profily používateľov (vytvárajú sa automaticky pri registrácii)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  subscription_until timestamptz,          -- aktívne predplatné do (null = žiadne)
  stripe_customer_id text,
  free_gens integer not null default 0,    -- počet generovaní zadarmo (limit proti zneužitiu)
  created_at timestamptz not null default now()
);

-- Jednorazové projekty (49 € = 15 činností / 30 dní)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activities_limit integer not null default 15,
  activities_used integer not null default 0,
  expires_at timestamptz not null,
  stripe_session_id text,
  created_at timestamptz not null default now()
);
create index if not exists projects_user_idx on public.projects(user_id, expires_at desc);

-- Uložené hodnotenia rizík
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists documents_user_idx on public.documents(user_id, created_at desc);

-- RLS: každý vidí len svoje dáta (zápisy do profiles/projects robí výhradne server)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.documents enable row level security;

drop policy if exists "profil: čítanie vlastného" on public.profiles;
create policy "profil: čítanie vlastného" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "projekty: čítanie vlastných" on public.projects;
create policy "projekty: čítanie vlastných" on public.projects
  for select using (auth.uid() = user_id);

drop policy if exists "dokumenty: čítanie vlastných" on public.documents;
create policy "dokumenty: čítanie vlastných" on public.documents
  for select using (auth.uid() = user_id);
drop policy if exists "dokumenty: vkladanie vlastných" on public.documents;
create policy "dokumenty: vkladanie vlastných" on public.documents
  for insert with check (auth.uid() = user_id);

-- Automatické vytvorenie profilu po registrácii
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- MIGRÁCIA zo schémy v1 (len ak ste už spustili starú verziu):
-- alter table public.profiles add column if not exists subscription_until timestamptz;
-- alter table public.profiles add column if not exists stripe_customer_id text;
-- alter table public.profiles add column if not exists free_gens integer not null default 0;
-- alter table public.profiles drop column if exists subscription_active;
-- alter table public.profiles drop column if exists project_credits;
-- ------------------------------------------------------------
