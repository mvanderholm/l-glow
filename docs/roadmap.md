# L. Glow Roadmap

Living document. Strike through items as shipped, add new items at the bottom. Reorder only after a conversation with Matt.

---

~~**"Here's today" post-check-in screen.**~~
`app/today.js` — four pillar cards (Nourishment, Herbs, Movement, Lifestyle) shown after check-in completes. Cards are date-seeded picks from the dosha's recommendations data. Check-in score dots shown when a check-in exists for today. Blueprint badge taps to result screen. "See full guidance" links to `/recommendations` (kept as reference). `loadTodayCheckin()` added to `data/user/storage.js`. Check-in routes to `/today` via `router.replace`. Done June 2026. Phase 2: route card content by check-in scores rather than static dosha data — blocked on locked question set (#19) and richer content (Thea).

---

## Key decisions and constraints

**Launch target: August 17th — slipped, did not happen.**
Thea named this explicitly (transcript 13). August 17th, 2024 was the date of her first Ayurveda consultation with her mentor — the date means something to her, which is why it was picked over an arbitrary date. **Confirmed by Matt, Aug 18 2026: the date passed without launching, due to extenuating circumstances in Thea's schedule — not a technical or project-readiness issue.** No new target date set as of this writing. Pre-launch requirements (#29, #30, #31) are unaffected by the slip — still real work, just no longer racing a specific calendar date until a new one is picked.

**Pricing: $1.99–$2.99/month subscription.**
Thea's number is $1.99; her friend independently said $2.99. Aura app (~$5.99) named as the nearest comp. Individual consultative sessions are a paid upsell layer on top of the subscription — not in the app initially, just a CTA to book with Thea directly.

**Competitive positioning: holistic wellness, not fitness, not weight loss.**
Aura app is the loosest comp — fitness-adjacent. L. Glow is more holistic. Do not lead with weight loss in marketing or copy. The frame is "weight balancing" — it applies to people who can't gain as much as to those who want to lose. The Ozempic counter-narrative (real wellness work vs. pharmaceutical shortcuts) is Thea's marketing energy and differentiator — worth threading into About Thea and any public-facing copy.

**Quiet app — no auto-playing audio.**
Thea explicitly wants L. Glow to be a quiet app (transcript 13). Users are often on their phone around other people and don't want sound playing unexpectedly. Any future audio or video content must be muted by default with a clear user-initiated unmute. The music card linking out to Spotify is the right pattern — no sound originates from the app itself.

**Voice input — option, not default.**
Thea personally prefers speaking answers over typing (for check-ins especially), but recognizes users are often around others. If voice input is added to the check-in flow, it must be opt-in, never the only path.

**Infrastructure: domain, email, booking, payments (July 2026).**
Domain `lglowliving.com` — registered/hosted on Squarespace, which also runs the marketing site. Primary email is `thea@lglowliving.com`, hosted on Squarespace (not Google Workspace — that route was considered and dropped in favor of keeping email on Squarespace alongside the domain). Booking is cal.com (`cal.com/lglowliving`, see #34) — wired into the app in `data/booking.js`. Thea's Venmo for direct client payments (e.g. paying for a booked session) is `@lglowliving`. Not wired into the app — the app's job is the funnel and booking link-out, not payment processing (see "Out of scope").

**Transactional email (auth): Resend — decided July 2026, see #49.** Deliberately a separate service from Thea's Squarespace-hosted mailbox, not a repurposing of it — personal/business mailbox SMTP isn't built for an app's automated signup/reset volume and risks flagging Thea's real email as spam-like. Free tier (3,000/mo, 100/day) comfortably covers this app's realistic scale indefinitely; $0 expected ongoing cost. One domain-verification gotcha: `lglowliving.com` already has a Squarespace SPF record for Thea's mailbox — Resend's SPF `include` has to be merged into that same record, not added as a second one, or Squarespace mail deliverability breaks.

---

## Shipped

~~**1. Persist the quiz result via AsyncStorage.**~~
Save primary dosha + score breakdown to `@lglow/primary_dosha`. Welcome screen reads it and shows returning-user state. Recommendations screen uses saved dosha. Done.

~~**2. Guard the recommendations screen.**~~
If no saved dosha and no param, routes to `/quiz` with a friendly message. Hardcoded default removed. Done.

~~**3. Add an "About Thea" screen.**~~
Route `app/about.js` with photo placeholder, name, credentials, bio, "book a session" stub, theme switcher, brand style toggle, and Instagram feed component. Linked from welcome screen. Bio replaced with Thea's own words, June 2026. Photo placeholder still pending — swap in `assets/thea.jpg` when ready.

~~**4. Loading and empty states.**~~
Welcome screen handles the AsyncStorage load delay gracefully — no flash of wrong content on first render. Done.

~~**4a. Session summary export.**~~
Check-in data persisted to AsyncStorage by date. "Share summary with Thea" button on the returning-user home screen generates a plain-text summary and opens the native share sheet (hidden on web). Done.

~~**5a. Asana module — data scaffold.**~~
`data/content/movement.js` exists with 3–5 posture entries per dosha. Movement section wired into the recommendations screen with tap-to-expand modal (name, sanskrit, duration, timing, description, benefit). Content is placeholder — awaits Thea's posture descriptions and benefit copy.

~~**6a. Education section — "Learn" module scaffold.**~~
Route `app/learn.js` and `data/content/learn.js` with 15 concept entries across three tiers. Table of contents and detail views built. All content bodies empty, awaiting Thea's voice memos per concept.

~~**7a. Refactor `data/` into `data/content/` and `data/user/`.**~~
Split is live. `data/content/` holds Thea-authored files (herbs, learn, movement, quiz, recommendations). `data/user/` holds AsyncStorage mechanics (storage.js). Done.

~~**8a. Web support + Vercel deployment.**~~
Expo Router static export configured. `vercel.json` added. Download CTAs (App Store / Google Play) shown on web only. `Share` button hidden on web. 480px max-width centering for desktop. Repo live at github.com/mvanderholm/l-glow, deployed via Vercel.

~~**8b. Welcome / marketing landing page.**~~
`app/welcome.js` — standalone landing page at `lglow.vercel.app/welcome`. TBM-inspired narrative arc: dark hero image → differentiation beat → how it works (3 steps) → Dosha Quiz card as primary entry point → About Thea → 4 pillars preview → final CTA → "It changes." footer. All copy [DRAFT] — Thea to review and rewrite before this page is the public front door. Photo placeholder in About section — swap in `assets/thea.jpg` when ready.

~~**25. Replace logo mark with the O from the style guide.**~~
`components/LogoMark.js` rebuilt with the O glyph — circle outline + inner 4-pointed star + small accent star above. Proportions derived from Thea's style guide image. App icons (`assets/icon.png`, `assets/adaptive-icon.png`) regenerated from the same glyph via `scripts/generate-icons.js`. Done.

~~**Hamburger drawer.**~~
`context/DrawerContext.js` + `components/HamburgerDrawer.js`. Slide-in from left, spring animation, backdrop tap-to-close. Wired to all 5 main screens. Navigation stays in bottom nav exclusively. Done.

**Reworked July 13 2026 — account/identity items consolidated into the You tab, drawer trimmed to pure navigation.** Login functionality (this session) exposed real overlap: Dosha Quiz, Guna Quiz, Reminders, and Help & guidance existed as duplicate rows in *both* the drawer and You's settings list, while My Intake Form and Practitioner View only lived in the drawer despite being personal/identity data a user would expect on their own profile. `app/you.js` now holds all of it: signed-in email shows under the name (identity no longer buried in a settings row), a new "Your Assessments" section (Dosha, Guna, My Intake Form), and Practitioner View appears in Settings only when the signed-in account's `role` is actually checked and equals `'practitioner'` (not just relying on RLS to silently block everyone else, as the drawer version did). `HamburgerDrawer.js` now holds only: Home, Your Profile, My Journey, Learn, Journal, About Thea, Book a Session.

**Header/back-navigation consolidation, July 22 2026.** Found live on the deployed Vercel site: `app/quizzes.js`, `prakriti.js`, and `vikriti.js` had no back button of their own, relying entirely on the native Stack header's auto-back — which only appears when there's real navigation history. A direct URL load, refresh, or shared link starts with none, so those three were a dead end in production. Traced the same gap to 9 more screens (`learn`, `about`, `result`, `recommendations`, `affirmations`, `recipes`, `breathwork`, `meditation`, `selfmassage`) that were still on the native header for a different reason — it's also where the "You has no logo but Learn does" visual inconsistency Matt flagged came from (native header shows a small logo mark; every custom header in the app doesn't). All 12 screens are now `headerShown: false` with their own back button, using a new `smartBack()` (`components/BackButton.js`) that goes back if there's history, otherwise replaces to a safe fallback route — instead of a bare `router.back()` that just silently no-ops with nothing to go back to. Every other quiz/result screen's own back button (`quiz`, `guna-quiz`, `agni-quiz`, `tongue-check`, `prakriti-quiz`, `vikriti-quiz`, `guna-result`, `agni-result`, `tongue-result`) switched to `smartBack()` too, same latent gap. `data/nav.js` (new, same session) is also now the single source of truth for the drawer's nav items, shared with `WebLayout`'s Web View sidebar so the two can't drift apart the way they had — and the sidebar no longer shows next to a redundant in-content hamburger drawer, which is suppressed whenever `isWebMode` is true.

~~**TestFlight distribution configured.**~~
`eas.json` updated with submit profile and `ascAppId`. iOS production build submitted to App Store Connect. Thea added as internal tester. Future builds: `eas build --platform ios --profile production` then `eas submit --platform ios --profile production --latest`. Done.

