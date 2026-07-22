-- L. Glow — per-question answer snapshots for dosha/guna/agni self-assessments
-- Run in the Supabase SQL Editor after all prior migrations.
--
-- Mirrors prakriti_responses/vikriti_responses: `answers` holds the
-- denormalized Q&A (question id, section if any, prompt, and the label(s)
-- selected) captured at answer time, not just a question id — so a
-- historical answer stays readable even if quiz content is later edited
-- (guna_questions is admin-editable). Nullable and no default: existing
-- rows taken before this shipped have no per-question data and never will
-- (it was discarded at quiz time, not recoverable) — the practitioner UI
-- must treat NULL here as "no detail saved for this attempt", not an error.

alter table public.dosha_results add column answers jsonb;
alter table public.guna_results  add column answers jsonb;
alter table public.agni_results  add column answers jsonb;
