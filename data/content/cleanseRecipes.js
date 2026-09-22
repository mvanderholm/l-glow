// L. Glôw's 15-Day Ayurvedic Cleanse — generated recipe content.
//
// DRAFT — AI-GENERATED, AWAITING THEA'S REVIEW. Every recipe below was
// produced from the exact prompts in data/content/cleanse.js's RECIPES
// array (Thea's own prompts, verbatim), following the developer guide's
// instruction to "generate the recipes, review them, and store them in
// the app." Treat as a draft the same way affirmations.js/mythbusters.js
// content is treated before her sign-off — do not present as final,
// approved content until she's reviewed it. Servings are fixed at 1
// throughout, per the source guide ("cook it fresh for one person").
//
// gheeNote: every recipe that calls for ghee carries the same one-line
// substitution the guide itself already authorizes ("Replace ghee with
// olive oil if you prefer") — swap 1:1, nothing else changes. This is
// why there's no separate olive-oil version of each recipe: the
// substitution is uniform and already spelled out to the user, not a
// distinct recipe.
//
// For a version tuned beyond a straight ghee/oil swap (different
// servings, an ingredient swap, a dietary note) use the live
// regenerate-cleanse-recipe path instead of editing this file's static
// content — see components/cleanse/RecipeCard.js's "Regenerate" action.

export const RECIPE_DRAFT_STATUS = 'draft-awaiting-thea-review';

