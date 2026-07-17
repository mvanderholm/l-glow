// Fallback/seed data for Daily Rhythms routine items — see
// data/content/remote.js for the live/cached version Thea can edit via the
// practitioner hub. Universal anchors are Thea's explicit naming from voice
// memo and roadmap; dosha-specific arrays are hers to fill in there.

export const routineAnchors = [
  { id: 'wake',  time: 'morning', label: 'Wake before 6am' },
  { id: 'phone', time: 'evening', label: 'Phone down after 9pm' },
  { id: 'sleep', time: 'evening', label: 'In bed before 10pm' },
];

export const routines = {
  vata:  [],
  pitta: [],
  kapha: [],
};
