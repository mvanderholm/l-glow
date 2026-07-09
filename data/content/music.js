// DRAFT — per-dosha playlist URLs still need Thea's Spotify links before the home card goes live.
// Open question: does she organize playlists by dosha only, or also by season/energetic state?
// Current structure is dosha-keyed. Add season/state variants once she confirms.

// L. Glow Living's profile — provided by Matt, July 2026.
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

export function playlistForDosha(dosha) {
  return playlists[dosha] ?? null;
}
