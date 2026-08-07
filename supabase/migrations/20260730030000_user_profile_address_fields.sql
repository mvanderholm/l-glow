-- L. Glow — extend the profile fields added in
-- 20260730010000_user_profile_fields.sql with City, State, and Zip, so the
-- address on Your Profile / the Practitioner Hub's Profile tab isn't just a
-- single free-text line. Run in the Supabase SQL Editor after the prior
-- migrations. No new RLS policies needed — these columns fall under the
-- same "Users can update their own row" / "Practitioners can update
-- consented clients' profile" policies already covering `address`.

alter table public.users
  add column city  text,
  add column state text,
  add column zip    text;
