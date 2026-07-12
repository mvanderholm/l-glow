-- L. Glow — initial data layer schema (roadmap #30, Phase 1)
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query),
-- or via `supabase db push` once the CLI is linked to the project.
--
-- Scope: user data persistence only (Phase 1). Practitioner-facing reporting
-- (Phase 2 — Thea's client view) is NOT included here — that's gated on a
-- conversation with her about what she actually wants to see, per roadmap #30.
-- No practitioner-read policies exist yet; every table below is owner-only.
--
-- Deliberately excluded: theme/brand/view-mode/onboarded-flag. Those are
-- device display preferences, not practice data — they stay AsyncStorage-only.

-- ── users ────────────────────────────────────────────────────────────────
-- One row per authenticated user, 1:1 with auth.users. Auto-created by the
-- trigger below on signup, so the app never has to explicitly create this row.

create table public.users (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  role         text not null default 'user' check (role in ('user', 'practitioner')),
  created_at   timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read their own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own row"
  on public.users for update
  using (auth.uid() = id);

-- Auto-create a public.users row whenever someone signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── dosha_results ────────────────────────────────────────────────────────
-- One row per quiz-taking. Retakes are allowed to accumulate (history), not
-- overwritten — matches "revisit" behavior the app already supports.

create table public.dosha_results (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  dosha        text not null check (dosha in ('vata', 'pitta', 'kapha')),
  vata_score   int  not null,
  pitta_score  int  not null,
  kapha_score  int  not null,
  taken_at     timestamptz not null default now()
);

create index dosha_results_user_id_idx on public.dosha_results (user_id, taken_at desc);
alter table public.dosha_results enable row level security;

create policy "Owner full access" on public.dosha_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── guna_results ─────────────────────────────────────────────────────────

create table public.guna_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  dominant      text not null check (dominant in ('sattva', 'rajas', 'tamas')),
  sattva_score  int  not null,
  rajas_score   int  not null,
  tamas_score   int  not null,
  taken_at      timestamptz not null default now()
);

create index guna_results_user_id_idx on public.guna_results (user_id, taken_at desc);
alter table public.guna_results enable row level security;

create policy "Owner full access" on public.guna_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── agni_results ─────────────────────────────────────────────────────────

create table public.agni_results (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users (id) on delete cascade,
  agni_type      text not null check (agni_type in ('sama', 'vishama', 'tikshna', 'manda')),
  sama_count     int  not null default 0,
  vishama_count  int  not null default 0,
  tikshna_count  int  not null default 0,
  manda_count    int  not null default 0,
  taken_at       timestamptz not null default now()
);

create index agni_results_user_id_idx on public.agni_results (user_id, taken_at desc);
alter table public.agni_results enable row level security;

create policy "Owner full access" on public.agni_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── checkins ─────────────────────────────────────────────────────────────
-- One row per user per calendar day — matches the app's AsyncStorage model
-- (saveCheckin overwrites the same day if called again). hunger/tongue are
-- nullable since older check-ins predate those questions being added.

create table public.checkins (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  date       date not null,
  physical   int  not null,
  mental     int  not null,
  emotional  int  not null,
  hunger     int,
  tongue     int,
  note       text,
  saved_at   timestamptz not null default now(),
  unique (user_id, date)
);

create index checkins_user_id_date_idx on public.checkins (user_id, date desc);
alter table public.checkins enable row level security;

create policy "Owner full access" on public.checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── journal_entries ──────────────────────────────────────────────────────
-- One row per user per day, same one-per-day-overwrite model as checkins.

create table public.journal_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  date       date not null,
  grateful   text,
  showed     text,
  tomorrow   text,
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index journal_entries_user_id_date_idx on public.journal_entries (user_id, date desc);
alter table public.journal_entries enable row level security;

create policy "Owner full access" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── intentions ───────────────────────────────────────────────────────────
-- "Just for today, I will ___" — one per user per day.

create table public.intentions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  date       date not null,
  text       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create index intentions_user_id_date_idx on public.intentions (user_id, date desc);
alter table public.intentions enable row level security;

create policy "Owner full access" on public.intentions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── intake_forms ─────────────────────────────────────────────────────────
-- One row per user, whole form as jsonb — matches the app's model exactly
-- (single object at @lglow/intake, partial saves valid, resume where left off).

create table public.intake_forms (
  user_id    uuid primary key references public.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.intake_forms enable row level security;

create policy "Owner full access" on public.intake_forms
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── practice_completions ─────────────────────────────────────────────────
-- Named in roadmap #30's original table list. NOTHING IN THE APP WRITES TO
-- THIS YET — there's no "mark a practice complete" feature built. Scaffolded
-- now since the table shape was already agreed in the roadmap; safe to leave
-- empty until that feature exists.

create table public.practice_completions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  practice_id   text not null,
  completed_at  timestamptz not null default now()
);

create index practice_completions_user_id_idx on public.practice_completions (user_id, completed_at desc);
alter table public.practice_completions enable row level security;

create policy "Owner full access" on public.practice_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
