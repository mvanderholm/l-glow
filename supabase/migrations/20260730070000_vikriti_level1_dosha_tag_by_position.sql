-- L. Glow — bulk dosha-tag vikriti_questions' Level 1 tier ("Check Your
-- Signals") per Matt's rule, July 30 2026: for every question, option 1 =
-- Vata, option 2 = Pitta, option 3 = Kapha, option 4 = balanced/none (no
-- dosha weight — left as an empty array, same convention this app already
-- uses everywhere else for intentionally-untagged catch-all options, not a
-- placeholder value).
--
-- Scoped to Level 1 only — confirmed against live data first, same way the
-- Prakriti migration was (20260730020000). All 21 Level 1 rows have exactly
-- 4 options and none are tagged yet, so this applies cleanly. Level 2 (32
-- questions, 6-10 options each) and Level 3 (74 questions, 4-14 options,
-- mostly not 4) do NOT match this shape — a different, not-yet-specified
-- rule, left for a separate conversation. The `jsonb_array_length(options)
-- = 4` guard below is a safety net so this can never mistag a row that
-- doesn't actually have this 4-option shape, even if run again later after
-- Level 1 content changes.

update public.vikriti_questions
set options = jsonb_build_array(
  jsonb_set(options->0, '{dosha}', '["vata"]'::jsonb),
  jsonb_set(options->1, '{dosha}', '["pitta"]'::jsonb),
  jsonb_set(options->2, '{dosha}', '["kapha"]'::jsonb),
  jsonb_set(options->3, '{dosha}', '[]'::jsonb)
)
where tier = 'level1'
  and jsonb_array_length(options) = 4
  and not exists (
    select 1
    from jsonb_array_elements(options) elem
    where jsonb_array_length(coalesce(elem->'dosha', '[]'::jsonb)) > 0
  );
