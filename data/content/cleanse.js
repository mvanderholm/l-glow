// L. Glôw's 15-Day Ayurvedic Cleanse — Thea-authored, approved (confirmed
// by Matt, Sept 21 2026). Scaffolded verbatim from
// "LGlow 15-Day Ayurvedic Cleanse Guide.pdf" — do not paraphrase or
// invent additional content here. This is the ONLY cleanse length
// currently authored; see docs/cleanse-lengths-questions-for-thea.md
// before ever adding a second duration/protocol.
//
// The 19 RECIPES entries are deliberately just prompts, not recipes —
// that's Thea's own design (see her "Recipe guide" page): each prompt is
// meant to be handed to an AI assistant to produce the actual recipe with
// quantities and steps. The generate-cleanse-recipes Edge Function does
// exactly that, server-side, using these prompts unmodified except for
// the ghee/oil substitution the guide itself already invites ("Replace
// ghee with olive oil if you prefer").

export const CLEANSE_META = {
  title: '15-Day Ayurvedic Cleanse',
  subtitle: 'Participant Guide',
  tagline: 'Elimination · Kitchari Cleanse · Reintroduction',
  basedOn: "Based on L. Glôw's Ayurvedic Detox approach",
  intro: "Welcome! Over the next 15 days you'll gently simplify your eating, rest your digestion with a five-day kitchari cleanse, and bring foods back one at a time to notice how each one makes you feel. This guide covers what to eat each day, a simple daily rhythm, fresh-cooking tips, a shopping list, and a recipe prompt for every dish. It is designed to be gentle, because no one should suffer.",
  closing: 'Wishing you a nourishing 15 days.',
};

// ── Safety gate — a real gate, not decorative copy. Every question here
// must be answered before a plan can be generated. See app/cleanse.js's
// SafetyGate step for how each answer is handled (hard block vs. an
// explicit "I've talked to my doctor" acknowledgment).
export const SAFETY_INTRO = "This is a gentle dietary reset, not medical treatment or a test for food intolerances. It does not include extended fasting, laxatives, or enemas.";

export const SAFETY_QUESTIONS = [
  { id: 'under18', label: 'Are you under 18?', blockLevel: 'hard' },
  { id: 'pregnantOrBreastfeeding', label: 'Are you currently pregnant or breastfeeding?', blockLevel: 'hard' },
  { id: 'diabetesOrBloodSugar', label: 'Do you have diabetes or other blood sugar concerns?', blockLevel: 'acknowledge' },
  { id: 'chronicCondition', label: 'Do you have another chronic health condition?', blockLevel: 'acknowledge' },
  { id: 'takesMedication', label: 'Do you take any medication? (especially relevant if you plan to change your caffeine or alcohol intake)', blockLevel: 'acknowledge' },
  { id: 'edHistory', label: 'Do you have a history of an eating disorder?', blockLevel: 'acknowledge' },
];

export const SAFETY_STOP_COPY = "If you feel weak, dizzy, unwell, or persistently hungry, stop the cleanse, return to a varied diet, and check in with a healthcare provider.";

export const EAT_ENOUGH_COPY = "Eat enough. There is no calorie counting here, so fill your bowl generously and have more at your meal if you're still hungry.";

// ── Phases at a glance
export const PHASES = [
  { id: 'elimination', label: '1. Elimination', days: 'Days 1-5', description: "Remove one food category per day, building on the day before. By Day 5 you're eating simple, cooked, plant-based meals." },
  { id: 'kitchari', label: '2. Kitchari cleanse', days: 'Days 6-10', description: 'Eat kitchari for every meal, along with water, CCF tea, or lemon water between meals. The recipes are pitta-reducing and balancing for fall (vata season).' },
  { id: 'reintroduction', label: '3. Reintroduction', days: 'Days 11-15', description: 'Add one category back per day, in reverse order, and notice how you feel.' },
];

export const ONE_RULE = {
  title: 'One rule for all 15 days: cooked fruits and vegetables only',
  body: 'Every fruit and vegetable you eat is cooked: no raw salads, raw fruit, smoothies, or raw juices. Steam, sauté, roast, bake, stew, or simmer.\n\nIn Ayurveda, warm cooked food is considered gentler on digestion. Fresh herbs count too, so stir them into hot food so they wilt. Lemon or lime juice is fine as seasoning.',
};

