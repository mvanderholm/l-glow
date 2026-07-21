-- L. Glow — Prakriti Level 2 (54 questions) + two new per-question fields.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Two schema additions to constitution_questions, both requested by Matt
-- alongside this content:
--
-- 1. allow_none (boolean) — whether the "None of these really sound like
--    me" escape shows on a given question. Foundation treated this as
--    universal; the Level 2 source content showed it explicitly on some
--    questions (Q1-14, Q54) and omitted it on others (Q15-53, the more
--    objective/observable-trait questions) — ambiguous whether that was
--    deliberate or just paste shorthand. Matt's call: make it real
--    per-question data, toggleable in the admin editor, rather than assume
--    either way. Seeded here exactly matching what was shown/omitted in the
--    source content — flip any of them later via the admin editor, no
--    schema change needed either direction.
--
-- 2. photo_enabled (boolean) — whether this question is a candidate for
--    Matt's illustration/photo-matching vision (pick an illustration, or
--    upload/take a photo, to identify which option matches you). NOT
--    building the illustration assets, photo upload, or match-suggestion
--    logic yet — that's real feature work (art assets + camera/upload UI +
--    a matching algorithm), tracked as its own roadmap item. This flag and
--    the options.imageUrl field below just mean the data model doesn't
--    need reshaping later when that work starts — "designing for where
--    we're eventually going instead of redesigning it," per Matt's framing.
--    True on the 15 Level 2 questions Matt marked with a camera icon
--    (mostly Face & Head, plus eyes/nails); false elsewhere.
--
-- options also gains an optional imageUrl key per option (null for all
-- rows today — no illustration assets exist yet) so a future illustration
-- can be wired in by editing existing rows, not migrating the shape.

alter table public.constitution_questions
  add column allow_none boolean not null default true,
  add column photo_enabled boolean not null default false;

