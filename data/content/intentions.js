// Fallback/seed data for "Just for today" intentions — see
// data/content/remote.js for the live/cached version Thea can edit via the
// practitioner hub. Universal suggestions confirmed in voice-guide.md
// (Thea's own examples); dosha-specific arrays are hers to fill in there.

export const intentions = {
  universal: [
    { id: 'warm-water',     text: 'drink warm water' },
    { id: 'present-eating', text: 'be present when I eat' },
    { id: 'phone-down',     text: 'put my phone down after 9pm' },
  ],
  vata:  [],
  pitta: [],
  kapha: [],
};

export function intentionSuggestions(dosha, data = intentions) {
  const specific = dosha ? (data[dosha] ?? []) : [];
  return [...specific, ...data.universal].slice(0, 5);
}
