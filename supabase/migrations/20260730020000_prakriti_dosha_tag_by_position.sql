-- L. Glow — bulk dosha-tag prakriti_questions per Thea's rule (July 30
-- 2026): for every question, option 1 = Vata, option 2 = Pitta, option 3 =
-- Kapha, by position. Confirmed against live data first — all 108
-- prakriti_questions rows have exactly 3 options, so this rule applies
-- cleanly and universally there. Does NOT touch vikriti_questions: that
-- table's data doesn't match this shape at all (0 of 142 rows have a
-- 3-option structure; most have 4-14 options with non-dosha meta-answers
-- like "it changes from day to day" mixed in) — a separate conversation
-- with Thea, not this migration.
--
-- Only fills in rows with NO existing tagging on any option (Matt's call —
-- 4 rows already had some tags, including a couple of clearly-corrupted
-- leftovers from before the tagging UI existed, e.g. natural-pace's first
-- option carrying dosha: [vata,vata,pitta,vata,vata,pitta,pitta,...] with
-- 30+ duplicate entries. Left alone here rather than auto-cleaned; revisit
-- those 4 rows by hand if they need fixing: followed-sentence, natural-pace,
-- room-presence (already correctly tagged, matches this exact rule),
-- childhood-role.

update public.prakriti_questions
set options = jsonb_build_array(
  jsonb_set(options->0, '{dosha}', '["vata"]'::jsonb),
  jsonb_set(options->1, '{dosha}', '["pitta"]'::jsonb),
  jsonb_set(options->2, '{dosha}', '["kapha"]'::jsonb)
)
where not exists (
  select 1
  from jsonb_array_elements(options) elem
  where jsonb_array_length(coalesce(elem->'dosha', '[]'::jsonb)) > 0
);
