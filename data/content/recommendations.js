// Season engine — Northern Hemisphere, classical ayurvedic ritucharya
export function currentSeason() {
  const month = new Date().getMonth() + 1; // 1–12
  if (month >= 10 || month <= 1) {
    return {
      name: 'Vata Season',
      focus: 'Warmth, grounding, and nourishment',
      aggravates: 'vata',
    };
  }
  if (month >= 2 && month <= 5) {
    return {
      name: 'Kapha Season',
      focus: 'Lightness, movement, and stimulation',
      aggravates: 'kapha',
    };
  }
  return {
    name: 'Pitta Season',
    focus: 'Cooling, moderation, and surrender',
    aggravates: 'pitta',
  };
}

export const recommendations = {
  vata: {
    foods: {
      favor: [
        'Warm, oily, and well-spiced foods',
        'Root vegetables — sweet potato, beet, carrot',
        'Whole grains — rice, oats, wheat',
        'Warm milk with ghee and spices',
        'Ripe, sweet fruits — banana, mango, peach',
        'Mung dal and lentil soups',
        'Sesame oil, ghee, and olive oil',
      ],
      avoid: [
        'Cold, raw, and dry foods',
        'Bitter greens in large amounts',
        'Crackers, popcorn, and dry snacks',
        'Carbonated drinks',
        'Beans in large quantities (gas-forming)',
        'Iced water and cold beverages',
      ],
    },
    herbs: ['Ashwagandha', 'Shatavari', 'Ginger', 'Cardamom', 'Cinnamon', 'Licorice', 'Sesame', 'Ajwain'],
    meditation:
      'Sit in stillness for 10–15 minutes. Anchor awareness on the breath at the nostrils — its warmth, its rhythm. When the mind drifts, return slowly and without force. Let the body be heavy, rooted, safe.',
    lifestyle:
      'Establish a consistent daily rhythm — same wake, meal, and sleep times. Warm oil self-massage (abhyanga) with sesame oil before bathing nourishes the nervous system. Avoid overstimulation: loud music, screens late at night, and rushed meals. Gentle yoga and walking are ideal movement.',
  },
  pitta: {
    foods: {
      favor: [
        'Cool and mildly spiced foods',
        'Sweet, bitter, and astringent tastes',
        'Coconut water and coconut oil',
        'Cucumber, zucchini, and leafy greens',
        'Sweet fruits — melon, grapes, pear, pomegranate',
        'Basmati rice and barley',
        'Coriander, fennel, and mint',
      ],
      avoid: [
        'Very hot, spicy, or pungent foods',
        'Sour and fermented foods in excess',
        'Red meat and eggs',
        'Coffee and alcohol',
        'Nightshades — tomato, hot peppers',
        'Fried foods',
      ],
    },
    herbs: ['Brahmi', 'Shatavari', 'Coriander', 'Fennel', 'Neem', 'Amalaki', 'Mint', 'Rose'],
    meditation:
      'Sit comfortably and soften any efforting. For 10 minutes, breathe in through the nose and out through a slightly open mouth — releasing heat. Visualize cool moonlight resting on the crown of the head, pouring down through the body. Let go of fixing, controlling, or achieving.',
    lifestyle:
      'Protect yourself from overheating — avoid midday sun, hot baths, and competitive exercise in peak heat. Moonlit walks and swimming are ideal. Create space in your schedule for leisure without agenda. Practice non-judgment: notice when you grade yourself or others and consciously release it.',
  },
  kapha: {
    foods: {
      favor: [
        'Light, dry, and warming foods',
        'Pungent, bitter, and astringent tastes',
        'Leafy greens, cruciferous vegetables',
        'Legumes — chickpeas, lentils, black beans',
        'Light grains — millet, buckwheat, rye',
        'Ginger, black pepper, and turmeric',
        'Honey (raw, in moderation)',
      ],
      avoid: [
        'Heavy, oily, and cold foods',
        'Dairy in large amounts — especially cheese and yogurt',
        'Wheat, white rice, and heavy grains',
        'Sweet and salty foods in excess',
        'Iced drinks and refrigerated foods',
        'Red meat',
      ],
    },
    herbs: ['Trikatu', 'Ginger', 'Black Pepper', 'Turmeric', 'Guggulu', 'Cinnamon', 'Pippali', 'Tulsi'],
    meditation:
      'Choose an energizing breathing practice: 3 rounds of Kapalabhati (skull-shining breath) followed by 5 minutes of seated awareness. Focus on the energy rising in the body — the warmth of breath, aliveness of sensation. Break the pull toward heaviness with intention and presence.',
    lifestyle:
      'Rise before sunrise — kapha accumulates most in morning sleep. Vigorous daily exercise is essential: running, cycling, sun salutations with effort. Stimulate the senses with variety — new environments, new learning, spiced food. Dry brushing and invigorating scrubs in place of heavy oils. Travel and novelty are medicine.',
  },
};
