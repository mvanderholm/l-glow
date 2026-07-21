-- L. Glow — Vikriti Level 3: "Your Story" — PARTIAL, 17 questions + 1
-- closing free-text, out of an originally-planned 54. Run in the Supabase
-- SQL Editor after the prior migrations. No schema changes.
--
-- Unlike every tier before this one, the source content Matt sent was
-- genuinely incomplete: four whole named sections were left as bare topic
-- words with no question wording or options ever written —
--   - ADOLESCENCE & EARLY ADULTHOOD: "Puberty, Periods, Acne, Weight
--     changes, Body image, Dieting, Exercise, Sleep, Stress"
--   - WOMEN'S HEALTH: "Cycle, Pregnancy, Postpartum, Birth control,
--     Perimenopause, Menopause, Hormonal changes, Fertility, Miscarriage"
--   - HEALTH TIMELINE: "Surgeries, Major illnesses, Injuries, Antibiotics,
--     COVID, Chronic pain, Hospitalizations, Digestive illness, Autoimmune
--     diagnosis, Concussions"
--   - LIFESTYLE: "Travel, Sleep schedules, Work, Technology, Alcohol,
--     Smoking, Supplements, Exercise history, Stress, Nature"
-- None of these were built. Writing actual question phrasing and answer
-- options for topics like miscarriage, autoimmune diagnosis, or birth
-- control is not something to infer from a topic word — that's real
-- clinical-sensitivity content, more so than anywhere else in this whole
-- feature, and it's Matt/Thea's to author, not to generate. Send the real
-- question + option text for these four sections when ready.
--
-- sort_order deliberately leaves large gaps between sections (steps of
-- 100-300) specifically so the four missing sections can be inserted later
-- at their intended position without renumbering anything already live:
--   childhood       10-60
--   family_patterns 200-240
--   [reserved 300s  — adolescence, not sent]
--   [reserved 400s  — women's health, not sent]
--   life_chapters   500
--   [reserved 600s  — health timeline, not sent]
--   [reserved 700s  — lifestyle, not sent]
--   relationship_with_food 800
--   mindset         850
--   whole_story     900-920
--   closing reflection 999
--
-- Two more rows (relationship_with_food, mindset) have complete option
-- lists but were never given a lead-in question sentence in the source —
-- inserted with prompt = '[PLACEHOLDER -- Matt to supply the lead-in
-- question]' rather than invented, so the real option content isn't lost
-- but can't be mistaken for finished copy. Fix the prompt via the admin
-- editor once real wording exists.
--
-- Same pattern as Level 2: every question ends with its own uniquely
-- worded catch-all as the last option (not a universal allow_none escape),
-- e.g. "My childhood looked a little different." allow_none is false
-- throughout.
--
-- The closing question ("Letter to Your Practitioner" -- "If there is one
-- thing you wish someone understood about your health journey, what would
-- you tell them?") is input_type = 'free_text', same mechanism as Level
-- 2's closing reflection, but Matt is explicit that this one is meant to
-- read differently once a real consumer flow exists: not just an optional
-- add-on, but "the heart of the user's profile" -- what a practitioner
-- sees first when a client books a session. No schema field distinguishes
-- that significance from Level 2's closing question yet; a note for
-- whoever builds that screen (roadmap #52).
--
-- Q54 ("what's had the biggest impact") says "Select up to three" in the
-- source -- a real constraint this schema doesn't enforce (every other
-- question is unlimited multi-select). Not adding a max_select column for
-- one question right now -- flagged here so it isn't silently lost, revisit
-- if this cap pattern recurs elsewhere.
--
-- IDs prefixed story- (matching "Your Story").

insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type) values

  ($id$story-childhood-self$id$, 'vikriti', 'level3', 'childhood', $p$As a child, I was...$p$, $opts$[
    {"label": "Always moving", "dosha": [], "imageUrl": null},
    {"label": "Calm and easygoing", "dosha": [], "imageUrl": null},
    {"label": "Very sensitive", "dosha": [], "imageUrl": null},
    {"label": "Independent", "dosha": [], "imageUrl": null},
    {"label": "Shy", "dosha": [], "imageUrl": null},
    {"label": "The caretaker", "dosha": [], "imageUrl": null},
    {"label": "The perfectionist", "dosha": [], "imageUrl": null},
    {"label": "My childhood looked a little different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 10, false, false, 'multi_select'),

  ($id$story-childhood-described$id$, 'vikriti', 'level3', 'childhood', $p$Growing up, people often described me as...$p$, $opts$[
    {"label": "Creative", "dosha": [], "imageUrl": null},
    {"label": "Responsible", "dosha": [], "imageUrl": null},
    {"label": "Emotional", "dosha": [], "imageUrl": null},
    {"label": "Competitive", "dosha": [], "imageUrl": null},
    {"label": "Quiet", "dosha": [], "imageUrl": null},
    {"label": "Easygoing", "dosha": [], "imageUrl": null},
    {"label": "Curious", "dosha": [], "imageUrl": null},
    {"label": "My story feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 20, false, false, 'multi_select'),

  ($id$story-childhood-health$id$, 'vikriti', 'level3', 'childhood', $p$As a child, I remember...$p$, $opts$[
    {"label": "Getting sick often", "dosha": [], "imageUrl": null},
    {"label": "Rarely getting sick", "dosha": [], "imageUrl": null},
    {"label": "Digestive problems", "dosha": [], "imageUrl": null},
    {"label": "Allergies", "dosha": [], "imageUrl": null},
    {"label": "Skin issues", "dosha": [], "imageUrl": null},
    {"label": "Trouble sleeping", "dosha": [], "imageUrl": null},
    {"label": "Lots of energy", "dosha": [], "imageUrl": null},
    {"label": "There are different clues from my childhood.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 30, false, false, 'multi_select'),

  ($id$story-childhood-food$id$, 'vikriti', 'level3', 'childhood', $p$My relationship with food growing up was...$p$, $opts$[
    {"label": "Relaxed", "dosha": [], "imageUrl": null},
    {"label": "Strict", "dosha": [], "imageUrl": null},
    {"label": "Food was comforting", "dosha": [], "imageUrl": null},
    {"label": "Meals were rushed", "dosha": [], "imageUrl": null},
    {"label": "We rarely ate together", "dosha": [], "imageUrl": null},
    {"label": "Home-cooked most nights", "dosha": [], "imageUrl": null},
    {"label": "I don't remember much", "dosha": [], "imageUrl": null},
    {"label": "My food story began differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 40, false, false, 'multi_select'),

  ($id$story-childhood-household$id$, 'vikriti', 'level3', 'childhood', $p$Growing up, our household often felt...$p$, $opts$[
    {"label": "Calm", "dosha": [], "imageUrl": null},
    {"label": "Busy", "dosha": [], "imageUrl": null},
    {"label": "Chaotic", "dosha": [], "imageUrl": null},
    {"label": "Predictable", "dosha": [], "imageUrl": null},
    {"label": "Stressful", "dosha": [], "imageUrl": null},
    {"label": "Loving", "dosha": [], "imageUrl": null},
    {"label": "Uncertain", "dosha": [], "imageUrl": null},
    {"label": "My home life doesn't fit these choices.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 50, false, false, 'multi_select'),

  ($id$story-childhood-overall$id$, 'vikriti', 'level3', 'childhood', $p$Looking back, childhood mostly felt...$p$, $opts$[
    {"label": "Safe", "dosha": [], "imageUrl": null},
    {"label": "Adventurous", "dosha": [], "imageUrl": null},
    {"label": "Stressful", "dosha": [], "imageUrl": null},
    {"label": "Lonely", "dosha": [], "imageUrl": null},
    {"label": "Joyful", "dosha": [], "imageUrl": null},
    {"label": "Unpredictable", "dosha": [], "imageUrl": null},
    {"label": "A mix of many things", "dosha": [], "imageUrl": null},
    {"label": "My story is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 60, false, false, 'multi_select'),

  ($id$story-family-health-patterns$id$, 'vikriti', 'level3', 'family_patterns', $p$Health patterns I noticed in my family...$p$, $opts$[
    {"label": "Anxiety", "dosha": [], "imageUrl": null},
    {"label": "Digestive issues", "dosha": [], "imageUrl": null},
    {"label": "Autoimmune conditions", "dosha": [], "imageUrl": null},
    {"label": "Diabetes", "dosha": [], "imageUrl": null},
    {"label": "Heart disease", "dosha": [], "imageUrl": null},
    {"label": "Weight struggles", "dosha": [], "imageUrl": null},
    {"label": "Depression", "dosha": [], "imageUrl": null},
    {"label": "My family's story is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 200, false, false, 'multi_select'),

  ($id$story-family-adult-habits$id$, 'vikriti', 'level3', 'family_patterns', $p$The adults around me usually...$p$, $opts$[
    {"label": "Took good care of themselves", "dosha": [], "imageUrl": null},
    {"label": "Ignored their health", "dosha": [], "imageUrl": null},
    {"label": "Dieted often", "dosha": [], "imageUrl": null},
    {"label": "Worked constantly", "dosha": [], "imageUrl": null},
    {"label": "Handled stress well", "dosha": [], "imageUrl": null},
    {"label": "Struggled with stress", "dosha": [], "imageUrl": null},
    {"label": "I grew up seeing something different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 210, false, false, 'multi_select'),

  ($id$story-family-movement$id$, 'vikriti', 'level3', 'family_patterns', $p$Growing up, movement and exercise were...$p$, $opts$[
    {"label": "Encouraged", "dosha": [], "imageUrl": null},
    {"label": "Required", "dosha": [], "imageUrl": null},
    {"label": "Rarely talked about", "dosha": [], "imageUrl": null},
    {"label": "Mostly sports", "dosha": [], "imageUrl": null},
    {"label": "Mostly outdoor play", "dosha": [], "imageUrl": null},
    {"label": "Not a big part of life", "dosha": [], "imageUrl": null},
    {"label": "My experience was different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 220, false, false, 'multi_select'),

  ($id$story-family-food-meaning$id$, 'vikriti', 'level3', 'family_patterns', $p$Food in my family was mostly...$p$, $opts$[
    {"label": "Celebration", "dosha": [], "imageUrl": null},
    {"label": "Fuel", "dosha": [], "imageUrl": null},
    {"label": "Comfort", "dosha": [], "imageUrl": null},
    {"label": "Stressful", "dosha": [], "imageUrl": null},
    {"label": "Highly structured", "dosha": [], "imageUrl": null},
    {"label": "Very flexible", "dosha": [], "imageUrl": null},
    {"label": "Food meant something different in my family.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 230, false, false, 'multi_select'),

  ($id$story-family-lesson$id$, 'vikriti', 'level3', 'family_patterns', $p$Looking back, my family taught me...$p$, $opts$[
    {"label": "To push through", "dosha": [], "imageUrl": null},
    {"label": "To slow down", "dosha": [], "imageUrl": null},
    {"label": "To care for others first", "dosha": [], "imageUrl": null},
    {"label": "To be independent", "dosha": [], "imageUrl": null},
    {"label": "To always stay busy", "dosha": [], "imageUrl": null},
    {"label": "To listen to my body", "dosha": [], "imageUrl": null},
    {"label": "I learned something different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 240, false, false, 'multi_select'),

  ($id$story-life-chapters$id$, 'vikriti', 'level3', 'life_chapters', $p$Which chapters have shaped your health?$p$, $opts$[
    {"label": "College", "dosha": [], "imageUrl": null},
    {"label": "Night shift", "dosha": [], "imageUrl": null},
    {"label": "Parenting", "dosha": [], "imageUrl": null},
    {"label": "Divorce", "dosha": [], "imageUrl": null},
    {"label": "Marriage", "dosha": [], "imageUrl": null},
    {"label": "Caregiving", "dosha": [], "imageUrl": null},
    {"label": "Starting a business", "dosha": [], "imageUrl": null},
    {"label": "Burnout", "dosha": [], "imageUrl": null},
    {"label": "Major move", "dosha": [], "imageUrl": null},
    {"label": "Retirement", "dosha": [], "imageUrl": null},
    {"label": "My journey has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 500, false, false, 'multi_select'),

  ($id$story-relationship-with-food$id$, 'vikriti', 'level3', 'relationship_with_food', $p$[PLACEHOLDER -- Matt to supply the lead-in question]$p$, $opts$[
    {"label": "I've dieted for years.", "dosha": [], "imageUrl": null},
    {"label": "I don't trust my hunger.", "dosha": [], "imageUrl": null},
    {"label": "Food causes stress.", "dosha": [], "imageUrl": null},
    {"label": "I eat emotionally.", "dosha": [], "imageUrl": null},
    {"label": "I forget to eat.", "dosha": [], "imageUrl": null},
    {"label": "I've tried almost every diet.", "dosha": [], "imageUrl": null},
    {"label": "I have a peaceful relationship with food.", "dosha": [], "imageUrl": null},
    {"label": "My relationship with food tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 800, false, false, 'multi_select'),

  ($id$story-mindset$id$, 'vikriti', 'level3', 'mindset', $p$[PLACEHOLDER -- Matt to supply the lead-in question]$p$, $opts$[
    {"label": "I usually put myself last.", "dosha": [], "imageUrl": null},
    {"label": "I struggle asking for help.", "dosha": [], "imageUrl": null},
    {"label": "I feel guilty resting.", "dosha": [], "imageUrl": null},
    {"label": "I have trouble slowing down.", "dosha": [], "imageUrl": null},
    {"label": "I'm hard on myself.", "dosha": [], "imageUrl": null},
    {"label": "I'm learning to trust my body.", "dosha": [], "imageUrl": null},
    {"label": "My inner story feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 850, false, false, 'multi_select'),

  ($id$story-healthiest-chapter$id$, 'vikriti', 'level3', 'whole_story', $p$Looking back, when do you remember feeling your healthiest?$p$, $opts$[
    {"label": "Childhood", "dosha": [], "imageUrl": null},
    {"label": "High school", "dosha": [], "imageUrl": null},
    {"label": "College", "dosha": [], "imageUrl": null},
    {"label": "Before children", "dosha": [], "imageUrl": null},
    {"label": "After children", "dosha": [], "imageUrl": null},
    {"label": "Within the past year", "dosha": [], "imageUrl": null},
    {"label": "I've never really felt my healthiest", "dosha": [], "imageUrl": null},
    {"label": "My healthiest chapter looks different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 900, false, false, 'multi_select'),

  ($id$story-body-change-onset$id$, 'vikriti', 'level3', 'whole_story', $p$When did you first notice your body starting to change?$p$, $opts$[
    {"label": "It happened gradually.", "dosha": [], "imageUrl": null},
    {"label": "It happened after a major life event.", "dosha": [], "imageUrl": null},
    {"label": "Pregnancy or postpartum.", "dosha": [], "imageUrl": null},
    {"label": "During a stressful season.", "dosha": [], "imageUrl": null},
    {"label": "During a health condition.", "dosha": [], "imageUrl": null},
    {"label": "I'm not sure.", "dosha": [], "imageUrl": null},
    {"label": "My timeline is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 910, false, false, 'multi_select'),

  ($id$story-biggest-impact$id$, 'vikriti', 'level3', 'whole_story', $p$Looking at your entire journey, what do you believe has had the biggest impact on your health? (Select up to three.)$p$, $opts$[
    {"label": "Stress", "dosha": [], "imageUrl": null},
    {"label": "Sleep", "dosha": [], "imageUrl": null},
    {"label": "Food", "dosha": [], "imageUrl": null},
    {"label": "Hormones", "dosha": [], "imageUrl": null},
    {"label": "Relationships", "dosha": [], "imageUrl": null},
    {"label": "Work", "dosha": [], "imageUrl": null},
    {"label": "Parenthood", "dosha": [], "imageUrl": null},
    {"label": "Mental health", "dosha": [], "imageUrl": null},
    {"label": "Illness", "dosha": [], "imageUrl": null},
    {"label": "Environment", "dosha": [], "imageUrl": null},
    {"label": "Movement", "dosha": [], "imageUrl": null},
    {"label": "I don't know yet", "dosha": [], "imageUrl": null},
    {"label": "My story doesn't fit into a single category.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 920, false, false, 'multi_select'),

  ($id$story-letter-to-practitioner$id$, 'vikriti', 'level3', 'reflection', $p$If there is one thing you wish someone understood about your health journey, what would you tell them?$p$, $opts$[]$opts$::jsonb, 999, false, false, 'free_text');
