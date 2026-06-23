// Source: transcript 16 (gunas_quality_and_quiz). Thea's questions verbatim.
// Left column = Sattva (A), middle = Rajas (B), right = Tamas (C).
// Result copy in gunaResults below is draft — Thea to review before launch.

export const gunaQuestions = [
  {
    id: 'diet',
    prompt: 'My diet is...',
    options: [
      { label: 'Strictly vegetarian, organic and locally sourced where possible', guna: 'sattva' },
      { label: 'Pretty clean — but I sometimes enjoy meat, comfort foods, or the occasional processed food', guna: 'rajas' },
      { label: 'Meat, and I\'ll pair it with chips, fries, and other processed and comfort foods', guna: 'tamas' },
    ],
  },
  {
    id: 'alcohol',
    prompt: 'When it comes to alcoholic beverages...',
    options: [
      { label: 'I never drink',      guna: 'sattva' },
      { label: 'I drink sometimes',  guna: 'rajas'  },
      { label: 'Almost daily',       guna: 'tamas'  },
    ],
  },
  {
    id: 'intimacy',
    prompt: 'I would consider my desire for intimacy or sex to be...',
    options: [
      { label: 'Low — I\'m not really feeling drawn to it these days', guna: 'sattva' },
      { label: 'Pretty average',                                        guna: 'rajas'  },
      { label: 'Everyday — maybe even more than once',                  guna: 'tamas'  },
    ],
  },
  {
    id: 'impulse',
    prompt: 'When I crave something but know it isn\'t what I need in the moment, my ability to stay the course is...',
    options: [
      { label: 'Good — I have amazing willpower',                              guna: 'sattva' },
      { label: 'Okay — I do a pretty good job making healthy decisions for myself', guna: 'rajas' },
      { label: 'I\'ll try again next time',                                    guna: 'tamas'  },
    ],
  },
  {
    id: 'speech',
    prompt: 'Others would describe the way I speak as...',
    options: [
      { label: 'Angelic, soft, and smooth',                guna: 'sattva' },
      { label: 'A little overwhelming — it can be agitating', guna: 'rajas' },
      { label: 'Lacking some oomph — kind of melancholy',  guna: 'tamas'  },
    ],
  },
  {
    id: 'cleanliness',
    prompt: 'When it comes to cleanliness...',
    options: [
      { label: 'Next to godly — I keep my house, my workspace, and myself clean. It\'s a priority.', guna: 'sattva' },
      { label: 'I do a pretty good job and manage to keep up with my space',                          guna: 'rajas'  },
      { label: 'Honestly not important to me — I\'m very busy and have a lot of other things to do', guna: 'tamas'  },
    ],
  },
  {
    id: 'work',
    prompt: 'I would define my work as...',
    options: [
      { label: 'A benefit to others',                                                    guna: 'sattva' },
      { label: 'Being successful and getting that promotion',                             guna: 'rajas'  },
      { label: 'I could do a little more, but I prefer to do the bare minimum until I can retire', guna: 'tamas' },
    ],
  },
  {
    id: 'anger',
    prompt: 'Things that rile me up — I find myself getting angry...',
    options: [
      { label: 'Rarely',            guna: 'sattva' },
      { label: 'Every once in a while', guna: 'rajas' },
      { label: 'Quite frequently',  guna: 'tamas'  },
    ],
  },
  {
    id: 'melancholy',
    prompt: 'I find myself feeling down or melancholy...',
    options: [
      { label: 'Never — I\'m really pretty content', guna: 'sattva' },
      { label: 'Sometimes',                           guna: 'rajas'  },
      { label: 'More than I would like',              guna: 'tamas'  },
    ],
  },
  {
    id: 'relationships',
    prompt: 'In my relationships, people consider me...',
    options: [
      { label: 'Very generous with love',    guna: 'sattva' },
      { label: 'Taking more than I give',    guna: 'rajas'  },
      { label: 'Needy',                      guna: 'tamas'  },
    ],
  },
  {
    id: 'forgiveness',
    prompt: 'When I am wronged, I forgive...',
    options: [
      { label: 'Immediately — it really comes easily',            guna: 'sattva' },
      { label: 'It takes time and energy, but I get there',       guna: 'rajas'  },
      { label: 'No way. I am holding onto that grudge for life.', guna: 'tamas'  },
    ],
  },
  {
    id: 'meditation',
    prompt: 'Meditation...',
    options: [
      { label: 'Daily without fail',                             guna: 'sattva' },
      { label: 'Here and there — maybe once a week, inconsistent', guna: 'rajas' },
      { label: 'Almost never',                                   guna: 'tamas'  },
    ],
  },
  {
    id: 'spiritual',
    prompt: 'My spiritual practice is...',
    options: [
      { label: 'Daily',       guna: 'sattva' },
      { label: 'Weeklyish',   guna: 'rajas'  },
      { label: 'Very rare',   guna: 'tamas'  },
    ],
  },
  {
    id: 'honesty',
    prompt: 'Honesty is the best policy...',
    options: [
      { label: 'All the time — even when it\'s painful. I\'d rather tell the truth.',                              guna: 'sattva' },
      { label: 'Most of the time. I usually tell the truth, though sometimes I may tell tiny lies or leave things out.', guna: 'rajas' },
      { label: 'All the time... wink wink. Maybe I stretch the truth if I\'m going to get in trouble, or if it\'s fun.', guna: 'tamas' },
    ],
  },
  {
    id: 'focus',
    prompt: 'My ability to focus on any one given task is...',
    options: [
      { label: 'Good — I bring full attention to the situation, person, or thing', guna: 'sattva' },
      { label: 'Sometimes able and sometimes it\'s a challenge',                    guna: 'rajas'  },
      { label: 'Poor — I tend to multitask a lot',                                 guna: 'tamas'  },
    ],
  },
];

