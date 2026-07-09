# Voice Memo Transcripts

Source material for the L. Glow voice guide and all clinical content. These are Thea's voice memos, transcribed locally with WhisperDesktop (ggml-medium model). They are the canonical record of her teaching in her own words and should be treated as primary source material — anything the app says clinically should be traceable back to one of these files (or to future transcripts that get added here).

For a topic-first, fast-scan view of this same material (e.g. "which transcript covers X"), see `docs/transcripts-index.md`. This README is the file-by-file index in recording order; that doc is organized by subject instead. For the full text of every transcript in one file (e.g. to search across all of them at once), see `docs/transcripts-master.txt` — a generated concatenation, not a separate source; the individual files below remain canonical.

## Files

The numbering reflects the order they were recorded, not necessarily the order of the original question prompts. Filenames follow the pattern `NN_description_MMDDYY_NN.txt` where the trailing code (when present) is the original transcription batch identifier — kept in the filename so existing citations like "transcript 21 (062126_02)" throughout the other docs still resolve to the right file after renaming.

1. **01_things_she_says_all_the_time.txt** — the core principles Thea repeats with clients. Contains "nothing is for everybody, everything is for somebody," "like increases like, opposites bring balance," and the canonical ice cream teaching story.

2. **02_what_are_we_getting_wrong.txt** — Thea's contrarian wellness corrections. Snacking, fruit alone, salads need warmth, dinner should be small, carbs aren't the enemy, fat is good. Also includes the "we are what we digest" line and the abhyanga (self-massage) framing.

3. **03_client_story.txt** — Thea's first case study, which turned out to be Matt. Contains the *symptom → system → small adjustment → follow-up* practitioner shape, the janitor metaphor for sleep, "double bonus sleep" (10pm–2am window), and morning hunger as a digestive fire signal.

4. **04_dosha_explanation.txt** — How Thea introduces the doshas to a beginner. Contains the colors metaphor and the body-anatomy grounding for each element. Foundational for the dosha intro screens and the future "about your doshas" view.

5. **05_vata_dosha_.txt** — Deep dive into all three doshas with a full physical and mental comparison table: height, frame, weight, skin, eyes, hair, teeth, nails, joints, circulation, appetite, thirst, sweat, elimination, sensitivities, immunity, disease patterns, activity, endurance, sleep, dreams, memory, speech, temperament, emotions, and faith. Also covers prakriti vs vikriti. Adapted into `data/content/quiz.js` doshaInfo `traits` fields (June 2026, DRAFT).

6. **06_gunas.txt** — Introduction to the Three Gunas (Sattva, Rajas, Tamas) from the Bhagavad Gita tradition. Covers definitions, the Law of Alternation, and the Law of Continuity. Day/night/sunrise as guna metaphor. Adapted into the `gunas-mental` Learn entry (June 2026, DRAFT).

7. **07_gunas_2.txt** — How to cultivate sattva: right diet, physical purification, sense control, mantra, devotion. Sattva as the key to Ayurvedic healing. Disease as tamasic state; acute disease as rajasic. Admixtures of gunas (rajistic sattva, tamasic rajas, etc.). Adapted into the `cultivating-sattva` Learn entry (June 2026, DRAFT).

8. **08_listen_to_your_gut.txt** — Mental Constitution Chart: a 24-dimension Guna self-assessment (Sattvic / Rajasic / Tamasic) covering diet, sleep, speech, anger, fear, desire, love, concentration, creativity, spiritual practice, and more. Thea explicitly flags this as a future app feature: *"This is really fun for the app — something we can definitely bring in when somebody is comfortable."* Scaffolded as roadmap item #32.

9. **09_prana_tejas_ojas.txt** — Prana (life force/air), Tejas (inner fire/radiance), and Ojas (stored vitality/water) as the three vital essences. How they relate to each other and to the doshas. Parallels to Chinese medicine's Qi/Yin/Yang. Adapted into the expanded `ojas` Learn entry (June 2026, DRAFT).

10. **10_3_bodies_5_sheaths.txt** — The three bodies (physical, subtle, causal) and five sheaths (koshas) from Vedic philosophy. **Explicitly excluded from the app by Thea** ("This is all a little bit woo woo to me. I don't know if I want to add any of this in there."). Do not adapt this content into app screens.

11. **11_doshas_2.txt** — Duplicate of 05_vata_dosha_.txt. Same content recorded in a second session. No additional information. No further adaptation needed.