export const GENTLE_BY_DESIGN = {
  title: 'Gentle by design',
  body: "Some people thrive on one detox path while others suffer, and no one should suffer here. If any part of this plan feels like too much, ease up and go at the pace your body asks for.",
  twoRules: [
    'Eat just 2-3 times a day, with no snacking. Always have lunch.',
    'Between meals, only water (hot or room temperature), CCF tea, or lemon water should touch your belly.',
  ],
};

// ── Daily rhythm
export const DAILY_RHYTHM = [
  { when: 'On waking', what: 'Wake with the sun. Drink hot lemon water (hot water with a squeeze of fresh lemon) first thing.' },
  { when: 'Breakfast', what: 'After your hot lemon water.' },
  { when: 'Lunch', what: 'Always have lunch, between 11 am and 1 pm. It is your biggest meal of the day.' },
  { when: 'Dinner', what: 'Lighter than lunch. Finish eating before 6:30 pm, so you have 3-4 hours to digest before bed.' },
  { when: 'After each meal', what: 'Lie on your left side for 5-20 minutes to help digestion, then take a gentle 5-20 minute walk.' },
  { when: 'Bedtime', what: 'Aim to be asleep by 10 pm, if possible.' },
];

export const GROUND_RULES = [
  { title: 'Always have lunch', body: 'eat 2-3 times a day, and lunch is always one of them. Add breakfast, dinner, or both.' },
  { title: 'Lunch is your biggest meal', body: 'every day. Keep dinner lighter, and have any meat at lunch rather than dinner so it has time to digest.' },
  { title: 'Space your meals and skip the snacks', body: 'ideally at least 4 hours between meals. If you absolutely need something, have kitchari.' },
  { title: 'Drinking', body: 'between meals, only water (hot or room temperature), CCF tea, or lemon water. Try not to drink anything for 1 hour after eating.' },
];
export const GROUND_RULES_NOTE = 'Get as close as you can. These are guidelines, not a test.';

// ── How we eat
export const HOW_WE_EAT = [
  { title: "Don't eat distracted", body: 'Put away your phone and screens and give your meal your full attention.' },
  { title: 'Listen for the burp', body: "If you're eating mindfully, you'll likely burp during your meal. It may not be a big one, just a little release of air. That's a sign your tummy is perfectly satisfied with the amount of food." },
  { title: 'Rest, then walk', body: 'After you eat, lie on your left side for 5-20 minutes to allow digestion, followed by a gentle 5-20 minute walk.' },
];

export const BETWEEN_MEALS = "Between meals, keep drinks simple: water (hot or room temperature), CCF tea, or lemon water, and nothing else. Start each morning with hot lemon water, and try not to drink anything for an hour after eating. Skip juices and smoothies, since everything stays cooked and warm. CCF tea is a classic Ayurvedic favorite made from cumin, coriander, and fennel, and the recipe guide shows you how to make it. Coffee and caffeinated tea return on Day 14.";

