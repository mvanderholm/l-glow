-- L. Glow — track which platform a piece of user-submitted data came from
-- (Matt, July 30 2026): "did this quiz/check-in/journal entry/etc. come
-- from the app or the web?" Run in the Supabase SQL Editor after the prior
-- migrations.
--
-- Stores the raw Platform.OS value ('ios' | 'android' | 'web') rather than
-- a pre-collapsed "app"/"web" boolean — strictly more information (Thea/
-- Matt can always collapse ios+android into "app" for display, but can't
-- go the other way), and "web" here means Platform.OS === 'web' specifically
-- — true regardless of whether the in-app "Web View" toggle happened to be
-- on, since that toggle only changes layout, not the underlying platform.
--
-- Nullable: every row that existed before this migration has no platform
-- on record and never will (there's no way to retroactively know), so every
-- reader of this column must treat null as "unknown," not "web" or "app."
-- Applied to every table that represents something a user directly
-- submitted through a form: the four scored assessments, tongue checks,
-- checkins, journal entries, intentions, intake forms, and the Prakriti/
-- Vikriti tier responses. Not applied to practice_completions (nothing
-- writes to it yet — see its own migration's comment) or to `users` itself
-- (profile fields aren't really "a submission," and get edited from
-- multiple platforms over time anyway, so a single platform column on that
-- row wouldn't mean much).

alter table public.dosha_results       add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.guna_results        add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.agni_results        add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.tongue_checks       add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.checkins            add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.journal_entries     add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.intentions          add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.intake_forms        add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.prakriti_responses  add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
alter table public.vikriti_responses   add column platform text check (platform is null or platform in ('ios', 'android', 'web'));
