-- L. Glow — Ayurvedic Cleanse builder + Weekly Habit Tracker.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Both features are gated behind a signed-in account (no AsyncStorage
-- layer, matching data/user/messages.js's pattern rather than
-- data/user/storage.js's local-first one) -- there's no useful
-- signed-out version of "my cleanse plan" or "my weekly habit grid" the
-- way there is for a check-in or journal entry taken before ever
-- creating an account.
--
-- cleanse_plans: one row per user's cleanse instance. `protocol` is a
-- free-text slug (only '15-day' exists today -- see
-- docs/cleanse-lengths-questions-for-thea.md before ever adding a
-- second value) so a future length doesn't need a schema change, just a
-- new data/content/cleanse*.js file and a new protocol value.
-- safety_answers stores the exact SAFETY_QUESTIONS answers (see
-- data/content/cleanse.js) as {questionId: boolean}, plus the timestamp
-- they passed the gate -- this is the "real gate" record, not just UI
-- state.
create table public.cleanse_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  protocol text not null default '15-day',
  start_date date not null,
  ghee_preference text not null default 'ghee' check (ghee_preference in ('ghee', 'olive_oil')),
  safety_answers jsonb not null default '{}'::jsonb,
  safety_acknowledged_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned')),
  created_at timestamptz not null default now()
);

alter table public.cleanse_plans enable row level security;

create policy "Users can view their own cleanse plans"
  on public.cleanse_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cleanse plans"
  on public.cleanse_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cleanse plans"
  on public.cleanse_plans for update
  using (auth.uid() = user_id);

-- Practitioner read access, same consent-gated pattern as every other
-- client table -- see app/practitioner/dashboard.js's query shape.
create policy "Practitioners can view consented clients' cleanse plans"
  on public.cleanse_plans for select
  using (
    exists (
      select 1 from public.users
      where users.id = cleanse_plans.user_id
        and users.consented_to_practitioner_view = true
    )
    and exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'practitioner'
    )
  );

-- cleanse_recipe_overrides: only written when a user regenerates a
-- recipe via the live path (generate-cleanse-recipe Edge Function) --
-- most plans will have zero rows here, since the static
-- data/content/cleanseRecipes.js content covers the default case.
create table public.cleanse_recipe_overrides (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.cleanse_plans(id) on delete cascade,
  recipe_id text not null,
  content jsonb not null,
  generated_at timestamptz not null default now(),
  unique (plan_id, recipe_id)
);

alter table public.cleanse_recipe_overrides enable row level security;

create policy "Users can manage their own recipe overrides"
  on public.cleanse_recipe_overrides for all
  using (
    exists (select 1 from public.cleanse_plans where cleanse_plans.id = plan_id and cleanse_plans.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.cleanse_plans where cleanse_plans.id = plan_id and cleanse_plans.user_id = auth.uid())
  );

-- cleanse_journal_entries: the Reintroduction journal (guide page 13),
-- days 11-15 only. One row per plan+day, upserted as the user fills it
-- in -- same upsert-by-key shape as the old single-checkin-per-day model
-- had (this doesn't need the multiple-per-day allowance checkins got,
-- since reintroduction only happens once per plan).
create table public.cleanse_journal_entries (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.cleanse_plans(id) on delete cascade,
  day int not null check (day between 11 and 15),
  digestion text,
  energy text,
  mood text,
  skin text,
  notes text,
  updated_at timestamptz not null default now(),
  unique (plan_id, day)
);

alter table public.cleanse_journal_entries enable row level security;

create policy "Users can manage their own cleanse journal entries"
  on public.cleanse_journal_entries for all
  using (
    exists (select 1 from public.cleanse_plans where cleanse_plans.id = plan_id and cleanse_plans.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.cleanse_plans where cleanse_plans.id = plan_id and cleanse_plans.user_id = auth.uid())
  );

create policy "Practitioners can view consented clients' cleanse journal"
  on public.cleanse_journal_entries for select
  using (
    exists (
      select 1 from public.cleanse_plans
      join public.users on users.id = cleanse_plans.user_id
      where cleanse_plans.id = cleanse_journal_entries.plan_id
        and users.consented_to_practitioner_view = true
    )
    and exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'practitioner'
    )
  );

-- habit_tracker_weeks: "My Vedic Practice" worksheet, digitized. One row
-- per user per week. `habits` is 4 categories x 3 user-editable slots,
-- each slot {label, days: [7 booleans, Sun-Sat]} -- edited as one whole
-- grid in the UI, so it's stored as one jsonb blob rather than 12 rows.
-- `daily_journal` is the same week's 7 morning/evening entries, keyed by
-- weekday index. `reflections` is the week's 3 free-text boxes.
create table public.habit_tracker_weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_of date not null,
  habits jsonb not null default '{}'::jsonb,
  daily_journal jsonb not null default '{}'::jsonb,
  reflections jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, week_of)
);

alter table public.habit_tracker_weeks enable row level security;

create policy "Users can manage their own habit tracker weeks"
  on public.habit_tracker_weeks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