// ── What changes each day (elimination cumulative, reintroduction reversed)
export const DAILY_CHANGES = [
  { day: 'All', change: 'Cooked fruits and vegetables only', details: 'No raw fruit, raw salads, smoothies, or raw juices, at any point in the 15 days, including reintroduction. Steam, sauté, roast, bake, stew, or simmer. Fresh herbs are stirred into hot food so they wilt.' },
  { day: 'All', change: 'Cooked fresh each day', details: "Cook lunch and dinner on the day you eat them. Choose fresh produce over frozen or canned wherever you can. It doesn't have to be 100%." },
  { day: 'All', change: 'Lunch is your biggest meal', details: 'Always have lunch. If a meal includes meat, have it at lunch so it has time to digest.' },
  { day: '1', change: 'Remove sugar and alcohol', details: 'No refined sugar, honey, maple syrup, or other sweeteners, and no alcohol. Whole fruit is fine.' },
  { day: '2', change: 'Also remove caffeine', details: 'No coffee, black tea, green tea, or other caffeinated drinks. Water, CCF tea, and lemon water only.' },
  { day: '3', change: 'Also remove dairy', details: 'No milk, yogurt, cheese, butter, or cream. Ghee is allowed. Cook oatmeal in water instead of milk.' },
  { day: '4', change: 'Also remove gluten', details: 'No wheat, barley, rye, or products containing them. Check labels on spice blends.' },
  { day: '5', change: 'Also remove meat and seafood', details: 'No meat, poultry, fish, shellfish, or bone broth.' },
  { day: '6-10', change: 'Kitchari cleanse', details: 'Kitchari for every meal, with water, CCF tea, or lemon water between meals.' },
  { day: '11', change: 'Add back meat and seafood', details: 'Have it at lunch so it has time to digest. Keep portions modest and prepare it simply.' },
  { day: '12', change: 'Add back gluten', details: 'Have it at lunch, such as a small piece of whole-grain bread or a wheat-based side. Oatmeal is fine at breakfast.' },
  { day: '13', change: 'Add back dairy', details: 'Have it at lunch. Milk, yogurt, cheese, butter, and cream are back.' },
  { day: '14', change: 'Add back caffeine', details: 'Your usual coffee or tea.' },
  { day: '15', change: 'Add back sugar and alcohol', details: 'A small portion at lunch, if you choose.' },
];
export const DAILY_CHANGES_NOTE = 'Good to know: Ghee (clarified butter) is part of this plan the whole way through and is not counted as dairy. On Day 2, some people get a mild caffeine-withdrawal headache, so plan a lighter day if you can.';

// ── Meal plan — recipe ids reference RECIPES below
export const MEAL_PLAN = [
  { day: 1,  phase: 'elimination',     remove: 'Sugar, alcohol',        breakfast: 'baked-apple-rosemary',       lunch: ['quinoa-mint-parsley', 'sweet-potato-kale-ginger'], dinner: 'curried-coconut-carrot-soup' },
  { day: 2,  phase: 'elimination',     remove: '+ Caffeine',            breakfast: 'warm-spiced-oatmeal',        lunch: ['collard-greens-potato', 'simple-cumin-rice'],      dinner: 'coconut-beet-soup' },
  { day: 3,  phase: 'elimination',     remove: '+ Dairy',               breakfast: 'apple-pumpkin-hash',         lunch: ['sweet-potato-kale-ginger', 'simple-cumin-rice'],   dinner: 'basic-kitchari' },
  { day: 4,  phase: 'elimination',     remove: '+ Gluten',              breakfast: 'roasted-pears',              lunch: ['quinoa-mint-parsley', 'collard-greens-potato'],    dinner: 'curried-coconut-carrot-soup' },
  { day: 5,  phase: 'elimination',     remove: '+ Meat, seafood',       breakfast: 'venpongal',                  lunch: ['cauliflower-steaks-tahini', 'simple-cumin-rice'],  dinner: 'basic-kitchari' },
  { day: 6,  phase: 'kitchari',        remove: null,                    breakfast: 'pitta-vata-kitchari',        lunch: ['pitta-vata-kitchari'],                              dinner: 'pitta-vata-kitchari' },
  { day: 7,  phase: 'kitchari',        remove: null,                    breakfast: 'pitta-vata-kitchari',        lunch: ['pitta-vata-kitchari'],                              dinner: 'pitta-vata-kitchari' },
  { day: 8,  phase: 'kitchari',        remove: null,                    breakfast: 'fall-root-kitchari',         lunch: ['fall-root-kitchari'],                               dinner: 'fall-root-kitchari' },
  { day: 9,  phase: 'kitchari',        remove: null,                    breakfast: 'fall-root-kitchari',         lunch: ['fall-root-kitchari'],                               dinner: 'fall-root-kitchari' },
  { day: 10, phase: 'kitchari',        remove: null,                    breakfast: 'pitta-vata-kitchari',        lunch: ['pitta-vata-kitchari'],                              dinner: 'pitta-vata-kitchari' },
  { day: 11, phase: 'reintroduction',  addBack: 'Meat, seafood',        breakfast: 'stewed-apples',              lunch: ['sweet-potato-kale-ginger', 'simple-cumin-rice', 'fish-or-chicken-reintro'], dinner: 'basic-kitchari' },
  { day: 12, phase: 'reintroduction',  addBack: '+ Gluten',             breakfast: 'warm-spiced-oatmeal',        lunch: ['coconut-beet-soup', 'simple-cumin-rice', 'gluten-reintro'], dinner: 'basic-kitchari' },
  { day: 13, phase: 'reintroduction',  addBack: '+ Dairy',              breakfast: 'apple-pumpkin-hash',         lunch: ['quinoa-mint-parsley', 'sweet-potato-kale-ginger'], dinner: 'fall-root-kitchari' },
  { day: 14, phase: 'reintroduction',  addBack: '+ Caffeine',           breakfast: 'roasted-pears',              lunch: ['cauliflower-steaks-tahini', 'collard-greens-potato', 'simple-cumin-rice'], dinner: 'basic-kitchari' },
  { day: 15, phase: 'reintroduction',  addBack: '+ Sugar, alcohol',     breakfast: 'warm-spiced-oatmeal',        lunch: ['sweet-potato-kale-ginger', 'quinoa-mint-parsley'], dinner: 'basic-kitchari' },
];

