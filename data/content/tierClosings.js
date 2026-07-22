// DRAFT — Thea-voiced closing lines shown after each Prakriti/Vikriti tier,
// alongside a plain recap of the user's own answers (see buildTierRecap in
// app/prakriti-quiz.js / app/vikriti-quiz.js). Written to match
// docs/voice-guide.md's tone rules (warm, direct, no spa-speak, no
// "journey," reframe rather than diagnose) — but this is Claude's draft,
// not Thea's own words. Not approved. Flag for her review before treating
// as final copy, same as every other draft-content file in this codebase.
//
// Deliberately says nothing about dosha type or score — tagging on this
// content is still ~0% and there's no scored result yet (see roadmap #52).
// These just acknowledge the *kind* of tier just finished.

export const tierClosings = {
  prakriti: {
    foundation: "That's the broad strokes — the stuff about you that's probably been true since you were a kid. Nothing here is a verdict, just information you get to keep.",
    level2: "That one gets a little closer to the body and mind you actually showed up with. No wrong answers — you're describing the blueprint, not grading it.",
    level3: "That's the deep end. The kind of noticing a practitioner does slowly, over time — you just did it in one sitting. That's real work.",
  },
  vikriti: {
    level1: "Quick gut check, done. This isn't about who you've always been — it's a read on right now, and right now is allowed to look different from last month.",
    level2: "That's a closer look at what your body's been trying to tell you lately. Patterns aren't verdicts — they're just easier to work with once you can actually see them.",
    level3: "That's a lot of story for one sitting. Thank you for sitting with it — this is exactly the kind of context that makes the rest of this useful.",
  },
};
