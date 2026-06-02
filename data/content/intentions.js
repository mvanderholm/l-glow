// DRAFT — dosha-specific suggestions await Thea's content.
// Universal suggestions confirmed in voice-guide.md (Thea's own examples).

export const intentions = {
  universal: [
    { id: 'warm-water',     text: 'drink warm water' },
    { id: 'present-eating', text: 'be present when I eat' },
    { id: 'phone-down',     text: 'put my phone down after 9pm' },
  ],
  vata:  [], // awaiting Thea
  pitta: [], // awaiting Thea
  kapha: [], // awaiting Thea
};

export function intentionSuggestions(dosha) {
  const specific = dosha ? (intentions[dosha] ?? []) : [];
  return [...specific, ...intentions.universal].slice(0, 5);
}
