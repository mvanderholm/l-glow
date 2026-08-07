-- L. Glow — basic profile fields: First Name, Last Name, Phone, Address
-- (Display Name already existed). Run in the Supabase SQL Editor after the
-- prior migrations.
--
-- These are separate from intake_forms' Basic Information section (name,
-- phone, address, city/state/zip, emergency contact, etc.) — that's a
-- one-time clinical intake questionnaire with its own deeper contact
-- fields, not the account-profile concept this adds. Known overlap: phone
-- and address exist in both places now, so a client could in principle
-- have a different phone number on Your Profile than in their Intake form.
-- Not reconciled here — flagged in docs/roadmap.md instead, same spirit as
-- the existing Dosha-quiz/Prakriti reconciliation flag (#52). Revisit if
-- this ever actually confuses Thea in practice.
--
-- Practitioners get UPDATE (not just the existing SELECT) on these rows,
-- gated identically to the read policy in
-- 20260713000000_fix_users_rls_recursion.sql (consented clients only) — so
-- Thea can fix a client's profile info from the Practitioner Hub, e.g.
-- after a phone call. Like the existing self-update policy, this is a
-- row-level grant (no column-level restriction), matching this table's
-- existing security posture rather than introducing a new one.

alter table public.users
  add column first_name text,
  add column last_name  text,
  add column phone       text,
  add column address     text;

create policy "Practitioners can update consented clients' profile"
  on public.users for update
  using (
    consented_to_practitioner_view = true
    and public.is_practitioner()
  )
  with check (
    consented_to_practitioner_view = true
    and public.is_practitioner()
  );