-- Auto-generated seed from Matt's Prakriti Level 2 content, July 17 2026 — option dosha tags intentionally left empty, assign via admin editor. imageUrl null pending illustration assets.
insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order, allow_none, photo_enabled) values

  ($id$face-shape$id$, 'prakriti', 'level2', 'face', $p$Which face shape most closely resembles yours?$p$, $opts$[
    {"label": "Long or narrow", "dosha": [], "imageUrl": null},
    {"label": "Oval or balanced", "dosha": [], "imageUrl": null},
    {"label": "Round or fuller", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 1, true, true),

  ($id$forehead$id$, 'prakriti', 'level2', 'face', $p$Which forehead best matches yours?$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 2, true, true),

  ($id$jawline$id$, 'prakriti', 'level2', 'face', $p$Which jawline best matches yours?$p$, $opts$[
    {"label": "Delicate", "dosha": [], "imageUrl": null},
    {"label": "Defined", "dosha": [], "imageUrl": null},
    {"label": "Broad or strong", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 3, true, true),

  ($id$chin$id$, 'prakriti', 'level2', 'face', $p$Which chin best resembles yours?$p$, $opts$[
    {"label": "Pointed", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Rounded", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 4, true, true),

  ($id$nose-size$id$, 'prakriti', 'level2', 'face', $p$Which nose size best matches yours?$p$, $opts$[
    {"label": "Small", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Larger", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 5, true, true),

  ($id$nose-shape$id$, 'prakriti', 'level2', 'face', $p$Which nose shape most closely resembles yours?$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Straight", "dosha": [], "imageUrl": null},
    {"label": "Fuller or rounded", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 6, true, true),

  ($id$lips$id$, 'prakriti', 'level2', 'face', $p$Which lips most closely resemble yours?$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Full", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 7, true, true),

  ($id$neck$id$, 'prakriti', 'level2', 'face', $p$Which neck best describes yours?$p$, $opts$[
    {"label": "Long and slender", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Shorter or thicker", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 8, true, true),

  ($id$eye-size$id$, 'prakriti', 'level2', 'eyes', $p$Which eye size best matches yours?$p$, $opts$[
    {"label": "Small", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Large", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 9, true, true),

  ($id$eye-shape$id$, 'prakriti', 'level2', 'eyes', $p$Which eye shape best matches yours?$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Almond", "dosha": [], "imageUrl": null},
    {"label": "Round", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 10, true, true),

  ($id$eye-moisture$id$, 'prakriti', 'level2', 'eyes', $p$Your eyes naturally feel...$p$, $opts$[
    {"label": "Dry", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Moist", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 11, true, false),

  ($id$eyebrows$id$, 'prakriti', 'level2', 'eyes', $p$My eyebrows are naturally...$p$, $opts$[
    {"label": "Fine", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 12, true, true),

  ($id$eyelashes$id$, 'prakriti', 'level2', 'eyes', $p$My eyelashes are naturally...$p$, $opts$[
    {"label": "Fine", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 13, true, true),

  ($id$eye-expression$id$, 'prakriti', 'level2', 'eyes', $p$People usually describe my eyes as...$p$, $opts$[
    {"label": "Curious", "dosha": [], "imageUrl": null},
    {"label": "Intense", "dosha": [], "imageUrl": null},
    {"label": "Gentle", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 14, true, false),

  ($id$skin-thickness$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My skin thickness is...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 15, false, false),

  ($id$skin-texture$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My skin texture is...$p$, $opts$[
    {"label": "Dry or rough", "dosha": [], "imageUrl": null},
    {"label": "Smooth", "dosha": [], "imageUrl": null},
    {"label": "Soft or naturally moisturized", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 16, false, false),

  ($id$skin-oiliness$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My skin naturally...$p$, $opts$[
    {"label": "Rarely gets oily", "dosha": [], "imageUrl": null},
    {"label": "Stays balanced", "dosha": [], "imageUrl": null},
    {"label": "Gets oily easily", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 17, false, false),

  ($id$hair-density$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My hair density is...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 18, false, false),

  ($id$hair-texture$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My hair texture is...$p$, $opts$[
    {"label": "Fine", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Coarse", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 19, false, false),

  ($id$hair-oiliness$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My hair naturally tends to be...$p$, $opts$[
    {"label": "Dry", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Oily", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 20, false, false),

  ($id$nail-strength$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My nails are naturally...$p$, $opts$[
    {"label": "Thin or brittle", "dosha": [], "imageUrl": null},
    {"label": "Smooth", "dosha": [], "imageUrl": null},
    {"label": "Thick or hard", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 21, false, false),

  ($id$nail-beds$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My nail beds are...$p$, $opts$[
    {"label": "Long", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Short", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 22, false, true),

  ($id$nail-shape$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My nail shape is closest to...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Oval", "dosha": [], "imageUrl": null},
    {"label": "Wide", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 23, false, true),

  ($id$nail-condition$id$, 'prakriti', 'level2', 'skin_hair_nails', $p$My nails most often...$p$, $opts$[
    {"label": "Peel or split", "dosha": [], "imageUrl": null},
    {"label": "Stay healthy", "dosha": [], "imageUrl": null},
    {"label": "Are very strong", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 24, false, false),

  ($id$shoulders$id$, 'prakriti', 'level2', 'body', $p$My shoulders are naturally...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 25, false, false),

  ($id$chest$id$, 'prakriti', 'level2', 'body', $p$My chest/rib cage is...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 26, false, false),

  ($id$wrists$id$, 'prakriti', 'level2', 'body', $p$My wrists are...$p$, $opts$[
    {"label": "Small", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Large", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 27, false, false),

  ($id$fingers$id$, 'prakriti', 'level2', 'body', $p$My fingers are naturally...$p$, $opts$[
    {"label": "Long and thin", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Shorter or thicker", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 28, false, false),

  ($id$palms$id$, 'prakriti', 'level2', 'body', $p$My palms are...$p$, $opts$[
    {"label": "Long", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Square or broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 29, false, true),

  ($id$hips$id$, 'prakriti', 'level2', 'body', $p$My hips are naturally...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Wide", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 30, false, false),

  ($id$ankles$id$, 'prakriti', 'level2', 'body', $p$My ankles are...$p$, $opts$[
    {"label": "Small", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 31, false, false),

  ($id$feet$id$, 'prakriti', 'level2', 'body', $p$My feet are naturally...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 32, false, false),

  ($id$weight-tendency$id$, 'prakriti', 'level2', 'body', $p$I naturally...$p$, $opts$[
    {"label": "Lose weight easily", "dosha": [], "imageUrl": null},
    {"label": "Stay fairly consistent", "dosha": [], "imageUrl": null},
    {"label": "Gain weight easily", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 33, false, false),

  ($id$muscle-building$id$, 'prakriti', 'level2', 'body', $p$I build muscle...$p$, $opts$[
    {"label": "Slowly", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Easily", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 34, false, false),

  ($id$thirst$id$, 'prakriti', 'level2', 'digestion', $p$I naturally feel thirsty...$p$, $opts$[
    {"label": "Rarely", "dosha": [], "imageUrl": null},
    {"label": "Regularly", "dosha": [], "imageUrl": null},
    {"label": "Frequently", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 35, false, false),

  ($id$mouth-moisture$id$, 'prakriti', 'level2', 'digestion', $p$My mouth is usually...$p$, $opts$[
    {"label": "Dry", "dosha": [], "imageUrl": null},
    {"label": "Comfortable", "dosha": [], "imageUrl": null},
    {"label": "Moist", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 36, false, false),

  ($id$sweat$id$, 'prakriti', 'level2', 'digestion', $p$I naturally sweat...$p$, $opts$[
    {"label": "Very little", "dosha": [], "imageUrl": null},
    {"label": "Moderately", "dosha": [], "imageUrl": null},
    {"label": "Easily", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 37, false, false),

  ($id$body-temp$id$, 'prakriti', 'level2', 'digestion', $p$My body temperature usually feels...$p$, $opts$[
    {"label": "Cooler than others", "dosha": [], "imageUrl": null},
    {"label": "Comfortable", "dosha": [], "imageUrl": null},
    {"label": "Warmer than others", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 38, false, false),

  ($id$hunger-pattern$id$, 'prakriti', 'level2', 'digestion', $p$I usually feel hungry...$p$, $opts$[
    {"label": "Inconsistently", "dosha": [], "imageUrl": null},
    {"label": "At regular times", "dosha": [], "imageUrl": null},
    {"label": "Frequently", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 39, false, false),

  ($id$missed-meal$id$, 'prakriti', 'level2', 'digestion', $p$If I miss a meal, I usually...$p$, $opts$[
    {"label": "Barely notice", "dosha": [], "imageUrl": null},
    {"label": "Feel hungry but okay", "dosha": [], "imageUrl": null},
    {"label": "Need food immediately", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 40, false, false),

  ($id$metabolism$id$, 'prakriti', 'level2', 'digestion', $p$My metabolism feels...$p$, $opts$[
    {"label": "Variable", "dosha": [], "imageUrl": null},
    {"label": "Steady", "dosha": [], "imageUrl": null},
    {"label": "Fast", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 41, false, false),

  ($id$digestion-strength$id$, 'prakriti', 'level2', 'digestion', $p$My digestion is usually...$p$, $opts$[
    {"label": "Sensitive", "dosha": [], "imageUrl": null},
    {"label": "Consistent", "dosha": [], "imageUrl": null},
    {"label": "Strong", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 42, false, false),

  ($id$walking-pace$id$, 'prakriti', 'level2', 'energy', $p$My natural walking pace is...$p$, $opts$[
    {"label": "Fast", "dosha": [], "imageUrl": null},
    {"label": "Purposeful", "dosha": [], "imageUrl": null},
    {"label": "Steady", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 43, false, false),

  ($id$speaking-pace$id$, 'prakriti', 'level2', 'energy', $p$My natural speaking pace is...$p$, $opts$[
    {"label": "Fast", "dosha": [], "imageUrl": null},
    {"label": "Moderate", "dosha": [], "imageUrl": null},
    {"label": "Slow", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 44, false, false),

  ($id$reactions$id$, 'prakriti', 'level2', 'energy', $p$My reactions are usually...$p$, $opts$[
    {"label": "Quick", "dosha": [], "imageUrl": null},
    {"label": "Thoughtful", "dosha": [], "imageUrl": null},
    {"label": "Calm", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 45, false, false),

  ($id$endurance$id$, 'prakriti', 'level2', 'energy', $p$My endurance is...$p$, $opts$[
    {"label": "Short bursts", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Long-lasting", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 46, false, false),

  ($id$flexibility$id$, 'prakriti', 'level2', 'energy', $p$My flexibility is...$p$, $opts$[
    {"label": "Very flexible", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Naturally stiff", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 47, false, false),

  ($id$activity-recovery$id$, 'prakriti', 'level2', 'energy', $p$After physical activity, I...$p$, $opts$[
    {"label": "Recover quickly", "dosha": [], "imageUrl": null},
    {"label": "Recover normally", "dosha": [], "imageUrl": null},
    {"label": "Need more recovery time", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 48, false, false),

  ($id$memory$id$, 'prakriti', 'level2', 'tendencies', $p$My memory is naturally...$p$, $opts$[
    {"label": "Quick to learn, quick to forget", "dosha": [], "imageUrl": null},
    {"label": "Sharp and detailed", "dosha": [], "imageUrl": null},
    {"label": "Slow to learn, hard to forget", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 49, false, false),

  ($id$voice$id$, 'prakriti', 'level2', 'tendencies', $p$My voice is naturally...$p$, $opts$[
    {"label": "Light or airy", "dosha": [], "imageUrl": null},
    {"label": "Clear and strong", "dosha": [], "imageUrl": null},
    {"label": "Deep or soothing", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 50, false, false),

  ($id$reliance-role$id$, 'prakriti', 'level2', 'tendencies', $p$People usually rely on me for...$p$, $opts$[
    {"label": "Creative ideas", "dosha": [], "imageUrl": null},
    {"label": "Leadership", "dosha": [], "imageUrl": null},
    {"label": "Stability", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 51, false, false),

  ($id$posture$id$, 'prakriti', 'level2', 'tendencies', $p$My natural posture is...$p$, $opts$[
    {"label": "Light and relaxed", "dosha": [], "imageUrl": null},
    {"label": "Upright and confident", "dosha": [], "imageUrl": null},
    {"label": "Grounded and steady", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 52, false, false),

  ($id$handshake$id$, 'prakriti', 'level2', 'tendencies', $p$My handshake is usually...$p$, $opts$[
    {"label": "Light", "dosha": [], "imageUrl": null},
    {"label": "Firm", "dosha": [], "imageUrl": null},
    {"label": "Strong and steady", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 53, false, false),

  ($id$life-summary$id$, 'prakriti', 'level2', 'tendencies', $p$Looking back over your life, which statement feels the most true?$p$, $opts$[
    {"label": "I've always felt naturally energetic and adaptable.", "dosha": [], "imageUrl": null},
    {"label": "I've always felt naturally driven and focused.", "dosha": [], "imageUrl": null},
    {"label": "I've always felt naturally steady and dependable.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 54, true, false);
