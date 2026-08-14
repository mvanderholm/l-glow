-- L. Glow — practitioner read access on intentions
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- "Just for today, I will ___" picks were never readable by a practitioner
-- at all -- the table only ever had the owner-only policy from the initial
-- schema. Matt's ask, Aug 12 2026: fold intention history into the
-- Practitioner Hub's existing Check-ins tab, same "log of what someone's
-- actually doing" spirit as checkins/journal already have. Same policy
-- shape as 20260715000000_practitioner_full_data_access.sql.

create policy "Practitioners can read consented clients' intentions"
  on public.intentions for select
  using (
    exists (select 1 from public.users owner where owner.id = intentions.user_id and owner.consented_to_practitioner_view = true)
    and public.is_practitioner()
  );