~~**Content review packet compiled for Thea.**~~
`docs/content-review-thea.md` — consolidates every piece of draft-status copy across the app into one doc she can work through in a sitting: the 10 Learn library essays (pointed to the in-app Learn tab rather than pasted, since they're long-form), full text for the branching quiz results (dosha archetypes, guna, agni, tongue) so she isn't retaking quizzes to see every variant, plus intake consent copy, journey tab copy, the affirmations bank, and welcome page status. Also a "nothing written yet" checklist (movement postures, agni quiz wording, 5 empty Learn concepts, dosha-specific intentions/routines, Spotify links) and a flag section — see below. Done July 2026. **Updated** the same day the first TestFlight build went out: added a note flagging that the dosha quiz redesign (already approved, see #18) is now live and worth a real run-through, not just a re-read of the questions as text.

**Finding from that review, corrected:** Went looking for content that was quietly living as if approved without ever being marked draft. Both `herbs.js` and `recommendations.js` turned out to be moot, not just herbs — see #38 (below), missed on the first pass: Thea already recorded detailed food recommendations for all three doshas (transcripts 23–25, June 2026) with Best/Good/Not Beneficial/Avoid breakdowns, explicitly meant to feed the recommendations screen's food section. So `recommendations.js`'s food lists aren't "unreviewed and need her eyes" — they're superseded by approved content that's sitting unloaded, same shape as the herbs.js situation. The actual blocker for both is the same one: the food+herb database placement/schema decision under #36. `data/content/recommendations.js`'s *seasonal engine* (the ritucharya month-to-season mapping) is separate from the food lists and wasn't addressed by #38 — that part may still be worth a look, but the food-list content itself is not an open gap.

---

## Next

Voice guide approved by Thea, July 2026 (v1.0) — the gate on #1 and #2 below is lifted.

**1. Rewrite welcome screen copy in Thea's voice.**
`app/welcome.js` rewritten against voice guide v1.0 — hero subhead, differentiation section, dosha quiz card, and About Thea preview updated. The differentiation paragraph specifically needed fixing: it still said "her methodology, her voice, her framework," which is exactly the framing Thea's v1.0 note corrected (it's her teaching *you* to read your own body, not her worldview imposed on you). About Thea preview also updated off the old "destroyed hip" origin story, which the voice guide no longer carries either — now matches her published bio. Still [DRAFT] pending Thea's line-edit pass before this page is the public front door.

**2. Rewrite daily check-in copy in Thea's voice.**
`app/checkin.js` was already substantially aligned (header, "the body holds the score," hunger/tongue framing) — only the submit button copy needed a pass, now "Save & See What Today Needs" to echo the app's north-star question. Deliberately did not touch the dimension labels/descriptions (physical, mental, emotional, hunger, tongue) — that's the separate, still-gated review in #19 below; changing question content needs Thea's input, not just tone.

~~**3. Add the morning hunger question to the daily check-in.**~~
~~One new question: "How's your morning hunger today?" Five levels from "no appetite" to "ravenous." Persisted alongside check-in values. Gentle framing — information about digestive fire, not a judgment."~~ Done — `hunger` dimension live in `app/checkin.js` alongside `tongue` coating score. Both already wired into `buildSessionSummary()`.

**19. Revisit daily check-in questions.**
Full review of the current check-in question set with Thea. Questions should reflect her methodology and voice more precisely — current set is a scaffold. She should define what signals are diagnostically useful for tracking vikriti day-to-day.

Content dependency: Thea to review and rewrite/reorder questions. Do not change question set without her input.

**Interaction model decided, July 17 2026 (Matt):** Replace the current 1–5 Likert dot-scale (`app/checkin.js`, `scale = [1,2,3,4,5]`, single-select per dimension) with a multi-select "check all that apply" pattern per dimension — descriptive states instead of an intensity number, same spirit as the dosha quiz's skin/hair multi-select questions.

**Blocked on content, not code:** none of the 5 dimensions currently have discrete labeled states to select from — `data/content/checkinDimensions.js` only has one topic `desc` per dimension, and Hunger/Tongue additionally have a `hint.low`/`hint.high` pair (2 endpoint words, not a full option set). A real multi-select needs Thea to define, per dimension, the actual set of selectable states (e.g., for Physical: "Low energy," "Bloated," "Clear-headed," "Sore" — illustrative only, not proposed real copy). Do not fabricate these — same rule as the question set itself.

**Schema note for whenever this builds:** moving from single numeric value to multi-select per dimension changes what a "check-in answer" *is* — the `checkins` table currently stores one number per dimension column; multi-select needs an array/set of selected option-keys instead. That ripples into `buildSessionSummary()`, You-tab streak/stats math (currently number-based), and the Vikriti aggregation work noted in "Longer horizon" (which assumes check-in data is part of its multi-signal input) — worth designing the new shape once, not twice, alongside #26's two-check-ins-a-day schema change since both touch the same table around the same time.

**Ready to scaffold now, without content:** the UI mechanism (multi-select chips replacing the dot-scale) and empty per-dimension option arrays could be built and wired into the practitioner admin hub today, following the same "scaffold + Thea fills in via admin editor" pattern already used for Intentions/Daily Rhythms/Playlists — content arrives later without needing another code deploy. Not started — flag if you want this scaffolded ahead of Thea's option-set content, same way those three were.

**26. Morning and evening check-ins — two check-ins per day.**
The check-in screen becomes time-aware: a morning check-in and an evening check-in, each with its own question set. The two readings together give a fuller daily picture and are the primary data source for the vikriti display.

**Question sets (to be defined by Thea):**
- Morning: likely covers waking energy, sleep quality, morning hunger/agni, mental clarity at start of day
- Evening: likely covers digestion, energy through the day, emotional processing, wind-down state

**Check In tab badge:**
Show a notification count on the Check In bottom nav tab — how many check-ins remain today. Starts at 2 each day, counts down as they're completed (2 → 1 → 0). Badge disappears when both are done. No punishing state — just a gentle "you have something here."

**Data structure change required:**
Current check-in key: `@lglow/checkins/YYYY-MM-DD` (one entry per day).
New structure: two keyed entries per day — `@lglow/checkins/YYYY-MM-DD/morning` and `.../evening`. Each entry tagged with `type: 'morning' | 'evening'` and `completedAt` timestamp.

**Vikriti dependency:**
The morning + evening pair is the intended signal source for the vikriti visualization (see Longer Horizon). Morning gives baseline state; evening shows how the day moved things. Together they replace a single snapshot with a directional reading. Do not build the vikriti algorithm until both check-in types are live and question sets are locked with Thea.

**Build order:**
1. Confirm question sets with Thea (#19 must come first)
2. Update data structure in `data/user/storage.js`
3. Update check-in screen to show morning or evening flow based on time of day (or user selection)
4. Add badge logic to `components/BottomNav.js`
5. Update `buildSessionSummary()` to reflect the new structure

---

## Content work — requires Thea round 2 voice memo

**4. Dosha explanations rewrite.**
Replace placeholder dosha intro copy in `data/content/quiz.js` with Thea's own language. Waiting on her round 2 voice memo.

~~**18. Revisit dosha quiz questions.**~~
Full review of the quiz question set with Thea — done. She confirmed the redesigned set (below) fully **replaces** the old 8-question one, not coexists with it. `data/content/quiz.js`'s `quizQuestions` now holds her 14-question set (physical → physiological → psychological, sequenced per her transcript 15 framing); the old question set is gone. `data/content/quiz-draft.js` deleted — its content is what's now live. `app/quiz.js` already had the renderer support this needed (multiSelect, "none of these" escape, section labels) from earlier work this cycle, so no renderer changes were needed for the swap itself. Welcome screen's quiz-card copy updated from "ten questions" to "fourteen questions." Done July 2026.

**Field research — transcript 13 (Thea live-testing questions on a friend):**
Thea walked a friend through a set of questions in real time and captured her reactions. This is the clearest signal yet on what the redesigned question set should look like. Questions she tested and the UX reactions:

| Question | Options she used | User reaction |
|---|---|---|
| Body frame | Small/narrow · Medium/athletic · Large/broad | Worked cleanly |
| Wrist circumference | Connect thumb + middle finger: overlap / connect / don't connect | Tactile, fun — strong question |
| Weight patterns | Gain easily · Lose easily · Moderate/consistent · Struggle to gain | Answered fine |
| Hair quality | Dry/coarse/curly · Fine/straight · Thick/full/luxurious | Needed "combination" — neither option fit |
| Skin quality | Dry · Rough · Sensitive · Red · Thick · Soft · Moist | "Check all that apply" — multiple applied at once |
| Eye quality | Small/active/dark… | Transcript cuts off |

**UX signals from the live test:**
- Every question needs a "none of these" escape — some people genuinely don't fit any option
- Skin and possibly hair need multi-select ("check all that apply"), not single-select
- Combination answers need to be representable — "oily but also dry" is a real clinical presentation, not a user error

**Resolved:** Thea confirmed the redesigned quiz replaces the current one entirely — see #18 above.

**Transcript 15 — dosha quiz voice memo (June 2026):**
Thea described all three constitutional types in detail and named the specific question areas she wants. Key decisions from this memo:

**Sequencing principle: easy questions first, subjective questions last.**
Get people into the rhythm of answering before the introspective stuff arrives.

**Question areas (in order):**

*Physical/obvious — fast to answer, obvious to the person:*
- Body frame
- Natural weight tendency
- Skin (multi-select — "check all that apply")
- Hair (multi-select)
- Teeth — with "think back to before braces" framing
- Eyes

*Physiological — moderate subjectivity:*
- Appetite
- Digestion / elimination
- Sleep
- Hands and feet temperature

*Subjective/psychological — save for last once user is in the flow:*
- Physical energy style
- Mind / thinking style
- Memory
- Emotional stress response

**Framing:** Prompt users to "think back to when you were younger — as far back as you can" before the physical questions. Before braces, before hair products, before stress changed things.

**Attribution note:** Thea referenced Frawley & Lad as source material for her clinical descriptions. Quiz options must be in Thea's own voice — not reproduced from that text.

**Question set:** Live in `data/content/quiz.js` as of July 2026 — see #18 above. (14 questions, not 15 — corrected miscount from earlier in this doc.)

**5. Asana module — Thea's content.**
Posture descriptions, timing, and benefit copy for each dosha's 3–5 postures in `data/content/movement.js`. Scaffold is built and wired — plug in her content when ready.

**6. Evening / sleep guidance.**
Nothing yet. Waiting on Thea's sleep-and-evening-rituals voice memo. Eventually: a "tonight" section on the recommendations screen or a separate evening companion mode. Janitor metaphor + 10pm–2am window are the anchoring concepts.

**7. Education section — content.**
Fill `data/content/learn.js` entries one at a time via the voice-memo → Whisper → adaptation → Thea review pipeline.

Work order:
1. Adapt dosha transcript (#4) into the first entry. Thea reviews, signs off, ships.
2. Remaining Tier 1 concepts via short prompts → voice memo → adaptation → review.
3. Tier 2 at whatever pace works.

Concept list (prioritized):

*Tier 1 — essentials*
- ~~What is Ayurveda? (new entry)~~ — body filled, source: transcript 20 (062126_01), June 2026
- Doshas (adapt from transcript #4 — first entry)
- Prakriti and vikriti
- ~~Pancha mahabhutas / five elements~~ — body filled, source: transcript 25 (062126_07), June 2026
- ~~Agni — digestive fire~~ — body expanded with four Agni types + Agni/Ama cycle, source: transcript 21 (062126_02), June 2026
- Ama — toxic sludge
- ~~Food as Medicine (new entry)~~ — 8-factor food framework, source: transcript 21 (062126_03), June 2026

~~**⚠️ Sequencing note from Thea (transcript 25):** Reorder Learn to: What Is Ayurveda → Five Elements → Doshas → Prakriti/Vikriti.~~ Done — `data/content/learn.js` rewritten with correct order, June 2026.

~~**⚠️ "Blueprint" copy change (Thea, transcript 20):** Change "home base" to "blueprint" across all app copy.~~ Done — updated in `data/content/learn.js` (doshas, prakriti-vikriti) and `app/result.js`. Full sweep confirmed clean, June 2026.

*Tier 2 — deepening*
- The six tastes / shad rasa
- ~~The gunas (qualitative: hot/cold, light/heavy, dry/oily)~~ — body filled, source: transcript 16, June 2026
- ~~The three gunas (mental: sattva, rajas, tamas)~~ — body filled, source: transcript 15b, June 2026
- Ojas — vital essence
- Dinacharya and ritucharya

*Tier 3 — advanced / Thea's call*
- Sapta dhatus / seven tissues
- Three malas
- Srotas / channel systems

Do not fabricate entries to fill gaps faster. Empty is correct until Thea has authored each one.

**7b. Learn concept matrix — 4×4 content expansion.**

Each Learn concept gets a structured 4×4 matrix mapping how that concept applies across all four dimensions of life. This deepens every entry from a single body of text into a full reference.

Columns (dimensions): **Physical · Mental · Emotional · Spiritual**
Rows (domains): **Lifestyle · Nourishment · Movement · Herbs**

So each concept has 16 cells. Example for Agni:
- Physical / Lifestyle: morning routine practices that stoke digestive fire
- Physical / Nourishment: foods and eating habits that support agni
- Physical / Movement: movement that strengthens digestive capacity
- Physical / Herbs: herbs that kindle agni
- Mental / Lifestyle: practices that maintain mental clarity (mental agni)
- Mental / Nourishment: how and when you consume information
- … and so on across all 16 cells

**Data structure change required** — `data/content/learn.js` entries will need a `matrix` field:
```js
matrix: {
  physical:   { lifestyle: '...', nourishment: '...', movement: '...', herbs: '...' },
  mental:     { lifestyle: '...', nourishment: '...', movement: '...', herbs: '...' },
  emotional:  { lifestyle: '...', nourishment: '...', movement: '...', herbs: '...' },
  spiritual:  { lifestyle: '...', nourishment: '...', movement: '...', herbs: '...' },
}
```

**Build order:**
1. Design the data structure and UI (scaffold can be built without content)
2. Thea authors cells one concept at a time via voice memo pipeline
3. Ship cells as they're approved — partial matrices are fine, null cells show "coming soon"

**Content dependency:** All 16 cells per concept must come from Thea. Do not infer or fill from general ayurvedic sources. Start with Agni and Ama (already approved) once she's ready to record the matrix content.

**Connection to the 4×4 framework** already in the roadmap (see "App architecture — Thea's stated framework"): this is the same four pillars and four sub-domains applied to the Learn section specifically. When the recommendation engine eventually routes by pillar + sub-domain, the Learn matrix entries will be the reference content that backs those recommendations.

---

## From Thea's voice memos — features to build

~~**8. "Just for today" daily intention prompt.**~~
Scaffold complete. `IntentionCard` live on home screen for returning users. `intentionSuggestions()` in `data/content/intentions.js` with 3 universal suggestions; vata/pitta/kapha arrays empty awaiting Thea. Storage keyed by date — resets daily. Done.

**9. Daily routine section.**
Dosha-tuned daily rhythm suggestions on the recommendations screen or as its own section. Not a rigid schedule — a gentle orientation.

Anchors Thea named: wake before 6am, phone down after 9pm, in bed before 10pm, food keyed to time of day. Connects to dinacharya/ritucharya in the Learn module.

Content dependency: Thea to author routine suggestions per dosha.

**10a. Instagram feed — wire up Thea's account.**
`components/InstagramFeed.js` and `data/instagram.js` are fully built. Handle is set to `l.glowliving`. The only missing piece is a Meta access token.

**Steps (Thea):**
1. Make `l.glowliving` a **Creator** account (Instagram → Settings → Account → Switch to Professional Account)
2. Go to **developers.facebook.com** → Create App → Consumer → Add **Instagram** product
3. Connect Thea's account, complete the OAuth flow, get a short-lived token with `instagram_basic` scope
4. Exchange for a long-lived token (60 days): `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={app_secret}&access_token={short_token}`
5. Test it: `GET https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token={token}` — should return her posts as JSON
6. Paste the token into `data/instagram.js` → `INSTAGRAM_ACCESS_TOKEN`
7. Set a **50-day calendar reminder** to refresh: `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={token}`

⚠️ Token lives in `data/instagram.js` for now (repo is private). When the backend (#30/#31) is wired up, move it to an EAS secret / environment variable so it's not in source.

⚠️ If the test in step 5 returns an endpoint error, the `graph.instagram.com/me/media` URL in `data/instagram.js` may need updating — Meta changed this endpoint in late 2024. Flag it and Claude Code will fix the fetch call.

**10. Sound Library — music, vibration, nervous system regulation.**
Source: transcript 28 (062526_01), June 2026. Thea's vision has expanded beyond a daily song suggestion into a full Sound Library: a curated space where users can find the right sound for where they are right now.

**Library categories Thea named:** morning energy · focus · sleep · grounding · meditation · yoga · anxiety · confidence · heartbreak · manifestation · frequency playlists.

**Post-check-in integration:** After a check-in, the recommendation flow surfaces a sound suggestion alongside the herb/food/lifestyle guidance. "Ground your fire. Here's your herb. Here's your playlist." Sound becomes part of the daily healing arc, not a separate destination.

**Spotify integration:** Thea wants to connect directly to Spotify (she is already building playlists there). Link-outs from the app to her curated playlists are the right pattern — no audio plays in-app (quiet app constraint, see key decisions).

Design constraints: friend-texting-a-song tone, not clinical. Thea owns all curation. Spotify link-outs only — no in-app audio.

⚠️ **Open question before building:** How does Thea want to organize her Spotify playlists — by dosha, by mood/energy state, by category above, or a combination? Ask before scaffolding the data structure. A five-minute conversation prevents a refactor.

**Progress, July 2026:** L. Glow Living's Spotify profile URL is set — `SPOTIFY_PROFILE_URL` in `data/content/music.js`, which activates the previously-disabled Spotify button on the About Thea screen. Per-dosha playlist URLs (`playlists.vata/pitta/kapha.url`) are still `null`, and the open question above is still unanswered — this only unblocked the profile link-out, not the dosha-specific playlists this section describes.

~~**20. Daily Affirmations screen.**~~
Scaffold complete. `app/affirmations.js` live under You tab — single affirmation, date-seeded daily pick, "another one →" to cycle through pool. `data/content/affirmations.js` has 13 placeholder entries (4 universal + 3 per dosha); schema supports `season` and `state` fields for future vikriti routing. Currently prakriti-based — swap to vikriti once check-in signal is reliable (#19). Thea to source and expand the content bank. Done.

~~**11. Monday Mythbusters — scaffold.**~~
`data/content/mythbusters.js` and `MythbusterCard` live on home screen. Data shape: title (the myth), Thea's take, reframe, publish date. Card shows a placeholder when no current myth is live. Scaffold done — awaiting Thea's content entries.

~~**11a. Agni Mythbusters content — loaded.**~~
All 12 myths loaded into `data/content/mythbusters.js` as weekly drip entries (Option A). `series: 'agni'` field added to all entries. `agniEditionClose` exported separately (Thea's closing truth bomb). `weekStart` dates run Aug 17–Nov 2, 2026 — launch week through week 12. Done, June 2026.

⚠️ **Decision still open:** Option B (full edition screen) and Option C (weekly + "read full edition" link) remain available but require a new route. No action needed for the weekly drip to work. Raise with Thea when ready.

**11c. L. Glôw Food Guide — Thea's content, INCOMPLETE — needs follow-up.**
Thea has authored a substantial food guide covering: the medicine-vs-poison food rule, dosha-specific food lists (Vata/Pitta/Kapha medicine and poison foods with examples), same-food-different-effect breakdowns (yogurt, coffee, beans, smoothies, salad), seasonal food guidance by dosha (Spring/Summer/Fall/Winter), life cycle food medicine (Childhood/Adulthood/Elder), women's cycle food medicine (Menstruation/Follicular/Ovulation/Luteal/Postpartum/Perimenopause), and practical "What do I eat?" examples.

⚠️ **INCOMPLETE — content cuts off mid-sentence** in the "Practical What Do I Eat?" section at "Kapha: lentils, greens, s". The lunch examples for Kapha and everything after are missing.

**Follow-up for Matt:** Ask Thea for the rest of the "Practical What Do I Eat?" section and confirm whether there are additional sections beyond it (e.g., dinner examples, snack examples, or a closing section).

**Note:** This is not mythbusters-style content — it's a comprehensive food reference. It likely belongs in the Learn section (as a multi-part Agni/Diet entry or its own top-level concept), the recommendations screen, or a dedicated Food Guide screen. Placement and format decisions needed before building the data structure. This content is also richer than the current Learn entry shape — it would need dosha-split fields, seasonal fields, and life-stage fields to be queryable rather than just displayed as prose.

**40. Freedom with Food — signature content area.**
Source: transcript 28 (062526_01), June 2026. Thea named this as a defining differentiator for L. Glow — the content area that sets it apart from every other wellness app. Her framing: "I think this is probably like just a signature area when I think about my audience — people born in the 80s and 90s — changing that course of what we were fed growing up."

**Working title:** "Freedom with Food" (Thea's own phrase, though she noted it feels slightly scary in a good way).

**Topics Thea outlined:**
- The fear of food
- Good vs. bad food framing — where it came from, why it's wrong
- Emotional eating and stress eating
- Restriction and binge cycles
- Body image and shame
- Why diets fail
- The 80/20 rule — no perfectionism
- Intuitive eating through an ayurvedic lens
- Food and culture — communal eating as healing
- How kids learn food beliefs from us
- Healing generational food patterns
- Creating peaceful meals with family
- Eating through celebrations without guilt
- Food as connection, not punishment

**Framing:** This is NOT about weight loss, macros, calories, or restriction. The ayurvedic lens is: like increases like, opposites bring balance — applied to the emotional relationship with food, not just the physical.

⚠️ **Content dependency:** All topic bodies must come from Thea — this is especially sensitive territory given disordered eating risks (see safety section in CLAUDE.md). Do not draft copy for this section without her explicit guidance. Scaffold the data structure and section layout only.

**Placement:** Lives under the Nourishment pillar in mark 2 nav. Likely a dedicated sub-section or series of articles, not a single screen.

---

**41. Weight Balancing — metabolic health through personalized care.**
Source: transcript 28 (062526_01), June 2026. Weight balancing (not weight loss) is a known acquisition hook — many users will find the app because they want to "lose weight." The framing reorients them: "they'll come because they want to lose weight, but they'll stay because they feel better."

**Core message:** Your body isn't broken. It's communicating.

**Topics Thea outlined:**
- Understanding your metabolism through agni (digestive fire)
- Ama — what accumulates when digestion is off
- Stress and cortisol's role in weight
- Sleep's impact on metabolic function
- Hormones and inflammation
- Movement as metabolic support
- Nourishment (not restriction) as the path
- Herbs and foods that support balanced weight
- Mindset — progress without obsession
- Ways to measure success without a scale
- Breaking the yo-yo cycle
- Making it a lifestyle, not a program
- Real success stories (future — requires Thea's clients to consent)

**Framing:** Never "weight loss." Always "weight balancing" — because it applies equally to people who can't gain as much as to those who want to release. See key decisions section: this positioning is already established.

⚠️ **Content dependency:** Thea to author all topic bodies. The ayurvedic framing of weight as a metabolic/agni question (not a calorie question) is hers to articulate.

**Placement:** Lives under the Nourishment pillar in mark 2 nav alongside Freedom with Food.

---

~~**11b. General Mythbusters set — loaded.**~~
9 myths in Thea's voice loaded into `data/content/mythbusters.js`, June 2026. Schema extended with optional `doshaBreakdown`, `appPrompt`, and `challenge` fields. Weekly drip runs Nov 9, 2026 → Jan 4, 2027. Weekly card renders myth/take/reframe only — richer fields ready for full-edition view when built.

This set is structurally richer than the Agni edition and richer than the current `myth/take/reframe` shape in `data/content/mythbusters.js`. It includes:
- Dosha-specific breakdowns per myth (Vata / Pitta / Kapha, with medicine vs. poison framing)
- Embedded app prompts and check-in questions
- A suggested "challenge" card (Ice Water Test)

**Data structure decision needed before loading:** The current schema won't hold this. Options:
- Extend the schema with an optional `doshaBreakdown` field (Vata/Pitta/Kapha each with `medicine` and `poison` arrays) and an optional `appPrompt` string — myths that don't have dosha breakdowns leave those fields null.
- Or keep the two editions in separate data files if they're meant to be different content types.

Same placement question as 11a applies — weekly drip, special edition screen, or both. Thea may want these as separate themed editions (Agni vs. Water/Hydration) or one unified Mythbusters pool.

---

~~**51. Build the Mythbuster "challenge" card — currently unused data.**~~
Source: Matt, July 2026, spotted while reviewing the practitioner Mythbusters admin editor. The `challenge` field (`title`, `instructions`, `track[]`) had been sitting in the schema and loaded on the `cold-drinks-healthy` entry (Dec 28 week, "The Ice Water Test") since #11b shipped, but nothing in the consumer app ever read it.

Design sketch approved by Matt, July 17 2026: **[Challenge Card sketch](https://claude.ai/code/artifact/fab363e5-120a-4269-94ea-7c5251f1fb5c)**. Built exactly per its four decisions: not labeled "Challenge" (eyebrow reads "Something to try"), `track[]` renders as soft "Notice this week" tags with no tap target or completion state, single interaction is "Reflect in Journal," rendered as a fourth section on the existing Mythbuster card rather than a new screen.

**Built July 23 2026:**
1. `app/index.js` — `MythbusterCard` now renders a `challenge` section when present: warm honey-amber wash (visually distinct from the neutral `reframe` box), title, instructions, `track[]` as pill tags, and a "Reflect in Journal →" link.
2. `app/journal.js` — added `useLocalSearchParams()` and a `reflect` param. When present, shows a contextual "Reflecting on: {title}" banner above the prompts — doesn't pre-write any answer text, purely orients the user to what they clicked through for. No new storage, no tracking state.
3. Verified end-to-end via Playwright (date pinned into `cold-drinks-healthy`'s week to trigger `currentMythbuster()`): card renders, tap navigates to `/journal?reflect=The%20Ice%20Water%20Test`, banner shows correctly.

**Still open:** final eyebrow wording ("Something to try" vs. "An experiment" vs. Thea's own phrase) — shipped with the sketch's default, flagged for her sign-off same as other draft copy.

---

---

## Logo & brand

~~**25. Replace logo mark with the O from the style guide.**~~ Shipped — see the "Shipped" section near the top of this doc. *(This was a stale duplicate left behind after the item shipped — removed July 2026 during a roadmap read-through. If you're looking for logo/brand follow-up work, it isn't here; nothing open in this section right now.)*

---

## Visual & design work

**21. Imagery pass — herbs, food, botanicals, candlelight.**
Incorporate more of the brand's visual language throughout the app. Priority subjects from the style guide:

- Herbs: loose dried herbs, bundles of rosemary, sage, lavender
- Tea: steam-rising cups, clay/ceramic vessels
- Ayurvedic food dishes: warm, earthy, texturally rich
- Terracotta tones: clay pots, mortar and pestle, warm earth surfaces
- Candles: soft candlelight, beeswax, ritual atmosphere

Where to apply: hero banners on recommendations screen and learn screen; background texture on the You tab; seasonal imagery on the home screen. Photo art direction should feel grounded and domestic — a real kitchen, a real windowsill — not a styled spa shoot.

Build order: identify current screens with placeholder or no imagery first, source or request photos, apply using the established View+Image pattern (not ImageBackground).

*Partial — Home, Journey, and Journal screens have real photos. Tools and You screens still have placeholder imagery. Recommendations and Learn screens not yet touched.*

---

## Navigation expansion — four new top-level sections

~~**13. Journey**~~
Built — `app/journey.js`, four tabs (Overview, Ayurveda, Habits, Cycles). Overview, Ayurveda, and Cycles have real content. **Habits is still a "Coming Soon" placeholder** — that's the check-in-history/dosha-trends-over-time piece this item originally described, and it's correctly still gated: needs a conversation with Thea about what "progress" looks like in ayurveda before building, same reasoning as #17 below (which explicitly waits for real user data).

**14. Tools**
A curated toolkit of standalone ayurvedic practices — things the user can reach for on demand rather than as part of a daily flow. Scaffold is live with 2-column practice grid + education cards.

Confirmed sections (May 2026):

*Practices (2-column grid):*
- **Recipes** — `app/recipes.js` — placeholder. Dosha-wise meals and kitchen preparations. Content dependency: Thea to author recipes one at a time, each tagged with dosha, season, and preparation notes.
- **Herbs** — `app/herbs.js` — live with existing `data/content/herbs.js` data. Content flagged as draft, pending Thea's review of summaries and use instructions. **See item 36 below — Thea has produced a full A–Z database that supersedes this draft entirely.**
- **Breathwork** — `app/breathwork.js` — placeholder. Pranayama matched to dosha and state. Content dependency: Thea to author techniques per dosha.
- **Meditation** — `app/meditation.js` — placeholder. Dosha-specific stillness practices. Content dependency: Thea.
- **Self Massage** — `app/selfmassage.js` — placeholder. Abhyanga protocols by dosha — oils, strokes, timing. Content dependency: Thea.
- **Journal** — routes to existing `app/journal.js`. ⚠️ Currently also a top-level nav tab — consider removing the standalone Journal tab once Tools is the established home for it.

*Education (full-width cards):*
- Learn, About Thea — unchanged.

~~**15. Journal**~~
Built — `app/journal.js`. Three dated prompts (grateful/showed/tomorrow), stored locally and synced to Supabase, a real "Earlier" history list (`loadAllJournalEntries()`, replacing what used to be hardcoded mock data — see the global search work, roadmap #44). Mythbuster "Something to try" cards can deep-link in with a contextual "Reflecting on…" banner (#51, July 2026).

~~**16. You**~~
Built — `app/you.js`. Dosha result + breakdown (`DoshaWheel`), quiz retake, colored result badges across all six assessments, intake form link, the User's Manual teaser (#48), Settings, and Account/sign-out. Session history and booking integration mentioned in the original scope aren't built and have no dedicated tracking item — flag if that becomes real work.

**27. Goals section in "You" tab.**
A personal goals section on the You screen — things the user is working toward in their practice, informed by their dosha and season.

⚠️ **Naming and framing conversation needed before building.** The voice guide (item #8, "Just for today") explicitly says never call something a "goal" or a "challenge" — it should be an offering. Before building, confirm with Thea how she wants to frame this: "Intentions," "Your practice," "What you're working with," or something else entirely. The UI shape and copy follow from that framing.

**Likely shape once framing is confirmed:**
- A short list of user-set intentions or focus areas (1–3 at a time, not a backlog)
- Dosha-aware suggestions to seed the list if the user wants them
- Soft, editable — no completion states, no due dates, no streaks
- Persisted in AsyncStorage locally

**Data structure:** Simple array of text entries with optional `createdAt` and `dosha` tag. Lightweight until the framing is clearer.

~~**22. Prakriti visualization in "You" tab.**~~
`components/DoshaWheel.js` — SVG donut chart with three colored segments proportional to dosha scores. Primary dosha name + percentage centered in the donut. Three-column legend below (name + %). Wired into You tab. Component is reusable — can also replace the bar chart on the result screen when ready. Done.

~~**Mark 2 nav restructure — four content pillars.**~~
Bottom nav rebuilt around Thea's four content pillars (transcript 28). Done, June 2026.

| Tab | Route | What lives there |
|-----|-------|-----------------|
| Lifestyle | `/lifestyle` | Daily check-in · Tongue check · Journal · Affirmations · (coming: Morning Ritual, Evening Wind-down, Daily Routine, Sleep Guidance) |
| Movement | `/movement` | Breathwork · Meditation · Self Massage · Tongue Check · (coming: Asana, Pulse Reading) |
| Check In | `/checkin` | Daily check-in flow |
| Herbs | `/herbs` | Herb library · (coming: Herb + Food database #36) |
| Nourishment | `/nourishment` | Recipes · (coming: Food Guide #11c, Freedom with Food #40, Weight Balancing #41, Herb + Food Guide #36) |

Home (`/`), Journey (`/journey`), You (`/you`), Journal (`/journal`), Tools (`/tools`) — all still reachable from the hamburger drawer. Bottom nav no longer shows them.

~~**24. Rename Journal tab to Check In.**~~
Done — Check In is now its own pillar tab at `/checkin`.

---

## Architectural work — do when needed, not preemptively

~~**17. Check-in history view.**~~
Built July 25 2026, once real data actually existed — checked a real early tester's actual check-in history first rather than guessing at the shape (9 check-ins over 6 weeks, irregular gaps up to 16 days, real value variance), and designed around what that showed rather than an assumed daily-density pattern.

**Built:** new `components/CheckinTrendChart.js` (react-native-svg line+area chart, no new dependency) and `app/journey.js`'s Habits tab (previously a "Coming Soon" placeholder). A single dimension's trend shows at a time — Physical/Mental/Emotional/Morning hunger/Tongue coating, picked via chips, defaulting to Morning hunger per this item's own original note ("the first diagnostically interesting view"). Labels/hints load from the live-editable `checkin_dimensions` content (same pattern as Mythbusters etc, #50) rather than the static fallback, so they automatically match whatever Thea's renamed them to in the practitioner hub (confirmed live — her real current wording is noticeably more voice-y than the static file's plain labels, e.g. "Good Morning, Belly" for hunger).

**Design decisions, made after looking at real data, not before:**
- **Gaps in checking in break the line instead of interpolating across them** (threshold: 4+ days) — a straight line across a real 16-day gap would visually imply a trend that was never measured. Isolated points (no neighbor within the threshold) still render as a dot, just unconnected.
- **90-day window**, not 30 — a tight 30-day window would have cut off more than half of the real test data used to validate this.
- Y-axis is plain numeric (1/3/5) only. First attempt tried putting a dimension's hint text (e.g. "genuinely hungry") directly on the axis — caught via actual rendering + screenshot (not assumed) that it wraps into an unreadable vertical letter-stack in the narrow axis column and collides with the x-axis date label. Moved hint text to a normal-width caption line above the chart instead.
- Empty state (fewer than 3 real points for the selected dimension) shows an encouraging line, not a sparse/broken-looking chart — "Not quite enough here yet — a few more check-ins and this will start to take real shape."
- Tap-to-select any point shows its exact value + date below the chart (mobile-appropriate stand-in for hover, since there's no cursor on a phone); most recent point is selected by default.

Verified via Playwright against both a realistic seeded dataset (matching the real tester's actual gap pattern) and the sparse/empty-state path — no console errors, no visual collisions after the axis-label fix.

**Known limitation, not fixed — deliberately, July 25 2026.** Tested a dense synthetic dataset (85 daily check-ins) to check the other end of the range: the trend line itself still reads fine, but individual point markers overlap into indistinguishable clumps at repeated peak/valley values, and tap-to-select gets unreliable in those clusters. Nobody has this much history yet — the most active real tester has 9 check-ins over 6 weeks, not 85 daily — so this is left as-is rather than adding point-thinning/clustering complexity for a scenario that doesn't exist in real data. Matt's explicit call. Revisit once a real user's data actually gets dense enough for it to matter.

~~**44. Search — global, direction decided July 17 2026; scope/build still open.**~~
Source: Matt, July 2026, originally flagged as the app's content footprint grows (Learn, Herbs, Mythbusters, Recipes, and eventually the Herb + Food Database in #36, Freedom with Food in #40, Weight Balancing in #41).

**Scoped and built, July 22 2026.** Revisiting turned up two things that reshaped the July 17 direction, both confirmed with Matt before building:
- **Icon placement**: hub/content screens only (Home, You, Journey, Herbs, Nourishment, Movement, Lifestyle, Tools, Learn, About, Quizzes/Prakriti/Vikriti hubs, Recommendations) — not quiz-taking flows, Welcome, login/signup, or Checkin's hero-overlay header, all bad fits for a persistent icon. `you.js`/`journey.js` already had a dead header slot with a comment literally reserving it for this.
- **"Search the user's own data"** hit a real gap: `app/journal.js`'s "Earlier" list was hardcoded mock data, not real saved entries, and nothing loaded more than today's entry. Built a real `loadAllJournalEntries()` and fixed the fake list as a prerequisite — a genuine bug fix independent of search (users were being shown fabricated past entries).

**What shipped:** `data/searchIndex.js` (normalized entries from Learn, Herbs, Mythbusters, Recommendations, doshaInfo, cycles, Tongue Check reference, Guna/Agni result copy — plus the user's own journal/check-in notes), `app/search.js` (results grouped Content/Your Data, capped at 20/group, plain substring matching — same philosophy as `herbs.js`'s existing search), `components/SearchButton.js` (shared icon, wired into all 14 screens). Sources with an addressable screen deep-link there (Learn's existing `conceptId` param, new `herb`/`tab` params on `herbs.js`/`journey.js`); sources with none (Mythbusters, Tongue Check reference, Guna/Agni result copy, check-ins) open an in-place detail sheet on `/search` itself.

**Bundled bug fix:** `prakriti-quiz.js`/`vikriti-quiz.js` were missing their `headerShown:false` registration in `_layout.js` — found while touching the same file, fixed alongside (they were double-rendering the native header on top of their own).

Matching strategy landed on plain substring (not ranked/multi-strategy) and content scope stayed to what's actually populated (`movement.js` asanas, `music.js` playlists, `intentions.js`/`routines.js` are still placeholder-only and excluded) — the open questions below are resolved, kept for the reasoning history.

**Framing discussion, July 2026 (superseded by the global decision above, kept for the tradeoff reasoning):**

- ~~Leaning scoped over global.~~ #36's own spec already calls for *symptom-based* search ("bloating," "anxiety," "PMS") — that's tag/curated-index matching, not full-text keyword search. That's a fundamentally different mechanism than what Learn (essay full-text) or Recipes (dosha/season/ingredient filters) would need. Bolting all three under one global search box means picking one mechanism and making the others worse fits. Each content-heavy screen getting its own tuned search field is the more honest design, at least to start — a global entry point becomes more justified once #40/#41 also ship and the footprint is wide enough that "which section is this even in" becomes a real user question.
- **Mechanically simple regardless of scope.** Mark 1 is local-only, so this is never a real search index — it's client-side filtering over the static `data/content/*.js` arrays (title/tags/teaser matching). Cheap to build, but easy to under-notice a bad filter at low content volume — worth re-testing the matching quality once #36 triples the entry count, not just assuming it still works.
- ~~Where it'd surface, given the scoped lean above: a search field at the top of each content screen.~~ Superseded — global icon per the decision above.

---

~~**45. Link the Dosha Quiz and Guna Quiz to their Learn pages.**~~
`app/learn.js` now reads a `conceptId` route param (via `useLocalSearchParams`) and auto-opens the matching concept modal on mount. `app/quiz.js` shows a "What's a dosha, anyway? →" link on the first question, linking to `/learn?conceptId=doshas`. `app/guna-quiz.js` shows "What are the gunas? →" on its first question, linking to `conceptId=gunas-mental`. (Param ended up named `conceptId`, not `concept` as originally sketched — no functional difference.) Done July 2026.

---

## App architecture — Thea's stated framework

*From voice memo, April 2026 + transcript 28, June 2026.*

**Two complementary frameworks — don't conflate them:**

**Framework 1 — The four user-facing content pillars (navigation architecture):**
Source: transcript 28. How users navigate and discover content. The mark 2 nav is built around these:
- **Lifestyle** — how you live: daily rhythms, morning/evening rituals, sleep, stress, relationships, home environment, digital wellness
- **Movement** — how you move: yoga/asana, breathwork, meditation, self-massage, walking/rest/recovery; tuned by dosha, season, cycle, age
- **Herbs** — nature's support: herbs, teas, spices, remedies, supplements; medicine vs. poison; home apothecary
- **Nourishment** — how you feed body and mind: food, recipes, mindful eating, Freedom with Food, Weight Balancing, seasonal guidance

Sound (music/vibration/nervous system regulation) and the L. Glow Guide (AI personalization) sit alongside these as cross-cutting experiences rather than a fifth pillar.

**Framework 2 — The 4×4 recommendation routing matrix (content depth):**
How recommendations are routed once content is rich enough. Not visible navigation — the engine underneath.

**The 4×4 framework:**

Four pillars: **Physical · Emotional · Mental · Spiritual**
Each pillar has four sub-domains: **Nourishment · Herbs · Movement · Lifestyle**

16 cells total. Her words: *"That is really the basic of the app."*

Examples she gave:
- Physical / Nourishment: food combining, time of day, doshas
- Emotional / Nourishment: your relationship to the food while eating it — do you love it, are you present?
- Physical / Herbs: supplementing what food alone can't provide
- Physical / Movement: rest and postures vs. sweat and movement
- Physical / Lifestyle: sleep before 10, phone down before bed, wake before 6

**What this means for architecture:**
Mark 1 recommendations are organized primarily by dosha and season. That structure fits inside this framework but doesn't fill it. When content is rich enough, the recommendation engine should route by pillar + sub-domain as well as dosha. No action now — flag it when designing any new recommendation schema or when scoping mark 2.

---

## Longer horizon — for when the center gets closer

- **L. Glow Guide — AI-personalized support.** Thea's vision: "one of one guides and personal plans" based on the user's dosha/constitution. The north star form of the app's recommendation engine — not a static food list or generic tips, but a living, personalized guide that adapts to who the user is right now. Requires: rich check-in history, locked content pillars, and likely a backend capable of storing and querying user state over time. Phase 3 or beyond — name it now so future architecture decisions don't close the door on it.

- **Community space.** Thea explicitly named this as phase 2/3: "comparing and talking about your journey with other people is going to be important when the time is right." Not for launch. Flag any architecture decision that would make a social layer harder to add later.

- **Vikriti visualization — separating Prakriti from Vikriti properly.** ~~Superseded by #52 (Prakriti/Vikriti Layered Assessments) for the *source* of each signal~~ — Matt moved from "infer Vikriti from other signals" to "ask direct layered questions for both," see #52. The visualization goal below (sticky Prakriti swatch + a moving Vikriti swatch) is unchanged and still the eventual UI target once #52's content and scoring exist. Note (Matt, July 2026): Prakriti and Vikriti are both dosha-based readings, but answer different questions — **Prakriti is the constitution you were born with** (fixed) and **Vikriti is your current state** (changeable day to day). The design goal: show Prakriti as something sticky/stable in the UI, and derive Vikriti as the thing that visibly moves. A second color swatch alongside the Prakriti one, showing vikriti as derived over time. The visual gap between the two swatches makes prakriti vs. vikriti tangible — you can see how far you've drifted and which direction.

  **Refined July 17 2026 — where each signal should actually come from:**
  - **Prakriti** should be driven by either (a) the standalone Dosha Quiz result, or (b) the intake form's Section 14 Prakriti constitution assessment (`app/intake.js`, ideally done 1:1 with Thea per its own framing). **Open question, not yet decided:** both currently produce a prakriti-shaped reading independently — which one is authoritative if a user has done both, and in which order? A dosha-quiz-first user who later completes intake Section 14 with Thea might get a different reading than their quiz gave; does the intake result then override the quiz result as the more clinically-grounded one, or do they need to be reconciled/shown separately? Not a build task yet — a framing question to settle (with Thea's input, since it's a clinical-methodology call, not just a UI one) before touching the data model.
  - **Vikriti** should not be scoped to daily check-in data alone — it should be a running aggregate of *every* signal the app collects that carries dosha-relevant information: check-ins, Guna Assessment, Agni Assessment, Tongue Check, journal entries, possibly dosha-quiz retakes. Broader than what the original note below scoped, and a bigger lift — an aggregation layer across several already-separate tables (`checkins`, `guna_results`, `agni_results`, `tongue_checks`), not just one.

  **Still requires (unchanged from the original note):** (a) check-in questions revised to reliably signal dosha state (#19), (b) an algorithm to compute a running vikriti estimate — now from multiple signal sources, not just check-ins, which is a bigger design question than originally scoped, (c) enough data from real users to validate the signal. Do not build the algorithm until the question set is locked and the Prakriti-source question above is settled.
- Practitioner-side tools: Thea views a client's check-in history before a session.
- "Book a session with Thea" CTA wired to scheduling software, or eventually in-app.
- ~~Account creation~~ — done, Supabase Auth (#29). Cross-device sync still deferred — depends on #30's data layer, which isn't built yet.
- Content review pass by a second credentialed practitioner.
- App Store / Play Store submission (year two or when Thea is ready for public exposure).

---

~~**32. Mental Constitution Quiz — Guna assessment (Sattva / Rajas / Tamas) — scaffold.**~~
`app/guna-quiz.js`, `app/guna-result.js`, and `data/content/gunaQuiz.js` built and live. Gated behind dosha quiz + 7 check-ins on the You screen. Quiz flow and result screen complete. Questions replaced with Thea's 15 questions from transcript 16. Result copy built — see 32-content.

~~**32-content. Guna result copy.**~~ Built June 2026 from transcript 18 — full copy in `data/content/gunaQuiz.js`; `app/guna-result.js` rebuilt with summary, gifts, watchFor, pathForward, reflection, practices, and lGlowNote. DRAFT, awaiting Thea's review.
Thea explicitly requested this in voice memo 08: *"This is really fun for the app — something we can definitely bring in when somebody is comfortable."* A second self-assessment quiz, distinct from the dosha quiz, that evaluates a user's current mental and spiritual state across 24 dimensions.

The assessment covers: diet, drug/alcohol use, sensory impressions, sleep, sexual activity, sense control, speech, cleanliness, work motivation, anger, fear, desire, pride, depression, love, violent behavior, money attachment, contentment, forgiveness, concentration, memory, willpower, truthfulness/honesty, peace of mind, creativity, spiritual practice, and service orientation.

Each question has three answers: left = Sattvic, middle = Rajasic, right = Tamasic. Score total to determine dominant guna. Result surfaces practical guidance on moving from Tamas → Rajas → Sattva (or Rajas → Sattva if already there).

**Key design constraints from Thea:**
- Gate this quiz behind some engagement — don't surface it to a user on their first day. A reasonable trigger: completed the dosha quiz + 7+ check-ins. Thea's framing: "when somebody is comfortable."
- The result should never shame. Tamas is information, not failure. The whole point of principle #4 ("there is no good, there is no bad, there just is") applies directly here.
- Thea also noted: "comparing and talking about your journey with other people is going to be important when the time is right." This is a future social/sharing feature, not a launch requirement.

**Content dependency:** The 24 assessment dimensions and all three answer columns come from transcript 08 and are ready to scaffold. The result copy (what does your guna dominance mean, what does the path forward look like) must come from Thea before shipping.

**Data:** Stores as a `guna_results` record alongside the dosha result — `sattva_score`, `rajas_score`, `tamas_score`, `dominant_guna`, `taken_at`. Schema already planned in `lglow.` MSSQL schema — add this table alongside the others.

---

~~**43. Un-gate the Guna Quiz and give it its own drawer nav entry.**~~
Confirmed with Thea, July 2026 — she wants it in the nav, reversing her original "when somebody is comfortable" engagement gate (see #32). `app/you.js`: removed the `gunaUnlocked` check (dosha quiz + 7 check-ins) — Guna Assessment now always shows in the You-tab Settings list; also removed the now-dead `checkinCount` state that existed only to feed that gate. `components/HamburgerDrawer.js`: added a "Guna Quiz" item routing to `/guna-quiz`, directly under "Dosha Quiz."

Resolved the open question by keeping both entry points rather than removing the You-tab row: the You-tab Settings entry still shows the dominant-guna subtitle once taken (a nice bit of state the drawer link doesn't have room for), and the drawer entry gives global one-tap access consistent with how Dosha Quiz is already surfaced. Worth flagging to Thea if she'd rather the You-tab row disappear now that the drawer covers discovery — easy to remove later if so.

---

## Visual & component polish

~~**28. Revisit the dosha wheel — restore the three-percentage breakdown.**~~
Three large stat-style percentage cards (Vata / Pitta / Kapha) now render below the donut chart inside the "Your Constitution" card on the You screen. Done.

~~**35. Dosha archetype content — transcript 19.**~~
Personality archetype added to `doshaInfo` in `data/content/quiz.js` for each dosha: name (The Wanderer / The Warrior / The Keeper), balanced traits, imbalanced traits, the trap, the truth, and a reminder line. New archetype section added to `app/result.js` with the closing "We are all three" line. Archetype reminder lines added to `data/content/affirmations.js` (v-4, p-4, k-4). DRAFT — awaiting Thea's review.

~~**Standardize the Continue button across every quiz question, July 22 2026.**~~ Matt flagged the Dosha Quiz as inconsistent (Continue showed on multi-select questions, not single-select) — turned out to be a three-way inconsistency across all 6 assessments: Guna/Agni/Tongue Check always auto-advanced on tap, Dosha Quiz was mixed, Prakriti/Vikriti already required Continue on every question. Since multi-select can never auto-advance (no way to know the user's done picking without an explicit confirm), standardized the other direction — every question in `quiz.js`, `guna-quiz.js`, `agni-quiz.js`, and `tongue-check.js` now requires tapping Continue, matching Prakriti/Vikriti's existing pattern. Selecting an option highlights it rather than advancing immediately; Continue stays disabled until something's picked.

**Single- vs. multi-select is intentionally content-driven, not a UI inconsistency — don't "fix" this again.** Checked immediately after the Continue-button work above, since it's the natural next question: whether a question allows one answer or several is a scoring/semantics decision per question, not something that should be uniform.
- **Dosha Quiz**: mixed by design — most questions single-select, but Skin and Hair are multi-select because "dry but also sensitive" is a real combination Thea named (see the field-research notes on #18 above).
- **Guna Quiz, Agni Assessment**: always single-select — each question tallies toward one Sattva/Rajas/Tamas or Agni-type bucket per answer; multi-select would break that scoring math.
- **Tongue Check**: the 4 core observations (shape, size, color, coating) are single-select — a tongue only has one shape. The closing "anything else you notice?" step is multi-select, since multiple signs can co-occur.
- **Prakriti, Vikriti**: always multi-select — a trait can genuinely blend across doshas.

Making everything multi-select would change what several of these quizzes actually measure, not just how they feel to use — a real content/scoring change, not a consistency fix, if it's ever wanted.

---

## Pre-launch requirements — must ship before public release

**29. User authentication — login, logout, and account persistence.**
~~Auth fully rebuilt on Supabase~~ — architecture pivot, July 2026 (see below). Login, signup, magic-link, and session persistence all live on Supabase Auth. `context/AuthContext.js`, `config/supabase.js` wired through the app; You tab shows signed-in state and sign-out. Added a password-recovery completion screen (`app/login.js`'s `RecoveryForm`) that Firebase never needed — Supabase has no hosted reset page, so "set a new password" has to happen in-app. Remaining: backend sync (AsyncStorage → Supabase on first login) and the migration flow for existing local users — folded into #30 below.

**Architecture pivot, July 2026: Supabase only. ColdFusion/MSSQL plan dropped entirely, not deferred.**
The original plan (Firebase Auth + ColdFusion CFCs + MSSQL, with a Supabase upgrade "once the app generates revenue") is superseded — Matt set up a Supabase project and decided to build directly on it instead of standing up the ColdFusion layer at all. Supabase now owns both identity (Supabase Auth, replacing Firebase Auth — a real rebuild, not a swap, since Firebase Auth was already shipped and working) and data (Postgres with Row Level Security, replacing MSSQL + CFC business-logic isolation).

**What this simplifies:** Supabase auto-generates a REST API from the Postgres schema (PostgREST) and enforces per-user data isolation via RLS policies keyed on `auth.uid()`. There's no custom API layer to hand-build the way #31's ColdFusion route spec assumed — see the superseded-note on that item. The app talks to Supabase directly via `@supabase/supabase-js`.

**Behavioral differences worth knowing, not just a drop-in swap:**
- Magic link can't be completed on a different device than the one that requested it (Supabase's PKCE flow needs a code verifier that only exists in the requesting device's local storage). Firebase had the same real limitation but surfaced it as a recoverable "confirm your email" prompt; Supabase just fails the exchange, so the UI now says "request a new one from this device" instead of pretending recovery is possible.
- `signUp` may or may not return an active session depending on the Supabase project's "Confirm email" setting — `AuthContext.signUp()` now returns `{ needsEmailConfirmation }` so `signup.js` can branch correctly instead of assuming immediate sign-in.

~~**Redirect URL bug, found + fixed July 2026:**~~ `REDIRECT_URL` was hardcoded to the native `l-glow://login` deep link scheme for every platform, including web — a browser has no handler for that, so Supabase's post-verification redirect dead-ended after a real signup (confirmed live: the email link itself worked, verification succeeded server-side, but the browser landed nowhere). Fixed in `context/AuthContext.js` — web now redirects to a same-origin `https://` URL (`window.location.origin + '/login'`), native keeps the custom scheme. Matt added `https://l-glow.vercel.app/login` to Authentication → URL Configuration → Redirect URLs in the dashboard to match.

**Still needed (Matt, in the Supabase dashboard — not something Claude Code can do remotely):**
- Confirm the "Confirm email" setting under Authentication → Providers → Email matches what you want (whether new signups need to click a confirmation link before they're signed in)
- Native-device testing of the full auth flow — sign up, magic link, password reset. The web flow (signup → confirm → login → password reset) has now been exercised live end-to-end on `l-glow.vercel.app`, including finding and fixing the redirect bug above — but nothing has been run on an actual iOS/Android device yet.

⚠️ **New gap found during live testing, July 2026 — custom SMTP needed before real users sign up.** Supabase's default built-in mailer (no custom SMTP configured) has a very low shared rate limit — a handful of test signups/resets in one session was enough to trigger "too many attempts, try again in a few minutes" project-wide, not per-address. This will hit real users at launch. See #49 below.

Scope (updated from original Firebase-era list):
- Account creation — email + password to start; social login (Google, Apple) can follow, Supabase supports both natively
- Login and logout flows with L. Glow design system screens — no Supabase default UI, same constraint as before
- Session persistence — Supabase's `onAuthStateChange` listener + AsyncStorage-backed session storage
- Graceful unauthenticated state — unchanged, app still works fully offline/local before login
- ~~On first login after using the app locally, migrate existing AsyncStorage data to Supabase under their new account~~ — done, July 14 2026, see #30 Gap 2

**30. Backend data layer — user data storage and practitioner reporting.**
Thea needs to be able to see her clients' data — check-in history, dosha results, journal entries, practice completions — and draw clinical insight from it ahead of sessions. This is a core part of her practitioner value proposition and the app's long-term job.

**Architecture: Supabase Postgres + Row Level Security.** Replaces the ColdFusion/MSSQL plan entirely (see #29's pivot note). User data isolation is enforced by RLS policies keyed on `auth.uid()` — no CFC business logic layer, no separate JWT verification step to write, Supabase's own auth system and Postgres handle both natively.

Scope — two surfaces, sequenced (unchanged from the original plan, just a different foundation):

~~*Phase 1 — User data persistence (depends on #29, which is done):*~~ **Schema + dual-write done, July 2026. Two real gaps remain — see below, not swept under "done."**
- Tables live: `supabase/migrations/20260711000000_init_schema.sql` — `users` (auto-created via trigger on signup), `dosha_results`, `guna_results`, `agni_results`, `checkins`, `journal_entries`, `intentions`, `intake_forms`, `practice_completions`. More complete than the original bullet list (that one didn't name guna/agni/intake as separate tables, but the app persists all three, so they needed rows too). RLS: owner-only on every table via `auth.uid() = user_id` — no practitioner-read policies yet, deliberately, since Phase 2 needs Thea's input first.
- `data/user/storage.js` writes to both AsyncStorage and Supabase now (`saveDoshaResult`, `saveGunaResult`, `saveAgniResult`, `saveCheckin`, `saveIntention`, `saveUserName`), plus `app/journal.js` and `app/intake.js` (which manage their own storage outside `storage.js`). Best-effort: a failed Supabase write is logged and swallowed, never blocks the local save — AsyncStorage stays the thing every `load*()` function actually reads from.
- ~~**Gap 1 — the app doesn't read from Supabase yet.**~~ Closed July 14 2026. `hydrateFromSupabase()` in `data/user/storage.js` (dosha/guna/agni results, display name, checkins, today's intention) plus `hydrateIntake()`/`hydrateJournal()` exported from `app/intake.js`/`app/journal.js` (which manage their own storage) now pull existing Supabase data down into AsyncStorage. Triggered from `AuthContext.js` on both app boot (already signed in) and fresh sign-in. Merge policy: only fills in what's missing locally, never overwrites — a device with its own history is left alone. This is genuinely cross-device now, not just backup — sign into the same account on a new device and existing data appears instead of starting empty.
- ~~**Gap 2 — no AsyncStorage→Supabase migration for existing local users.**~~ Closed July 14 2026. `migrateLocalToSupabase()` in `data/user/storage.js` plus `migrateIntake()`/`migrateJournal()` in `app/intake.js`/`app/journal.js` push existing local history up on first sign-in — mirror image of the hydration functions above, same "only fill gaps, never overwrite" policy in the reverse direction. Gated by a one-time local completion flag (`@lglow/migrated_to_supabase`) so it only runs once per device, not on every sign-in. Known limitation, accepted rather than solved: if the same day/result exists independently on both local and Supabase (never having synced), neither side overwrites the other — this closes "never synced at all," not a full two-way merge with conflict resolution.
- ~~**Not yet run**~~ — migration confirmed run against the live project July 12, 2026 (all 9 tables verified live, anonymous insert correctly rejected with RLS error 42501). Read/write now confirmed working end-to-end via real usage, July 13: an intake form filled out as a signed-in test user synced to `intake_forms` and was readable through the practitioner dashboard (#30 Phase 2). Still not tested on a real native device, only web.
- ~~`practice_completions` exists as a table but nothing in the app writes to it~~ — closed Aug 11 2026. Journey's Overview tab "Daily Practices" checklist (`app/journey.js`) previously reset to all-unchecked on every mount — the checkbox state was never persisted anywhere, local or remote. `loadTodayPracticeCompletions()`/`togglePracticeCompletion()` (`data/user/storage.js`) now back it with the same AsyncStorage-source-of-truth + best-effort Supabase dual-write pattern as check-ins/intentions: one flat `{practiceId: bool}` map per day in AsyncStorage, mirrored to `practice_completions` as an insert (checking on) or a scoped delete (checking off) so toggling back and forth doesn't pile up duplicate log rows. Also hydrates today's completions from Supabase on sign-in, so checking something off on one device shows up on another the same day. No AsyncStorage→Supabase migration path added — the feature has no pre-existing local history to migrate, unlike the other fields in this list.

*Phase 2 — Practitioner-facing reporting (Thea's view):*

~~A rough v1 exists now, July 2026 — built explicitly to react to, before the real design conversation.~~ Matt's call: don't wait for the conversation to build a first pass. Scope is deliberately narrow:
- `app/practitioner/index.js` (moved from `app/practitioner.js` when the hub restructure landed, see #50) — client list (consented users only) → tap into one → read-only view of their intake form, using the same `SECTIONS` labels `app/intake.js` uses (exported from there so there's one source of truth for the form's structure, not two copies).
- ~~Drawer entry "Practitioner View," always visible~~ — **stale, corrected July 17 2026.** It briefly lived in the You tab's Settings list instead (not the drawer), then was deliberately removed entirely on July 16 (commit `adf27fb`) — Matt's call: Thea gets the `/practitioner` link directly rather than discovering it in-app. Confirmed by audit July 17: no reference to the route anywhere in the regular app's nav (drawer, You tab, home, welcome) — the only remaining reference is the required `<Stack.Screen name="practitioner" />` registration in `app/_layout.js`, which has to exist for the route to work. RLS + the `role` check in `app/practitioner/_layout.js` (not UI discoverability) is still the actual access gate. ~~A non-practitioner (or nobody signed in) who navigates there directly still just sees "This view is for practitioners only" — it doesn't distinguish "not signed in" from "signed in, wrong role."~~ Tightened up July 17 2026: `app/practitioner/_layout.js` now shows "You'll need to sign in first." plus a "Go to sign in" button (→ `/login`) when there's no session at all, versus "This view is for practitioners only." when signed in under a non-practitioner account. ~~One remaining bit of friction, not fixed: `/login` always redirects to `/` on success (no `returnTo`).~~ Fixed same day: the "Go to sign in" button now links to `/login?returnTo=/practitioner`; `app/login.js` reads that param and `PasswordTab` uses it in place of the hardcoded `router.replace('/')` on successful sign-in. Login also now defaults to the Password tab (not Magic link) whenever `returnTo` is present — magic link can't carry it through the email round-trip (the emailed link lands back on `/login` with a session already established; nothing reads the query param at that point), so defaulting to Password is what actually makes the redirect work. Thea can still switch tabs manually if she prefers magic link, she just won't land back on `/practitioner` automatically if she does.
- **Consent is a single boolean** (`users.consented_to_practitioner_view`), not the richer `practitioner_clients` join table with `consented_at` originally sketched — there's exactly one practitioner right now, and a join table for a 1:1 relationship was more structure than v1 needed. Revisit if/when there's ever a second practitioner.
- `supabase/migrations/20260712000000_practitioner_view_v1.sql` adds the column and two RLS policies (practitioners can read a consented client's `users` row and `intake_forms` row — nothing else yet; dosha results, check-ins, journal entries have no practitioner-read policy, so the dashboard can't see those even if it tried).

⚠️ **No UI exists yet for role assignment** — still manual SQL (template at the bottom of the migration file), intentionally: a user should never be able to self-grant practitioner access. ~~No UI exists yet for consent~~ — **closed July 14 2026:** a "Share with Thea" toggle in the You tab's Assessments section lets a signed-in user flip `consented_to_practitioner_view` themselves. No new RLS policy needed — the existing "users can update their own row" owner policy already covered it.

**Verified end-to-end, July 13 2026:** the `20260712000000_practitioner_view_v1.sql` migration (consent column + policies) had actually never been run against the live project despite existing in the repo — run for the first time this session. Test accounts configured by hand: `mvanderholm@yahoo.com` set to `role = 'practitioner'`, `mvanderholm@gmail.com` left as `role = 'user'` with `consented_to_practitioner_view = true`. That test surfaced two real bugs, both fixed:
- **RLS infinite recursion** — "infinite recursion detected in policy for relation users." Both practitioner-read policies checked the caller's role via a subquery on `public.users` from within a policy defined *on* `public.users`, which forces Postgres to re-apply that same policy recursively. Fixed via `supabase/migrations/20260713000000_fix_users_rls_recursion.sql` — a `SECURITY DEFINER` function (`public.is_practitioner()`) checks the role without re-triggering RLS, breaking the cycle. This is the standard Supabase-documented pattern for this exact class of bug — worth remembering if any future policy needs to check a role stored in the same RLS-protected table.
- The authorization check in `app/practitioner.js` was silently swallowing query errors (only destructuring `data`, never `error`), making a failing query indistinguishable from a legitimate "not a practitioner" result. Now logs the error.

With both fixed, the full loop is confirmed working: client fills out intake form while genuinely signed in → syncs to `intake_forms` → practitioner account sees it in the dashboard. (One test-session gotcha worth remembering for next time: filling out "My Intake Form" from the drawer saves under *whatever account is currently signed in* — it doesn't check role. Testing with two accounts in the same browser tab, without confirming which one is actually active, silently wrote data to the wrong account's row. Two separate browsers avoided the mix-up.)

~~**Deliberately not built, because this is v1-to-react-to, not the real design:**~~ — Thea's first real feedback landed July 21 2026, see below. Email notification when a form is completed is built (`supabase/functions/notify-intake-complete`, wired from `app/intake.js`'s `notifyIntakeComplete()`) and deployed — see #49 below for the full Resend setup, done July 24 2026. One redeploy + test still pending there (sender address changed after the initial deploy) before this is fully confirmed live.

**Thea's first real design feedback, July 21 2026 — the conversation build-order step 7 was waiting on.** She confirmed raw data access (already built) is enough everywhere else, and asked for two additions:
- **Dosha Breakdown visual in the practitioner hub.** Explicitly "doesn't have to be like the venn diagram" (You tab's `DoshaWheel`). Built as a simple proportional bar (`DoshaBar` in `app/practitioner/index.js`), reusing the app's existing `DOSHA_COLORS` from `components/DoshaWheel.js` rather than a new palette — same three-category data, denser list-appropriate treatment. Lives in the Summary tab's "Current snapshot" card.
- **AI-generated guidance alongside each filled-out assessment.** First LLM integration in this app, and the first practitioner-only AI content — never shown to the client, gated so only a practitioner account can trigger it (checked server-side). New `supabase/functions/generate-ai-guidance` Edge Function holds `ANTHROPIC_API_KEY` server-side (same shape as `notify-intake-complete`'s `RESEND_API_KEY` pattern — a client-side key isn't an option for a web+native app), model `claude-opus-4-8`, one non-agentic summarization call. Cached in a new `ai_guidance` table (practitioner-only RLS, no client-read policy — same as `practitioner_notes`), one row per client/assessment/tier, overwritten on "Regenerate" rather than accumulating history. **Content-safety split:** Dosha/Guna/Agni/Tongue already have real computed scores, so the model discusses those numbers directly; Prakriti/Vikriti have no computed dosha score (tagging still ~0%), so the model is explicitly told to summarize themes in the client's raw answers only and never assign a dosha type. Every guidance card is labeled "AI-generated — not a diagnosis, for your reference" in the UI.
- **Deploy step for Matt, not something Claude Code can do remotely:** create the `generate-ai-guidance` function in the Supabase dashboard (Edge Functions → Create, paste `supabase/functions/generate-ai-guidance/index.ts`), then set `ANTHROPIC_API_KEY` under Edge Functions → Secrets.

~~**Show every quiz answer in the Assessments tab, collapsed by default with the score preserved at the top, July 22 2026.**~~ Matt's follow-up ask. The pattern already existed for Prakriti/Vikriti (`ResponseEntry` — collapsed card, tap to expand full Q&A + a copyable export block); generalized it to all 6 assessment types. Dosha/Guna/Agni needed a real schema change — those quizzes only ever persisted the final tally, not per-question choices — so `supabase/migrations/20260722000000_dosha_guna_agni_answers.sql` adds a nullable `answers jsonb` column to `dosha_results`/`guna_results`/`agni_results`, and `app/quiz.js`/`guna-quiz.js`/`agni-quiz.js` now snapshot `{prompt, selectedLabels}` per question (not just a question id — protects against `guna_questions`' admin-editable content drifting under a historical answer) alongside the existing scoring. Tongue Check needed no schema change (its per-question columns already existed); `buildTongueAnswers()` just maps the stored signal values back to the option labels the client actually saw. Historical rows from before this shipped have no per-question detail and show "No per-question detail saved for this attempt" rather than breaking. Migration run, code deployed to web.

**Build order:**
1. ~~Supabase Auth integration + L. Glow auth screens (#29)~~ done, July 2026
2. ~~Design the Postgres schema + RLS policies~~ done, July 2026 — `supabase/migrations/20260711000000_init_schema.sql`, run against the live project
3. ~~Service layer in the app that writes to Supabase alongside AsyncStorage~~ done, July 2026
4. ~~AsyncStorage migration flow for existing local users on first login~~ done, July 14 2026 — see Gap 2 above
5. ~~Read-hydration from Supabase~~ done, July 14 2026 — see Gap 1 above
6. ~~Practitioner dashboard v1~~ done, July 2026 — rough pass, see above, built before rather than after the Thea conversation
7. ~~Thea conversation → real practitioner view design, reacting to v1~~ — first round landed July 21 2026 (Dosha Breakdown + AI guidance, above). Ongoing — more feedback expected as she uses the dashboard for real sessions.
8. ~~Consent flow~~ done, July 14 2026 — "Share with Thea" toggle in You tab. Privacy policy for the intake form's signature screen still needed from Thea before that screen can ship publicly (see #33).
9. End-to-end QA on real devices

---

~~**49. Configure custom SMTP for Supabase Auth emails — pre-launch blocker.**~~
Found live, July 13 2026: Supabase's default built-in mailer (no custom SMTP configured) has a very low rate limit shared across the whole project, not per-recipient — a handful of test signups and password resets in one session was enough to trigger "too many attempts, try again in a few minutes." This will hit real users during launch signups, not just testing. Authentication → Rate Limits in the dashboard can raise the number, but the built-in mailer stays capped low regardless — the actual fix is wiring up a real SMTP provider under Authentication → Settings → SMTP Settings. Needs to happen before the August 17th launch, not after the first real user hits it.

**Provider decided, July 17 2026: Resend.** Picked over Postmark/SendGrid — Supabase's own docs use it as the default SMTP example, free tier (3,000/mo, 100/day, $0) comfortably covers this app's real scale, no permanent-free-tier competitor matches it. Explicitly ruled out reusing Thea's Squarespace-hosted mailbox: even if it exposes SMTP credentials, personal/business mailboxes aren't built for automated app-volume sending and risk her real email's spam reputation, not just re-hitting the same rate-limit problem this item exists to fix.

**One Resend account/domain now covers two features, July 22 2026.** `notify-intake-complete` (the intake-completion email to Thea, see #30 above) also needs Resend — and a Resend API key works as *both* the SMTP password for Auth emails *and* the bearer token for `notify-intake-complete`'s direct HTTP call. Same account, same verified domain, same key — one setup unblocks both. Do the domain verification once, then generate one API key and use it in both places below.

**Done, July 24 2026.** Matt got Squarespace admin access directly (not routed through Thea's Google login) and completed the full setup in one session:
1. ~~Create a Resend account, add `lglowliving.com` as a sending domain~~ — done July 23.
2. ~~Add Resend's DNS records in Squarespace~~ — done July 24. **Correction to the original plan:** no SPF merge was actually needed — Resend's current flow puts all 3 records under a dedicated `send.` subdomain (`resend._domainkey`, MX `send`, TXT `send`), not the root domain, so they're purely additive. Found and worked around a real domain-mixup risk along the way: Thea's Squarespace account has *two* domains (`lavenderglowliving.com` and `lglowliving.com`) — confirmed `lglowliving.com` is the correct one before touching anything. Also found existing root-domain (`@`) MX/SPF/DKIM/DMARC records from Squarespace's own Email Forwarding feature (which runs on Mailgun under the hood) — confirmed no conflict since they're on a different hostname (`@` vs `send`/`resend._domainkey`) and left untouched.
3. ~~Wait for Resend to verify the domain~~ — verified within about 2 hours same day.
4. ~~Generate one API key in Resend~~ — done.
5. ~~**Auth SMTP**~~ — configured: host `smtp.resend.com`, port `465`, username `resend`, **sender `thea@lglowliving.com`** (deliberately personal, not noreply — decided explicitly; replies land in her real inbox, accepted tradeoff).
6. ~~**Intake notification**~~ — `notify-intake-complete` deployed in Supabase Edge Functions, `RESEND_API_KEY` secret set. Sender changed from the code's original `notifications@lglowliving.com` to **`hello@lglowliving.com`** (Matt's call, July 24 — distinct from both the personal `thea@` confirm-account sender and the original generic placeholder), committed in `supabase/functions/notify-intake-complete/index.ts`. ⚠️ **Still needs one manual step:** the live Supabase Edge Function was deployed with the old `notifications@` sender before this code change — needs re-pasting/redeploying with the updated file before the sender is actually correct in production.
7. Testing: ~~a real signup confirms Auth SMTP~~ — **confirmed working end to end, July 24.** Completing an intake form on a test account (confirms the notification reaches Thea's inbox from the new `hello@` address) — still needs to happen after the redeploy in step 6.

---

~~**31. API endpoint spec — lglow routes on the existing panda-mobile API.**~~

⚠️ **SUPERSEDED, July 2026 — literal endpoint spec no longer applies, but the data model below is still useful.** This was written for the ColdFusion/MSSQL plan, which was dropped entirely in favor of Supabase (see #29/#30). Supabase auto-generates a REST API from the Postgres schema (PostgREST) and enforces isolation via Row Level Security — there's no hand-written route layer to build the way this section assumes, and no Firebase JWT to verify. **Don't build against this spec literally.** What's still worth reading it for: the table names, fields, and per-resource operations implied by each route below are a solid first draft of the Postgres schema #30 needs — treat this as data-model reference material, not a build spec.

*(Original spec preserved below, unedited, for that reference value.)*

All routes are prefixed `/lglow/`. Every route requires a valid Firebase JWT in the `Authorization: Bearer <token>` header. The middleware verifies the token, extracts `firebase_uid`, and resolves or creates the corresponding `lglow.Users` row before the handler runs. The resolved `user_id` (integer) is attached to the request context — handlers never deal with Firebase UIDs directly after the middleware layer.

Base URL: same host as the panda-mobile API.
Auth header: `Authorization: Bearer <firebase_id_token>`
Content-Type: `application/json`
All timestamps: ISO 8601 UTC.
All error responses: `{ "error": "<message>" }` with appropriate HTTP status.

---

*Users*

`POST /lglow/users/me`
Upsert the authenticated user's profile. Called on first app launch after login and on display name / theme changes.
```
Request:  { displayName?: string, themePreference?: string }
Response: { userId: int, firebaseUid: string, email: string,
            displayName: string, role: string,
            themePreference: string, createdAt: string }
```

`GET /lglow/users/me`
Fetch the authenticated user's profile.
```
Response: { userId: int, firebaseUid: string, email: string,
            displayName: string, role: string,
            themePreference: string, createdAt: string }
```

---

*Dosha Results*

`POST /lglow/dosha`
Save a quiz result. Marks all previous results `is_current = 0` before inserting the new one.
```
Request:  { vataScore: int, pittaScore: int, kaphaScore: int }
Response: { resultId: int, primaryDosha: string,
            vataScore: int, pittaScore: int, kaphaScore: int,
            takenAt: string }
```

`GET /lglow/dosha/current`
Fetch the user's current (most recent) dosha result.
```
Response: { resultId: int, primaryDosha: string,
            vataScore: int, pittaScore: int, kaphaScore: int,
            takenAt: string }
         | 404 if no quiz taken
```

`GET /lglow/dosha/history`
All quiz results for the user, newest first. Lets Thea see if someone's self-reported constitution has shifted.
```
Response: [{ resultId, primaryDosha, vataScore, pittaScore,
             kaphaScore, isCurrent, takenAt }]
```

---

*Check-ins*

`POST /lglow/checkins`
Save a check-in. Upserts on (user_id, checkin_date, checkin_type) — re-submitting the same day/type overwrites.
```
Request:  { checkinDate: string (YYYY-MM-DD), checkinType?: 'morning'|'evening',
            physicalScore: int, mentalScore: int, emotionalScore: int,
            hungerScore: int, tongueScore: int, note?: string }
Response: { checkinId: int, checkinDate: string, checkinType: string,
            physicalScore: int, mentalScore: int, emotionalScore: int,
            hungerScore: int, tongueScore: int, note: string,
            createdAt: string }
```

`GET /lglow/checkins?days=30`
Recent check-ins, newest first. `days` defaults to 7, max 90.
```
Response: [{ checkinId, checkinDate, checkinType, physicalScore,
             mentalScore, emotionalScore, hungerScore, tongueScore,
             note, createdAt }]
```

`GET /lglow/checkins/:date`
Single check-in by date (returns both morning and evening if both exist).
```
Response: [{ checkinId, checkinDate, checkinType, ... }]
         | 404 if no check-in on that date
```

---

*Journal Entries*

`PUT /lglow/journal/:date`
Upsert a journal entry for a given date. Partial saves are valid — any null field leaves the existing value unchanged.
```
Request:  { gratefulText?: string, showedText?: string, tomorrowText?: string }
Response: { entryId: int, entryDate: string, gratefulText: string,
            showedText: string, tomorrowText: string,
            createdAt: string, updatedAt: string }
```

`GET /lglow/journal/:date`
Fetch entry for a specific date.
```
Response: { entryId, entryDate, gratefulText, showedText,
            tomorrowText, createdAt, updatedAt }
         | 404 if no entry
```

`GET /lglow/journal?limit=20&offset=0`
Paginated list of all entries, newest first. Returns date + first 100 chars of each field for the list view.
```
Response: { total: int, entries: [{ entryId, entryDate,
            gratefulExcerpt, showedExcerpt, tomorrowExcerpt }] }
```

---

*Intentions*

`PUT /lglow/intentions/:date`
Upsert today's intention. One per day.
```
Request:  { intentionText: string }
Response: { intentionId: int, intentionDate: string,
            intentionText: string, createdAt: string }
```

`GET /lglow/intentions/:date`
Fetch intention for a date.
```
Response: { intentionId, intentionDate, intentionText, createdAt }
         | 404 if none
```

---

*Practice Completions*

`POST /lglow/practices`
Mark a practice complete for a given date. Upserts — idempotent.
```
Request:  { practiceDate: string, practiceKey: string }
Response: { completionId: int, practiceDate: string,
            practiceKey: string, completedAt: string }
```

`DELETE /lglow/practices`
Unmark a practice (user unchecks it on Journey screen).
```
Request:  { practiceDate: string, practiceKey: string }
Response: 204 No Content
```

`GET /lglow/practices/:date`
All practice completions for a given date.
```
Response: [{ completionId, practiceDate, practiceKey, completedAt }]
```

---

*Practitioner routes (role: practitioner required — middleware enforces)*

`GET /lglow/practitioner/clients`
All active consenting clients for the authenticated practitioner.
```
Response: [{ userId, displayName, email, primaryDosha,
             lastCheckin, checkinCount30Days }]
```

`GET /lglow/practitioner/clients/:clientUserId/summary`
Full pre-session briefing for one client.
```
Response: {
  profile:   { userId, displayName, email, createdAt },
  dosha:     { primaryDosha, vataScore, pittaScore, kaphaScore, takenAt },
  checkins:  { last30Days: int, avgPhysical, avgMental, avgEmotional,
               avgHunger, avgTongue, lastCheckinDate,
               recent: [{ checkinDate, checkinType, physicalScore,
                          mentalScore, emotionalScore, note }] },
  intentions: [{ intentionDate, intentionText }],  -- last 7
  journal:    [{ entryDate, gratefulExcerpt }]     -- last 5, if consented
}
```

`POST /lglow/practitioner/clients/:clientUserId/consent`
Record that a client has consented to share data with this practitioner.
```
Request:  {}  (consent is implied by the action, not a body field)
Response: { relationshipId: int, consentedAt: string }
```

`DELETE /lglow/practitioner/clients/:clientUserId/consent`
Revoke consent. Sets `revoked_at`, never deletes the row.
```
Response: 204 No Content
```

---

*Sync (for AsyncStorage migration)*

`POST /lglow/sync`
Bulk-upload local AsyncStorage data when a user logs in for the first time. The API processes each item and skips any that conflict with existing rows (local data wins on same-day conflicts).
```
Request:  {
  doshaResult?:   { vataScore, pittaScore, kaphaScore },
  checkins?:      [{ checkinDate, checkinType, physicalScore,
                     mentalScore, emotionalScore, hungerScore,
                     tongueScore, note }],
  journalEntries?: [{ entryDate, gratefulText, showedText, tomorrowText }],
  intentions?:    [{ intentionDate, intentionText }],
  practices?:     [{ practiceDate, practiceKey }]
}
Response: { synced: { dosha: bool, checkins: int, journal: int,
                      intentions: int, practices: int },
            skipped: int,
            errors: [] }
```

---

## Admin content editor — Practitioner Hub

**50. In-app content editing for Thea — Supabase-backed, seven content types live.**
Source: Matt, July 16–17 2026. `/practitioner` restructured from a single dashboard into a hub: `app/practitioner/_layout.js` gates every sub-route on one role check (was previously re-checked per screen) and adds a nav bar with **Clients** (the existing dashboard, #30) plus admin editor tabs. Lets Thea update her own copy directly from the app instead of needing a code change + redeploy for every wording tweak.

**Content types wired so far, in build order:**
1. Mythbusters (`app/practitioner/mythbusters.js`)
2. Affirmations (`app/practitioner/affirmations.js`)
3. Check-in question wording (`app/practitioner/checkin-questions.js`) — dimension labels/descriptions/hints, not the question *set* itself (that's still #19, gated on a real conversation with Thea)
4. Guna Quiz questions (`app/practitioner/guna-questions.js`)
5. **Intentions** (`app/practitioner/intentions.js`, July 17) — the "Just for today" suggestions on the home screen. Directly unblocks the empty `vata`/`pitta`/`kapha` arrays #8 had been waiting on — Thea can fill those in herself now instead of it sitting on someone else's task list.
6. **Daily Rhythms / routine items** (`app/practitioner/routines.js`, July 17) — feeds the recommendations screen's Daily Rhythms section (#9). Unified the old `routineAnchors` (fixed, universal) and `routines` (empty per-dosha) exports into one `routine_items` table, `dosha='universal'` standing in for the old anchors list — same editor, same CRUD, no more artificial split between "fixed" and "Thea's to fill in."
7. **Playlists** (`app/practitioner/playlists.js`, July 17) — per-dosha Spotify name/URL/mood for the home screen's "Today's sound" card (#10). Fixed 3-row set (dosha is the primary key), edit-only like check-in questions — no add/delete. `SPOTIFY_PROFILE_URL` (the About Thea profile link) deliberately stayed a static export, not a table — it's an infra constant Matt set once, not editable copy.

**Architecture — `data/content/remote.js`:** each content type gets a Supabase table + migration (`supabase/migrations/202607160*` through `202607170*_..._admin_content.sql`), a `load*()` (cache-or-static: reads AsyncStorage cache, falls back to the bundled static file in `data/content/` if nothing's cached yet) and a `refresh*()` (fire-and-forget fetch from Supabase, writes the AsyncStorage cache). The static JS files stay in the repo permanently as the offline/first-launch fallback — Supabase is a live override once reachable, not the sole source of truth. Documented inline in `remote.js` as the pattern to follow for the next content type.

Intentions and routine items are the first two types whose static shape is a dosha-keyed object (`{universal, vata, pitta, kapha}`) rather than a flat array like the first four — `remote.js` reshapes the Supabase rows to match that same object shape (`rowsToIntentions`/`rowsToRoutines`) so `intentionSuggestions()`/`playlistForDosha()` keep working unchanged against either source; both helper functions took an optional `data` param (defaulting to the static export) rather than reading a module-level array directly, mirroring the existing `currentMythbuster(list = mythbusters)` pattern. Consumers (`app/index.js`'s `MusicCard`/`ReturningUser`, `app/recommendations.js`'s Daily Rhythms section) now load asynchronously the same way `MythbusterCard` already did — state starts `null`/falls back to static, populates on load, refreshes from network in the background.

**What this changes about the content model described elsewhere in this doc:** these seven types are no longer purely "static file, needs a code deploy to change" the way the rest of `data/content/` still is (herbs, recipes, movement, learn, quiz, recommendations, etc. — those are untouched by this). Worth remembering when scoping future content work: check whether a new content type is a good fit for this pattern (frequently-edited, low-risk copy) before defaulting to a static file. Good next candidates: `agniQuiz.js` questions and `tongueCheck.js` (same shape as what's already done). Deliberately not moved yet: `quiz.js` (dosha-weight values drive the constitution score — needs a schema that separates editable copy from scoring values first) and `herbs.js`/`recommendations.js`'s food lists (both slated for replacement by the unbuilt #36 database — migrating the current draft now means migrating it twice).

**Not yet built:** an editor UI affordance for adding a *new* content type without hand-writing a migration + `remote.js` entry each time; any conflict handling if Thea edits from two devices at once (last-write-wins via Supabase, no warning). Neither is blocking — flag if either becomes a real pain point.

**Layout fix, July 17 2026 — was opening in the mobile-app frame on desktop.** Thea reported the hub looked squeezed/mobile even on her PC. Root cause: `/practitioner` was being rendered inside the same consumer-app shell as every other route in `app/_layout.js`, which by default constrains web to a 480px-max-width mobile-style frame (the "Web View" toggle exists to escape that, but nobody had reason to know to click it here) — and the consumer bottom-tab pill (`components/BottomNav.js`, Lifestyle/Movement/Check In/Herbs/Nourishment) was rendering underneath it too, since `/practitioner` was never added to its hidden-routes list. Fixed:
- `app/_layout.js` now detects `pathname.startsWith('/practitioner')` and renders the Stack full-bleed — no 480px cap, no consumer `WebLayout` sidebar (that sidebar's nav links are all consumer routes anyway, irrelevant to Thea) — regardless of the Web View toggle state. Native is unaffected (it already filled the screen).
- `components/BottomNav.js`'s hidden-routes check now also matches `/practitioner*`, so the consumer tab pill no longer floats over the admin hub.
- `app/practitioner/_layout.js`'s own top nav bar (8 tabs and counting) was a plain row with no wrap or scroll — would've overflowed a phone-width screen once the frame stopped forcing everything into 480px anyway. Wrapped it in a horizontal `ScrollView` so it scrolls instead of clipping as more content types get added.

Verified via a static export served locally + Playwright at 1400px and 390px viewports: desktop now fills the full window width edge-to-edge, phone fits its natural width, bottom nav pill absent at both sizes.

~~**These three new migrations still need to be run against the live Supabase project**~~ — run July 17 2026. One naming collision found and fixed along the way: `20260717010000` originally named its table `intentions`, which already existed as a completely different table (each user's own saved daily intention, from the original schema) — renamed to `intention_suggestions` before running. `routine_items` and `playlists` had no such collision. All seven admin content tables are now live.

---

## Client intake form

~~**33. Clinical intake form — full pre-session questionnaire.**~~
*Sections 1–14 built and live. Backend sync (b) is now done — see #30, `intake_forms` table, dual-write in `saveIntake()`. One item remains blocked: (a) the signature/consent screen still needs a privacy policy to exist first before it can be more than a single "I agree" checkbox.*

**Fixes made during a July 2026 read-through of the actual file (not new content, implementation bugs against the already-agreed spec):**
- **The literal string "DRAFT — Thea to review and rewrite before launch." was being shown to users** inside the consent screen's info text — it had been written into the displayed `text` field itself instead of as a code comment. Fixed; the DRAFT flag is now a comment above the field, same convention as everywhere else in the codebase.
- **Multi-select Prakriti questions (physical function + psychological function, 15 fields total) had no "skip / I don't know" escape** — only the single-select physical-structure questions did. This wasn't just a missing affordance: since `sectionProgress()` counts empty arrays as unanswered, a user who wanted to skip one of these 15 questions could never get that section to 100%. Added the same skip pattern the single-select fields already use.
- Renamed `CtaDisabledBlock` → `CoachingCtaBlock` (and `cta_disabled` → `coaching_cta`) — it stopped being disabled when #34 shipped the real booking link, the name never got updated.

**More fixes found during live testing, July 2026 (not a read-through this time — found by actually filling out the form):**
- **No way to finish a section.** Every field auto-saves on change, but the only way out of a `SectionForm` was the small back arrow in the header — easy to miss after scrolling through a long section (Basic Information has 14 fields). Added an explicit "Back to sections" button at the bottom of each section.
- **"Scope & Consent" could never mark complete.** `sectionProgress()` explicitly excluded `type: 'check'` fields from its count — since that section's only keyed field is the consent checkbox, it always had zero countable fields and showed as permanently incomplete no matter what the user toggled. Also fixed a second bug hiding underneath: the "filled" test would have treated an *unchecked* box as filled too (`false !== '' /null/undefined` is true), had it ever been reached. Both fixed in the same pass.

⚠️ **Found, not fixed — needs your call, not a guess on my part:** Section 12 (Reproductive Health) was always meant to be conditionally shown based on the gender identity field from Section 1 (see build-order step 7 below) — that logic was never built, so every user currently sees this section regardless of what they entered. Gender identity is a free-text field, and pattern-matching it to decide who sees a whole section felt like exactly the kind of judgment call that can misfire in a way that lands badly (misgendering, or guessing wrong in either direction) — didn't want to build that without checking how you want the matching to work first.

**Entry point:** Hamburger menu → "My Intake Form" (or similar label — confirm wording with Thea). Routes to `app/intake.js`.

**Sections (in order from the voice memo):**
1. **Basic info** — name, address, city/state/zip, phone, email, date of birth, location, gender identity, emergency contact (name, relationship, phone), referral source
2. **Scope of practice disclosure + consent** — Thea's welcome text, scope limitations (not a medical doctor, not a substitute for clinical care), confidentiality statement, client signature + date, coach signature + date
3. **Presenting concerns** — what brought them here (free-form), duration, biggest current health challenges, duration of those challenges
4. **History** — current healthcare providers (details + improvements noticed), past mental conditions / traumas / addictions / stress, family history of diagnosed diseases, childhood health description
5. **Daily routine** — morning / afternoon / evening typical routine; ideal routine vs. actual
6. **Sleep** — wake time + consistency, how they feel on waking (options), sleep quality (waking frequently, nightmares, ease of falling asleep, soundness), daytime napping, bedtime + consistency, evening routine 2–4 hours before bed, ideal sleep state
7. **Work and life** — current work + enjoyment, weekly schedule by day (Mon–Sun), hobbies (current + wished-for + frequency), passions, spiritual practice, relationship with the divine/God/nature, cultural/ritual practices
8. **Diet** — food frequency table (carbs, vegetables, meats, fruits, dairy, alcohol, coffee, tea, soda, sugar, tobacco, recreational drugs — options: never / few times/week / once/week / multiple times / daily / other), water quantity + temperature, cooking habits, disordered eating history, typical meals (breakfast/lunch/dinner — recent actual + is it typical + ideal), eating environment + distractions + pace, current herbs or medications
9. **Appetite and elimination** — cravings by taste, snacking (frequency + what), morning hunger, pre-meal hunger (0–10 scale), post-meal symptoms (bloating, belching, acid reflux, nausea, sleepiness, gas, abdominal pain, sluggishness, fatigue, heartburn, heaviness, indigestion — check all that apply + frequency/intensity), elimination pattern (frequency + timing options), stool characteristics (consistency, sinking/floating, color, odor, straining, burning, mucus, completeness)
10. **Movement** — travel frequency + description, commute frequency + duration, exercise type + frequency + duration + intensity (light/moderate/vigorous)
11. **Relationships** *(18+ gate before this section)* — relationship status + quality, past intimate relationship description, age of first sexual activity, past and present sensual health, current sexual activity, satisfaction + what they'd change
12. **Reproductive health — women only** *(18+ gate, shown conditionally based on gender identity)* — menstrual status (pre/peri/post-menopausal), cycle regularity, last cycle date, duration, flow (light/moderate/heavy), color, cramping/pain, peri/PMS symptoms (mood, acne, bloating, fatigue, etc.), menstrual products used; menopause symptoms if applicable; bioidentical hormones; contraception (current method, hormonal history, IUD, side effects); pregnancy history (number, miscarriages, abortions, fertility challenges, complications)
13. **Mind and emotional health** — breathing/reflection prompt before questions; family mental illness history; symptom inventory (anxious, overwhelmed, self-destructive, resentment, anger, depressed, intense, melancholy, stubborn, lonely, irritated, fear/panic, high stress, lethargy, worry — with intensity + frequency + tied events); current stress management; substance addiction history (substance + duration)
14. **Prakriti constitution assessment** *(source: transcript 14)* — three sub-sections assessing original constitution. Ideally completed with Thea in a 1:1 session; surface the coaching session CTA (see #34) at the top of this section.
    - **Physical structure** — body frame, bone structure, body weight, complexion/skin, hair, teeth, eyes, nose, lips, chin, neck, fingers/palms, face shape. Single-select per trait (Vata / Pitta / Kapha). Add the wrist circumference test (overlap / touch / gap). Add face shape reference images and optional photo upload.
    - **Physical function** — appetite, sweat/body odor, sleep, digestion/elimination, body temperature, menstruation. Multi-select ("check all that apply").
    - **Psychological function** — mind state, stress response, speech, memory, nature, moods, negative emotions, focus, decision-making. Multi-select required — fear, anger, and attachment can all be present simultaneously.
    - Every question in all three sub-sections needs a "skip / I don't know" escape.
    - Intro copy (Thea's language): *"Discovering your original constitution is not about judging or labeling. There is no right or wrong answer. It is giving us an idea of what balance and harmony look like in your unique body, mind, and spirit."* — flag for Thea's final wording review.

Full section details and question tables: `docs/notes-transcript-14.md`

**18+ gate:** Not enforced at signup. A single acknowledgment screen appears before sections 11 and 12: "The next section includes questions about relationships and sexual health. These are optional — tap Pass on any question that doesn't feel right. Continue only if you are 18 or older." A "I'm under 18 / skip this section" option skips both sections entirely.

**Data handling:**
- Stored locally in AsyncStorage under `@lglow/intake` as a single JSON object (partial saves valid — resume where left off)
- ~~Must sync to backend~~ — done, July 2026. Dual-writes to the `intake_forms` table (`user_id`, `data` jsonb, upsert on `user_id`) alongside AsyncStorage. Note: this is still just the write path — Thea can't actually *read* it yet, that's Phase 2's practitioner view (#30), still gated on a conversation with her about what she wants to see.
- The signature/consent block requires a privacy policy to be in place before this screen ships publicly. Thea to provide; do not launch this feature without legal sign-off on the confidentiality statement.

**Build order:**
1. ~~Data structure + `data/user/storage.js` intake key~~ done
2. ~~Route `app/intake.js` — multi-step form with section navigation, save-on-exit, resume state~~ done
3. ~~Add "My Intake Form" to `components/HamburgerDrawer.js`~~ done
4. ~~Scope-of-practice disclosure screen~~ done — content still flagged for Thea's final wording review, but no longer literally says "DRAFT" on-screen (fixed July 2026, see note above)
5. ~~All 14 sections as distinct step screens~~ done
6. ~~18+ gate screen before sections 11–12~~ done
7. ~~Reproductive health conditional display logic~~ — built July 26 2026, but **not** the originally-sketched approach (gender identity field driving visibility). Matt's call after discussion: gender identity and "does this content apply to this person" are different questions — deriving one from the other either misgenders people or excludes people who still need the content (a trans man can still menstruate; a cis woman post-hysterectomy might not). Built as its own explicit, asked-once opt-in question instead — see the new item below.
8. ~~Section 14 Prakriti assessment~~ done — single-select for physical structure, multi-select for physical function and psychological function (both now have skip escapes, fixed July 2026), wrist test. Face reference images + optional photo upload still not built — not urgent, low priority.
9. Signature/consent screen — still requires privacy policy to exist first
10. ~~Backend sync~~ done, July 2026

**Content dependency:** Section copy (question labels, options, explanatory text) must match Thea's voice — do not invent clinical language. The structure above maps directly from her voice memos. Run final wording past her before shipping.

---

~~**34. "Book a session with Thea" CTA — coaching session upsell.**~~
Live. Scheduling platform is **cal.com** — booking URL `cal.com/lglowliving` set up July 2026, stored in `data/booking.js` as `BOOKING_URL`. Wired into two surfaces: the Prakriti section CTA in `app/intake.js` (`CtaDisabledBlock` now a pressable calling `Linking.openURL(BOOKING_URL)`) and the "Book a Session" button on `app/about.js`. Both were previously disabled placeholders.
Source: transcript 14. Thea explicitly wants to offer 1:1 coaching sessions as a paid upsell through the app, and specifically names the Prakriti constitution assessment (intake form section 14) as the primary trigger.

> "Ideally, we go through this in the first coaching session, so I definitely in the app want to offer that as an extra side service. And if not, that's okay too."

Tone kept non-pressuring per Thea's framing: "want to go through this with Thea directly? Book a session." Not a gate, not a nag.

**Still open:** pricing and packaging for the session isn't part of the app — that's managed entirely on the cal.com side. Consider whether the CTA should also appear on the recommendations screen or new-user home screen.

---

**42. Explore: collect payment (partial or full) at time of booking via cal.com.**
Source: Matt, July 2026. Right now the booking CTA (#34) just link-outs to `cal.com/lglowliving` — no payment happens in that flow. Explore whether cal.com can collect a deposit or full payment at the moment someone books a session, rather than Thea invoicing/collecting Venmo (`@lglowliving`) separately afterward.

**What needs research before any build decision:**
- cal.com's native payment integration is built around Stripe (via its Apps marketplace) — confirm current support, since Venmo is not a standard cal.com payment processor. Likely outcome: either (a) run payment through Stripe on cal.com's side and treat Venmo as the informal/manual fallback, or (b) keep Venmo as manual collection after booking and skip in-cal.com payment entirely.
- Confirm whether cal.com supports partial payment / deposit collection specifically, or only full payment at booking.
- If Stripe is required, that's a new account/integration decision for Thea (separate from Squarespace Payments — see infrastructure note above) — flag before assuming it's the path.
- No app code changes are implied by this — the payment collection step happens on cal.com's hosted booking page, not inside the L. Glow app. The app's booking CTA (#34) would be unaffected unless Thea wants different messaging (e.g. "book and pay" vs. "book").

**Build order:** Research cal.com's payment app options and pricing with Thea/Matt → decide Stripe-via-cal.com vs. Venmo-manual → only then revisit CTA copy if messaging needs to change.

---

## Thea's TestFlight feedback — Round 1

Full organized notes in `docs/feedback-thea-testflight-1.md`. Summary of what needs to become roadmap items:

**Hard bugs (fix before next build):**
- ~~iOS back button not tappable on all secondary screens~~ — fixed. `Pressable` in `headerTitle` was intercepting native UIKit touches. `LogoMark` made static; `headerBackTitleVisible: false` added to remove "index" label.
- ~~Home screen unreachable after quiz flow — bottom nav disappears, logo not tappable~~ — fixed. BottomNav rendered outside Stack in `_layout.js` (can't disappear); logo Pressable removed this session.
- ~~Reminders screen navigation trap — force-close required to exit~~ — fixed. Reminders row has `soon: true`; no screen to navigate to.
- ~~Keyboard covers "write your own" intention input~~ — fixed. `KeyboardAvoidingView` + `keyboardShouldPersistTaps` in `4fde8cc`.
- ~~Past journal entries not tappable / no full-entry view~~ — fixed. Tappable cards with slide-up Modal in `4fde8cc`.
- ~~Practices / rituals taps on You tab do nothing~~ — resolved. Section removed; replaced with settings/stats layout.

**Quiz / check-in (needs Thea's input before changing):**
- Q3 "How is your digestion?" → reframe toward hunger/agni language
- Q4 sleep options incomplete — needs "Other" + a review pass with Thea
- ~~100% single-dosha quiz results are wrong~~ — baseline raised from +1 to +3; max single-dosha result is now ~65%, June 2026
- Broader quiz accuracy issue — 10 questions may not reliably capture prakriti (ties to roadmap item 18)

**Copy / UX (lower urgency, needs Thea's sign-off on wording):**
- ~~"Welcome back, Vata" → "Welcome back, [name]"~~ — fixed July 2026. `app/index.js`'s `ReturningUser` now reads "Welcome back, {userName}" when a name is on file (dosha still shown as a secondary line below, not standing in for the name). `userName` was already loaded in the parent `Home` component for the top-of-page greeting — just wasn't threaded down to this section.
- ~~Lifestyle notes presentation too dense — break into bullets~~ — turned out to already be resolved elsewhere in the app (not tracked as done at the time): `app/recommendations.js`'s "Lifestyle Note" section already splits `rec.lifestyle` into bullets, and both `app/guna-result.js` and `app/agni-result.js` render their lifestyle practices as bulleted lists via `PracticeSection`. No dense-paragraph presentation left anywhere. Struck through July 2026.
- ~~"Just for Today" needs "choose one" instruction~~ — also already resolved, not previously marked: `app/index.js` line ~297 shows "Choose one, or write your own." under the intention prompt. Struck through July 2026.
- ~~Learn section overuses Thea's name — should center the practice, not her~~ — subtitle and placeholder strings rewritten; attribution footer kept.
- ~~About Thea bio — waiting on her rewrite~~ — Thea's bio loaded, June 2026
- ~~Credentials stacking under her name — fix ordering~~ — reordered to Ayurvedic Medicine · RYT · Certified Wellness Coach.
- Practices / rituals numbers on You tab need explanation or rethink
- ~~Saved favorites not discoverable — either wire it up or hide the section~~ — removed from Settings list; no defined feature yet.

**Images (blocked on Thea):**
- ~~About Thea photo — she's getting a new one~~ Done Aug 7 2026 — real headshot (`assets/thea.jpg`) live on both `/about` and `/welcome`, cropped/sized after a couple of follow-up passes.
- Kapha insights card image looks off — she has a screenshot

**Her content ask:** Interested in video for doshas, breathwork, recipes. Referenced "2B Magnetic" (TBM) app as style inspiration. Conversation needed before she starts recording.

**What she liked:** Herb warm/cooling/heating tags, Monday Mythbusters, dosha wheel, journal section, 10-question quiz length.

---

---

## Agni Assessment — new feature (Thea's explicit request)

**37. Agni Assessment — personalized digestive fire evaluation.**
Source: transcript 21 (062126_02), June 2026. Thea explicitly named this as a feature she wants in the app: *"Agni should become one of the core pillars of the app because it gives people a simple answer to the question of why do I feel this way? This really meets people exactly where they're at without immediately pushing them into doshas and Sanskrit."*

Proposed shape:
- A short self-assessment (7–10 questions) identifying which of the four Agni types the user is currently expressing: Sama (balanced), Vishama (irregular/Vata), Tikshna (intense/Pitta), or Manda (slow/Kapha)
- Questions drawn from the signs Thea named: bloating, brain fog, energy consistency, appetite regularity, heaviness after meals, elimination, emotional processing
- A personalized result screen: which Agni type, what it means, what supports it, and what to avoid
- Agni result feeds into food, herb, lifestyle, and movement recommendations — this is the entry point Thea envisions for users who aren't ready for the dosha quiz yet

**Content dependency:** Question set and result copy must come from Thea. The four Agni types and their descriptions are already in `data/content/learn.js` — result copy can build from that.

**Build order:**
1. Confirm question set with Thea ← **next step**
2. ~~Data structure: `@lglow/agni_result` in AsyncStorage — `agni_type`, `taken_at`~~ — done, `saveAgniResult`/`loadAgniResult` in `data/user/storage.js`, June 2026
3. ~~Build quiz screen (can reuse guna-quiz.js pattern)~~ — done, `app/agni-quiz.js`, June 2026
4. ~~Build result screen~~ — done, `app/agni-result.js`, June 2026. ~~Result copy DRAFT from transcript 21 — Thea to review before launch.~~ Reviewed and approved, Aug 17 2026 — the one exception is each type's `lGlowNote` closing line, which is unwritten (not unreviewed), see #71. Questions are still structural scaffolding — Thea must rewrite all before launch, unaffected by the result-copy approval above.
5. ~~Wire Agni result into recommendations as a secondary signal alongside dosha~~ — done July 23 2026. `app/recommendations.js`: new "Your Agni" section rendered right after "Your Constitution" when the user has taken the Agni quiz (reuses the existing `agniResults` content — name, subtitle, first 3 diet practices — nothing new invented), with a link through to the full `/agni-result` screen. If they haven't taken it, a soft one-line invite to `/agni-quiz` instead — no pressure, no blocking. Verified both states via Playwright.

---

## Vata / Pitta / Kapha Food Recommendations — data shape scaffolded, content blocked on Thea

**38. Dosha food lists — shape scaffolded July 23 2026, content still blocked on Thea confirming garbled transcription.**
Source: transcripts 23–25 (062126_04, 05, 06), June 2026. Thea recorded detailed food recommendations for all three doshas with Best / Good / Not Beneficial / Avoid breakdowns across eight categories — confirmed identical structure across all three transcripts by reading them directly (not just the excerpt notes file): grains & legumes, vegetables, fruits, nuts & seeds, oils, spices, dairy, sweeteners.

**Still genuinely blocked on content** — this isn't a couple of typos. `docs/notes-transcript-23-25.md` logs roughly 30 ingredient names the Whisper transcription rendered ambiguously across the three recordings (e.g. "monkeys" for what's presumably mung beans, "grass" in a Pitta oils list that could be flaxseed or something else, an entire block where Pitta's nuts and oils categories appear to have merged mid-recording). Per CLAUDE.md's content-authorship rules, none of this gets guessed at and shipped as Thea's approved content — awaiting her direct confirmation on that notes file.

**What's built (data shape only, zero content):** `data/content/doshaFoodLists.js` — `doshaFoodLists.{vata,pitta,kapha}.{grainsAndLegumes,vegetables,fruits,nutsAndSeeds,oils,spices,dairy,sweeteners}.{best,good,notBeneficial,avoid}`, every tier an empty array. Once Thea confirms the transcript notes, this is a fill-in-the-arrays pass, not a schema decision.

This content feeds into:
- Item 36 (Herb + Food Database, shipped July 23 2026) — the dosha-specific medicine/poison breakdowns per food
- The recommendations screen — food section per dosha
- The food guide content (item 11c) — the practical examples section

---

## Herb + Food Database — major new feature

~~**36. L. Glôw Herb + Food Impact Database — content complete, build needed.**~~
Source: `docs/LGlow_Herb_Food_Impact_Database_v2_filled.docx`. Thea's complete A–Z herb and food database, 256 entries from Agrimony to Yerba Santa. Supersedes the old draft `data/content/herbs.js` for the main Herbs screen (see `docs/content-review-thea.md` §3.1).

**Placement decided July 23 2026 (Matt):** expanded Herbs section under Tools (not a new top-level screen), one unified searchable database for herbs and foods together (not split) — the source data itself doesn't cleanly split: 216/256 entries are plain "herb," the rest are hybrids ("herb"+"food", "herb"+"spice", etc).

**Built July 23 2026:**
1. `data/content/herbFoodDatabase.js` — new. All 256 entries parsed directly from the source .docx's actual Word **table cell structure** (not a flattened-paragraph text guess, which would have silently misaligned columns on rows with blank cells — verified this the hard way before committing to an approach). Schema: `name, types[], latinName, taste[], energy, vipaka, doshaRaw, doshaImpact, actions[], medicineWhen[], poisonWhen[], lglowTranslation, needsGuidance`.
   - `doshaImpact` ({vata,pitta,kapha}, each -1/0/1) computed mechanically from `doshaRaw` shorthand (e.g. "PK- V+") only when unambiguous — 252/256 parsed cleanly; the 4 remaining (alternates like "VPK= / VPK-", or an inline exception like "VPK= (P-)") keep `doshaRaw` as display text with no computed bar rather than guessing.
   - `needsGuidance` mechanically detected from Poison When containing Thea's own phrase "professional guidance" (30 entries) — not an invented flag.
2. `app/herbs.js` — fully rewritten: symptom/name search (256 → e.g. 45 for "bloating"), type filter chips (all 13 real type tags from the data, not a hidden subset), list cards with dosha badges + energy pill + practitioner-guidance flag, expandable detail modal in the doc's recommended field order (Snapshot → Medicine When → Poison When → Actions → L. Glôw Tip — "Best Seasons"/"Best Constitutions" skipped, not present in the actual source data). Global safety disclaimer (education only, not diagnosis) shown persistently above the search box, from the doc's own compliance copy.
3. `data/searchIndex.js` — `buildHerbEntries()` repointed at the new database.
4. Verified end-to-end via Playwright: 256 entries load, symptom search and type filter both narrow correctly, detail modal renders all sections, deep link (`/herbs?herb=Turmeric`, same mechanism global search uses) opens the right entry.

~~**Known follow-up:** `app/recommendations.js`'s per-dosha "Herbs & Spices" chips still read the *old* `data/content/herbs.js`.~~ Closed out July 28 2026. Re-verified the mismatch count directly against live data first rather than trust the earlier count (it was actually 8 names, not 7): 6 are clean renames (`Ajwain`→`Ajwan`, `Sesame`→`Sesame Seeds`, `Guggulu`→`Guggul`, `Mint`→`Mint / Peppermint`, `Rose`→`Rose Flowers / Petals`, `Tulsi`→`Basil / Tulsi`, the last one confirmed to be the database's real combined name, not a parsing artifact) — mapped via a small `HERB_NAME_ALIASES` table in `app/recommendations.js`, Thea's original per-dosha herb lists in `data/content/recommendations.js` left completely untouched. The remaining 2 (`Brahmi`, `Trikatu`) genuinely have no single-entry match — Brahmi/Bacopa was never captured in the source database, and Trikatu is structurally a 3-herb compound formula, not a single plant, so it could never appear as one A-Z entry. Rather than fabricate a mapping or silently drop them from Thea's authored lists, those two now render as plain non-interactive labels (visibly dimmed, no tap target) instead of a chip that opens real detail. `HerbModal` in `recommendations.js` also rewritten for the new schema (dosha-impact pills, Medicine When, Poison When, Actions, L. Glôw tip — matching `app/herbs.js`'s own modal for consistency), replacing the old potency/balances/prabhav fields.

**Content status:** v2 fields are filled. Document notes that Medicine When / Poison When are "L. Glôw interpretation fields — educational wellness cues, not diagnosis or dosing instructions." Source status field tracks whether each entry came from book photos, L. Glôw interpretation, or needs review.

---

## Tongue & Pulse Check-in — new feature

**39. Tongue & Pulse self-assessment — ayurvedic body literacy tool.**
Source: transcript 27 (062426_01), June 2026. Thea's explicit request for a self-assessment feature that teaches users to read their own body signals in the ayurvedic tradition.

> *"I think it's something I want to bring to the app for people to have an opportunity to check themselves out."*

**Tongue assessment content — complete, ready to adapt.**
Thea recorded full tongue guidance covering:
- **Shape** → narrow/thin = Vata, pointed/flame-like = Pitta, round/full = Kapha
- **Size** → small/thin = Vata, medium = Pitta, thick/large = Kapha
- **Color** → grayish/brown = Vata buildup; bright/deep red = Pitta heat; pale pink = Kapha heaviness
- **Coating (Ama level)** → none = nirama (clear); grayish-brown = sama-Vata; yellow/green = sama-Pitta; white = sama-Kapha; thickness on a 3-level scale
- **Other clues** → cracks (Vata dryness), scalloped edges (malabsorption), tremors (Vata nervous system), red tip/edges (Pitta heat), frothiness/bubbles (Vata/Kapha imbalance), raised bumps (note location, consult practitioner)
- **Tongue map** → tip = head/heart/emotional heat; middle = stomach/liver/gallbladder; back = small + large intestine/elimination; sides = liver/gallbladder; center line = spine/nervous system

**Pulse assessment content — NOT YET RECORDED.**
Thea said "we're going to pause on that one, I'll send that over" at the end of the recording. Pulse content coming in a future memo. Tongue and pulse are likely two separate screens/sections within the same feature.

Note: Thea said she is "not as practiced in the pulse" — may be less confident recording that one. Check in with her before expecting it.

**Disclaimer — Thea drafted it herself, ready to use.**
She recorded a full disclaimer in her own voice (transcript 27, lines 9–54). Key elements:
- Frame: "learning a new language — the language of the body"
- What it is: a self-awareness practice, an educational tool, a way to notice patterns over time, a conversation starter with qualified healthcare providers
- What it is not: a medical diagnosis, a disease screening tool, emergency advice
- Inline result language she specified: "this pattern is often associated with..." / "Ayurveda may interpret this as..." / "this may sometimes reflect..." — never "you have X" or "this means Y"
- **"These are clues, not conclusions."** — Thea's exact phrase, goes at the top of every tongue and pulse result page
- No disease names in results: no diabetes, cancer, thyroid, IBS, depression
- Red flag copy: if experiencing persistent/worsening/severe symptoms, chest pain, neurological symptoms, mental health concerns → seek licensed medical care

**Check-in frequency:**
- Tongue: can be daily if wanted; morning is ideal (before food, coffee, tongue scraping, brushing, supplements)
- Pulse: seasonal (Thea is less practiced here)
- Before either: take a few deep breaths. "The body reads differently when we are settled vs. rushing."

**Note on data layer:** `tongueScore` already exists in the checkin API spec (item #31). The tongue assessment result can feed into the daily check-in as an integer score — the plumbing is partially anticipated.

**Where it lives:** Likely under Tools alongside the other self-assessment practices. Possibly its own route (`app/tongue.js`, `app/pulse.js`) or combined as `app/body-check.js`. Placement decision needed before building.

**Build order:**
1. ~~Thea reviews and approves tongue content adaptation (DRAFT — adapt from transcript 27)~~ — adapted, DRAFT flag in place
2. ~~Decide placement: standalone Tool, or integrated into the daily check-in flow~~ — Self-assessments section under Tools
3. ~~Build disclaimer screen (copy from transcript 27, flagged for Thea's final wording review)~~ — done, intro phase in `app/tongue-check.js`
4. ~~Build tongue assessment screen — guided visual self-check, one observation at a time~~ — done, `app/tongue-check.js`, June 2026
5. ~~Build tongue result screen — dosha/Ama reading with "clues not conclusions" framing throughout~~ — done, `app/tongue-result.js`, June 2026
6. ~~Wire `tongueScore` into the daily check-in data structure~~ — already live in `app/checkin.js` (tongue coating 1–5 scale)
7. Pulse content — wait for Thea's recording before building pulse screen

**Content dependency:** Tongue content is DRAFT, Thea to review. Pulse blocked until Thea records it.

---

## Routing audit findings (July 2026)

Full audit: every route file cross-checked against `_layout.js` registrations, every `router.push`/`router.replace`/`href` target checked for validity, every screen checked for a way back out. Result: all 31 routes match 1:1 (no orphaned registrations, no broken links). Two real bugs found and fixed same session — `app/today.js` had no back/menu navigation at all (added `BackButton`); `app/you.js`'s "My dosha & intake" settings row only ever routed to `/quiz`, never `/intake` (relabeled to "My Dosha" to match actual behavior, since a correctly-wired "My Intake Form" already exists separately in the hamburger drawer). Dead code (`PRIMARY_ROUTES` in `components/BottomNav.js`, declared but never read) also removed.

**More nav bugs found live, July 13 2026 (while testing the practitioner dashboard end-to-end — not a re-audit, just surfaced along the way):**
- **`app/checkin.js` had no hamburger drawer trigger at all** — the only one of the 5 bottom-nav tabs missing it, so a user landing on Check In had no way to reach account/settings or the new Practitioner View without switching tabs first. Added a menu icon matching the pattern already used on Lifestyle/Movement/Herbs/Nourishment.
- **Hamburger drawer content could get silently clipped.** The drawer's nav sections were plain `View`s inside a panel with `overflow: 'hidden'` and no `ScrollView` — on a short enough viewport, the bottom items (Practitioner View, Reminders, Help) were cut off with no scrollbar and no indication they existed. Wrapped the nav content in a `ScrollView`; footer moved from absolute-positioned to inline so it scrolls with the rest instead of overlapping.

~~**46. `app/tools.js` is fully built but completely unreachable.**~~
Registered in `_layout.js`, has real content (Recipes, Herbs, Breathwork, Meditation, Self Massage, Journaling, Tongue Check, Learn, About Thea tiles) — but nothing anywhere in the app links to `/tools`. Not the hamburger drawer, not the bottom nav, not any screen's CTA. Likely a leftover from before the Lifestyle/Movement/Herbs/Nourishment bottom-nav restructure (see the "legacy screens" comment in `_layout.js` for journey/journal/you, which *are* still linked from the drawer — tools isn't even that).

**Resolved July 22 2026 — Matt's call: wire it in, not delete.** Added a "Tools" row to `data/nav.js` (the shared drawer/Web-View-sidebar nav list, same one Quizzes lives in) — same "second, faster access point" framing as Quizzes rather than a true duplicate. New grid icon in `HamburgerDrawer.js`'s `ICONS` map.

---

**58. Navigation surface area — flagged for a review, not yet scoped as a fix.**
Source: Matt, July 29 2026, asked how the app's flow compares to the competitor apps researched in `docs/competitive-landscape-ayurveda-apps.md`. None of those apps (AyuLyfe, Ayura, Ayurveda AI) have anywhere near L. Glow's surface area — they're mostly quiz → result → recipes, three or four screens deep. L. Glow currently has **15 top-level destinations** before even reaching a tab's own sub-sections: 5 bottom-nav tabs (Lifestyle, Movement, Check In, Herbs, Nourishment) plus 10 more in the hamburger drawer (`data/nav.js`: Home, Your Profile, My Journey, Learn, Journal, About Thea, Book a Session, Quizzes, Tools, Playlist) — and several of those open their own multi-tab hubs (Journey has 4 tabs, You has its own Assessments list, Tools has its own grid).

Some of that is earned — a real practice has more to offer than a single quiz app — but the pattern above this note (routing audit findings, July 2026) shows the surface area has grown faster than the navigation model was actively maintained, not just once: `Tools` was fully built and completely unreachable for a stretch, twelve screens shipped with duplicate headers/back buttons before a consolidation pass caught it, `checkin.js` had no drawer trigger at all, drawer content was silently clipped on short viewports. Every individual incident got caught and fixed — this isn't a claim that anything is currently broken — but the audits fixed the symptom each time, not the underlying pattern of new destinations getting added ad hoc as features ship.

**Not scoped as a build task.** This is a flag for a future information-architecture pass — the same kind of conversation that produced the current 4-pillar bottom nav and the You-tab consolidation (see "Reworked July 13 2026" under Shipped) — not a specific fix to implement. Whether that means trimming the drawer, consolidating some of the duplicate entry points (Quizzes lives in both the drawer and You tab; Tools lives in both the drawer and its own tiles), or just accepting the sprawl as the cost of a full practice rather than a single-feature app is a call for Matt and Thea, not something to resolve unilaterally in code.

**Dug in further, July 30 2026 — the overlap is now mapped exactly, not just gestured at.** Quizzes (drawer) turns out to be a near-total subset of You tab's "Your Assessments" section — same 6 items (My Dosha, Agni, Guna, Tongue Check, Prakriti, Vikriti), same order, You's version just adds Intake Form + Share with Thea. Tools (drawer) has zero destinations that aren't already reachable elsewhere: Recipes lives inside Nourishment, Herbs is its own bottom tab, Breathwork/Meditation/Self Massage live inside Movement, Journal is a Lifestyle-tab item and its own drawer entry, Tongue Check is in both Quizzes and You's Assessments, Learn/About Thea are drawer items directly. Tongue Check specifically has three separate entry points; Journal has three too. Matt's call: hold the structural question (trim the drawer? consolidate? accept it?) for an actual conversation with Thea rather than deciding unilaterally now — but fixed the one clear bug that surfaced along the way: Tools labeled its Journal tile "Journaling," every other entry point calls it "Journal." Now consistent.

**The "future IA pass" this item flagged happened Aug 14 2026 — see #70.** Matt asked directly for nav-cleanup recommendations rather than waiting on a Thea conversation first; the actual cuts (Tools, Quizzes, Tongue Check's extra copies) are exactly what this item predicted. Web-only for now — Matt wants Thea to review the live Vercel site before it touches the native app.

---

## About Thea — image restructure

~~**47. Remove the top archway banner image; headshot placeholder becomes the page's lead image.**~~
`app/about.js`: removed the full-bleed archway banner (`assets/about-archway.jpg`) entirely. The headshot placeholder (`assets/thea.jpg` when Thea sends it) is now the first thing on the page — same framed-square treatment as before (140×180, botanical corner accents), just moved to the top instead of sitting below the banner. Screen now uses `edges={['top','bottom']}` (was `['bottom']` only) since there's no longer a full-bleed image intentionally extending under the status bar. Asset file itself untouched — kept in `assets/` for reuse elsewhere, per the note left in `about.js`. Done July 2026.

**Still open:** where (if anywhere) does the archway image get reused, and does the headshot placeholder need a different size/aspect treatment now that it's the lead image rather than a supporting one — left unchanged for now, easy follow-up once there's a photo to actually look at.

---

## Thea's "User's Manual" — placement decided, feature built and deployed

~~**48. Full essay-length piece from Thea, not yet placed anywhere in the app.**~~
Source: Thea, sent directly to Matt, July 2026. Full verbatim text preserved in `docs/thea-users-manual.md` (not reproduced here — read it there). Opens "Welcome to Your User's Manual," and reframes the entire app as a tool for the user to learn to read their *own* body's signals rather than follow anyone else's rules — explicitly including L. Glow itself ("Stop listening to everyone else. L. Glôw included.").

**Placement decided July 23 2026:** an excerpt ("Your body has been handing you pieces of your user's manual your entire life, hoping you'd slow down long enough to notice.") is now the framing copy for a new feature — a per-client, AI-drafted "User's Manual" synthesized from a client's full intake + assessment + check-in/journal history, in Thea's voice, reviewed and approved by her before the client ever sees it. This is the first AI-generated content in the app that's ever meant to reach a client (everything `generate-ai-guidance` produces stays practitioner-only) — see the content-authorship rules in `CLAUDE.md`.

**Built:**
- `supabase/migrations/20260723000000_user_manuals.sql` — new `user_manuals` table (one row per client, `ai_draft`/`content`/`status`). First conditional owner-read RLS policy in this codebase: a client can read their own row only when `status = 'approved'` — every other owner policy is unconditional.
- `supabase/functions/generate-user-manual/index.ts` — new Edge Function, same security scaffold as `generate-ai-guidance`. Aggregates intake, latest assessment results, all completed Prakriti/Vikriti tiers, a condensed 30-day check-in summary, and the last 5 journal entries; calls `claude-opus-4-8` with adaptive thinking; upserts a draft.
- `app/practitioner/index.js` — new "Manual" client tab: generate, edit, save draft, approve & publish, unpublish, regenerate (warns before discarding edits).
- `app/you.js` — new "Your User's Manual" section between Assessments and Settings; shows the framing excerpt + a link once an approved manual exists, otherwise a dimmed "soon" row.
- `app/manual.js` — new client-facing screen, reads the approved manual (RLS-gated).

**Deployed July 23 2026** — migration run and Edge Function live in Supabase. Feature is fully wired end to end: generate → review/edit → approve → client sees it on the You tab.

---

## Prakriti / Vikriti Layered Assessments — new feature, in progress

**52. Six-tier constitution assessment — replaces the "derive vikriti from check-ins" plan with direct, layered questioning.**
Source: Matt, July 17–18 2026. Supersedes/expands the "Vikriti visualization" note under Longer Horizon above — that note assumed Vikriti would be *inferred* from other signals (check-ins, Guna, Agni, Tongue); this is a different, bigger approach: **direct assessments**, three tiers each for Prakriti and Vikriti, progressive and optional (a user can stop at any tier; each deeper tier isn't required to have a valid profile).

**The framing, in Matt's words:** Prakriti Foundation answers *"Who have you always been?"* — broad strokes, obvious lifelong traits. Prakriti Level 2 answers *"What body and mind were you born into?"* — the subtler constitutional clues a practitioner would naturally observe during an intake (face, eyes, skin, hair, nails, body structure, digestion, energy, natural tendencies). Prakriti Level 3, **"Practitioner Observation,"** answers *"Let's look more closely at the blueprint nature gave you"* — reframed by Matt mid-writing from another self-report tier into something that "relies on observation" rather than self-awareness, after he caught himself drifting into Vikriti territory (life events, illness, pregnancy, trauma) that he explicitly wants to keep out of Prakriti entirely: **"Prakriti should only answer one question: what blueprint did nature give you? Not what has happened to your body."** Vikriti's three tiers (content not yet sent) are presumably where that life-history material belongs instead. Not meant to feel like "another quiz" at any tier — meant to feel like someone gently studying and understanding you. (21 + 54 + 33 lands on 108 total across the three Prakriti tiers — Matt's original symbolic target, preserved even after Level 3's content completely changed shape.)

**Built so far:**
- ~~`constitution_questions` Supabase table — one shared table across all six tiers (`assessment` + `tier` columns), not six separate tables, since they're structurally identical.~~ **Split into two fully separate tables, `prakriti_questions` and `vikriti_questions`, July 20 2026** — Matt's call: Prakriti and Vikriti should be fully independent going forward, not just organizationally distinct within one shared table. See the July 20 entry below for the full split. `options` is still jsonb, not flattened columns, because each option's dosha tag is variable-length — one dosha (`["vata"]`) or a blend (`["vata","kapha"]`), a real capability Matt asked for since some traits genuinely sit between two doshas rather than purely belonging to one.
- **All three Prakriti tiers loaded** — Foundation (21), Level 2 (54), Level 3 (33) — all with real prompt/option text but **every option's dosha tag intentionally left empty** across all 108. Categorizing which dosha(s) each option represents is a clinical call for Thea/Matt, not something inferred or guessed at here (one Foundation question already broke the obvious positional vata/pitta/kapha pattern, which is exactly why nothing is auto-tagged). Level 3's IDs are prefixed `obs-` (e.g. `obs-forehead-width`) since several observations reuse Level 2's body-part words (forehead, palms, fingers, feet, posture) and `id` is a shared primary key across every tier.
- Practitioner admin editor — full question CRUD, tier picker, and per-option Vata/Pitta/Kapha chip tagging. ~~`app/practitioner/constitution-questions.js`, "Constitution" in the hub nav~~ — since the July 20 split, this is `app/practitioner/prakriti-questions.js` ("Prakriti" in the hub nav) and `app/practitioner/vikriti-questions.js` ("Vikriti" in the hub nav), both thin wrappers around the shared `components/practitioner/ConstitutionEditor.js`.
- **Dosha Tagging screen** — a faster companion to the questions editor built specifically for the actual tagging pass now that content is loaded: browse every question in a tier, tap dosha chips directly with no edit-mode ceremony, each tap saves immediately. A progress count ("X of Y options tagged") and an "untagged only" filter help track a full tagging pass. Fixing prompt text, sections, or the option list itself still happens in the questions editor — this screen only ever touches the `dosha` array. Explicitly doesn't try to auto-detect which options are meant to stay untagged by design (Vikriti Level 2/3's per-question catch-alls, Vikriti Level 1's "balanced" reading) — no stored flag distinguishes that from "not yet tagged," so the progress count won't hit 100% even when a tier is fully and correctly tagged; a judgment call for whoever's tagging, same as when the content was authored. ~~`app/practitioner/dosha-tagging.js`, "Tag Doshas" in the hub nav, July 18 2026~~ — since the July 20 split, this is `app/practitioner/prakriti-tagging.js` ("Tag Prakriti") and `app/practitioner/vikriti-tagging.js` ("Tag Vikriti"), both thin wrappers around `components/practitioner/DoshaTaggingScreen.js`.
- Two per-question fields added for future flexibility: `allow_none` (whether the "None of these really sound like me" escape shows — Foundation treats it as universal; Level 2's source content showed it on some questions and not others; Level 3 shows it on *none* of its 33, read as a real difference for the observational framing rather than omission — all real per-question data now, not a hardcoded app-wide rule, toggle any of them in the admin editor if a reading turns out wrong) and `photo_enabled` (see below).

**Not built — the illustration/photo vision.** Matt's stated direction: for physical-trait questions/observations (face shape, eyes, nose, nails, body frame, etc.), let users pick from illustrations or upload/take a photo instead of just reading text options, with the app suggesting a closest match for the user to confirm. Explicitly phased by Matt himself: illustrations first if photos aren't realistic for v1, camera/upload as a later addition without redesigning the flow. **This is real, separate feature work — art asset production (illustrations per trait per dosha-variant), photo upload/camera UI, privacy handling for face photos, and a match-suggestion capability — not something to build alongside the question content itself.** What *is* done now, cheaply, so the data model doesn't need reshaping later: a `photo_enabled` boolean per question (true on 15 of Level 2's 54 and 27 of Level 3's 33 — Matt's own camera-icon markers in the source content; false on the more feel/behavior-based ones like veins, skin stretch, posture, gait) and an `imageUrl` slot per option (null everywhere — no illustrations exist yet). No upload, camera, or matching logic exists. Do not start building the actual photo/illustration UX until illustration assets exist and Matt scopes it as its own task.

**57. Photo-assisted answers for physical-trait questions — sketch, not built.**
Source: Matt, July 29 2026, prompted by looking at a competitor's AI face-scanner (see `docs/competitive-landscape-ayurveda-apps.md`) and asking how L. Glow could do something in the same spirit *safely* — not diagnosis, not a new judgment about the user, just a faster way to answer a question that already has a fixed set of Thea-authored options. Directly extends the "Not built — the illustration/photo vision" note above with an actual technical approach, now that one's been picked. Still pre-work, not scheduled — nothing here should be built until this gets its own explicit go-ahead, same condition the original note already set.

**The guardrail that makes this different from a face-scanner:** the model never outputs a new clinical judgment. It only ever picks the closest match from that specific question's existing 2–4 options (e.g. "angular jaw" / "round jaw" / "oval jaw") and the user taps to confirm or override — the dosha interpretation of that answer happens exactly the way it already does for a typed answer (via Thea's tagging on the option itself), untouched by this feature. If the model can't confidently match, the answer is "let the person choose manually," never a forced guess.

**Chosen approach: a server-side vision call, not on-device geometry.** Two ways were considered — on-device face-landmark measurement (private, cheap, but only works for genuinely geometric traits like face/body shape) vs. a server-side vision-capable Claude call (covers every `photo_enabled` question type — skin, nails, posture, not just geometric ones — and reuses the Edge Function pattern already live in this codebase). Going with the server-side version for a first pass.

**Sketch of the build, once scoped for real:**
- New Edge Function, e.g. `supabase/functions/match-photo-answer/index.ts`, modeled on `generate-ai-guidance`'s scaffold but simpler: this one only ever acts on the *caller's own* answer, not another user's data, so the security check is just "is this a valid signed-in user," no practitioner-role gate needed. Request: `{ assessment, tier, questionId, imageBase64 }`. Loads that question's real option text from `prakriti_questions`/`vikriti_questions`, sends the photo to Claude (use whatever the current top-tier model is when this actually gets built — see #74's note on keeping this current) with a tightly scoped prompt — "here are the only N valid options, which does this image most resemble, one line why" — and returns `{ matchedOptionIndex, reason }` or `{ noMatch: true }`. **The photo itself is never written to a table or storage bucket** — processed in the request and discarded, same spirit as how this app already treats everything else as local-first.
- Client side: on any `photo_enabled` question in `prakriti-quiz.js`/`vikriti-quiz.js`, an alternate "use my camera instead" path next to the normal text options (needs `expo-image-picker` or `expo-camera` — neither is a dependency yet). Suggested option comes back pre-highlighted with a "does this look right?" confirm step — never auto-submitted.
- A consent screen before the camera ever opens, plain language: what it's for, that the photo isn't kept, that it only ever fills in one of the existing answers.

**Useful sequencing note:** this doesn't need to wait on the illustration art the original note is blocked on — matching a photo against *text* options doesn't require `imageUrl` to be populated first. The two halves of "Not built — the illustration/photo vision" (illustrations-as-answer-choices, and camera-as-answer-shortcut) can now ship independently of each other if that's ever useful.

**Open questions for whenever this gets scoped for real:** which of the ~42 photo-enabled questions actually make sense for this (some are feel/behavior-based, not visual, despite being flagged) — is there any interest from Thea in the actual photo being kept for her own reference on Level 3 "Practitioner Observation" specifically, which would need its own explicit, separate consent (nothing above assumes that) — and what the fallback copy says when the model can't confidently match anything.

**Still open / not yet decided (unchanged from earlier framing discussions):**
- **⚠️ Flagged as the top-priority open question, July 29 2026** — during a flow comparison against the competitor apps in `docs/competitive-landscape-ayurveda-apps.md`, this turned out to be a place L. Glow is currently *worse off* than the competition, not just behind: AyuLyfe's three-way dosha split is confusing, but it's still one quiz producing three views of one answer. L. Glow has **three separate quizzes** that can each hand someone a different "constitution" reading — the standalone Dosha Quiz, intake Section 14's Prakriti assessment, and the new Prakriti tiers below — with no reconciliation. That's not just an open design question anymore, it's a real risk of showing the same person two contradictory readings. Worth prioritizing ahead of new feature work, not just leaving as a someday-TBD.
- How the three Prakriti tiers relate to the existing standalone Dosha Quiz (`/quiz`, 14 questions) and intake Section 14's Prakriti assessment — does this replace either, coexist, or feed into a reconciled reading? Explicitly left TBD — this build doesn't force that decision either way.
- Scoring/weighting once tagging is done: does a blended (two-dosha) option contribute a full point to each tagged dosha, or split weight? Recommended full-point-per-tagged-dosha for consistency with how multi-select already lets one person contribute to two doshas across separate options, but not confirmed.
- ~~No consumer-facing quiz screen exists yet for any tier — only the admin editor and the Supabase storage.~~ **Wrong, corrected July 23 2026 during a roadmap hygiene pass.** `app/prakriti.js`/`app/vikriti.js` (tier hub — progressive unlock, retake, past-attempts history) and `app/prakriti-quiz.js`/`app/vikriti-quiz.js` (the quiz-taking flow itself) all exist and are registered in `_layout.js`. Remaining real gaps are the tagging/scoring work above and the first bullet in this list (how these tiers relate to `/quiz` and intake Section 14).

**Prakriti content is now complete (108/108 questions across three tiers) — remaining Prakriti work is tagging (via the admin editor), not more content or UI. The consumer quiz screens (`app/prakriti.js`, `app/prakriti-quiz.js`) are already built.**

**Vikriti Level 1, "Check Your Signals," loaded** (21 questions, July 18 2026) — the first Vikriti content, and structurally different from every Prakriti tier in two ways: **four substantive options per question, not three** (vata/pitta/kapha-leaning plus a "balanced/no signal" fourth option, whose dosha tag is expected to stay empty *by design* — worth a pass once tagging starts so "deliberately balanced" doesn't get confused with "just not tagged yet"), and **`allow_none` is true on all 21, using different escape copy than Prakriti** — "None of these are speaking to me" vs. Prakriti's "None of these really sound like me." Read as an intentional wording distinction (Vikriti's "listening to the body right now" framing vs. Prakriti's identity framing), not a retroactive rename of Prakriti's already-set copy — flag if that read's wrong. The escape text itself isn't stored per-row; it'll be a screen-level constant keyed off `assessment` whenever the consumer quiz UI gets built. IDs prefixed `signal-` (matching "Check Your Signals") since a couple of topics overlap Foundation's slugs (`appetite`, `digestion`).

Also not yet stored anywhere: the intro/framing copy Matt wrote for before a Vikriti assessment starts ("Think about the past 2-4 weeks... Your body isn't failing you, it's giving you clues...") — no consumer screen exists yet to hold it, so it's recorded in the migration file's comment for now (`20260717080000_constitution_questions_vikriti_level1.sql`) until a real screen needs it.

**Vikriti Level 2, "Pattern Finder," loaded** (54 questions + 1 closing free-text reflection, July 18 2026). Two more real structural firsts:
- **No universal escape.** Unlike Level 1's fixed "None of these are speaking to me," every Level 2 question ends with its own uniquely-worded catch-all ("My energy has been showing up differently," "My pattern feels different," etc.) — stored as the last entry in that question's own options array (untagged by design), not a separate `allow_none` toggle. `allow_none` is false on all 54.
- **`input_type` column added** (`multi_select` default, or `free_text`) — the tier closes with an optional free-text reflection ("If your body could write you a letter today, what do you think it would say?"), Matt's own recommendation for richer qualitative data than checkboxes can capture, fitting the "help people feel heard" philosophy directly. For `free_text` rows, `options` is an empty array. The practitioner admin editor now has an Answer Type picker and hides the options-tagging UI entirely for free-text questions, since there's nothing to tag.

Sections (9, matching Matt's own Part 1/Part 2 grouping): energy, digestion_agni, elimination, sleep_restoration, mind_emotional, skin_hair, temperature_circulation, movement_recovery, whole_body_reflection. IDs prefixed `pattern-` — near-total topic overlap with Vikriti Level 1's `signal-` questions (energy, digestion, sleep, skin, mood, temperature all recur at a deeper level here), so a shared prefix scheme per tier is now the established convention, not just tidiness.

~~**Vikriti Level 3, "Your Story," partially loaded** (17 of an originally-planned ~54 questions + 1 closing free-text)~~ — **now content-complete** (66 questions: 65 multi_select + 1 closing free-text, July 18 2026) — renamed from the earlier placeholder "Clinical Clues." Matt's framing: this is the tier he thinks makes L. Glow genuinely different from a symptom-tracker — "an Ayurvedic practitioner doesn't just treat symptoms, they spend half the intake understanding the person's life," and this tier captures that context (childhood, family patterns, adolescence, women's health, life chapters, health timeline, lifestyle, relationship with food, mindset).

**The four originally-missing sections are now fully authored and loaded:** Adolescence & Early Adulthood (12), Women's Health (12), Health Timeline (6), Lifestyle (6) — real question wording and options for all of them, no more bare topic-word placeholders. Three sections already loaded were also revised/expanded by Matt and re-migrated (`20260718010000_constitution_questions_vikriti_level3_complete.sql`, the first migration in this whole feature that deletes previously-live rows rather than only appending): Life Chapters went from 1 consolidated question to 6 (the old `story-life-chapters` id is retired — the new lead question, `story-life-seasons-impact`, is a meaningfully expanded rewrite, not a continuation); Relationship with Food went from 1 placeholder-prompt question to 5 (`story-relationship-with-food` keeps its id, now with a real prompt — "Which statements feel true for you?" — plus 2 new options); Mindset went from 1 placeholder-prompt question to 4 (`story-mindset` keeps its id, real prompt "Which of these sound like you?" plus 2 new options). Both placeholder prompts flagged in the prior entry are now resolved with real wording, not invented here. `sort_order` fully replanned for real section sizes without disturbing the untouched sections (childhood, family_patterns, whole_story, closing reflection).

**The closing "Letter to Your Practitioner"** (free-text, same `input_type` mechanism as Level 2's closing reflection) is explicitly meant to carry more weight than Level 2's — Matt's framing: "it becomes part of the user's permanent story... when someone books a consultation, the practitioner doesn't just see scores and doshas, they begin with the person's own words." No schema field distinguishes that significance from Level 2's closing question yet — a note for whoever builds the consumer flow.

**All six tiers across both assessments are now content-complete** (108 Prakriti + 142 Vikriti = 250 questions — corrected July 20 2026; an earlier version of this note said "66 Vikriti," which was actually just Level 3's count, not the assessment total: Vikriti is 21 + 55 + 66 = 142). ~~Remaining work across the whole #52 feature is the dosha-tagging pass and building the consumer-facing quiz UI~~ — the consumer quiz UI shipped the same day, see below; remaining work is the dosha-tagging pass only, not more content or UI.

**Prakriti and Vikriti split apart everywhere, July 20 2026 (Matt's call).** Previously one shared table/admin screens/loader pair distinguished only by an `assessment` value — now fully separate at every layer:
- **Database:** `constitution_questions` replaced by `prakriti_questions` (108 rows) and `vikriti_questions` (142 rows) — see `supabase/migrations/20260720120000_split_constitution_questions_into_prakriti_vikriti.sql`. Same RLS pattern on both (public read, practitioner write). Data-preserving migration, not a re-seed.
- **Admin screens:** originally four routes — `prakriti-questions.js`, `vikriti-questions.js`, `prakriti-tagging.js`, `vikriti-tagging.js` — but the tagging screens turned out to be a lighter view onto the same list the editor already renders, so they were merged back together the same day: two routes now, `prakriti-questions.js` and `vikriti-questions.js`, each a thin wrapper (`table` + tier list as props) around one shared `components/practitioner/ConstitutionEditor.js`. Every option row in the list now has tap-to-tag dosha chips that save immediately, same as the old dedicated tagging screen — Edit still opens the full form for changing prompt/section/options. `DoshaTaggingScreen.js` and the two `*-tagging.js` routes were deleted.
- **Loaders:** `data/content/remote.js`'s `loadConstitutionQuestions`/`refreshConstitutionQuestions` (parameterized by assessment) replaced by separate `loadPrakritiQuestions`/`refreshPrakritiQuestions` and `loadVikritiQuestions`/`refreshVikritiQuestions` pairs, each hitting its own table. These had zero call sites before the split (no consumer screen exists yet), so this was a clean replace.
- ~~**Consumer-facing concept:** no quiz-taking UI exists yet for either assessment~~ — built the same day, see the entry directly below.

**Consumer-facing Prakriti/Vikriti assessments shipped, July 20 2026 (Matt's call).** Two new You-tab rows ("Prakriti", "Vikriti" — `PrakritiIcon`/`VikritiIcon` in `app/you.js`), each its own three-tier progressive flow, exactly as the split above anticipated: fully separate routes/screens per assessment, no shared "Constitution Assessment" mode switch, and deliberately kept separate from the existing Dosha Quiz (`/quiz`) until Matt and Thea decide which approach they prefer — the open question of how Prakriti relates to `/quiz` and intake Section 14 stays TBD.

- **No computed dosha type/score.** Checked live before building this: **1/324 Prakriti options tagged, 0/943 Vikriti options tagged.** A "you are Vata-Pitta" style result the way `/quiz`/Guna/Agni give one isn't viable yet, and there's no results-copy content for it either (real clinical writing, Thea's to author, not invented here). This ships as **raw-answer logging with progressive unlock, no scoring** — completing a tier shows a recap of the user's own answers plus a short closing line (see the July 21 entry below), not a computed result screen. Scoring + a real result screen is future work once tagging is substantially further along.
- **Progressive unlock.** Hub screens (`app/prakriti.js`, `app/vikriti.js`) show all three tiers with locked/unlocked/complete state; tier N unlocks tier N+1 once N has been completed at least once (`loadPrakritiProgress()`/`loadVikritiProgress()` in `data/user/storage.js`, checking local AsyncStorage — same source-of-truth pattern as every other result type). A completed tier can always be retaken — no punishing re-lock, matches "it changes" and "nothing is required." Prakriti's tier taglines ("Who have you always been?" etc.) are Matt's own framing already recorded above, not new copy; Vikriti's tier cards use his existing tier names (Check Your Signals / Pattern Finder / Your Story).
- **Quiz screens** (`app/prakriti-quiz.js`, `app/vikriti-quiz.js`) follow `guna-quiz.js`'s remote-load pattern (the one existing quiz that already does cache-then-live-refresh instead of a static import) — one question at a time, tap-to-toggle multi-select (can pick more than one option, since `options[].dosha` can already be a blend), `allow_none` questions get a fixed escape option using screen-level constant text ("None of these really sound like me" for Prakriti, "None of these are speaking to me" for Vikriti — both already decided, see the Vikriti Level 1 entry above), `free_text` questions get a multiline input with a "Skip for now" option (closing reflections stay optional, not a gate).
- **Storage:** new `prakriti_responses`/`vikriti_responses` Supabase tables (`supabase/migrations/20260720130000_prakriti_vikriti_responses.sql`) — same RLS shape as `dosha_results` (owner full access + consent-gated practitioner read), one row inserted per tier completion, full history preserved (never overwritten — Vikriti in particular is meant to change over time, so history is the point). `answers` stores the full denormalized Q&A (question id, section, prompt, and what was selected or written) rather than a computed score, so a historical response stays readable even if a question is later edited or deleted in the admin editor. New `save/loadPrakritiTierAnswers`, `save/loadVikritiTierAnswers`, `loadPrakritiProgress`/`loadVikritiProgress` in `data/user/storage.js`, plus `hydrate`/`migrate` pairs wired into the existing `hydrateFromSupabase()`/`migrateLocalToSupabase()` (no `AuthContext.js` changes needed — it just calls those two top-level functions, which now cover this internally).
- **Practitioner Client view:** `ClientDetail`'s Assessments tab (`app/practitioner/index.js`) now queries `prakriti_responses`/`vikriti_responses` alongside the existing result tables. Each tier completion is a collapsed entry (date, tier, answer count) that expands to the full Q&A plus a read-only "Export" text block Thea can select and copy (`formatResponseExport()`, same plain-text spirit as the existing but-unused `buildSessionSummary()` in `storage.js`) — no new dependency added (`expo-clipboard`/`expo-sharing` aren't installed, and RN's `Share` API is fragile on web). A real downloadable CSV/file export is a fine future add-on once someone confirms the format Thea actually wants.

**Feedback round after Matt tried both flows, July 21 2026** — 11 notes, one real bug and ten quiz-flow requests. Two needed real decisions, both resolved in conversation before building:
- **"Instant feedback with recommendations"** initially conflicted with the no-fabricated-clinical-content rule and ~0% tagging. Landed on: a plain recap of the user's own answers ("Here's what you shared," grouped by section, literal not interpreted) plus a short closing line **drafted in Thea's voice** per `docs/voice-guide.md`'s tone rules — new `data/content/tierClosings.js`, explicitly flagged **DRAFT, not approved** in its own header comment, same authorship pattern as every other unapproved-copy file in this codebase. Says nothing about dosha type or score.
- **Gender/age gating** for Vikriti's Women's Health questions: rather than parsing intake's free-text "Gender identity" field (unreliable), Vikriti Level 3 now opens with a one-time opt-in screen ("Want to answer questions about menstrual and reproductive health?") that filters `section === 'womens_health'` out of that run if skipped. Not persisted — asked fresh each attempt.

Everything else shipped in `app/prakriti-quiz.js`/`app/vikriti-quiz.js`:
- **Skip** on every question now, not just free-text (`skipped: true` on the answer, excluded from the recap).
- **"Select all that apply"** helper text under every multi-select prompt.
- **Optional comment field** on every question (`comment` on the answer object, shown in the recap and in the practitioner Export text) — auto-expands with a tailored placeholder ("What's true for you instead?") when the `allow_none` escape option is picked. Vikriti Level 2/3's own baked-in last-option catch-alls don't auto-trigger this — there's no stored flag distinguishing "this option is a catch-all" from "just a regular option" (same gap noted when `dosha-tagging` was built), so only the one reliably-flagged mechanism (`allow_none`) gets the auto-prompt. A per-option `is_catchall` boolean, mirroring how `dosha` already works, would close this gap — not built now, flagged here as a real follow-up.
- **Back navigation now actually restores your prior answer.** Real bug found while scoping this round: `goBack()` used to just decrement the question index without restoring what was picked/written for that question, so going back showed a blank question. Fixed by keeping a `drafts` array indexed by question position (not just the flattened answers array used for saving) — both quiz screens rebuilt around this.
- **Past attempts, visible to the user, not just Thea.** Supabase already never overwrote a completion (every tier completion is a fresh `insert`, full history preserved) — the gap was that only the practitioner dashboard could see that history. `app/prakriti.js`/`app/vikriti.js` now have an expandable "Past attempts" list per completed tier card, querying `prakriti_responses`/`vikriti_responses` directly for the signed-in user's own rows. Signed-out users don't get this (nothing to query against).
- **Thea couldn't see her own submitted data in the practitioner hub** — `ClientList` in `app/practitioner/index.js` deliberately filters `.eq('role', 'user')` so practitioner accounts don't clutter client search; that filter stays. Added a "View my own data" button above the client list that opens the existing `ClientDetail` with her own account standing in for "client" — reuses the component as-is.
- **Hamburger drawer** (`components/HamburgerDrawer.js`) now has a second section with a "Quizzes" link plus a Playlist item — a second access point, not a replacement for You tab's "Your Assessments" section, which is untouched. No dedicated playlist screen exists and no dosha-specific Spotify URLs are populated yet (`data/content/music.js`'s `playlists` all have `url: null`), so "Playlist" opens Thea's general Spotify profile (`SPOTIFY_PROFILE_URL`) directly, same `Linking.openURL` pattern as "Book a Session" in the same file. "Quizzes" was originally six individual drawer links (My Dosha, Agni, Guna, Tongue, Prakriti, Vikriti) but Matt asked the same day to collapse them into one row — now they live on a new `app/quizzes.js` list screen instead. Unlike the You tab rows, neither the drawer nor `app/quizzes.js` branch to a saved result screen — they always start/retake the quiz, a deliberate simplification for what's meant to be a quick-access shortcut.

---

## Home screen — "Getting Started" card

~~**53. New signups were getting lost with no guided first steps.**~~
Source: Matt, July 23 2026 — "we think people are getting lost once they create a profile and login." Confirmed a real gap while scoping, not just a hunch: the dosha quiz wasn't linked anywhere on the home screen at all, and `CtaButton` always says "START MY DAY" straight to `/checkin` regardless of whether the user has a dosha result yet — a brand-new signee could check in without ever being pointed at the quiz.

**Shapes discussed:** a single dynamic "next step" banner (lowest friction, but hides the app's breadth), a checklist card (shows the whole picture, but flat/task-list-feeling if every item gets equal visual weight), a full-screen guided wizard bolted onto signup (hardest to get lost in, but real friction and cuts against the quiet-app voice), reframing the dosha quiz as literally the last step of account creation, a coach-mark nav tour, and leaning on existing empty states instead of new UI. Landed on a merge of the first two.

**Built:** `GettingStartedCard` in `app/index.js`, rendered between the CTA button and the Affirmation card. Two steps — "Find your type" (`/quiz`) and "Try today's check-in" (`/checkin`) — both independently tappable in any order, no locking, no streak/shame mechanics. Only the next undone step gets the emphasized treatment (tinted row, bold label, one-line description); done steps go quiet with a small filled checkmark dot. The whole card doesn't render until both `savedDosha` and a 365-day check-in lookback have resolved (avoids a flash of the wrong state), and disappears entirely — not just fades — once both steps are done, so it's a first-run aid, not a permanent nag. "Has ever checked in" uses `loadRecentCheckins(365).length > 0` as a practical proxy for "ever," same pattern `app/you.js`'s stats already use — no new query needed.

Verified via Playwright across all three states (neither done, one done, both done) plus a tap-through on "Find your type" confirming it routes to `/quiz`.

**Not done / explicitly out of scope for this pass:** the "START MY DAY" CTA button itself was left untouched (still always routes to check-in regardless of quiz status) — didn't want to change existing behavior nobody asked to change. If it turns out the CTA itself is part of the confusion, that's a separate follow-up.

**Follow-up, July 23 2026 — measuring whether it's actually working.** Matt asked how to tell if people are stalling out. This app has no analytics platform (`CLAUDE.md` is explicit about that) — but the specific funnel in question (signup → first dosha quiz → first check-in) doesn't need one, since every step already writes a timestamped row Supabase already has.

- `supabase/queries/onboarding_funnel.sql` — new, a manual reporting query (not a migration, run directly in the SQL Editor). Part 1 is a per-user detail view (signup date, days-to-first-dosha, days-to-first-checkin); Part 2 is the aggregate version — total signups, how many completed each step within 1/7 days, and how many are "stalled" (no dosha or no check-in 7+ days after signup). This is the authoritative full-population version — it runs as admin in the SQL Editor, so it isn't limited by RLS the way anything client-side is.
- `app/practitioner/index.js` — `ClientList` now shows a small "Getting started" stat card above the search box: `X/Y took the quiz`, `X/Y have checked in`. Reuses the same query the client list already runs (added `dosha_results(taken_at)` to the existing `select`), so no extra round trip. **Scoped to consented clients only, labeled as such** — RLS only exposes `dosha_results`/`checkins` for clients who've flipped "Share with Thea" on, so this is a real but partial view, not the full signup population (that's what the SQL query is for). Verified live against real data: surfaced a genuine, useful signal on first run (4/4 consented test clients had taken the quiz, only 1/4 had ever checked in).

**54. Analytics platform — PostHog decided July 23 2026, not yet built.**
Real React Native + web SDKs from one vendor (most alternatives are web-first), generous free tier, funnels/retention built in instead of hand-rolled, EU-hosted/self-host options given the health-adjacent data, feature flags bundled free (useful for A/B testing onboarding shapes later).

**Firebase Analytics/GA4 considered and ruled out.** Two rounds: first, Firebase generally — reintroduces the `@react-native-firebase` dependency this app deliberately and fully removed in July 2026 (`CLAUDE.md`: "No Firebase anymore"), needs native config (`google-services.json`/`GoogleService-Info.plist`) and typically an EAS dev-client build rather than working in plain Expo. Second, GA4-via-`gtag.js` web-only as a lighter-weight alternative — genuinely simple, no native SDK at all — but ruled out once Matt confirmed **the app is app-first; web mainly supports marketing**, even though the two have feature parity. Web-only analytics would measure marketing traffic, not the actual product usage and onboarding funnel (#53) this was meant to answer. PostHog's React Native SDK is real (not an afterthought) and meaningfully lighter than Firebase's — no Google service files, no Firebase project — though it likely still needs an Expo config plugin and a dev-client build rather than plain Expo Go, so not zero native touch either.

**Remaining tradeoff, not fully resolved:** still a third-party vendor receiving behavioral event data, versus hand-rolling an events table on the Supabase Thea already owns end-to-end. Decided in PostHog's favor given the above.

**Not yet built.** Needs Matt to create a PostHog account first (same shape as Resend — new external account, not something Claude Code can do remotely) and drop the project key into `.env.local`. Once that's done: add the dependency + Expo config plugin, initialize on both web and native, instrument the onboarding funnel (#53) as the first real events — dosha quiz completion, first check-in — as a starting point, not the full event taxonomy.

---

**60. Onboarding journey modal + Practitioner Hub quiz reorder.** Source: real test-user feedback in `supabase/migrations/TODO.md` — "overwhelmed, don't really know where to go or what's next," plus an explicit ask to guide new users through Dosha Quiz → Intake → Prakriti → Vikriti in order.

- **Practitioner Hub quiz nav reordered** (`app/practitioner/_layout.js`) to Dosha → Prakriti → Guna → Vikriti, matching the intended consumer sequence. Agni and Tongue Check have no admin content editor yet (no dedicated table) — a known, separate gap, not folded into this reorder.
- **`OnboardingJourneyModal`** (`components/OnboardingJourneyModal.js`, rendered from `app/index.js`) — a full-screen "New here? We got you." modal shown once, automatically, on a new signee's first home-screen visit. Two paths: self-serve (all six assessments — Dosha, Prakriti, Guna, Vikriti, Agni, Tongue Check — listed as tappable rows, take in any order, no locking) or "Work with Thea directly" (skips straight to `/intake`). Step-done status is derived from existing result data (no new schema) — Prakriti/Vikriti count as started once their first tier is complete, same proxy the tier hubs already use. Gated on its own AsyncStorage flag (`loadOnboardingJourneySeen`/`saveOnboardingJourneySeen` in `data/user/storage.js`), separate from the existing `ONBOARDED` flag (which only means "has seen `/welcome`"). **Matt's call, Aug 7 2026: kept alongside the existing `GettingStartedCard` rather than replacing it** — this modal is the one-time full tour; #61 below changed what that card does afterward.
- Verified via Playwright: modal appears for a fresh account, each step routes correctly and dismisses+sets the seen flag (confirmed it doesn't reappear on a second visit), the intake skip path routes to `/intake`, and the × close button dismisses in place without navigating.
- **Copy is [DRAFT]**, written in Thea's voice per the voice guide but not yet reviewed by her — same flag as `welcome.js`/`about.js`.
- **Web-frame bug found + fixed same day:** React Native Web's `Modal` renders via a portal straight to `document.body`, bypassing the 480px mobile-frame wrapper `app/_layout.js` uses to simulate the phone frame on web — the sheet was stretching to the full browser width instead of matching the frame. Fixed by capping the sheet at `maxWidth: 480` + `alignSelf: 'center'` (no-ops on native). **`HerbModal`/`AsanaModal` in `app/recommendations.js` have the identical unfixed bug** (same `Modal` component, no width cap) — flagged, not fixed, since it wasn't in scope for this pass.

---

**61. Drive people toward the daily check-in through Prakriti, and a "Today's Rhythm" pick per time slot.** Source: Matt's follow-up note in `supabase/migrations/TODO.md`.

- **`GettingStartedCard` (`app/index.js`) re-scoped, Aug 7 2026.** Previously showed until dosha *and* a first-ever check-in were both done, then vanished for good. Now: the check-in row tracks *today's* check-in (`loadTodayCheckin`) instead of "ever checked in," so it resets and re-nudges daily; and the card's visibility condition changed from "dosha or ever-checkin missing" to "dosha not done, or Prakriti's foundation tier not done" (`loadPrakritiProgress`). Net effect, per Matt's call: the card — and its daily check-in nudge — now persists across every login from first sign-in through Prakriti completion, not just until one check-in happens.
- **"Today's Rhythm" strip on `/today`** (`app/today.js`) — one deterministically-rotating pick per time slot (morning/midday/evening/night), reusing the existing `dailyPick()` helper the screen's four pillar cards already use, sourced from `routine_items` (the same Daily Rhythms data `/recommendations` shows in full). **Deliberately not a 5th pillar card** — Matt agreed a full card didn't fit (the other four are one blurb each; this is inherently four short items) — built instead as a lighter compact strip (small time-badges + one-line pick) below the card grid, above the existing "See full guidance" link, which stays pointed at the full `/recommendations` list. A time slot with no matching content for the user's dosha (midday/night are new — see #59's migration — and still sparse) just doesn't render a row rather than showing an empty one.
- Verified via Playwright across all three `GettingStartedCard` visibility states (neither done, dosha-done-only, Prakriti-done) plus the rhythm strip rendering correctly with only the slots that have real content.

---

**62. Agni Assessment admin editor, and a "book a session" link after every quiz result.** Source: `supabase/migrations/TODO.md` — "what happened to Agni quiz and Tongue Check?" and the "want a consult with Thea" note.

- **Agni Assessment questions are now admin-editable**, same pattern as Guna (`app/practitioner/agni-questions.js`, new `agni_questions` table via `supabase/migrations/20260807010000_agni_questions_admin_content.sql`, `loadAgniQuestions`/`refreshAgniQuestions` in `data/content/remote.js`). Flattened into 4 label columns (sama/vishama/tikshna/manda) since every question always has exactly one option per agni type — same reasoning as `guna_questions`' 3-column layout. `app/agni-quiz.js` now reads from Supabase-with-static-fallback instead of only the static file, same as the Dosha/Guna quizzes. Added to the Practitioner Hub nav, after Vikriti. Content is still [DRAFT] — making it admin-editable doesn't change that; Thea still owns final review.
- **Tongue Check deliberately NOT given the same treatment.** Its content doesn't actually fit the "growable list of interchangeable questions" shape the other five editors share: `tongueSteps` is a fixed 4-step diagnostic protocol (shape/size/color/coating) where the 4th step (coating) has a structurally different option shape (ama levels, no "hard to tell" option) than the first three — there's no real "add a 5th step" concept. The genuinely list-shaped piece (`tongueSignList`, the 6-item "other signs" checklist) could get an editor later if wanted, but that's a narrower, separate scope than "give Tongue Check an editor like the others." Flagged rather than force-fit.
- **"Want to talk to Thea? Book a session" link** added to all four single-result quiz screens (`app/result.js`, `guna-result.js`, `agni-result.js`, `tongue-result.js`), below the existing "retake" link. Links straight to `BOOKING_URL` (`data/booking.js`'s cal.com link, already used on `/about`) rather than the intake form — cal.com already handles real scheduling, including any buffer time Thea configures on her end, so this satisfies both halves of the original TODO note ("links to the intake form... can we allow them to schedule... with a buffer") in one step, no new infrastructure. **Not yet added to Prakriti/Vikriti's tier-completion screens** — their flow is structurally different (multi-tier "continue to next tier," no single final result page) — flagged as a follow-up, not done here.
- Verified via Playwright: Agni quiz still works via the static fallback (table not yet migrated live), the practitioner editor renders its normal auth gate without crashing, and the booking link renders and is styled correctly on the dosha result screen.

---

**63. Push notification infrastructure — built, not yet verified.** Source: `supabase/migrations/TODO.md` ("Need Push Notifications for all communication") and #59's day-one requirement. Matt's explicit call, Aug 7 2026: build the infra now even though it can't be tested until a native build exists — `expo-notifications` does not deliver real remote push in Expo Go or a web browser, only local/simulated notifications, so nothing below has been confirmed working end-to-end on a device.

- **Client:** `expo-notifications` + `expo-device` installed, config plugin added to `app.json`. New `data/user/pushNotifications.js` (`registerForPushNotifications(userId)`) requests permission, gets an Expo push token (using the existing EAS `projectId`), and upserts it to Supabase. No-ops immediately on web and on non-device (simulator) builds. Wired into `context/AuthContext.js`'s `handleSession()` alongside the existing `hydrateAll`/`migrateAll` calls — fires on both app-boot-already-signed-in and fresh sign-in, fire-and-forget, same best-effort spirit as the rest of that function.
- **Server:** new `push_tokens` table (`supabase/migrations/20260807020000_push_tokens.sql`) — one row per device/token, owner-managed via RLS, practitioner-readable (not writable) so a future send can look up a client's device. Not yet run live — needs Matt to run it in the SQL Editor like every other migration.
- **First real consumer:** `supabase/functions/notify-intake-complete/index.ts` now also pushes every practitioner-role user with a registered token, alongside the existing Thea email, whenever a client completes their intake form — the first concrete "communication" event, since messaging (#59) itself isn't built yet. Uses Expo's push API directly (`https://exp.host/--/api/v2/push/send`), same "no SDK, raw fetch" pattern as the Resend email call already in this function. Push failure is swallowed and never blocks the email send or the `notified_at` write — this part of the function is new and unverified, the existing email path must keep working regardless of whether push does.
- **Deploy steps for Matt, not something Claude Code can do remotely:** ~~(1) run the `push_tokens` migration~~ done, ~~(2) re-paste the updated `notify-intake-complete/index.ts` into its existing Supabase Edge Function~~ done — both confirmed same day. **(3) still open:** an EAS build (dev or production) that includes the new native module — nothing here can register a real token or receive a real push until that happens. Not reachable from Expo Go.
- **Not built:** any actual messaging feature to notify about beyond intake completion (still #59, still unscoped), a way to send a push to a specific *client* rather than practitioners (no use case yet — nothing triggers client-facing pushes today), and web push (still an open question per #59, separate mechanism — service worker + VAPID keys — not the same code path as this).

**Update, Aug 9-10 2026 — both native builds shipped and push infra fully deployed.** iOS provisioning profile fixed (it predated `expo-notifications`, lacked the Push Notifications capability); EAS also generated a new Apple Push Notifications service key as part of that fix, a separate necessary piece beyond just the entitlement. Android APK and iOS TestFlight build 40 both include the push code now. Messaging (#59) is also fully built and live as of Aug 8 (see its own entry) — the "not built" note above about a message-triggered push is now done. First real end-to-end delivery test (client sends → Thea's real TestFlight app should receive a push) was kicked off the evening of Aug 10 — confirmed Thea's account has `role = 'practitioner'` first, result not yet known as of this writing.

---

**64. Practitioner message inbox + dosha-personalized Daily Practices.** Source: Matt, Aug 10 2026 — "what else can we work on from a functionality perspective."

- ~~**Recent Messages card** on the Practitioner Hub's Clients list~~ — superseded same day by #65's dedicated Dashboard tab (Matt's call, given the choice between "enhance Clients" vs. "new Dashboard tab") — generalized into a fuller activity feed there instead of living on Clients. Fixed the same gap either way: no way to see "who messaged me recently" without opening every client individually.
- **Daily Practices on `/journey` are now dosha-personalized**, not one static list for everyone. `buildPractices()` in `app/journey.js` pulls real content already authored elsewhere — Daily Rhythms `routine_items` for Morning Ritual/Evening Wind Down (same data `/today`'s "Today's Rhythm" uses), `movement.js` asanas for Movement, `recommendations.js` foods-to-favor for Nourishing Meal, and the first sentence of `recommendations.js`'s meditation copy for Mindful Moment — each using the same daily-rotating `dailyPick()` pattern already established on `/today`. Falls back to the original generic line per-slot if no dosha (not yet taken the quiz) or no content exists for that slot/dosha combination. No new content invented — this is wiring existing authored data into a screen that wasn't using it yet, same category of change as Today's Rhythm.
- This is the first concrete piece of Matt's TODO note "how do we work recommendations in based on the quizzes/forms they have filled out... push recommendations into the daily checks/goals" — scoped narrowly to Daily Practices rather than the full ask (which also touches the actual Check-in flow and goal-setting, not just Journey's checklist) — worth a proper follow-up scoping pass if the fuller version is wanted.
- Verified via Playwright: both Vata and Pitta dosha states show genuinely different, correctly-sourced content across all 5 practice slots; zero console errors on `/journey` or the Practitioner Hub.

---

**65. Practitioner Dashboard tab.** Source: Matt, Aug 10 2026 — "she doesn't want to have to go into each user every time to see what their activity is, she needs a way to understand what the most pertinent work is." Matt's explicit call: a new dedicated nav tab, not an enhancement to the existing Clients screen (more prominent, room to grow later).

- New `app/practitioner/dashboard.js`, added as the **first** item in the Practitioner Hub nav (`app/practitioner/_layout.js`) — ahead of Clients, so it's the natural first click without changing the actual default route.
- **Two sections, deliberately not one scored/ranked list** — same "surface the signal, let her judge" spirit as the rest of this app's practitioner tools, which avoid computing subjective "good/bad" judgments about a client's state:
  - **Needs Attention** — every consented client with at least one attention reason (stale check-in, declining trend, incomplete/unstarted intake), reusing the exact same `computeAttention()` logic the Clients screen already used to sort/flag rows — now `export`ed from `app/practitioner/index.js` so both screens share one implementation instead of drifting apart.
  - **Recent Activity** — a merged, chronological feed across every consented client: messages received, intake form completions, and all six assessment types (Dosha/Guna/Agni/Tongue/Prakriti/Vikriti), each showing who + what + relative time ("2h ago"). One query per client fetches only the most recent row per assessment type (`.order()` + `.limit(1, { foreignTable })` per relation) rather than full history, kept cheap at this client-list scale.
- Tapping any row deep-links to `/practitioner?clientId=...` — `ClientList` in `index.js` now accepts an `initialClientId` param and auto-opens that client once its own list finishes loading, reusing the exact same `onSelect` plumbing the list already had.
- **Real bug found and fixed during testing:** the query originally tried to read `intake_forms.notified_at` (the column the `notify-intake-complete` Edge Function already relies on) and Postgres rejected it — `column intake_forms_1.notified_at does not exist`, despite the column being in `supabase/migrations/20260716000000_intake_notification.sql`. Root cause not conclusively identified — likely a stale PostgREST schema cache, possibly that migration never actually ran live despite predating most others this session. **Worth Matt double-checking directly in the Supabase dashboard** (Table Editor → `intake_forms` → confirm the column exists) — if it's actually missing, `notify-intake-complete`'s duplicate-notification guard has been silently broken this whole time, a separate and higher-priority issue than this dashboard. Worked around here by using `updated_at` (confirmed working elsewhere) gated by an actual completeness check computed from the intake `data` field, rather than depending on the disputed column.
- Verified via Playwright with real practitioner credentials: both sections render correct live data (7 flagged clients, a real Guna Assessment completion, an actual test message sent earlier this session), and the deep-link tap-through was confirmed working end-to-end — lands on Clients with the right client already selected and its detail pane open.

---

**66. Practitioner Inbox, notification tap-to-navigate, and an Android keyboard regression fix.** Source: Matt, Aug 11 2026 — asked where Thea actually sees client messages, then where a tapped push notification takes her (answer at the time: nowhere in particular — no tap-handling existed), then asked for an inbox, the tap gap closed, and timestamps.

- **New `app/practitioner/inbox.js`**, added to the hub nav right after Dashboard. Distinct from Dashboard's "Recent activity" (which caps at 15 rows and mixes messages with intake/assessment events) — Inbox is messages-only, one row per client thread (every consented thread with at least one message), sorted by its most recent message, with a full date/time stamp per row (`toLocaleString(dateStyle:'medium', timeStyle:'short')`, matching the format the per-client Messages tab already used — that tab already had timestamps per bubble, so the actual gap was a browsable list, not timestamps in the thread itself). Tapping a row deep-links into that client's own Messages tab. `messages.user_id`/`sender_id` reference `auth.users`, not `public.users`, so there's no FK for PostgREST to embed — fetched in two steps (all messages, then a `.in('id', ...)` lookup on `public.users` for display names) rather than one embedded query.
- **`ClientDetail` now accepts an `initialTab` prop** (`app/practitioner/index.js`), read from a new `tab` URL param alongside the existing `clientId` one. Consumed once via a ref and then forgotten, so deep-linking straight to the Messages tab doesn't leave every subsequently-clicked client stuck there too. Dashboard's activity-feed rows now pass `tab=messages` when the event itself is a message, reusing the same `?clientId=&tab=` shape as Inbox.
- **Push-notification tap now actually goes somewhere.** `supabase/functions/notify-new-message/index.ts` attaches a `data` payload (`type`, `recipientRole`, and — for a practitioner recipient — `clientId`) to each Expo push it sends. `app/_layout.js` now has a notification-response listener (`Notifications.addNotificationResponseReceivedListener` for a warm/background tap, `getLastNotificationResponseAsync` for a cold start where the app was launched by the tap) that reads that payload and routes: a client always to `/messages`, a practitioner to that specific client's Messages tab via the same deep link Inbox/Dashboard use. **Deploy step for Matt:** re-paste the updated `notify-new-message/index.ts` into its Supabase Edge Function — the data payload doesn't exist server-side until that's redeployed.
- **Real regression found and fixed, not a new bug:** the client's `app/messages.js` was still covering its own composer with the keyboard on Android despite an Aug 8 "fix" — turned out that fix used `behavior="height"`, while every other keyboard-avoiding screen in the app (`index.js`, `journal.js`, `login.js`, `signup.js`) uses `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`, relying on Android's own default `adjustResize` window behavior instead of layering `KeyboardAvoidingView`'s own height-shrinking on top of it — the two fighting each other is a well-known source of exactly this symptom. `messages.js` now matches the established convention.
- Not yet verified on a real device — same testing ceiling as the rest of this session's native-only work. Needs a fresh build (the tap-routing and keyboard fix aren't in any shipped build yet) plus the Edge Function redeploy above before either can be confirmed working end to end.
- **Real bug found while testing the build above on a phone:** `ClientDetail`'s own per-client tab bar (Summary/Profile/Assessments/.../Messages, 9 tabs) was a plain `View`, not wrapped in a horizontal `ScrollView` — on a phone-width screen only the first ~4 tabs fit and the rest were just clipped with no way to reach them, Messages included. The outer Practitioner Hub nav got this exact fix back in July; this inner tab bar never did. Fixed the same way — `ScrollView horizontal` + a `tabBarContent` style holding the row layout.
- **"Message Thea" promoted to web too, Aug 11 2026 — reverses part of the original Aug 7 scope call.** Matt's original call was app-only messaging, no web; testing surfaced that he wanted the web entry point after all. `app/you.js`'s row is no longer gated on `Platform.OS !== 'web'` — sending/receiving works identically on either platform (same Supabase insert either way). What's still genuinely native-only: push notifications themselves, since there's no web push mechanism in this codebase — a signed-in web user can read and send fine, they just won't get pushed when a reply lands.
- **Push notifications confirmed working end-to-end, Aug 12 2026.** A real invocation showed `"event_type": "Shutdown", "reason": "EarlyDrop"` with zero log output — Supabase's isolate was recycling before the in-flight push-send finished, even though it was properly `await`ed before the response returned (a documented Supabase Edge Runtime gotcha). Fixed by wrapping the send in `EdgeRuntime.waitUntil()`; `pushTokensForUsers` (`supabase/functions/notify-new-message/index.ts`) now catches its own errors since the caller no longer awaits it directly, and logs the Expo response for future debugging. Confirmed via the function's own logs (`"sent to 1 token(s), Expo response: {"data":[{"status":"ok",...}]}"`) and confirmed Thea actually received the push live on her device.

---

**67. Your Activity — a client-facing log, and intentions folded into the practitioner's Check-ins tab.** Source: Matt, Aug 12 2026 — "the daily checkins don't really show up anywhere... where do we log it and show it to the client or practitioner so we have a log of all the actions?"

Investigation first: check-in history already had a practitioner view (`ClientDetail`'s Check-ins tab, full history, no limit) — that part was already solved. Two real gaps found: no client-facing view of a client's own check-in history existed anywhere (Journey's Habits tab is a single-dimension *trend chart*, not a browsable log with notes), and **intentions ("Just for today, I will...") were never logged anywhere for anyone, past today** — `saveIntention()`/`loadTodayIntention()` only ever handled the current day; no history read path existed at all, client or practitioner side.

Matt's call on placement (asked directly rather than guessed): a new unified client-facing log rather than extending the Habits tab, and intentions folded into the existing practitioner Check-ins tab rather than a new tab.

**Built:**
- `data/user/storage.js` — `loadRecentIntentions(days)` and `loadRecentPracticeCompletions(days)`, mirroring the existing `loadRecentCheckins(days)` pattern (scan N days of AsyncStorage keys via `multiGet`).
- **New `app/activity.js`** ("Your Activity") — merges check-ins, intentions, and completed daily practices (the `practice_completions` persistence from #66's session) into one chronological log, 90-day window matching the Habits tab's existing convention. Empty state included. Linked from a new "Your Activity" row in the You tab's Your Assessments list.
- **Practitioner side:** `intentions` added to `ClientDetail`'s per-client query (`app/practitioner/index.js`) and merged chronologically with check-ins in the existing Check-ins tab (now labeled "Check-ins & Intentions" in the section header) rather than a separate tab — a day's check-in and its intention render in the same card when both exist.
- `supabase/migrations/20260812000000_intentions_practitioner_read.sql` — the `intentions` table only ever had its owner-only policy from the initial schema; added a practitioner-read policy scoped to consented clients, same shape as the existing checkins/journal_entries policies (`20260715000000_practitioner_full_data_access.sql`). Run against the live project, confirmed.

**Not done:** practice completions aren't surfaced to the practitioner (only client-side, per what was actually asked) — flag if Thea wants that visibility too later.

---

**68. Separate Prakriti and Vikriti wheels on Journey's Ayurveda tab, with alignment guidance reserved (not written).** Source: Matt, Aug 12 2026 — "we want to have separate Prakriti and Vikriti renderings of the 'venn diagram' of the blend of doshas... the guidance should show how to bring your prakriti and vikriti back into alignment." Directly touches #57's still-open "three separate constitution readings can disagree" question — this doesn't resolve that broader question, just makes an explicit, asked-for choice for what feeds these two specific wheels.

**The real blocker, surfaced before building anything:** Vikriti's layered-tier questions carry per-option dosha tags, but that tagging pass was at **0/943 options tagged** as of the last live check (see #52) — there's no honest percentage to compute yet for almost anyone. Asked Matt directly rather than guess at three real decisions:
- **Prakriti wheel source:** the existing standalone Dosha Quiz (already has real computed percentages, already renders via `DoshaWheel`) — not the new unscored Prakriti tiers.
- **Vikriti wheel source:** the new Vikriti tiers, once tagged — not the originally-sketched check-in/Guna/Agni/Tongue aggregate approach (that path is blocked on #19, itself blocked on Thea).
- **Build the shell now** with an honest empty state rather than wait for tagging to catch up.

**Built:**
- **New `data/user/vikritiScoring.js`** — `computeVikritiScores(userId)`. Fetches the user's most-recent-per-tier `vikriti_responses` plus all `vikriti_questions` (for `id → options[].dosha` lookup), scores full-point-per-tagged-dosha on each selected option (the roadmap's own documented-but-unconfirmed scoring rule from #52 — a placeholder, not a clinical decision made here), returns scores plus a `hasEnoughData` flag (`total >= 10`, an arbitrary floor flagged in a comment to revisit once real data volume exists). Returns `null` when signed out or no data at all.
- **`app/journey.js`'s `AyurvedaTab`** reworked: the existing wheel section is relabeled "Your Prakriti / The blueprint you were born with" (was "Dosha Balance / Your current constitution this season") — pure UI copy reusing terminology Matt already established elsewhere (Prakriti Foundation's own "Who have you always been?" framing from #52), not new clinical content. The wheel, percentage rows, and the existing DRAFT Insights card are otherwise untouched. A new "Your Vikriti / How you're expressing right now" section follows: loading state, a real `DoshaWheel` + percentage rows when `hasEnoughData`, otherwise an honest empty-state card (different copy for "hasn't started Vikriti yet" with a CTA to `/vikriti` vs. "started but not enough tagged data").
- **A deliberately empty "Coming from Thea" placeholder card** below both wheels — the "how to bring Vikriti back into alignment with Prakriti" guidance is real clinical interpretation and must come from Thea in her own words per `CLAUDE.md`'s content-authorship rules, not invented here. Added to her printable checklist artifact same day.

Verified via Playwright against the local dev server (signed-out state): both empty states render correctly, zero console errors, layout holds at phone width. The `hasEnoughData` wheel-rendering path is structurally identical to the already-proven Prakriti wheel (same `DoshaWheel` component, same row layout) but couldn't be visually verified with real tagged data, since realistically no test account has enough tagged Vikriti answers yet — expected, matches the empty-state-by-design intent.

---

**69. Practitioner Hub back button trapped Thea with no way out.** Source: Thea, Aug 12 2026 — got stuck on a screen in the iOS app and couldn't back out of it; Matt couldn't remember which screen, asked Claude Code to find it.

Found by re-reading `app/practitioner/_layout.js`'s own header — it still used a bare `router.back()` (two places: the signed-out gate screen and the main hub header shared by every sub-route — Clients, Dashboard, Inbox, Mythbusters, etc., since they all render inside the same layout's `<Slot />`). This is the exact bug class the codebase already has a documented fix for (`smartBack()`, see its own comment: "found live on the Quizzes/Prakriti/Vikriti hub screens... every screen whose only way out is 'go back' should use this instead of a bare `router.back()`, not just the ones that hit it first") — the Practitioner Hub just never got the treatment, because it isn't reachable from the regular in-app nav to begin with (Thea gets the `/practitioner` link directly, per #30's own note) and so never showed up in a crawl that starts from the consumer app's screens.

**Why this traps her specifically, not a general user:** `router.back()` silently no-ops when there's no navigation history — exactly what a bookmarked/home-screen-shortcut direct load produces, which is Thea's only way into the hub by design. The hub also has no bottom nav (deliberately hidden on `/practitioner*` routes) and no other exit path, so a no-op back button leaves genuinely nowhere to go except force-closing the app.

**Fixed:** both `onBack` handlers in `app/practitioner/_layout.js` switched to `smartBack('/')`. Verified via Playwright — a direct load of `/practitioner` with zero prior history, followed by a tap on the back chevron: before the fix this would no-op; confirmed it now navigates away cleanly (to `/welcome` for a signed-out session, matching how the rest of the app resolves `/` when signed out), zero console errors.

---

**70. Navigation cleanup — cutting real duplication found in a fresh audit.** Source: Matt, Aug 14 2026 — asked for recommendations on making the nav cleaner, breadth feeling disjointed. Directly acts on #58's long-flagged "future IA pass," which had been waiting on a Thea conversation rather than a specific fix.

**Re-audited the live code first, not the July 30 notes** — the picture had gotten worse, not better, since then: Tongue Check had grown from 3 to 5 entry points, Journal from 3 to 4 (both `/activity` and `/messages`, added this session, are new rows on You tab that Quizzes never picked up, so the two lists were actively diverging even as their original overlap sat untouched). Presented findings as a set of prioritized, opinionated recommendations (not a unilateral rewrite) — Matt's call: build all of it.

**Shipped, web only — native build deliberately held off** so Thea can review the live Vercel site first, per Matt's explicit request:
- **Cut Tools and Quizzes as destinations.** Removed from `data/nav.js`'s drawer sections, the "Tools" settings row on You tab, and the now-dead `QuizIcon`/`ToolsIcon` icon code in `HamburgerDrawer.js` and `you.js`. `app/tools.js` and `app/quizzes.js` deleted outright (confirmed nothing else referenced either route — `data/searchIndex.js` didn't index them), Stack.Screen registrations removed from `app/_layout.js`. Every destination either pointed to is still reachable exactly where it already lived — this removes duplication, not coverage.
- **Tongue Check given one pillar home.** Removed from Movement's Self-assessments section (`app/movement.js`) — Lifestyle tab is now its only pillar-tab home, paired with the "read your body first thing" cluster (check-in, affirmations) it actually belongs with. Combined with the Tools/Quizzes cut, this takes it from 5 entry points down to 2 (Lifestyle + You tab).
- **Home's "Begin here" grid gated to first-run**, same condition the existing Getting Started card already uses (`!savedDosha || !prakritiDone`) — previously showed forever for every user, duplicating four pillar-tab destinations one tap away via bottom nav regardless of how engaged someone already was.
- **Nourishment's stale "Herb + Food Guide" coming-soon card removed** — it described the searchable herb/food encyclopedia that shipped as #36 and lives at `/herbs`; the card had gone stale, advertising a feature that already existed elsewhere under a different tab.
- Recommendation "let You tab be the one canonical assessments hub" needed no separate code change — it falls out of the Tools/Quizzes cut directly, since You tab was already the richer version of that list (badges, progress, "not taken yet" state) with nothing left competing for the job.

**Deliberately not touched:** the bottom nav's five pillars and Journey's internal-tabs pattern (Overview/Ayurveda/Habits/Cycles) — both already well-scoped, named explicitly as the model worth extending rather than a source of the duplication.

**Verified via Playwright** against a local dev server: drawer now shows exactly the 8 items proposed (Home, Your Profile, My Journey, Learn, Journal, About Thea, Book a Session, Playlist); Movement's Tongue Check row is gone with clean spacing; Nourishment's stale card is gone; `/tools` now correctly renders expo-router's "Unmatched Route" page instead of the old grid; a freshly-onboarded (first-run) session still shows "Begin here," confirming the gate doesn't hide it from the users it's actually for. Zero console errors across every screen checked.

Full audit and before/after breakdown: **[Where the Nav Breaks Down](https://claude.ai/code/artifact/640aa855-27b3-48e9-bbc6-18f0494fc740)**.

---

**71. Guidance audit — how input clients give the app actually comes back to them.** Source: Matt, Aug 17 2026, following up on noticing the Dosha Quiz result screen looked "generic" on the live Vercel site. That specific report turned out to be a false alarm (traced the real completion flow end-to-end via Playwright against production — it correctly lands on the full result screen, always has, nothing regressed) — but the underlying question was real and bigger: across all 6 assessments plus the intake form, how consistently does a client actually get something useful back for what they put in?

**Full audit, all 7 surfaces (6 assessments + intake) plus the User's Manual and daily check-in, read from the live code:** **[What Comes Back](https://claude.ai/code/artifact/4b6a4dc1-588f-456d-bd84-c289a0ee0dcb)**. Headline finding at the time: mostly not an engineering problem — Guna, Agni, Tongue, and Dosha's archetype block were functionally complete and sitting on unreviewed draft copy, not missing features. (Agni's has since moved — see below, same day.) The audit also surfaced two real bugs and one honesty gap, distinct from the content backlog:

**Shipped — the two zero-decision fixes, web only (native build held off, same as #70):**
- **`/result` can now render a saved dosha result without URL params.** Previously any params-less landing was treated as a stale link and redirected straight to `/quiz` after a "taking you to the quiz…" message — which meant there was no way to ever see your own saved Dosha Quiz result again without retaking it. Root cause of two separate symptoms: Today's "Your {dosha} blueprint" badge links to `/result` with no params and silently bounced to the quiz; You tab's "My Dosha" row always relaunched the quiz instead of showing the saved result the way Agni/Guna/Tongue's rows already do. One fix in `app/result.js` (fall back to `loadDoshaResult()` from storage when params are absent, only redirect if genuinely nothing is saved) resolved both — `app/you.js`'s "My Dosha" row now routes to `/result` when a result exists, exactly matching the other three assessments' pattern. Today's badge needed no change at all; it was already doing the right thing, the destination just couldn't handle it.
- **Prakriti and Vikriti's completion screens now say plainly that scoring isn't live yet**, instead of silently handing back a recap of the user's own answers plus one generic sentence with no explanation. New note card in both `app/prakriti-quiz.js` and `app/vikriti-quiz.js`'s `completed` branch: *"This tier doesn't have a computed dosha reading yet — that's still being built."* Vikriti's version additionally points at the real percentage wheel on Journey's Ayurveda tab (#68) as where a computed reading will eventually show up, once dosha-tagging (#52) is further along. Pure honest UI copy, not clinical content — no CLAUDE.md authorship concern.

**Verified via Playwright against a local dev server:** drove a real Dosha Quiz completion, then loaded `/result` directly with zero params (the exact bug scenario) and confirmed it now shows the full saved result instead of redirecting; confirmed You tab's "My Dosha" row now lands on `/result` too. Separately drove a full real Prakriti Foundation completion (21 questions) and confirmed the new note card renders correctly between the closing line and the answer recap. Zero console errors in both runs.

**Agni result copy — confirmed reviewed and approved, Aug 17 2026, same day.** Matt confirmed the `agniResults` content (summary/gifts/watchFor/pathForward/practices, all four types) has been through Thea's review and is good — the stale "DRAFT — Thea to review" comments in `data/content/agniQuiz.js` and `app/agni-result.js` corrected to reflect that. One real, narrower gap remains: **each type's `lGlowNote` closing line is `null` for all four types** (the same field Guna's result screen already has populated) — not a review gap, a pure authorship gap, since the content itself was never written. The card silently never renders for anyone as a result; nothing in the UI signals it's missing. Comments at each `lGlowNote: null` updated to say so precisely, so this doesn't get miscategorized as "still needs review" again. `agniQuestions` (the quiz questions themselves) are unaffected by this — still explicitly flagged structural scaffolding, still needs Thea's full rewrite.

**Not yet touched — the two remaining "needs a call" items, held for a direct conversation rather than decided here:**
- Journey's Ayurveda tab quietly mixes two different Prakriti/Vikriti lineages on one screen — "Your Prakriti" is still driven by the old standalone Dosha Quiz result, "Your Vikriti" by the new tier pipeline. Not broken, was the right call when built (the new tiers had no scoring yet), but it's the same "which constitution reading wins" question from #57 showing up concretely — worth resolving explicitly rather than leaving indefinitely.
- The intake form's only client-facing payoff (the User's Manual) requires Thea to personally generate and approve it per client — genuinely the right design for where the practice is now, but it means most clients who fill out intake get nothing back unless she's personally gotten to them. Flagged as a strategic question, not a bug.

---

**72. Playlists rebuilt from a fixed 3-row dosha table into a real add/edit/delete library.** Source: Matt, Aug 17 2026 — asked how to add a new playlist in the practitioner hub and found there was no way to.

**Root cause:** the original `playlists` table (#10a/July 2026) used `dosha` itself as the primary key — exactly 3 rows, ever, edit-only. A deliberate minimal first cut at the time (before Thea had sent any real Spotify links), not the shape of the Sound Library she'd actually described (transcript 28: morning energy, focus, sleep, grounding, meditation, anxiety, heartbreak, etc. — many playlists, only some tied to a single dosha).

**Scoped before building, confirmed with Matt:** category becomes plain free text per playlist, not a fixed enum — Thea can invent her own categories from the admin UI with no future migration needed, which is what let this get scoped and built in one pass instead of waiting on her to define a taxonomy first. Dosha tagging becomes optional and multi-select instead of required-and-singular. Explicitly out of scope for this pass: time-of-day routing and post-check-in sound suggestions (the fuller Sound Library vision) — a real phase 2, not needed just to unblock adding playlists.

**Built:**
- `supabase/migrations/20260817000000_playlists_sound_library.sql` — ALTER-based, data-preserving (not a drop/recreate): adds `id`/`category`/`sort_order`/a new `dosha` array column, backfills the array from each existing row's old single dosha value, drops the old primary key + check constraint + old `dosha` column. Run against the live project, confirmed.
- `data/content/music.js` — `playlists` reshaped from a `{vata:{}, pitta:{}, kapha:{}}` object into an array; `playlistForDosha()` replaced with `pickTodaysPlaylist(dosha, data)` (prefers dosha-tagged entries, falls back to rotating across the whole library if none are tagged for that user yet — same `dailyPick()` pattern already duplicated in journey.js/today.js).
- `data/content/remote.js` — `rowsToPlaylists()` now passes rows through as a sorted array instead of building a dosha-keyed object.
- `app/index.js` — `MusicCard` updated to the renamed function; no changes needed to the render logic itself since the field names it reads (`name`/`url`/`mood`) didn't change.
- `app/practitioner/playlists.js` — fully rewritten for real CRUD, modeled directly on the existing `intentions.js` admin editor (same list/edit/delete shape) plus a multi-select dosha-tag toggle adapted from `ConstitutionEditor.js`'s existing `DoshaToggle`. Category filter chips are derived dynamically from whatever categories already exist in the data — nothing hardcoded.
- **Defensive fix found while checking the pre-migration failure mode:** if this screen is ever opened before the migration runs, the live table's `dosha` column is still a plain string, not an array — `.join()`/`.filter()` calls on it would have thrown. `load()` now normalizes every row's `dosha` to a real array on the way in, so this can't crash regardless of migration state.

**Verified:** `pickTodaysPlaylist()`'s filtering/fallback and `rowsToPlaylists()`'s sort/normalize logic both confirmed correct via direct Node assertions (dosha-tagged preference, whole-library fallback, empty/null-safe, sort order, null-dosha-becomes-empty-array, multi-dosha arrays preserved). Via Playwright: the practitioner Playlists screen's sign-in gate renders cleanly; a real Dosha Quiz completion followed by loading Home confirmed the "Today's sound" card still renders correctly — checked before the migration ran (against the live table in its old, unmigrated state) and the defensive normalize held up with zero console errors either way. Migration now run — the admin editor's add/edit/delete is live against the real schema, not yet re-verified against it directly (the pre-migration checks above were what caught the `dosha`-array defensive fix; worth an actual add/edit/delete pass next time this comes up).

---

**73. Daily Rhythms — one pick per time-of-day category, with a decline-and-see-the-next-one mechanic, tracked per client.** Source: Matt, Aug 18 2026 — `/recommendations`'s Daily Rhythms section was showing every qualifying `routine_items` row at once (every universal anchor plus every item tagged for the client's dosha), all in one long list.

**Two real decisions confirmed before building** (both matter for the schema, not just the UI):
- **Declines reset daily**, not permanently — tomorrow the first qualifying pick shows again for a category even if it was declined yesterday. Matches how check-ins and "it changes" already work everywhere else in this app.
- **A category that runs out (everything in it declined) just disappears for the rest of that day** — no looping back to the start, no nagging. Matches the app's existing "no punishing mechanics" principle.

**Built:**
- `supabase/migrations/20260818000000_routine_declines.sql` — new log table (`user_id, date, category, item_id, declined_at`), one row per decline event, same shape as `practice_completions`/`messages`. Owner-only RLS including `is_active()` (current convention for tables created after the July 30 soft-delete migration — confirmed by checking `messages`' policy before writing this one, rather than copying the older pre-`is_active()` pattern). No practitioner-read policy added — "tracked per client" here means declines are correctly isolated per user, not that Thea needs visibility into them; easy to add later the same way `intentions`' practitioner-read policy was added on request if that's ever wanted. Run against the live project, confirmed.
- `data/user/storage.js` — `loadTodayRoutineDeclines()` / `declineRoutineItem(category, itemId)`, same AsyncStorage-source-of-truth + best-effort Supabase-log dual-write pattern as `practice_completions`, plus the matching same-day hydration entry. Deliberately no persisted "current pick" field anywhere — a category's active item is always *derived* (first qualifying item not in that day's declined-id list), so declining is just "add one more id to the exclusion set and recompute," never a stored mutation of what's "active."
- `app/recommendations.js` — new `buildDailyRhythmPicks(routinesData, dosha, declines)` groups the existing anchors + dosha-specific pool by time category and picks the first non-declined item per category (`morning`/`midday`/`evening`/`night`, in that fixed order). Each rendered row gets a "Not today" link that calls the decline function and recomputes. Empty state ("That's everything for today — check back tomorrow") when every category has been fully declined.

**Verified against real live content, not just the static fallback:** drove a real Dosha Quiz completion through to `/recommendations`, confirmed three qualifying categories rendered (Morning/Evening/Night, real Thea-voiced copy) each with its own "Not today" link. Declined Morning's pick and confirmed it was replaced by a *different* qualifying Morning item (Evening/Night untouched), count of visible categories unchanged since Morning still had a second item available. Zero console errors before or after. The vertical alignment of the time badge against long multi-line label text is a pre-existing cosmetic quirk in `RoutineRow` (unchanged by this work, same component used before) — not touched, out of scope for what was asked.

---

**74. Claude model references updated; Thea's email reply identity scoped.** Source: Matt, Aug 18 2026 — two unrelated items raised together.

**Claude model bump.** Both `generate-ai-guidance` and `generate-user-manual` were still calling `claude-opus-4-8`, which predates the current Claude 5 family — updated both to `claude-opus-5`. Found while checking whether these functions were actually usable yet: **a real `ANTHROPIC_API_KEY` secret very likely already exists in the Supabase project** — `generate-user-manual`'s own code comment (written when it was deployed July 23) says it *"reuses the existing `ANTHROPIC_API_KEY` secret already set for `generate-ai-guidance,"* and the User's Manual feature was confirmed working end-to-end that same day, which isn't possible without a working key already in place. Flagged to Matt to check the Supabase dashboard before provisioning a new Anthropic account, so this doesn't end up with two keys running. `#30` and `#48`'s historical entries above still correctly describe `claude-opus-4-8` as what was chosen *at the time* — left as an accurate record, not rewritten; the sketch for the not-yet-built `#57` photo-matching feature was updated to say "use whatever the current top-tier model is" instead of hardcoding a model name that'll be stale by the time that feature actually gets built.

**Thea's email identity.** She receives `thea@lglowliving.com` mail forwarded to her real inbox (`theasanafeeling@gmail.com`) via Squarespace's Email Forwarding, but couldn't reply *as* that address from Gmail — Squarespace Forwarding is receive-only, no outbound SMTP behind it, so Gmail's "Send mail as" verification has nothing to authenticate against. Not a code change — this is Gmail + Resend dashboard configuration. Recommended reusing the Resend SMTP relay already verified for `lglowliving.com` (the same one powering Auth SMTP and `notify-intake-complete`, see #49) as the SMTP server for a Gmail "Send mail as" alias, with a dedicated new Resend API key (not the app's own) as the password — free, no new vendor, reuses domain trust already established. The alternative (a real paid mailbox via Squarespace Business Email/Google Workspace) was named as the "more proper but costs money" option if this ever needs to be more than one alias.

**Real bug found the same day, trying the model bump for real:** Matt actually clicked "Generate User's Manual" and got `Couldn't generate — Model returned no text`. Not an auth or API failure — the call succeeded, but `generate-user-manual`'s `max_tokens: 2000` was shared between the model's own `thinking: { type: 'adaptive' }` reasoning and its actual output. A full client history (intake + assessments + check-ins + journal) gives it a lot to reason through before it starts writing the 400-700 word manual, and 2000 tokens wasn't leaving room for both — the model used the whole budget thinking and got cut off before producing any text block at all. Raised to `max_tokens: 8000`. `generate-ai-guidance` uses a different, lighter mechanism (`output_config: { effort: 'low' }`, no separate thinking-token budget) for a much shorter practitioner note over a single assessment's data — not confirmed to have the same issue, but worth watching once it's actually exercised for real rather than assuming it's fine by comparison.

**Deploy step for Matt, same as every Edge Function change:** re-paste both `generate-ai-guidance/index.ts` and `generate-user-manual/index.ts` into their Supabase dashboard functions — editing the local files doesn't touch what's live. Neither the model bump nor the max_tokens fix takes effect until that happens.

---

**75. Export the User's Manual as a branded PDF, matching Thea's existing templates — planned, not scoped yet.** Source: Matt, Aug 18 2026. The Manual currently only exists as plain narrative text/paragraphs in-app (`app/manual.js`, sourced from `user_manuals.content`) — Matt has real PDF templates from Thea he wants the generated content laid into, instead of (or alongside) the in-app reading view.

**Blocked on:** the actual template files. Matt hasn't sent them yet — plan is for him to save them somewhere local and hand over the file path; the Read tool can open PDFs directly (multi-page included) to see the real layout, fonts, and branding rather than guessing.

**Likely technical approach, sketched ahead of seeing the templates:** `expo-print` (renders HTML/CSS to a real PDF on-device, hands off to the native share sheet or a web download — no backend involved, consistent with this app staying local-first everywhere else). Not yet a dependency in this project — would be a new one, but there's no way to generate an actual PDF without some renderer, so this is a legitimate addition rather than something to avoid per the "prefer built-ins" default. Build an HTML template matching Thea's actual design, inject the manual's real text into it, wire up an export action.

**Open questions to settle once the templates are in hand, not before:**
- One template design, or does it vary (e.g., per dosha)?
- Where does export live — a button on the client's own `/manual` screen, a step in Thea's approval flow in the practitioner hub, or both?
- Anything beyond the narrative text itself that needs to be on the page (logo, date, client name, a footer disclaimer) that isn't already part of the generated content?

Not started — this entry exists so the scoping conversation above isn't lost before the templates arrive.

---

**76. Every assessment's completion screen now points to what's left, instead of dead-ending.** Source: Matt, Aug 24 2026 — five self-assessments landed on a generic exit ("RETURN HOME" / "DONE") with no path onward; only the Dosha Quiz's result screen already had a next step (Today's Guidance).

**Built:** extracted the checklist UI from `components/OnboardingJourneyModal.js` (the six-assessment "New here? We got you." tour that only ever auto-showed once, for brand-new users) into a new shared `components/AssessmentsChecklistModal.js` — same rows, same live done-state (re-loaded fresh every time it opens, from the same six `load*Result`/`load*Progress` functions), same "Work with Thea directly" footer, now parameterized by `title`/`subtitle` so any screen can open it. `OnboardingJourneyModal` is now a thin wrapper that just owns its own auto-show-once/seen-flag logic on top of it — no behavior change there.

Wired into all six assessments:
- **Dosha** (`app/result.js`) — kept "See Today's Guidance" as the primary CTA (a real, valuable next step, not a dead end), added a new secondary "See what else you can explore" button beneath it that opens the shared modal.
- **Guna, Agni, Tongue Check** (`app/guna-result.js`, `app/agni-result.js`, `app/tongue-result.js`) — the old sole CTA ("RETURN HOME" / "DONE") now opens the modal instead of navigating home directly, relabeled "SEE WHAT'S NEXT"; "Return home" demoted to a small text link alongside Retake/Book a Session.
- **Prakriti, Vikriti** (`app/prakriti-quiz.js`, `app/vikriti-quiz.js`) — only shown on the *final* tier's completion (`!nextTier`), not on intermediate tiers, since those already have a working "Continue to {next tier}" flow that shouldn't be interrupted.

**Verified via Playwright against a local dev server:** drove a full Guna Quiz completion end-to-end and confirmed the modal opens with "Where's your mind at" correctly showing as done (checkmark, dimmed label) — proving the done-state genuinely reflects what was just saved, not a static list. Drove a full 3-tier Prakriti completion (Foundation 21 questions, Level 2, Level 3 33 questions) and confirmed the modal trigger is absent on Foundation/Level 2 (where "Continue to {next tier}" shows instead) and present only on Level 3, opening correctly with "Discover your Blueprint" shown done. Directly loaded `/tongue-result` with query params and confirmed the modal opens there too. Zero console errors across all runs.

Vikriti's final-tier wiring is code-identical to Prakriti's (same conditional, same component) — not independently click-tested this pass, but no reason to expect different behavior.

Web only — native build still deliberately held off per Matt (#70/#71/#72's same constraint), not requested this pass either.

---

**77. Check-in's notes field was hidden behind the keyboard.** Source: Matt, Aug 25 2026. `app/checkin.js` had no `KeyboardAvoidingView` at all — same pattern `journal.js` already uses elsewhere in the app. Wrapped the screen in one (`behavior: 'padding'` on iOS, native `adjustResize` on Android), added `keyboardShouldPersistTaps="handled"`, and gave the scroll content extra bottom padding (`spacing.screenPadBottom`) so the note field has room to scroll clear of the keyboard instead of sitting under it. Verified no visual regression via Playwright web screenshot (keyboard-avoidance itself isn't testable on desktop web — no on-screen keyboard to reproduce the bug against).

**78. Daily Rhythms badge alignment, and a matching "what's next" link on the Today screen.** Source: Matt, Aug 25 2026, two related asks in one message.
- **`app/recommendations.js`:** the time badge (MORNING/EVENING/etc.) was vertically centered against its label, which could wrap to multiple lines — made the badge float mid-paragraph instead of clearly marking where each rhythm starts. Switched `routineRow`/`routineRhythmRow` to `alignItems: 'flex-start'` and added `marginBottom` between rows. Verified live via Playwright screenshot — badges now top-align and each rhythm reads as a distinct block. Also confirmed (not a bug): the reason a 4th "Midday" section didn't show is a content gap, not code — the live `routine_items` table has 38 morning / 6 evening / 1 night / 0 midday rows across every dosha; the practitioner Routines editor already supports "Midday" as a Time option, Thea just hasn't added one yet. Same root cause independently confirmed on `app/today.js`'s "Today's Rhythm" strip.
- **`app/today.js`:** added a "See what else you can explore" link below "See full guidance," opening the same shared `AssessmentsChecklistModal` from #76 — the screen you land on right after check-in had no path toward the other five assessments either. Verified live via Playwright: correctly shows "Meet your Dosha" as already-done after a real quiz completion.

**79. "Just for today" intentions: decline-and-choose-another, add to Journal, visible on Today's Guidance.** Source: Matt, Aug 25 2026, alongside a corner-radius fix on the same card (#80).

**Scoped via clarifying questions before building** (three genuinely ambiguous asks): "add to journal" → append into today's existing Journal entry, not a separate entry type; "add to daily guidance" → show read-only on `/recommendations`, not a new action; "decline and choose another" → track declines like Daily Rhythms does (#73), not just relabel the existing "change" link.

**Built:**
- New `suggestion_id` column on `intentions` (nullable — null for a freehand-typed intention, since there's nothing to decline against) and a new `intention_declines` log table, same shape as `routine_declines` minus a category column (intentions have only one daily slot, not four time-of-day ones). Migration: `supabase/migrations/20260825010000_intention_declines.sql` — **not yet run against the live database.**
- `data/user/storage.js`: `saveIntention`/`loadTodayIntention` now carry `{ text, suggestionId }` instead of a bare string (with a graceful fallback for pre-existing plain-text saves, both locally and in the one-time local→Supabase migration path); new `loadTodayIntentionDeclines`/`declineIntention`, hydrated on sign-in same as routine declines.
- `data/content/intentions.js`: `intentionSuggestions()` takes an optional `excludeIds` array, filtered *before* the 5-suggestion cap so a decline can actually surface another real suggestion once more per-dosha content exists (today there's only 3 universal ones, so this mostly matters once Thea fills in `vata`/`pitta`/`kapha`).
- `app/index.js` (Home's "Welcome back" card): declining the active intention logs it (if it came from a suggestion) and returns to the chip menu with that chip now excluded; a new "Add to journal" link calls the new `appendIntentionToJournal()`.
- `app/journal.js`: new exported `appendIntentionToJournal()` — tacks `"Intention: I will {text}"` onto today's `showed` field (closest existing prompt), creating today's entry if none exists yet; a second tap same day is a no-op rather than a duplicate line.
- `app/recommendations.js`: new read-only "Just For Today" section showing the day's intention, same `Section` component the rest of the page already uses.

**Verified:** `intentionSuggestions()`'s exclude-before-slice logic confirmed directly in Node (declining a suggestion correctly surfaces the next one). The new read-only section on `/recommendations` confirmed live via Playwright (seeded via localStorage, since setting an intention requires being signed in). The Home-screen write path (choose/decline/add-to-journal) is code-reviewed and structurally mirrors the already-verified Daily Rhythms decline mechanic, but **not driven live** — that screen's "Welcome back" card only renders for a signed-in user, which Playwright couldn't reach without real credentials. Worth a real on-device pass before calling this fully verified.

**Not yet done: the migration needs to be run in the Supabase SQL Editor before any of this actually works in production** — until then, `saveIntention`/`declineIntention` will fail their Supabase writes (local AsyncStorage still succeeds either way, per the existing best-effort sync pattern, so nothing crashes — it just won't sync).

---

**80. Reduced the corner radius on the "Just for today" suggestion chips.** Source: Matt, Aug 25 2026 — "they are too round." Were `borderRadius: 999` (full pill); switched to the existing `radius.sm` (12) token already used for chips elsewhere. Not independently screenshotted live (same signed-in-only card as #79), one-line low-risk token swap.

---

**81. Practitioner portal's top nav disappearing on some client-page tabs.** Source: Matt, Aug 25 2026 — "top navigation within a client page disappears sometimes depending on which tab you click on."

**Root cause: a known RN-Web flex divergence already diagnosed and fixed once in this exact file** (see the July 21 2026 session notes, and the `sidebar` style in `app/practitioner/_layout.js`, which already carries this same fix) — CSS flexbox defaults `flex-shrink` to 1 on web, while RN's own Yoga engine defaults it to 0. `app/practitioner/index.js`'s `s.tabBar` (the CLIENT_TABS bar — Summary/Profile/Assessments/etc.) and `_layout.js`'s `s.navBar` (the outer Dashboard/Inbox/Clients/... nav) both had `flexGrow: 0` but no `flexShrink: 0`, so on web only, a tab whose content pushed the column tall enough (Assessments, with potentially dozens of history entries, being the most likely trigger) could squeeze the bar down to a sliver instead of leaving it fixed-height with the content scrolling underneath. Native was never affected (Yoga's own default already matches the fix).

**Confirmed the mechanism directly, not just by pattern-matching the precedent:** built an isolated repro of the exact same nested-flex structure and measured the tab bar's real rendered height before/after. Without the fix: ~12px (visually just a thin colored line, the labels effectively gone). With the fix: ~63px, holding steady regardless of sibling content height. Screenshots matched the reported symptom exactly.

**Not click-tested against the real practitioner UI** — both tab bars live behind a practitioner login this session has no credentials for, so the fix is verified via the isolated repro's matching mechanism, not by reproducing the bug in the actual Assessments tab with real client data. Worth a quick real click-through once it's live.

---

**82. Multiple check-ins per day, instead of a second one silently overwriting the first.** Source: Matt, Aug 25 2026 — "it appears that a new check-in overwrites the existing check-in."

**Scoped via clarifying questions first** (three real decisions, each touching a different screen): Today shows every check-in from the day, not just the latest; the check-in screen quietly allows a re-check-in with no "you already did this today" prompt; the practitioner's daily log lists every check-in under its date rather than collapsing to one.

**Root cause:** a `unique(user_id, date)` constraint on `checkins`, paired with an upsert-by-date both locally (one AsyncStorage object per date) and in Supabase — by design, at the time, before this app had reason to think about more than once check-in a day mattering.

**Built:** dropped the unique constraint (`supabase/migrations/20260825020000_multiple_checkins_per_day.sql`); `data/user/storage.js`'s `saveCheckin` now appends to an array per date locally and does a plain `insert` (not upsert) to Supabase; new `loadTodayCheckins()` returns the full array for screens that need every entry, while `loadTodayCheckin()` keeps returning just the latest for callers that only care about "today's current state." **Deliberately kept `loadRecentCheckins()`'s existing one-row-per-day contract unchanged** (using each day's latest entry) — `you.js`'s streak/stats math, the Journey chart, the search index, and `buildSessionSummary` are all written assuming exactly one check-in per calendar day, and none of them needed to change. `app/today.js` now lists every one of today's check-ins with a time label instead of showing just one dot row. The practitioner Check-ins tab lists every check-in under its date instead of overwriting to the last one processed; `computeAttention()`'s trend logic collapses to one (the latest) check-in per day before comparing "last 3 vs prior 3," so a day with several check-ins doesn't outweigh a day with one.

**Verified:** drove three real check-ins in a row via Playwright and confirmed all three are stored and all three show on Today, each with its own timestamp. Directly tested (via Node, not just code review) that the practitioner Check-ins tab's day-grouping correctly buckets multiple same-day check-ins under one date header, and that `computeAttention()`'s dedupe genuinely prevents a day with duplicate/inflated same-day entries from skewing the trend detection — constructed a case with 3 same-day check-ins (two artificially high) plus 5 trending-down days and confirmed the flag still fired correctly using only the real trend, not the padding.

---

**83. Today's Guidance had no closing CTA.** Source: Matt, Aug 25 2026 — `/recommendations` just ended after Daily Rhythms with no path onward.

**Built:** signed-out visitors now see a "Don't lose this — create a free account" card (Create account / Already have an account? Sign in), gated on `useAuth()`'s `user`; everyone (signed in or not) gets a "See your profile & progress" link to `/you`, which already has its own graceful signed-out state (its own Sign in/Create account rows), so it was a safe link target either way. Plain UI copy, not clinical content.

**Verified via Playwright** (signed-out state only — no test credentials for a real signed-in pass): both links render, and clicking "Create account" navigates to `/signup` as expected.

---

~~**55. Full QA pass across app and web — bugs, dead links, unreachable pages.**~~
Source: Matt, July 2026. Static route/link audit (every file vs every `Stack.Screen` registration vs every navigation target referenced anywhere in the codebase — 49 targets, all resolved) plus a live Playwright crawl of all 37 app routes and all 17 practitioner-hub routes/tabs, both logged-out and signed-in as the real practitioner test account. Result: route/link integrity is clean — no dead links, no orphaned screens, zero console errors across the board.

**Real bug found and fixed: `today.js`'s back button silently did nothing.** `/today` is only ever reached via `router.replace('/today')` from check-in, which clears navigation history — its back button used a plain `router.back()` (not the `smartBack()` pattern ~20 other screens already use), so tapping it had nothing to go back to and no-op'd. Not a hard trap (the bottom nav bar still renders on that screen and works fine), but a dead click on a control that visually promises to do something. Fixed: switched to `smartBack('/')`. Verified live before and after.

**Bigger finding: production had been stale for 4+ days.** `l-glow.vercel.app` was serving a build from before the Herb Database (#36), the Getting Started card (#53), the check-in history view (#17), the User's Manual feature (#48), and everything else since — confirmed concretely (production's herbs page still showed the old 23-entry draft list and "Content pending Thea's review" copy). Root cause, traced via `vercel` CLI:
- GitHub's default branch (`main`) is frozen at a single "Initial commit" — all 123+ real commits in this project's history have only ever gone to `master`.
- Every deployment on record (Preview and the older Production ones alike) is attributed to the same CLI username, meaning deploys have been triggered manually via `vercel` CLI rather than automatic GitHub-push-triggered CI/CD.
- The most recent several deploys landed as **Preview** rather than **Production** — almost certainly because they were run without the `--prod` flag.

**Fixed immediately:** ran `vercel --prod` manually, confirmed aliased to `l-glow.vercel.app`, verified live (Getting Started card, full 256-entry herb database, You tab's Manual section, today.js's fixed back button — all present, zero console errors on the production URL itself).

**Root cause resolved, same day — via a git-side fix, not a Vercel-settings fix.** Checked both the Vercel dashboard (Settings → Git) and the REST API directly for an editable "Production Branch" field — neither exposed one (dashboard doesn't show it in the current UI; the API rejects `link.productionBranch` as an unrecognized property on the general project-update endpoint). Rather than keep hunting for a setting that may not be reachable this way at all, fixed it from the git side: confirmed `main` (Vercel's actual configured production branch) held nothing but a single throwaway "Initial commit" (2-line README, checked before touching anything), then force-pushed `master`'s full history onto it (`git push origin master:main --force`) so the two matched.

**First attempt at "permanent" was premature — caught the gap immediately.** The very next commit was pushed with a plain `git push origin master` and `main` silently drifted one commit behind again within minutes — because a one-time sync doesn't change the fact that `master` is the branch everyone actually pushes to, and Vercel only watches `main`. Real fix, documented in `CLAUDE.md` ("Deploying to production" section): **every push meant to go live now pushes to both branches** — `git push origin master && git push origin master:main`. Verified twice: once right after the initial sync, once again after the process was corrected — both times a `main`-branch update triggered an automatic Production deploy within about a minute, no manual `vercel --prod` needed. A local `git deploy` alias exists for convenience but isn't the actual fix (it's local-only, won't survive a fresh clone) — the two-branch push command in `CLAUDE.md` is the thing that has to survive.

---

## Shared reproductive health preference — closes a long-open intake gap

~~**56. Reproductive health question gating — shared across intake and Vikriti, not derived from gender identity.**~~
Source: Matt, July 26 2026. Closes out #33 build-order step 7, open since the intake form shipped — every user was seeing the Reproductive Health section regardless of relevance, because the originally-sketched fix (derive visibility from Section 1's free-text gender identity field) was correctly never built: pattern-matching free text to decide who sees a whole clinical section is exactly the kind of judgment call that misfires (misgendering, or excluding people who still need the content — a trans man can still menstruate, a cis woman post-hysterectomy might not).

**The actual fix: gender identity and "is this content relevant to you" are different questions, so this is its own explicit, asked-once opt-in** — not derived from anything else. Precedent already existed for this exact problem: Vikriti Level 3's Women's Health section already asked a fresh opt-in question each time rather than reading gender identity, per its own build note. This work generalized that pattern and added persistence, so the two features now share one answer instead of each asking separately (Vikriti previously re-asked "every attempt," not persisted at all).

**Built:**
- `supabase/migrations/20260726000000_reproductive_health_pref.sql` — new nullable boolean column, `users.wants_reproductive_health_questions`. `null` = never asked (any feature should show the opt-in prompt); `true`/`false` = their actual answer, reused everywhere from then on. No new RLS policy needed — the existing "owner can update their own row" policy already covers it. **Run against production, July 26 2026.**
- `data/user/storage.js` — `loadReproductiveHealthPref()` / `saveReproductiveHealthPref()`, shared by both features. Signed-out users always get `null` (no user row to persist against) — same as the pre-existing ask-fresh behavior, just now upgraded for signed-in users specifically.
- `app/vikriti-quiz.js` — Level 3 now checks the stored pref first and skips its own gate entirely if already answered (previously always asked, never remembered).
- `app/intake.js` — new content-relevance gate for the Reproductive Health section, layered on top of (not replacing) the existing 18+ age gate — both must clear before the section opens. Three states in the section list: never asked (tap to trigger the prompt), answered yes (normal section), answered no (shows "Skipped" instead of a fill count, and re-tapping offers a lightweight "actually, I'd like to answer these" way to change your mind rather than a dead end).

**Verified end-to-end against live production Supabase, not just locally:** answered "skip" on a real signed-in test account, confirmed via a completely fresh page reload (not cached state) that the answer persisted and the section correctly shows the opted-out re-entry screen instead of re-asking. Couldn't directly observe the Vikriti Level 3 side reading the same answer in this pass — that account hadn't completed Levels 1–2, so Level 3 itself is locked for an unrelated reason — but it reads via the identical shared function, so this is considered verified by construction, not by assumption.

---

~~**59. In-app messaging between practitioner and client — sketched, not built.**~~ Built Aug 7 2026 — see the "Built, Aug 7 2026" note below the original sketch.
Source: Matt, July 30 2026, asked what it would take to let Thea and a client message each other in-app, and how to do it cheapest.

**Confirmed with Matt, July 30 2026: push notifications are a day-one requirement, not a later phase.** Revises the original sketch below — notifications are now core scope, not deferred.

**What it entails, revised scope:**
- A new `messages` table (sender, recipient/thread, body, timestamps) with RLS following the same consent-gated shape every other client-data table already uses.
- Two screens — a thread view on the client side (new, doesn't exist yet — probably under You or its own nav entry) and a "Messages" tab in the Practitioner Hub's `ClientDetail` alongside Notes/Manual/etc.
- Push token storage — a new table (or jsonb column on `users`) holding each signed-in device's Expo push token, registered via the `expo-notifications` package (not currently a dependency) with a permission-request step the app doesn't have anywhere yet.
- A new Edge Function, e.g. `notify-new-message`, invoked from the client right after a message insert — same "client calls the function directly" pattern already used by `generate-ai-guidance`/`generate-user-manual`/`notify-intake-complete`, not a database trigger. Looks up the recipient's push token(s) and sends via Expo's push API.

**Cheapest path: build it directly on Supabase + Expo's push service, no third-party vendor.** Twilio/Stream/SendBird/etc. (messaging) and OneSignal/Firebase Cloud Messaging (push) would all cost money or add a second vendor to duplicate what Supabase + Expo already cover for free. The only real cost here is engineering time.

**Real-time vs. simple, still recommend starting simple — this is a separate question from push.** A push notification tells you a message arrived even with the app closed; that's independent of whether the open thread screen updates live or needs a reopen to refresh. True in-app real-time (Supabase Realtime subscriptions) is still a new pattern for this codebase and can wait — the push notification itself already solves "did I miss a message," so load-on-open for the thread view itself is still a reasonable v1.

**One nuance push being core scope surfaces: web is meaningfully harder than native here.** Expo's push service covers iOS/Android cleanly. Browser push (for anyone using the Web View) is a different mechanism entirely — needs a service worker and VAPID keys, real extra work, not just "same thing on another platform." Worth deciding explicitly whether v1 ships native-only push (web users still get the message, just have to notice it by opening the app) or whether web push is truly required from day one too — that changes the estimate.

~~**Not yet built.** No schema, no screens, no push infrastructure, no decision yet on where the client-side entry point lives in the nav (relevant to the still-open roadmap #58 conversation about nav surface area — one more destination to weigh there).~~

**Built, Aug 7 2026.** Matt's explicit scope call going in: **app-only communication, no web** — resolves the open web-push question above by removing it (no browser push, and the client-side entry point isn't promoted on web either).

- **`messages` table** (`supabase/migrations/20260807030000_messages.sql`) — simpler than originally sketched: one flat thread per client (`user_id` = whose thread, `sender_id` = who actually sent it), not a general multi-party model, matching the "exactly one practitioner right now" simplification the practitioner dashboard's own v1 already used. No update/delete policies — messages are immutable once sent, same as check-ins/journal entries. No read receipts — the push notification already answers "did I miss a message," same reasoning the original sketch used to justify skipping live-updating threads. Gated on the existing `consented_to_practitioner_view` flag, not a new messaging-specific consent.
- **Client side:** `app/messages.js` — sign-in gate, then a consent gate ("turn on Share with Thea first" with a link to `/you`) if not yet consented, then a simple bubble-style thread + composer. Entry point is a new "Message Thea" row in `app/you.js`'s Your Assessments list, shown only when `Platform.OS !== 'web'` — the route itself still works if reached directly on web (same as `/practitioner` having no nav entry but a working route), it's just not promoted there.
- **Practitioner side:** new `MessagesSection` / "Messages" tab in `ClientDetail` (`app/practitioner/index.js`), same load-then-compose pattern as the existing Notes tab. No separate consent check needed in this component — `ClientList` already only ever queries consented clients, so anyone reaching `ClientDetail` is already consented (RLS is still the real enforcement either way).
- **`supabase/functions/notify-new-message/index.ts`** (new) — same "client calls it directly after insert" pattern as `notify-intake-complete`. Direction-aware: a client sending pushes every practitioner-role user with a token (mirrors `notify-intake-complete`'s `pushPractitioners` helper); a practitioner sending must pass `{ recipientUserId }` and gets re-checked server-side against `consented_to_practitioner_view` before anything sends.
- Reuses the `push_tokens` infrastructure built the same day for #3/#63 — the one piece of the original sketch that's already in place rather than a separate blocker.
- Verified via Playwright: `/messages` renders its sign-in gate correctly with no console errors; `/you` and `/practitioner` still load cleanly with the new imports. **Not verified:** the actual authenticated thread flow (send/receive, the consent gate, the practitioner tab with real data) — same testing ceiling as everything auth-gated this session, and push delivery itself is still blocked on the EAS build noted in #63.
- ~~**Deploy step for Matt, not something Claude Code can do remotely:** create the `notify-new-message` function in the Supabase dashboard and run the `messages` migration.~~ Both done, confirmed Aug 8 2026 — backend is fully live. Still needs a native build with `expo-notifications` before push actually delivers (the Aug 7 Android APK predates that dependency, so it doesn't count).
- **Bug found + fixed, Aug 8 2026:** the client thread screen's `KeyboardAvoidingView` had no Android `behavior` (`undefined`), so the on-screen keyboard covered the composer bar. Fixed to `behavior="height"` on Android (iOS already used `"padding"`) — `journal.js` has the same `undefined`-on-Android pattern but its input sits inside the scroll view rather than a fixed bottom bar, so it wasn't affected the same way. Not yet in any shipped build.

---

## Competitive analysis — AyuLyfe / Ayuworld

Source: 31 screenshots Thea sent July 20 2026 of a competitor app (splash screen: AyuLyfe; in-app header: Ayuworld; recipe module: Ayumeal). Full teardown, comparison table, and guidance in `docs/competitive-analysis-ayulyfe.md` — not reproduced here.

**Headline takeaways:** their dosha quiz scores three *independent* readings (Physical / Physiological / Psychological) rather than one blended number — worth raising with Thea as a methodology question alongside #52's open "which Prakriti source wins" question. Their dashboard has a live Vata/Pitta/Kapha drift-over-time line chart, which validates (doesn't redirect) the existing Vikriti visualization concept under Longer Horizon. Their recipes/ingredients carry calorie counts and occasionally judgment-adjacent copy ("Judgmental, angry, critical" as literal quiz-answer text) — both are things L. Glow is already correctly positioned against (weight balancing not weight loss; principle 4, no good/no bad). No urgent build items came out of this — reference material, not a task list.

A shareable, Thea-facing writeup of the same material also exists as a published artifact (a friendlier, non-technical version of the above) — ask Matt for the link if it's needed again, it isn't tracked here since artifact URLs aren't durable roadmap references.

**Widened to the category, July 29 2026** — full detail in `docs/competitive-landscape-ayurveda-apps.md`. Researched five more real, live apps (Ayurveda AI, Ayura, Ayurveda Nest, Aura Health, The Ayurveda Experience) via App Store/Play Store listings. Headline finding: **Aura Health — already named in this doc's own "Key decisions" section as "the nearest comp" — turns out to have zero Ayurveda or dosha content.** It's a general meditation/CBT library; the comp still holds but only as a *pricing and business-model* reference ($69.99/yr for a broad content library), not a feature one — AyuLyfe/Ayura/Ayurveda AI are the actual feature-level competitors, and all price well below Aura, closer to L. Glow's own $1.99–2.99/mo. Second finding: the Prakriti/Vikriti split (constitution vs. current state, tracked separately) is now a recognized pattern across the category, not a novel idea — validates #52's direction rather than changing it. Third: Ayura's AI camera face-scanner ("maps dosha constitution... detects stress indicators") is a live, real-world example of exactly the medical-claim-adjacent feature CLAUDE.md already tells us to avoid — useful as a cautionary reference, not a feature to chase. No urgent build items here either.

**Widened further + gone deeper, same day.** Added five more real apps — AyuRythm, Vedic Lab, Prana, CureNatural, iUVeda — bringing the set to eleven. `docs/competitive-landscape-ayurveda-apps.md` now also has a real pricing breakdown across the category. Three new findings worth flagging:
- **Pricing:** the category actually supports $70–120/yr from apps thinner than L. Glow — L. Glow's $1.99–2.99/mo sits at the absolute floor, tied with the cheapest app in the set (iUVeda). Not a call to change the price, but worth surfacing to Thea/Matt as new information the original $1.99 vs. $2.99 decision didn't have.
- **The Prakriti/Vikriti split is now confirmed by three independent apps** (Ayura, Ayurveda Nest, CureNatural), not two — stronger validation for #52's direction.
- **AyuRythm does camera-based pulse diagnosis and is the worst-reviewed app in the whole set (2.2/5, 54 ratings, complaints about crashes and cancellation)** — a live argument for keeping #57's photo-matching sketch narrow (confirm an existing answer only) rather than growing it toward anything that reads as a body scan.
- Smaller note: **Vedic Lab** (built by named Swiss Ayurvedic doctors, real in-app 1:1 booking) is the one app in the set with any real practitioner credibility — still plural/clinic-voiced rather than one person throughout, but the most useful single comp if the "practitioner relationship" angle ever needs a reference point sharper than Aura Health.

A second Thea-facing artifact exists for this wider pass too — same non-technical treatment as the AyuLyfe one, ask Matt for the link.

---

## Out of scope (staying that way unless explicitly reopened)

- Monetization. The app's job is to build Thea's reputation and funnel to the center.
- Multi-practitioner content. L. Glow is Thea.
- AI-generated clinical content. Everything clinical comes from Thea.