export const MEAL_PLAN_NOTES = {
  phase1: "Cooked only: Every fruit and vegetable in Phase 1 is cooked. For the quinoa dish, stir the fresh herbs into the hot quinoa so they wilt. For the soups, simmer or sauté the vegetables (including the beets and carrots) in water until soft before blending.",
  phase2: "How much should you eat? Make lunch your biggest bowl, and keep breakfast and dinner smaller. Let hunger and satisfaction guide you, and cook a fresh pot each day. For a softer breakfast, add extra water. For lunch, keep the vegetables a little chunkier. Skip snacks between meals, and if you absolutely need something, have kitchari.",
  phase3: "Add one category back each day. Have the new food at lunch, your biggest meal, so you have the whole afternoon to digest it, and eat kitchari for dinner. Pay attention to digestion, energy, mood, and skin, and jot down what you notice in the Reintroduction journal in this guide.\n\nMeat, seafood, and gluten come back on Days 11 and 12, so keep portions modest and simply prepared. Save richer or fried versions for after the cleanse. Fruits and vegetables stay cooked all the way through Day 15, so if your Day 15 treat includes fruit, choose baked or stewed fruit.",
};

// ── Cooking fresh each day
export const COOKING_FRESH = {
  cookItTheDayYouEatIt: [
    'Cook lunch and dinner fresh, on the day you eat them. In Ayurveda, freshly cooked food is considered easier to digest.',
    "Start with lunch, your biggest meal, so it's ready between 11 am and 1 pm. Cook dinner in the afternoon so you finish eating before 6:30 pm.",
    "Choose fresh over frozen or canned wherever you can. It won't be 100% (spices, grains, ghee, and a few staples come from the pantry), and that's okay.",
    'Kitchari days: cook a fresh pot each day, just enough for one person so nothing is left over.',
    'No batch cooking or freezing. Wash and chop as you cook.',
  ],
  keepingCooked: [
    'Vegetables: steam, sauté in ghee, roast, or simmer until soft. Cook leafy greens down until fully wilted.',
    'Fruit: stew, bake, or roast it, as in the apple and pear breakfasts. Dried figs and dates are cooked right into dishes.',
    'Herbs and ginger: sauté fresh ginger, and stir fresh herbs into hot food so they wilt.',
  ],
  foodSafety: [
    'If you do have leftovers, cool cooked rice and kitchari promptly in a shallow container and refrigerate within two hours.',
    'Keep refrigerated food at 40°F (4°C) or below, and reheat thoroughly to 165°F (74°C).',
    'Freshly cooked is best, so try to make just what you\'ll eat.',
  ],
};

