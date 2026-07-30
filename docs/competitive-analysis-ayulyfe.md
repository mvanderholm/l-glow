# Competitive analysis — AyuLyfe / Ayuworld

Source: 31 screenshots Thea sent (`iCloud Photos from Thea Circo.zip`, received July 20 2026). All screenshots are of the same Android app — onboarding carousel, splash screen names it **AyuLyfe**; the status bar / header on every other screen reads **Ayuworld**; the recipe/ingredient module is sub-branded **Ayumeal**. Read as one product with an unresolved or mid-rebrand naming situation, not three separate apps. No pricing/paywall screen was among the screenshots we have — a "Subscriptions" tab is visible in the profile hub but its contents weren't captured, so the monetization model below is inferred from UI cues only, not confirmed.

This doc is reference material, not a build spec — nothing here should be adapted into L. Glow copy or scoring logic without going through the usual content-authorship rules (`CLAUDE.md`). It exists so "what did that competitor app do again?" has an answer without re-digging through screenshots.

---

## What AyuLyfe actually does

**Onboarding.** A 5-slide carousel inside a phone-mockup illustration. Opens on a Buddha quote ("You cannot travel the path until you have become the path itself..."), then three value-prop slides (dosha/agni understanding, an "Ayurveda library," personalized recommendations) plus an Ayumeal slide ("Wide selection of ingredients and recipes... use 5,000 years of Ayurveda history"). "Continue without registration" and "Sign In" both offered from slide one — registration is optional, not gated.

**The Dosha quiz — 52 questions, answered as three separate sub-scores.** One question per screen, three fixed answer options (each option maps to Vata/Pitta/Kapha), multi-select allowed (checkboxes, not radio buttons — you can check more than one option if more than one resonates). Explicitly framed as progressive: *"Answer just 16 questions to start seeing your personalized Ayurveda recommendations. Take more questions to better understand your dosha and receive more precise guidance."* Topics observed: Body Frame, Body Weight, Nature of Weight Gain/Loss, Skin, (Nature/Temperament), Voice, Speech, Appetite, Preferred Tastes, Emotions, "This phrase defines me" (forced-choice personality idioms — "It's my way or the highway," "Jack of all trades, master of none").

The result is **not one blended dosha** — it's three independently-scored readings shown as separate donut charts: **Physical Dosha**, **Physiological Dosha**, and **Psychological Dosha** (e.g. one test account came back Physical: 75% Pitta / 25% Vata; Physiological: 83% Vata / 17% Pitta — a real, visible split between "what your body looks like" and "how your body functions," not collapsed into one number.

**Results include per-topic explanation cards.** Below the donut charts, an expandable card per quiz topic ("Body Frame," "Nature of Weight Gain and Loss," "Speech"...) explains *why* that topic scored the way it did, color-coded to the dominant dosha for that specific topic (a pink/Pitta card sits directly above a teal/Vata card, because those two topics scored different doshas) — the explanation is topic-specific and dosha-specific, not one generic paragraph per dosha type.

**A separate "My Signs of Imbalance" quiz** (16 questions, ~3 min) — distinct from the constitution quiz, explicitly framed: *"Conditions and symptoms may improve through diet and lifestyle changes... this quiz helps uncover imbalances, provides Ayurvedic insights, and offers tailored food and wellness guidance."*

**A "Profile" mini-quiz** (9 questions) — separate again, pitched as "complete your profile... to track seasonal changes effectively."

**A dosha-balance-over-time line chart** ("Dosha balance in time") on the constitution dashboard — three colored lines (Vata/Pitta/Kapha) plotted across months, showing drift rather than a single static reading.

**Ayumeal — recipes + ingredient database**, tabbed together in one module. Recipes show a photo, dosha-relevance icons, prep time, and a calorie count (e.g. "*Lamb gruel for respiratory support — 82 mins, 1648.63 cKal*"). Ingredients tab: searchable, filterable by category, a "Products for me" personalization toggle, each ingredient card shows a calorie count too. A content library ("Articles for Me," toggleable) separately surfaces short reads — "The history of millet," "Tridosha — its balance and imbalance," "Planning a day as per Ayurveda principles," "Mind Concepts in Ayurveda" — each tagged with a read-time estimate.

**Visual style:** Android Material-adjacent UI, sans-serif throughout, muted earth-tone illustration style for onboarding (flat human figures in terracotta/olive/blush), real food photography for recipes, functional but generic — nothing in the visual language identifies a specific practitioner or personal voice. No name, face, or credential appears anywhere in the captured screens; the app speaks as software, not as a person.

---

## Side-by-side

