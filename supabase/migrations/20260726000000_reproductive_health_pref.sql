-- L. Glow — shared reproductive/menstrual health question preference.
--
-- Two places in the app gate content behind "does this person want
-- reproductive/menstrual health questions": the intake form's Reproductive
-- Health section, and Vikriti Level 3's Women's Health section. Both used
-- to ask fresh every time (Vikriti) or not ask at all (intake, which just
-- showed the section to everyone — see roadmap #33 build-order step 7).
--
-- Deliberately NOT derived from Section 1's free-text "gender identity"
-- field — that field answers a different question (who someone is) than
-- this one (whether this specific content is relevant to them right now),
-- and collapsing the two either misgenders people or excludes people who
-- still need the content. This is its own explicit, asked-once question.
--
-- Nullable boolean, not a plain boolean: null means "never asked yet" (show
-- the opt-in prompt), true/false is their actual answer (skip the prompt
-- everywhere else, reuse the stored answer). Lives on `users` since it's a
-- cross-feature preference, not owned by either single feature.
--
-- No new RLS policy needed — the existing "Users can update their own row"
-- policy on `public.users` already covers this column.

alter table public.users
  add column wants_reproductive_health_questions boolean;
