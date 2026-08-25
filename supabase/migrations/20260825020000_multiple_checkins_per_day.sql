-- L. Glow — allow more than one check-in per day.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Matt's ask, Aug 25 2026: a new check-in was silently overwriting the
-- existing one for the day — "It changes" (one of the app's five core
-- principles) is meant to apply within a day too, not just day to day.
--
-- The unique(user_id, date) constraint from the original schema is exactly
-- what forced the app-side upsert-by-date behavior; dropping it is the
-- whole fix on the database side. If this constraint's actual name differs
-- from Postgres's default naming (it shouldn't, since it was declared
-- inline in the original CREATE TABLE with no explicit name), look it up
-- via: select conname from pg_constraint where conrelid = 'public.checkins'::regclass and contype = 'u';

alter table public.checkins drop constraint if exists checkins_user_id_date_key;
