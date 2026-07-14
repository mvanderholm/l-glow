-- L. Glow — fix "infinite recursion detected in policy for relation users"
-- Run in the Supabase SQL Editor after 20260712000000_practitioner_view_v1.sql.
--
-- The practitioner-read policies checked the caller's role via a subquery on
-- public.users from within a policy ON public.users — Postgres has to
-- re-apply RLS to that inner query, which re-triggers the same policy,
-- causing infinite recursion. The fix is a SECURITY DEFINER function: it runs
-- as the function owner (bypassing RLS for this one lookup) instead of as
-- the calling user, breaking the recursive chain.

create or replace function public.is_practitioner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'practitioner'
  );
$$;

drop policy if exists "Practitioners can read consented clients" on public.users;
create policy "Practitioners can read consented clients"
  on public.users for select
  using (
    consented_to_practitioner_view = true
    and public.is_practitioner()
  );

drop policy if exists "Practitioners can read consented clients' intake forms" on public.intake_forms;
create policy "Practitioners can read consented clients' intake forms"
  on public.intake_forms for select
  using (
    exists (
      select 1 from public.users owner
      where owner.id = intake_forms.user_id
        and owner.consented_to_practitioner_view = true
    )
    and public.is_practitioner()
  );
