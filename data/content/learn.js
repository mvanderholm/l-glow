// CONTENT NOTE: Body fields must come from Thea's voice memos. Do not fill from external sources.
// Pipeline: voice memo → Whisper transcription → adaptation → Thea review → remove DRAFT flag → ship.
// Approved entries: Agni, Ama (May 2026).
// All other `body` fields are null placeholders — do not fabricate content to fill them.

export const concepts = [
  // ─── Tier 1 — Essentials ────────────────────────────────────────────────────
  {
    id: 'doshas',
    tier: 1,
    title: 'The Doshas',
    sanskrit: 'Vata · Pitta · Kapha',
    teaser: 'The three forces that combine in unique proportions in every person.',
    // DRAFT — adapted from Thea's voice memo, May 2026. Awaiting her review before treating as final.
    body: `Every person is made of all three doshas — Vata, Pitta, and Kapha. The question isn't which one you are. It's which combination is dominant, and how that combination shifts with life, season, and circumstance.\n\nVata is wind. Movement, change, the nervous system's hum. When balanced: creativity, adaptability, lightness. When high: anxiety, dryness, scattered energy, a body that runs cold and a mind that won't slow down.\n\nPitta literally means cooking — the power of digestion, of making things ripen and mature. Pitta gives you intelligence, vitality, and courage. Mentally, it's your capacity to digest ideas, process emotions, and arrive at a clear perception of truth. Since raw fire can't exist in the body without burning it up, Pitta lives in oily and acidic secretions: bile, stomach acid, the heat of the blood. It's responsible for all transformation in the body, from the GI tract down to the cellular level. When it's low, decisions get harder and motivation stalls. When it's high, you're looking at inflammation, sharp temper, and intensity that tips into aggression.\n\nKapha is the container. Emotionally it gives you love, devotion, and steadiness. When balanced: grounded, loyal, genuinely caring. Cohesion — the mucus, the plasma, the connective tissue that holds everything together. Where Pitta is fire and Vata is air, Kapha is water held in earth. It lives in the chest, throat, and head, and in the fatty tissue and lymphatics through the rest of the body. When high: congestion, sluggishness, weight that doesn't want to move, and feelings that get stuck.\n\nNo person is one type only. You'll always have some combination of all three — the dominant one or two shape your type. Sometimes all three are roughly equal: that's tridoshic, and it comes with its own texture. The dosha quiz is a starting point, not a verdict. Think of it as learning your home base, not your destiny.`,
    attributedDate: 'May 2026',
    matrix: null,
  },
  {
    id: 'prakriti-vikriti',
    tier: 1,
    title: 'Your Constitution',
    sanskrit: 'Prakriti & Vikriti',
    teaser: 'Your home-base blend, and how life shifts you away from it.',
    // DRAFT — adapted from Thea's voice memo, May 2026. Awaiting her review before treating as final.
    body: `Prakriti is the constitution you were born with — the specific ratio of Vata, Pitta, and Kapha that is native to you. It's not a rigid box. It's more like a home base. Some people have one clear dominant dosha. Others are dual-doshic, with two roughly equal. Some are tridoshic — relatively balanced across all three.\n\nVikriti is where you are right now — how life, stress, season, food, sleep, and circumstance have shifted things away from that home-base ratio.\n\nThe two are usually not the same. A Vata-Pitta by birth might be running high Kapha right now after a sedentary winter or a grief season or a job that demands stillness. That's not wrong — it's information. The daily check-in tracks vikriti. The quiz gives you a window into prakriti. The work is always about finding your way back home.`,
    attributedDate: 'May 2026',
    matrix: null,
  },
  {
    id: 'pancha-mahabhutas',
    tier: 1,
    title: 'The Five Elements',
    sanskrit: 'Pancha Mahabhutas',
    teaser: 'The building blocks of everything — including you.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'agni',
    tier: 1,
    title: 'Digestive Fire',
    sanskrit: 'Agni',
    teaser: 'The force that transforms what you take in — food, experience, emotion.',
    body: `Agni is your digestive fire — the force that transforms whatever you take in. Food, yes. But also experience. Also emotion. The question isn't just what you eat. It's how well you process it.\n\nThink of a literal fire. Too big, and it's destructive. Too small, and nothing actually gets cooked. Balanced — that's the sweet spot. That balance is what practice is always moving you toward.\n\nAgni lives physically in the gut as metabolic heat. It also lives in the mind as clarity — the capacity to actually move through something, understand it, and let it go. When mental agni is strong, you process your day. When it's dim, things pile up.\n\nThe two are connected. Anything you're carrying mentally — check the body. The body is keeping score.`,
    attributedDate: 'April 2026',
    matrix: null,
  },
  {
    id: 'ama',
    tier: 1,
    title: 'Toxic Accumulation',
    sanskrit: 'Ama',
    teaser: 'What builds up when digestion is incomplete.',
    body: `Ama is what accumulates when agni can't keep up. Undigested food. Undigested experience. Undigested emotion. Same mechanism, different substance.\n\nIts texture: heavy, cold, slimy, dense. It has a lot of kapha in it — that sticky, damp, impeding quality. And while it looks like kapha, ama mixes with all three doshas and changes how each one behaves. Vata, normally dry and light, becomes heavy and damp when ama is in the mix. Pitta, normally hot and sharp, becomes cooler and sluggish. Kapha, already slow, can become completely stuck.\n\nOne of the cleanest ways to check for ama: your tongue first thing in the morning, before eating or drinking anything. Scrape front to back — a spoon works fine if you don't have a tongue scraper. What comes off is ama. That coating is your body's morning report.\n\nAma is also a mental and emotional phenomenon. Negative emotions carry the same qualities — dark, damp, heavy, sticky. They dim mental agni, and when mental agni dims, physical agni follows. The check-in question "what are you carrying that hasn't been processed yet?" is the ama question. The body holds what the mind hasn't metabolized.\n\nTreatment always starts with clearing ama before going after the dosha directly. You can't clean the plate in the dishwasher if the food is still stuck to it — you have to rinse first. Once the body is clear, the deeper work becomes possible.`,
    attributedDate: 'April 2026',
    matrix: null,
  },

  // ─── Tier 2 — Deepening ─────────────────────────────────────────────────────
  {
    id: 'shad-rasa',
    tier: 2,
    title: 'The Six Tastes',
    sanskrit: 'Shad Rasa',
    teaser: 'The language underneath every food recommendation.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'gunas-qualitative',
    tier: 2,
    title: 'Qualities of Matter',
    sanskrit: 'Gunas (qualitative)',
    teaser: 'Hot/cold, heavy/light, dry/oily — the vocabulary of like increases like.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'gunas-mental',
    tier: 2,
    title: 'Qualities of Mind',
    sanskrit: 'Sattva · Rajas · Tamas',
    teaser: 'The three mental forces and how they shape clarity, drive, and inertia.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'ojas',
    tier: 2,
    title: 'Vital Essence',
    sanskrit: 'Ojas',
    teaser: 'The refined end product of good digestion — vitality, immunity, radiance.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'dinacharya-ritucharya',
    tier: 2,
    title: 'Daily & Seasonal Rhythms',
    sanskrit: 'Dinacharya & Ritucharya',
    teaser: 'Why the clock and the calendar both matter to your practice.',
    body: null,
    attributedDate: null,
    matrix: null,
  },

  // ─── Tier 3 — Advanced (Thea's call on whether these belong in a consumer app) ──
  {
    id: 'sapta-dhatus',
    tier: 3,
    title: 'The Seven Tissues',
    sanskrit: 'Sapta Dhatus',
    teaser: 'The seven layers of tissue that nutrition builds, in sequence.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'tri-malas',
    tier: 3,
    title: 'The Three Waste Products',
    sanskrit: 'Tri Malas',
    teaser: 'Sweat, urine, and stool as diagnostic signals, not just byproducts.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
  {
    id: 'srotas',
    tier: 3,
    title: 'The Channel Systems',
    sanskrit: 'Srotas',
    teaser: 'The pathways through which everything flows in the body.',
    body: null,
    attributedDate: null,
    matrix: null,
  },
];

export const tierLabels = {
  1: 'Essentials',
  2: 'Deepening',
  3: 'Advanced',
};
