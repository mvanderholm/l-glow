// DRAFT — placeholder affirmations. Matt to source and categorize the full bank.
// Schema: { id, text, dosha: 'vata'|'pitta'|'kapha'|'universal', season?, state? }
// season: 'fall'|'winter'|'spring'|'summer' (optional filter)
// state:  'depleted'|'overheated'|'heavy' (optional — for vikriti routing later)

export const affirmations = [
  // Universal
  { id: 'u-1', text: 'I am exactly where I need to be.',      dosha: 'universal' },
  { id: 'u-2', text: 'I trust what my body is telling me.',   dosha: 'universal' },
  { id: 'u-3', text: 'Stillness is also movement.',           dosha: 'universal' },
  { id: 'u-4', text: 'I digest what I take in.',              dosha: 'universal' },

  // Vata
  { id: 'v-1', text: 'I am rooted, but I flow.',              dosha: 'vata' },
  { id: 'v-2', text: 'I slow down without losing myself.',    dosha: 'vata' },
  { id: 'v-3', text: 'The ground is always here.',            dosha: 'vata' },

  // Pitta
  { id: 'p-1', text: 'I lead without needing to control.',    dosha: 'pitta' },
  { id: 'p-2', text: 'My fire serves me. I don\'t serve it.', dosha: 'pitta' },
  { id: 'p-3', text: 'Rest is not retreat.',                  dosha: 'pitta' },

  // Kapha
  { id: 'k-1', text: 'I move, even when staying feels easier.', dosha: 'kapha' },
  { id: 'k-2', text: 'My steadiness is a gift, not a limit.',   dosha: 'kapha' },
  { id: 'k-3', text: 'Something new is always beginning.',       dosha: 'kapha' },

  // Archetype reminders — source: transcript 19 (061926_03). Thea's words.
  { id: 'v-4', text: 'You don\'t need another plan. What you need is a safe place to land.', dosha: 'vata'  },
  { id: 'p-4', text: 'You were never meant to carry the whole world. Put something down.',   dosha: 'pitta' },
  { id: 'k-4', text: 'You don\'t have to earn your worth by carrying everyone else.',        dosha: 'kapha' },
];

// Returns the pool for a given dosha: dosha-specific entries first, then universals.
// Prakriti-based for now — swap dosha source for vikriti when check-in signal is reliable.
export function affirmationsForDosha(dosha) {
  const specific  = dosha ? affirmations.filter(a => a.dosha === dosha)     : [];
  const universal = affirmations.filter(a => a.dosha === 'universal');
  return [...specific, ...universal];
}
