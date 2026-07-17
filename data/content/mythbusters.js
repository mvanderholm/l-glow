// Source: Thea, June 2026 — "Agni Myth Busters: L. Glôw Edition" (series: 'agni')
//         Thea, June 2026 — general set (series: 'general'), sent directly in her voice.
// weekStart dates:
//   Agni edition:   August 17 → November 2, 2026 (12 weeks, launch week)
//   General set:    November 9, 2026 → January 4, 2027 (9 weeks)
//
// Extended schema (general set adds optional fields):
//   doshaBreakdown: { vata, pitta, kapha } — each with medicine and poison arrays
//   appPrompt:      string — check-in question or reflection to show with the card
//   challenge:      { title, instructions, track } — an action to try this week
//
// Weekly card renders myth + take + reframe only. Richer fields are ready for a
// full-edition view when that gets built (roadmap 11a options B/C).

export const mythbusters = [
  {
    id: 'healthy-eat-more',
    series: 'agni',
    weekStart: '2026-07-17', // pulled forward from 2026-08-17 (launch) so it's live now, July 2026 — Matt's call
    myth: 'If it\'s healthy, eat more of it.',
    take: 'Girl, no. I\'ve seen people destroy their digestion with kale, smoothies, and enough supplements to stock a GNC. Your body doesn\'t care what Instagram says. If you can\'t digest it, it\'s not helping you.',
    reframe: 'Healthy is contextual. If you can\'t digest it, that\'s information — not failure.',
  },
  {
    id: 'snacking-metabolism',
    series: 'agni',
    weekStart: '2026-08-24',
    myth: 'Snacking all day boosts metabolism.',
    take: 'Or you\'re just keeping your digestive system clocked in for a double shift. Your gut deserves lunch breaks too.',
    reframe: 'Your digestion needs rest between meals. Space is part of how it heals.',
  },
  {
    id: 'cold-smoothies',
    series: 'agni',
    weekStart: '2026-08-31',
    myth: 'Cold smoothies are the pinnacle of health.',
    take: 'For some people? Absolutely. For others? That\'s basically putting ice cubes on a campfire and wondering why dinner isn\'t cooking.',
    reframe: 'Nothing works for everyone. Cold can extinguish a low fire as easily as it can refresh an overheated one.',
  },
  {
    id: 'more-hunger-better',
    series: 'agni',
    weekStart: '2026-09-07',
    myth: 'More hunger = better metabolism.',
    take: 'Not always. Sometimes that\'s your body thriving. Sometimes that\'s your body screaming: "Ma\'am, where are the nutrients?"',
    reframe: 'Hunger is information. Learn the difference between Agni asking for fuel and Agni asking for help.',
  },
  {
    id: 'eating-less-fixes-all',
    series: 'agni',
    weekStart: '2026-09-14',
    myth: 'Eating less fixes everything.',
    take: 'Your body isn\'t a Tesla. You can\'t run it on 4% battery and expect peak performance.',
    reframe: 'You can\'t run on empty and call it a practice. Quality and rhythm matter more than subtraction.',
  },
  {
    id: 'bloating-normal',
    series: 'agni',
    weekStart: '2026-09-21',
    myth: 'Bloating is normal.',
    take: 'Common? Yep. Normal? Not necessarily. Your stomach isn\'t supposed to look six months pregnant after a salad.',
    reframe: 'Common and normal aren\'t the same thing. Bloating is a signal — and signals deserve curiosity, not acceptance.',
  },
  {
    id: 'more-fiber',
    series: 'agni',
    weekStart: '2026-09-28',
    myth: 'More fiber. More better.',
    take: 'If digestion is weak, throwing more fiber at it can be like adding more traffic to a highway that\'s already backed up.',
    reframe: 'Fiber supports strong Agni. When Agni is weak, you work with the fire first.',
  },
  {
    id: 'spicy-fixes-digestion',
    series: 'agni',
    weekStart: '2026-10-05',
    myth: 'Spicy food fixes digestion.',
    take: 'Until it doesn\'t. Medicine and poison often share the same address. The difference is dose.',
    reframe: 'Spice can kindle a low fire — or inflame one that\'s already burning too hot. Dose and context are everything.',
  },
  {
    id: 'calories-all-that-matters',
    series: 'agni',
    weekStart: '2026-10-12',
    myth: 'Calories are all that matter.',
    take: 'Ayurveda respectfully disagrees. You are not a math problem. You are a living, breathing ecosystem.',
    reframe: 'How you eat, when you eat, and what state you\'re in when you eat matters as much as what\'s on the plate.',
  },
  {
    id: 'digestion-starts-stomach',
    series: 'agni',
    weekStart: '2026-10-19',
    myth: 'Digestion starts when food hits your stomach.',
    take: 'Digestion starts when you smell the food. See the food. Think about the food. Or when you\'re answering emails while inhaling a protein bar in your car.',
    reframe: 'Presence at the meal is part of the practice. Distracted eating is partially undigested eating.',
  },
  {
    id: 'food-problem',
    series: 'agni',
    weekStart: '2026-10-26',
    myth: 'You have a food problem.',
    take: 'Maybe. But you might actually have a stress problem. A sleep problem. A speed problem. A "trying to do everything for everyone" problem.',
    reframe: 'Fix the conditions around the meal — stress, speed, sleep — and food often takes care of itself.',
  },
  {
    id: 'another-supplement',
    series: 'agni',
    weekStart: '2026-11-02',
    myth: 'The answer is another supplement.',
    take: 'The supplement aisle is not a personality trait. Sometimes the answer is: slow down, chew your food, go outside, stop eating standing over the sink.',
    reframe: 'Supplements can support a strong foundation. They can\'t replace one.',
  },

  // ---- GENERAL SET — November 9, 2026 → January 4, 2027 ----
  // Source: Thea, June 2026 — sent directly in her voice.

  {
    id: 'more-water-better',
    series: 'general',
    weekStart: '2026-11-09',
    myth: 'More water is always better.',
    take: 'Hydration matters. But Ayurveda asks a different question: can your body actually process the water you\'re drinking?\n\nIf digestion and metabolism are weak — especially in Kapha types — excess water can contribute to puffiness, water retention, sluggish digestion, reduced appetite, and weaker digestive fire.',
    reframe: 'Instead of "How much water did I drink?" — ask "How thirsty am I? How is my digestion? How is my energy?"',
    doshaBreakdown: {
      vata:  { medicine: ['Warm water', 'Herbal tea', 'Small frequent sips'], poison: ['Forgetting to drink all day', 'Ice water', 'Chugging huge amounts at once'] },
      pitta: { medicine: ['Room temp water', 'Coconut water', 'Cooling herbal infusions'], poison: ['Dehydration', 'Excess alcohol', 'Excess coffee'] },
      kapha: { medicine: ['Warm water', 'Ginger tea', 'Cinnamon tea', 'Hot lemon water'], poison: ['Gallons of cold water', 'Drinking when not thirsty', 'Constant sipping all day'] },
    },
    appPrompt: 'Do you feel thirsty, or are you drinking because you think you should?',
  },

  {
    id: 'water-before-meals',
    series: 'general',
    weekStart: '2026-11-16',
    myth: 'Drink a giant glass of water before meals to lose weight.',
    take: 'For some people this may help with appetite. But from an Ayurvedic perspective, you may also be diluting your digestive strength.\n\nThink of digestion as a campfire. A few drops? Fine. A bucket? Problem.',
    reframe: 'Hydrate between meals. Small sips during. Listen to thirst.',
    appPrompt: 'Agni doesn\'t need flooding. It needs support.',
  },

  {
    id: 'hungry-eat',
    series: 'general',
    weekStart: '2026-11-23',
    myth: 'If you\'re hungry, eat.',
    take: 'There\'s a difference between hunger — your body asking for fuel — and appetite — your mind asking for stimulation.\n\nReal hunger feels gradual, steady, patient, open to many foods. Appetite often feels urgent, specific, emotional, bored, or stress-driven.',
    reframe: 'Are you hungry? Or do you need rest, water, connection, movement, or just a break?',
    appPrompt: 'What sounds good right now? If the answer is "only chips," "only chocolate," "only wine" — that\'s often appetite talking. Not hunger.',
  },

  {
    id: 'eating-less-healthier',
    series: 'general',
    weekStart: '2026-11-30',
    myth: 'Eating less is always healthier.',
    take: 'Not if you\'re growing, recovering, pregnant, breastfeeding, training hard, healing, or under stress.\n\nA teenager needs different fuel than a sedentary adult. A marathon runner needs different fuel than an office worker. A postpartum mother needs different fuel than both.',
    reframe: 'The question isn\'t how little you can eat. It\'s what your body actually needs right now.',
  },

  {
    id: 'big-appetite-wrong',
    series: 'general',
    weekStart: '2026-12-07',
    myth: 'A big appetite means something is wrong.',
    take: 'Sometimes. But sometimes it means your digestive fire is strong. A healthy appetite generally signals digestion is working, metabolism is functioning, and the body is asking for fuel.',
    reframe: 'The goal isn\'t suppressing hunger. The goal is understanding it.',
  },

  {
    id: 'drink-while-eating',
    series: 'general',
    weekStart: '2026-12-14',
    myth: 'You should drink while eating.',
    take: 'You shouldn\'t avoid liquids — you also shouldn\'t wash your meal down.\n\nBefore a meal: a little water, maybe tea, maybe digestive bitters. During: small sips, warm or room temperature. After: allow digestion to begin before reaching for a big drink.',
    reframe: 'Sip. Don\'t flood.',
  },

  {
    id: 'weight-calories',
    series: 'general',
    weekStart: '2026-12-21',
    myth: 'Weight gain is always about calories.',
    take: 'Digestion matters. Metabolism matters. Absorption matters. Inflammation, hormones, stress, and sleep all matter.\n\nNot everyone processes food the same way — and a calorie count doesn\'t tell you any of that.',
    reframe: 'Instead of "How many calories did I eat?" — ask how your digestion was, whether you were satisfied, whether you had energy after.',
    appPrompt: 'How was your digestion today? Were you bloated, satisfied, energized?',
  },

  {
    id: 'cold-drinks-healthy',
    series: 'general',
    weekStart: '2026-12-28',
    myth: 'Cold drinks are healthy.',
    take: 'Cold isn\'t automatically bad. But for many people — especially Vata and Kapha types, those with weak Agni, during meals, or in cold seasons — cold drinks can weaken digestion.',
    reframe: 'Warm tea, warm lemon water, room temp water. Ice water with meals is the one worth reconsidering.',
    challenge: {
      title: 'The Ice Water Test',
      instructions: 'For one week, replace ice water with room temperature or warm water.',
      track: ['Bloating', 'Energy', 'Bowel movements', 'Hunger', 'Cravings'],
    },
  },

  {
    id: 'cravings-problem',
    series: 'general',
    weekStart: '2027-01-04',
    myth: 'Your cravings are the problem.',
    take: 'Your cravings are information. Not instructions. Not enemies.\n\nA craving might mean low blood sugar, poor sleep, emotional depletion, missing taste categories, hormonal changes, or weak digestion.',
    reframe: 'The goal is curiosity. Not guilt.',
  },

];

// Closing truth bomb for the Agni edition — display after week 12 or on a full-edition screen.
// Source: Thea, June 2026.
export const agniEditionClose = `Your body isn't broken.\n\nIt's communicating.\n\nThe question isn't: "What food should I eliminate next?"\n\nThe question is: "What is my body trying to tell me?"\n\nAnd that's where the magic starts.`;

// Returns the current week's entry only when it has content. Null otherwise.
// Takes the list explicitly (rather than always reading the static array
// above) so callers can pass the live/cached list from data/content/remote.js.
export function currentMythbuster(list = mythbusters) {
  const today = new Date();
  return list.find(({ weekStart, take }) => {
    if (!take) return false;
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return today >= start && today <= end;
  }) ?? null;
}