// Source: transcript 18 (061926_02). Thea's result copy — DRAFT, awaiting her review before launch.
export const gunaResults = {
  sattva: {
    name: 'Sattva',
    color: '#7A9870',
    summary: 'Your mind is currently expressing more Sattva energy — the guna of clarity, wisdom, balance, and inner peace. It feels light here. Decisions seem to come with greater ease. You feel connected, not just to yourself but to the world around you — with a sense of trust, gratitude, and purpose.',
    gifts: [
      'Clear thinking and high discernment',
      'Emotional steadiness',
      'Compassion that extends outward',
      'Strong connection to your own intuition',
    ],
    watchFor: [
      'Spiritual perfectionism — judging yourself or others for not being "balanced" enough',
      'Forgetting that rest, play, and messiness are also part of being human',
      'Holding on to Sattva as an identity rather than letting it keep moving',
    ],
    pathForward: 'The goal isn\'t to hold on to this feeling — it\'s to nourish it. Keep choosing foods, relationships, routines, and practices that create spaciousness and clarity. Spend time in nature. Honor the rhythms. Use your clarity in service of something greater than yourself.',
    reflection: 'What helps me feel most like myself?',
    practices: {
      diet: ['Fresh fruits and vegetables', 'Whole grains', 'Mung beans', 'Soaked nuts and seeds', 'Milk, if your body tolerates it and it\'s well-sourced', 'Ghee', 'Herbal teas and fresh herbs', 'Clean water'],
      lifestyle: ['Waking with the sun', 'Time in nature — feet in the grass, hands in the dirt', 'Keeping your environment clean and organized', 'Gratitude practice', 'Meaningful conversations and acts of service', 'Creating beauty in your home'],
      spiritual: ['Meditation and prayer', 'Gentle breathwork and yoga', 'Journaling and self-reflection', 'Studying wisdom teachings', 'Time in silence and mindful presence'],
    },
    lGlowNote: 'In L. Glow, Sattva is just the feeling of coming home to yourself. It\'s that deep breath after a long day. It\'s your feet in the grass. It\'s cooking in a kitchen filled with nourishing food. A quiet morning before the world wakes up. A moment when your mind becomes still enough to hear your own wisdom.',
  },
  rajas: {
    name: 'Rajas',
    color: '#A07068',
    summary: 'Your mind is currently expressing more Rajas energy — the guna of movement, passion, action, and transformation. Rajas is the energy that gets things done. Without it, nothing would move forward. Businesses wouldn\'t start. Change wouldn\'t happen. Rajas is the spark.',
    gifts: [
      'High motivation and drive',
      'Creativity and natural leadership',
      'Courage to initiate change',
      'The energy to build and transform',
    ],
    watchFor: [
      'Overthinking and a mind that won\'t slow down',
      'Burnout from always being on',
      'Irritability when things don\'t move fast enough',
      'Rest starting to feel uncomfortable or even threatening',
    ],
    pathForward: 'It\'s not about less passion — it\'s about more balance. Slow down enough to hear yourself beneath all the noise. Prioritize rest and grounding practices, nourishing meals, and real moments of stillness. Let your actions arise from alignment rather than urgency.',
    reflection: 'What would happen if I stopped pushing and started listening?',
    practices: {
      diet: ['Warming, grounding foods help contain Rajasic energy', 'Reduce excess stimulants — coffee, spicy foods, and salt', 'Regular mealtimes create structure when the mind wants to race'],
      lifestyle: ['Vigorous movement as a healthy outlet — strength training, HIIT, competitive activity', 'Goal-setting and building are Rajas in its best expression', 'Counter with: grounding walks, earlier bedtimes, less screen time'],
      spiritual: ['Purposeful action and creativity oriented toward others', 'Slow yoga and breathwork to create stillness', 'Meditation — even five minutes — to hear yourself think'],
    },
    lGlowNote: 'Rajas is that spark that gets you moving. It\'s the courage to start, the energy to create, the fire to transform, and the passion behind your purpose. But just like fire, it needs a container. Too little and life feels stagnant. Too much and you burn. The goal isn\'t to eliminate Rajas — it\'s to let your actions come from alignment rather than urgency.',
  },
  tamas: {
    name: 'Tamas',
    color: '#8B7355',
    summary: 'Your mind is currently expressing more Tamas energy — the guna of stability, rest, structure, and groundedness. Tamas is the energy of recovery, nourishment, sleep, and rootedness. Seeds grow in darkness. Healing happens in stillness. Tamas gets a bad reputation, but it deserves a second look.',
    gifts: [
      'Groundedness and deep loyalty',
      'Stability and long-term endurance',
      'A genuine capacity for rest and recovery',
      'The ability to hold steady when everyone else is scrambling',
    ],
    watchFor: [
      'Procrastination and a motivation that just isn\'t there',
      'Emotional heaviness, fog, and resistance to change',
      'Staying in situations, patterns, or relationships that have needed to end',
      'Feeling stuck — in your body, your mind, or your life',
    ],
    pathForward: 'The answer isn\'t to force action. Start with a small spark — open the curtains, take a walk, call a friend, move your body just a little. Small movements create momentum. You don\'t need to overhaul everything. You need one thing to shift.',
    reflection: 'What is one step I could take to create more energy in my life today?',
    practices: {
      diet: ['Nourishing, grounding, and comforting foods', 'Freshly prepared food over leftovers, heavy dairy, and processed things', 'Watch for: large portions, excess sugar, alcohol, fried foods'],
      lifestyle: ['Restorative movement: stretching, gentle walking, lying on the earth', 'Healthy Tamas: sleep, napping, deep rest, consistent routine', 'Reduce: oversleeping, endless scrolling, isolation, staying inside for days'],
      spiritual: ['Patience and reflection', 'Gentle, low-demand stillness practices', 'Slow yoga, easy breathwork, time in nature without an agenda'],
    },
    lGlowNote: 'Tamas is like the soil — rooted beneath the flowers, dark where seeds germinate. It\'s the blanket that helps you rest. The pause between breaths. The foundation that allows everything above it to grow. Without it, we burn. Tamas asks: what needs rest, nourishment, and deeper roots before it can grow?',
  },
};
