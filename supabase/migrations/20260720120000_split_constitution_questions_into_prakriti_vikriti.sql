-- L. Glow — split constitution_questions into prakriti_questions and
-- vikriti_questions. Run in the Supabase SQL Editor after all prior
-- migrations.
--
-- Matt's call, July 20 2026: Prakriti and Vikriti should be fully
-- independent going forward — separate tables, not just an `assessment`
-- column distinguishing them within one shared table (the original July
-- 17 design, chosen at the time because all six tiers were structurally
-- identical). Reversing that here per explicit instruction, not because
-- the original reasoning was wrong.
--
-- Data-preserving: copies every existing row into its new home (108
-- Prakriti, 142 Vikriti, verified live via REST before writing this) and
-- only drops the old table once both copies are in place, rather than
-- re-seeding from scratch.

begin;

create table public.prakriti_questions (
  id            text primary key,
  tier          text not null check (tier in ('foundation', 'level2', 'level3')),
  section       text,
  prompt        text not null,
  options       jsonb not null,
  sort_order    int not null,
  allow_none    boolean not null default true,
  photo_enabled boolean not null default false,
  input_type    text not null default 'multi_select' check (input_type in ('multi_select', 'free_text')),
  updated_at    timestamptz not null default now()
);

create table public.vikriti_questions (
  id            text primary key,
  tier          text not null check (tier in ('level1', 'level2', 'level3')),
  section       text,
  prompt        text not null,
  options       jsonb not null,
  sort_order    int not null,
  allow_none    boolean not null default true,
  photo_enabled boolean not null default false,
  input_type    text not null default 'multi_select' check (input_type in ('multi_select', 'free_text')),
  updated_at    timestamptz not null default now()
);

alter table public.prakriti_questions enable row level security;
alter table public.vikriti_questions enable row level security;

create policy "Anyone can read prakriti questions"
  on public.prakriti_questions for select
  using (true);

create policy "Practitioners can manage prakriti questions"
  on public.prakriti_questions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

create policy "Anyone can read vikriti questions"
  on public.vikriti_questions for select
  using (true);

create policy "Practitioners can manage vikriti questions"
  on public.vikriti_questions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

insert into public.prakriti_questions (id, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type, updated_at)
select id, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type, updated_at
from public.constitution_questions
where assessment = 'prakriti';

insert into public.vikriti_questions (id, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type, updated_at)
select id, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type, updated_at
from public.constitution_questions
where assessment = 'vikriti';

drop table public.constitution_questions;

commit;
