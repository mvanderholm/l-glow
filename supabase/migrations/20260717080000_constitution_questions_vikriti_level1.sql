-- L. Glow — Vikriti Level 1: "Check Your Signals" (21 questions).
-- Run in the Supabase SQL Editor after the prior migrations. No schema
-- changes — reuses assessment/tier/allow_none/photo_enabled/options as-is.
--
-- First Vikriti content. Matt's framing: Prakriti answers "what blueprint
-- did nature give you" (relatively fixed); Vikriti answers "how is that
-- blueprint expressing itself today" (constantly changing) — a 2-4 week
-- lookback on how the body's been communicating, not who someone has
-- always been. Deliberately not framed as "another dosha quiz."
--
-- Two real structural differences from every Prakriti tier:
--
-- 1. FOUR substantive options per question, not three — vata-leaning,
--    pitta-leaning, kapha-leaning, and a "balanced/no signal" fourth
--    option (e.g. "My energy feels balanced and consistent"). That fourth
--    option's dosha array is expected to stay empty by design, not because
--    it's untagged — same empty-array representation as "not yet tagged"
--    elsewhere in this table, so it'll read as pending until someone
--    confirms it's intentionally neutral. Worth a pass once real tagging
--    starts, so "deliberately balanced" and "just not tagged yet" don't
--    get confused.
--
-- 2. allow_none = true on all 21, and the escape copy itself is different
--    from Prakriti's "None of these really sound like me" — this set uses
--    "None of these are speaking to me" (Matt's explicit preference,
--    reads as specific to Vikriti's "listening to the body" framing, not
--    a retroactive rename of Prakriti's copy). The actual escape text
--    isn't stored per-question — same as Prakriti's intro/guidance copy,
--    it's a screen-level constant for whichever assessment is active,
--    keyed off the `assessment` column, not new per-row data.
--
-- IDs prefixed signal- (matching "Check Your Signals") since a few topics
-- overlap Prakriti Foundation's slugs (appetite, digestion) and id is a
-- shared primary key across every tier/assessment in this table.
--
-- section left null for all 21 — the source content was a flat list with
-- no topic headers this time (unlike Prakriti's FACE/EYES/etc. groupings),
-- so nothing's been inferred or invented here.
--
-- Not stored anywhere yet: the intro/framing copy Matt wrote for before
-- the assessment starts ("Think about the past 2-4 weeks... Your body
-- isn't failing you, it's giving you clues..."). No consumer quiz screen
-- exists yet for any tier, so there's nowhere to put it — keep this
-- migration's comment as the record of that copy until a real screen
-- gets built and it needs a home (roadmap #52).

insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order, allow_none, photo_enabled) values

  ($id$signal-energy$id$, 'vikriti', 'level1', null, $p$Over the past 2-4 weeks, how has your energy felt most days?$p$, $opts$[
    {"label": "My energy changes constantly. I have bursts of energy followed by crashes.", "dosha": [], "imageUrl": null},
    {"label": "My energy feels steady, but I run hot or feel driven most days.", "dosha": [], "imageUrl": null},
    {"label": "My energy has felt lower than usual. Everything feels heavier.", "dosha": [], "imageUrl": null},
    {"label": "My energy feels balanced and consistent.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 1, true, false),

  ($id$signal-sleep$id$, 'vikriti', 'level1', null, $p$During the past 2-4 weeks, how have you been sleeping?$p$, $opts$[
    {"label": "I struggle to fall asleep or stay asleep.", "dosha": [], "imageUrl": null},
    {"label": "I sleep, but often wake feeling warm or alert.", "dosha": [], "imageUrl": null},
    {"label": "I sleep a lot but still don't feel fully rested.", "dosha": [], "imageUrl": null},
    {"label": "I've been sleeping well.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 2, true, false),

  ($id$signal-stress-reaction$id$, 'vikriti', 'level1', null, $p$When life feels stressful lately, what has your first reaction been?$p$, $opts$[
    {"label": "Worry or overthinking.", "dosha": [], "imageUrl": null},
    {"label": "Frustration or irritability.", "dosha": [], "imageUrl": null},
    {"label": "Shutting down or withdrawing.", "dosha": [], "imageUrl": null},
    {"label": "I recover pretty well from stress.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 3, true, false),

  ($id$signal-digestion$id$, 'vikriti', 'level1', null, $p$How has your digestion felt recently?$p$, $opts$[
    {"label": "Unpredictable.", "dosha": [], "imageUrl": null},
    {"label": "Strong, but sometimes too intense.", "dosha": [], "imageUrl": null},
    {"label": "Slow or heavy.", "dosha": [], "imageUrl": null},
    {"label": "Consistent.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 4, true, false),

  ($id$signal-appetite$id$, 'vikriti', 'level1', null, $p$Your appetite lately has been...$p$, $opts$[
    {"label": "Different every day.", "dosha": [], "imageUrl": null},
    {"label": "Strong and hard to ignore.", "dosha": [], "imageUrl": null},
    {"label": "Low or sluggish.", "dosha": [], "imageUrl": null},
    {"label": "Predictable.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 5, true, false),

  ($id$signal-cravings$id$, 'vikriti', 'level1', null, $p$What have you been craving most often lately?$p$, $opts$[
    {"label": "Crunchy, salty, or dry foods.", "dosha": [], "imageUrl": null},
    {"label": "Cold, refreshing foods.", "dosha": [], "imageUrl": null},
    {"label": "Sweet, rich, or comforting foods.", "dosha": [], "imageUrl": null},
    {"label": "Nothing really stands out.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 6, true, false),

  ($id$signal-bowel$id$, 'vikriti', 'level1', null, $p$Your bowel movements over the past few weeks have been...$p$, $opts$[
    {"label": "Irregular.", "dosha": [], "imageUrl": null},
    {"label": "Regular, but occasionally loose.", "dosha": [], "imageUrl": null},
    {"label": "Slow or difficult.", "dosha": [], "imageUrl": null},
    {"label": "Healthy and consistent.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 7, true, false),

  ($id$signal-body-temp$id$, 'vikriti', 'level1', null, $p$Lately your body has generally felt...$p$, $opts$[
    {"label": "Cold.", "dosha": [], "imageUrl": null},
    {"label": "Hot.", "dosha": [], "imageUrl": null},
    {"label": "Heavy or damp.", "dosha": [], "imageUrl": null},
    {"label": "Comfortable.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 8, true, false),

  ($id$signal-mind$id$, 'vikriti', 'level1', null, $p$Your mind lately feels...$p$, $opts$[
    {"label": "Busy and difficult to slow down.", "dosha": [], "imageUrl": null},
    {"label": "Focused, but easily frustrated.", "dosha": [], "imageUrl": null},
    {"label": "Foggy or sluggish.", "dosha": [], "imageUrl": null},
    {"label": "Clear.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 9, true, false),

  ($id$signal-emotions$id$, 'vikriti', 'level1', null, $p$Which emotions have shown up the most recently?$p$, $opts$[
    {"label": "Anxiety or nervousness.", "dosha": [], "imageUrl": null},
    {"label": "Irritation or impatience.", "dosha": [], "imageUrl": null},
    {"label": "Low motivation or emotional heaviness.", "dosha": [], "imageUrl": null},
    {"label": "I feel emotionally balanced.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 10, true, false),

  ($id$signal-body-tension$id$, 'vikriti', 'level1', null, $p$Your body has recently felt...$p$, $opts$[
    {"label": "Tight or tense.", "dosha": [], "imageUrl": null},
    {"label": "Inflamed or sensitive.", "dosha": [], "imageUrl": null},
    {"label": "Heavy or stiff.", "dosha": [], "imageUrl": null},
    {"label": "Comfortable.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 11, true, false),

  ($id$signal-skin$id$, 'vikriti', 'level1', null, $p$Recently your skin has been...$p$, $opts$[
    {"label": "Dry.", "dosha": [], "imageUrl": null},
    {"label": "Sensitive or breaking out.", "dosha": [], "imageUrl": null},
    {"label": "Oily or congested.", "dosha": [], "imageUrl": null},
    {"label": "Normal.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 12, true, false),

  ($id$signal-movement$id$, 'vikriti', 'level1', null, $p$How has movement felt lately?$p$, $opts$[
    {"label": "I have lots of restless or nervous energy.", "dosha": [], "imageUrl": null},
    {"label": "I like pushing myself and staying active.", "dosha": [], "imageUrl": null},
    {"label": "It's hard to get myself moving.", "dosha": [], "imageUrl": null},
    {"label": "Movement feels balanced.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 13, true, false),

  ($id$signal-focus$id$, 'vikriti', 'level1', null, $p$Your ability to focus has been...$p$, $opts$[
    {"label": "Easily distracted.", "dosha": [], "imageUrl": null},
    {"label": "Very focused, but intense.", "dosha": [], "imageUrl": null},
    {"label": "Slow or unmotivated.", "dosha": [], "imageUrl": null},
    {"label": "Normal.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 14, true, false),

  ($id$signal-stress-recovery$id$, 'vikriti', 'level1', null, $p$After a stressful day, you usually...$p$, $opts$[
    {"label": "Need a long time to calm down.", "dosha": [], "imageUrl": null},
    {"label": "Stay mentally \"on\" for hours.", "dosha": [], "imageUrl": null},
    {"label": "Feel completely drained.", "dosha": [], "imageUrl": null},
    {"label": "Bounce back fairly quickly.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 15, true, false),

  ($id$signal-morning$id$, 'vikriti', 'level1', null, $p$Most mornings you wake up feeling...$p$, $opts$[
    {"label": "Alert but restless.", "dosha": [], "imageUrl": null},
    {"label": "Ready to go.", "dosha": [], "imageUrl": null},
    {"label": "Groggy.", "dosha": [], "imageUrl": null},
    {"label": "Refreshed.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 16, true, false),

  ($id$signal-post-meal$id$, 'vikriti', 'level1', null, $p$After eating, you usually feel...$p$, $opts$[
    {"label": "Different after almost every meal.", "dosha": [], "imageUrl": null},
    {"label": "Warm or overly full.", "dosha": [], "imageUrl": null},
    {"label": "Heavy or sleepy.", "dosha": [], "imageUrl": null},
    {"label": "Comfortable and energized.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 17, true, false),

  ($id$signal-dryness-thirst$id$, 'vikriti', 'level1', null, $p$Lately you've noticed...$p$, $opts$[
    {"label": "Dry lips or dry mouth.", "dosha": [], "imageUrl": null},
    {"label": "Feeling warm or thirsty.", "dosha": [], "imageUrl": null},
    {"label": "Puffiness or water retention.", "dosha": [], "imageUrl": null},
    {"label": "None of these have really stood out.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 18, true, false),

  ($id$signal-body-freq$id$, 'vikriti', 'level1', null, $p$Which signals has your body been giving you the most lately?$p$, $opts$[
    {"label": "Restlessness.", "dosha": [], "imageUrl": null},
    {"label": "Heat.", "dosha": [], "imageUrl": null},
    {"label": "Heaviness.", "dosha": [], "imageUrl": null},
    {"label": "My body has felt fairly balanced.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 19, true, false),

  ($id$signal-vs-normal$id$, 'vikriti', 'level1', null, $p$Compared to your normal, you currently feel...$p$, $opts$[
    {"label": "Scattered.", "dosha": [], "imageUrl": null},
    {"label": "Intense.", "dosha": [], "imageUrl": null},
    {"label": "Stuck.", "dosha": [], "imageUrl": null},
    {"label": "Like myself.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 20, true, false),

  ($id$signal-body-request$id$, 'vikriti', 'level1', null, $p$If your body could say one thing right now, what would it be asking for?$p$, $opts$[
    {"label": "Slow me down.", "dosha": [], "imageUrl": null},
    {"label": "Cool me down.", "dosha": [], "imageUrl": null},
    {"label": "Get me moving.", "dosha": [], "imageUrl": null},
    {"label": "Keep doing what you're doing.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 21, true, false);
