-- L. Glow — Vikriti Level 2: "Pattern Finder" (54 questions + 1 closing
-- free-text reflection). Run in the Supabase SQL Editor after the prior
-- migrations.
--
-- One schema addition: input_type (text, default 'multi_select'), because
-- this tier ends with a genuinely different question shape — an optional
-- free-text reflection ("If your body could write you a letter today...")
-- rather than another set of options. Matt's own reasoning for it: richer
-- qualitative data than any number of checkboxes, and it fits the
-- philosophy directly — the goal is to help people feel heard, not just
-- score symptoms. For input_type = 'free_text' rows, `options` is an empty
-- array; there's nothing to tag.
--
-- Two real differences from every tier before this one:
--
-- 1. No universal escape this time. Vikriti Level 1 had a fixed "None of
--    these are speaking to me" toggled by allow_none. Level 2 instead
--    gives every question its OWN uniquely-worded catch-all as the LAST
--    option in its list — e.g. "My energy has been showing up
--    differently," "My pattern feels different," "There's a different
--    clue for me." These are stored as an ordinary last entry in that
--    question's options array (dosha: [], same as everywhere else),
--    expected to stay untagged by design — it's not a real dosha-leaning
--    answer, it's the personalized "none of these fit" line. allow_none is
--    false on all 54 rows here since a separate universal escape isn't
--    needed on top of each question's own catch-all.
--
-- 2. Variable option counts, 6 to 10 per question (not a fixed 3 or 4) —
--    the admin editor already supports this generically (add/remove option
--    rows), so no editor changes needed for this alone.
--
-- IDs prefixed pattern- (matching "Pattern Finder") — near-total topic
-- overlap with Vikriti Level 1's signal- prefixed questions (energy,
-- digestion, sleep, skin, mood, temperature all recur here at a deeper
-- level), so a shared prefix scheme was essential, not just tidy.
--
-- Sections, per Matt's own Part 1 / Part 2 grouping and sub-headers: energy,
-- digestion_agni, elimination, sleep_restoration, mind_emotional, skin_hair,
-- temperature_circulation, movement_recovery, whole_body_reflection.
--
-- The closing reflection (id pattern-body-letter, sort_order 55) is meant
-- to be optional/skippable — no schema field enforces that yet since no
-- consumer flow exists to enforce or skip anything; a note for whoever
-- builds that screen (roadmap #52).

alter table public.constitution_questions
  add column input_type text not null default 'multi_select' check (input_type in ('multi_select', 'free_text'));

insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type) values

  ($id$pattern-best-time-of-day$id$, 'vikriti', 'level2', 'energy', $p$When during the day do you naturally feel your best?$p$, $opts$[
    {"label": "Early morning", "dosha": [], "imageUrl": null},
    {"label": "Mid-morning", "dosha": [], "imageUrl": null},
    {"label": "Midday", "dosha": [], "imageUrl": null},
    {"label": "Late afternoon", "dosha": [], "imageUrl": null},
    {"label": "Evening", "dosha": [], "imageUrl": null},
    {"label": "It changes from day to day", "dosha": [], "imageUrl": null},
    {"label": "I rarely notice a pattern", "dosha": [], "imageUrl": null},
    {"label": "My energy has been showing up differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 1, false, false, 'multi_select'),

  ($id$pattern-energy-drain$id$, 'vikriti', 'level2', 'energy', $p$What tends to drain your energy the fastest?$p$, $opts$[
    {"label": "Too much stimulation", "dosha": [], "imageUrl": null},
    {"label": "Conflict or tension", "dosha": [], "imageUrl": null},
    {"label": "Being overly busy", "dosha": [], "imageUrl": null},
    {"label": "Skipping meals", "dosha": [], "imageUrl": null},
    {"label": "Being around lots of people", "dosha": [], "imageUrl": null},
    {"label": "Physical activity", "dosha": [], "imageUrl": null},
    {"label": "Sitting still too long", "dosha": [], "imageUrl": null},
    {"label": "My pattern feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 2, false, false, 'multi_select'),

  ($id$pattern-first-change-when-off$id$, 'vikriti', 'level2', 'energy', $p$When you start feeling "off," what usually changes first?$p$, $opts$[
    {"label": "My thoughts", "dosha": [], "imageUrl": null},
    {"label": "My digestion", "dosha": [], "imageUrl": null},
    {"label": "My mood", "dosha": [], "imageUrl": null},
    {"label": "My sleep", "dosha": [], "imageUrl": null},
    {"label": "My energy", "dosha": [], "imageUrl": null},
    {"label": "My body feels heavy", "dosha": [], "imageUrl": null},
    {"label": "My body feels tense", "dosha": [], "imageUrl": null},
    {"label": "My body has been giving me different clues.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 3, false, false, 'multi_select'),

  ($id$pattern-energy-past-month$id$, 'vikriti', 'level2', 'energy', $p$Over the past month, your energy has mostly felt...$p$, $opts$[
    {"label": "Steady", "dosha": [], "imageUrl": null},
    {"label": "Up and down throughout the day", "dosha": [], "imageUrl": null},
    {"label": "Great in the morning but gone by afternoon", "dosha": [], "imageUrl": null},
    {"label": "Better later in the day", "dosha": [], "imageUrl": null},
    {"label": "Low most days", "dosha": [], "imageUrl": null},
    {"label": "Different every day", "dosha": [], "imageUrl": null},
    {"label": "My energy tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 4, false, false, 'multi_select'),

  ($id$pattern-post-rest-feeling$id$, 'vikriti', 'level2', 'energy', $p$After resting, you usually feel...$p$, $opts$[
    {"label": "Completely refreshed", "dosha": [], "imageUrl": null},
    {"label": "Better, but not fully restored", "dosha": [], "imageUrl": null},
    {"label": "Like I could sleep even longer", "dosha": [], "imageUrl": null},
    {"label": "More restless than before", "dosha": [], "imageUrl": null},
    {"label": "It depends on the day", "dosha": [], "imageUrl": null},
    {"label": "Rest doesn't seem to help much", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different than these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 5, false, false, 'multi_select'),

  ($id$pattern-energy-statement$id$, 'vikriti', 'level2', 'energy', $p$Which statement feels most true?$p$, $opts$[
    {"label": "I burn through energy quickly.", "dosha": [], "imageUrl": null},
    {"label": "I can push through almost anything.", "dosha": [], "imageUrl": null},
    {"label": "Once I slow down, it's hard to get moving again.", "dosha": [], "imageUrl": null},
    {"label": "I recover pretty easily.", "dosha": [], "imageUrl": null},
    {"label": "I honestly don't know.", "dosha": [], "imageUrl": null},
    {"label": "There's a different clue for me.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 6, false, false, 'multi_select'),

  ($id$pattern-appetite-timing$id$, 'vikriti', 'level2', 'digestion_agni', $p$When is your appetite usually strongest?$p$, $opts$[
    {"label": "First thing in the morning", "dosha": [], "imageUrl": null},
    {"label": "Around lunchtime", "dosha": [], "imageUrl": null},
    {"label": "Late afternoon", "dosha": [], "imageUrl": null},
    {"label": "Evening", "dosha": [], "imageUrl": null},
    {"label": "It changes every day", "dosha": [], "imageUrl": null},
    {"label": "I rarely feel truly hungry", "dosha": [], "imageUrl": null},
    {"label": "My digestion feels different than these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 7, false, false, 'multi_select'),

  ($id$pattern-hunger-onset$id$, 'vikriti', 'level2', 'digestion_agni', $p$Hunger usually shows up...$p$, $opts$[
    {"label": "Suddenly", "dosha": [], "imageUrl": null},
    {"label": "Gradually", "dosha": [], "imageUrl": null},
    {"label": "At the same time every day", "dosha": [], "imageUrl": null},
    {"label": "Only after I've gone too long without eating", "dosha": [], "imageUrl": null},
    {"label": "I often forget to eat", "dosha": [], "imageUrl": null},
    {"label": "I feel hungry all the time", "dosha": [], "imageUrl": null},
    {"label": "My appetite tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 8, false, false, 'multi_select'),

  ($id$pattern-post-eating-feeling$id$, 'vikriti', 'level2', 'digestion_agni', $p$After eating, your body usually feels...$p$, $opts$[
    {"label": "Energized", "dosha": [], "imageUrl": null},
    {"label": "Warm", "dosha": [], "imageUrl": null},
    {"label": "Sleepy", "dosha": [], "imageUrl": null},
    {"label": "Bloated", "dosha": [], "imageUrl": null},
    {"label": "Heavy", "dosha": [], "imageUrl": null},
    {"label": "Still hungry", "dosha": [], "imageUrl": null},
    {"label": "It depends on the meal", "dosha": [], "imageUrl": null},
    {"label": "My body has been responding differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 9, false, false, 'multi_select'),

  ($id$pattern-bloating-timing$id$, 'vikriti', 'level2', 'digestion_agni', $p$Bloating usually happens...$p$, $opts$[
    {"label": "Before eating", "dosha": [], "imageUrl": null},
    {"label": "Right after meals", "dosha": [], "imageUrl": null},
    {"label": "One to two hours later", "dosha": [], "imageUrl": null},
    {"label": "At the end of the day", "dosha": [], "imageUrl": null},
    {"label": "Around my cycle", "dosha": [], "imageUrl": null},
    {"label": "I rarely experience bloating", "dosha": [], "imageUrl": null},
    {"label": "My digestion has been giving me different clues.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 10, false, false, 'multi_select'),

  ($id$pattern-digestive-symptoms$id$, 'vikriti', 'level2', 'digestion_agni', $p$Which digestive symptoms have you noticed most often?$p$, $opts$[
    {"label": "Gas", "dosha": [], "imageUrl": null},
    {"label": "Burping", "dosha": [], "imageUrl": null},
    {"label": "Heartburn", "dosha": [], "imageUrl": null},
    {"label": "Nausea", "dosha": [], "imageUrl": null},
    {"label": "Acid reflux", "dosha": [], "imageUrl": null},
    {"label": "Stomach discomfort", "dosha": [], "imageUrl": null},
    {"label": "None of these lately", "dosha": [], "imageUrl": null},
    {"label": "My digestive story is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 11, false, false, 'multi_select'),

  ($id$pattern-digestion-triggers$id$, 'vikriti', 'level2', 'digestion_agni', $p$Your digestion seems most affected by...$p$, $opts$[
    {"label": "Stress", "dosha": [], "imageUrl": null},
    {"label": "Eating too quickly", "dosha": [], "imageUrl": null},
    {"label": "Traveling", "dosha": [], "imageUrl": null},
    {"label": "Eating late", "dosha": [], "imageUrl": null},
    {"label": "Rich foods", "dosha": [], "imageUrl": null},
    {"label": "Dairy", "dosha": [], "imageUrl": null},
    {"label": "I haven't noticed a pattern", "dosha": [], "imageUrl": null},
    {"label": "My digestion follows a different pattern.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 12, false, false, 'multi_select'),

  ($id$pattern-hard-to-digest-foods$id$, 'vikriti', 'level2', 'digestion_agni', $p$Which foods seem hardest for your body lately?$p$, $opts$[
    {"label": "Raw vegetables", "dosha": [], "imageUrl": null},
    {"label": "Dairy", "dosha": [], "imageUrl": null},
    {"label": "Gluten", "dosha": [], "imageUrl": null},
    {"label": "Fried foods", "dosha": [], "imageUrl": null},
    {"label": "Spicy foods", "dosha": [], "imageUrl": null},
    {"label": "Cold foods or drinks", "dosha": [], "imageUrl": null},
    {"label": "Nothing consistently bothers me", "dosha": [], "imageUrl": null},
    {"label": "My body reacts differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 13, false, false, 'multi_select'),

  ($id$pattern-craving-triggers$id$, 'vikriti', 'level2', 'digestion_agni', $p$Your cravings usually become stronger...$p$, $opts$[
    {"label": "Under stress", "dosha": [], "imageUrl": null},
    {"label": "Late at night", "dosha": [], "imageUrl": null},
    {"label": "Around my menstrual cycle", "dosha": [], "imageUrl": null},
    {"label": "When I'm tired", "dosha": [], "imageUrl": null},
    {"label": "After skipping meals", "dosha": [], "imageUrl": null},
    {"label": "They seem random", "dosha": [], "imageUrl": null},
    {"label": "I rarely crave foods", "dosha": [], "imageUrl": null},
    {"label": "My cravings tell a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 14, false, false, 'multi_select'),

  ($id$pattern-post-meal-urge$id$, 'vikriti', 'level2', 'digestion_agni', $p$After a meal, what do you naturally want to do?$p$, $opts$[
    {"label": "Move around", "dosha": [], "imageUrl": null},
    {"label": "Keep working", "dosha": [], "imageUrl": null},
    {"label": "Sit quietly", "dosha": [], "imageUrl": null},
    {"label": "Take a nap", "dosha": [], "imageUrl": null},
    {"label": "Drink something sweet", "dosha": [], "imageUrl": null},
    {"label": "Nothing changes", "dosha": [], "imageUrl": null},
    {"label": "My body responds differently after meals.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 15, false, false, 'multi_select'),

  ($id$pattern-digestion-predictability$id$, 'vikriti', 'level2', 'digestion_agni', $p$Which best describes your digestion over the past month?$p$, $opts$[
    {"label": "Very predictable", "dosha": [], "imageUrl": null},
    {"label": "Mostly predictable", "dosha": [], "imageUrl": null},
    {"label": "Some good days and some bad days", "dosha": [], "imageUrl": null},
    {"label": "Completely unpredictable", "dosha": [], "imageUrl": null},
    {"label": "It depends on my stress level", "dosha": [], "imageUrl": null},
    {"label": "It depends on what I eat", "dosha": [], "imageUrl": null},
    {"label": "My digestive experience feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 16, false, false, 'multi_select'),

  ($id$pattern-large-meal-response$id$, 'vikriti', 'level2', 'digestion_agni', $p$If you eat a larger meal than usual, your body typically...$p$, $opts$[
    {"label": "Handles it easily", "dosha": [], "imageUrl": null},
    {"label": "Feels overly full", "dosha": [], "imageUrl": null},
    {"label": "Feels sluggish", "dosha": [], "imageUrl": null},
    {"label": "Gets uncomfortable", "dosha": [], "imageUrl": null},
    {"label": "Feels energized", "dosha": [], "imageUrl": null},
    {"label": "I usually avoid eating large meals", "dosha": [], "imageUrl": null},
    {"label": "My body handles large meals differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 17, false, false, 'multi_select'),

  ($id$pattern-digestion-needs$id$, 'vikriti', 'level2', 'digestion_agni', $p$Looking back over the last month, your digestion has mostly been asking for...$p$, $opts$[
    {"label": "More consistency", "dosha": [], "imageUrl": null},
    {"label": "Less stress", "dosha": [], "imageUrl": null},
    {"label": "Simpler foods", "dosha": [], "imageUrl": null},
    {"label": "More nourishment", "dosha": [], "imageUrl": null},
    {"label": "Better timing", "dosha": [], "imageUrl": null},
    {"label": "Slower meals", "dosha": [], "imageUrl": null},
    {"label": "I'm not sure yet", "dosha": [], "imageUrl": null},
    {"label": "My body is asking for something different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 18, false, false, 'multi_select'),

  ($id$pattern-bowel-regularity$id$, 'vikriti', 'level2', 'elimination', $p$Which best describes your bowel movements lately?$p$, $opts$[
    {"label": "Very regular", "dosha": [], "imageUrl": null},
    {"label": "Usually regular", "dosha": [], "imageUrl": null},
    {"label": "Different every day", "dosha": [], "imageUrl": null},
    {"label": "I often skip a day or more", "dosha": [], "imageUrl": null},
    {"label": "I go multiple times a day", "dosha": [], "imageUrl": null},
    {"label": "I haven't paid much attention", "dosha": [], "imageUrl": null},
    {"label": "My elimination tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 19, false, false, 'multi_select'),

  ($id$pattern-post-bathroom-feeling$id$, 'vikriti', 'level2', 'elimination', $p$After using the bathroom, I usually feel...$p$, $opts$[
    {"label": "Completely finished", "dosha": [], "imageUrl": null},
    {"label": "Mostly relieved", "dosha": [], "imageUrl": null},
    {"label": "Like there's still more", "dosha": [], "imageUrl": null},
    {"label": "Rushed", "dosha": [], "imageUrl": null},
    {"label": "Drained", "dosha": [], "imageUrl": null},
    {"label": "I haven't noticed", "dosha": [], "imageUrl": null},
    {"label": "My body has been communicating differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 20, false, false, 'multi_select'),

  ($id$pattern-bowel-patterns$id$, 'vikriti', 'level2', 'elimination', $p$Which patterns have you noticed?$p$, $opts$[
    {"label": "Constipation", "dosha": [], "imageUrl": null},
    {"label": "Loose stools", "dosha": [], "imageUrl": null},
    {"label": "Urgency", "dosha": [], "imageUrl": null},
    {"label": "Gas before going", "dosha": [], "imageUrl": null},
    {"label": "Mucus", "dosha": [], "imageUrl": null},
    {"label": "Alternating between constipation and loose stools", "dosha": [], "imageUrl": null},
    {"label": "None of these lately", "dosha": [], "imageUrl": null},
    {"label": "My digestive pattern feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 21, false, false, 'multi_select'),

  ($id$pattern-elimination-triggers$id$, 'vikriti', 'level2', 'elimination', $p$Your digestion and elimination seem most affected by...$p$, $opts$[
    {"label": "Stress", "dosha": [], "imageUrl": null},
    {"label": "Travel", "dosha": [], "imageUrl": null},
    {"label": "Poor sleep", "dosha": [], "imageUrl": null},
    {"label": "My menstrual cycle", "dosha": [], "imageUrl": null},
    {"label": "Eating out", "dosha": [], "imageUrl": null},
    {"label": "Changes in routine", "dosha": [], "imageUrl": null},
    {"label": "I haven't noticed a pattern", "dosha": [], "imageUrl": null},
    {"label": "There's a different clue for me.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 22, false, false, 'multi_select'),

  ($id$pattern-elimination-monthlook$id$, 'vikriti', 'level2', 'elimination', $p$Looking back over the last month...$p$, $opts$[
    {"label": "Everything has felt pretty consistent.", "dosha": [], "imageUrl": null},
    {"label": "I've noticed small changes.", "dosha": [], "imageUrl": null},
    {"label": "It feels like something is shifting.", "dosha": [], "imageUrl": null},
    {"label": "It's been all over the place.", "dosha": [], "imageUrl": null},
    {"label": "I've honestly never paid attention before.", "dosha": [], "imageUrl": null},
    {"label": "My story feels a little different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 23, false, false, 'multi_select'),

  ($id$pattern-falling-asleep$id$, 'vikriti', 'level2', 'sleep_restoration', $p$Falling asleep is usually...$p$, $opts$[
    {"label": "Easy", "dosha": [], "imageUrl": null},
    {"label": "Difficult because my mind won't slow down", "dosha": [], "imageUrl": null},
    {"label": "Difficult because my body feels uncomfortable", "dosha": [], "imageUrl": null},
    {"label": "Different every night", "dosha": [], "imageUrl": null},
    {"label": "Rarely a problem", "dosha": [], "imageUrl": null},
    {"label": "My sleep tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 24, false, false, 'multi_select'),

  ($id$pattern-night-waking-freq$id$, 'vikriti', 'level2', 'sleep_restoration', $p$During the night, I usually...$p$, $opts$[
    {"label": "Sleep through the night", "dosha": [], "imageUrl": null},
    {"label": "Wake once", "dosha": [], "imageUrl": null},
    {"label": "Wake several times", "dosha": [], "imageUrl": null},
    {"label": "Wake around the same time each night", "dosha": [], "imageUrl": null},
    {"label": "Toss and turn", "dosha": [], "imageUrl": null},
    {"label": "I'm not sure", "dosha": [], "imageUrl": null},
    {"label": "My sleep has been showing up differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 25, false, false, 'multi_select'),

  ($id$pattern-night-waking-reason$id$, 'vikriti', 'level2', 'sleep_restoration', $p$When I wake during the night, it's usually because...$p$, $opts$[
    {"label": "My mind is racing", "dosha": [], "imageUrl": null},
    {"label": "I need the bathroom", "dosha": [], "imageUrl": null},
    {"label": "I'm too warm", "dosha": [], "imageUrl": null},
    {"label": "I don't know why", "dosha": [], "imageUrl": null},
    {"label": "My body aches", "dosha": [], "imageUrl": null},
    {"label": "I rarely wake", "dosha": [], "imageUrl": null},
    {"label": "My experience feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 26, false, false, 'multi_select'),

  ($id$pattern-dreams$id$, 'vikriti', 'level2', 'sleep_restoration', $p$My dreams lately have been...$p$, $opts$[
    {"label": "I rarely remember them", "dosha": [], "imageUrl": null},
    {"label": "Very vivid", "dosha": [], "imageUrl": null},
    {"label": "Stressful", "dosha": [], "imageUrl": null},
    {"label": "Pleasant", "dosha": [], "imageUrl": null},
    {"label": "Random", "dosha": [], "imageUrl": null},
    {"label": "I haven't noticed", "dosha": [], "imageUrl": null},
    {"label": "My dream patterns feel different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 27, false, false, 'multi_select'),

  ($id$pattern-waking-feeling$id$, 'vikriti', 'level2', 'sleep_restoration', $p$When you wake up, you usually feel...$p$, $opts$[
    {"label": "Refreshed", "dosha": [], "imageUrl": null},
    {"label": "Ready after a few minutes", "dosha": [], "imageUrl": null},
    {"label": "Groggy", "dosha": [], "imageUrl": null},
    {"label": "Like I could keep sleeping", "dosha": [], "imageUrl": null},
    {"label": "Already overwhelmed", "dosha": [], "imageUrl": null},
    {"label": "Different every morning", "dosha": [], "imageUrl": null},
    {"label": "My mornings tell a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 28, false, false, 'multi_select'),

  ($id$pattern-sleep-statement$id$, 'vikriti', 'level2', 'sleep_restoration', $p$Which statement feels most true?$p$, $opts$[
    {"label": "I recover quickly after a good night's sleep.", "dosha": [], "imageUrl": null},
    {"label": "I need a lot of sleep to function.", "dosha": [], "imageUrl": null},
    {"label": "Sleep doesn't seem to restore me.", "dosha": [], "imageUrl": null},
    {"label": "My sleep depends on stress.", "dosha": [], "imageUrl": null},
    {"label": "My sleep depends on my routine.", "dosha": [], "imageUrl": null},
    {"label": "There's another clue in my story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 29, false, false, 'multi_select'),

  ($id$pattern-thoughts-month$id$, 'vikriti', 'level2', 'mind_emotional', $p$Over the past month, your thoughts have mostly felt...$p$, $opts$[
    {"label": "Calm", "dosha": [], "imageUrl": null},
    {"label": "Busy", "dosha": [], "imageUrl": null},
    {"label": "Racing", "dosha": [], "imageUrl": null},
    {"label": "Focused", "dosha": [], "imageUrl": null},
    {"label": "Foggy", "dosha": [], "imageUrl": null},
    {"label": "Scattered", "dosha": [], "imageUrl": null},
    {"label": "My mind has been working differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 30, false, false, 'multi_select'),

  ($id$pattern-stress-first-response$id$, 'vikriti', 'level2', 'mind_emotional', $p$When stress shows up, your first response is usually...$p$, $opts$[
    {"label": "Worry", "dosha": [], "imageUrl": null},
    {"label": "Irritation", "dosha": [], "imageUrl": null},
    {"label": "Shutting down", "dosha": [], "imageUrl": null},
    {"label": "Becoming extra productive", "dosha": [], "imageUrl": null},
    {"label": "Overthinking", "dosha": [], "imageUrl": null},
    {"label": "Avoiding everything", "dosha": [], "imageUrl": null},
    {"label": "My stress response feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 31, false, false, 'multi_select'),

  ($id$pattern-emotions-month$id$, 'vikriti', 'level2', 'mind_emotional', $p$Your emotions lately have felt...$p$, $opts$[
    {"label": "Steady", "dosha": [], "imageUrl": null},
    {"label": "Up and down", "dosha": [], "imageUrl": null},
    {"label": "Intense", "dosha": [], "imageUrl": null},
    {"label": "Heavy", "dosha": [], "imageUrl": null},
    {"label": "Numb", "dosha": [], "imageUrl": null},
    {"label": "Easy to regulate", "dosha": [], "imageUrl": null},
    {"label": "My emotional patterns are different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 32, false, false, 'multi_select'),

  ($id$pattern-imbalance-triggers$id$, 'vikriti', 'level2', 'mind_emotional', $p$Which situations tend to throw you off balance?$p$, $opts$[
    {"label": "Conflict", "dosha": [], "imageUrl": null},
    {"label": "Feeling rushed", "dosha": [], "imageUrl": null},
    {"label": "Too many responsibilities", "dosha": [], "imageUrl": null},
    {"label": "Uncertainty", "dosha": [], "imageUrl": null},
    {"label": "Lack of sleep", "dosha": [], "imageUrl": null},
    {"label": "Being alone too much", "dosha": [], "imageUrl": null},
    {"label": "Being around too many people", "dosha": [], "imageUrl": null},
    {"label": "My triggers are different than these.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 33, false, false, 'multi_select'),

  ($id$pattern-post-stress-behavior$id$, 'vikriti', 'level2', 'mind_emotional', $p$After something stressful happens, you usually...$p$, $opts$[
    {"label": "Move on quickly", "dosha": [], "imageUrl": null},
    {"label": "Replay it in my mind", "dosha": [], "imageUrl": null},
    {"label": "Stay irritated", "dosha": [], "imageUrl": null},
    {"label": "Feel emotionally exhausted", "dosha": [], "imageUrl": null},
    {"label": "Need quiet", "dosha": [], "imageUrl": null},
    {"label": "Need movement", "dosha": [], "imageUrl": null},
    {"label": "My recovery looks different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 34, false, false, 'multi_select'),

  ($id$pattern-hardest-this-month$id$, 'vikriti', 'level2', 'mind_emotional', $p$Over the past month, you've had the hardest time with...$p$, $opts$[
    {"label": "Concentration", "dosha": [], "imageUrl": null},
    {"label": "Motivation", "dosha": [], "imageUrl": null},
    {"label": "Patience", "dosha": [], "imageUrl": null},
    {"label": "Decision making", "dosha": [], "imageUrl": null},
    {"label": "Memory", "dosha": [], "imageUrl": null},
    {"label": "Feeling present", "dosha": [], "imageUrl": null},
    {"label": "None of these have been significant", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 35, false, false, 'multi_select'),

  ($id$pattern-mind-today$id$, 'vikriti', 'level2', 'mind_emotional', $p$Which statement best describes where your mind is today?$p$, $opts$[
    {"label": "I need more peace.", "dosha": [], "imageUrl": null},
    {"label": "I need more clarity.", "dosha": [], "imageUrl": null},
    {"label": "I need more joy.", "dosha": [], "imageUrl": null},
    {"label": "I need more motivation.", "dosha": [], "imageUrl": null},
    {"label": "I need more space to slow down.", "dosha": [], "imageUrl": null},
    {"label": "My mind feels well supported.", "dosha": [], "imageUrl": null},
    {"label": "My story doesn't quite fit these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 36, false, false, 'multi_select'),

  ($id$pattern-skin-month$id$, 'vikriti', 'level2', 'skin_hair', $p$Over the past month, your skin has mostly felt...$p$, $opts$[
    {"label": "Dry or tight", "dosha": [], "imageUrl": null},
    {"label": "Sensitive or easily irritated", "dosha": [], "imageUrl": null},
    {"label": "Warm or flushed", "dosha": [], "imageUrl": null},
    {"label": "Oily or congested", "dosha": [], "imageUrl": null},
    {"label": "Puffy or swollen", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "It changes often", "dosha": [], "imageUrl": null},
    {"label": "My skin has been giving me different clues.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 37, false, false, 'multi_select'),

  ($id$pattern-hair-scalp-changes$id$, 'vikriti', 'level2', 'skin_hair', $p$Which changes have you noticed in your hair or scalp?$p$, $opts$[
    {"label": "Dry hair", "dosha": [], "imageUrl": null},
    {"label": "Oily scalp", "dosha": [], "imageUrl": null},
    {"label": "Increased shedding", "dosha": [], "imageUrl": null},
    {"label": "Brittle hair", "dosha": [], "imageUrl": null},
    {"label": "Thinning hair", "dosha": [], "imageUrl": null},
    {"label": "Itching or flaking", "dosha": [], "imageUrl": null},
    {"label": "No noticeable changes", "dosha": [], "imageUrl": null},
    {"label": "My hair tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 38, false, false, 'multi_select'),

  ($id$pattern-nails-month$id$, 'vikriti', 'level2', 'skin_hair', $p$Your nails lately have been...$p$, $opts$[
    {"label": "Strong", "dosha": [], "imageUrl": null},
    {"label": "Brittle", "dosha": [], "imageUrl": null},
    {"label": "Peeling", "dosha": [], "imageUrl": null},
    {"label": "Soft", "dosha": [], "imageUrl": null},
    {"label": "Ridged", "dosha": [], "imageUrl": null},
    {"label": "Breaking easily", "dosha": [], "imageUrl": null},
    {"label": "I haven't noticed", "dosha": [], "imageUrl": null},
    {"label": "My body has been communicating differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 39, false, false, 'multi_select'),

  ($id$pattern-mirror-observations$id$, 'vikriti', 'level2', 'skin_hair', $p$Looking in the mirror lately, you've noticed...$p$, $opts$[
    {"label": "Dark circles", "dosha": [], "imageUrl": null},
    {"label": "Puffiness", "dosha": [], "imageUrl": null},
    {"label": "Dull complexion", "dosha": [], "imageUrl": null},
    {"label": "Redness", "dosha": [], "imageUrl": null},
    {"label": "Breakouts", "dosha": [], "imageUrl": null},
    {"label": "Healthy glow", "dosha": [], "imageUrl": null},
    {"label": "Nothing different", "dosha": [], "imageUrl": null},
    {"label": "My appearance has been changing in another way.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 40, false, false, 'multi_select'),

  ($id$pattern-skin-statement$id$, 'vikriti', 'level2', 'skin_hair', $p$Which statement feels most true?$p$, $opts$[
    {"label": "My skin reflects how stressed I am.", "dosha": [], "imageUrl": null},
    {"label": "My skin reflects what I eat.", "dosha": [], "imageUrl": null},
    {"label": "My skin changes with the seasons.", "dosha": [], "imageUrl": null},
    {"label": "My skin changes around my cycle.", "dosha": [], "imageUrl": null},
    {"label": "My skin stays pretty consistent.", "dosha": [], "imageUrl": null},
    {"label": "There's another clue my body is giving me.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 41, false, false, 'multi_select'),

  ($id$pattern-body-temp-daily$id$, 'vikriti', 'level2', 'temperature_circulation', $p$Most days your body feels...$p$, $opts$[
    {"label": "Cold", "dosha": [], "imageUrl": null},
    {"label": "Warm", "dosha": [], "imageUrl": null},
    {"label": "Comfortable", "dosha": [], "imageUrl": null},
    {"label": "Cold hands but warm body", "dosha": [], "imageUrl": null},
    {"label": "Warm hands but cold feet", "dosha": [], "imageUrl": null},
    {"label": "Different throughout the day", "dosha": [], "imageUrl": null},
    {"label": "My temperature pattern feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 42, false, false, 'multi_select'),

  ($id$pattern-temp-experiences$id$, 'vikriti', 'level2', 'temperature_circulation', $p$Which have you experienced recently?$p$, $opts$[
    {"label": "Cold hands", "dosha": [], "imageUrl": null},
    {"label": "Cold feet", "dosha": [], "imageUrl": null},
    {"label": "Night sweats", "dosha": [], "imageUrl": null},
    {"label": "Hot flashes", "dosha": [], "imageUrl": null},
    {"label": "Sweating easily", "dosha": [], "imageUrl": null},
    {"label": "Rarely sweating", "dosha": [], "imageUrl": null},
    {"label": "None of these", "dosha": [], "imageUrl": null},
    {"label": "My body regulates temperature differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 43, false, false, 'multi_select'),

  ($id$pattern-circulation-changes$id$, 'vikriti', 'level2', 'temperature_circulation', $p$Have you noticed changes in circulation?$p$, $opts$[
    {"label": "Swelling", "dosha": [], "imageUrl": null},
    {"label": "Water retention", "dosha": [], "imageUrl": null},
    {"label": "Tingling", "dosha": [], "imageUrl": null},
    {"label": "Numbness", "dosha": [], "imageUrl": null},
    {"label": "Easily cold", "dosha": [], "imageUrl": null},
    {"label": "Everything feels normal", "dosha": [], "imageUrl": null},
    {"label": "My circulation tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 44, false, false, 'multi_select'),

  ($id$pattern-best-environment$id$, 'vikriti', 'level2', 'temperature_circulation', $p$Which environment feels best for your body?$p$, $opts$[
    {"label": "Warm weather", "dosha": [], "imageUrl": null},
    {"label": "Cooler weather", "dosha": [], "imageUrl": null},
    {"label": "Dry climates", "dosha": [], "imageUrl": null},
    {"label": "Humid climates", "dosha": [], "imageUrl": null},
    {"label": "I adapt easily", "dosha": [], "imageUrl": null},
    {"label": "It depends", "dosha": [], "imageUrl": null},
    {"label": "My body responds differently to the environment.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 45, false, false, 'multi_select'),

  ($id$pattern-waking-body-feel$id$, 'vikriti', 'level2', 'movement_recovery', $p$When you first wake up, your body usually feels...$p$, $opts$[
    {"label": "Loose and ready to move", "dosha": [], "imageUrl": null},
    {"label": "Tight", "dosha": [], "imageUrl": null},
    {"label": "Stiff", "dosha": [], "imageUrl": null},
    {"label": "Heavy", "dosha": [], "imageUrl": null},
    {"label": "Sore", "dosha": [], "imageUrl": null},
    {"label": "Different every day", "dosha": [], "imageUrl": null},
    {"label": "My body wakes up differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 46, false, false, 'multi_select'),

  ($id$pattern-post-activity$id$, 'vikriti', 'level2', 'movement_recovery', $p$After physical activity, you usually...$p$, $opts$[
    {"label": "Recover quickly", "dosha": [], "imageUrl": null},
    {"label": "Feel pleasantly tired", "dosha": [], "imageUrl": null},
    {"label": "Feel sore for days", "dosha": [], "imageUrl": null},
    {"label": "Feel energized", "dosha": [], "imageUrl": null},
    {"label": "Feel completely drained", "dosha": [], "imageUrl": null},
    {"label": "It depends on the activity", "dosha": [], "imageUrl": null},
    {"label": "My recovery tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 47, false, false, 'multi_select'),

  ($id$pattern-movement-relationship$id$, 'vikriti', 'level2', 'movement_recovery', $p$Which best describes your relationship with movement?$p$, $opts$[
    {"label": "I naturally crave movement.", "dosha": [], "imageUrl": null},
    {"label": "I like structured exercise.", "dosha": [], "imageUrl": null},
    {"label": "It's hard to get started.", "dosha": [], "imageUrl": null},
    {"label": "Once I start, I enjoy it.", "dosha": [], "imageUrl": null},
    {"label": "I avoid exercise because I don't recover well.", "dosha": [], "imageUrl": null},
    {"label": "It changes depending on life.", "dosha": [], "imageUrl": null},
    {"label": "My movement pattern feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 48, false, false, 'multi_select'),

  ($id$pattern-body-current-ask$id$, 'vikriti', 'level2', 'movement_recovery', $p$Your body currently asks for...$p$, $opts$[
    {"label": "Stretching", "dosha": [], "imageUrl": null},
    {"label": "Strength", "dosha": [], "imageUrl": null},
    {"label": "Walking", "dosha": [], "imageUrl": null},
    {"label": "Rest", "dosha": [], "imageUrl": null},
    {"label": "Gentle movement", "dosha": [], "imageUrl": null},
    {"label": "More challenge", "dosha": [], "imageUrl": null},
    {"label": "I'm not sure", "dosha": [], "imageUrl": null},
    {"label": "My body has been asking for something different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 49, false, false, 'multi_select'),

  ($id$pattern-recovery-statement$id$, 'vikriti', 'level2', 'movement_recovery', $p$Which statement feels most true?$p$, $opts$[
    {"label": "I bounce back quickly.", "dosha": [], "imageUrl": null},
    {"label": "Recovery takes longer than it used to.", "dosha": [], "imageUrl": null},
    {"label": "My body feels older than my age.", "dosha": [], "imageUrl": null},
    {"label": "My body surprises me.", "dosha": [], "imageUrl": null},
    {"label": "My recovery depends on sleep.", "dosha": [], "imageUrl": null},
    {"label": "My recovery depends on stress.", "dosha": [], "imageUrl": null},
    {"label": "There's another clue in my recovery story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 50, false, false, 'multi_select'),

  ($id$pattern-system-needing-attention$id$, 'vikriti', 'level2', 'whole_body_reflection', $p$Looking at your body as a whole, which system has been asking for the most attention?$p$, $opts$[
    {"label": "Energy", "dosha": [], "imageUrl": null},
    {"label": "Digestion", "dosha": [], "imageUrl": null},
    {"label": "Sleep", "dosha": [], "imageUrl": null},
    {"label": "Mood", "dosha": [], "imageUrl": null},
    {"label": "Hormones", "dosha": [], "imageUrl": null},
    {"label": "Skin", "dosha": [], "imageUrl": null},
    {"label": "Pain", "dosha": [], "imageUrl": null},
    {"label": "Weight", "dosha": [], "imageUrl": null},
    {"label": "Focus", "dosha": [], "imageUrl": null},
    {"label": "My body is pointing me somewhere else.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 51, false, false, 'multi_select'),

  ($id$pattern-body-message$id$, 'vikriti', 'level2', 'whole_body_reflection', $p$If your body could send you one message today, it would be...$p$, $opts$[
    {"label": "Slow down.", "dosha": [], "imageUrl": null},
    {"label": "Simplify.", "dosha": [], "imageUrl": null},
    {"label": "Nourish me.", "dosha": [], "imageUrl": null},
    {"label": "Move me.", "dosha": [], "imageUrl": null},
    {"label": "Let me recover.", "dosha": [], "imageUrl": null},
    {"label": "Listen to me.", "dosha": [], "imageUrl": null},
    {"label": "Keep doing what you're doing.", "dosha": [], "imageUrl": null},
    {"label": "My body is trying to tell me something different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 52, false, false, 'multi_select'),

  ($id$pattern-body-knowledge$id$, 'vikriti', 'level2', 'whole_body_reflection', $p$Which statement feels closest to your experience?$p$, $opts$[
    {"label": "I know what my body needs—I just struggle to do it.", "dosha": [], "imageUrl": null},
    {"label": "I don't always know what my body needs.", "dosha": [], "imageUrl": null},
    {"label": "My body feels confusing lately.", "dosha": [], "imageUrl": null},
    {"label": "I'm starting to understand my body's patterns.", "dosha": [], "imageUrl": null},
    {"label": "I feel more connected than ever.", "dosha": [], "imageUrl": null},
    {"label": "Every season feels different.", "dosha": [], "imageUrl": null},
    {"label": "My story doesn't quite fit these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 53, false, false, 'multi_select'),

  ($id$pattern-greatest-hope$id$, 'vikriti', 'level2', 'whole_body_reflection', $p$Right now, your greatest hope is...$p$, $opts$[
    {"label": "More energy", "dosha": [], "imageUrl": null},
    {"label": "Better digestion", "dosha": [], "imageUrl": null},
    {"label": "Better sleep", "dosha": [], "imageUrl": null},
    {"label": "Less stress", "dosha": [], "imageUrl": null},
    {"label": "Feeling like myself again", "dosha": [], "imageUrl": null},
    {"label": "Understanding my body better", "dosha": [], "imageUrl": null},
    {"label": "Aging well", "dosha": [], "imageUrl": null},
    {"label": "Feeling truly well—not just symptom-free", "dosha": [], "imageUrl": null},
    {"label": "My goal looks a little different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 54, false, false, 'multi_select'),

  ($id$pattern-body-letter$id$, 'vikriti', 'level2', 'reflection', $p$If your body could write you a letter today, what do you think it would say?$p$, $opts$[]$opts$::jsonb, 55, false, false, 'free_text');