12. **12_intake_form.txt** — First section of the client intake form: contact fields, what to expect from an Ayurveda consultation, her scope-of-practice language ("not a medical doctor... will not diagnose, treat, or prescribe"), and the presenting-concerns opening questions. Source for the intake consent screen (`app/intake.js`).

13. **13_feedback_060826.txt** — Thea talking with a friend (Gabi): part elevator pitch, part live dosha-quiz user testing, part business conversation. Transcript is incomplete at the end. Distilled notes: `docs/notes-transcript-13.md`. Contains the clearest short-form description of the app's purpose she's given, the $1.99–$2.99 pricing conversation, the August 17th launch-date meaning, and live UX reactions to draft quiz questions (wrist-circumference test, multi-select needed for skin/hair) — this is the field research behind roadmap item #18.

14. **14_intake_form_2.txt** — Second intake section: the Prakriti constitution evaluation (physical structure, physical function, psychological function), each with full Vata/Pitta/Kapha comparison tables. Distilled notes: `docs/notes-transcript-14.md`. Explicitly tied to the 1:1 coaching upsell — "ideally we go through this in the first coaching session." Wants multi-select and a "none of these" skip on every question.

15. **15_dosha_quiz_redesign.txt** — Thea's full voice memo on the redesigned dosha quiz: all three constitutional types described in detail, named question areas, and the sequencing principle (easy/physical questions first, subjective questions saved for last). This is the source for the 14-question set now live in `data/content/quiz.js` (roadmap #18, shipped July 2026).

