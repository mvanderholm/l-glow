import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { mythbusters as staticMythbusters } from './mythbusters';
import { affirmations as staticAffirmations } from './affirmations';

// Admin-editable content — lives in Supabase so Thea can edit it live from
// the practitioner hub, but is cached to AsyncStorage so the app keeps
// working fully offline after first load. The static files in this folder
// (e.g. mythbusters.js) stay in the repo as the permanent fallback: if a
// fetch never succeeds (offline on first-ever launch), the app uses bundled
// content and is never empty. Supabase is the live override once reachable,
// not the only source of truth.
//
// Pattern for adding a new admin-editable content type: add a CACHE_KEYS
// entry, a load*() (cache-or-static, sync-feeling via AsyncStorage), and a
// refresh*() (fire-and-forget fetch + cache write). Keep the static file as
// the fallback — don't delete it when a content type moves here.

const CACHE_KEYS = {
  mythbusters:   '@lglow/content_cache/mythbusters',
  affirmations:  '@lglow/content_cache/affirmations',
};

function rowToMythbuster(row) {
  return {
    id: row.id,
    series: row.series,
    weekStart: row.week_start,
    myth: row.myth,
    take: row.take,
    reframe: row.reframe,
    doshaBreakdown: row.dosha_breakdown ?? undefined,
    appPrompt: row.app_prompt ?? undefined,
    challenge: row.challenge ?? undefined,
  };
}

export async function loadMythbusters() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.mythbusters);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticMythbusters;
}

export async function refreshMythbusters() {
  try {
    const { data, error } = await supabase.from('mythbusters').select('*').order('week_start', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.mythbusters, JSON.stringify(data.map(rowToMythbuster)));
  } catch (err) {
    console.warn('Refresh mythbusters failed (using cached/static):', err.message);
  }
}

function rowToAffirmation(row) {
  return { id: row.id, text: row.text, dosha: row.dosha, season: row.season ?? undefined, state: row.state ?? undefined };
}

export async function loadAffirmations() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.affirmations);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticAffirmations;
}

export async function refreshAffirmations() {
  try {
    const { data, error } = await supabase.from('affirmations').select('*');
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.affirmations, JSON.stringify(data.map(rowToAffirmation)));
  } catch (err) {
    console.warn('Refresh affirmations failed (using cached/static):', err.message);
  }
}
