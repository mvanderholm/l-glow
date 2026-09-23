# Competitive analysis — The Habit Ayurveda (thehabit.net)

Source: live site review, Sept 21 2026 (Matt: "we really like this website's look, feel and feature set... how could we compete with this site"). Pulled from the public homepage, about page, and homepage funnel copy only — no account created, no paid content accessed.

**Flag this before reading further: thehabit.net is Shakti Ayurveda School's own consumer brand.** The site is run by Carly, and its navigation includes "Ayurveda Teacher Training" under a `/shakti-ayurveda-school` section, alongside an "Ayurveda Business School." Shakti School is the specific training program CLAUDE.md already names as off-limits for content reproduction ("Reproduce content from any practitioner training program, including ones Thea attended (Shakti School etc.)... Her own voice and original writing only") — because it's Thea's own former teacher's program. This doc stays at the business-model/positioning level for that reason: nothing here describes or should be adapted from their actual lesson, worksheet, or course content, only their publicly visible funnel, feature set, and pricing/positioning. Also worth a direct conversation with Thea: the Weekly Habit Tracker just shipped (`docs/roadmap.md` #92) was built from a "My Vedic Practice" worksheet in the dev brief — given the name overlap with "The Habit," it's worth her confirming that worksheet is her own original material and not something descending from Shakti School's own curriculum.

This doc is reference material, not a build spec — nothing here should be adapted into L. Glow copy, features, or scoring logic without going through the usual content-authorship rules (`CLAUDE.md`). It exists so "what does that competitor do and why aren't we copying it" has a written answer.

---

## What The Habit Ayurveda actually does

**Brand.** "Rise, Shine, Rest, Repeat. Ayurveda for Modern Women." Positioned around a busy-woman audience — "life is chaotic," tools that fit "in the pockets of time available to you now." Minimalist, warm-earth-tone, nature-photography design; clean typography, generous white space. Tone blends "ancient wisdom" language with modern conversational copy — polished and on-brand, but generic in the sense that it reads as a wellness-company voice, not a specific person's voice.

**The funnel, top to bottom:**
1. **Free 5-minute dosha assessment** — the primary lead magnet, "over 570,000 unique humans" have taken it. `/quiz`.
2. **Free class** — "Your Life Through the Lens of Ayurveda," a workshop hosted on Thrivecart (a course/webinar sales platform, not custom-built).
3. **Newsletter** — "over 120,000 journeys started here."
4. **10-Day Panchakarma Cleanse** — marketed explicitly as "flush out toxic cravings, shed weight, clarify your mind." Restriction/weight-loss framing, not visible pricing.
5. **Practical Ayurveda Membership** — "hundreds of easy-to-follow lessons" spanning Ayurveda, yoga, and Buddhist teachings. No price shown anywhere on the public site — pricing is revealed later in the funnel, a standard scale-marketing tactic.
6. **Shakti Ayurveda School (teacher training) + Ayurveda Business School + Rooted Business Program + a podcast (ABPOD)** — a second, parallel business line selling *becoming* a practitioner/entrepreneur, not just receiving care.

**Business model, in one line:** volume-first. Everything is built to grow an email list at massive scale (570K quiz takers, 120K subscribers) and monetize it through tiered content products plus a practitioner-training pipeline. It is a media/education company with an Ayurveda subject, not a single practitioner's practice made into software.

---

## Side-by-side

| | **The Habit Ayurveda** | **L. Glow** |
|---|---|---|
| Core model | One founder scaling a content/course business to hundreds of thousands of leads | One credentialed practitioner's actual practice, in app form, funneling to a future physical center |
| Practitioner presence | Founder-branded but content is produced at course/lesson volume — not a 1:1 relationship product | Every screen gated on "would Thea say this?" — the entire app *is* her voice |
| Assessment | Free 5-minute quiz, framed as top-of-funnel lead capture (570K+ takers) | Free dosha/prakriti/vikriti/agni/guna/tongue assessments, framed as clinical starting points, not lead-gen |
| Post-assessment path | Implied email nurture sequence into paid membership/cleanse/training upsells | Assessments checklist modal ("what's left") → in-app guidance; no email nurture sequence built yet |
| Cleanse offering | 10-Day Panchakarma Cleanse — "shed weight," "flush toxic cravings" | 15-Day Cleanse — "designed to be gentle, because no one should suffer," no weight-loss language, real safety gate |
| Pricing | Opaque — no price shown until deep in the funnel | Transparent, low-cost ($1.99–$2.99/mo per current plan) — visible up front |
| Content scale | "Hundreds of lessons" — breadth-first | Curated, tiered Learn content — depth-first, all one author |
| Second business line | Teacher training + business coaching for other aspiring practitioners | Explicitly out of scope — "Multi-practitioner content. L. Glow is Thea." |
| Community/social proof | Large public numbers (570K, 120K) used as trust signal | No public numbers strategy yet; trust signal is the practitioner relationship itself |
| Physical-world tie-in | None visible — appears to be a fully digital business | Explicit 3–5 year plan to open a physical ayurvedic healing center, with Thea as head practitioner |

---

## Worth reacting to

**The free-assessment-as-funnel-entry mechanic works and L. Glow already half has it.** 570K quiz-takers is proof the "take a free quiz, get a personalized read" hook is a strong front door for this category. L. Glow already has six free assessments and a checklist modal showing what's left — the piece that's genuinely missing by comparison is what happens *after* someone finishes: The Habit clearly runs an email sequence from there; L. Glow doesn't appear to yet, despite already having working transactional email infra (Resend/SMTP, confirmed live per this session's history). This is a plumbing gap, not a content one — worth a real conversation about whether a light post-assessment nurture sequence (in Thea's own voice) is worth building.

**Their pricing opacity is a tactic worth naming explicitly so it's not copied by default.** Hiding price until late in a funnel is a common scale-marketing move to maximize the number of people who invest attention before they see a number. It cuts against the "quiet app," no-pressure tone this project has deliberately chosen — worth keeping pricing visible as a considered choice, not an oversight, if this ever comes up as "should we hide the price like they do."

**The teacher-training / business-school layer is a genuinely different business, not a bigger version of the same one.** It's worth being clear-eyed that a chunk of The Habit's scale (and probably revenue) comes from selling the *dream of becoming a practitioner*, not from serving people who want care. That's a real, viable model — it's just not this one, and mixing the two would directly undercut the "L. Glow is Thea, one specific practitioner" positioning that's the actual differentiator here.

---

## Worth avoiding

**Restriction/weight-loss framing on the cleanse.** "Flush out toxic cravings, shed weight, clarify your mind" is close to exactly the language this project's own principles rule out (no food is bad, reframe restriction as discernment, weight *balancing* not weight *loss*, per this app's launch positioning). L. Glow's own 15-Day Cleanse already reads differently ("gentle... no one should suffer") — worth treating that contrast as a deliberate, statable point of difference in any marketing copy, not just an internal principle.

