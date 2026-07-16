// Fallback/seed data for the check-in question wording — see
// data/content/remote.js for the live/cached version Thea can edit via the
// practitioner hub. The 5 keys here are fixed: they're literal typed columns
// on the `checkins` table (physical/mental/emotional/hunger/tongue), so this
// array's *keys* can't change without a schema migration — only the label/
// description/hint wording is meant to be edited.

export const checkinDimensions = [
  { key: 'physical', label: 'Physical', desc: 'Energy, digestion, body' },
  { key: 'mental', label: 'Mental', desc: 'Focus, clarity, sharpness' },
  { key: 'emotional', label: 'Emotional', desc: 'Mood, calm, openness' },
  { key: 'hunger', label: 'Morning hunger', desc: 'One of the cleanest signals of your digestive fire.', hint: { low: 'none at all', high: 'genuinely hungry' } },
  { key: 'tongue', label: 'Tongue coating', desc: 'Check before eating or drinking anything. That coating is information.', hint: { low: 'clear', high: 'heavy coating' } },
];
