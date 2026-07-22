# L. Glow Roadmap

Living document. Strike through items as shipped, add new items at the bottom. Reorder only after a conversation with Matt.

---

~~**"Here's today" post-check-in screen.**~~
`app/today.js` — four pillar cards (Nourishment, Herbs, Movement, Lifestyle) shown after check-in completes. Cards are date-seeded picks from the dosha's recommendations data. Check-in score dots shown when a check-in exists for today. Blueprint badge taps to result screen. "See full guidance" links to `/recommendations` (kept as reference). `loadTodayCheckin()` added to `data/user/storage.js`. Check-in routes to `/today` via `router.replace`. Done June 2026. Phase 2: route card content by check-in scores rather than static dosha data — blocked on locked question set (#19) and richer content (Thea).

---

## Key decisions and constraints

**Launch target: August 17th.**
Thea named this explicitly (transcript 13). August 17th, 2024 was the date of her first Ayurveda consultation with her mentor — the date means something to her. All pre-launch requirements (#29, #30, #31) need to be sequenced against this horizon.

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

**51. Build the Mythbuster "challenge" card — currently unused data.**
Source: Matt, July 2026, spotted while reviewing the practitioner Mythbusters admin editor. The `challenge` field (`title`, `instructions`, `track[]`) has been sitting in the schema and loaded on the `cold-drinks-healthy` entry (Dec 28 week, "The Ice Water Test") since #11b shipped, but nothing in the consumer app ever reads it — `MythbusterCard` in `app/index.js` only renders `myth`/`take`/`reframe`. Confirmed by grep: the only reference to `.challenge` anywhere in the app is the practitioner admin's read-only "edit via SQL for now" flag.

Design sketch approved by Matt, July 17 2026: **[Challenge Card sketch](https://claude.ai/code/artifact/fab363e5-120a-4269-94ea-7c5251f1fb5c)**. Four decisions the sketch settles, to carry into the build:
1. **Not labeled "Challenge" in the UI.** Ties to the same voice-guide constraint #27 already flagged — "never call something a 'goal' or a 'challenge,' it should read as an offering." Sketch defaults to the eyebrow "Something to try" (alternative considered: "An experiment") over the literal "The Weekly Challenge." Thea's call on final wording.
2. **`track[]` renders as soft tags ("Notice this week"), not a checklist.** A checklist implies completion and a reason to feel behind if left unchecked — tags are just things worth paying attention to, no tap target or state.
3. **Single interaction: "Reflect in Journal."** Routes into the existing Journal screen (pre-filled with a prompt tied to that week's practice) instead of building new tracking storage — no new table, no completion/streak state, reuses a screen users already know.
4. **Renders as a fourth section on the existing Mythbuster card**, not a separate card or screen — `challenge` is already nested on the same weekly entry as `myth`/`take`/`reframe`, so "does this show this week" logic already exists for free, same pattern as the `reframe` box.

**Build order:**
1. Add the challenge section to `MythbusterCard` in `app/index.js` (styling per the sketch — distinct warm wash, not the neutral `reframe` box treatment)
2. Wire the "Reflect in Journal" tap — needs a way to pass a pre-filled prompt into `app/journal.js` (check whether it already accepts a route param for this, or needs one added)
3. Confirm final eyebrow wording with Thea ("Something to try" vs. "An experiment" vs. her own phrase)
4. Content-wise, only one entry has `challenge` data today (`cold-drinks-healthy`) — works as the first real test case, no new content needed to ship this

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

**13. Journey**
A personal progress view. Likely home to check-in history, dosha trends over time, and the user's evolving relationship with the practice. Content and shape TBD — requires a conversation with Thea about what "progress" looks like in ayurveda (it's not a linear score). Do not build until that framing is clear.

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

**15. Journal**
A free-form daily writing space, separate from the check-in note field. Could eventually connect to the check-in (surfacing yesterday's note before today's check-in) or the intention ("just for today" anchoring a longer reflection). Keep it simple — a dated text entry, stored locally. No prompts enforced; optional gentle framing from Thea's voice.

**16. You**
The personal profile section. Home for: dosha result and breakdown, quiz retake, saved intentions, and eventually session history and booking. Currently some of this lives on the home screen (returning user state) — this section gives it a permanent home and clears the home screen of account-management concerns.

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

**17. Check-in history view.**
Hold until real users have at least a week of data. A simple trend of morning hunger over time is the first diagnostically interesting view. Don't over-design before the data exists.

**44. Search — global, direction decided July 17 2026; scope/build still open.**
Source: Matt, July 2026, originally flagged as the app's content footprint grows (Learn, Herbs, Mythbusters, Recipes, and eventually the Herb + Food Database in #36, Freedom with Food in #40, Weight Balancing in #41).

**Decided, July 17 2026:** Matt wants a persistent search entry point (magnifying-glass icon) that searches *everything* in the app — one global search, not scoped per-section. This is a direct reversal of the "leaning scoped" reasoning below, which is kept as historical context, not deleted — it's still useful for understanding the tradeoff being accepted, not something to silently re-litigate.

**What global search now has to reckon with, given the earlier reasoning:** #36's Herb + Food Database already plans its own *symptom-based* search ("bloating," "anxiety," "PMS") — tag/curated-index matching, a different mechanism than full-text search over Learn's essays or Recipes' dosha/season/ingredient filters. A single global box needs to either run multiple matching strategies under one input (name match here, tag match there, full-text elsewhere) or accept a lowest-common-denominator search that's worse at each individual thing than a tuned per-section field would be. Not a reason not to build it — just the design cost of "everything" that a scoped approach would have avoided.

**Open questions to resolve before building:**
- Where it surfaces: persistent header icon (matches "magnifying glass" framing), hamburger drawer, or both?
- What "everything" actually covers — every `data/content/*.js` file (Learn, Herbs, Mythbusters, Recipes, Movement, Quiz/dosha info, Affirmations...) plus admin-editable content (Intentions, Daily Rhythms, Playlists)? Or content only, excluding user's own data (journal entries, check-in history)?
- Matching strategy: one unified full-text pass over all sources (simplest, weakest per-source relevance), or one input dispatching to per-source matchers with merged/ranked results (better relevance, more to build)?
- Mark 1 is local-only with all content in static JS files (`data/content/`) — any search here is client-side filtering, not a backend query. That changes if/when #30's backend lands.

**Still not scheduled** — decided in direction, not yet scoped into a build order or prioritized against everything else on this list. Flag to Matt when ready to move this from "decided" to "next."

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
- `practice_completions` exists as a table but nothing in the app writes to it — there's no "mark a practice complete" feature built yet. Scaffolded because the roadmap named it as a core table; flagged here so it doesn't look like an oversight that it's empty.

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

~~**Deliberately not built, because this is v1-to-react-to, not the real design:**~~ — Thea's first real feedback landed July 21 2026, see below. Email notification when a form is completed is now built (`supabase/functions/notify-intake-complete`, wired from `app/intake.js`'s `notifyIntakeComplete()`) but **not yet live** — blocked on the same Resend account/domain setup as #49 below, since it needs `RESEND_API_KEY` and a verified sending domain to actually deliver. Until that's done, Thea still checks the dashboard manually.

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

**49. Configure custom SMTP for Supabase Auth emails — pre-launch blocker.**
Found live, July 13 2026: Supabase's default built-in mailer (no custom SMTP configured) has a very low rate limit shared across the whole project, not per-recipient — a handful of test signups and password resets in one session was enough to trigger "too many attempts, try again in a few minutes." This will hit real users during launch signups, not just testing. Authentication → Rate Limits in the dashboard can raise the number, but the built-in mailer stays capped low regardless — the actual fix is wiring up a real SMTP provider under Authentication → Settings → SMTP Settings. Needs to happen before the August 17th launch, not after the first real user hits it.

**Provider decided, July 17 2026: Resend.** Picked over Postmark/SendGrid — Supabase's own docs use it as the default SMTP example, free tier (3,000/mo, 100/day, $0) comfortably covers this app's real scale, no permanent-free-tier competitor matches it. Explicitly ruled out reusing Thea's Squarespace-hosted mailbox: even if it exposes SMTP credentials, personal/business mailboxes aren't built for automated app-volume sending and risk her real email's spam reputation, not just re-hitting the same rate-limit problem this item exists to fix.

**One Resend account/domain now covers two features, July 22 2026.** `notify-intake-complete` (the intake-completion email to Thea, see #30 above) also needs Resend — and a Resend API key works as *both* the SMTP password for Auth emails *and* the bearer token for `notify-intake-complete`'s direct HTTP call. Same account, same verified domain, same key — one setup unblocks both. Do the domain verification once, then generate one API key and use it in both places below.

**Setup steps (Matt, not something Claude Code can do remotely — needs a new account + DNS access):**
1. Create a Resend account, add `lglowliving.com` as a sending domain
2. Add Resend's DNS records in Squarespace — ⚠️ merge the SPF `include` into the domain's *existing* Squarespace SPF record (one record only; a second one breaks Thea's real email deliverability), add the DKIM/DMARC records as given
3. Wait for Resend to verify the domain
4. Generate one API key in Resend (Resend doesn't distinguish "SMTP key" vs "API key" — the same key works both ways)
5. **Auth SMTP:** Supabase Dashboard → Authentication → Settings → SMTP Settings: enable custom SMTP, host `smtp.resend.com`, port `465` (or `587`), username `resend`, password = the API key, sender `noreply@lglowliving.com` or `thea@lglowliving.com`
6. **Intake notification:** Supabase Dashboard → Edge Functions → Create a new function → name it `notify-intake-complete` → paste `supabase/functions/notify-intake-complete/index.ts`'s contents → then Edge Functions → Secrets → add `RESEND_API_KEY` = the same API key
7. Test both: a real signup (confirms Auth SMTP) and completing an intake form on a test account (confirms the notification email reaches `thea@lglowliving.com`)

Not yet done — account creation and DNS steps above are still open.

---

**31. API endpoint spec — lglow routes on the existing panda-mobile API.**

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
7. Reproductive health conditional display logic (gender identity field from section 1 drives visibility) — **still not built, see the flagged note above.** Needs your call on the matching approach before this is safe to build.
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
- About Thea photo — she's getting a new one
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
4. ~~Build result screen~~ — done, `app/agni-result.js`, June 2026. Result copy DRAFT from transcript 21 — Thea to review before launch. Questions are structural scaffolding — Thea must rewrite all before launch.
5. Wire Agni result into recommendations as a secondary signal alongside dosha

---

## Vata / Pitta / Kapha Food Recommendations — content ready

**38. Dosha food lists — Thea's content approved, ready to load.**
Source: transcripts 23–25 (062126_04, 05, 06), June 2026. Thea has recorded detailed food recommendations for all three doshas with Best / Good / Not Beneficial / Avoid breakdowns across: grains, legumes, vegetables, fruits, nuts, oils, spices, animal products, and sweeteners. Authorship confirmed — her own words formed from multiple sources. **Note, July 2026:** several ingredient names came through garbled from Whisper transcription — see `docs/notes-transcript-23-25.md` for the specific spellings awaiting Thea's confirmation before this loads into the app.

This content feeds into:
- Item 36 (Herb + Food Database) — the dosha-specific medicine/poison breakdowns per food
- The recommendations screen — food section per dosha
- The food guide content (item 11c) — the practical examples section

⚠️ **Not yet loaded into any data file.** Awaits the food database data structure decision (item 36 placement question) before loading. Do not load into the existing `data/content/herbs.js` — that schema is too narrow. This content belongs in the new food database schema once designed.

---

## Herb + Food Database — major new feature

**36. L. Glôw Herb + Food Impact Database — content complete, build needed.**
Source: `docs/LGlow_Herb_Food_Impact_Database_v2_filled.docx`. Thea has produced a complete A–Z herb and food database, hundreds of entries from Agrimony to Yerba Santa. This is the most substantial content asset produced to date and supersedes the draft `data/content/herbs.js` entirely. (See `docs/content-review-thea.md` §3.1 — this is why `herbs.js` didn't need a separate review pass despite never being flagged as draft.)

**What the document contains:**
- A-Z entries, each with: name, type, Latin name, taste, energy, vipaka, dosha impact notation (VK- P+ style), integer dosha scores, actions array, medicine_when array, poison_when array, and an L. Glôw translation phrase
- A complete developer JSON data model — ready to implement
- App UX recommendations: card layout order (Snapshot → Medicine When → Poison When → Taste → Energy → Vipaka → Actions → Best Seasons → L. Glôw Tip), symptom-based search ("bloating", "anxiety", "PMS", "brain fog")
- Extended CMS field checklist: adds best_season, best_constitution, avoid_when, pairs_well_with, safety_flags, source_notes, review_status
- Safety and compliance copy guidance: practitioner guidance badges, pregnancy/medication flags, global disclaimer

**This is a different feature from the current herbs screen.** The current screen shows a small list of draft herb summaries. This database enables a searchable, filterable herb + food encyclopedia — users can search by name or symptom, expand cards, and see dosha-specific medicine/poison guidance.

**⚠️ Decision needed before building:**
- Does this live as an expanded Herbs section under Tools, or does it become its own top-level screen (e.g., "Encyclopedia" or "Herb + Food Guide")?
- The document includes foods alongside herbs — confirm with Thea whether foods and herbs share one searchable database or live in separate sections.

**Build order once placement is decided:**
1. Migrate `data/content/herbs.js` to the new schema (name, type, latin_name, taste, energy, vipaka, dosha_impact, actions, medicine_when, poison_when, lglow_translation, safety_flags, source_status)
2. Parse the document into structured JS data entries
3. Build searchable/filterable list UI — search by name and by symptom keyword
4. Build expandable card UI per the document's recommended field order
5. Add practitioner guidance badges for flagged entries
6. Add global safety disclaimer per compliance copy in the document
7. Wire into Tools → Herbs route (or new route if placement decision changes)

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

**46. `app/tools.js` is fully built but completely unreachable.**
Registered in `_layout.js`, has real content (Recipes, Herbs, Breathwork, Meditation, Self Massage, Journaling, Tongue Check, Learn, About Thea tiles) — but nothing anywhere in the app links to `/tools`. Not the hamburger drawer, not the bottom nav, not any screen's CTA. Likely a leftover from before the Lifestyle/Movement/Herbs/Nourishment bottom-nav restructure (see the "legacy screens" comment in `_layout.js` for journey/journal/you, which *are* still linked from the drawer — tools isn't even that).

**Decision needed:** delete it, or wire it in somewhere (it substantially overlaps with content already reachable via Lifestyle/Movement tiles and the drawer, so wiring it in risks a third redundant path to the same screens). Leaning delete, but that's Matt's call, not mine to make unilaterally.

---

## About Thea — image restructure

~~**47. Remove the top archway banner image; headshot placeholder becomes the page's lead image.**~~
`app/about.js`: removed the full-bleed archway banner (`assets/about-archway.jpg`) entirely. The headshot placeholder (`assets/thea.jpg` when Thea sends it) is now the first thing on the page — same framed-square treatment as before (140×180, botanical corner accents), just moved to the top instead of sitting below the banner. Screen now uses `edges={['top','bottom']}` (was `['bottom']` only) since there's no longer a full-bleed image intentionally extending under the status bar. Asset file itself untouched — kept in `assets/` for reuse elsewhere, per the note left in `about.js`. Done July 2026.

**Still open:** where (if anywhere) does the archway image get reused, and does the headshot placeholder need a different size/aspect treatment now that it's the lead image rather than a supporting one — left unchanged for now, easy follow-up once there's a photo to actually look at.

---

## Thea's "User's Manual" — new content, placement undecided

**48. Full essay-length piece from Thea, not yet placed anywhere in the app.**
Source: Thea, sent directly to Matt, July 2026. Full verbatim text preserved in `docs/thea-users-manual.md` (not reproduced here — read it there). Opens "Welcome to Your User's Manual," and reframes the entire app as a tool for the user to learn to read their *own* body's signals rather than follow anyone else's rules — explicitly including L. Glow itself ("Stop listening to everyone else. L. Glôw included.").

**Why this matters:** it's the same correction already made to the voice guide's opening section this cycle (`docs/voice-guide.md`, "What L. Glow actually is" — her "it's not her worldview, it's your work to do for yourself" note), but written out at full essay length in a way that reads like it's meant for a user to actually encounter, not just background philosophy for the team. Strong candidate for an actual onboarding moment, welcome-screen rewrite, or dedicated first-run "your blueprint" flow.

**Status:** Matt doesn't yet know what to do with it. **Do not build anything from this content — no screens, no copy, no onboarding flow — until that placement decision is made.** Flagging its existence and connection to the voice guide is the extent of this item for now.

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

**Still open / not yet decided (unchanged from earlier framing discussions):**
- How the three Prakriti tiers relate to the existing standalone Dosha Quiz (`/quiz`, 14 questions) and intake Section 14's Prakriti assessment — does this replace either, coexist, or feed into a reconciled reading? Explicitly left TBD — this build doesn't force that decision either way.
- Scoring/weighting once tagging is done: does a blended (two-dosha) option contribute a full point to each tagged dosha, or split weight? Recommended full-point-per-tagged-dosha for consistency with how multi-select already lets one person contribute to two doshas across separate options, but not confirmed.
- No consumer-facing quiz screen exists yet for any tier — only the admin editor and the Supabase storage. Building the actual quiz-taking UI is separate, future work.

**Prakriti content is now complete (108/108 questions across three tiers) — remaining Prakriti work is tagging (via the admin editor) and building the consumer quiz screen(s), not more content.**

**Vikriti Level 1, "Check Your Signals," loaded** (21 questions, July 18 2026) — the first Vikriti content, and structurally different from every Prakriti tier in two ways: **four substantive options per question, not three** (vata/pitta/kapha-leaning plus a "balanced/no signal" fourth option, whose dosha tag is expected to stay empty *by design* — worth a pass once tagging starts so "deliberately balanced" doesn't get confused with "just not tagged yet"), and **`allow_none` is true on all 21, using different escape copy than Prakriti** — "None of these are speaking to me" vs. Prakriti's "None of these really sound like me." Read as an intentional wording distinction (Vikriti's "listening to the body right now" framing vs. Prakriti's identity framing), not a retroactive rename of Prakriti's already-set copy — flag if that read's wrong. The escape text itself isn't stored per-row; it'll be a screen-level constant keyed off `assessment` whenever the consumer quiz UI gets built. IDs prefixed `signal-` (matching "Check Your Signals") since a couple of topics overlap Foundation's slugs (`appetite`, `digestion`).

Also not yet stored anywhere: the intro/framing copy Matt wrote for before a Vikriti assessment starts ("Think about the past 2-4 weeks... Your body isn't failing you, it's giving you clues...") — no consumer screen exists yet to hold it, so it's recorded in the migration file's comment for now (`20260717080000_constitution_questions_vikriti_level1.sql`) until a real screen needs it.

**Vikriti Level 2, "Pattern Finder," loaded** (54 questions + 1 closing free-text reflection, July 18 2026). Two more real structural firsts:
- **No universal escape.** Unlike Level 1's fixed "None of these are speaking to me," every Level 2 question ends with its own uniquely-worded catch-all ("My energy has been showing up differently," "My pattern feels different," etc.) — stored as the last entry in that question's own options array (untagged by design), not a separate `allow_none` toggle. `allow_none` is false on all 54.
- **`input_type` column added** (`multi_select` default, or `free_text`) — the tier closes with an optional free-text reflection ("If your body could write you a letter today, what do you think it would say?"), Matt's own recommendation for richer qualitative data than checkboxes can capture, fitting the "help people feel heard" philosophy directly. For `free_text` rows, `options` is an empty array. The practitioner admin editor now has an Answer Type picker and hides the options-tagging UI entirely for free-text questions, since there's nothing to tag.

Sections (9, matching Matt's own Part 1/Part 2 grouping): energy, digestion_agni, elimination, sleep_restoration, mind_emotional, skin_hair, temperature_circulation, movement_recovery, whole_body_reflection. IDs prefixed `pattern-` — near-total topic overlap with Vikriti Level 1's `signal-` questions (energy, digestion, sleep, skin, mood, temperature all recur at a deeper level here), so a shared prefix scheme per tier is now the established convention, not just tidiness.

~~**Vikriti Level 3, "Your Story," partially loaded** (17 of an originally-planned ~54 questions + 1 closing free-text)~~ — **now content-complete** (66 questions: 65 multi_select + 1 closing free-text, July 18 2026) — renamed from the earlier placeholder "Clinical Clues." Matt's framing: this is the tier he thinks makes L. Glow genuinely different from a symptom-tracker — "an Ayurvedic practitioner doesn't just treat symptoms, they spend half the intake understanding the person's life," and this tier captures that context (childhood, family patterns, adolescence, women's health, life chapters, health timeline, lifestyle, relationship with food, mindset).

**The four originally-missing sections are now fully authored and loaded:** Adolescence & Early Adulthood (12), Women's Health (12), Health Timeline (6), Lifestyle (6) — real question wording and options for all of them, no more bare topic-word placeholders. Three sections already loaded were also revised/expanded by Matt and re-migrated (`20260718010000_constitution_questions_vikriti_level3_complete.sql`, the first migration in this whole feature that deletes previously-live rows rather than only appending): Life Chapters went from 1 consolidated question to 6 (the old `story-life-chapters` id is retired — the new lead question, `story-life-seasons-impact`, is a meaningfully expanded rewrite, not a continuation); Relationship with Food went from 1 placeholder-prompt question to 5 (`story-relationship-with-food` keeps its id, now with a real prompt — "Which statements feel true for you?" — plus 2 new options); Mindset went from 1 placeholder-prompt question to 4 (`story-mindset` keeps its id, real prompt "Which of these sound like you?" plus 2 new options). Both placeholder prompts flagged in the prior entry are now resolved with real wording, not invented here. `sort_order` fully replanned for real section sizes without disturbing the untouched sections (childhood, family_patterns, whole_story, closing reflection).

**The closing "Letter to Your Practitioner"** (free-text, same `input_type` mechanism as Level 2's closing reflection) is explicitly meant to carry more weight than Level 2's — Matt's framing: "it becomes part of the user's permanent story... when someone books a consultation, the practitioner doesn't just see scores and doshas, they begin with the person's own words." No schema field distinguishes that significance from Level 2's closing question yet — a note for whoever builds the consumer flow.

**All six tiers across both assessments are now content-complete** (108 Prakriti + 142 Vikriti = 250 questions — corrected July 20 2026; an earlier version of this note said "66 Vikriti," which was actually just Level 3's count, not the assessment total: Vikriti is 21 + 55 + 66 = 142). Remaining work across the whole #52 feature is the dosha-tagging pass and building the consumer-facing quiz UI — not more content.

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

## Out of scope (staying that way unless explicitly reopened)

- Monetization. The app's job is to build Thea's reputation and funnel to the center.
- Multi-practitioner content. L. Glow is Thea.
- AI-generated clinical content. Everything clinical comes from Thea.
