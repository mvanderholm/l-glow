# Lavender Glow — Project Context for Claude Code

You are assisting on Lavender Glow, an ayurvedic companion app built with React Native and Expo. Read this file carefully at the start of every session. The principles and constraints here are load-bearing — they should shape every suggestion you make.

---

## What Lavender Glow is

Lavender Glow is **Thea's ayurvedic practice, in app form**. Thea is a credentialed ayurvedic practitioner and Registered Yoga Teacher (RYT). The name Lavender Glow is the brand for her practice.

This is not a generic wellness app with a credentialed advisor. It is one specific practitioner's worldview, voice, and methodology, made available to users between (or in lieu of) sessions with her. When in doubt about any content decision: "would Thea say this, in this way?" If no, it doesn't belong in the app.

The app is the first foray toward a physical ayurvedic healing center Thea will open in 3–5 years, where she will be the head practitioner. The app's long-term job is to be the digital expression and funnel for that practice. Build every decision with that horizon in mind — this is not a startup MVP racing a runway, it is a long-form craft project that must hold up for years.

**Matt (the developer / project owner) is not a credentialed practitioner yet and is intentionally absent from the app's public face until he is.** All practitioner voice in the app is Thea's.

---

## The five core principles (from the voice guide)

1. **Nothing is for everybody. Everything is for somebody.** Never say "X is good" or "X is bad" as universal truth. Every recommendation is contextual to the person, the season, and the moment.
2. **Like increases like. Opposites bring balance.** The operating principle underneath every recommendation.
3. **We are what we digest, not what we eat.** Digestion is physical, mental, and emotional. The check-in is about what hasn't been processed yet, not just "how do you feel."
4. **There is no good. There is no bad. There just is.** Imbalance is information, not failure. The app never scolds or shames.
5. **It changes.** What someone needed yesterday isn't what they need today. The daily check-in honors this.

---

## Tone rules

- Warm, funny, a little irreverent. A friend on a walk, not a guru on a cushion.
- Light, well-placed swearing is allowed and on-brand for Thea. Use sparingly so it stays earned.
- Allergic to performative wellness: no breathy spa-speak, no "sacred temple," no "journey." If a sentence sounds like it belongs on a candle, cut it.
- Specific over abstract: "sit on the floor and cross your legs" beats "create a mindful eating environment."
- Reframe restriction as discernment. Carbs are beautiful. Fat is good. Ice cream is medicine in the right season.
- Honest about uncertainty. "Don't quote me on that one" is a real practitioner move and can be preserved where it fits.

---

## What the app will NOT do

- Tell users a food is "bad" or "off-limits."
- Use the word "should" without complicating it immediately after.
- Use guilt-inducing mechanics (punishing streaks, red Xs, shaming language).
- Prescribe rigid rules that don't account for the person, the season, or the day.
- Reproduce content from any practitioner training program, including ones Thea attended (Shakti School etc.). Her own voice and original writing only.
- Make medical claims or position itself as a substitute for clinical care.

---

## Content authorship rules — READ BEFORE WRITING ANY USER-FACING COPY

**All clinical and practitioner content in the app is authored by Thea.** As Claude Code, you should not invent dosha explanations, food recommendations, herb guidance, seasonal protocols, or asana suggestions on your own and ship them. You may:

- Scaffold the data structure for new content (empty entries, correct shape, placeholder fields).
- Restructure or reformat existing content Thea has authored.
- Draft copy in her voice *only* for review, clearly flagged as a draft for Thea to approve or rewrite.
- Write non-clinical app copy (button labels, navigation, error messages, technical UI text).

You may NOT:

- Invent specific clinical recommendations (herbs, dosages, food lists, postures) and present them as authoritative.
- Paraphrase from any ayurvedic training manual, even to sound more legitimate.
- Add "plausible-sounding" ayurvedic content to fill gaps. Empty is better than fabricated.

When encountering placeholder content from the original scaffold (e.g., the herb summaries in `data/herbs.js`, the recommendation lists in `data/recommendations.js`), treat it as a draft awaiting Thea's review, not as approved content. Flag it as such in comments if you touch those files.

---

## Voice guide location

The authoritative voice and philosophy document is at `docs/voice-guide.md`. Read it when drafting any user-facing copy. It is Thea's document to approve — the current version is v0.3 awaiting her review.

---

## Technical stack

- Expo SDK 54, React 19, React Native 0.81
- expo-router for file-based routing (`app/` directory)
- `react-native-svg` for rendering the logo components
- `@react-native-async-storage/async-storage` for local persistence (installed, being introduced for the first time)
- No backend yet. No auth yet. No analytics. Mark 1 is local-only.

When adding features, prefer: local state + AsyncStorage over network calls; built-in React Native components over new dependencies; one file changes over sprawling refactors.

---

## Directory conventions

- `app/` — expo-router screens. One file per route.
- `components/` — reusable components. Keep small.
- `data/` — content Thea authors (`quiz.js`, `recommendations.js`, `herbs.js`, future `movement.js`). Every file here needs Thea's sign-off before shipping.
- `theme/` — design tokens. Don't hardcode colors, spacing, or typography in screens.
- `assets/` — static files (SVG logos).
- `docs/` — project documentation (voice guide, roadmap).

**Suggested future refactor** (do when introducing asana content, not before): split `data/` into `data/content/` (Thea-authored) and `data/user/` (AsyncStorage-backed user state). The split makes it obvious which files need clinical review.

---

## Current roadmap

The active priority list is maintained at `docs/roadmap.md`. Read it at the start of any session where you're picking up new work. Do not work on items out of order without confirming with Matt first — the priorities reflect a deliberate sequence.

---

## How to work with Matt

- Matt is a senior product manager and a capable developer. Explain the *why* of suggestions, not just the *what*.
- When making changes, show diffs or summaries before applying large edits. He wants to understand, not just ship.
- When a task involves clinical content, stop and check with him about whether Thea has approved the source material before writing.
- Prefer a well-argued "here's why I'd approach this differently" over silent compliance with a request that has a problem.
- He's studying to eventually become a junior practitioner. Briefly name the ayurvedic principle underneath a change when it's relevant — it doubles as learning. Don't over-explain.
- Three-to-five-year horizon for the app and the eventual center. Patience over speed.

---

## How to work with Thea (when she reviews content directly)

She may eventually mark up content files or the voice guide directly. Treat her edits as authoritative for clinical content. If her edits conflict with something you wrote earlier, hers wins.

---

## Safety and scope

- This app is wellness guidance, not medical advice. Never write copy that diagnoses, prescribes for specific conditions, or contradicts "see a doctor" guidance for serious symptoms.
- Be especially careful with dietary content. Restrictive food rules can land badly for users with histories of disordered eating. Thea has final call on dietary language; flag specific lines for her review rather than making those calls yourself.
- No user data leaves the device in mark 1. Keep it that way until there's an explicit decision to add a backend.
