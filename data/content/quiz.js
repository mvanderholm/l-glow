// Question set replaced July 2026 — redesigned per Thea's transcript 15 voice memo,
// approved by her and confirmed to fully replace (not coexist with) the prior 8-question
// set. Formerly `data/content/quiz-draft.js` (now deleted). Sequencing principle: easy,
// obvious questions first, subjective questions last (see Thea's framing below).
//
// Moved to Supabase (`dosha_questions` table) July 30 2026, admin-editable from
// the Practitioner Hub — same as mythbusters/guna/etc. This array is now the
// offline-first fallback (see data/content/remote.js's loadDoshaQuestions),
// not the live source. Keep it in sync manually if Thea edits questions in
// the admin screen and you want the bundled fallback to match.
export const quizQuestions = [

  // ---- PHYSICAL / OBVIOUS ---- (easy to answer, obvious to the person)

  {
    section: 'physical',
    prompt: 'Think back as far as you can — before the gym, before stress changed things. What\'s your natural body frame?',
    multiSelect: true,
    options: [
      { label: 'Thin and narrow — light bones, joints that show, hard to build muscle', dosha: 'vata' },
      { label: 'Medium and proportional — moderate build, decent muscle without much effort', dosha: 'pitta' },
      { label: 'Broad and solid — larger frame, well-developed, naturally strong', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Your natural relationship with weight — the default your body wants to return to:',
    multiSelect: true,
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
    multiSelect: true,
    options: [
      { label: 'Crooked, crowded, or with gaps — sometimes stuck out a little', dosha: 'vata' },
      { label: 'Medium-sized and even — on the softer side, gums that bled easily', dosha: 'pitta' },
      { label: 'Strong, white, and well-formed — healthy gums, rarely had issues', dosha: 'kapha' },
    ],
  },

  {
    section: 'physical',
    prompt: 'Your eyes:',
    multiSelect: true,
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
    multiSelect: true,
    options: [
      { label: 'All over the place — sometimes ravenous, sometimes I forget to eat entirely', dosha: 'vata' },
      { label: 'Strong and on schedule — I notice when a meal is late. I get irritable.', dosha: 'pitta' },
      { label: 'Slow to arrive — I can skip meals without much trouble and not feel it', dosha: 'kapha' },
    ],
  },

  {
    section: 'physiological',
    prompt: 'Your digestion and elimination, honestly:',
    multiSelect: true,
    options: [
      { label: 'Irregular — constipation, dryness, gas. Things don\'t move on any real schedule.', dosha: 'vata' },
      { label: 'Fast and loose — soft and frequent, sometimes a little too fast', dosha: 'pitta' },
      { label: 'Slow and heavy — things move on their own timetable, stools are thick and pale', dosha: 'kapha' },
    ],
  },

  {
    section: 'physiological',
    prompt: 'Your natural sleep:',
    multiSelect: true,
    options: [
      { label: 'Light and interrupted — I wake easily, vivid or anxious dreams, don\'t need a lot', dosha: 'vata' },
      { label: 'Moderate and sound — I sleep less than most but wake feeling clear', dosha: 'pitta' },
      { label: 'Deep and long — I could always sleep more. Hard to get up in the morning.', dosha: 'kapha' },
    ],
  },

  {
    section: 'physiological',
    prompt: 'Your hands and feet tend to be:',
    multiSelect: true,
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
    multiSelect: true,
    options: [
      { label: 'Quick bursts — I move fast and get a lot done, but I crash. Easily fatigued.', dosha: 'vata' },
      { label: 'Purposeful and driven — strong endurance when I\'m motivated', dosha: 'pitta' },
      { label: 'Slow to start, slow to stop — takes a while to get going but I can sustain for a long time', dosha: 'kapha' },
    ],
  },

  {
    section: 'psychological',
    prompt: 'How your mind naturally works:',
    multiSelect: true,
    options: [
      { label: 'Fast and restless — I jump between ideas, pick things up quickly, get distracted', dosha: 'vata' },
      { label: 'Sharp and focused — analytical, decisive, I like to understand things fully', dosha: 'pitta' },
      { label: 'Calm and deliberate — I take my time, but what I learn, I keep', dosha: 'kapha' },
    ],
  },

  {
    section: 'psychological',
    prompt: 'Your memory:',
    multiSelect: true,
    options: [
      { label: 'Quick to pick up, quick to forget — great in the moment, not so much long-term', dosha: 'vata' },
      { label: 'Sharp — I remember what I need to, especially what matters to me', dosha: 'pitta' },
      { label: 'Takes time to absorb, but once it\'s in, it stays for good', dosha: 'kapha' },
    ],
  },

  {
    section: 'psychological',
    prompt: 'When things get hard, what shows up first?',
    multiSelect: true,
    options: [
      { label: 'Anxiety and overwhelm — fear, indecision, scattered energy, can\'t sit still', dosha: 'vata' },
      { label: 'Anger and frustration — impatience, sharp words, the need to get control back', dosha: 'pitta' },
      { label: 'Withdrawal and heaviness — I get quiet, stubborn, don\'t want to move', dosha: 'kapha' },
    ],
  },

];

export const doshaInfo = {
  vata: {
    name: 'Vata',
    elements: 'Air & Ether',
    qualities: 'Light · Dry · Mobile · Cold',
    color: '#8B7BA8',
    summary:
      'Vata is the force of movement — governing breath, circulation, nerve impulses, and the flow of thought. Vata types are naturally creative, quick-minded, and enthusiastic, but can drift toward anxiety, dryness, and scattered energy when out of balance. Grounding, warmth, and regular routine are your medicine.',
    constitution:
      'Your constitution is naturally light, dry, and mobile. Think of yourself like a little bunny: quick, creative, and always in motion. Your best balance comes from warmth, grounding, gentle steadiness, and rest.',
    movementFocus:
      'Slow, steady, warming movement is your best medicine. Favor long holds, forward folds, twists, restorative practice, and breathing down into the lower belly.',
    elementGrounding: [
      { element: 'Air', body: 'Your breath. Every inhale and exhale is vata moving through the body — circulation, nerve impulses, the flow of thought. When vata is high, the breath gets shallow and quick.' },
      { element: 'Ether', body: 'Space. The hollow inside your nostril. The cavities and channels throughout the body that allow everything else to move. Without space, nothing flows.' },
    ],
    // DRAFT — from Thea's voice memos. Awaiting her review before treating as final.
    traits: {
      physical: {
        build:        'Tall or short — rarely in the middle. Thin and bony frame, good muscles but hard to keep.',
        weight:       'Lower end of the scale. Hard to gain, loses it quickly.',
        skin:         'Dull and dusky. Dry, rough, and thin to the touch.',
        eyes:         'Small and nervous — always moving.',
        hair:         'Dry and thin.',
        teeth:        'Irregular and crooked.',
        nails:        'Brittle and rough.',
        joints:       'Tend to crack and pop.',
        circulation:  'Variable, often poor.',
        appetite:     'Nervous and irregular — sometimes ravenous, sometimes nothing.',
        thirst:       'Low.',
        sweat:        'Scanty.',
        elimination:  'Hard, dry, or irregular.',
        sensitivities:'Dryness, wind, and cold.',
        immunity:     'Low and variable.',
        diseasePattern: 'Pain, nervous system issues, dryness, anxiety.',
      },
      mental: {
        activity:      'High and restless.',
        endurance:     'Poor — bursts of energy, then crashes.',
        sleep:         'Light, interrupted, and often poor.',
        dreams:        'Frequent and colorful.',
        memory:        'Quick to grasp, quick to forget.',
        speech:        'Fast and frequent.',
        temperament:   'Enthusiastic, creative, changeable.',
        positiveEmotion: 'Adaptability',
        negativeEmotion: 'Fear and anxiety',
        faith:         'Erratic and variable.',
      },
    },
    // Source: transcript 19 (061926_03). DRAFT — awaiting Thea's review.
    archetype: {
      name: 'The Wanderer',
      balanced: [
        'Creative, visionary, and inspired',
        'Intuitive, curious, and deeply spiritual',
        'Innovative and free — sees possibilities before anyone else',
        'Dreams up businesses, writes books, starts movements',
      ],
      imbalanced: [
        'Anxiety, overthinking, and doom scrolling',
        'Starting everything, finishing nothing',
        'Feeling disconnected and living in tomorrow',
        'Never fully present',
      ],
      trap: 'If I think about it more, I\'ll finally feel safe. But safety never comes from more information.',
      truth: 'Vata isn\'t looking for more information. Vata is looking for grounding.',
      reminder: 'You don\'t need another plan. What you need is a safe place to land.',
    },
  },
  pitta: {
    name: 'Pitta',
    elements: 'Fire & Water',
    qualities: 'Hot · Sharp · Light · Oily',
    color: '#E8A030',
    summary:
      'Pitta is the force of transformation — governing digestion, metabolism, intelligence, and drive. Pitta types are naturally focused, ambitious, and articulate, but can move toward irritability, inflammation, and perfectionism when excess heat builds. Cooling down, softening effort, and embracing imperfection are your medicine.',
    constitution:
      'Your constitution is naturally warm, sharp, and intense. You are driven and transformation-focused, and your best balance comes from cooling ease, relaxed repetition, and gentle flexibility rather than perfection.',
    movementFocus:
      'Cool, calm, steady movement works best for you. Favor flexibility, restorative pacing, forward folds, twists, and practices that feel fun rather than competitive.',
    elementGrounding: [
      { element: 'Fire', body: 'The heat of digestion in your stomach. The redness you can see in blood vessels. Metabolism at every level — cellular, digestive, mental. Pitta transforms whatever it touches.' },
      { element: 'Water', body: 'The medium that carries the fire safely. Your blood, your bile, the oily secretions that keep pitta from burning through what it\'s supposed to be digesting.' },
    ],
    // DRAFT — from Thea's voice memos. Awaiting her review before treating as final.
    traits: {
      physical: {
        build:        'Medium height, moderate frame — well developed, neither too thin nor too large.',
        weight:       'Moderate. Gains and loses weight relatively easily.',
        skin:         'Radiant and lustrous. Warm and oily.',
        eyes:         'Piercing and intense — prone to inflammation and redness.',
        hair:         'Thin and oily.',
        teeth:        'Moderate sized, but gums bleed easily.',
        nails:        'Soft and pink.',
        joints:       'Loose, moderate.',
        circulation:  'Strong and consistent.',
        appetite:     'High and sharp — gets irritable when meals are skipped.',
        thirst:       'High.',
        sweat:        'Profuse.',
        elimination:  'Loose and soft.',
        sensitivities:'Heat, sunlight, and fire.',
        immunity:     'Moderate.',
        diseasePattern: 'Inflammation, infection, fever, acidity.',
      },
      mental: {
        activity:      'Moderate but intensely focused.',
        endurance:     'Moderate — focused and goal-oriented.',
        sleep:         'Sound but short — wakes alert.',
        dreams:        'Moderate, often romantic or heroic.',
        memory:        'Sharp and clear.',
        speech:        'Sharp and cutting.',
        temperament:   'Driven, precise, and decisive.',
        positiveEmotion: 'Courage and confidence',
        negativeEmotion: 'Anger and irritability',
        faith:         'Strong and determined.',
      },
    },
    archetype: {
      name: 'The Warrior',
      balanced: [
        'Driven, focused, and confident',
        'Courageous, disciplined, and powerful',
        'Strategic — transforms things and gets them done',
        'The builder, the leader, the one everyone relies on',
      ],
      imbalanced: [
        'Irritable, frustrated, and controlling',
        'Perfectionism and resentment',
        'Judgment and burnout',
        'Satisfaction that never arrives',
      ],
      trap: 'If I work harder, fix more, achieve more, then I\'ll finally be enough. But the finish line keeps moving.',
      truth: 'Pitta isn\'t looking for success. Pitta is looking for peace.',
      reminder: 'You were never meant to carry the whole world. Put something down.',
    },
  },
  kapha: {
    name: 'Kapha',
    elements: 'Water & Earth',
    qualities: 'Heavy · Slow · Cool · Oily',
    color: '#4A8FA8',
    summary:
      'Kapha is the force of cohesion — governing structure, lubrication, immunity, and emotional steadiness. Kapha types are naturally patient, loving, and resilient, but can accumulate lethargy, attachment, and congestion when stagnant. Stimulation, warmth, movement, and lightness are your medicine.',
    constitution:
      'Your constitution is naturally cool, heavy, and steady. You are strong, resilient, and grounded; your best balance comes from warming, lighter movement, quickening energy, and a little extra lift.',
    movementFocus:
      'Energizing, mildly warming movement is your best medicine. Favor backbends, twists, sun salutations, and quick, dynamic sequences that wake the body up.',
    elementGrounding: [
      { element: 'Water', body: 'Blood and lymph — the fluid that carries nourishment to every tissue. Also the plasma, the mucus lining, the substance that holds everything together and keeps it hydrated.' },
      { element: 'Earth', body: 'Bone. Muscle. The physical structure of the body itself. Kapha gives you your solidity, your endurance, and your capacity to hold what matters.' },
    ],
    // DRAFT — from Thea's voice memos. Awaiting her review before treating as final.
    traits: {
      physical: {
        build:        'Usually shorter, but sometimes tall and broadly built. Large, well-formed frame.',
        weight:       'Tends toward heavy. Hard to lose.',
        skin:         'Pale or whitish. Cold, damp, and thick.',
        eyes:         'Large and calm, with a clear whiteness.',
        hair:         'Luxurious, wavy, thick, and oily.',
        teeth:        'Well-formed and large.',
        nails:        'Soft and white.',
        joints:       'Large and firm.',
        circulation:  'Moderate.',
        appetite:     'Moderate but constant — rarely skips a meal.',
        thirst:       'Moderate.',
        sweat:        'Low to start, then profuse.',
        elimination:  'Regular and normal.',
        sensitivities:'Cold and damp.',
        immunity:     'Very high.',
        diseasePattern: 'Congestion, mucus, weight, edema.',
      },
      mental: {
        activity:      'Slow and steady — low overall activity.',
        endurance:     'High — can go all day once warmed up.',
        sleep:         'Deep and long — tends toward too much.',
        dreams:        'Infrequent.',
        memory:        'Slow to learn but never forgets.',
        speech:        'Slow and melodious.',
        temperament:   'Calm, caring, and loyal.',
        positiveEmotion: 'Love, devotion, and steadiness',
        negativeEmotion: 'Attachment and possessiveness',
        faith:         'Steady and slow to change.',
      },
    },
    archetype: {
      name: 'The Keeper',
      balanced: [
        'Loyal, grounded, and deeply patient',
        'Nurturing, compassionate, and steady',
        'Creates home wherever they go',
        'The one everyone calls when life falls apart',
      ],
      imbalanced: [
        'Exhaustion from giving too much',
        'Holding on long past the time to let go',
        'Putting everyone else first, feeling invisible',
        'Lack of motivation and fear of change',
      ],
      trap: 'If I keep giving, eventually someone will give back. But they often don\'t.',
      truth: 'Kapha isn\'t looking for love. Kapha already is love.',
      reminder: 'You don\'t have to earn your worth by carrying everyone else.',
    },
  },
};
