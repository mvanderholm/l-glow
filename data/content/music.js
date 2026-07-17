// Fallback/seed data for per-dosha playlists — see data/content/remote.js
// for the live/cached version Thea can edit via the practitioner hub.
// name/url still await Thea's Spotify links (see roadmap #10). Open
// question: does she organize playlists by dosha only, or also by
// season/energetic state? Current structure is dosha-keyed — add
// season/state variants once she confirms.

// L. Glow Living's profile — provided by Matt, July 2026. Not admin-editable
// (infra constant, not content) — see the note in the playlists migration.
export const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/olukz578ug7dbs8ejdiyf8afs?si=f953687e1a0a4712';

export const playlists = {
  vata: {
    name: null,
    url: null,
    mood: 'Slow, warm, grounding. Something to settle into.',
  },
  pitta: {
    name: null,
    url: null,
    mood: 'Cool and easy. Nothing too intense today.',
  },
  kapha: {
    name: null,
    url: null,
    mood: 'Something that moves you. A little lift.',
  },
};

export function playlistForDosha(dosha, data = playlists) {
  return data[dosha] ?? null;
}
