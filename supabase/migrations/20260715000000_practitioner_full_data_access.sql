-- L. Glow — practitioner dashboard v2: full data access + follow-up notes
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- v1 only granted practitioner-read on users + intake_forms. Matt's call,
-- July 2026: build ahead of the Thea conversation again — show everything
-- we have (assessment results, check-in history, journal) plus a private
-- notes log Thea can write in herself. No auto-generated clinical
-- recommendations — that's her judgment, not something to fabricate (see
-- CLAUDE.md content-authorship rules).

create policy "Practitioners can read consented clients' dosha results"
  on public.dosha_results for select
  using (
    exists (select 1 from public.users owner where owner.id = dosha_results.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

create policy "Practitioners can read consented clients' guna results"
  on public.guna_results for select
  using (
    exists (select 1 from public.users owner where owner.id = guna_results.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

create policy "Practitioners can read consented clients' agni results"
  on public.agni_results for select
  using (
    exists (select 1 from public.users owner where owner.id = agni_results.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

create policy "Practitioners can read consented clients' tongue checks"
  on public.tongue_checks for select
  using (
    exists (select 1 from public.users owner where owner.id = tongue_checks.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

create policy "Practitioners can read consented clients' checkins"
  on public.checkins for select
  using (
    exists (select 1 from public.users owner where owner.id = checkins.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

create policy "Practitioners can read consented clients' journal entries"
  on public.journal_entries for select
  using (
    exists (select 1 from public.users owner where owner.id = journal_entries.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );

-- ── practitioner_notes ──────────────────────────────────────────────────
-- Thea's own follow-up notes about a client — private practitioner-side
-- record, not shown to the client. Deliberately a log (insert, not
-- upsert-by-day) so it reads as a running history of follow-up, not a
-- single overwritable field that loses what she wrote last time.
-- No client-read policy exists on purpose — this table is practitioner-only,
-- regardless of consent state.

create table public.practitioner_notes (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid not null references public.users (id) on delete cascade,
  practitioner_id  uuid not null references public.users (id) on delete cascade,
  note             text not null,
  created_at       timestamptz not null default now()
);

create index practitioner_notes_client_id_idx on public.practitioner_notes (client_id, created_at desc);
alter table public.practitioner_notes enable row level security;

create policy "Practitioners can manage notes for consented clients"
  on public.practitioner_notes for all
  using (
    exists (select 1 from public.users owner where owner.id = practitioner_notes.client_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  )
  with check (
    exists (select 1 from public.users owner where owner.id = practitioner_notes.client_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
    and practitioner_id = auth.uid()
  );
