-- L. Glow — push notification infrastructure, Aug 7 2026. Stores each
-- device's Expo push token against the signed-in user, registered by
-- data/user/pushNotifications.js on sign-in. No messaging feature exists
-- yet to notify about (see roadmap #59) — this is the foundation any future
-- push-triggering feature (messaging, check-in reminders, etc.) builds on.
-- First real consumer: notify-intake-complete pushes Thea in addition to
-- emailing her, whenever she has a registered token.
--
-- One user can have multiple tokens (multiple devices) — primary key is the
-- token itself, not user_id, so re-registering the same device just updates
-- its row (onConflict: 'user_id,token' in the app matches the unique
-- constraint below, not a true primary key upsert, since a token is already
-- globally unique on its own — the composite constraint is defensive, not
-- load-bearing).

create table public.push_tokens (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  token      text not null,
  platform   text not null check (platform in ('ios', 'android')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);

alter table public.push_tokens enable row level security;

create policy "Users can manage their own push tokens"
  on public.push_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Practitioners can read tokens so a future Edge Function can look up
-- "does this client have a device registered" — mirrors the read-only
-- practitioner policies elsewhere (e.g. intake_forms). No practitioner
-- write access; a client's own device registration is theirs to manage.
create policy "Practitioners can read push tokens"
  on public.push_tokens for select
  using (public.is_practitioner());
