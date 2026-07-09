# Content Review — For Thea

*Compiled July 2026. Everything below is either (a) written and just needs your yes / no / markup, or (b) empty and needs a voice memo from you. Organized so you can work through it in one sitting — mark it up however's easiest, same as the voice guide.*

**Update — a TestFlight build went out today** with everything in this doc live in the app, plus one thing worth a special look: **the redesigned dosha quiz is live.** You already approved the question set itself (the 14-question physical → physiological → psychological redesign), but this is the first time you can actually take it in the real app rather than read the questions as text — worth a run-through as a final gut-check that it feels right in practice, not just on paper. Everything else below is unchanged from when this was compiled.

**How this is organized:**
- **Section 1** — written content, ready for you to read and approve or rewrite.
- **Section 2** — gaps. Nothing's written yet; this is the list of what still needs a voice memo.
- **Section 3** — two files that quietly slipped through without ever getting flagged as drafts. Not urgent, but worth your eyes since nobody's actually signed off on them.

One note on format: a few of these are quiz results with multiple branches (guna, agni, tongue, your dosha archetypes) — I've pasted those in full here, since seeing all the variants would mean retaking the quiz over and over with different answers. Everything else that's long-form (the Learn library essays) is better read in the app itself, where it's properly typeset — I've pointed to where to find each one instead of pasting walls of text here.

---

## SECTION 1 — Ready for your read-through

### 1.1 The Learn library — 10 essays ready for approval

These already read as your voice — most are adapted directly from your voice memos. Best read in the app: **Learn tab → tap the title**. Listed here so you know what's waiting and where each one came from.

| Title | Tier | Source |
|---|---|---|
| What Is Ayurveda? | 1 | voice memo 20 (062126_01), June 2026 |
| The Five Elements | 1 | voice memo 26 (062126_07), June 2026 |
| The Doshas | 1 | voice memo, May 2026 |
| Your Constitution (Prakriti & Vikriti) | 1 | voice memo, May 2026 |
| Digestive Fire (Agni) | 1 | voice memo 21 (062126_02), June 2026 — **note:** this is a rewritten/expanded version that supersedes an April 2026 version you'd already approved. Needs a fresh look since it changed. |
| Food as Medicine | 1 | voice memo 22 (062126_03), June 2026 |
| Qualities of Matter (Gunas, qualitative) | 2 | voice memo 16 (gunas_quality_and_quiz), June 2026 |
| Qualities of Mind (Sattva/Rajas/Tamas) | 2 | voice memo 15 (gunas_mental), June 2026 |
| Cultivating Sattva | 2 | voice memos 07, 08 |
| Vital Essence (Ojas/Tejas/Prana) | 2 | voice memo 09 |

**Already approved, no action needed:** *Toxic Accumulation (Ama)* — this one's done and live.

### 1.2 Dosha quiz result screen — trait tables & archetypes

Source: `data/content/quiz.js`. Shown after someone takes the dosha quiz — the constitution summary, the "grounding" language, the physical/mental trait table, and the archetype (Wanderer / Warrior / Keeper). (This is the *result* screen. The *questions* leading up to it are the redesigned set you already approved — now live, see the update note at the top of this doc.)

**Vata — "The Wanderer"**
> Vata is the force of movement — governing breath, circulation, nerve impulses, and the flow of thought. Vata types are naturally creative, quick-minded, and enthusiastic, but can drift toward anxiety, dryness, and scattered energy when out of balance. Grounding, warmth, and regular routine are your medicine.

Traits table (build, weight, skin, eyes, hair, teeth, nails, joints, circulation, appetite, thirst, sweat, elimination, sensitivities, immunity, disease pattern — plus the mental columns: activity, endurance, sleep, dreams, memory, speech, temperament, positive/negative emotion, faith) — full table is in the file, all flagged DRAFT.

Archetype: **The Wanderer.** Balanced: creative, visionary, intuitive, sees possibilities first. Imbalanced: anxiety, overthinking, starts everything finishes nothing. Trap: *"If I think about it more, I'll finally feel safe."* Truth: *"Vata isn't looking for more information. Vata is looking for grounding."* Reminder: *"You don't need another plan. What you need is a safe place to land."*

