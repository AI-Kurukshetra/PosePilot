create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create table if not exists public.practice_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  pose_key text not null check (pose_key in ('warrior', 'armpress')),
  pose_name text not null,
  alignment_score integer not null check (alignment_score between 0 and 100),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  status text not null default 'completed' check (status in ('completed', 'abandoned')),
  summary text,
  region_feedback jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.practice_sessions enable row level security;

create index if not exists practice_sessions_user_id_created_at_idx
  on public.practice_sessions (user_id, created_at desc);

create index if not exists practice_sessions_pose_key_idx
  on public.practice_sessions (pose_key);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email,
      updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email)
select id, email
from auth.users
on conflict (id) do update
set email = excluded.email,
    updated_at = timezone('utc', now());

create or replace function public.touch_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;

create trigger touch_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_profile_updated_at();

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = id)
with check ((select auth.uid()) is not null and (select auth.uid()) = id);

drop policy if exists "Users can view their own practice sessions" on public.practice_sessions;
create policy "Users can view their own practice sessions"
on public.practice_sessions
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can insert their own practice sessions" on public.practice_sessions;
create policy "Users can insert their own practice sessions"
on public.practice_sessions
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
