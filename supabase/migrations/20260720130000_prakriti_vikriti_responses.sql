-- L. Glow — per-user response logging for the Prakriti/Vikriti consumer
-- assessments (first consumer-facing screens for these two tables). Run in
-- the Supabase SQL Editor after all prior migrations.
--
-- Mirrors dosha_results/guna_results/agni_results exactly: one row per
-- completion (never overwritten, full history preserved — Vikriti in
-- particular is meant to change over time, so history is the point, not
-- just a log-and-forget), owner RLS + a consent-gated practitioner-read
-- policy using public.is_practitioner(). The one real difference from
-- those tables: `answers` holds the full denormalized Q&A for the tier
-- (question id, section, prompt, and what was selected/written) instead of
-- a computed score — dosha tagging on these questions is effectively at
-- 0% right now (1/324 Prakriti options, 0/943 Vikriti options tagged, per
-- a live check before writing this), so there is nothing to score yet.
-- This is raw-answer logging by design, not a placeholder for a missing
-- feature — see docs/roadmap.md #52.

create table public.prakriti_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  tier text not null check (tier in ('foundation', 'level2', 'level3')),
  answers jsonb not null,
  completed_at timestamptz not null default now()
);

create table public.vikriti_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  tier text not null check (tier in ('level1', 'level2', 'level3')),
  answers jsonb not null,
  completed_at timestamptz not null default now()
);

alter table public.prakriti_responses enable row level security;
alter table public.vikriti_responses enable row level security;

create policy "Owner full access"
  on public.prakriti_responses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Practitioners can read consented clients' prakriti responses"
  on public.prakriti_responses for select
  using (
    exists (select 1 from public.users owner where owner.id = prakriti_responses.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

create policy "Owner full access"
  on public.vikriti_responses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Practitioners can read consented clients' vikriti responses"
  on public.vikriti_responses for select
  using (
    exists (select 1 from public.users owner where owner.id = vikriti_responses.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );
