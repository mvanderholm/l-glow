-- L. Glow — cleanup: drop the orphaned constitution_questions table.
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Found during a full live-database migration audit, Aug 10 2026 (prompted
-- by discovering intake_forms.notified_at had silently never been created
-- despite its migration existing since July 16 — worth double-checking
-- everything else after that). This table was replaced by prakriti_questions
-- and vikriti_questions on July 20, 2026
-- (20260720120000_split_constitution_questions_into_prakriti_vikriti.sql),
-- which included a `drop table public.constitution_questions;` statement —
-- but the drop apparently never actually ran, even though the CREATE/INSERT
-- statements in that same migration clearly did (prakriti_questions and
-- vikriti_questions both exist live with the correct row counts). Harmless
-- while it sat there — confirmed no app code queries this table anymore —
-- but it's dead weight in the schema, cleaned up here.

drop table public.constitution_questions;