export const RECIPES_CONTENT = {

  // ── Kitchari ──────────────────────────────────────────────────────────
  'pitta-vata-kitchari': {
    servings: 1,
    ingredients: [
      '1/4 cup white basmati rice',
      '2 tbsp split yellow mung dal',
      '1 tsp ghee (or olive oil)',
      '1/2 tsp cumin seeds',
      '1/4 tsp fennel seeds',
      '1/4 tsp ground coriander',
      '1/4 tsp turmeric',
      '1/2 tsp fresh ginger, grated',
      '1/3 cup zucchini, diced',
      '1/3 cup sweet potato, peeled and diced small',
      '3-4 asparagus spears, cut into 1-inch pieces',
      '1 cup leafy greens (spinach or chard), chopped',
      '2 1/2 cups water, plus more if needed',
      'Sea salt, to taste',
      '1 tbsp fresh cilantro, chopped',
    ],
    steps: [
      'Rinse the rice and mung dal together until the water runs mostly clear, then drain.',
      'Warm the ghee in a small pot over medium heat. Add the cumin and fennel seeds and let them sizzle for about 30 seconds, until fragrant.',
      'Stir in the ground coriander, turmeric, and ginger, and cook for 15 seconds more.',
      'Add the rice and mung dal, stirring to coat in the spices for a minute.',
      'Add the sweet potato and 2 1/2 cups water. Bring to a boil, then reduce to a low simmer, cover, and cook for 15 minutes, stirring occasionally.',
      'Add the zucchini and asparagus. Continue simmering, uncovered, for 10-15 minutes, until the rice and dal are soft and the kitchari is thick and porridge-like. Add a splash more water if it looks dry.',
      'Stir in the leafy greens and cook for 2-3 minutes, until fully wilted.',
      'Season with salt. Remove from heat, stir in the cilantro so it wilts into the hot kitchari, and serve warm.',
    ],
    gheeNote: true,
  },

  'fall-root-kitchari': {
    servings: 1,
    ingredients: [
      '1/4 cup white basmati rice',
      '2 tbsp split mung beans (or split yellow mung dal)',
      '1 tsp ghee (or olive oil)',
      '1/2 tsp cinnamon',
      '1/4 tsp cardamom',
      '1/4 tsp turmeric',
      '1/4 tsp fennel seeds',
      '1/4 tsp fresh ginger, grated',
      '2/3 cup butternut squash, peeled and cubed small',
      '2 1/2 cups water, plus more as needed',
      'Sea salt, to taste',
    ],
    steps: [
      'Rinse the rice and mung beans together and drain.',
      'Warm the ghee in a small pot over medium heat. Add the fennel seeds and let them sizzle for about 20 seconds.',
      'Stir in the cinnamon, cardamom, turmeric, and ginger, cooking for 15 seconds until fragrant.',
      'Add the rice, mung beans, and squash, stirring to coat.',
      'Pour in the water, bring to a boil, then reduce to a low simmer. Cover and cook for 20-25 minutes, stirring occasionally, until the squash is fork-tender and starting to break down.',
      'Uncover and simmer 5-10 minutes more, mashing some of the squash against the side of the pot, until the kitchari is soft, soupy, and grounding. Add water if it needs loosening.',
      'Season with salt and serve warm.',
    ],
    gheeNote: true,
  },

  'basic-kitchari': {
    servings: 1,
    ingredients: [
      '1/4 cup white basmati rice',
      '2 tbsp split yellow mung dal',
      '1 tsp ghee (or olive oil)',
      '1/2 tsp cumin seeds',
      '1/4 tsp ground coriander',
      '1/4 tsp turmeric',
      '1/4 tsp fennel seeds',
      '1/3 cup root vegetable (carrot or sweet potato), diced small',
      '3/4 cup leafy greens, chopped',
      '2 1/2 cups water, plus more as needed',
      'Sea salt, to taste',
    ],
    steps: [
      'Rinse the rice and mung dal together and drain.',
      'Warm the ghee in a small pot over medium heat. Add the cumin and fennel seeds and let them sizzle for 20-30 seconds.',
      'Stir in the coriander and turmeric, cooking for 15 seconds.',
      'Add the rice, mung dal, and root vegetable, stirring to coat in the spices.',
      'Add the water, bring to a boil, then reduce to a low simmer. Cover and cook 15-18 minutes, stirring occasionally, until the rice and dal have broken down and softened.',
      'Stir in the leafy greens and cook, uncovered, another 3-4 minutes until fully wilted and the kitchari is thick and soft.',
      'Season with salt. Add water to loosen if needed, and serve warm.',
    ],
    gheeNote: true,
  },

  'venpongal': {
    servings: 1,
    ingredients: [
      '1/4 cup white basmati rice',
      '2 tbsp split yellow mung dal',
      '1 tbsp ghee (or olive oil)',
      '1/2 tsp cumin seeds',
      '1/4 tsp turmeric',
      '1/2 tsp fresh ginger, grated',
      '1 bay leaf',
      '1 tbsp raw cashews',
      '2 1/2 cups water',
      'Sea salt, to taste',
      'Dried curry leaves, optional, for garnish (skip if unavailable)',
    ],
    steps: [
      'Rinse the rice and mung dal together and drain.',
      'In a small pot, dry-toast the mung dal over medium heat for 1-2 minutes until lightly fragrant, then add the rice, turmeric, bay leaf, and water. Bring to a boil, reduce to a simmer, cover, and cook 18-20 minutes, stirring occasionally, until soft and porridge-like.',
      'Meanwhile, warm the ghee in a small pan over medium heat. Add the cumin seeds and cashews, and toast for 1-2 minutes until the cashews are golden and the cumin is fragrant.',
      'Stir in the ginger and cook for 15 seconds more.',
      'Pour the ghee-cumin-cashew mixture into the cooked rice and dal, along with any dried curry leaves. Stir to combine.',
      'Season with salt, adding a splash of hot water if the texture is thicker than you like. Serve warm.',
    ],
    gheeNote: true,
  },

  // ── Breakfasts ────────────────────────────────────────────────────────
  'stewed-apples': {
    servings: 1,
    ingredients: [
      '1 large apple, cored and diced',
      '1 tsp ghee (or olive oil)',
      '1/4 tsp cinnamon',
      'Pinch of cardamom',
      '1 tbsp chopped dried figs, optional',
      '2-3 tbsp water',
    ],
    steps: [
      'Combine the apple, ghee, cinnamon, cardamom, figs (if using), and water in a small saucepan.',
      'Cover and cook over medium-low heat for 8-10 minutes, stirring occasionally, until the apple is fully soft.',
      'Uncover and cook 1-2 minutes more to thicken slightly if there\'s excess liquid. Serve warm.',
    ],
    gheeNote: true,
  },

  'baked-apple-rosemary': {
    servings: 1,
    ingredients: [
      '1 large apple',
      '1 tsp ghee (or olive oil), melted',
      '1/4 tsp cinnamon',
      'Pinch of cardamom',
      '1 small sprig fresh rosemary',
    ],
    steps: [
      'Preheat the oven to 375°F (190°C).',
      'Core the apple, leaving the bottom intact to hold the filling, and place it in a small baking dish.',
      'Stir the melted ghee with the cinnamon and cardamom, and spoon it into the cored center.',
      'Tuck the rosemary sprig alongside the apple.',
      'Bake for 30-35 minutes, until the apple is fully soft when pierced with a knife.',
      'Remove the rosemary sprig before eating, and serve warm.',
    ],
    gheeNote: true,
  },

  'roasted-pears': {
    servings: 1,
    ingredients: [
      '1 large pear, halved and cored',
      '1 tsp ghee (or olive oil), melted',
      '1/4 tsp cinnamon',
      'Pinch of ground cloves',
      'Pinch of sea salt',
      '1 tsp shredded coconut, optional',
    ],
    steps: [
      'Preheat the oven to 375°F (190°C).',
      'Place the pear halves cut-side up in a small baking dish.',
      'Brush with the melted ghee and sprinkle with cinnamon, cloves, and salt.',
      'Roast for 20-25 minutes, until fully soft and lightly browned at the edges.',
      'Top with shredded coconut, if using, and serve warm.',
    ],
    gheeNote: true,
  },

  'apple-pumpkin-hash': {
    servings: 1,
    ingredients: [
      '1/2 cup fresh pumpkin or butternut squash, peeled and diced small',
      '1/2 apple, diced',
      '1 tsp ghee (or olive oil)',
      '1 tbsp chopped dried figs',
      '1 tbsp chopped pitted dates',
      '1/4 tsp fresh ginger, grated',
      '1/4 tsp cinnamon',
      'Pinch of cardamom',
      'Pinch of ground cloves',
      'Pinch of nutmeg',
      '2-3 tbsp water',
    ],
    steps: [
      'Warm the ghee in a small skillet over medium heat.',
      'Add the pumpkin and cook for 5 minutes, stirring occasionally, until it starts to soften.',
      'Add the apple, figs, dates, ginger, and spices, along with the water. Cover and cook 8-10 minutes, stirring occasionally, until the pumpkin is fork-tender.',
      'Uncover and mash some of the pumpkin against the pan with a fork, leaving some texture, until everything is soft and hash-like.',
      'Serve warm, with any cooked fruit topping you like.',
    ],
    gheeNote: true,
  },

  'warm-spiced-oatmeal': {
    servings: 1,
    ingredients: [
      '1/2 cup rolled oats',
      '1 cup water',
      '1 tsp ghee (or olive oil)',
      '1/4 tsp cinnamon',
      'Pinch of cardamom',
      '1/4 tsp fresh ginger, grated',
      'Pinch of sea salt',
    ],
    steps: [
      'Combine the oats and water in a small saucepan and bring to a gentle boil.',
      'Reduce heat to low and simmer 5-7 minutes, stirring occasionally, until soft and creamy.',
      'Stir in the ghee, cinnamon, cardamom, ginger, and salt.',
      'Serve warm.',
    ],
    gheeNote: true,
    dairyReintroNote: 'Once dairy is back in your diet (Day 13 on): swap the water for milk, or use half water and half milk, and cook the same way.',
  },

  // ── Vegetables, grains, and soups ────────────────────────────────────
  'sweet-potato-kale-ginger': {
    servings: 1,
    ingredients: [
      '1 small sweet potato, peeled and diced',
      '1 tsp ghee (or olive oil)',
      '1/2 tsp fresh ginger, grated',
      '1 1/2 cups kale, stemmed and chopped',
      '2-3 tbsp water',
      'Sea salt, to taste',
    ],
    steps: [
      'Warm the ghee in a skillet over medium heat. Add the sweet potato and sauté for 2 minutes.',
      'Add the water, cover, and cook 8-10 minutes, stirring occasionally, until the sweet potato is soft.',
      'Stir in the ginger and kale. Cover and cook 3-4 minutes more, until the kale is fully wilted.',
      'Season with salt and serve warm.',
    ],
    gheeNote: true,
  },

  'quinoa-mint-parsley': {
    servings: 1,
    ingredients: [
      '1/3 cup quinoa, rinsed',
      '2/3 cup water',
      '1 tsp ghee (or olive oil)',
      '1/4 tsp cumin seeds',
      '1/4 tsp turmeric',
      '1/4 tsp fresh ginger, grated',
      '1 tbsp fresh mint, chopped',
      '1 tbsp fresh parsley (or cilantro), chopped',
      '1 tsp olive oil, for finishing',
      'Squeeze of fresh lime juice',
      'Sea salt, to taste',
    ],
    steps: [
      'Warm the ghee in a small pot over medium heat. Add the cumin seeds and toast 20-30 seconds until fragrant.',
      'Add the quinoa, turmeric, and ginger, stirring for a minute to toast the quinoa lightly.',
      'Add the water, bring to a boil, then reduce to a simmer. Cover and cook 12-15 minutes, until the water is absorbed and the quinoa is tender.',
      'Fluff with a fork, then stir in the finishing olive oil, mint, and parsley while the quinoa is still hot so the herbs wilt.',
      'Season with salt and a squeeze of lime juice just before serving warm.',
    ],
    gheeNote: true,
  },

  'simple-cumin-rice': {
    servings: 1,
    ingredients: [
      '1/3 cup basmati rice, rinsed',
      '2/3 cup water',
      '1 tsp ghee (or olive oil)',
      '1/2 tsp cumin seeds',
      '1/4 tsp ground coriander',
      'Sea salt, to taste',
    ],
    steps: [
      'Warm the ghee in a small pot over medium heat. Add the cumin seeds and toast 20-30 seconds until fragrant.',
      'Add the rice and coriander, stirring for a minute to coat.',
      'Add the water and salt, bring to a boil, then reduce to a low simmer. Cover and cook 15 minutes, until the water is absorbed.',
      'Remove from heat and let sit, covered, 5 minutes, then fluff with a fork and serve warm.',
    ],
    gheeNote: true,
  },

  'curried-coconut-carrot-soup': {
    servings: 1,
    ingredients: [
      '1 stalk celery, chopped',
      '1 medium carrot, chopped',
      '1/4 cup leek, sliced (white and light green parts)',
      '1 1/4 cups water',
      '1/2 tsp mild yellow curry powder',
      '1 tbsp unsweetened coconut flakes',
      'Sea salt, to taste',
    ],
    steps: [
      'Combine the celery, carrot, leek, and water in a small pot. Bring to a boil, then reduce to a simmer.',
      'Cover and cook 15-18 minutes, until the vegetables are very soft.',
      'Stir in the curry powder and coconut flakes, and simmer 2 minutes more.',
      'Blend until smooth using an immersion blender or countertop blender (careful with hot liquid).',
      'Season with salt. Add a little water to thin if needed, and serve warm.',
    ],
    gheeNote: false,
  },

  'coconut-beet-soup': {
    servings: 1,
    ingredients: [
      '1 medium beet, peeled and grated',
      '1 tsp ghee (or olive oil)',
      '1/2 tsp fresh ginger, grated',
      '1 tbsp unsweetened shredded coconut',
      '1 cup water',
      'Pinch of black pepper',
      'Sea salt, to taste',
    ],
    steps: [
      'Warm the ghee in a small pot over medium heat. Add the grated beet and ginger, and sauté 2-3 minutes.',
      'Add the water and shredded coconut. Bring to a boil, then reduce to a simmer.',
      'Cover and cook 15-18 minutes, until the beet is tender.',
      'Blend until smooth using an immersion blender or countertop blender (careful with hot liquid).',
      'Season with black pepper and salt. Serve warm.',
    ],
    gheeNote: true,
  },

  'cauliflower-steaks-tahini': {
    servings: 1,
    ingredients: [
      '2 thick cauliflower "steaks" (cut from the center of one head)',
      '1 tsp olive oil',
      '1/4 tsp garlic powder',
      '1/4 tsp cumin',
      'Sea salt, to taste',
      '1 tbsp tahini',
      '1 tsp olive oil (for the sauce)',
      '1 tsp apple cider vinegar',
      '1-2 tbsp water, to thin the sauce',
    ],
    steps: [
      'Preheat the oven to 425°F (220°C), or preheat a grill pan over medium-high heat.',
      'Brush the cauliflower steaks with olive oil and season with garlic powder, cumin, and salt.',
      'Roast (or grill) for 20-25 minutes, flipping once, until fully tender and browned on both sides.',
      'While the cauliflower cooks, whisk together the tahini, olive oil, apple cider vinegar, and enough water to make a pourable sauce. Season with a pinch of salt.',
      'Serve the cauliflower steaks warm, drizzled with the tahini sauce.',
    ],
    gheeNote: false,
  },

  'collard-greens-potato': {
    servings: 1,
    ingredients: [
      '1 small potato, peeled and diced',
      '1 tsp ghee (or olive oil)',
      '1/4 tsp turmeric',
      '1 1/2 cups collard greens, stemmed and chopped',
      'Squeeze of fresh lemon juice',
      '2-3 tbsp water',
      'Sea salt, to taste',
    ],
    steps: [
      'Warm the ghee in a skillet over medium heat. Add the potato and turmeric, stirring to coat.',
      'Add the water, cover, and cook 8-10 minutes, until the potato is nearly soft.',
      'Stir in the collard greens. Cover and cook 4-5 minutes more, until fully wilted and the potato is tender.',
      'Finish with a squeeze of lemon juice and season with salt. Serve warm.',
    ],
    gheeNote: true,
  },

  // ── Reintroduction add-ons ────────────────────────────────────────────
  'fish-or-chicken-reintro': {
    servings: 1,
    ingredients: [
      '4 oz white fish fillet or boneless chicken breast',
      '1/4 tsp turmeric',
      '1/4 tsp cumin',
      '1/4 tsp ground coriander',
      '1 tsp ghee (or olive oil)',
      'Sea salt, to taste',
      'Squeeze of lemon',
    ],
    steps: [
      'Preheat the oven to 375°F (190°C) if baking, or bring a small pot of water to a gentle simmer if poaching.',
      'Rub the fish or chicken with turmeric, cumin, coriander, and salt.',
      'To bake: place on a small baking dish with the ghee, and bake 12-15 minutes (fish) or 20-25 minutes (chicken), until cooked through.',
      'To poach (chicken): simmer gently in the seasoned water 15-18 minutes, until cooked through.',
      'Finish with a squeeze of lemon. Serve warm at lunch, with cooked vegetables on the side if you like.',
    ],
    gheeNote: true,
  },

  'gluten-reintro': {
    servings: 1,
    ingredients: [
      '1 small slice whole-grain bread, or a small serving of a simple wheat-based side',
      '1 tsp ghee or olive oil, for the bread, optional',
    ],
    steps: [
      'Toast or warm the bread lightly if you like.',
      'Spread with a thin layer of ghee or olive oil, if using.',
      'Serve alongside your lunch soup or main dish, in a modest portion — this is a reintroduction test, not a full-size side.',
    ],
    gheeNote: true,
  },

  // ── Warm drinks ───────────────────────────────────────────────────────
  'lemon-water-ccf-tea': {
    servings: 1,
    ingredients: [
      '1 cup hot water',
      '1/2 fresh lemon, juiced',
      '1/4 tsp cumin seeds',
      '1/4 tsp coriander seeds',
      '1/4 tsp fennel seeds',
      '1 1/2 cups water (for CCF tea)',
    ],
    steps: [
      'Hot lemon water: first thing on waking, stir the juice of half a lemon into a cup of hot (not boiling) water. Drink right away, before breakfast.',
      'CCF tea: combine the cumin, coriander, and fennel seeds with 1 1/2 cups water in a small pot.',
      'Bring to a boil, then reduce to a simmer and let steep 8-10 minutes.',
      'Strain into a cup and sip warm. CCF tea is good any time between meals, especially mid-morning or mid-afternoon.',
    ],
    gheeNote: false,
  },
};

export function getRecipeContent(id) {
  return RECIPES_CONTENT[id] || null;
}
