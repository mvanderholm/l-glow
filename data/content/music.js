// Fallback/seed data for the Sound Library — see data/content/remote.js for
// the live/cached version Thea can add to via the practitioner hub. Aug 17
// 2026: reshaped from a fixed 3-entry dosha-keyed object into a real list —
// see supabase/migrations/20260817000000_playlists_sound_library.sql for
// why. `dosha` is now an optional tag array per entry, not a required key.

// L. Glow Living's profile — provided by Matt, July 2026. Not admin-editable
// (infra constant, not content) — see the note in the playlists migration.
export const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/olukz578ug7dbs8ejdiyf8afs?si=f953687e1a0a4712';

export const playlists = [
  { id: 'seed-vata',  category: null, name: null, url: null, dosha: ['vata'],  mood: 'Slow, warm, grounding. Something to settle into.' },
  { id: 'seed-pitta', category: null, name: null, url: null, dosha: ['pitta'], mood: 'Cool and easy. Nothing too intense today.' },
  { id: 'seed-kapha', category: null, name: null, url: null, dosha: ['kapha'],mood: 'Something that moves you. A little lift.' },
];

// Deterministic daily pick — stable on refresh, rotates each day. Same
// 3-line helper already duplicated in journey.js/today.js; not worth a
// shared module for, per the existing precedent in those files.
function dailyPick(arr) {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return arr[dayIndex % arr.length];
}

// Prefers a playlist tagged for the user's dosha; falls back to rotating
// across the whole library if nothing is tagged for them yet (or nothing
// has been added at all beyond the untagged seed rows).
export function pickTodaysPlaylist(dosha, data = playlists) {
  if (!data?.length) return null;
  const tagged = data.filter(p => p.dosha?.includes(dosha));
  const pool = tagged.length ? tagged : data;
  return dailyPick(pool);
}
