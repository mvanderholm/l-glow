-- L. Glow — playlists: from a fixed 3-row dosha table to a real library.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- The original design (20260717030000) used `dosha` itself as the primary
-- key — exactly 3 rows, ever, one per dosha, no add/delete. That was a
-- deliberate minimal first cut before Thea had sent any real Spotify
-- links, not the intended shape of the Sound Library she described
-- (transcript 28: morning energy, focus, sleep, grounding, meditation,
-- anxiety, heartbreak, etc. — many playlists, only some of them tied to a
-- single dosha). Matt's ask, Aug 17 2026: let her add as many as she wants.
--
-- `category` is plain free text, not a fixed enum — she can invent new
-- categories from the admin UI with no future migration needed, so this
-- doesn't have to wait on agreeing her exact taxonomy up front.
-- `dosha` becomes an optional tag array (same shape as
-- prakriti_questions/vikriti_questions' per-option dosha tags) instead of
-- a required single value — a playlist can be untagged, tied to one dosha,
-- or relevant to more than one.
--
-- Data-preserving: the 3 existing rows are carried over as single-element
-- dosha-tagged entries, nothing is dropped.

alter table public.playlists add column id uuid default gen_random_uuid();
alter table public.playlists add column category text;
alter table public.playlists add column sort_order int;
alter table public.playlists add column dosha_tags text[];

update public.playlists set
  dosha_tags = array[dosha],
  sort_order = case dosha when 'vata' then 0 when 'pitta' then 1 when 'kapha' then 2 else 0 end;

alter table public.playlists drop constraint playlists_pkey;
alter table public.playlists drop constraint playlists_dosha_check;
alter table public.playlists drop column dosha;
alter table public.playlists rename column dosha_tags to dosha;

alter table public.playlists alter column id set not null;
alter table public.playlists add primary key (id);

-- RLS policies from the original migration reference no dropped/renamed
-- columns and don't need to be recreated.