// ── Shopping list
export const SHOPPING_LIST = [
  { category: 'Grains and legumes', items: [
    { item: 'White basmati rice', usedIn: 'All kitchari recipes, Venpongal, Simple Cumin Rice' },
    { item: 'Split yellow mung dal', usedIn: 'Basic Kitchari, Pitta-Vata Kitchari, Venpongal' },
    { item: 'Split mung beans', usedIn: 'Fall Root Kitchari' },
    { item: 'Quinoa', usedIn: 'Quinoa with Mint & Parsley' },
    { item: 'Rolled oats', usedIn: 'Warm Spiced Oatmeal' },
  ]},
  { category: 'Ghee, oils, and sauces', items: [
    { item: 'Ghee', usedIn: 'Nearly every recipe' },
    { item: 'Olive oil', usedIn: 'Quinoa, tahini sauce, Collard Greens (optional)' },
    { item: 'Tahini', usedIn: 'Grilled Cauliflower Steaks' },
    { item: 'Apple cider vinegar', usedIn: 'Tahini sauce' },
  ]},
  { category: 'Vegetables (fresh, cook all)', items: [
    { item: 'Sweet potatoes', usedIn: 'Sweet Potato with Kale & Ginger, Pitta-Vata Kitchari' },
    { item: 'Carrots', usedIn: 'Curried Coconut and Carrot Soup, Basic Kitchari' },
    { item: 'Butternut squash or pumpkin', usedIn: 'Fall Root Kitchari, Apple Pumpkin Breakfast Hash (fresh, not canned)' },
    { item: 'Beets', usedIn: 'Coconut Beet Soup' },
    { item: 'Potatoes', usedIn: 'Collard Greens with Potato' },
    { item: 'Cauliflower', usedIn: 'Grilled Cauliflower Steaks' },
    { item: 'Kale', usedIn: 'Sweet Potato with Kale & Ginger' },
    { item: 'Collard greens', usedIn: 'Collard Greens with Potato' },
    { item: 'Leafy greens (spinach, chard, or extra kale)', usedIn: 'Basic Kitchari, Pitta-Vata Kitchari' },
    { item: 'Zucchini', usedIn: 'Pitta-Vata Kitchari' },
    { item: 'Asparagus', usedIn: 'Pitta-Vata Kitchari' },
    { item: 'Celery', usedIn: 'Curried Coconut and Carrot Soup' },
    { item: 'Leek', usedIn: 'Curried Coconut and Carrot Soup' },
  ]},
  { category: 'Fruit (fresh, cook all)', items: [
    { item: 'Apples', usedIn: 'Baked Apple, Stewed Apples, Apple Pumpkin Breakfast Hash' },
    { item: 'Pears', usedIn: 'Roasted Pears' },
    { item: 'Dried figs', usedIn: 'Apple Pumpkin Breakfast Hash, Stewed Apples (optional)' },
    { item: 'Pitted dates', usedIn: 'Apple Pumpkin Breakfast Hash' },
    { item: 'Lemons', usedIn: 'Hot lemon water, Collard Greens with Potato' },
    { item: 'Limes', usedIn: 'Quinoa with Mint & Parsley (seasoning)' },
  ]},
  { category: 'Fresh herbs and ginger', items: [
    { item: 'Fresh ginger', usedIn: 'Kitchari, soups, Sweet Potato with Kale & Ginger, Apple Pumpkin Breakfast Hash, Warm Spiced Oatmeal' },
    { item: 'Cilantro', usedIn: 'Pitta-Vata Kitchari, Quinoa with Mint & Parsley' },
    { item: 'Parsley', usedIn: 'Quinoa with Mint & Parsley' },
    { item: 'Mint', usedIn: 'Quinoa with Mint & Parsley' },
    { item: 'Rosemary', usedIn: 'Baked Apple with Rosemary' },
  ]},
  { category: 'Spices and seasonings', items: [
    { item: 'Cumin (seeds and ground)', usedIn: 'Kitchari, Simple Cumin Rice, quinoa, cauliflower, CCF tea' },
    { item: 'Coriander (seeds and ground)', usedIn: 'Kitchari, Simple Cumin Rice, CCF tea' },
    { item: 'Fennel seeds', usedIn: 'Kitchari, CCF tea' },
    { item: 'Turmeric', usedIn: 'Kitchari, quinoa, Collard Greens with Potato' },
    { item: 'Cinnamon', usedIn: 'All apple recipes, Roasted Pears, Warm Spiced Oatmeal, Fall Root Kitchari' },
    { item: 'Cardamom', usedIn: 'All apple recipes, Warm Spiced Oatmeal, Fall Root Kitchari' },
    { item: 'Cloves', usedIn: 'Roasted Pears, Apple Pumpkin Breakfast Hash' },
    { item: 'Nutmeg', usedIn: 'Apple Pumpkin Breakfast Hash' },
    { item: 'Black pepper', usedIn: 'Coconut Beet Soup' },
    { item: 'Mild yellow curry powder', usedIn: 'Curried Coconut and Carrot Soup' },
    { item: 'Garlic powder', usedIn: 'Grilled Cauliflower Steaks' },
    { item: 'Bay leaves', usedIn: 'Venpongal' },
    { item: 'Sea salt', usedIn: 'Most recipes' },
  ]},
  { category: 'Pantry (kept to a minimum)', items: [
    { item: 'Unsweetened shredded coconut or coconut flakes', usedIn: 'Curried Coconut and Carrot Soup, Coconut Beet Soup, Roasted Pears (optional)' },
    { item: 'Cashews (optional)', usedIn: 'Venpongal' },
  ]},
  { category: 'Buy later (Days 11-15), for lunch', items: [
    { item: 'Fish (white fish) or chicken', usedIn: 'Day 11: add back meat and seafood' },
    { item: 'Whole-grain bread or another wheat-based side', usedIn: 'Day 12: add back gluten' },
    { item: 'Plain yogurt, plus butter (optional)', usedIn: 'Day 13: add back dairy' },
    { item: 'Coffee or your usual tea', usedIn: 'Day 14: add back caffeine (with breakfast)' },
    { item: 'Something sweet or a drink (optional)', usedIn: 'Day 15: add back sugar and alcohol' },
  ]},
];
export const SHOPPING_LIST_INTRO = "Use this list to shop before Day 1, and shop for fresh produce over frozen or canned wherever you can. Spices, grains, ghee, and a few staples come from the pantry, and it doesn't have to be 100%. Quantities depend on the recipes you generate, so generate your recipes first and adjust from there. Everything is cooked fresh for one person, and fruits and vegetables are all cooked. Check labels on spice blends for gluten from Day 4 to Day 11.";

