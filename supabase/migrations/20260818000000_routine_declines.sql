-- L. Glow — track per-client declines on Daily Rhythms.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Matt's ask, Aug 18 2026: Daily Rhythms on /recommendations was showing
-- every qualifying routine_item at once (every universal anchor plus every
-- item tagged for the client's dosha). Wanted: one pick per time-of-day
-- category, with a way to decline it and see the next qualifying item in
-- that category, resetting daily rather than accumulating forever.
--
-- Log table, not a single mutable row per user/day — same shape as
-- practice_completions and messages: one row per decline event. "What's
-- declined today for this category" is a query (`where user_id = me and
-- date = today and category = X`), not a stored/mutable field, so the
-- "active" pick is always derived (first qualifying item not yet
-- declined), never stored redundantly.
--
-- Owner-only RLS, same as intentions/checkins before their practitioner-
-- read policies were added later on request — add one the same way if
-- Thea ever wants visibility into this, not built ahead of being asked.

create table public.routine_declines (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  date         date not null,
  category     text not null,
  item_id      text not null,
  declined_at  timestamptz not null default now()
);

create index routine_declines_user_date_idx on public.routine_declines (user_id, date, category);
alter table public.routine_declines enable row level security;

create policy "Owner full access" on public.routine_declines
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());
