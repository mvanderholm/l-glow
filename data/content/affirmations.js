// DRAFT — affirmations bank. Matt draft June 29, 2026. Sent to Thea for review/markup.
// Schema: { id, text, dosha: 'vata'|'pitta'|'kapha'|'universal', season?, state? }
// season: 'fall'|'winter'|'spring'|'summer' (optional filter)
// state:  'depleted'|'overheated'|'heavy' (optional — for vikriti routing later)

export const affirmations = [

  // ── Universal ─────────────────────────────────────────────────────────────
  { id: 'u-1',  text: 'I am exactly where I need to be.',            dosha: 'universal' },
  { id: 'u-2',  text: 'I trust what my body is telling me.',         dosha: 'universal' },
  { id: 'u-3',  text: 'Stillness is also movement.',                 dosha: 'universal' },
  { id: 'u-4',  text: 'I digest what I take in.',                    dosha: 'universal' },
  { id: 'u-5',  text: "What I needed last week isn't what I need today.", dosha: 'universal' },
  { id: 'u-6',  text: 'There is no bad here. Only information.',     dosha: 'universal' },
  { id: 'u-7',  text: "My body is not broken. It's talking.",        dosha: 'universal' },
  { id: 'u-8',  text: '80% is enough.',                              dosha: 'universal' },
  { id: 'u-9',  text: 'I eat with presence. The rest takes care of itself.', dosha: 'universal' },
  { id: 'u-10', text: 'I am all three. One just speaks louder right now.', dosha: 'universal' },
  { id: 'u-11', text: "The fire doesn't need to be huge. Just alive.", dosha: 'universal' },

  // ── Vata ──────────────────────────────────────────────────────────────────
  { id: 'v-1', text: 'I am rooted, but I flow.',                     dosha: 'vata' },
  { id: 'v-2', text: 'I slow down without losing myself.',           dosha: 'vata' },
  { id: 'v-3', text: 'The ground is always here.',                   dosha: 'vata' },
  // source: transcript 19 (061926_03). Thea's words.
  { id: 'v-4', text: "You don't need another plan. What you need is a safe place to land.", dosha: 'vata' },
  { id: 'v-5', text: 'One thing at a time. The rest will wait.',     dosha: 'vata' },
  { id: 'v-6', text: 'My nervous system gets to rest now.',          dosha: 'vata' },
  { id: 'v-7', text: "I don't have to figure it out today.",         dosha: 'vata' },
  { id: 'v-8', text: "My creativity doesn't need chaos to work.",    dosha: 'vata' },
  { id: 'v-9', text: 'I come back to my body. It knows where to land.', dosha: 'vata' },
  // THEA NOTE: v-10 may work better as a check-in mantra than a daily affirmation — her call
  { id: 'v-10', text: 'Warm. Slow. Here.',                           dosha: 'vata' },

  // ── Pitta ─────────────────────────────────────────────────────────────────
  { id: 'p-1', text: 'I lead without needing to control.',           dosha: 'pitta' },
  { id: 'p-2', text: "My fire serves me. I don't serve it.",         dosha: 'pitta' },
  { id: 'p-3', text: 'Rest is not retreat.',                         dosha: 'pitta' },
  // source: transcript 19 (061926_03). Thea's words.
  { id: 'p-4', text: 'You were never meant to carry the whole world. Put something down.', dosha: 'pitta' },
  { id: 'p-5', text: 'Done is better than perfect. Today, anyway.',  dosha: 'pitta' },
  { id: 'p-6', text: 'Cool is also a kind of power.',                dosha: 'pitta' },
  { id: 'p-7', text: 'I can want it and let it land wherever it lands.', dosha: 'pitta' },
  { id: 'p-8', text: "My intensity is mine. I don't owe it to the room.", dosha: 'pitta' },
  { id: 'p-9', text: "I compete with who I was. That's the only comparison that matters.", dosha: 'pitta' },
  { id: 'p-10', text: "The destination isn't going anywhere. I don't have to sprint.", dosha: 'pitta' },

  // ── Kapha ─────────────────────────────────────────────────────────────────
  { id: 'k-1', text: 'I move, even when staying feels easier.',      dosha: 'kapha' },
  { id: 'k-2', text: 'My steadiness is a gift, not a limit.',        dosha: 'kapha' },
  { id: 'k-3', text: 'Something new is always beginning.',           dosha: 'kapha' },
  // source: transcript 19 (061926_03). Thea's words.
  { id: 'k-4', text: "You don't have to earn your worth by carrying everyone else.", dosha: 'kapha' },
  { id: 'k-5', text: 'I am not stuck. I am gathering.',              dosha: 'kapha' },
  { id: 'k-6', text: "I don't need to feel ready to begin.",         dosha: 'kapha' },
  // THEA NOTE: k-7 — "too" may need a second clause; her call
  { id: 'k-7', text: 'My loyalty belongs here too.',                 dosha: 'kapha' },
  { id: 'k-8', text: 'The heaviness is real. And it is also moving.', dosha: 'kapha' },
  { id: 'k-9', text: 'Slow is still moving.',                        dosha: 'kapha' },
  { id: 'k-10', text: 'Something loosened today. I can feel it.',    dosha: 'kapha' },

  // ── Seasonal ──────────────────────────────────────────────────────────────
  { id: 's-fall-1', text: 'The leaves let go. I can too.',           dosha: 'universal', season: 'fall'   },
  { id: 's-fall-2', text: 'I am warmth on purpose.',                 dosha: 'universal', season: 'fall'   },
  { id: 's-win-1',  text: 'Rest is the right thing right now.',      dosha: 'universal', season: 'winter' },
  { id: 's-win-2',  text: "Stillness isn't absence. It's winter doing its job.", dosha: 'universal', season: 'winter' },
  { id: 's-spr-1',  text: "The body wants to clear. I'm helping it.", dosha: 'universal', season: 'spring' },
  { id: 's-spr-2',  text: "I release what I've been carrying since winter.", dosha: 'universal', season: 'spring' },
  { id: 's-sum-1',  text: 'I bring cool to everything I touch today.', dosha: 'universal', season: 'summer' },
  { id: 's-sum-2',  text: 'The heat is high. I am steady.',          dosha: 'universal', season: 'summer' },

  // ── State-based (vikriti routing — not active yet) ────────────────────────
  { id: 'st-dep-1', text: 'Nourishment before output. Always.',      dosha: 'universal', state: 'depleted'    },
  { id: 'st-dep-2', text: "I am refilling, not falling behind.",     dosha: 'universal', state: 'depleted'    },
  { id: 'st-dep-3', text: 'This tired is information, not failure.', dosha: 'universal', state: 'depleted'    },
  { id: 'st-hot-1', text: 'I lower the temperature by one degree. That\'s enough.', dosha: 'universal', state: 'overheated' },
  { id: 'st-hot-2', text: "I don't have to match the intensity of this moment.", dosha: 'universal', state: 'overheated' },
  { id: 'st-hot-3', text: "Cool isn't checked out. It's recalibrated.", dosha: 'universal', state: 'overheated' },
  { id: 'st-hvy-1', text: "One movement. That's the whole ask.",     dosha: 'universal', state: 'heavy'       },
  { id: 'st-hvy-2', text: "I don't wait to feel like it. I start, and then I feel it.", dosha: 'universal', state: 'heavy' },
  { id: 'st-hvy-3', text: "Light enters slowly. I'm letting it in.", dosha: 'universal', state: 'heavy'       },
];

// Returns the pool for a given dosha: dosha-specific entries first, then universals.
// Seasonal and state entries are excluded from the default pool — pass filters to include them.
// Prakriti-based for now — swap dosha source for vikriti when check-in signal is reliable.
// Takes the list explicitly (rather than always reading the static array above) so callers
// can pass the live/cached list from data/content/remote.js.
export function affirmationsForDosha(dosha, { season, state, list = affirmations } = {}) {
  const specific  = dosha ? list.filter(a => a.dosha === dosha && !a.season && !a.state) : [];
  const universal = list.filter(a => a.dosha === 'universal' && !a.season && !a.state);
  const seasonal  = season ? list.filter(a => a.season === season) : [];
  const stated    = state  ? list.filter(a => a.state  === state)  : [];
  return [...specific, ...universal, ...seasonal, ...stated];
}
