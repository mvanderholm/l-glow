-- L. Glow — practitioner dashboard v1 (roadmap #30, Phase 2 — rough pass)
-- Run in the Supabase SQL Editor after 20260711000000_init_schema.sql.
--
-- Deliberately minimal: this is a first version to react to, built BEFORE the
-- real design conversation with Thea about what she actually wants to see.
-- Consent is a single boolean per client, not the richer practitioner_clients
-- join table originally sketched in roadmap #30 — there's exactly one
-- practitioner (Thea) right now, and no UI exists yet for a user to grant
-- this themselves. Revisit both when the real conversation happens.
--
-- No UI to set role='practitioner' or flip consent exists yet either — both
-- are manual SQL for now (see the two `update` templates at the bottom of
-- this file, commented out — run them by hand for whichever accounts you're
-- testing with).

alter table public.users
  add column consented_to_practitioner_view boolean not null default false;

-- Practitioners can read a client's profile row, but only if that client has
-- consented. Combines with the existing "read their own row" policy via OR —
-- this doesn't replace it, every existing access path still works.
create policy "Practitioners can read consented clients"
  on public.users for select
  using (
    consented_to_practitioner_view = true
    and exists (
      select 1 from public.users me
      where me.id = auth.uid() and me.role = 'practitioner'
    )
  );

-- Practitioners can read a client's intake form, same consent gate.
create policy "Practitioners can read consented clients' intake forms"
  on public.intake_forms for select
  using (
    exists (
      select 1 from public.users owner
      where owner.id = intake_forms.user_id
        and owner.consented_to_practitioner_view = true
    )
    and exists (
      select 1 from public.users me
      where me.id = auth.uid() and me.role = 'practitioner'
    )
  );

-- Not included yet: practitioner-read policies on dosha_results, checkins,
-- journal_entries, etc. v1 of the dashboard only shows intake forms. Add
-- policies here (same shape as above) when the dashboard actually grows to
-- show more — no reason to open that surface before it's used.

-- ── Manual setup for testing (run by hand, not part of the migration) ──────
-- update public.users set role = 'practitioner' where email = 'thea@lglowliving.com';
-- update public.users set consented_to_practitioner_view = true where email = '<test client email>';
