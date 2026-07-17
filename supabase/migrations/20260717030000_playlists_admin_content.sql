-- L. Glow — admin-editable content: per-dosha Spotify playlists (seventh
-- content type, same pattern as the others). Run in the Supabase SQL Editor
-- after the prior migrations.
--
-- Only 3 rows ever exist here (one per dosha) — dosha is the primary key,
-- not a synthetic id, since there's no "add another vata playlist" case in
-- the current design. name/url are nullable because Thea hasn't sent her
-- per-dosha playlist links yet (see roadmap #10); mood copy already shipped
-- and is seeded below. SPOTIFY_PROFILE_URL (the profile-level link on the
-- About Thea screen) is NOT part of this table — it's an infra/account
-- constant Matt set once, not content Thea edits, so it stays a static
-- export in data/content/music.js.

create table public.playlists (
  dosha      text primary key check (dosha in ('vata', 'pitta', 'kapha')),
  name       text,
  url        text,
  mood       text not null,
  updated_at timestamptz not null default now()
);

alter table public.playlists enable row level security;

create policy "Anyone can read playlists"
  on public.playlists for select
  using (true);

create policy "Practitioners can manage playlists"
  on public.playlists for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/music.js's playlists export — do not hand-edit, regenerate if the source changes.
insert into public.playlists (dosha, name, url, mood) values
  ($d$vata$d$, null, null, $m$Slow, warm, grounding. Something to settle into.$m$),
  ($d$pitta$d$, null, null, $m$Cool and easy. Nothing too intense today.$m$),
  ($d$kapha$d$, null, null, $m$Something that moves you. A little lift.$m$);
