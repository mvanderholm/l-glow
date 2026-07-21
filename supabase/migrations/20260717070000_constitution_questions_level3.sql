-- L. Glow — Prakriti Level 3: "Practitioner Observation" (33 observations).
-- Run in the Supabase SQL Editor after the prior migrations. No schema
-- changes here — allow_none and photo_enabled already exist from the
-- Level 2 migration.
--
-- Matt reframed this tier while writing it: originally planned as 33 more
-- self-report questions (to hit a symbolic 108 total across all three
-- levels), but he caught himself drifting into life-history territory
-- (illness, pregnancy, trauma) that belongs to Vikriti, not Prakriti. This
-- tier is now "Practitioner Observation" — framed as the app quietly
-- observing constitution the way a practitioner would during an intake,
-- not another self-report questionnaire. Matt's own words: "I almost don't
-- even think of these as questions. I think of them as observations."
--
-- IDs prefixed obs- throughout, not because the schema requires it, but
-- because several of these observations reuse the same body-part words as
-- Level 2 questions (forehead, palms, fingers, feet, posture) and `id` is
-- a shared primary key across every tier in this table — the prefix avoids
-- collision and reads consistently with Matt's own "observation" framing.
--
-- allow_none = false on all 33: unlike Level 2, the source content for this
-- tier never showed a "None of these really sound like me" line on any of
-- the 33 items (Foundation and part of Level 2 did) — read as a real
-- difference for this tier's observational framing, not an omission.
-- Flip any of them via the admin editor if that reading's wrong.
--
-- photo_enabled = true on 27 of 33 (all of Face/Nose/Mouth/Hair/most of
-- Skin/Hands/Feet); false on Movement & Presence (posture/walk/presence —
-- behavioral, not visually matchable to an illustration) and 3 Skin items
-- (veins, skin thickness, skin stretch — feel/observation, not a shape to
-- illustrate). Matches Matt's own 📷 markers in the source content.

insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order, allow_none, photo_enabled) values

  ($id$obs-forehead-width$id$, 'prakriti', 'level3', 'face', $p$Which forehead most closely resembles yours?$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 1, false, true),

  ($id$obs-forehead-slope$id$, 'prakriti', 'level3', 'face', $p$Which forehead slope most resembles yours?$p$, $opts$[
    {"label": "More sloped", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "More upright", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 2, false, true),

  ($id$obs-temple-width$id$, 'prakriti', 'level3', 'face', $p$Which temple width best matches yours?$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 3, false, true),

  ($id$obs-eye-distance$id$, 'prakriti', 'level3', 'face', $p$Which distance between your eyes is closest?$p$, $opts$[
    {"label": "Close together", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Wider apart", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 4, false, true),

  ($id$obs-eye-depth$id$, 'prakriti', 'level3', 'face', $p$Which eye depth best matches yours?$p$, $opts$[
    {"label": "Deep set", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "More prominent", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 5, false, true),

  ($id$obs-eyelid-shape$id$, 'prakriti', 'level3', 'face', $p$Which eyelid shape best matches yours?$p$, $opts$[
    {"label": "Hooded", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "More open", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 6, false, true),

  ($id$obs-nose-bridge$id$, 'prakriti', 'level3', 'nose', $p$Which bridge best resembles your nose?$p$, $opts$[
    {"label": "Low", "dosha": [], "imageUrl": null},
    {"label": "Straight", "dosha": [], "imageUrl": null},
    {"label": "More pronounced", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 7, false, true),

  ($id$obs-nose-tip$id$, 'prakriti', 'level3', 'nose', $p$Which nose tip most closely matches yours?$p$, $opts$[
    {"label": "Pointed", "dosha": [], "imageUrl": null},
    {"label": "Rounded", "dosha": [], "imageUrl": null},
    {"label": "Fuller", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 8, false, true),

  ($id$obs-nose-profile$id$, 'prakriti', 'level3', 'nose', $p$Looking from the side, your nose is...$p$, $opts$[
    {"label": "Straighter", "dosha": [], "imageUrl": null},
    {"label": "Slightly curved", "dosha": [], "imageUrl": null},
    {"label": "More rounded", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 9, false, true),

  ($id$obs-smile-width$id$, 'prakriti', 'level3', 'mouth', $p$Your smile is naturally...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Wide", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 10, false, true),

  ($id$obs-upper-lip$id$, 'prakriti', 'level3', 'mouth', $p$Your upper lip is...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Full", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 11, false, true),

  ($id$obs-lower-lip$id$, 'prakriti', 'level3', 'mouth', $p$Your lower lip is...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Full", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 12, false, true),

  ($id$obs-teeth-spacing$id$, 'prakriti', 'level3', 'mouth', $p$Your teeth are naturally...$p$, $opts$[
    {"label": "Close together", "dosha": [], "imageUrl": null},
    {"label": "Evenly spaced", "dosha": [], "imageUrl": null},
    {"label": "More widely spaced", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 13, false, true),

  ($id$obs-tongue-width$id$, 'prakriti', 'level3', 'mouth', $p$Your tongue (not coating) is naturally...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Broader", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 14, false, true),

  ($id$obs-hairline$id$, 'prakriti', 'level3', 'hair', $p$Your natural hairline is...$p$, $opts$[
    {"label": "Higher", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Lower", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 15, false, true),

  ($id$obs-hair-growth$id$, 'prakriti', 'level3', 'hair', $p$Your hair naturally grows...$p$, $opts$[
    {"label": "Straight", "dosha": [], "imageUrl": null},
    {"label": "Wavy", "dosha": [], "imageUrl": null},
    {"label": "Curly", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 16, false, true),

  ($id$obs-hair-strands$id$, 'prakriti', 'level3', 'hair', $p$Your hair strands are...$p$, $opts$[
    {"label": "Fine", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 17, false, true),

  ($id$obs-hair-volume$id$, 'prakriti', 'level3', 'hair', $p$Your hair naturally has...$p$, $opts$[
    {"label": "Less volume", "dosha": [], "imageUrl": null},
    {"label": "Moderate volume", "dosha": [], "imageUrl": null},
    {"label": "Lots of volume", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 18, false, true),

  ($id$obs-pores$id$, 'prakriti', 'level3', 'skin', $p$Your pores are generally...$p$, $opts$[
    {"label": "Small", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Larger", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 19, false, true),

  ($id$obs-veins$id$, 'prakriti', 'level3', 'skin', $p$Veins on your hands and arms are...$p$, $opts$[
    {"label": "Easily visible", "dosha": [], "imageUrl": null},
    {"label": "Sometimes visible", "dosha": [], "imageUrl": null},
    {"label": "Rarely visible", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 20, false, false),

  ($id$obs-skin-thickness$id$, 'prakriti', 'level3', 'skin', $p$Your skin tends to feel...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Thick", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 21, false, false),

  ($id$obs-skin-stretch$id$, 'prakriti', 'level3', 'skin', $p$Your skin naturally stretches...$p$, $opts$[
    {"label": "Very easily", "dosha": [], "imageUrl": null},
    {"label": "Moderately", "dosha": [], "imageUrl": null},
    {"label": "Less easily", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 22, false, false),

  ($id$obs-palm-proportion$id$, 'prakriti', 'level3', 'hands', $p$Your palms are...$p$, $opts$[
    {"label": "Longer than wide", "dosha": [], "imageUrl": null},
    {"label": "Balanced", "dosha": [], "imageUrl": null},
    {"label": "Wider than long", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 23, false, true),

  ($id$obs-fingers$id$, 'prakriti', 'level3', 'hands', $p$Your fingers are...$p$, $opts$[
    {"label": "Long and slender", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Shorter and broader", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 24, false, true),

  ($id$obs-knuckles$id$, 'prakriti', 'level3', 'hands', $p$Your knuckles are...$p$, $opts$[
    {"label": "Prominent", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Soft and less noticeable", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 25, false, true),

  ($id$obs-thumb$id$, 'prakriti', 'level3', 'hands', $p$Your thumb naturally feels...$p$, $opts$[
    {"label": "Thin", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 26, false, true),

  ($id$obs-palm-padding$id$, 'prakriti', 'level3', 'hands', $p$Your palms naturally have...$p$, $opts$[
    {"label": "Less padding", "dosha": [], "imageUrl": null},
    {"label": "Moderate padding", "dosha": [], "imageUrl": null},
    {"label": "More padding", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 27, false, true),

  ($id$obs-foot-arch$id$, 'prakriti', 'level3', 'feet', $p$Your foot arch is...$p$, $opts$[
    {"label": "High", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Lower", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 28, false, true),

  ($id$obs-foot-width$id$, 'prakriti', 'level3', 'feet', $p$Your feet are...$p$, $opts$[
    {"label": "Narrow", "dosha": [], "imageUrl": null},
    {"label": "Average", "dosha": [], "imageUrl": null},
    {"label": "Broad", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 29, false, true),

  ($id$obs-toes$id$, 'prakriti', 'level3', 'feet', $p$Your toes are...$p$, $opts$[
    {"label": "Long and slender", "dosha": [], "imageUrl": null},
    {"label": "Medium", "dosha": [], "imageUrl": null},
    {"label": "Shorter and broader", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 30, false, true),

  ($id$obs-posture$id$, 'prakriti', 'level3', 'movement_presence', $p$Your natural posture is...$p$, $opts$[
    {"label": "Light and relaxed", "dosha": [], "imageUrl": null},
    {"label": "Upright and balanced", "dosha": [], "imageUrl": null},
    {"label": "Grounded and steady", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 31, false, false),

  ($id$obs-walk$id$, 'prakriti', 'level3', 'movement_presence', $p$When you walk, your movement feels...$p$, $opts$[
    {"label": "Light and quick", "dosha": [], "imageUrl": null},
    {"label": "Confident and purposeful", "dosha": [], "imageUrl": null},
    {"label": "Slow and steady", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 32, false, false),

  ($id$obs-presence$id$, 'prakriti', 'level3', 'movement_presence', $p$Your natural presence is best described as...$p$, $opts$[
    {"label": "Light, expressive, and constantly moving", "dosha": [], "imageUrl": null},
    {"label": "Focused, intentional, and confident", "dosha": [], "imageUrl": null},
    {"label": "Calm, grounded, and reassuring", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 33, false, false);
