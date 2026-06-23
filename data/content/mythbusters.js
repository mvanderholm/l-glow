// Source: Thea, June 2026 — "Agni Myth Busters: L. Glôw Edition"
// take and reframe adapted from Thea's text. Verbatim authorship is hers.
// weekStart dates run August 17 → November 2, 2026 (12-week drip starting launch week).
// Decision still needed from Thea: weekly drip (current), special edition screen, or both.
// See roadmap item 11a.

export const mythbusters = [
  {
    id: 'healthy-eat-more',
    series: 'agni',
    weekStart: '2026-08-17',
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
];

// Closing truth bomb for the Agni edition — display after week 12 or on a full-edition screen.
// Source: Thea, June 2026.
export const agniEditionClose = `Your body isn't broken.\n\nIt's communicating.\n\nThe question isn't: "What food should I eliminate next?"\n\nThe question is: "What is my body trying to tell me?"\n\nAnd that's where the magic starts.`;

// Returns the current week's entry only when it has content. Null otherwise.
export function currentMythbuster() {
  const today = new Date();
  return mythbusters.find(({ weekStart, take }) => {
    if (!take) return false;
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return today >= start && today <= end;
  }) ?? null;
}
