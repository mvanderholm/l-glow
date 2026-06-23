// Source: transcript 21 (062126_02), June 2026. Thea explicitly requested this feature.
// DRAFT — questions below are a structural scaffold. Thea must review and rewrite every
// question and answer before this quiz ships. Do NOT treat placeholder wording as final.
// Result copy is adapted from transcript 21 descriptions — still awaiting Thea's full review.

export const agniQuestions = [
  // DRAFT QUESTIONS — Thea to provide final wording for all. These capture the right
  // diagnostic domains she named (appetite, digestion, energy, elimination, emotional processing)
  // but the specific wording is a scaffold, not Thea's voice.
  {
    id: 'appetite',
    prompt: 'My appetite day to day is...',
    options: [
      { label: 'Regular and reliable — I get hungry at roughly the same times each day', agni: 'sama' },
      { label: 'Unpredictable — sometimes ravenous, sometimes no appetite at all',        agni: 'vishama' },
      { label: 'Strong and urgent — I get very hungry and irritable if I miss a meal',    agni: 'tikshna' },
      { label: 'Slow to arrive — I\'m often not hungry in the morning',                   agni: 'manda' },
    ],
  },
  {
    id: 'digestion',
    prompt: 'After a meal, I usually feel...',
    options: [
      { label: 'Satisfied and comfortable — digestion is smooth',          agni: 'sama' },
      { label: 'Variable — sometimes fine, sometimes bloated or gassy',    agni: 'vishama' },
      { label: 'Quick — food moves through me fast, sometimes too fast',   agni: 'tikshna' },
      { label: 'Heavy — it takes a long time to feel light again',         agni: 'manda' },
    ],
  },
  {
    id: 'energy',
    prompt: 'My energy through the day is...',
    options: [
      { label: 'Steady — consistent energy from morning through evening',         agni: 'sama' },
      { label: 'Variable — swings between too high and too low, hard to predict', agni: 'vishama' },
      { label: 'Intense — I push hard but sometimes burn out or overheat',        agni: 'tikshna' },
      { label: 'Low — I often feel sluggish, especially after meals',             agni: 'manda' },
    ],
  },
  {
    id: 'elimination',
    prompt: 'My digestion and elimination is...',
    options: [
      { label: 'Regular and comfortable — once or twice a day, consistent',       agni: 'sama' },
      { label: 'Irregular — sometimes constipated, sometimes loose',              agni: 'vishama' },
      { label: 'Loose or frequent — sometimes urgent',                            agni: 'tikshna' },
      { label: 'Slow or infrequent — constipation is common',                    agni: 'manda' },
    ],
  },
  {
    id: 'bloating',
    prompt: 'Gas and bloating...',
    options: [
      { label: 'Rarely bother me',                                                  agni: 'sama' },
      { label: 'Come and go — especially if I eat at irregular times or rush',      agni: 'vishama' },
      { label: 'Mostly acid reflux or heartburn is the issue, not bloating',        agni: 'tikshna' },
      { label: 'Are a regular thing — I feel heavy and full even hours after eating', agni: 'manda' },
    ],
  },
  {
    id: 'brain-fog',
    prompt: 'Mental clarity and focus for me tend to be...',
    options: [
      { label: 'Sharp and reliable most of the time',                               agni: 'sama' },
      { label: 'Scattered — hard to concentrate, mind wanders or anxious',          agni: 'vishama' },
      { label: 'Intense — I can focus sharply but can get overly critical or sharp', agni: 'tikshna' },
      { label: 'Foggy — especially in the morning or after meals',                  agni: 'manda' },
    ],
  },
  {
    id: 'stress-digestion',
    prompt: 'When I\'m stressed or anxious...',
    options: [
      { label: 'I can usually maintain my digestion and routine',                   agni: 'sama' },
      { label: 'My digestion becomes erratic — appetite vanishes or swings wildly', agni: 'vishama' },
      { label: 'I get heartburn, inflammation, or feel overheated',                 agni: 'tikshna' },
      { label: 'I slow down and want to eat comfort foods, then feel heavy',        agni: 'manda' },
    ],
  },
  {
    id: 'morning',
    prompt: 'In the morning, the first thing I notice is...',
    options: [
      { label: 'A clear tongue, genuine hunger, and a clear mind',                     agni: 'sama' },
      { label: 'Unpredictable — some mornings great, others rough',                    agni: 'vishama' },
      { label: 'Heat or acidity — maybe a coated tongue or acid in the stomach',       agni: 'tikshna' },
      { label: 'Heaviness, a thick coating on my tongue, and a slow start to the day', agni: 'manda' },
    ],
  },
];

