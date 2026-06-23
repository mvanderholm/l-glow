// ============================================================
// DRAFT — NOT FOR PRODUCTION
// ============================================================
// Based on Thea's voice memo (transcript 15, June 2026).
// Clinical descriptions are in Thea's voice — NOT reproduced
// from Frawley/Lad or any other source text.
// Must be reviewed and approved by Thea before replacing
// the live quiz in quiz.js.
// ============================================================
//
// Sequencing principle (from Thea): easy/obvious questions
// first, subjective questions last. Get people into the flow
// before asking them to look inward.
//
// Framing: prompt users to think back to their natural
// baseline — before braces, before products, before stress
// changed things.
//
// Multi-select questions (multiSelect: true) score each
// selected option individually. The quiz screen must support
// this before this draft can replace the live quiz.
//
// Every question needs a "none of these feels right" escape.
// Add that option in the quiz renderer — not in the data.
// ============================================================

export const quizQuestionsDraft = [

  // ---- PHYSICAL / OBVIOUS ---- (easy to answer, obvious to the person)

  {
    section: 'physical',
    prompt: 'Think back as far as you can — before the gym, before stress changed things. What\'s your natural body frame?',
    options: [
      { label: 'Thin and narrow — light bones, joints that show, hard to build muscle', dosha: 'vata' },
      { label: 'Medium and proportional — moderate build, decent muscle without much effort', dosha: 'pitta' },
      { label: 'Broad and solid — larger frame, well-developed, naturally strong', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Your natural relationship with weight — the default your body wants to return to:',
    options: [
      { label: 'I stay light without trying — sometimes I actually struggle to gain weight', dosha: 'vata' },
      { label: 'Pretty steady — I gain and lose at a moderate, predictable pace', dosha: 'pitta' },
      { label: 'Weight comes on easily and it\'s slow to leave', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Your skin at its most natural — no products, no seasons messing with it. Check everything that fits.',
    multiSelect: true,
    options: [
      { label: 'Dry, rough, or flaky — cracks easily, cool to the touch', dosha: 'vata' },
      { label: 'Warm and tends toward oily — flushes easily, some redness', dosha: 'pitta' },
      { label: 'Smooth, moist, and cool — oily, pale, thicker than average', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Your natural hair — before color, heat, and styling products. Check everything that fits.',
    multiSelect: true,
    options: [
      { label: 'Dry, coarse, or curly — tends toward frizz', dosha: 'vata' },
      { label: 'Fine, silky, or straight — tends to thin or gray early', dosha: 'pitta' },
      { label: 'Thick, wavy, and heavy — usually oily, lots of volume', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Think about your teeth before braces, orthodontics — what you were born with:',
    options: [
      { label: 'Crooked, crowded, or with gaps — sometimes stuck out a little', dosha: 'vata' },
      { label: 'Medium-sized and even — on the softer side, gums that bled easily', dosha: 'pitta' },
      { label: 'Strong, white, and well-formed — healthy gums, rarely had issues', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Your eyes:',
    options: [
      { label: 'Small and active — dark brown or black, sometimes dry or sunken', dosha: 'vata' },
      { label: 'Sharp and penetrating — green, gray, hazel, or copper; sensitive to bright light', dosha: 'pitta' },
      { label: 'Large and soft — blue or deep brown, long lashes, naturally moist', dosha: 'kapha' },
    ],
  },

  // ---- PHYSIOLOGICAL ---- (moderate subjectivity)

  {
    section: 'physiological',
    prompt: 'Your appetite, day to day:',
    options: [
      { label: 'All over the place — sometimes ravenous, sometimes I forget to eat entirely', dosha: 'vata' },
      { label: 'Strong and on schedule — I notice when a meal is late. I get irritable.', dosha: 'pitta' },
      { label: 'Slow to arrive — I can skip meals without much trouble and not feel it', dosha: 'kapha' },
    ],
  },

  {
    section: 'physiological',
    prompt: 'Your digestion and elimination, honestly:',
    options: [
      { label: 'Irregular — constipation, dryness, gas. Things don\'t move on any real schedule.', dosha: 'vata' },
      { label: 'Fast and loose — soft and frequent, sometimes a little too fast', dosha: 'pitta' },
      { label: 'Slow and heavy — things move on their own timetable, stools are thick and pale', dosha: 'kapha' },
    ],
  },

  {
    section: 'physiological',
    prompt: 'Your natural sleep:',
    options: [
      { label: 'Light and interrupted — I wake easily, vivid or anxious dreams, don\'t need a lot', dosha: 'vata' },
      { label: 'Moderate and sound — I sleep less than most but wake feeling clear', dosha: 'pitta' },
      { label: 'Deep and long — I could always sleep more. Hard to get up in the morning.', dosha: 'kapha' },
    ],
  },

  {
    section: 'physiological',
    prompt: 'Your hands and feet tend to be:',
    options: [
      { label: 'Cold — I\'m the one looking for a sweater when everyone else is fine', dosha: 'vata' },
      { label: 'Warm — I run hot and don\'t love direct sun or humid heat', dosha: 'pitta' },
      { label: 'Neutral — not particularly hot or cold, usually comfortable', dosha: 'kapha' },
    ],
  },

  // ---- SUBJECTIVE / PSYCHOLOGICAL ---- (save for last once user is in the flow)

  {
    section: 'psychological',
    prompt: 'Your energy style:',
    options: [
      { label: 'Quick bursts — I move fast and get a lot done, but I crash. Easily fatigued.', dosha: 'vata' },
      { label: 'Purposeful and driven — strong endurance when I\'m motivated', dosha: 'pitta' },
      { label: 'Slow to start, slow to stop — takes a while to get going but I can sustain for a long time', dosha: 'kapha' },
    ],
  },

  {
    section: 'psychological',
    prompt: 'How your mind naturally works:',
    options: [
      { label: 'Fast and restless — I jump between ideas, pick things up quickly, get distracted', dosha: 'vata' },
      { label: 'Sharp and focused — analytical, decisive, I like to understand things fully', dosha: 'pitta' },
      { label: 'Calm and deliberate — I take my time, but what I learn, I keep', dosha: 'kapha' },
    ],
  },

  {
    section: 'psychological',
    prompt: 'Your memory:',
    options: [
      { label: 'Quick to pick up, quick to forget — great in the moment, not so much long-term', dosha: 'vata' },
      { label: 'Sharp — I remember what I need to, especially what matters to me', dosha: 'pitta' },
      { label: 'Takes time to absorb, but once it\'s in, it stays for good', dosha: 'kapha' },
    ],
  },

  {
    section: 'psychological',
    prompt: 'When things get hard, what shows up first?',
    options: [
      { label: 'Anxiety and overwhelm — fear, indecision, scattered energy, can\'t sit still', dosha: 'vata' },
      { label: 'Anger and frustration — impatience, sharp words, the need to get control back', dosha: 'pitta' },
      { label: 'Withdrawal and heaviness — I get quiet, stubborn, don\'t want to move', dosha: 'kapha' },
    ],
  },

];

// doshaInfo is unchanged — imported from quiz.js in any screen that uses this draft.
// When Thea approves this question set, merge quizQuestionsDraft into quizQuestions
// in quiz.js and delete this file.
