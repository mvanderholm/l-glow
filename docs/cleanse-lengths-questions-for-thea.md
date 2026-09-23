# Questions for Thea — supporting cleanse lengths other than 15 days

The cleanse builder (`app/cleanse.js`, `data/content/cleanse.js`) currently supports exactly one protocol: her existing 15-day Elimination → Kitchari → Reintroduction guide. Before adding a second length (7-day, 21-day, a spring/summer version, etc.), we need her to actually design that protocol — it's not something to generate algorithmically by stretching or compressing the 15-day one. Elimination pacing, which categories get removed on which day, how long the kitchari-only phase runs, and the reintroduction order are all clinical sequencing decisions, not a mechanical scaling problem.

Bring these questions to her before starting any new-length work:

## Structure
- For a shorter cleanse (say 7 days): does the elimination phase still remove one category per day (sugar/alcohol → caffeine → dairy → gluten → meat/seafood), or does it need to combine categories to fit a shorter runway? If combined, which pairs together safely?
- Does every length still need a kitchari-only "reset" phase in the middle, or is that specific to the 15-day version? If shorter versions keep it, how many days is "long enough" to be worth doing?
- Does reintroduction always mirror elimination in reverse, one category per day — even in a compressed protocol? Or does a shorter cleanse reintroduce faster (e.g., two categories per day)?
- For a longer cleanse (21+ days): does the extra length extend the kitchari phase, add a second elimination pass, or something else?

## Season and content
- The current 15-day kitchari recipes are explicitly tuned for fall (pitta-reducing, vata-balancing). Does a different-length cleanse need its own seasonal tuning, or is the existing recipe set reusable regardless of when someone starts it?
- Do the existing 19 recipes cover a shorter/longer version, or would new recipes (and new AI prompts, in her voice/format) be needed?

## Safety gate
- Do the same six safety-gate questions (age, pregnancy/breastfeeding, diabetes, chronic condition, medication, eating-disorder history) apply unchanged to every length, or does a longer cleanse need additional questions/exclusions given the extended duration?

## Naming and selection
- What should the in-app length options actually be called, and is there a reason to expose all of them at once vs. rolling them out one at a time as she authors each?

---

Once she's answered these for a specific new length, scaffold it the same way the 15-day one was built: a new `data/content/cleanse-<length>.js` (or a `protocol` field distinguishing it within the existing file), matching prompts, and a migration-free addition to `cleanse_plans.protocol`'s allowed values (see `supabase/migrations/20260921000000_cleanse_and_habit_tracker.sql`'s check constraint, which will need updating to allow the new value).