export const agniResults = {
  sama: {
    type:    'sama',
    name:    'Sama Agni',
    subtitle: 'Balanced fire',
    color:   '#6B9B7B',
    summary: `Sama means balanced — and right now, your digestive fire is in its sweet spot.\n\nRegular hunger, comfortable digestion, steady energy, and consistent elimination. Things are flowing. Not perfect. Just aligned. This is the baseline state Ayurveda is always working toward — not a permanent destination, but a place you can recognize and return to.\n\nSama Agni is the body's natural intelligence running clearly. When it's here, you're processing food, emotions, and experience at a healthy rate. Ama isn't accumulating. The channels are clear.\n\nThe goal now is protection: the daily rhythms and practices that maintain this state as the seasons change and life asks more of you.`,
    gifts: [
      'Reliable hunger at consistent times',
      'Food digests comfortably — no heaviness or bloating',
      'Energy is steady through the day',
      'Elimination is regular and comfortable',
      'Immune system is resilient',
      'Mental clarity tends to be consistent',
    ],
    watchFor: [
      'Skipping meals or eating late disrupts even the most balanced Agni',
      'Stress and travel can shift Sama toward Vishama quickly',
      'Seasonal transitions — especially fall into winter — are common times for Agni to shift',
    ],
    reflection: 'What daily practice most supports me in maintaining this? What\'s the first thing to go when life speeds up?',
    pathForward: `Sama Agni is maintained through consistency, not effort. The practices that got you here are the ones that keep you here.\n\nEat at regular times. Eat warm, cooked foods as the anchor of your diet. Move daily. Sleep before 10pm. Give your digestion a chance to rest between meals. When you feel the slightest shift — appetite becoming erratic, energy dipping, mind getting foggy — treat it as early information. Don't wait for a full imbalance to respond.`,
    practices: {
      diet:      ['Eat at roughly the same times each day', 'Warm, cooked meals as the staple', 'Let hunger guide portion size', 'Main meal at midday when Agni is strongest'],
      lifestyle: ['Consistent sleep and wake times', 'Daily movement — even a short walk after meals', 'No screens or work during meals', 'Regular seasonal cleanse to maintain the baseline'],
      spiritual: ['Daily meditation or stillness practice', 'Gratitude at meals — attention changes the quality of digestion'],
    },
    // DRAFT — awaiting Thea's review and authorship
    lGlowNote: null,
  },

  vishama: {
    type:    'vishama',
    name:    'Vishama Agni',
    subtitle: 'Irregular fire',
    color:   '#7B8BAB',
    summary: `Vishama means irregular — and your digestive fire is being blown around right now.\n\nVishama Agni is associated with Vata: the element of wind and air. One day you're starving, the next you have no appetite. Gas, bloating, constipation, and energy that swings between too high and too low. Your fire isn't weak — it's unstable. The wind keeps changing direction.\n\nThis is one of the most common Agni patterns in modern life, because modern life is essentially a Vata-aggravating machine: irregular schedules, constant stimulation, travel, multitasking, and meals eaten on the go.\n\nThe work here is grounding. Regularity is medicine.`,
    gifts: [
      'Creativity and adaptability are often strong with this Agni type',
      'You\'re sensitive to subtle signals in your body — a gift when channeled toward listening',
    ],
    watchFor: [
      'Eating at irregular times — this is the main fuel for Vishama Agni',
      'Skipping meals, then eating too much',
      'Cold, raw, and dry foods that further aggravate Vata',
      'Rushing through meals or eating while distracted',
      'Stress and overstimulation — both drive this pattern higher',
    ],
    reflection: 'What would it feel like to eat at the same times every day for two weeks? What\'s stopping me from trying?',
    pathForward: `Regularity is the medicine. Not perfection — regularity.\n\nWith Vishama Agni, the single most powerful intervention is the simplest: eat at the same times every day. Your digestive fire needs to learn when to show up. If it's unpredictable when food is coming, it becomes unpredictable in return.\n\nWarm, cooked, slightly oily foods calm Vata and feed the fire without overwhelming it. Small, frequent meals can help if large meals feel destabilizing. Avoid cold drinks, raw salads, and dry snacks — these are Vata foods and will increase the irregularity.\n\nRoutine is the whole practice. It's not glamorous. It works.`,
    practices: {
      diet:      ['Eat at the same times every day — consistency over content', 'Warm, cooked, slightly oily foods (ghee, sesame oil, olive oil)', 'Small to moderate portions — don\'t skip then overeat', 'Warm water or ginger tea with meals', 'Avoid cold drinks, raw salads, dried fruits, and crackers'],
      lifestyle: ['Consistent wake and sleep times — same-time rhythm is the medicine', 'Daily oil self-massage (abhyanga) before shower — calms Vata quickly', 'Short walk after meals to stimulate digestion', 'Reduce screen time and multitasking — overstimulation feeds Vishama'],
      spiritual: ['Stillness practice — even 5 minutes of silence daily', 'Grounding breath work (slow exhale, longer than inhale)', 'Rest before it becomes exhaustion'],
    },
    // DRAFT — awaiting Thea's review and authorship
    lGlowNote: null,
  },

  tikshna: {
    type:    'tikshna',
    name:    'Tikshna Agni',
    subtitle: 'Intense fire',
    color:   '#B86B4B',
    summary: `Tikshna means sharp or intense — and your digestive fire is burning hot right now.\n\nTikshna Agni is associated with Pitta: the element of fire. Digestion is powerful — almost too powerful. Constant hunger, irritability when meals are delayed, acid reflux, loose stools, inflammation, and a tendency to run hot. The fire isn't low — it's consuming things faster than it should.\n\nThis pattern often comes with drive and intensity. The same Pitta that makes digestion sharp also makes the mind sharp. The challenge is that "sharp" can tip into "burning." Acid, inflammation, anger, perfectionism, and pushing too hard are all signs that Tikshna Agni is running the show.\n\nThe work here is cooling and softening. Not suppressing the fire — working with it.`,
    gifts: [
      'Strong digestion — you can handle a wide variety of foods',
      'High drive and follow-through',
      'Sharp mental clarity and fast decision-making',
    ],
    watchFor: [
      'Skipping meals — Tikshna Agni makes this genuinely dangerous (blood sugar, mood, inflammation)',
      'Spicy, fermented, and acidic foods that add more heat to an already hot system',
      'Alcohol, caffeine, and processed foods — all Pitta-aggravating',
      'Working through meals or eating while stressed',
      'Summer heat — seasonal Pitta aggravation is real',
    ],
    reflection: 'Where in my life am I burning through things faster than I\'m refueling? What am I not willing to slow down for?',
    pathForward: `The goal with Tikshna Agni isn\'t to put out the fire — it\'s to give it good fuel and not fan it unnecessarily.\n\nCooling foods and a regular eating schedule are the core interventions. You need to eat on time — Tikshna Agni when deprived of fuel turns on the body itself. Cooling, slightly bitter, and astringent foods calm the fire. Ghee is especially valuable — it\'s cooling in nature despite being a fat.\n\nAvoid: spicy foods (especially chili), alcohol, fermented foods, vinegar, and anything highly processed. Reduce: coffee if possible, or at least don\'t drink it on an empty stomach.\n\nBring in: sweet fruits, cucumber, coconut water, mint, fennel, coriander, fresh greens. Eat in a calm environment. Cool the mind as well as the body — this Agni pattern is as much about emotional heat as digestive heat.`,
    practices: {
      diet:      ['Eat on a regular schedule — do not skip meals', 'Cooling, mildly sweet, and astringent foods', 'Ghee daily — cooling and anti-inflammatory', 'Avoid: spicy, fried, fermented, alcohol, caffeine', 'Room temperature or cool (not ice cold) water'],
      lifestyle: ['Exercise in the cool of the morning, not in midday heat', 'Time outdoors in nature, especially near water', 'Reduce competitive and high-stakes environments where possible', 'Rest between intense focus periods — Tikshna burns out'],
      spiritual: ['Cooling pranayama: Sheetali or Sheetkari breath', 'Cultivate patience and forgiveness as deliberate practices', 'Meditation — particularly practices that soften rather than sharpen'],
    },
    // DRAFT — awaiting Thea's review and authorship
    lGlowNote: null,
  },

  manda: {
    type:    'manda',
    name:    'Manda Agni',
    subtitle: 'Slow fire',
    color:   '#7B9B6B',
    summary: `Manda means slow — and your digestive fire is burning low right now.\n\nManda Agni is associated with Kapha: the elements of earth and water. Digestion is sluggish. Heaviness after meals, fatigue, congestion, that feeling of stuckness. The fire is there — it\'s just covered by too much dampness.\n\nThis pattern tends to accumulate over time rather than arrive suddenly. It often shows up after long sedentary periods, after grief or depression, during heavy winter months, or as a result of consistently eating too much too late.\n\nThe work here is kindling. Stimulating. Warming. The fire needs coaxing, not smothering.`,
    gifts: [
      'Steady and grounded nature — Kapha\'s gifts are real',
      'Loyal, patient, and deeply caring',
      'When the fire gets going, there\'s capacity for deep, sustained nourishment',
    ],
    watchFor: [
      'Eating when not hungry — Manda Agni needs less food, not more',
      'Heavy, oily, and sweet foods that further dampen the fire',
      'Eating late in the evening',
      'Sedentary periods — movement is essential for kindling Manda Agni',
      'Cold and damp seasons — Kapha season (late winter/spring) is when this peaks',
    ],
    reflection: 'What is one thing I could do today that would generate a little more heat — in my body or my life?',
    pathForward: `Manda Agni improves with stimulation, warmth, and movement. This is the Agni pattern where eating less is often more effective than eating differently — the fire needs to catch up before it can handle more fuel.\n\nThe most powerful intervention is often the simplest: don\'t eat when you\'re not hungry. Let hunger arrive before you feed it. This gives Manda Agni a chance to build without being extinguished by more food.\n\nWarm, light, spiced foods are the medicine. Ginger tea especially — before and after meals. Spices like cumin, coriander, fennel, black pepper, and turmeric all kindle the fire. Avoid: dairy, cold foods, heavy sweets, and large portions.\n\nMovement is essential. A brisk walk after meals, daily exercise, and breaking up sedentary stretches all help kindle Manda Agni. You can also try waiting 4-5 hours between meals to let digestion actually complete.`,
    practices: {
      diet:      ['Eat only when hungry — let appetite guide you', 'Light, warm, well-spiced foods', 'Ginger tea before and after meals', 'Avoid: dairy, cold foods, heavy sweets, large portions at night', 'Largest meal at midday, lightest meal in the evening'],
      lifestyle: ['Brisk daily movement — walking, yoga, anything that generates internal heat', 'Dry brushing before shower to stimulate circulation', 'Wake before 6am — Kapha time (6-10am) makes this pattern heavier if you sleep into it', 'Avoid napping during the day'],
      spiritual: ['Energizing breathwork: Kapalabhati (breath of fire)', 'Set a small daily intention — Manda benefits from gentle structure', 'Notice what activities bring genuine enthusiasm — cultivate those'],
    },
    // DRAFT — awaiting Thea's review and authorship
    lGlowNote: null,
  },
};
