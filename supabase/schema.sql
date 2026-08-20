-- Run this once in Supabase SQL Editor.
create table if not exists public.shared_trips (
  slug text primary key,
  name text not null,
  members jsonb not null default '[]'::jsonb,
  expenses jsonb not null default '[]'::jsonb,
  paid_transfers jsonb not null default '[]'::jsonb,
  visibility text not null default 'shared-editable',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shared_trips enable row level security;

drop policy if exists "SNOW 2026 can be viewed" on public.shared_trips;
create policy "SNOW 2026 can be viewed"
  on public.shared_trips for select
  using (slug = 'snow-2026');

drop policy if exists "SNOW 2026 can be created" on public.shared_trips;
create policy "SNOW 2026 can be created"
  on public.shared_trips for insert
  with check (slug = 'snow-2026');

drop policy if exists "SNOW 2026 can be updated" on public.shared_trips;
create policy "SNOW 2026 can be updated"
  on public.shared_trips for update
  using (slug = 'snow-2026')
  with check (slug = 'snow-2026');

-- Enable Realtime so all open trip pages receive updates immediately.
alter publication supabase_realtime add table public.shared_trips;
