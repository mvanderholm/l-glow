-- L. Glow — soft-delete for user accounts, driven from the Practitioner
-- Hub's new Profile "danger zone" (Matt, July 30 2026). Confirmed behavior:
-- a soft-deleted client is fully deactivated — they can't sign in and see
-- their own data, not just hidden from Thea's client list — and it must be
-- reversible (a Restore action, not a one-way door).
--
-- deleted_at is null = active, timestamptz = deactivated at that time.
-- public.users.id itself is never removed by this — only auth.users
-- deletion (see docs from the "can I remove user records" conversation)
-- actually drops the row and cascades. This is the reversible middle
-- ground: hard-delete is still available separately for a real removal.
--
-- public.is_active() follows the exact same SECURITY DEFINER shape as
-- public.is_practitioner() (20260713000000_fix_users_rls_recursion.sql) —
-- needed for the same reason: a policy ON public.users that queries
-- public.users would otherwise recurse into itself.
--
-- Every existing owner/self RLS policy in the schema gets `and
-- public.is_active()` added, so this is real Postgres-level enforcement,
-- not just an app-side check bypassable by calling the API directly with a
-- still-valid token. Practitioner-facing policies are untouched — Thea
-- needs continued read/write access to a deactivated client's row to
-- actually restore them.

alter table public.users add column deleted_at timestamptz;

create or replace function public.is_active()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and deleted_at is null
  );
$$;

-- public.users — self access
drop policy if exists "Users can read their own row" on public.users;
create policy "Users can read their own row"
  on public.users for select
  using (auth.uid() = id and public.is_active());

drop policy if exists "Users can update their own row" on public.users;
create policy "Users can update their own row"
  on public.users for update
  using (auth.uid() = id and public.is_active());

-- dosha_results / guna_results / agni_results / checkins / journal_entries /
-- intentions / intake_forms / practice_completions / tongue_checks —
-- identical "Owner full access" shape, all get the same treatment.
drop policy if exists "Owner full access" on public.dosha_results;
create policy "Owner full access" on public.dosha_results
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.guna_results;
create policy "Owner full access" on public.guna_results
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.agni_results;
create policy "Owner full access" on public.agni_results
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.checkins;
create policy "Owner full access" on public.checkins
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.journal_entries;
create policy "Owner full access" on public.journal_entries
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.intentions;
create policy "Owner full access" on public.intentions
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.intake_forms;
create policy "Owner full access" on public.intake_forms
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.practice_completions;
create policy "Owner full access" on public.practice_completions
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.tongue_checks;
create policy "Owner full access" on public.tongue_checks
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.prakriti_responses;
create policy "Owner full access" on public.prakriti_responses
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

drop policy if exists "Owner full access" on public.vikriti_responses;
create policy "Owner full access" on public.vikriti_responses
  for all using (auth.uid() = user_id and public.is_active()) with check (auth.uid() = user_id and public.is_active());

-- user_manuals: the one client policy here is read-only + approval-gated
-- already (see 20260723000000_user_manuals.sql's own comment) — same
-- pattern, just adding the activity check alongside the existing condition.
drop policy if exists "Client can read their own approved manual" on public.user_manuals;
create policy "Client can read their own approved manual"
  on public.user_manuals for select
  using (auth.uid() = user_id and status = 'approved' and public.is_active());

-- ai_guidance has no client-facing policy at all (practitioner-only,
-- never shown to the client — see its own migration's comment), so nothing
-- to change there. practitioner_notes is the same (practitioner-only).