// ── Reintroduction journal — client fills this in themselves, in-app
export const REINTRODUCTION_JOURNAL_DAYS = [
  { day: 11, addedBack: 'Meat, seafood' },
  { day: 12, addedBack: 'Gluten' },
  { day: 13, addedBack: 'Dairy' },
  { day: 14, addedBack: 'Caffeine' },
  { day: 15, addedBack: 'Sugar, alcohol' },
];
export const REINTRODUCTION_JOURNAL_PROMPT = "As you add each category back, take a moment to notice how you feel over the next few hours. Use the boxes below to jot down anything you observe. There are no right or wrong answers. It's simply information about you.";
export const REINTRODUCTION_JOURNAL_NOTE = "Things to notice: bloating or gas, how you feel an hour or two after eating, energy through the afternoon, sleep, mood, and any change in your skin. If something feels off, you're welcome to pause and hold off on that food for now.";

// ── Recipe prompts — see file header. `days` cross-references MEAL_PLAN.
export const RECIPE_TIPS = [
  'Each prompt already asks for exact quantities and steps. Add any preference at the end, such as a different number of servings.',
  'Recipes are meant to use ghee (not counted as dairy). Replace ghee with olive oil if you prefer.',
  'Every prompt is written for cooking fresh for one person, with fresh ingredients and no batch cooking, freezing, or canned goods.',
  'Every prompt asks for fully cooked fruits and vegetables. If a recipe you generate includes anything raw, ask the AI to cook it or swap in a cooked version.',
  'Look over the recipe it gives you before you cook, and check ingredient labels if you have any sensitivities.',
];

