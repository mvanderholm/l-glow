// CONTENT NOTE: Body fields must come from Thea's voice memos. Do not fill from external sources.
// Pipeline: voice memo → Whisper transcription → adaptation → Thea review → remove DRAFT flag → ship.
// Approved entries: Agni, Ama (May 2026).
// All other `body` fields are null placeholders — do not fabricate content to fill them.

export const concepts = [
  // ─── Tier 1 — Essentials ────────────────────────────────────────────────────
  // Sequencing per Thea's request (transcript 26, June 2026):
  // What Is Ayurveda → Five Elements → Doshas → Prakriti/Vikriti → Agni → Ama → Food as Medicine
  {
    id: 'what-is-ayurveda',
    tier: 1,
    title: 'What Is Ayurveda?',
    sanskrit: 'Āyurveda',
    teaser: 'Five thousand years old, went underground, came back. Here\'s what it actually is.',
    // DRAFT — adapted from Thea's voice memo 20 (062126_01), June 2026. Awaiting her review before treating as final.
    body: `Long before wellness was a trend — before calories were counted, fitness apps, supplements, and self-help books — there was Ayurveda.\n\n5,000 years old, give or take. The mother of medicine. And like most mothers: pretty badass.\n\nHere's something most people don't know: Ayurveda disappeared for a while. Not because it stopped working. Because it worked so well that people wanted to protect it. As outside cultures collided with ancient ways of living, it went underground. Passed quietly from teacher to student. Family to family. Generation to generation. A secret so good they refused to let it die.\n\nThe word itself: Ayur means life. Veda means knowledge. Ayurveda is the knowledge of life. Not the study of disease. Not the study of symptoms. The study of you — your body, your mind, your energy, your habits, your story, your seasons.\n\nThe foundation: everything in nature is made of the same building blocks. The mountains, the oceans, the food on your plate, and you as a human — same stuff. When those elements are in balance, you feel it. Vibrant. Clear. Grounded. Energized. Connected.\n\nWhen they're not, you feel that too. Tired. Anxious. Overwhelmed. Stuck. Inflamed. Disconnected from yourself.\n\nThe big difference between Ayurveda and almost everything else: we don't ask what is wrong with you. We ask what is out of balance.\n\nAyurveda isn't about perfection. It's about freedom. Awareness. Becoming yourself — not an ideal version of someone else — and remembering who you've always been.\n\nHealth isn't just physical. It's mental, emotional, spiritual, social. Everything is connected. And every person requires something slightly different. What works for your best friend may not work for you. What worked last year may not be what you need today. You changed. The seasons changed. Life changed. Wellness should change with it.\n\nNothing is for everybody. Everything is for somebody. Including, it turns out, yourself.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'pancha-mahabhutas',
    tier: 1,
    title: 'The Five Elements',
    sanskrit: 'Pancha Mahabhutas',
    teaser: 'The building blocks of everything — including you.',
    // DRAFT — adapted from Thea's voice memo 26 (062126_07), June 2026. Awaiting her review before treating as final.
    body: `Everything in nature is made of the same stuff. The things that create mountains, rivers, sunlight, sky, and wind are the same things creating your mind, your body, your emotions, your habits, your strengths, and your struggles.\n\nThose building blocks are the five elements.\n\nEarth is the builder. In the body: bones, teeth, nails, hair, muscle, fat, skin. In the mind: stability, loyalty, commitment, patience. In spirit: safety, support, feeling at home. In nature: mountains, rocks, soil, trees, clay. If Earth had a voice: I've got this. Let's take it one step at a time. And firmly: I'm not going in there.\n\nOut of balance — too little Earth and you're scattered, unstable, unrooted. Too much and you're stuck, heavy, resistant, refusing to change.\n\nWater is the connector. In the body: blood, lymph, saliva, tears, reproductive fluid. In the mind: empathy, love, compassion. In spirit: trust, belonging, emotional intimacy. In nature: the ocean, rivers, lakes, morning dew. If Water had a voice: I care. I feel. We're in this together.\n\nOut of balance — too little Water is emotional shutdown and isolation. Too much is losing yourself in a relationship, or holding on to people who've already left.\n\nFire is the transformer. In the body: metabolism, digestion, vision, hormones, cellular energy. In the mind: intelligence, focus, ambition. In spirit: purpose, courage, passion. In nature: the sun, lightning, volcanoes. If Fire had a voice: Let's do it. We'll figure it out. What's next.\n\nOut of balance — too little Fire means low motivation, poor digestion, confusion. Too much is anger, burnout, and an inability to let anything go.\n\nAir is the mover. In the body: breath, the nervous system, circulation, elimination. In the mind: creativity, imagination, inspiration, curiosity. In spirit: freedom, possibility, expansion. In nature: wind, storms, pollination. If Air had a voice: What if. Let's try it. I have no idea.\n\nOut of balance — too little Air and you feel uninspired and stuck. Too much is anxiety, racing thoughts, and 84 browser tabs open at once.\n\nEther is the space holder — the hardest element to understand because you can't see it. It's the space that allows everything else to exist. In the body: sinuses, mouth, blood vessels, the digestive tract, the space between cells. In the mind: presence, observation, awareness. In spirit: intuition, stillness, connection to something larger. In nature: the sky, the universe, the silence. If Ether had a voice: something feels off. I can't explain it, but I trust it.\n\nOut of balance — too little Ether and you're overbooked, constantly stimulated, no room to breathe. Too much is disassociation — floating above your own life.\n\nThe secret most people miss: the elements aren't things. They're patterns. A tree is Earth (the trunk), Water (the sap), Fire (the sunlight), Air (the wind moving through it), and Ether (the space it grows in). You are no different. Your bones are Earth. Your blood is Water. Your metabolism is Fire. The air you breathe is Air. Your awareness is Ether.\n\nWe are not separate from nature. We are nature in a human body.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'doshas',
    tier: 1,
    title: 'The Doshas',
    sanskrit: 'Vata · Pitta · Kapha',
    teaser: 'The three forces that combine in unique proportions in every person.',
    // DRAFT — adapted from Thea's voice memo, May 2026. Awaiting her review before treating as final.
    body: `Every person is made of all three doshas — Vata, Pitta, and Kapha. The question isn't which one you are. It's which combination is dominant, and how that combination shifts with life, season, and circumstance.\n\nVata is wind. Movement, change, the nervous system's hum. When balanced: creativity, adaptability, lightness. When high: anxiety, dryness, scattered energy, a body that runs cold and a mind that won't slow down.\n\nPitta literally means cooking — the power of digestion, of making things ripen and mature. Pitta gives you intelligence, vitality, and courage. Mentally, it's your capacity to digest ideas, process emotions, and arrive at a clear perception of truth. Since raw fire can't exist in the body without burning it up, Pitta lives in oily and acidic secretions: bile, stomach acid, the heat of the blood. It's responsible for all transformation in the body, from the GI tract down to the cellular level. When it's low, decisions get harder and motivation stalls. When it's high, you're looking at inflammation, sharp temper, and intensity that tips into aggression.\n\nKapha is the container. Emotionally it gives you love, devotion, and steadiness. When balanced: grounded, loyal, genuinely caring. Cohesion — the mucus, the plasma, the connective tissue that holds everything together. Where Pitta is fire and Vata is air, Kapha is water held in earth. It lives in the chest, throat, and head, and in the fatty tissue and lymphatics through the rest of the body. When high: congestion, sluggishness, weight that doesn't want to move, and feelings that get stuck.\n\nNo person is one type only. You'll always have some combination of all three — the dominant one or two shape your type. Sometimes all three are roughly equal: that's tridoshic, and it comes with its own texture. The dosha quiz is a starting point, not a verdict. Think of it as learning your blueprint, not your destiny.`,
    attributedDate: 'May 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'prakriti-vikriti',
    tier: 1,
    title: 'Your Constitution',
    sanskrit: 'Prakriti & Vikriti',
    teaser: 'Your blueprint, and how life shifts you away from it.',
    // DRAFT — adapted from Thea's voice memo, May 2026. Awaiting her review before treating as final.
    body: `Prakriti is the constitution you were born with — the specific ratio of Vata, Pitta, and Kapha that is native to you. It's not a rigid box. It's more like a blueprint. Some people have one clear dominant dosha. Others are dual-doshic, with two roughly equal. Some are tridoshic — relatively balanced across all three.\n\nVikriti is where you are right now — how life, stress, season, food, sleep, and circumstance have shifted things away from that original blueprint.\n\nThe two are usually not the same. A Vata-Pitta by birth might be running high Kapha right now after a sedentary winter or a grief season or a job that demands stillness. That's not wrong — it's information. The daily check-in tracks vikriti. The quiz gives you a window into prakriti. The work is always about finding your way back home.`,
    attributedDate: 'May 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'agni',
    tier: 1,
    title: 'Digestive Fire',
    sanskrit: 'Agni',
    teaser: 'The force that transforms what you take in — food, experience, emotion.',
    // DRAFT — expanded from Thea's voice memo 21 (062126_02), June 2026. Supersedes April 2026 version. Awaiting her review before treating as final.
    body: `Agni is the fire behind everything. Literally — Agni means fire. Not the kind that burns wood, but the kind that transforms. The force that turns food into energy, experience into wisdom, and challenges into growth.\n\nThink of it as your ability to process life.\n\nIn the body, Agni lives as digestive fire — metabolism, heat, the intelligence that knows what to absorb and what to let go. In the mind, Agni is clarity: the capacity to actually move through something, understand it, and release it. When mental Agni is strong, you process your day. When it dims, things pile up.\n\nThey're connected. Anything you're carrying mentally — check the body. The body is keeping score.\n\nAlmost every imbalance in Ayurveda begins with a disruption in Agni. Not because the body is failing — because the rate of transformation has slowed. Things stop moving. Food doesn't get fully digested. Emotions linger. Energy gets stuck. Ama starts to accumulate.\n\nAgni has four personalities:\n\nSama Agni is the sweet spot — balanced fire. Regular hunger, comfortable digestion, steady energy, regular elimination. Things are flowing. Not perfect. Just aligned.\n\nVishama Agni is the unpredictable fire, associated with Vata. One day you're starving, the next you have no appetite. Gas, bloating, constipation, energy that swings from too high to too low. Your fire keeps getting blown around by the wind.\n\nTikshna Agni is the intense fire, associated with Pitta. Digestion is powerful — almost too powerful. Constant hunger, irritability when meals are delayed, acid reflux, loose stools, inflammation. The fire is burning through fuel faster than it should.\n\nManda Agni is the slow fire, associated with Kapha. Digestion is sluggish. Heaviness after meals, fatigue, congestion, that feeling of stuckness. The fire is covered by too much dampness.\n\nThe Agni and Ama cycle: when Agni is weak, food doesn't get fully digested. Ama builds. Ama blocks the body's natural intelligence. Digestion weakens further. More Ama forms. The cycle feeds itself. This is why Ayurveda almost always starts with strengthening digestion first — tend the fire, clear the ama, then go deeper.\n\nSigns your Agni needs support: bloating, brain fog, low energy, cravings you can't explain, inconsistent appetite, feeling heavy after meals, frequent illness, lack of motivation, feeling disconnected from yourself.\n\nStrong Agni isn't built through restriction. It's built through rhythm. Eating when you're actually hungry. A few deep breaths before meals. Warm, cooked foods when digestion is weak. Eating without multitasking. Honoring sleep. Moving daily. Processing emotions instead of storing them.\n\nA question worth sitting with: what in life am I struggling to digest right now? Maybe it's food. Maybe it's stress. Maybe it's grief. Maybe it's change.\n\nHealing doesn't start when life gets easier. It starts when you strengthen your ability to process what life brings.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'ama',
    tier: 1,
    title: 'Toxic Accumulation',
    sanskrit: 'Ama',
    teaser: 'What builds up when digestion is incomplete.',
    body: `Ama is what accumulates when agni can't keep up. Undigested food. Undigested experience. Undigested emotion. Same mechanism, different substance.\n\nIts texture: heavy, cold, slimy, dense. It has a lot of kapha in it — that sticky, damp, impeding quality. And while it looks like kapha, ama mixes with all three doshas and changes how each one behaves. Vata, normally dry and light, becomes heavy and damp when ama is in the mix. Pitta, normally hot and sharp, becomes cooler and sluggish. Kapha, already slow, can become completely stuck.\n\nOne of the cleanest ways to check for ama: your tongue first thing in the morning, before eating or drinking anything. Scrape front to back — a spoon works fine if you don't have a tongue scraper. What comes off is ama. That coating is your body's morning report.\n\nAma is also a mental and emotional phenomenon. Negative emotions carry the same qualities — dark, damp, heavy, sticky. They dim mental agni, and when mental agni dims, physical agni follows. The check-in question "what are you carrying that hasn't been processed yet?" is the ama question. The body holds what the mind hasn't metabolized.\n\nTreatment always starts with clearing ama before going after the dosha directly. You can't clean the plate in the dishwasher if the food is still stuck to it — you have to rinse first. Once the body is clear, the deeper work becomes possible.`,
    attributedDate: 'April 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'food-as-medicine',
    tier: 1,
    title: 'Food as Medicine',
    sanskrit: 'Āhāra',
    teaser: 'The question everyone wants answered — and why "it depends" is actually the most useful answer.',
    // DRAFT — adapted from Thea's voice memo 22 (062126_03), June 2026. Awaiting her review before treating as final.
    body: `The question everyone wants answered first: what should I eat?\n\nHonest answer: it depends.\n\nNot on the latest study. Not on what your friend is doing. Not on anyone trying to sell you something. It depends on you. And while that might feel like a non-answer — you came here wanting a list — it's actually the most liberating thing Ayurveda can offer.\n\nFood is medicine. It can also be poison. Sometimes it's both, for different people, in different seasons. The same food that nourishes one person creates imbalance for another. The same meal that works for you in winter feels overwhelming in summer. Smoothies that felt amazing at 25 might leave you exhausted at 45. Not because something went wrong. Because you changed.\n\nThere is no perfect diet. There's only the one that works for you right now.\n\nBefore any recommendation, Ayurveda asks eight things:\n\nWho are you? Your constitution — Vata, Pitta, Kapha, or some combination — is the starting point. What nourishes one will aggravate another.\n\nHow was it prepared? A carrot isn't just a carrot. Raw, roasted, steamed, juiced, in a soup — preparation changes how the body experiences food entirely. Same ingredient, different medicine.\n\nWhat is it combined with? Some foods work beautifully together. Others create digestive confusion. Herbs with beans, spices with vegetables. The goal is making digestion easier, not perfect.\n\nHow much? Even good food becomes poison in excess. Ayurveda teaches: fill the stomach one-third with food, one-third with liquid, leave one-third as space. Cup your hands together — that's roughly the size of your stomach. That's your portion guide.\n\nWhere did it come from? Local, seasonal food has adapted to the same environment you're in. Your body recognizes it. That's not poetry — it's practical.\n\nWhen are you eating? Digestion is strongest at midday, roughly 10am to 2pm. That's when your biggest meal belongs. Lighter in the evening. Many people spend years obsessing over what they eat, when changing when they eat is what actually creates the breakthrough.\n\nWho are you today? Not your constitution — your current state. Stressed, exhausted, energized, grieving, recovering. The food you need today may differ from what you needed last week.\n\nWhat season are you in? Watermelon shows up in summer. Root vegetables in winter. Nature already knows what's needed. Eating in relationship with nature, rather than against it, is one of the simplest ways to stay in balance.\n\nWhen and how you eat is almost more important than what you eat. That's not a disclaimer. That's the whole point.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },

  // ─── Tier 2 — Deepening ─────────────────────────────────────────────────────
  {
    id: 'shad-rasa',
    tier: 2,
    title: 'The Six Tastes',
    sanskrit: 'Shad Rasa',
    teaser: 'The language underneath every food recommendation.',
    body: null,
    attributedDate: null,
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'gunas-qualitative',
    tier: 2,
    title: 'Qualities of Matter',
    sanskrit: 'Gunas (qualitative)',
    teaser: 'Hot/cold, heavy/light, dry/oily — the vocabulary of like increases like.',
    // DRAFT — adapted from Thea's voice memo 16 (gunas_quality_and_quiz), June 2026. Awaiting her review before treating as final.
    body: `The three mental Gunas — Sattva, Rajas, Tamas — give us the bigger picture. But Ayurveda also identifies twenty physical qualities in the world around us, organized into ten opposing pairs. These are the vocabulary of everything.\n\nThe ten pairs:\nHeavy · Light\nSlow · Sharp\nCold · Hot\nOily · Dry\nSmooth · Rough\nDense · Liquid\nSoft · Hard\nStable · Mobile\nGross · Subtle\nCloudy · Clear\n\nEach element has its own cluster of qualities. Ether and Air — the elements of Vata — are dry, light, cold, rough, subtle, mobile, and clear. Fire — the element that dominates Pitta — is hot, sharp, light, oily, liquid, and spreading. Earth and Water — the elements of Kapha — are heavy, slow, cool, oily, smooth, dense, soft, stable, and cloudy.\n\nThis is where "like increases like, opposites bring balance" becomes practical.\n\nIf you are feeling anxious, scattered, ungrounded — those qualities are light, mobile, subtle, dry. What do you need to bring in? Heavy, stable, warm, oily qualities. If you are feeling inflamed, irritated, overheated — hot and sharp. You need cool, soft, and calm. If you are feeling stuck, sluggish, unmotivated — heavy, slow, dense. Bring in lightness, mobility, and sharpness.\n\nYou don't need a practitioner to tell you which dosha is elevated. The qualities will tell you, if you know how to read them. Feeling light and busy and dry and scattered? That's elevated Vata in its language. Feeling heavy and slow and dense and foggy? That's elevated Kapha. The qualities are a simpler diagnostic than the doshas — and often more honest.\n\nThink of it like honey. Honey is sticky. So if honey-like qualities are showing up — thick, slow, viscous — ask what is the opposite of sticky? Bring that in. If things feel cold, bring warmth. If things feel dry, bring oiliness. This is the whole practice, in miniature.\n\nThe twenty qualities are one of the most practical tools in Ayurveda because they're easier to feel than doshas. You don't always know whether your Vata is elevated. But you almost always know whether you feel dry or oily, light or heavy, clear or cloudy. Start there.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'gunas-mental',
    tier: 2,
    title: 'Qualities of Mind',
    sanskrit: 'Sattva · Rajas · Tamas',
    teaser: 'The three mental forces and how they shape clarity, drive, and inertia.',
    // DRAFT — adapted from Thea's voice memo 15 (gunas_mental), June 2026. Awaiting her review before treating as final.
    body: `The word Guna comes from Sanskrit — Guna means qualities, and Isha means the lord or power of. The power of qualities. Everything has a quality. A thin silk sheet and a twenty-pound weighted blanket are both blankets. But they are not the same. That difference — light versus heavy — is the quality. That is a Guna.\n\nGunas affect how we experience reality. As we move through life, we become more and more attracted to our particular Gunas — the qualities we've learned we like. And because every person experiences qualities differently, what feels like medicine to one person feels unbearable to another. This is the heart of "everything is for somebody, nothing is for everybody."\n\nOutside of the physical, there are three mental Gunas: Sattva, Rajas, and Tamas.\n\nImagine a still lake at night. No wind, no rain. The moon is full and because the water is perfectly quiet, it shines down and forms a perfect circle on the surface. You look at the lake and you see the moon clearly. That is Sattva — clarity.\n\nThen the wind picks up. You get a job, you have kids, you have bills. The storm comes in. These waves start to trickle across the water. The moon is still there — still shining — but you can't see the circle anymore. Just light on the water, broken and moving. This is Rajas — change, emotion, passion, chaos. It shakes things up.\n\nThen there are those days where there is so much rain, so much sediment, that the mud builds and builds. The storm stops, but the water is just dark. There is no movement, but there is no clarity either. You can't see the moon at all. This is Tamas.\n\nNone of these is bad. Each has a superpower.\n\nTamas: seeds grow in dark soil. Babies grow in darkness. A womb is dark. That heavy, grounding quality is what holds the house up. Tamas is the superpower of rootedness.\n\nRajas: fire burns things down to begin again. It is change, passion, blood, transformation. It has the capacity to transmute. The superpower of Rajas is movement.\n\nSattva: clarity and light. The ability to see things as they are.\n\nBut without shadows, there are no superpowers either. Rajas in excess means you're always transforming — the house is always moving and nothing can take root. Sattva in excess tips into spiritual perfectionism: sitting with a group of people and thinking, quietly, that you know better. Tamas in excess is the fog — the I don't know, I don't know. You're stuck. Underneath there, you have no idea what is going on.\n\nGunas are not good or bad. They are information about what is happening — in the moment, in the mind, in your life.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'cultivating-sattva',
    tier: 2,
    title: 'Cultivating Sattva',
    sanskrit: 'Sattva',
    teaser: 'How practice, food, and attention move you toward clarity and healing.',
    // DRAFT — adapted from Thea's voice memos 07, 08. Awaiting her review before treating as final.
    body: `Sattva isn't a destination you arrive at. It's a direction you keep moving in.\n\nYoga and Ayurveda both say the same thing: develop sattva first, then transcend it. You can't skip the development stage. If the mind isn't reasonably clear — if the body is carrying significant ama, if the emotions are running the show — then reaching for higher states is premature. Clean the vessel before you ask it to hold something new.\n\nSattva builds through: food that's nourishing and clean, physical practices that clear the body, managing what you take in through the senses (what you watch, read, listen to — all of it registers), stilling the mind, mantra, and genuine devotion to something larger than your own desires.\n\nWhat does sattvic look like in practice? Rarely angry. Rarely afraid. Little desire for more. Modest. Forgiving — easily, not with effort. Concentrated. Honest. At peace most of the time. Creative. Drawn to service.\n\nMost people live predominantly in rajas — active, changeable, doing. That's not a failure. That's the starting point. The movement from rajas toward sattva is the whole game. And the higher rajasic force — the kind that's pointed upward, toward healing and growth rather than outward toward accumulation — is what makes that movement possible. You need energy to purify. The question is where it's aimed.\n\nA tamasic state — depression, chronic heaviness, inability to move — needs rajas first, not sattva. You can't leap from the basement to the roof. The path is always tamas → rajas → sattva.`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'ojas',
    tier: 2,
    title: 'Vital Essence',
    sanskrit: 'Ojas · Tejas · Prana',
    teaser: 'The three vital essences — your reserves of endurance, radiance, and life force.',
    // DRAFT — adapted from Thea's voice memo 09. Awaiting her review before treating as final.
    body: `There are three vital essences underlying all health and spiritual capacity. They're interrelated — you can't have one without the others.\n\nOjas is your reserve. The stored vitality underneath everything. It's the refined end product of good digestion — of food, yes, but also of experience. When ojas is full, you feel grounded, resilient, and genuinely at peace. When it's depleted, everything is harder: concentration, immunity, endurance, the quiet confidence that lets you stay on the path. Ojas is subtle water — nourishing, cooling, stabilising.\n\nTejas is your inner fire. Not the external heat of fever, but the clear radiance that digests impressions and thoughts, that gives you courage, insight, and the willpower to act. Tejas is what transforms ojas into energy. It's the quality that shows up as genuine courage — not bravado, but the kind of steady clarity that lets you make a hard call without second-guessing it for a week.\n\nPrana is life force. The breath-force that coordinates everything — movement, sensation, the flow of intelligence through the nervous system. At its subtlest, prana governs the unfolding of consciousness itself. Enthusiasm, creativity, the sense that you are genuinely alive — these are signs of strong prana.\n\nAll three are purified forms of the doshas. Ojas is refined kapha. Tejas is refined pitta. Prana is refined vata. When the doshas are in balance and digestion is strong, they naturally refine into these three essences. When the doshas are aggravated or agni is weak, the essences deplete.\n\nPractice develops all three together. The goal isn't to maximize one at the expense of another — that creates its own imbalance. You want them growing at roughly the same pace. When they do, you have the patience to stay on the path (ojas), the insight to know which direction that is (tejas), and the energy to actually walk it (prana).`,
    attributedDate: 'June 2026',
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'dinacharya-ritucharya',
    tier: 2,
    title: 'Daily & Seasonal Rhythms',
    sanskrit: 'Dinacharya & Ritucharya',
    teaser: 'Why the clock and the calendar both matter to your practice.',
    body: null,
    attributedDate: null,
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },

  // ─── Tier 3 — Advanced (Thea's call on whether these belong in a consumer app) ──
  {
    id: 'sapta-dhatus',
    tier: 3,
    title: 'The Seven Tissues',
    sanskrit: 'Sapta Dhatus',
    teaser: 'The seven layers of tissue that nutrition builds, in sequence.',
    body: null,
    attributedDate: null,
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'tri-malas',
    tier: 3,
    title: 'The Three Waste Products',
    sanskrit: 'Tri Malas',
    teaser: 'Sweat, urine, and stool as diagnostic signals, not just byproducts.',
    body: null,
    attributedDate: null,
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
  {
    id: 'srotas',
    tier: 3,
    title: 'The Channel Systems',
    sanskrit: 'Srotas',
    teaser: 'The pathways through which everything flows in the body.',
    body: null,
    attributedDate: null,
    matrix: {
      physical:  { lifestyle: null, diet: null, exercises: null, herbs: null },
      mental:    { lifestyle: null, diet: null, exercises: null, herbs: null },
      emotional: { lifestyle: null, diet: null, exercises: null, herbs: null },
      spiritual: { lifestyle: null, diet: null, exercises: null, herbs: null },
    },
  },
];

export const tierLabels = {
  1: 'Essentials',
  2: 'Deepening',
  3: 'Advanced',
};
