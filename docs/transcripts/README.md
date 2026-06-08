# Voice Memo Transcripts

Source material for the L. Glow voice guide and all clinical content. These are Thea's voice memos, transcribed locally with WhisperDesktop (ggml-medium model). They are the canonical record of her teaching in her own words and should be treated as primary source material — anything the app says clinically should be traceable back to one of these files (or to future transcripts that get added here).

## Files

The numbering reflects the order they were recorded, not necessarily the order of the original question prompts.

1. **01_things_she_says_all_the_time.txt** — the core principles Thea repeats with clients. Contains "nothing is for everybody, everything is for somebody," "like increases like, opposites bring balance," and the canonical ice cream teaching story.

2. **02_what_are_we_getting_wrong.txt** — Thea's contrarian wellness corrections. Snacking, fruit alone, salads need warmth, dinner should be small, carbs aren't the enemy, fat is good. Also includes the "we are what we digest" line and the abhyanga (self-massage) framing.

3. **03_client_story.txt** — Thea's first case study, which turned out to be Matt. Contains the *symptom → system → small adjustment → follow-up* practitioner shape, the janitor metaphor for sleep, "double bonus sleep" (10pm–2am window), and morning hunger as a digestive fire signal.

4. **04_dosha_explanation.txt** — How Thea introduces the doshas to a beginner. Contains the colors metaphor and the body-anatomy grounding for each element. Foundational for the dosha intro screens and the future "about your doshas" view.

## Sanskrit terms — Whisper transcription notes

WhisperDesktop's medium model is excellent at English but does not know Sanskrit. The transcripts contain several misrenderings that should be corrected wherever this content is adapted into the app:

| What Whisper wrote | Correct term |
|---|---|
| Arvada | Ayurveda |
| Kaffa, Kafa | Kapha |
| ovni, ogny | agni (digestive fire) |
| concept element | kapha element |
| cough season | kapha season |
| mama | ama (toxic sludge / undigested residue) |

Vata and Pitta are usually rendered correctly. Doshas, prakriti, and abhyanga also tend to come through correctly.

## Known content questions for Thea's review

- In **04_dosha_explanation.txt**, near the end, the line *"any change then leads to what we call Prakriti"* — based on context, Thea almost certainly meant **vikriti** (current state) rather than **prakriti** (constitution / home base). Confirmed across both Otter and Whisper transcriptions, so this isn't a transcription artifact — it's a small in-the-moment slip. Worth confirming her preferred way of teaching both terms.

- In **04_dosha_explanation.txt**, Thea closes with *"it's hard to explain doshas without the other part"* and trails off. "The other part" is likely either agni (digestion) or the gunas (qualities). Worth asking her to record this piece next.

## How to use these files

- The voice guide (`docs/voice-guide.md`) is the distilled, structured summary of these transcripts. Read the voice guide first; come back to the transcripts for primary-source detail.
- When drafting any clinical content for the app, the relevant transcript should be the source. Quote or adapt Thea's language closely; do not invent ayurvedic content.
- Do not edit the transcripts themselves. They are the historical record. Corrections (Sanskrit spellings etc.) happen when the content is adapted into the app, not in the transcripts.

5. **05_vata_dosha_.txt** — Deep dive into all three doshas with a full physical and mental comparison table: height, frame, weight, skin, eyes, hair, teeth, nails, joints, circulation, appetite, thirst, sweat, elimination, sensitivities, immunity, disease patterns, activity, endurance, sleep, dreams, memory, speech, temperament, emotions, and faith. Also covers prakriti vs vikriti. Adapted into `data/content/quiz.js` doshaInfo `traits` fields (June 2026, DRAFT).

6. **06_gunas.txt** — Introduction to the Three Gunas (Sattva, Rajas, Tamas) from the Bhagavad Gita tradition. Covers definitions, the Law of Alternation, and the Law of Continuity. Day/night/sunrise as guna metaphor. Adapted into the `gunas-mental` Learn entry (June 2026, DRAFT).

7. **07_gunas_2.txt** — How to cultivate sattva: right diet, physical purification, sense control, mantra, devotion. Sattva as the key to Ayurvedic healing. Disease as tamasic state; acute disease as rajasic. Admixtures of gunas (rajistic sattva, tamasic rajas, etc.). Adapted into the `cultivating-sattva` Learn entry (June 2026, DRAFT).

8. **08_listen_to_your_gut.txt** — Mental Constitution Chart: a 24-dimension Guna self-assessment (Sattvic / Rajasic / Tamasic) covering diet, sleep, speech, anger, fear, desire, love, concentration, creativity, spiritual practice, and more. Thea explicitly flags this as a future app feature: *"This is really fun for the app — something we can definitely bring in when somebody is comfortable."* Scaffolded as roadmap item #32.

9. **09_prana_tejas_ojas.txt** — Prana (life force/air), Tejas (inner fire/radiance), and Ojas (stored vitality/water) as the three vital essences. How they relate to each other and to the doshas. Parallels to Chinese medicine's Qi/Yin/Yang. Adapted into the expanded `ojas` Learn entry (June 2026, DRAFT).

10. **10_3_bodies_5_sheaths.txt** — The three bodies (physical, subtle, causal) and five sheaths (koshas) from Vedic philosophy. **Explicitly excluded from the app by Thea** ("This is all a little bit woo woo to me. I don't know if I want to add any of this in there."). Do not adapt this content into app screens.

11. **11_doshas_2.txt** — Duplicate of 05_vata_dosha_.txt. Same content recorded in a second session. No additional information. No further adaptation needed.

## Adding new transcripts

Future voice memos should be transcribed locally with WhisperDesktop (medium model or better — large-v3 if available, since it handles Sanskrit slightly better in our limited testing) and added to this folder with the next sequential number and a descriptive name. Update this README's file list when adding new entries.
