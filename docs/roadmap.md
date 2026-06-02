# Lavender Glow Roadmap

Living document. Strike through items as shipped, add new items at the bottom. Reorder only after a conversation with Matt.

---

## Shipped

~~**1. Persist the quiz result via AsyncStorage.**~~
Save primary dosha + score breakdown to `@lavender-glow/primary_dosha`. Welcome screen reads it and shows returning-user state. Recommendations screen uses saved dosha. Done.

~~**2. Guard the recommendations screen.**~~
If no saved dosha and no param, routes to `/quiz` with a friendly message. Hardcoded default removed. Done.

~~**3. Add an "About Thea" screen.**~~
Route `app/about.js` with photo placeholder, name, credentials, bio (draft copy), "book a session" stub, theme switcher, brand style toggle, and Instagram feed component. Linked from welcome screen. Done.

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
Expo Router static export configured. `vercel.json` added. Download CTAs (App Store / Google Play) shown on web only. `Share` button hidden on web. 480px max-width centering for desktop. Repo live at github.com/mvanderholm/lavender-glow, deployed via Vercel.

---

## Next — requires Thea's voice guide approval first

**1. Rewrite welcome screen copy in Thea's voice.**
Current copy ("Discover your dosha, check in with body and mind…") is scaffold placeholder. Replace once voice guide v0.4 is approved by Thea.

**2. Rewrite daily check-in copy in Thea's voice.**
Same constraint — wait for voice guide approval.

**3. Add the morning hunger question to the daily check-in.**
One new question: "How's your morning hunger today?" Five levels from "no appetite" to "ravenous." Persisted alongside check-in values. Gentle framing — information about digestive fire, not a judgment.

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
Current check-in key: `@lavender-glow/checkins/YYYY-MM-DD` (one entry per day).
New structure: two keyed entries per day — `@lavender-glow/checkins/YYYY-MM-DD/morning` and `.../evening`. Each entry tagged with `type: 'morning' | 'evening'` and `completedAt` timestamp.

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

**18. Revisit dosha quiz questions.**
Full review of the quiz question set with Thea. Questions should map cleanly to her understanding of how the doshas present — current set is a reasonable scaffold but may not reflect her clinical framing. She should define what physical, mental, and behavioral signals she actually uses to identify someone's prakriti.

