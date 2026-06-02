// Instagram feed configuration
// Replace INSTAGRAM_ACCESS_TOKEN with a long-lived token from the Meta Graph API.
// Token lasts 60 days — refresh before it expires via:
//   GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={token}
//
// ⚠️  Do not commit a real token to a public repo.

export const INSTAGRAM_HANDLE = 'l.glowliving';
export const INSTAGRAM_ACCESS_TOKEN = '';  // paste token here

const FIELDS = 'id,media_type,media_url,thumbnail_url,permalink,timestamp';
const LIMIT  = 12;

export async function fetchRecentPosts() {
  if (!INSTAGRAM_ACCESS_TOKEN) return [];

  const url =
    `https://graph.instagram.com/me/media` +
    `?fields=${FIELDS}&limit=${LIMIT}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}
