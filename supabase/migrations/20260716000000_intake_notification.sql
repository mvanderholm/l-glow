-- L. Glow — intake completion notification
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Tracks whether Thea has already been emailed about this client's
-- completed intake form, so the notify-intake-complete Edge Function never
-- sends a duplicate. Set server-side by the function itself (via the
-- service role, bypassing RLS), not by the client.

alter table public.intake_forms
  add column notified_at timestamptz;
