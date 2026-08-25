-- L. Glow — track per-client declines on "Just for today" intentions, and
-- which suggestion (if any) a saved intention came from.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Matt's ask, Aug 25 2026: let someone decline a suggested intention that
-- doesn't work for them and pick another, mirroring the Daily Rhythms
-- decline mechanic (see 20260818000000_routine_declines.sql) — a declined
-- suggestion drops out of today's chip menu, resets tomorrow. Unlike
-- routines, intentions have no time-of-day category, so this is the same
-- log-table shape minus that column.
--
-- suggestion_id is nullable: a freehand-typed intention (the "write your
-- own" field) has no suggestion to decline, so this stays null for those
-- and the decline action on the client is simply a no-op for that row.

alter table public.intentions add column suggestion_id text;

create table public.intention_declines (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  date         date not null,
  item_id      text not null,
  declined_at  timestamptz not null default now()
);

create index intention_declines_user_date_idx on public.intention_declines (user_id, date);
alter table public.intention_declines enable row level security;

create policy "Owner full access" on public.intention_declines
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());
