-- L. Glow — tongue check self-assessment persistence
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Found during a July 2026 sync audit: app/tongue-check.js computed a
-- reading and threw it away — the result was never saved anywhere, not even
-- to AsyncStorage. This table matches the shape of dosha_results/
-- guna_results/agni_results: one row per attempt, owner-only RLS.

create table public.tongue_checks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  reading    text not null check (reading in ('vata', 'pitta', 'kapha', 'mixed', 'balanced')),
  shape      text,
  size       text,
  color      text,
  coating    text,
  ama_level  int not null default 0,
  signs      text[] not null default '{}',
  taken_at   timestamptz not null default now()
);

create index tongue_checks_user_id_idx on public.tongue_checks (user_id, taken_at desc);
alter table public.tongue_checks enable row level security;

create policy "Owner full access" on public.tongue_checks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
