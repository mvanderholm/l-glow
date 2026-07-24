-- L. Glow — onboarding funnel: signup -> first dosha quiz -> first check-in.
--
-- This is a manual reporting query, not a migration — run it directly in
-- the Supabase SQL Editor whenever you want a read. Nothing here writes
-- anything. Answers "are people getting lost after signup" (roadmap #53)
-- using data that's already being written by the app — no new event
-- tracking needed for this specific question.
--
-- Excludes role = 'practitioner' rows (that's Thea's own account, not a
-- real signup to measure).

-- ── Part 1: per-user detail — good for spot-checking one person ──────────
select
  u.id,
  u.email,
  u.created_at                                                  as signed_up_at,
  min(d.taken_at)                                                as first_dosha_at,
  min(c.saved_at)                                                as first_checkin_at,
  round(extract(epoch from (min(d.taken_at) - u.created_at)) / 86400.0, 1) as days_to_dosha,
  round(extract(epoch from (min(c.saved_at) - u.created_at)) / 86400.0, 1) as days_to_checkin,
  round(extract(epoch from (now() - u.created_at)) / 86400.0, 1)  as days_since_signup
from public.users u
left join public.dosha_results d on d.user_id = u.id
left join public.checkins      c on c.user_id = u.id
where u.role = 'user'
group by u.id, u.email, u.created_at
order by u.created_at desc;

-- ── Part 2: aggregate funnel — the actual "are people stalling" answer ───
-- Buckets everyone by how long it took (or how long it's been, if they
-- still haven't) to complete each step. Adjust the day thresholds below if
-- 1/7/30 doesn't match how you think about it.
with first_events as (
  select
    u.id,
    u.created_at as signed_up_at,
    min(d.taken_at) as first_dosha_at,
    min(c.saved_at) as first_checkin_at
  from public.users u
  left join public.dosha_results d on d.user_id = u.id
  left join public.checkins      c on c.user_id = u.id
  where u.role = 'user'
  group by u.id, u.created_at
)
select
  count(*) as total_signups,

  count(*) filter (where first_dosha_at is not null) as completed_dosha_ever,
  count(*) filter (where first_dosha_at is not null and first_dosha_at - signed_up_at <= interval '1 day') as dosha_within_1_day,
  count(*) filter (where first_dosha_at is not null and first_dosha_at - signed_up_at <= interval '7 day') as dosha_within_7_days,
  count(*) filter (where first_dosha_at is null and now() - signed_up_at > interval '7 day') as stalled_on_dosha_7plus_days,

  count(*) filter (where first_checkin_at is not null) as completed_checkin_ever,
  count(*) filter (where first_checkin_at is not null and first_checkin_at - signed_up_at <= interval '1 day') as checkin_within_1_day,
  count(*) filter (where first_checkin_at is not null and first_checkin_at - signed_up_at <= interval '7 day') as checkin_within_7_days,
  count(*) filter (where first_checkin_at is null and now() - signed_up_at > interval '7 day') as stalled_on_checkin_7plus_days,

  count(*) filter (where first_dosha_at is null and first_checkin_at is null and now() - signed_up_at > interval '7 day') as stalled_on_both_7plus_days
from first_events;
