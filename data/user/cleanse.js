import { supabase } from '../../config/supabase';
import { RECIPES } from '../content/cleanse';
import { getRecipeContent } from '../content/cleanseRecipes';

// Ayurvedic Cleanse builder (Sept 2026) — Supabase-only, no AsyncStorage
// layer, same as data/user/messages.js: this feature is gated behind a
// signed-in account from the first screen, so there's no signed-out
// local-only case to support the way check-ins/journal have.

export async function currentUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// One active plan at a time, per user — starting a new one abandons any
// existing active plan rather than allowing two "active" rows, since the
// day-by-day flow (and the PDF) assumes a single in-progress cleanse.
export async function loadActiveCleansePlan() {
  const userId = await currentUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from('cleanse_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// safetyAnswers: { [questionId]: boolean }, matching SAFETY_QUESTIONS ids
// in data/content/cleanse.js. Only called once every "hard" question is
// false and every "acknowledge" question has been explicitly confirmed —
// see app/cleanse.js's SafetyGate step for where that check lives.
export async function startCleansePlan({ startDate, gheePreference, safetyAnswers }) {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to start a cleanse.');

  await supabase.from('cleanse_plans')
    .update({ status: 'abandoned' })
    .eq('user_id', userId)
    .eq('status', 'active');

  const { data, error } = await supabase.from('cleanse_plans').insert({
    user_id: userId,
    protocol: '15-day',
    start_date: startDate,
    ghee_preference: gheePreference,
    safety_answers: safetyAnswers,
    safety_acknowledged_at: new Date().toISOString(),
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateCleansePlanStatus(planId, status) {
  const { error } = await supabase.from('cleanse_plans').update({ status }).eq('id', planId);
  if (error) throw error;
}

// ── Reintroduction journal (days 11-15 only) ────────────────────────────

export async function loadCleanseJournalEntries(planId) {
  const { data, error } = await supabase
    .from('cleanse_journal_entries')
    .select('*')
    .eq('plan_id', planId)
    .order('day', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveCleanseJournalEntry(planId, day, fields) {
  const { error } = await supabase.from('cleanse_journal_entries').upsert({
    plan_id: planId,
    day,
    ...fields,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'plan_id,day' });
  if (error) throw error;
}

// ── Recipes — static content by default, an optional per-plan override
// once a user regenerates one via the live Edge Function path. ─────────

export async function loadRecipeOverrides(planId) {
  const { data, error } = await supabase
    .from('cleanse_recipe_overrides')
    .select('recipe_id, content, generated_at')
    .eq('plan_id', planId);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map(r => [r.recipe_id, r.content]));
}

export async function saveRecipeOverride(planId, recipeId, content) {
  const { error } = await supabase.from('cleanse_recipe_overrides').upsert({
    plan_id: planId,
    recipe_id: recipeId,
    content,
    generated_at: new Date().toISOString(),
  }, { onConflict: 'plan_id,recipe_id' });
  if (error) throw error;
}

// Merges the static draft content with any per-plan override — the
// override (if present) always wins. `overrides` is the map
// loadRecipeOverrides() returns, kept in caller state rather than
// re-fetched per recipe.
export function resolveRecipeContent(recipeId, overrides = {}) {
  return overrides[recipeId] ?? getRecipeContent(recipeId);
}

export function allRecipesForPlan(gheePreference, overrides = {}) {
  return RECIPES.map(r => ({
    ...r,
    content: resolveRecipeContent(r.id, overrides),
    gheePreference,
  }));
}
