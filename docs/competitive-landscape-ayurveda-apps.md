# Competitive landscape — ayurveda/dosha apps, July 2026

Source: live App Store / Play Store listings and product sites, researched July 29 2026 (web search + app store pages). This extends `docs/competitive-analysis-ayulyfe.md` (which covers one app — AyuLyfe — in depth from Thea's own screenshots) out to the wider field: what else exists, how big it is, and what it charges. Eleven apps total as of this pass. Reference material, not a build spec — same rule as the AyuLyfe doc.

None of these are direct headcount threats today — most are small (single-digit to low-hundreds of reviews), a few are large, and none are one practitioner's named practice the way L. Glow is. The value here is calibration: what's table-stakes in this category now, what price the market bears, and where L. Glow's actual differentiation (Thea, specifically) holds up against the field rather than just one app.

---

## The field

| App | What it actually is | Dosha model | Price | Scale |
|---|---|---|---|---|
| **AyuLyfe** (Ayuworld/Ayumeal) | Full companion app — quiz, recipes, articles, dashboard | 3 separate scores (physical/physiological/psychological) | $9.99/mo or $79.99/yr | 1 rating — brand new |
| **Ayurveda AI** (Qi Machine) | Minimalist — 9-question quiz, AI-generated recipes only | Single dosha, no depth beyond the quiz | $4.99/mo or $39.99/yr; free tier = 3 recipes/week | 7 reviews — tiny |
| **Ayura** | AI-forward — camera food scanner, camera face scanner, 20-question "Dosha Engine," AI routine generator | Prakriti vs. Vikriti split, 3-dosha percentages | Not disclosed; "early access is free" | Pre-launch |
| **Ayurveda Nest** | Community + tracking app — dashboard, sleep/energy tracking, chat, "Vikriti Retest" | Vikriti explicitly re-tested over time | Not disclosed (has a paid tier) | Unknown |
| **Aura Health** (aurahealth.io) | General meditation/CBT/coaching library — **not ayurveda-specific at all** | None | $69.99/yr individual, $129.99/yr family | Large, well-established |
| **The Ayurveda Experience** | Product shop (skincare, supplements) with a companion app | None — it's e-commerce | Free app; product prices | 1.2K app ratings, 2.2M+ customers company-wide |
| **AyuRythm** | Camera-based pulse diagnosis (Naadi Pariksha via phone PPG), 1,500+ home remedies, "AyuMonk" AI chat guide | Pulse-derived dosha/imbalance reading | $7.99/mo, $19.99/3mo, $49.99/yr **plus** separate paid add-ons (FaceNaadi $2.99/mo, Sparshna $2.69–7.49, diet plans $0.99–7.99 each) | 54 ratings, **2.2/5** — the only app here with real negative signal |
| **Vedic Lab** | Built by Swiss Ayurvedic doctors — assessment, skincare, face yoga, a 30-day "REVIVEDIC®" program, **real 1:1 doctor booking in-app** | 2-minute dosha profile quiz | ₹799–1,199/mo, ₹6,399–9,900/yr (~$70–120/yr equivalent) | 13 reviews, 5.0 — small but clean |
| **Prana** | Women-only fitness + Ayurveda hybrid — dosha-specific workouts, meal plans, intermittent fasting by dosha, "Goddess Archetype Quiz" | Dosha type via archetype quiz | $99.99/yr (also weekly/quarterly options) | 35 ratings, 4.7 |
| **CureNatural** | AI-driven — algorithmic Dinacharya (daily routine) engine, ingredient database with 60+ Ayurvedic attributes per item, "Remedy Maker," plus a paid course catalog | Explicit Prakriti (birth constitution) vs. Vikruti (current imbalance) split | $9.99/mo or $99.99/yr; à la carte Food Guide $4.99, Wellness Plan PDF $55, courses up to $49.99 | 3 ratings, 5.0 — brand new |
| **iUVeda** | Lightweight — yoga, meditation, nutrition, "Ask Ayurveda AI" chat | Single dosha via questionnaire | $4.99/mo or $24.99/yr — the cheapest in the set | 3 ratings, 4.3 |

---

## Pricing across the category

Now that there's real data across eleven apps, a clearer picture than "L. Glow is cheap" emerges:

- **Low end:** iUVeda ($24.99/yr), Ayurveda AI ($39.99/yr)
- **Mid-range, the bulk of the category:** Vedic Lab (~$70–120/yr), AyuLyfe ($79.99/yr), Aura Health ($69.99/yr, non-ayurveda), CureNatural ($99.99/yr base, before add-ons), Prana ($99.99/yr)
- **High end / fragmented:** AyuRythm — nominally $49.99/yr, but the real spend adds up fast once FaceNaadi, Sparshna, and per-diet-plan purchases stack on top; effectively the most expensive and the most nickel-and-dimed app in the set.

**L. Glow's $1.99–2.99/mo ($24–36/yr) sits at the absolute floor of this category, tied with iUVeda.** That's worth naming plainly: the original pricing decision (Thea's instinct of $1.99, a friend's independent guess of $2.99, benchmarked against Aura Health's $5.99/mo) was made without category data. Now that there is category data, the finding is that **the market is bearing $70–120/yr from apps with a fraction of L. Glow's depth and none of its practitioner backing** — L. Glow could very plausibly charge more without being out of step with the field. Not a recommendation to change the price today — Thea's numbers are hers to revisit, not something to override — but worth surfacing as new information the original decision didn't have.

---

## What this tells us

**Aura Health — already named in the roadmap as "the nearest comp" — still isn't an ayurveda app.** Confirmed again with a wider set around it: it's a pricing/business-model reference only. AyuLyfe, Vedic Lab, Prana, and CureNatural are the real feature-level comps, and all of them price above where L. Glow currently sits.

**The Prakriti/Vikriti split is now confirmed three times over, not two.** Ayura, Ayurveda Nest, and now CureNatural all independently separate constitution from current state as two distinct, trackable readings. Three unrelated teams converging on the same structure is a stronger signal than before that this is the right shape for the category — reinforces #52's direction, still no reason to change scope.

**An AI chat assistant is now close to table stakes, not a differentiator.** AyuLyfe has one, Ayura is built around AI end to end, AyuRythm has "AyuMonk," CureNatural does AI-driven recipe personalization, iUVeda has "Ask Ayurveda AI." L. Glow doesn't have a consumer-facing chat feature at all — its only AI today is practitioner-only (`generate-ai-guidance`) or gated behind Thea's approval (`generate-user-manual`). This is worth naming honestly as a real gap in *feature checklist* terms — but not one to reflexively close. An open-ended chat that answers "is this food good for my dosha?" in real time is exactly the kind of freelance clinical-sounding content `CLAUDE.md`'s content-authorship rules exist to prevent — every one of these apps is one model away from confidently inventing an answer Thea never said. If a chat feature is ever pursued, it would need the same practitioner-review gate `generate-user-manual` already uses, not an open chat window.

**Camera/biometric "read your body" features don't obviously translate to happy users.** Ayura's face scanner was already flagged as a cautionary example; AyuRythm's camera-based pulse diagnosis is now real, live, and — at 54 ratings and 2.2/5, with reviews specifically citing crashes and subscription-cancellation difficulty — the single worst-reviewed app in this entire set. That's not proof the *feature* is the problem (execution quality is a separate variable), but it's a useful data point against reaching for ambitious biometric tech before the basics are solid. Reinforces keeping #57's photo-matching sketch narrowly scoped to "confirm one of Thea's existing answer options" rather than growing it toward anything that reads as a body scan or diagnosis.

**Vedic Lab is the one real exception to "nobody has a practitioner"** — it's built by named Ayurvedic doctors and includes real 1:1 booking in-app, the closest structural parallel to L. Glow's own "Book a Session" CTA anywhere in this set. Worth being precise about the distinction rather than overclaiming uniqueness: Vedic Lab has *credentialed clinical authorship*, plural and somewhat impersonal (a clinic's brand voice); L. Glow has *one specific person's voice* throughout the entire product, not just at the booking step. The gap isn't "practitioner vs. no practitioner" anymore, it's "a practice you can book a session with" vs. "a practice you're already inside of on every screen."

**None of the rest have any practitioner at all**, credentialed or otherwise — AyuLyfe, Ayurveda AI, Ayura, Ayurveda Nest, AyuRythm, Prana, CureNatural, iUVeda are all software-first, no name or face anywhere. This remains the throughline most worth protecting.

---

## Guidance

1. **No urgent feature gaps that require a build.** The one real feature-checklist gap (AI chat) is a deliberate omission given the content-authorship rules, not an oversight — don't close it reflexively.
2. **Pricing is worth a real conversation, not a change.** The category supports $70–120/yr from thinner, less personal products. Flag for Thea/Matt as new information; her numbers stand until she says otherwise.
3. **The Prakriti/Vikriti split is a stronger green light now (3 independent confirmations)** — no scope change to #52, just more confidence.
4. **Stay narrow on #57's photo-matching sketch** — AyuRythm's poor reception on a similar ambitious-camera-feature is a live argument for keeping it to "confirm an existing answer," nothing more exploratory.
5. **Vedic Lab is the most useful single comp for the booking/practitioner-relationship angle** — closer than Aura Health for that specific conversation, if one comes up.
6. **Revisit this list roughly annually or when a specific app comes up by name** — this category moves fast and thin; a stale snapshot is worse than no snapshot.