Content dependency: Thea to review and rewrite/reorder questions. Do not change question set without her input — the quiz is the app's first clinical impression.

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
- Doshas (adapt from transcript #4 — first entry)
- Prakriti and vikriti
- Pancha mahabhutas / five elements
- Agni — digestive fire
- Ama — toxic sludge

*Tier 2 — deepening*
- The six tastes / shad rasa
- The gunas (qualitative: hot/cold, light/heavy, dry/oily)
- The three gunas (mental: sattva, rajas, tamas)
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
Rows (domains): **Lifestyle · Diet · Exercises · Herbs**

So each concept has 16 cells. Example for Agni:
- Physical / Lifestyle: morning routine practices that stoke digestive fire
- Physical / Diet: foods and eating habits that support agni
- Physical / Exercises: movement that strengthens digestive capacity
- Physical / Herbs: herbs that kindle agni
- Mental / Lifestyle: practices that maintain mental clarity (mental agni)
- Mental / Diet: how and when you consume information
- … and so on across all 16 cells

**Data structure change required** — `data/content/learn.js` entries will need a `matrix` field:
```js
matrix: {
  physical:   { lifestyle: '...', diet: '...', exercises: '...', herbs: '...' },
  mental:     { lifestyle: '...', diet: '...', exercises: '...', herbs: '...' },
  emotional:  { lifestyle: '...', diet: '...', exercises: '...', herbs: '...' },
  spiritual:  { lifestyle: '...', diet: '...', exercises: '...', herbs: '...' },
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

**10. Music / vibration daily suggestion.**
A daily song or playlist recommendation tuned to dosha and check-in state. Light version: one song link. Heavier version: Thea's curated Spotify playlists exposed per dosha/season/energetic state.

Design constraints: friend-texting-a-song tone, not clinical. Thea owns curation. Spotify link-outs fine for mark 1.

⚠️ **Open question before building:** How does Thea want to organize her playlists? By dosha, season, energetic state, or combination? Five-minute conversation that prevents a data-structure refactor later — ask before scaffolding.

~~**20. Daily Affirmations screen.**~~
Scaffold complete. `app/affirmations.js` live under You tab — single affirmation, date-seeded daily pick, "another one →" to cycle through pool. `data/content/affirmations.js` has 13 placeholder entries (4 universal + 3 per dosha); schema supports `season` and `state` fields for future vikriti routing. Currently prakriti-based — swap to vikriti once check-in signal is reliable (#19). Matt to source and expand the content bank. Done.

**11. Monday Mythbusters.**
Weekly content slot (proposed: Mondays) where Thea busts one received wellness belief. 1–2 paragraphs, her voice, on the home or recommendations screen.

Tone: recognition and relief, not correction or shame. First myth named: fat-free food (the 90s era, what it wired into a generation).

Data shape: title (the myth, plainly stated), Thea's take, practical reframe, publish date. Do not invent entries — scaffold and wait for her content.

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

---

## Navigation expansion — four new top-level sections

**13. Journey**
A personal progress view. Likely home to check-in history, dosha trends over time, and the user's evolving relationship with the practice. Content and shape TBD — requires a conversation with Thea about what "progress" looks like in ayurveda (it's not a linear score). Do not build until that framing is clear.

**14. Tools**
A curated toolkit of standalone ayurvedic practices — things the user can reach for on demand rather than as part of a daily flow. Scaffold is live with 2-column practice grid + education cards.

Confirmed sections (May 2026):

*Practices (2-column grid):*
- **Recipes** — `app/recipes.js` — placeholder. Dosha-wise meals and kitchen preparations. Content dependency: Thea to author recipes one at a time, each tagged with dosha, season, and preparation notes.
- **Herbs** — `app/herbs.js` — live with existing `data/content/herbs.js` data. Content flagged as draft, pending Thea's review of summaries and use instructions.
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

**Confirmed nav structure (May 2026):**

| Tab | What lives there |
|-----|-----------------|
| Home | Home screen — unchanged |
| Journey | TBD — requires Thea's framing on what "progress" means |
| Tools | Recipes · Herbs · Breathwork · Meditation · Self Massage · Journal · Learn · About Thea |
| Check In | Daily check-in flow (`/checkin`) |
| You | Dosha Quiz · Today's Guidance (Recommendations) · Prakriti wheel |

*Journal lives under Tools only — not a top-level tab. The former Journal tab is repurposed as "Check In", routing directly to `/checkin`. Nav restructure touches `app/_layout.js`, `components/BottomNav.js`, and `components/WebLayout.js`.*

~~**24. Rename Journal tab to Check In.**~~
Repurpose the bottom nav's Journal tab: rename it "Check In" and route it to `/checkin`. Journal remains accessible under Tools. Change touches `components/BottomNav.js`, `components/WebLayout.js`, and `app/_layout.js`. Done.

---

## Architectural work — do when needed, not preemptively

**17. Check-in history view.**
Hold until real users have at least a week of data. A simple trend of morning hunger over time is the first diagnostically interesting view. Don't over-design before the data exists.

---

## App architecture — Thea's stated framework

*From voice memo, April 2026. Thea's explicit description of how she sees the app's content organized. Not a current build target — a north star for how the recommendation engine scales.*

**The 4×4 framework:**

Four pillars: **Physical · Emotional · Mental · Spiritual**
Each pillar has four sub-domains: **Diet · Herbs · Exercise · Lifestyle**

16 cells total. Her words: *"That is really the basic of the app."*

Examples she gave:
- Physical / Diet: food combining, time of day, doshas
- Emotional / Diet: your relationship to the food while eating it — do you love it, are you present?
- Physical / Herbs: supplementing what food alone can't provide
- Physical / Exercise: rest and postures vs. sweat and movement
- Physical / Lifestyle: sleep before 10, phone down before bed, wake before 6

**What this means for architecture:**
Mark 1 recommendations are organized primarily by dosha and season. That structure fits inside this framework but doesn't fill it. When content is rich enough, the recommendation engine should route by pillar + sub-domain as well as dosha. No action now — flag it when designing any new recommendation schema or when scoping mark 2.

---

## Longer horizon — for when the center gets closer

- **Vikriti visualization driven by daily check-in.** A second color swatch alongside the Prakriti one, showing the user's current dosha state (vikriti) as derived from their check-in responses over time. The visual gap between the two swatches makes the concept of prakriti vs. vikriti tangible — you can see how far you've drifted and which direction. Requires: (a) check-in questions revised to reliably signal dosha state (#19), (b) an algorithm to compute a running vikriti estimate from check-in data, (c) enough data from real users to validate the signal. Do not build the algorithm until the question set is locked.
- Practitioner-side tools: Thea views a client's check-in history before a session.
- "Book a session with Thea" CTA wired to scheduling software, or eventually in-app.
- Account creation and cross-device sync (resist until real users ask for it).
- Content review pass by a second credentialed practitioner.
- App Store / Play Store submission (year two or when Thea is ready for public exposure).

---

## Out of scope (staying that way unless explicitly reopened)

- Monetization. The app's job is to build Thea's reputation and funnel to the center.
- Multi-practitioner content. Lavender Glow is Thea.
- AI-generated clinical content. Everything clinical comes from Thea.
