// Source: transcript 27 (062426_01), June 2026.
// DRAFT — adapted from Thea's voice memo. Awaiting her review before treating as final.

export const tongueSteps = [
  {
    id: 'shape',
    prompt: 'What shape is your tongue?',
    instruction: 'Hold it out gently — don\'t force it. Let it relax.',
    options: [
      { label: 'Narrow or thin',          sub: 'Lighter, more airy',        signal: 'vata'   },
      { label: 'Pointed or flame-like',   sub: 'Sharp, defined edges',       signal: 'pitta'  },
      { label: 'Round, wide, or full',    sub: 'Rounder, fleshier',          signal: 'kapha'  },
      { label: 'Hard to tell',            sub: null,                         signal: null     },
    ],
  },
  {
    id: 'size',
    prompt: 'How would you describe its size?',
    instruction: 'Relative to your mouth.',
    options: [
      { label: 'Small or slender',   sub: 'Less tissue, more lightness',   signal: 'vata'  },
      { label: 'Medium, average',    sub: 'Balanced, proportionate',        signal: 'pitta' },
      { label: 'Thick or large',     sub: 'More tissue, more presence',     signal: 'kapha' },
      { label: 'Hard to tell',       sub: null,                             signal: null    },
    ],
  },
  {
    id: 'color',
    prompt: 'What color is it?',
    instruction: 'Natural light is best. Food, turmeric, wine, and supplements can stain — look past that if you can.',
    options: [
      { label: 'Grayish or brownish',             sub: 'Duller, darker',     signal: 'vata'  },
      { label: 'Bright pink or noticeably red',   sub: 'Vivid, intense',     signal: 'pitta' },
      { label: 'Pale pink or very light',         sub: 'Washed out, muted',  signal: 'kapha' },
      { label: 'Hard to tell',                    sub: null,                 signal: null    },
    ],
  },
  {
    id: 'coating',
    prompt: 'Is there a coating on it?',
    instruction: 'This is your ama indicator — the morning report from your digestion.',
    options: [
      { label: 'None — looks clean',              sub: 'Nirama. The goal.',          signal: 'none',  ama: 0 },
      { label: 'Light grayish or brownish film',  sub: 'Sama-Vata pattern',          signal: 'vata',  ama: 1 },
      { label: 'Yellow or greenish coating',      sub: 'Sama-Pitta pattern',         signal: 'pitta', ama: 2 },
      { label: 'White coating',                   sub: 'Sama-Kapha pattern',         signal: 'kapha', ama: 2 },
    ],
  },
];

export const tongueSignList = [
  { id: 'cracks',  label: 'Cracks or fissures',           meaning: 'Dryness, depletion, or nervous system wear. Deep red cracks add a heat component.' },
  { id: 'scallop', label: 'Scalloped edges',               meaning: 'Often points toward weaker digestion or absorption — may come with bloating or irregular meals.' },
  { id: 'tremor',  label: 'Trembling or unsteady',         meaning: 'A Vata nervous system signal — stress, depletion, too much movement without enough grounding.' },
  { id: 'redtip',  label: 'Red tip or red edges',          meaning: 'Heat pattern. May reflect emotional intensity, liver load, or inflammation.' },
  { id: 'frothy',  label: 'Bubbles or frothiness',         meaning: 'Often a Vata/Kapha pattern. May point toward processed food, digestive confusion, or a brain-belly disconnect.' },
  { id: 'bumps',   label: 'Unusual bumps or raised areas', meaning: 'Note the location and track it over time. Consult a practitioner if anything is painful, growing, bleeding, or persistent.' },
];

// Colors match theme tokens (c.vata, c.accent, c.kapha, c.saffron, c.sage)
export const tongueReadings = {
  vata: {
    name: 'Vata',
    color: '#8B6A7A',
    summary: 'Your tongue is showing its air-and-ether quality today — lighter, drier, more depleted than nourished. This pattern is often associated with nervous system load, dryness in the body, or irregular digestion.',
    clues: [
      'Warmth and oil are what the body is asking for',
      'Irregular appetite or digestion may be part of this pattern',
      'Regular meal timing supports Vata more than almost anything else',
    ],
  },
  pitta: {
    name: 'Pitta',
    color: '#9A5151',
    summary: 'Your tongue is showing heat. This pattern is often associated with intensity, metabolic fire, or something your body is actively processing — food, emotion, or information.',
    clues: [
      'Cool, bitter, and lighter foods tend to support this pattern',
      'The body may benefit from slowing the pace a bit',
      'Notice where intensity is running hot emotionally — it often shows up here first',
    ],
  },
  kapha: {
    name: 'Kapha',
    color: '#566357',
    summary: 'Your tongue is showing heaviness and dampness. This pattern is often associated with sluggishness, congestion, or a body that would benefit from more movement and less density.',
    clues: [
      'Light, dry, and warm foods support this pattern',
      'Movement matters today — even a short walk shifts things',
      'Notice if the heaviness is showing up mentally too',
    ],
  },
  mixed: {
    name: 'Mixed signals',
    color: '#DBA441',
    summary: 'Your tongue is showing signals from more than one dosha today. That\'s common — the body rarely sends a single clean message.',
    clues: [
      'Focus on the most prominent sign you noticed',
      'When unsure, warm, cooked, and simple tends to help',
      'The other clues you noticed can help narrow this down',
    ],
  },
  balanced: {
    name: 'Clear',
    color: '#7AB878',
    summary: 'No strong signal in any direction today. Your tongue is telling you it\'s reasonably in balance — digestion ran clean overnight. That\'s worth noticing.',
    clues: [
      'Eat what feels right for your constitution today',
      'Maintain whatever rhythm got you here',
      'This is what balance feels like — file it away',
    ],
  },
};

export const amaReadings = [
  { level: 0, label: 'Nirama — clear',    desc: 'No coating. Your body processed last night cleanly. This is the goal.' },
  { level: 1, label: 'Light coating',     desc: 'A little something there — normal if yesterday was heavier. Eat lightly today and it\'ll likely clear by morning.' },
  { level: 2, label: 'Moderate coating',  desc: 'Digestion is telling you something backed up. Warm, simple, and lighter today helps.' },
  { level: 3, label: 'Heavy coating',     desc: 'Clear sign of ama accumulation. A lighter day — warm water, simple food, fewer demands — would be well spent.' },
];

export const tongueMap = [
  { zone: 'Tip',         meaning: 'Head, neck, heart — and emotional heat' },
  { zone: 'Middle',      meaning: 'Stomach, liver, gallbladder' },
  { zone: 'Back',        meaning: 'Small and large intestine, elimination' },
  { zone: 'Sides',       meaning: 'Liver and gallbladder tendencies' },
  { zone: 'Center line', meaning: 'Spine, nervous system, deeper depletion' },
];