| | **AyuLyfe / Ayuworld** | **L. Glow** |
|---|---|---|
| Voice | Anonymous, instructional, textbook-adjacent ("Talking things in hurry happens when there is a disturbance in the flow of wind element") | One named practitioner's voice throughout — everything gated on "would Thea say this?" |
| Dosha model | Three independent scores (Physical / Physiological / Psychological), each its own donut | One blended constitution score today; Prakriti/Vikriti #52 is heading toward multi-tier but not shipped as three parallel scores |
| Vikriti / drift over time | Shipped — a live Vata/Pitta/Kapha line chart on the dashboard | Designed, not built — see "Vikriti visualization" under Longer Horizon; #52 exists but scoring/tagging isn't done |
| Imbalance framing | "Conditions and symptoms may improve through diet and lifestyle changes" — soft medical-outcome language | Explicitly ruled out — CLAUDE.md bars medical claims; principle 4 ("no good, no bad, there just is") reframes imbalance as information |
| Tone toward the user | Occasionally blunt/judgment-adjacent ("Judgmental, angry, critical," "It's my way or the highway," "Jack of all trades, master of none" as literal Pitta/Vata/Kapha option text) | Voice guide explicitly rules out shaming language and rigid labels |
| Food content | Recipes + ingredients carry calorie counts (cKal) throughout | Deliberately not a calorie-counting app — "weight balancing, not weight loss," positioned against fitness-app framing from day one |
| Personalization depth | Quiz answers gate recommendation precision (16 questions minimum, more = better) — a real "answer more, get more" mechanic | Similar spirit in Prakriti's three progressive tiers (Foundation/Level 2/Level 3), not yet tied to recommendation precision |
| Practitioner presence | None visible — no name, face, or voice behind the app | The entire app is framed as one practitioner's practice — this is the core differentiator |
| Registration | Optional from the first screen ("Continue without registration") | Required for persistence/sync (Supabase Auth); no anonymous-continue path today |
| Content library | Short, generic Ayurveda-education articles, no clear authorship | Learn section, entirely Thea-authored (in progress), matrix-structured (#7b) |

---

## Worth reacting to

**The three-way dosha split (Physical / Physiological / Psychological) is a genuinely interesting structural idea**, separate from whether AyuLyfe executes it well. L. Glow's own roadmap already gestures at something adjacent — Prakriti's three tiers (Foundation → Level 2 → Level 3 "Practitioner Observation") deepen constitutional detail, but they don't currently produce three *parallel, independently-visible* scores the way AyuLyfe's dashboard does. Worth a conversation with Thea: does splitting "what your body looks like" from "how your body functions" from "how your mind tends to run" as three visible readings (rather than one blended number) match how she actually thinks about constitution clinically, or would that read as more granular than useful? This is a methodology question, not a UI one — same category as the still-open "which Prakriti source wins" question already logged in #52.

**The dosha-drift-over-time line chart is proof this is buildable and legible at a glance** — useful validation for the "Vikriti visualization" concept already on L. Glow's Longer Horizon list (sticky Prakriti swatch + a moving Vikriti swatch). AyuLyfe's version plots three raw percentages against a timeline; L. Glow's own design goal (a *gap* between two swatches making drift tangible) is a more considered take on the same underlying idea, not a copy. No reason to change direction here — this is a "we're on the right track" signal, not a new requirement.

**The per-topic result explanation** (a card per quiz question, colored to that question's own dosha result, not just per overall dosha) is a nice legibility trick worth remembering whenever Guna/Agni/Prakriti result screens get revisited — showing *why* each piece scored the way it did, not just the aggregate, makes a long quiz feel less like a black box.

---

## Worth avoiding

**Calorie counts on food.** AyuLyfe's recipes and ingredients both surface cKal figures throughout — the opposite of L. Glow's explicit "weight balancing, not weight loss" and "not a fitness app" positioning. This is a clear place L. Glow is already differentiated and should stay that way — nothing here is a reason to add calorie data to `data/content/herbFoodDatabase.js` or #14's recipe content.

**Soft medical-outcome language.** "Conditions and symptoms may improve through diet and lifestyle changes" sits close to the line CLAUDE.md draws around medical claims. Useful as a live example of the exact kind of phrasing to catch in review — it reads reasonable at first glance, which is exactly why it's worth naming explicitly rather than assuming the instinct to avoid it is enough.

**Judgment-adjacent option text.** A few of AyuLyfe's actual quiz answers ("Judgmental, angry, critical," "It's my way or the highway") read as mildly insulting rather than neutrally descriptive, even though they're technically accurate Pitta-imbalance traits. This is a concrete example of principle 4 in action — the same clinical trait can be written as information or as a jab, and AyuLyfe sometimes lands on the jab. Worth keeping as a reference point when Thea's own copy (e.g. the still-draft Agni/Guna result language) gets its review pass.

**Facelessness.** AyuLyfe has no visible practitioner anywhere in the captured screens — it reads as software. This is the single biggest gap between the two products and the one most worth protecting: nothing about the AyuLyfe teardown should push L. Glow toward more generic, less personally-voiced content. If anything it's a reminder that About Thea, the practitioner's name in every result screen, and the "would Thea say this?" filter are doing real differentiation work, not just brand decoration.

---

## Proposed guidance going forward

1. **Don't chase feature parity.** Nothing here is a gap L. Glow urgently needs to close — AyuLyfe is a broader, shallower, unauthored product; L. Glow is narrower and deeper on purpose. Treat this doc as "here's what else exists," not a checklist.
2. **Raise the three-way dosha split with Thea as a methodology question**, not a build task — likely in the same conversation as #52's open "which Prakriti source wins" question, since both are about how granular/parallel her constitutional model should be.
3. **Let the dosha-drift line chart validate, not redirect, the existing Vikriti visualization plan** — no scope change, just confidence the concept works once #52's tagging/scoring is further along.
4. **When Thea reviews any draft result copy** (Guna, Agni, Prakriti archetypes), flag the "judgment vs. information" distinction explicitly using the AyuLyfe examples above as a quick gut-check, not as a formal rule addition to the voice guide (which already covers this via principle 4).
5. **No action needed on Ayumeal/food-database structure** — L. Glow's Herb + Food Database (#36) and the still-blocked dosha food lists (#38) are already a more clinically-grounded, non-calorie version of the same idea.
