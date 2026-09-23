import { supabase } from '../../config/supabase';
import { emptyHabitsGrid, emptyDailyJournal } from '../content/habitTracker';

// Weekly Habit Tracker (Sept 2026) — Supabase-only, same reasoning as
// data/user/cleanse.js and data/user/messages.js: gated behind a
// signed-in account, no useful signed-out local case.

async function currentUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// Returns an existing week row, or a fresh (unsaved) default shape —
// callers save explicitly via saveHabitWeek, same "load returns a
// default, save persists" pattern as loadTodayIntention/saveIntention.
export async function loadHabitWeek(weekOf) {
  const userId = await currentUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('habit_tracker_weeks')
    .select('*')
    .eq('user_id', userId)
    .eq('week_of', weekOf)
    .maybeSingle();
  if (error) throw error;

  if (data) return data;
  return {
    user_id: userId,
    week_of: weekOf,
    habits: emptyHabitsGrid(),
    daily_journal: emptyDailyJournal(),
    reflections: { why: '', whatsInTheWay: '', howCanIHelp: '' },
  };
}

export async function saveHabitWeek(weekOf, { habits, daily_journal, reflections }) {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to save your habit tracker.');

  const { error } = await supabase.from('habit_tracker_weeks').upsert({
    user_id: userId,
    week_of: weekOf,
    habits,
    daily_journal,
    reflections,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,week_of' });
  if (error) throw error;
}

// For a simple "look back at previous weeks" history view — newest first.
export async function loadRecentHabitWeeks(limit = 12) {
  const userId = await currentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('habit_tracker_weeks')
    .select('week_of, habits, daily_journal, reflections')
    .eq('user_id', userId)
    .order('week_of', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
