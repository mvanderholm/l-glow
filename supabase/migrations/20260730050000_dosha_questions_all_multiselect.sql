-- L. Glow — Dosha Quiz feedback (Matt, July 30 2026): every question should
-- allow "check all that apply," not just skin/hair. Run in the Supabase SQL
-- Editor after the prior migrations.
--
-- app/quiz.js already renders the "Check everything that fits." hint and
-- the multi-pick toggle logic generically off each question's multi_select
-- flag — no app code changes needed, just flipping the data. Static fallback
-- (data/content/quiz.js) updated to match in the same commit.

update public.dosha_questions set multi_select = true;
