-- L. Glow — content fix: pull the first mythbuster ("healthy-eat-more")
-- forward from its original launch-week date (2026-08-17) to today, so it
-- reads as active now instead of showing the "check back" empty state until
-- launch. Matt's call, July 2026. Run in the Supabase SQL Editor after the
-- prior migrations.
--
-- Only this one row moves — the rest of the 12-week Agni edition schedule
-- (2026-08-24 through 2026-11-02) is untouched. Mirrors the same change
-- made to data/content/mythbusters.js (the offline/first-launch fallback)
-- so both sources agree.

update public.mythbusters
set week_start = '2026-07-17'
where id = 'healthy-eat-more';
