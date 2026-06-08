export const quizQuestions = [
  {
    prompt: 'How would you describe your body frame?',
    options: [
      { label: 'Thin and light — I find it hard to gain weight', dosha: 'vata' },
      { label: 'Medium and muscular — I gain and lose weight fairly easily', dosha: 'pitta' },
      { label: 'Broad and solid — I gain weight easily and lose it slowly', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'What best describes your skin?',
    options: [
      { label: 'Dry, rough, or flaky — especially in cold or windy weather', dosha: 'vata' },
      { label: 'Warm, oily, prone to redness or breakouts', dosha: 'pitta' },
      { label: 'Smooth, thick, and cool to the touch', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'How is your digestion?',
    options: [
      { label: 'Irregular — sometimes strong, sometimes not, with gas or bloating', dosha: 'vata' },
      { label: 'Strong and sharp — I get irritable if meals are skipped', dosha: 'pitta' },
      { label: 'Slow and steady — I rarely feel hungry but can eat large amounts', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'How do you sleep?',
    options: [
      { label: 'Light and interrupted — I wake easily and sometimes feel unrested', dosha: 'vata' },
      { label: 'Sound but short — I wake feeling alert and ready', dosha: 'pitta' },
      { label: 'Deep and long — I love sleeping and often feel groggy in the morning', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'How would you describe your energy through the day?',
    options: [
      { label: 'Comes in bursts — I run fast then crash and need to rest', dosha: 'vata' },
      { label: 'Intense and focused — I push hard and can overheat or burn out', dosha: 'pitta' },
      { label: 'Steady and enduring — slow to start but I go all day', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'How do you handle stress?',
    options: [
      { label: 'I get anxious, scattered, and overwhelmed', dosha: 'vata' },
      { label: 'I get irritable, critical, or competitive', dosha: 'pitta' },
      { label: 'I withdraw, become stubborn, or shut down', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'How do you learn and remember?',
    options: [
      { label: 'I grasp things quickly but forget just as fast', dosha: 'vata' },
      { label: 'I learn well with focus and remember what I choose to learn', dosha: 'pitta' },
      { label: 'I take time to understand but once I know it I never forget', dosha: 'kapha' },
    ],
  },
  {
    prompt: 'What best describes your temperament?',
    options: [
      { label: 'Enthusiastic, creative, and changeable — I love variety', dosha: 'vata' },
      { label: 'Driven, precise, and decisive — I love a good goal', dosha: 'pitta' },
      { label: 'Calm, caring, and loyal — I love comfort and routine', dosha: 'kapha' },
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
  },
};
