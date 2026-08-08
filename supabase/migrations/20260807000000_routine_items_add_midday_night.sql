-- L. Glow — Daily Rhythms: widen routine_items.time from 2 values
-- (morning/evening) to 4 (morning/midday/evening/night), per Matt's
-- request Aug 7 2026. Existing rows are all morning/evening, so this is
-- purely additive — no data to migrate, just loosen the check constraint
-- so the practitioner hub editor can save the two new values.

alter table public.routine_items drop constraint if exists routine_items_time_check;

alter table public.routine_items
  add constraint routine_items_time_check
  check (time in ('morning', 'midday', 'evening', 'night'));
