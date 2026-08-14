import { supabase } from '../../config/supabase';

// Vikriti dosha scoring — Aug 12 2026. Vikriti questions carry a per-option
// dosha tag (set via the practitioner hub's tagging pass, see
// docs/roadmap.md #52), but that pass was at 0/943 options tagged as of the
// last live check. This scoring is real, not fabricated — it just has
// almost nothing to score yet for anyone. Callers must check
// `hasEnoughData` and show an honest "not enough tagged data" state rather
// than a wheel built on mostly-untagged answers reading as more complete
// than it is.
//
// Scoring rule: full point per tagged dosha on a selected option (a blend
// option like ["vata","kapha"] contributes to both). This is the roadmap's
// own documented-but-unconfirmed recommendation for consistency with how
// multi-select already lets one answer contribute to two doshas across
// separate options — revisit once real scoring is designed with Thea,
// this is a reasonable placeholder, not a clinical decision made here.
//
// Uses each tier's most recent completion only — Vikriti is meant to
// reflect current state, not an average across every attempt ever made.

const SCORE_THRESHOLD = 10; // arbitrary floor for "enough signal to show as a real wheel" — revisit once real data volume exists to judge against

export async function computeVikritiScores(userId) {
  if (!userId) return null;

  const [{ data: responses }, { data: questions }] = await Promise.all([
    supabase.from('vikriti_responses').select('tier, answers, completed_at').eq('user_id', userId).order('completed_at', { ascending: false }),
    supabase.from('vikriti_questions').select('id, options'),
  ]);
  if (!responses?.length || !questions?.length) return null;

  const latestByTier = {};
  for (const r of responses) latestByTier[r.tier] ??= r;

  const optionsById = Object.fromEntries(questions.map(q => [q.id, q.options ?? []]));

  const scores = { vata: 0, pitta: 0, kapha: 0 };
  let taggedAnswerCount = 0;
  let totalAnswerCount = 0;

  for (const response of Object.values(latestByTier)) {
    for (const answer of response.answers ?? []) {
      if (answer.skipped || !answer.selectedLabels?.length) continue;
      totalAnswerCount++;
      const options = optionsById[answer.questionId] ?? [];
      let matchedTag = false;
      for (const label of answer.selectedLabels) {
        const option = options.find(o => o.label === label);
        if (option?.dosha?.length) {
          matchedTag = true;
          for (const d of option.dosha) if (scores[d] !== undefined) scores[d]++;
        }
      }
      if (matchedTag) taggedAnswerCount++;
    }
  }

  const total = scores.vata + scores.pitta + scores.kapha;
  return {
    scores,
    total,
    tiersCompleted: Object.keys(latestByTier).length,
    taggedAnswerCount,
    totalAnswerCount,
    hasEnoughData: total >= SCORE_THRESHOLD,
  };
}