**Pitta — "The Warrior"**
> Pitta is the force of transformation — governing digestion, metabolism, intelligence, and drive. Pitta types are naturally focused, ambitious, and articulate, but can move toward irritability, inflammation, and perfectionism when excess heat builds. Cooling down, softening effort, and embracing imperfection are your medicine.

Archetype: **The Warrior.** Balanced: driven, courageous, strategic, the one everyone relies on. Imbalanced: irritable, perfectionist, judgmental, burnout. Trap: *"If I work harder, fix more, achieve more, then I'll finally be enough."* Truth: *"Pitta isn't looking for success. Pitta is looking for peace."* Reminder: *"You were never meant to carry the whole world. Put something down."*

**Kapha — "The Keeper"**
> Kapha is the force of cohesion — governing structure, lubrication, immunity, and emotional steadiness. Kapha types are naturally patient, loving, and resilient, but can accumulate lethargy, attachment, and congestion when stagnant. Stimulation, warmth, movement, and lightness are your medicine.

Archetype: **The Keeper.** Balanced: loyal, grounded, nurturing, creates home wherever they go. Imbalanced: exhaustion from giving too much, holding on past the time to let go. Trap: *"If I keep giving, eventually someone will give back."* Truth: *"Kapha isn't looking for love. Kapha already is love."* Reminder: *"You don't have to earn your worth by carrying everyone else."*

