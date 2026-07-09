# Transcripts — Master Index by Topic

Fast-scan reference for "which transcript covers X." For the file-by-file list in recording order (with Whisper transcription notes and filename conventions), see `docs/transcripts/README.md`. Both point at the same 29 files — nothing here is a copy of the content, just a map to it.

---

## Core philosophy & principles

- **01_things_she_says_all_the_time** — the five core principles: "nothing is for everybody, everything is for somebody," "like increases like, opposites bring balance," the ice cream teaching story.
- **02_what_are_we_getting_wrong** — contrarian wellness corrections (snacking, fruit alone, small dinners, carbs/fat aren't the enemy), "we are what we digest," abhyanga framing.
- **13_feedback_060826** — clearest short-form description of the app's purpose she's given; also business/pricing/positioning (see below).
- **28_app_architecture_pillars** — the four pillars, the design north star line ("what does my body need today?"), Freedom with Food, Weight Balancing, Sound Library vision.

## Doshas — teaching & explanation

- **04_dosha_explanation** — how she introduces doshas to a beginner; colors metaphor, body-anatomy grounding. Contains the prakriti/vikriti slip (see README's "known content questions").
- **05_vata_dosha_** / **11_doshas_2** (duplicate) — full physical/mental comparison table across all three doshas.
- **19_dosha_archetypes_061926_03** — Wanderer / Warrior / Keeper archetypes with trap/truth/reminder structure.

## Dosha quiz — design & redesign

- **13_feedback_060826** — live user-testing session (Gabi), field research behind the redesign.
- **15_dosha_quiz_redesign** — the redesign that shipped: question areas, sequencing principle, all three types described in depth. **This is the live quiz in `data/content/quiz.js`.**
- **17_dosha_quiz_marketing_draft_061926_01** — an earlier, different direction (percentage sliders, marketing taglines, celebrity examples). Not what shipped — kept for the record.
- **14_intake_form_2** — the clinical-depth counterpart used in the intake form's Prakriti section; same UX requirements (multi-select, "none of these") as the quiz redesign.

## Gunas — mental qualities (Sattva / Rajas / Tamas)

- **06_gunas** — introduction from the Bhagavad Gita tradition; Law of Alternation, Law of Continuity.
- **07_gunas_2** — cultivating sattva: diet, purification, sense control, mantra, devotion.
- **08_listen_to_your_gut** — the 24-dimension Guna self-assessment (roadmap item #32, the in-app Guna Quiz).
- **15b_gunas_mental** / **18_guna_result_copy_061926_02** (same content, two passes) — full Sattva/Rajas/Tamas teaching with diet/lifestyle/spiritual practices for each. **This is the live guna quiz result copy in `data/content/gunaQuiz.js`.**

## Gunas — physical qualities (the 20 qualities)

- **16_gunas_quality_and_quiz** — the 10 opposing-quality pairs (heavy/light, hot/cold, etc.) and how each dosha's elements cluster onto them. Practical "like increases like" application.

## Agni & Ama (digestion)

- **21_agni_digestive_fire_062126_02** — the four Agni types, the Agni–Ama cycle, "your body digests more than meals." Source for both the Learn entry and the live Agni Assessment (`data/content/agniQuiz.js`).
- *(Ama's Learn entry is already approved/live — its source transcript predates this numbered set; see `data/content/learn.js` for the `ama` entry's attribution.)*

## Five Elements

- **26_five_elements_062126_07** — Earth/Water/Fire/Air/Ether: body/mind/spirit/nature mapping for each, balance and excess states, "elements aren't things, they're patterns."

## Food & diet

- **22_food_as_medicine_062126_03** — the "it depends" framing, the eight factors, hand-portion-size teaching. Source for the `food-as-medicine` Learn entry.
- **23_vata_food_list_062126_04**, **24_pitta_food_list_062126_05**, **25_kapha_food_list_062126_06** — full best/good/not-beneficial/avoid food lists per dosha. **Blocked on Thea confirming garbled ingredient names** — see `docs/notes-transcript-23-25.md` before this loads into the app (feeds roadmap #38).

## Intake form / client onboarding

- **12_intake_form** — contact fields, consultation expectations, scope-of-practice language. Source for `app/intake.js`'s consent screen.
- **14_intake_form_2** — Prakriti constitution section (physical structure/function, psychological function tables). Distilled notes: `docs/notes-transcript-14.md`.

## Tongue & pulse self-assessment

- **27_tongue_pulse_assessment_062426_01** — full tongue teaching (shape/size/color/coating/signs/map) plus her own disclaimer language ("these are clues, not conclusions"). Pulse content not yet recorded.

## Business, pricing, positioning

- **13_feedback_060826** — $1.99–$2.99 pricing conversation, August 17th launch date and its meaning, Aura app as nearest comp, the Ozempic counter-narrative, "weight balancing not weight loss." Distilled notes: `docs/notes-transcript-13.md`.
- **28_app_architecture_pillars** — the pillar structure and long-term feature vision.

## Explicitly excluded from the app

- **10_3_bodies_5_sheaths** — three bodies / five koshas from Vedic philosophy. Thea's own call: *"This is all a little bit woo woo to me."* Do not adapt into app content.

---

## Open items across all transcripts

- **Prakriti/vikriti slip** — appears in both `04_dosha_explanation` and `17_dosha_quiz_marketing_draft_061926_01`. Worth confirming her preferred teaching of both terms once, rather than treating each instance separately.
- **Food list spelling questions** — `docs/notes-transcript-23-25.md`, blocking transcripts 23–25 from being loaded.
- **Pulse assessment** — mentioned in 27 but not yet recorded; she said she'd send it separately.
- **"The other part"** she felt was missing to fully explain doshas — resolved; it was agni/ama (21, and the already-approved `ama` entry).