**Opaque pricing.** Already covered above — a scale-funnel tactic, not something to import.

**Chasing their scale numbers as a goal.** 570K quiz takers and 120K subscribers are a different kind of business's success metric. Trying to match those numbers would pull L. Glow toward becoming a broader, shallower content company — the opposite of the "narrower and deeper, on purpose" positioning that's the actual point of this app existing.

---

## Proposed guidance going forward

1. **Don't compete on content volume or audience size.** The Habit's whole model is built on scale that a single practitioner's real practice structurally can't and shouldn't match. Competing there means becoming a different, worse version of their business.
2. **Compete on depth of relationship instead** — the practitioner messaging thread, AI-personalized guidance tied to a real person's clinical framework, and eventually the physical center, are all things a course-and-lesson platform can't offer regardless of its subscriber count. Any positioning/marketing work should lean on this, not on lesson counts.
3. **Close the post-assessment follow-up gap** — a light, Thea-voiced nurture sequence after someone finishes a free assessment, using the Resend infra already live, is the one concrete funnel mechanic worth building that isn't already present.
4. **Use the cleanse's gentle framing as an explicit contrast point** in any copy that talks about what makes L. Glow's cleanse different, since the difference from a real competitor's marketing is genuine and defensible, not invented.
5. **Keep pricing transparent** as a considered trust move, not revisit it toward opacity just because a larger competitor does the opposite.
6. **Do not build a teacher-training or business-coaching line.** Out of scope, and already ruled out by this project's "L. Glow is Thea" principle — noted here only so it isn't reconsidered as "what if we did what they did" without this context.
7. **Confirm the Weekly Habit Tracker's provenance with Thea directly**, given the "My Vedic Practice" / "The Habit" name overlap — a quick sign-off, not a blocker, but worth closing out explicitly rather than assuming.