15b. **15b_gunas_mental.txt** — *(renamed from `15_gunas_mental.txt` — two unrelated transcripts had both been numbered 15; this one keeps the "15" position but with a `b` suffix rather than cascading every later file's number.)* Sattva/Rajas/Tamas full teaching: the still-lake metaphor, each guna's gifts and excess-state watch-fors, and the complete diet/lifestyle/spiritual practice lists for cultivating or moving through each. This is the direct source for `data/content/gunaQuiz.js`'s `gunaResults` and the `gunas-mental` Learn entry.

16. **16_gunas_quality_and_quiz.txt** — The 20 physical qualities (gunas) organized into 10 opposing pairs (heavy/light, hot/cold, etc.), and how each dosha's elements map to a qualities-cluster. The "like increases like, opposites bring balance" principle applied practically — "how can you be more like honey? Honey is sticky, so bring in the opposite." Source for the `gunas-qualitative` Learn entry.

17. **17_dosha_quiz_marketing_draft_061926_01.txt** — An earlier, distinct pass at the dosha quiz — more marketing/UX brainstorm than clinical content: percentage-slider format ideas, taglines ("Discover your unique DOSHA composition"), celebrity examples for body-frame options, and a registration/email-capture flow. Not the question set that shipped (see #15) — kept as a record of an alternate direction that was tried and moved away from.

18. **18_guna_result_copy_061926_02.txt** — Same Sattva/Rajas/Tamas content as 15b, recorded as a second pass specifically framed as *result-screen copy* ("I want the results to feel very personal"). This is the transcript actually cited as "transcript 18" throughout the app (guna result copy).

19. **19_dosha_archetypes_061926_03.txt** — The dosha archetypes: Vata as "The Wanderer," Pitta as "The Warrior," Kapha as "The Keeper" — balanced/imbalanced traits, the trap/truth/reminder structure for each. Source for `quiz.js`'s `doshaInfo.archetype` fields and the affirmations pulled from it (`v-4`, `p-4`, `k-4`).

20. **20_what_is_ayurveda_062126_01.txt** — "What is Ayurveda?" — the 5,000-year-old system, why it went underground, the Ayur (life) + Veda (knowledge) etymology, and "we don't ask what's wrong with you, we ask what's out of balance." Source for the `what-is-ayurveda` Learn entry.

21. **21_agni_digestive_fire_062126_02.txt** — Agni (digestive fire): the four Agni types (Sama/Vishama/Tikshna/Manda), the Agni–Ama cycle, and "your body digests more than meals — it digests experience, emotion, relationships." Source for the `agni` Learn entry *and* `data/content/agniQuiz.js`'s assessment results.

22. **22_food_as_medicine_062126_03.txt** — Food as medicine: the "it depends" answer to "what should I eat," the eight factors that determine whether a food supports or disrupts (who you are, preparation, food pairing, quantity, source, timing, current state, season), and the hand-portion-size teaching. Source for the `food-as-medicine` Learn entry.

23. **23_vata_food_list_062126_04.txt** — Full Vata-reducing diet: grains, vegetables, fruits, nuts/seeds, oils, spices, dairy, and sweeteners, each broken into best/good/not-beneficial/avoid. Feeds roadmap item #38 (dosha food recommendations) and the future herb+food database (#36). **Several ingredient names came through garbled from Whisper** — see `docs/notes-transcript-23-25.md` for the specific spelling questions awaiting Thea's confirmation before this gets loaded into the app.

24. **24_pitta_food_list_062126_05.txt** — Same structure as #23, for Pitta. Same garbled-ingredient caveat — see `docs/notes-transcript-23-25.md`.

25. **25_kapha_food_list_062126_06.txt** — Same structure again, for Kapha. Same garbled-ingredient caveat — see `docs/notes-transcript-23-25.md`.

26. **26_five_elements_062126_07.txt** — The five elements (Earth, Water, Fire, Air, Ether): what each governs in body/mind/spirit/nature, what each sounds like in and out of balance, and the "elements aren't things, they're patterns" framing (the tree-as-all-five-elements example). Source for the `pancha-mahabhutas` Learn entry.

27. **27_tongue_pulse_assessment_062426_01.txt** — Full tongue self-assessment teaching (shape/size/color/coating/other signs/tongue map) plus the disclaimer language Thea wrote herself, including "these are clues, not conclusions." Pulse content not yet recorded — she said she'd send it separately. Source for `app/tongue-check.js`, `app/tongue-result.js`, and `data/content/tongueCheck.js`.

28. **28_app_architecture_pillars_062526_01.txt** — Thea's brain-dump on the app's overall architecture and vision: the four pillars (Lifestyle, Movement, Herbs, Nourishment — and why "movement" replaces "exercise" and "nourishment" replaces "diet"), the Sound Library concept, "Freedom with Food" and "Weight Balancing" as signature areas, and the line that became the app's design north star: *"If every feature answered this question I think that would be good — what does my body need today?"*

## Sanskrit terms — Whisper transcription notes

WhisperDesktop's medium model is excellent at English but does not know Sanskrit. The transcripts contain several misrenderings that should be corrected wherever this content is adapted into the app:

| What Whisper wrote | Correct term |
|---|---|
| Arvada | Ayurveda |
| Kaffa, Kafa, CAFSA, coffins | Kapha |
| ovni, ogny | agni (digestive fire) |
| concept element | kapha element |
| cough season | kapha season |
| mama | ama (toxic sludge / undigested residue) |

Vata and Pitta are usually rendered correctly. Doshas, prakriti, and abhyanga also tend to come through correctly. Ingredient and spice names in the food-list transcripts (23–25) fared worse — see `docs/notes-transcript-23-25.md`.

## Known content questions for Thea's review

- In **04_dosha_explanation.txt**, near the end, the line *"any change then leads to what we call Prakriti"* — based on context, Thea almost certainly meant **vikriti** (current state) rather than **prakriti** (constitution / home base). Confirmed across both Otter and Whisper transcriptions, so this isn't a transcription artifact — it's a small in-the-moment slip. Same slip recurs in **17_dosha_quiz_marketing_draft_061926_01.txt**, line ~251. Worth confirming her preferred way of teaching both terms.

- "The other part" she mentioned needing to explain the doshas fully — answered. It was agni and ama (see #21 and the `ama` Learn entry, already approved and live).

- **23–25 (the food lists)** have a full set of Whisper mis-hears awaiting her confirmation — see `docs/notes-transcript-23-25.md`. Do not load these into the app's data files until that's resolved.

## How to use these files

- The voice guide (`docs/voice-guide.md`) is the distilled, structured summary of these transcripts. Read the voice guide first; come back to the transcripts for primary-source detail.
- When drafting any clinical content for the app, the relevant transcript should be the source. Quote or adapt Thea's language closely; do not invent ayurvedic content.
- Do not edit the transcripts themselves. They are the historical record. Corrections (Sanskrit spellings etc.) happen when the content is adapted into the app, not in the transcripts. (Filenames were renamed July 2026 for organization — see git history for the original names. File *content* was never touched.)

## Adding new transcripts

Future voice memos should be transcribed locally with WhisperDesktop (medium model or better — large-v3 if available, since it handles Sanskrit slightly better in our limited testing) and added to this folder with the next sequential number **and** a short description in the filename (`NN_description.txt`, or `NN_description_MMDDYY_NN.txt` if there's an original batch code worth preserving).

The full process — naming, indexing here and in `docs/transcripts-index.md`, and checking cross-references elsewhere in the docs — is documented once, as a standing rule, in `CLAUDE.md` under "Transcript hygiene." Follow it every time; don't let this folder drift out of sync with its own index again.
