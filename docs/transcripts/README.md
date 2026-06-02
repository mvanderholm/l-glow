# Voice Memo Transcripts

Source material for the Lavender Glow voice guide and all clinical content. These are Thea's voice memos, transcribed locally with WhisperDesktop (ggml-medium model). They are the canonical record of her teaching in her own words and should be treated as primary source material — anything the app says clinically should be traceable back to one of these files (or to future transcripts that get added here).

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

## Adding new transcripts

Future voice memos should be transcribed locally with WhisperDesktop (medium model or better — large-v3 if available, since it handles Sanskrit slightly better in our limited testing) and added to this folder with the next sequential number and a descriptive name. Update this README's file list when adding new entries.
