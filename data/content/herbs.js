// Classical ayurvedic herb and spice reference
// Properties drawn from the classical tradition (rasa, virya, vipaka, prabhava)
//
// SCHEMA NOTE: Sage (below) introduces a `prabhav` field — the herb's special power or
// inexplicable magic action. Not all herbs have a prabhav worth calling out; add it only
// when Thea names one. The herb modal UI needs a new section to render this field — flagged.

export const herbs = {
  Ashwagandha: {
    latin: 'Withania somnifera',
    taste: ['bitter', 'astringent', 'sweet'],
    potency: 'warming',
    balances: ['vata', 'kapha'],
    aggravates: ['pitta'],
    summary:
      'One of ayurveda\'s most revered rasayanas (rejuvenating tonics). Strengthens the nervous system, builds ojas (vital essence), and supports resilience to stress and fatigue. Grounding and deeply nourishing.',
    use: 'Mix ¼–½ tsp powder into warm milk with a little ghee and honey before bed. Best taken consistently over several weeks.',
  },
  Shatavari: {
    latin: 'Asparagus racemosus',
    taste: ['sweet', 'bitter'],
    potency: 'cooling',
    balances: ['vata', 'pitta'],
    aggravates: ['kapha'],
    summary:
      'The primary female tonic in ayurveda. Deeply hydrating and cooling, it nourishes reproductive tissue, supports the mucous membranes, and builds ojas. Soothing to both body and emotions.',
    use: 'Mix ¼–½ tsp powder into warm milk. Can be combined with ashwagandha for a balanced vata-pitta tonic.',
  },
  Ginger: {
    latin: 'Zingiber officinale',
    taste: ['pungent'],
    potency: 'warming',
    balances: ['vata', 'kapha'],
    aggravates: ['pitta'],
    summary:
      'Called vishwabhesaj — the universal medicine. Kindles agni (digestive fire), clears ama (toxins), relieves nausea, and warms cold and damp conditions. Fresh ginger is milder; dried ginger is more heating.',
    use: 'Fresh slices with a pinch of salt before meals to kindle agni. Dried ginger in chai, soups, and spice blends. Ginger tea for colds and sluggish digestion.',
  },
  Cardamom: {
    latin: 'Elettaria cardamomum',
    taste: ['pungent', 'sweet'],
    potency: 'cooling',
    balances: ['vata', 'pitta', 'kapha'],
    aggravates: [],
    summary:
      'One of the few pungent spices that is simultaneously cooling — making it tridoshic and widely usable. Relieves gas and bloating, freshens breath, supports respiratory health, and adds a sattvic quality to food.',
    use: 'Add 2–3 pods to chai or rice dishes. Chew a pod after meals. Use freely in desserts and warm drinks.',
  },
  Cinnamon: {
    latin: 'Cinnamomum zeylanicum',
    taste: ['pungent', 'sweet', 'astringent'],
    potency: 'warming',
    balances: ['vata', 'kapha'],
    aggravates: ['pitta'],
    summary:
      'Warming and circulatory, cinnamon improves peripheral circulation, kindles digestion, and supports blood sugar regulation. Particularly effective in cold, damp kapha conditions.',
    use: 'In chai, warm milk, oatmeal, and baked goods. A pinch with honey in warm water in the morning is a classic kapha-reducing practice.',
  },
  Licorice: {
    latin: 'Glycyrrhiza glabra',
    taste: ['sweet'],
    potency: 'cooling',
    balances: ['vata', 'pitta'],
    aggravates: ['kapha'],
    summary:
      'Deeply soothing, licorice coats and heals the mucous membranes of the digestive and respiratory tracts. A natural harmonizer — it softens the action of stronger herbs in compound formulas.',
    use: 'As tea or ¼ tsp powder in warm water. Use moderately and avoid in hypertension or edema, as excess can elevate blood pressure.',
  },
  Sesame: {
    latin: 'Sesamum indicum',
    taste: ['sweet', 'bitter', 'astringent'],
    potency: 'warming',
    balances: ['vata'],
    aggravates: ['pitta', 'kapha'],
    summary:
      'Deeply nourishing and warming, sesame builds strength and lubricates the tissues. Sesame oil is the primary vehicle for abhyanga (self-massage) — it penetrates deeply, warms the nerves, and grounds vata.',
    use: 'Sesame oil for daily abhyanga before bathing. Toasted seeds on grains and soups. Til laddus (sesame balls with jaggery) as a vata-balancing sweet.',
  },
  Ajwain: {
    latin: 'Trachyspermum ammi',
    taste: ['pungent', 'bitter'],
    potency: 'heating',
    balances: ['vata', 'kapha'],
    aggravates: ['pitta'],
    summary:
      'Sharp and penetrating, ajwain (carom) is among the most effective carminatives in the ayurvedic kitchen. Rapidly clears gas, bloating, and abdominal cramping, especially in vata-type digestive distress.',
    use: 'Toast a pinch in ghee as a tadka for dal or vegetables. Steep ½ tsp in hot water as a digestive tea. Use sparingly due to its intensity.',
  },
  Brahmi: {
    latin: 'Bacopa monnieri',
    taste: ['bitter', 'astringent', 'sweet'],
    potency: 'cooling',
    balances: ['pitta', 'vata'],
    aggravates: ['kapha'],
    summary:
      'The primary medhya (intellect-promoting) herb of ayurveda. Brahmi cools the mind, improves memory and concentration, and calms pitta-driven anxiety, irritability, and excess mental activity.',
    use: 'Mix ¼ tsp into warm milk or ghee. Apply brahmi-infused oil to the scalp and soles of the feet before sleep to calm the nervous system.',
  },
  Coriander: {
    latin: 'Coriandrum sativum',
    taste: ['sweet', 'astringent'],
    potency: 'cooling',
    balances: ['vata', 'pitta', 'kapha'],
    aggravates: [],
    summary:
      'Tridoshic and gently cooling, coriander relieves heat and inflammation in the digestive tract without dampening agni. Both seeds and fresh leaf (cilantro) are widely used in ayurvedic cooking.',
    use: 'Seeds steeped in hot water as a cooling digestive tea. Fresh cilantro in chutneys and cooling condiments. Dry-roasted seeds in spice blends.',
  },
  Fennel: {
    latin: 'Foeniculum vulgare',
    taste: ['sweet', 'pungent'],
    potency: 'cooling',
    balances: ['vata', 'pitta', 'kapha'],
    aggravates: [],
    summary:
      'Cooling yet carminative — fennel is tridoshic and among the safest digestive herbs. Relieves gas, cramping, and nausea while gently stimulating digestion. Refreshing and subtly sweet.',
    use: 'Chew ½ tsp seeds after meals. Steep as a digestive tea. Combine with coriander and cumin for a classic tridoshic digestive blend (CCF tea).',
  },
  Neem: {
    latin: 'Azadirachta indica',
    taste: ['bitter'],
    potency: 'cooling',
    balances: ['pitta', 'kapha'],
    aggravates: ['vata'],
    summary:
      'Among the most bitter herbs in ayurveda. Cools pitta-driven inflammation, purifies the blood, and clears heat and toxicity from the skin, liver, and digestive tract. Powerful antimicrobial properties.',
    use: 'Small amounts of leaf powder with honey. Neem is intense — use for specific therapeutic purposes rather than daily use. Widely used topically for skin conditions.',
  },
  Amalaki: {
    latin: 'Phyllanthus emblica',
    taste: ['sour', 'sweet', 'bitter', 'astringent', 'pungent'],
    potency: 'cooling',
    balances: ['vata', 'pitta', 'kapha'],
    aggravates: [],
    summary:
      'The most important single herb in ayurveda. Contains all six tastes except salty. The richest natural source of vitamin C. Builds ojas, cools pitta, rejuvenates all tissues, and is the central ingredient in both triphala and chyawanprash.',
    use: 'As churna (powder) with honey, as amla juice, or as part of triphala at bedtime. Daily use as a rasayana is traditionally encouraged for all constitutions.',
  },
  Mint: {
    latin: 'Mentha spicata',
    taste: ['pungent', 'sweet'],
    potency: 'cooling',
    balances: ['pitta', 'kapha'],
    aggravates: ['vata'],
    summary:
      'Fresh and cooling, mint is ideal for pitta in summer months. Relieves heat-driven headaches, nausea, and digestive inflammation. Light and stimulating for kapha. Best used fresh.',
    use: 'Fresh in chutneys, raitas, and cooling drinks. As tea in hot weather. Avoid regular excess use for vata types, particularly in autumn and winter.',
  },
  Rose: {
    latin: 'Rosa damascena',
    taste: ['sweet', 'astringent', 'bitter'],
    potency: 'cooling',
    balances: ['pitta', 'vata'],
    aggravates: ['kapha'],
    summary:
      'Rose cools and nourishes the heart — both physical and emotional. Calms pitta-driven heat, anger, and irritability. Opens the heart center, soothes the mind, and is considered deeply sattvic in the ayurvedic tradition.',
    use: 'Rose water in drinks and desserts. Dried petals as tea. Gulkand (rose petal preserve with sugar or honey) is a classical pitta tonic — a teaspoon daily in summer.',
  },
  Trikatu: {
    latin: 'Ginger · Black Pepper · Pippali blend',
    taste: ['pungent'],
    potency: 'heating',
    balances: ['kapha', 'vata'],
    aggravates: ['pitta'],
    summary:
      'A classical compound of three pungent herbs — dried ginger, black pepper, and long pepper (pippali). Powerfully kindles agni, burns ama, and clears kapha accumulation from the respiratory and digestive tracts.',
    use: 'Mix ¼ tsp with honey before meals to stimulate digestion. Use with caution and avoid if there is active pitta aggravation, heartburn, or inflammation.',
  },
  'Black Pepper': {
    latin: 'Piper nigrum',
    taste: ['pungent'],
    potency: 'heating',
    balances: ['kapha', 'vata'],
    aggravates: ['pitta'],
    summary:
      'Sharp, penetrating, and one of the strongest digestive stimulants. Notably enhances the bioavailability of turmeric (curcumin) many-fold. Clears kapha from the lungs and digestive system.',
    use: 'Freshly ground on food. Always use with turmeric and a fat (ghee, coconut oil) for maximum benefit. Small quantities in chai and spice blends.',
  },
  Turmeric: {
    latin: 'Curcuma longa',
    taste: ['bitter', 'astringent', 'pungent'],
    potency: 'warming',
    balances: ['vata', 'pitta', 'kapha'],
    aggravates: [],
    summary:
      'The golden herb of ayurveda. Reduces inflammation, purifies blood, supports liver and skin health, and is antimicrobial. Combines fat and black pepper for dramatically increased absorption of curcumin.',
    use: 'Golden milk — warm milk with ¼ tsp turmeric, a pinch of black pepper, and ghee. In cooking with fat. A pinch in most savory dishes. Daily use is encouraged.',
  },
  Guggulu: {
    latin: 'Commiphora mukul',
    taste: ['bitter', 'astringent', 'pungent', 'sweet'],
    potency: 'warming',
    balances: ['kapha', 'vata'],
    aggravates: ['pitta'],
    summary:
      'A resin from the mukul myrrh tree. Among the most effective herbs for clearing excess kapha from channels and tissues — used in classical formulas for joints, circulation, and metabolic support.',
    use: 'Best taken as a classical preparation such as Triphala Guggulu or Kanchnar Guggulu. Seek guidance from a practitioner for therapeutic use.',
  },
  Pippali: {
    latin: 'Piper longum',
    taste: ['pungent'],
    potency: 'warming',
    balances: ['vata', 'kapha'],
    aggravates: ['pitta'],
    summary:
      'Long pepper is the most sattvic of the three pungent herbs. It has the unique quality of being initially heating but building ojas and rejuvenating with sustained use. Highly effective for respiratory conditions and deep tissue penetration.',
    use: 'A small pinch in chai or warm milk. Part of trikatu. Traditionally combined with honey as an anupana (carrier). Use in small amounts — it is potent.',
  },
  // Source: Thea voice memo, April 2026. Reviewed and adapted — awaiting her sign-off.
  Sage: {
    latin: 'Salvia officinalis',
    taste: ['pungent', 'bitter', 'astringent'],
    potency: 'warming',
    balances: ['kapha', 'vata'],
    aggravates: ['pitta'],
    prabhav:
      'Clears emotional obstructions from the mind. Promotes calmness and clarity, reduces excess desires and attachments, and calms the heart — the magic no one has fully explained.',
    summary:
      'Sage\'s defining action is drying: it reduces excess secretions throughout the body — night sweats, respiratory congestion, excess salivation. It decreases both kapha and vata, but its warming potency means pitta types should use it carefully, especially in quantity. What\'s interesting about sage is that it works in two directions at once: it can be stimulating and activating for kapha, while simultaneously grounding for vata — meaning it can both move stagnant energy and settle a scattered mind. Strong ally for perimenopause (particularly night sweats and hair loss), nervous dysfunction, colds, sore throat, and swollen glands. Works on blood, plasma, and nerve tissue, with affinity for the respiratory, digestive, nervous, and circulatory systems. Combines well with gotu kola.',
    use: 'As a hot infusion to reduce kapha: colds, congestion, swollen glands, night sweats. As a cool infusion for cough or to enhance brain and nervous system clarity. Use aromatically — burned, diffused, or as steam — for respiratory clearing and energetic clearing of a space; also useful in the room (not taken internally) for pregnancy-related excess salivation. Gargle a warm sage infusion for sore throat. Apply as a wash to sores or slow-healing wounds. Caution: avoid internal use for nursing mothers — the drying action reduces milk. Use with care in very high vata states with excess dryness, as it will amplify dryness. Not for excess pitta.',
  },
  Tulsi: {
    latin: 'Ocimum sanctum',
    taste: ['pungent', 'bitter'],
    potency: 'warming',
    balances: ['vata', 'kapha'],
    aggravates: ['pitta'],
    summary:
      'Sacred to Vishnu and revered throughout the Indian tradition. Uplifting, purifying, and immunomodulating — tulsi strengthens immunity, opens respiratory channels, elevates sattva (mental clarity), and supports the heart.',
    use: 'Fresh leaves first thing in the morning. As tea throughout the day. In chai. Daily use is encouraged — growing a tulsi plant at home is a traditional ayurvedic household practice.',
  },
};

export const tasteColors = {
  sweet: '#7A9E7E',
  sour: '#C4A44A',
  salty: '#4A8FA8',
  pungent: '#C4603A',
  bitter: '#8B7BA8',
  astringent: '#7A6A5A',
};