*(Full physical/mental trait tables — build, weight, skin, appetite, sleep, memory, temperament, etc. — are long; best reviewed directly in `data/content/quiz.js` or I can paste the full tables if you'd rather not open the file.)*

### 1.3 Guna (mental constitution) quiz results

Source: `data/content/gunaQuiz.js`, from voice memo/transcript 18.

**Sattva** — *"Your mind is currently expressing more Sattva energy — the guna of clarity, wisdom, balance, and inner peace..."* Gifts: clear thinking, emotional steadiness, compassion, intuition. Watch for: spiritual perfectionism, forgetting rest/play are human too. Reflection: *"What helps me feel most like myself?"* Closing note: *"In L. Glow, Sattva is just the feeling of coming home to yourself..."*

**Rajas** — *"Your mind is currently expressing more Rajas energy — the guna of movement, passion, action, and transformation..."* Gifts: motivation, creativity, courage to initiate change. Watch for: overthinking, burnout, irritability. Reflection: *"What would happen if I stopped pushing and started listening?"* Closing note: *"Rajas is that spark that gets you moving..."*

**Tamas** — *"Your mind is currently expressing more Tamas energy — the guna of stability, rest, structure, and groundedness..."* Gifts: groundedness, loyalty, capacity for rest. Watch for: procrastination, emotional fog, staying stuck. Reflection: *"What is one step I could take to create more energy in my life today?"* Closing note: *"Tamas is like the soil — rooted beneath the flowers..."*

*(Each result also has full diet/lifestyle/spiritual practice lists — see the file for the complete text; happy to paste in full if that's easier than opening code.)*

### 1.4 Agni assessment results

Source: `data/content/agniQuiz.js`, adapted from transcript 21.

**Sama Agni** (balanced) — *"Sama means balanced — and right now, your digestive fire is in its sweet spot..."*
**Vishama Agni** (irregular, Vata-linked) — *"Vishama means irregular — and your digestive fire is being blown around right now..."*
**Tikshna Agni** (intense, Pitta-linked) — *"Tikshna means sharp or intense — and your digestive fire is burning hot right now..."*
**Manda Agni** (slow, Kapha-linked) — *"Manda means slow — and your digestive fire is burning low right now..."*

Each has a full summary, gifts, watch-for list, reflection question, path forward, and diet/lifestyle/spiritual practices — all drafted from your transcript. **One thing genuinely missing:** the `lGlowNote` closing note (the short personal line, like the ones in the guna results) is `null` for all four — that's the one piece with nothing written yet, if you want to add one.

### 1.5 Tongue check content

Source: `data/content/tongueCheck.js`, transcript 27. This one's substantial and specific — shape/size/color/coating questions, the ama-coating scale, six tongue "other signs" (cracks, scalloping, tremor, red tip, frothiness, bumps), five reading results (Vata/Pitta/Kapha/Mixed/Clear), and a tongue map (tip/middle/back/sides/center line → body zones). All of it is adapted from your recorded guidance. Also includes the disclaimer language you recorded yourself ("these are clues, not conclusions") — that part's flagged as ready to use as-is, not draft.

### 1.6 Journey tab — Ayurveda history & herb education copy

Source: `app/journey.js`. Two short pieces in the Ayurveda tab:

> **A science of life:** "Ayurveda has been around for somewhere between 3,000 and 5,000 years, depending on who you ask. It came out of the same Vedic tradition that gave us yoga..."

> **Written down, not invented:** "The foundational Ayurvedic texts — the Charaka Samhita and the Sushruta Samhita — were written somewhere around 600 to 900 BCE..."

> **Plants as medicine:** "Herbs are where a lot of people first touch Ayurveda — usually through ashwagandha or turmeric appearing in a latte..."

> **The order matters:** "Herbs in this system fall into two broad categories: herbs that clear and herbs that nourish..."

Also a short one-line "insight" per dosha shown on that tab (e.g. Vata: *"Grounding, warm, and routine-rich practices support you now."*) — these are Matt's placeholder, not yours, flagged separately as needing your voice.

### 1.7 Intake form — consent / scope-of-practice screen

Source: `app/intake.js`. The full text a new user sees and agrees to:

> Welcome. I am an ayurvedic practitioner and Registered Yoga Teacher. My work with you is rooted in the classical tradition of Ayurveda — a system of health that looks at you as a whole person, in your whole life, in this moment.
>
> I am not a medical doctor, naturopath, or licensed therapist. This practice is not a substitute for clinical care. I do not diagnose conditions, prescribe medications, or treat disease. If you have a serious health concern, please see a licensed provider.
>
> Everything you share with me is held in confidence. My notes and this intake form inform our work together and will not be shared without your explicit consent.
>
> By agreeing below, you confirm that you understand the scope of this practice and consent to working with me under these terms.

This is the legal/scope-of-practice framing users agree to before using the app — worth a careful read, and probably a lawyer's eyes eventually too, but your voice and wording come first.

### 1.8 Affirmations bank

Source: `data/content/affirmations.js` — Matt's draft (not adapted from your voice memos), sent for your markup. ~60 short lines across universal, vata, pitta, kapha, seasonal, and future check-in-state categories. A few are already flagged with your actual words pulled from transcript 19 (marked `source: transcript 19` in the file) — those are effectively pre-approved. Two lines have inline notes asking for your call on wording (`v-10`, `k-7`). Best reviewed directly in the file since it's a long flat list — let me know if you'd rather have it pasted here in full.

### 1.9 Welcome / landing page copy

Source: `app/welcome.js` — the public marketing page at `lglow.vercel.app/welcome`. Rewritten recently against the approved voice guide (fixed a line that still said "her methodology, her voice, her framework" — the exact framing your v1.0 note corrected). Still flagged `[DRAFT]` throughout — needs your line-edit pass before it's the public front door. Easiest to just look at the live page rather than read code — see delivery note at the bottom of this doc.

---

## SECTION 2 — Nothing written yet

These need a voice memo from you before anyone builds anything further. Listed so you know what's actually outstanding, not because there's anything here for you to read.

### 2.1 Asana / movement — 15 postures, 5 per dosha

Structure and pacing are built; every `description` and `benefit` field is empty. Postures already named and sequenced — just need your text for each:

- **Vata:** Child's Pose, Mountain Pose, Hero Pose, Standing Forward Fold, Corpse Pose
- **Pitta:** *(5 postures, same pattern — see `data/content/movement.js`)*
- **Kapha:** *(5 postures, same pattern)*

### 2.2 Agni quiz — final question wording

The domains are right (appetite, digestion, energy, elimination, emotional processing) but the specific wording is a structural scaffold, not your voice. Needs a rewrite pass, same treatment as the dosha quiz redesign.

### 2.3 Five empty Learn concepts

No content at all yet — these need voice memos before they can be adapted:

- **The Six Tastes** (Shad Rasa) — Tier 2
- **Daily & Seasonal Rhythms** (Dinacharya & Ritucharya) — Tier 2
- **The Seven Tissues** (Sapta Dhatus) — Tier 3
- **The Three Waste Products** (Tri Malas) — Tier 3
- **The Channel Systems** (Srotas) — Tier 3

The Tier 3 set is explicitly your call on whether it belongs in a consumer app at all, or stays practitioner-only.

### 2.4 Dosha-specific "Just for today" intentions

The universal ones are live (from the voice guide: warm water, present eating, phone down after 9pm). Vata/Pitta/Kapha-specific suggestions are empty arrays, waiting on you.

### 2.5 Dosha-specific morning/evening routine anchors

Same situation — the universal anchors (wake before 6am, phone down after 9pm, in bed before 10pm) are set from your voice memo. Dosha-specific routine items are empty.

### 2.6 Music — Spotify links

Your profile URL is in — the Spotify button on your About page is live now. Still need: one playlist per dosha (mood framing is already sketched: Vata = "slow, warm, grounding," Pitta = "cool and easy," Kapha = "something that moves you"), and an answer to the open question in the file: do you want playlists organized by dosha only, or also by season / energetic state?

---

## SECTION 3 — Flagged: slipped through without ever being marked draft

Two files have real, specific-sounding clinical content (herb dosages, food recommendation lists) that somehow never got the same `DRAFT — awaiting Thea's review` treatment everything else in this doc has. Not saying anything in them is wrong — just that nobody's actually signed off on it, and it doesn't look unapproved when someone's reading the code.

### 3.1 Herbs — mostly a non-issue, there's a bigger fix already waiting

`data/content/herbs.js` has ~10 herbs with taste/potency/use instructions (e.g. Ashwagandha: *"Mix ¼–½ tsp powder into warm milk with a little ghee and honey before bed"*). Good news: this is already superseded. You produced a complete A–Z herb + food database (`docs/LGlow_Herb_Food_Impact_Database_v2_filled.docx`, hundreds of entries, Agrimony to Yerba Santa) that's sitting ready to build (roadmap item #36) — it's just not built yet. So the real action item isn't "review herbs.js," it's "build the real database," and there are two open questions on that before it can start: should it be its own screen or live under Herbs, and should foods and herbs share one searchable database or stay separate? Worth deciding those before that gets built.

### 3.2 Food recommendations — correction, this is actually a non-issue too

`data/content/recommendations.js` has dosha-by-dosha food favor/avoid lists plus a seasonal engine (Vata/Kapha/Pitta season by month). Originally flagged this as needing your first read-through — that was wrong. Roadmap item #38 already has your approved food recommendations for all three doshas (transcripts 22–24, June 2026, Best/Good/Not Beneficial/Avoid breakdowns) sitting unloaded, waiting on the same food+herb database schema decision as the herbs database (#36). Same situation as 3.1: not a review gap, a build-sequencing one.

One piece that's genuinely separate: the *seasonal engine* in that file (which month maps to which dosha season) wasn't covered by transcripts 22–24 and might still be worth your eyes — small thing, not urgent.

---

## Getting this in front of you

- **A TestFlight build is on its way** — everything in Sections 1.1–1.8 (Learn essays, quiz results, intake copy, journey copy, affirmations) is live in it. Take the dosha quiz for real this time, open the Learn tab, run through a check-in — plus this doc for the results that branch (guna/agni/tongue/dosha archetypes) so you're not re-taking quizzes to see every variant.
- **1.9 (welcome page)** is a real live web page — easiest to just open `lglow.vercel.app/welcome` directly rather than read it as text.
- **Section 2** doesn't need reading at all — it's a "what to record next" list.
- **Section 3.2** is the one item here that's genuinely new to your radar — worth a dedicated look when you have a few minutes.

Same as the voice guide: mark up however's easiest — cross out, rewrite, or just tell Matt what to change and he'll relay it.