export const RECIPES = [
  { id: 'pitta-vata-kitchari', number: 1, title: 'Pitta-Vata Kitchari', category: 'Kitchari', days: [6, 7, 10],
    prompt: 'Give me a recipe for Ayurvedic kitchari for a 5-day cleanse in fall that reduces pitta and balances vata. Use white basmati rice, split yellow mung dal, cooling and sweet vegetables (zucchini, sweet potato, asparagus, leafy greens) cooked right into the kitchari, and gentle spices (coriander, fennel, cumin, turmeric, a little fresh ginger), with a ghee tempering. Stir the cilantro into the hot kitchari at the end so it wilts. Avoid heavy chili, black pepper, and mustard seed. Everything should be fully cooked, with no raw fruit or vegetables. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include exact quantities and step-by-step instructions.' },
  { id: 'fall-root-kitchari', number: 2, title: 'Fall Root Kitchari', category: 'Kitchari', days: [8, 9, 13],
    prompt: 'Give me an Ayurvedic kitchari for fall that grounds vata and stays cooling for pitta. Use basmati rice, split mung beans, roasted butternut squash or other root vegetables, cinnamon, cardamom, turmeric, fennel, and a small amount of fresh ginger, cooked with ghee and made soupy and soft. Everything should be fully cooked, with no raw fruit or vegetables. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Give exact quantities and step-by-step instructions.' },
  { id: 'basic-kitchari', number: 3, title: 'Basic Kitchari', category: 'Kitchari', days: [3, 5, 11, 12, 14, 15],
    prompt: 'Give me a recipe for simple Ayurvedic Basic Kitchari using white basmati rice, split yellow mung dal, root vegetables, leafy greens, and warming digestive spices (coriander, cumin, turmeric, fennel), with a ghee seed tempering. Cook the vegetables and greens right into the kitchari until soft. Everything should be fully cooked, with no raw fruit or vegetables. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include exact quantities and step-by-step instructions.' },
  { id: 'venpongal', number: 4, title: 'Venpongal, Breakfast Kitchari', category: 'Kitchari', days: [5],
    prompt: 'Give me a recipe for Venpongal, a South Indian breakfast kitchari, adapted for an Ayurvedic detox. Use basmati rice, mung dal, cumin, turmeric, ginger, cashews, bay leaves, and a spiced ghee tempering, with any garnish cooked or dried rather than raw. Everything should be fully cooked, with no raw fruit or vegetables. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include exact quantities and step-by-step instructions.' },
  { id: 'stewed-apples', number: 5, title: 'Basic Stewed Apples', category: 'Breakfasts', days: [11],
    prompt: 'Give me a simple Ayurvedic stewed apples recipe with diced apples, cinnamon, cardamom, a little ghee, and optional chopped figs, cooked covered on the stovetop until soft. All fruit should be cooked. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include exact quantities and timing.' },
  { id: 'baked-apple-rosemary', number: 6, title: 'Baked Apple with Rosemary', category: 'Breakfasts', days: [1],
    prompt: 'Give me an Ayurvedic baked apple with rosemary, ghee, cinnamon, and cardamom, with no added sugar, baked until fully soft. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities, oven temperature, and baking time.' },
  { id: 'roasted-pears', number: 7, title: 'Roasted Pears', category: 'Breakfasts', days: [4, 14],
    prompt: 'Give me an Ayurvedic roasted pears recipe seasoned with cinnamon, cloves, and a pinch of salt, with optional shredded coconut. Do not use grapes. Roast all the fruit until soft and cooked through. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities, oven temperature, and timing.' },
  { id: 'apple-pumpkin-hash', number: 8, title: 'Apple Pumpkin Breakfast Hash', category: 'Breakfasts', days: [3, 13],
    prompt: 'Give me an Ayurvedic apple and pumpkin breakfast hash with apples, fresh pumpkin or butternut squash (cooked until soft and mashed, not canned), dried figs and dates, ginger, cinnamon, cardamom, cloves, and nutmeg, with no refined sugar, simmered until everything is soft. Any fruit toppings should be cooked, not raw. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities, steps, and toppings.' },
  { id: 'warm-spiced-oatmeal', number: 9, title: 'Warm Spiced Oatmeal', category: 'Breakfasts', days: [2, 12, 15],
    prompt: 'Give me a recipe for warm spiced oatmeal for an Ayurvedic cleanse, with no fruit. Use rolled oats cooked in water until soft and creamy, with a little ghee, cinnamon, cardamom, fresh ginger, and a pinch of salt, and no added sugar. Also tell me how to make it with milk once dairy is back in my diet. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include exact quantities and step-by-step instructions.' },
  { id: 'sweet-potato-kale-ginger', number: 10, title: 'Sweet Potato with Kale & Ginger', category: 'Vegetables, grains, and soups', days: [1, 3, 11, 13, 15],
    prompt: 'Give me an Ayurvedic recipe for sweet potato with sautéed kale and fresh ginger in ghee. Cook the sweet potato until soft and the kale until fully wilted. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and steps.' },
  { id: 'quinoa-mint-parsley', number: 11, title: 'Quinoa with Mint & Parsley', category: 'Vegetables, grains, and soups', days: [1, 4, 13, 15],
    prompt: 'Give me a warm Ayurvedic quinoa dish with mint, parsley or cilantro, lime, and olive oil, with the quinoa toasted in ghee with cumin, turmeric, and ginger. Do not use onion. Stir the fresh herbs into the hot quinoa so they wilt, so nothing is served raw. Use lime juice only as a seasoning. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and steps.' },
  { id: 'simple-cumin-rice', number: 12, title: 'Simple Cumin Rice', category: 'Vegetables, grains, and soups', days: [2, 3, 5, 11, 12, 14],
    prompt: 'Give me a simple Ayurvedic cumin rice recipe with basmati rice, toasted cumin and coriander, ghee, and salt. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and water ratio.' },
  { id: 'curried-coconut-carrot-soup', number: 13, title: 'Curried Coconut and Carrot Soup', category: 'Vegetables, grains, and soups', days: [1, 4],
    prompt: 'Give me an Ayurvedic blended soup with celery, carrot, leek, mild curry powder, and coconut flakes. Simmer the celery, carrot, and leek in water until very soft, then blend until smooth, so nothing is raw. Do not use broth, juice, or coconut water; use extra carrot for sweetness. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and steps.' },
  { id: 'coconut-beet-soup', number: 14, title: 'Coconut Beet Soup', category: 'Vegetables, grains, and soups', days: [2, 12],
    prompt: 'Give me an Ayurvedic beet soup with grated beets, shredded coconut, ghee, ginger, and black pepper. Sauté the beets in ghee and simmer them in water until tender before blending, so nothing is raw. Do not use broth or canned coconut milk. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and steps.' },
  { id: 'cauliflower-steaks-tahini', number: 15, title: 'Grilled Cauliflower Steaks with Tahini Sauce', category: 'Vegetables, grains, and soups', days: [5, 14],
    prompt: 'Give me a gluten-free, dairy-free recipe for grilled or broiled cauliflower steaks with garlic powder and cumin, cooked until fully tender and browned, served with a tahini sauce made with olive oil and apple cider vinegar. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and timing.' },
  { id: 'collard-greens-potato', number: 16, title: 'Collard Greens with Potato, Lemon & Turmeric', category: 'Vegetables, grains, and soups', days: [2, 4, 14],
    prompt: 'Give me an Ayurvedic recipe for collard greens cooked with potato, lemon juice, and turmeric in ghee or olive oil. Cook the potato until soft and the greens until fully wilted. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and steps.' },
  { id: 'fish-or-chicken-reintro', number: 17, title: 'Simple Fish or Chicken for Reintroduction', category: 'Reintroduction add-ons', days: [11],
    prompt: 'Give me a very simple, gentle Ayurvedic-style recipe for baked white fish or poached chicken with turmeric, cumin, and coriander, suitable for the first meat or seafood after a 10-day cleanse, eaten at lunch. If it is served with vegetables, they should be cooked. Cook it fresh for one person, using fresh ingredients rather than frozen or canned ones (no batch cooking or freezing). Include quantities and cooking time for one serving.' },
  { id: 'gluten-reintro', number: 18, title: 'Gluten Reintroduction Meal', category: 'Reintroduction add-ons', days: [12],
    prompt: 'Suggest a simple, easy-to-digest way to reintroduce gluten at lunch after a cleanse, such as a small piece of whole-grain bread or a simple wheat-based side served with soup. Include quantities and preparation for one person, keeping it low in sugar and fat.' },
  { id: 'lemon-water-ccf-tea', number: 19, title: 'Hot Lemon Water and CCF Tea', category: 'Warm drinks', days: 'all',
    prompt: 'Give me a simple hot lemon water routine for first thing in the morning and a simple CCF tea recipe (cumin, coriander, fennel) for one person, with quantities, preparation, steeping time, and the best times of day to drink each. Explain that between meals the only drinks are water (hot or room temperature), CCF tea, or lemon water.' },
];

export function findRecipe(id) {
  return RECIPES.find(r => r.id === id) || null;
}
