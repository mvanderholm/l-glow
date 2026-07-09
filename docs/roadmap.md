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
`context/DrawerContext.js` + `components/HamburgerDrawer.js`. Slide-in from left, spring animation, backdrop tap-to-close. Wired to all 5 main screens. Account/settings items only: About Thea (→ /about), Book a Session (→ opens `cal.com/lglowliving` externally via `Linking.openURL`, added July 2026), Dosha Quiz (→ /quiz), Guna Quiz (→ /guna-quiz, added July 2026), My Intake Form (→ /intake), Reminders (soon), Help & guidance (soon). Navigation stays in bottom nav exclusively. Done.

~~**TestFlight distribution configured.**~~
`eas.json` updated with submit profile and `ascAppId`. iOS production build submitted to App Store Connect. Thea added as internal tester. Future builds: `eas build --platform ios --profile production` then `eas submit --platform ios --profile production --latest`. Done.

~~**Content review packet compiled for Thea.**~~
`docs/content-review-thea.md` — consolidates every piece of draft-status copy across the app into one doc she can work through in a sitting: the 10 Learn library essays (pointed to the in-app Learn tab rather than pasted, since they're long-form), full text for the branching quiz results (dosha archetypes, guna, agni, tongue) so she isn't retaking quizzes to see every variant, plus intake consent copy, journey tab copy, the affirmations bank, and welcome page status. Also a "nothing written yet" checklist (movement postures, agni quiz wording, 5 empty Learn concepts, dosha-specific intentions/routines, Spotify links) and a flag section — see below. Done July 2026.

**Finding from that review, corrected:** Went looking for content that was quietly living as if approved without ever being marked draft. Both `herbs.js` and `recommendations.js` turned out to be moot, not just herbs — see #38 (below), missed on the first pass: Thea already recorded detailed food recommendations for all three doshas (transcripts 22–24, June 2026) with Best/Good/Not Beneficial/Avoid breakdowns, explicitly meant to feed the recommendations screen's food section. So `recommendations.js`'s food lists aren't "unreviewed and need her eyes" — they're superseded by approved content that's sitting unloaded, same shape as the herbs.js situation. The actual blocker for both is the same one: the food+herb database placement/schema decision under #36. `data/content/recommendations.js`'s *seasonal engine* (the ritucharya month-to-season mapping) is separate from the food lists and wasn't addressed by #38 — that part may still be worth a look, but the food-list content itself is not an open gap.

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
- ~~The three gunas (mental: sattva, rajas, tamas)~~ — body filled, source: transcript 15, June 2026
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

---

## Logo & brand

**25. Replace logo mark with the O from the style guide.**
Thea prefers the standalone "O" glyph from the L. GLOW style guide image over the current logo mark (which has a chevron above the O). 

Work required:
1. Extract or recreate the O glyph from `docs/IMG_20260518_165434.png` — either trace it as an SVG or get the original vector file if one exists.
2. Replace the current `components/LogoMark.js` (or the relevant SVG path) with the new mark.
3. Check everywhere the logo renders: header, welcome screen, about screen, web layout sidebar. Confirm it looks right at all sizes.

⚠️ **Before building:** Confirm with Thea / Matt whether the original vector asset is available anywhere (Figma file, brand kit, designer contact). Tracing from a compressed PNG is a fallback, not the first move.

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

**44. Search — logged for later, scope not yet decided.**
Source: Matt, July 2026. Flagged as the app's content footprint grows (Learn, Herbs, Mythbusters, Recipes, and eventually the Herb + Food Database in #36, Freedom with Food in #40, Weight Balancing in #41). No scope decided yet — deliberately deferred rather than committed to a design.

**Open questions to resolve before building:**
- Scope: a single global search entry point across all content, or search scoped to individual sections (the Herb + Food Database in #36 already plans its own search-by-name/symptom UX as a core part of that feature)?
- Where it surfaces: header icon, hamburger drawer, or a dedicated screen?
- Mark 1 is local-only with all content in static JS files (`data/content/`) — any search here is client-side filtering, not a backend query. That changes if/when #30's backend lands.

**Revisit when:** the content surface is bigger than it is today — #36 (Herb + Food Database) is the most likely trigger, since it's the largest unbuilt content asset and search is already part of its intended design.

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

- **Vikriti visualization driven by daily check-in.** Note (Matt, July 2026): Prakriti and Vikriti are both dosha-based readings, but answer different questions — **Prakriti is the constitution you were born with** (fixed; this is what the dosha quiz measures) and **Vikriti is your current state** (changeable day to day; this is what the daily check-in and/or a dosha quiz retake would signal). The design goal: show Prakriti as something sticky/stable in the UI, and derive Vikriti from check-in data (and possibly quiz retakes) as the thing that visibly moves. A second color swatch alongside the Prakriti one, showing vikriti as derived from check-in responses over time. The visual gap between the two swatches makes prakriti vs. vikriti tangible — you can see how far you've drifted and which direction. Requires: (a) check-in questions revised to reliably signal dosha state (#19), (b) an algorithm to compute a running vikriti estimate from check-in data, (c) enough data from real users to validate the signal. Do not build the algorithm until the question set is locked.
- Practitioner-side tools: Thea views a client's check-in history before a session.
- "Book a session with Thea" CTA wired to scheduling software, or eventually in-app.
- Account creation and cross-device sync (resist until real users ask for it).
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
~~Auth UI done~~ — login, signup, magic-link (passwordless), and Firebase session persistence all live. `context/AuthContext.js` wired through the app; You tab shows signed-in state and sign-out. Remaining: backend sync (AsyncStorage → ColdFusion API on first login) and the migration flow for existing local users. Depends on #30/#31.

**Decided architecture: Firebase Auth + ColdFusion CFCs + MSSQL (see #30).**
Firebase handles identity exclusively — login, logout, session management, JWT issuance. The existing panda-mobile ColdFusion API handles all data operations, with Firebase JWT verification in CF. MSSQL is the database. Planned upgrade to Supabase once the app is generating revenue — the API contract (#31) is written to be database-agnostic so the app layer won't change.

Scope:
- Account creation — email + password to start; social login (Google, Apple) can follow
- Login and logout flows with L. Glow design system screens (no Firebase default UI)
- Session persistence — user stays logged in across app restarts via Firebase's onAuthStateChanged listener
- Graceful unauthenticated state — app works fully offline/local before login, prompts to save progress when a user tries to preserve data
- On first login after using the app locally, offer to migrate existing AsyncStorage data to the backend under their new account

Design constraints: auth screens must match the L. Glow card/shadow/typography design system. No Firebase branding visible to users.

**30. Backend data layer — user data storage and practitioner reporting.**
Thea needs to be able to see her clients' data — check-in history, dosha results, journal entries, practice completions — and draw clinical insight from it ahead of sessions. This is a core part of her practitioner value proposition and the app's long-term job.

**Decided architecture: ColdFusion CFCs + MSSQL, Firebase JWT verified in CF.**
All user-generated data is written to MSSQL via ColdFusion CFC endpoints on the existing panda-mobile server. JWT verification is handled in CF against Google's JWKS endpoint. User isolation is enforced in CFC business logic. Upgrade path to Supabase is planned once the app generates revenue; the API contract (#31) is database-agnostic so no app-side changes will be needed.

Scope — two surfaces, sequenced:

*Phase 1 — User data persistence (depends on #29):*
- Core tables: `users`, `dosha_results`, `checkins`, `journal_entries`, `intentions`, `practice_completions`
- All AsyncStorage writes proxied through a thin service layer that writes to both AsyncStorage (local cache) and the CF API (source of truth once authenticated)
- Data retained indefinitely — this is longitudinal health data

*Phase 2 — Practitioner-facing reporting (Thea's view):*
- Thea's account designated as `role: practitioner` in the `users` table
- Per-client view: dosha result, check-in history and trends, vikriti drift over time, recent journal entries (if consented)
- Start simple: a direct MSSQL/CF page she can access before building a polished UI
- Consent model: explicit opt-in per user, stored in `practitioner_clients` with `consented_at` timestamp

⚠️ **Still needed before building Phase 2:**
- Conversation with Thea about what she actually wants to see before a session — do not design the practitioner view without her input
- Consent language and privacy policy — Thea to provide; legal review required before any user data leaves the device

**Build order:**
1. ~~Firebase Auth integration + L. Glow auth screens (#29)~~ done
2. MSSQL `lglow` schema deployed (see #31 for tables)
3. ColdFusion CFC stubs for each `/lglow/` route with Firebase JWT verification
4. Service layer in the app that writes to the CF API alongside AsyncStorage
5. AsyncStorage migration flow for existing local users on first login
6. Thea conversation → practitioner view design
7. Practitioner dashboard (Phase 2)
8. Consent flow and privacy policy
9. End-to-end QA on real devices

---

**31. API endpoint spec — lglow routes on the existing panda-mobile API.**

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

## Client intake form

~~**33. Clinical intake form — full pre-session questionnaire.**~~
*Sections 1–14 built and live. Two items remain blocked: (a) signature/consent screen requires a privacy policy to exist first; (b) backend sync depends on #29/#30. Ship those when unblocked.*
Source: voice memo 12 (`docs/transcripts/12_intake_form.txt`). A multi-section clinical intake form accessible from the hamburger menu. This is the form a user fills out before working with Thea — not part of onboarding, not gated to first launch. Anyone can access it from the drawer at any time.

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
- Must sync to backend when #29/#30 are live — Thea needs to read this before sessions. This is the primary data source for her practitioner view.
- The signature/consent block requires a privacy policy to be in place before this screen ships publicly. Thea to provide; do not launch this feature without legal sign-off on the confidentiality statement.

**Build order:**
1. Data structure + `data/user/storage.js` intake key (can do now)
2. Route `app/intake.js` — multi-step form with section navigation, save-on-exit, resume state
3. Add "My Intake Form" to `components/HamburgerDrawer.js`
4. Scope-of-practice disclosure screen (copy from voice memo, flagged for Thea's final wording review)
5. All 14 sections as distinct step screens
6. 18+ gate screen before sections 11–12
7. Reproductive health conditional display logic (gender identity field from section 1 drives visibility)
8. Section 14 Prakriti assessment — single-select for physical structure, multi-select for physical function and psychological function; wrist test; face reference images + optional photo upload; coaching session CTA at section top (see #34)
9. Signature/consent screen — requires privacy policy to exist first
10. Backend sync when #29/#30 are live

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
Source: transcripts 22–24 (062126_04, 05, 06), June 2026. Thea has recorded detailed food recommendations for all three doshas with Best / Good / Not Beneficial / Avoid breakdowns across: grains, legumes, vegetables, fruits, nuts, oils, spices, animal products, and sweeteners. Authorship confirmed — her own words formed from multiple sources.

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

## Out of scope (staying that way unless explicitly reopened)

- Monetization. The app's job is to build Thea's reputation and funnel to the center.
- Multi-practitioner content. L. Glow is Thea.
- AI-generated clinical content. Everything clinical comes from Thea.
