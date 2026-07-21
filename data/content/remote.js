import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { mythbusters as staticMythbusters } from './mythbusters';
import { affirmations as staticAffirmations } from './affirmations';
import { checkinDimensions as staticCheckinDimensions } from './checkinDimensions';
import { gunaQuestions as staticGunaQuestions } from './gunaQuiz';
import { intentions as staticIntentions } from './intentions';
import { routineAnchors as staticRoutineAnchors, routines as staticRoutines } from './routines';
import { playlists as staticPlaylists } from './music';

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
  mythbusters:        '@lglow/content_cache/mythbusters',
  affirmations:       '@lglow/content_cache/affirmations',
  checkinDimensions:  '@lglow/content_cache/checkin_dimensions',
  gunaQuestions:      '@lglow/content_cache/guna_questions',
  intentions:         '@lglow/content_cache/intentions',
  routines:           '@lglow/content_cache/routines',
  playlists:          '@lglow/content_cache/playlists',
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

function rowToCheckinDimension(row) {
  const dim = { key: row.key, label: row.label, desc: row.description };
  if (row.hint_low || row.hint_high) dim.hint = { low: row.hint_low, high: row.hint_high };
  return dim;
}

export async function loadCheckinDimensions() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.checkinDimensions);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticCheckinDimensions;
}

export async function refreshCheckinDimensions() {
  try {
    const { data, error } = await supabase.from('checkin_dimensions').select('*').order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.checkinDimensions, JSON.stringify(data.map(rowToCheckinDimension)));
  } catch (err) {
    console.warn('Refresh checkin dimensions failed (using cached/static):', err.message);
  }
}

function rowToGunaQuestion(row) {
  return {
    id: row.id,
    prompt: row.prompt,
    options: [
      { label: row.sattva_label, guna: 'sattva' },
      { label: row.rajas_label, guna: 'rajas' },
      { label: row.tamas_label, guna: 'tamas' },
    ],
  };
}

export async function loadGunaQuestions() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.gunaQuestions);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticGunaQuestions;
}

export async function refreshGunaQuestions() {
  try {
    const { data, error } = await supabase.from('guna_questions').select('*').order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.gunaQuestions, JSON.stringify(data.map(rowToGunaQuestion)));
  } catch (err) {
    console.warn('Refresh guna questions failed (using cached/static):', err.message);
  }
}

// intentions and routines reshape into the same {universal/vata/pitta/kapha}
// object the static files export (rather than a flat array like the types
// above) so intentionSuggestions()/direct dosha lookups keep working
// unchanged against either source.
function rowsToIntentions(rows) {
  const grouped = { universal: [], vata: [], pitta: [], kapha: [] };
  for (const row of rows) {
    grouped[row.dosha].push({ id: row.id, text: row.text });
  }
  return grouped;
}

export async function loadIntentions() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.intentions);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticIntentions;
}

export async function refreshIntentions() {
  try {
    const { data, error } = await supabase.from('intention_suggestions').select('*').order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.intentions, JSON.stringify(rowsToIntentions(data)));
  } catch (err) {
    console.warn('Refresh intentions failed (using cached/static):', err.message);
  }
}

function rowsToRoutines(rows) {
  const anchors = [];
  const routines = { vata: [], pitta: [], kapha: [] };
  for (const row of rows) {
    const item = { id: row.id, time: row.time, label: row.label };
    if (row.dosha === 'universal') anchors.push(item);
    else routines[row.dosha].push(item);
  }
  return { anchors, routines };
}

export async function loadRoutines() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.routines);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return { anchors: staticRoutineAnchors, routines: staticRoutines };
}

export async function refreshRoutines() {
  try {
    const { data, error } = await supabase.from('routine_items').select('*').order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.routines, JSON.stringify(rowsToRoutines(data)));
  } catch (err) {
    console.warn('Refresh routines failed (using cached/static):', err.message);
  }
}

function rowsToPlaylists(rows) {
  const out = {};
  for (const row of rows) {
    out[row.dosha] = { name: row.name, url: row.url, mood: row.mood };
  }
  return out;
}

export async function loadPlaylists() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.playlists);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticPlaylists;
}

export async function refreshPlaylists() {
  try {
    const { data, error } = await supabase.from('playlists').select('*');
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.playlists, JSON.stringify(rowsToPlaylists(data)));
  } catch (err) {
    console.warn('Refresh playlists failed (using cached/static):', err.message);
  }
}

// Constitution questions (Prakriti Foundation/Level 2/Level 3, Vikriti
// Level 1/2/3) — parameterized by assessment + tier, unlike every other
// type above which loads one whole table. No static-file fallback yet:
// there's no consumer screen reading this data yet (no quiz UI built for
// it), so there's nothing that needs to survive being offline on first
// launch. Add a static fallback file when the first real quiz screen for
// one of these tiers gets built, mirroring the other content types.
function rowToConstitutionQuestion(row) {
  return {
    id: row.id,
    section: row.section ?? undefined,
    prompt: row.prompt,
    options: row.options,
    sortOrder: row.sort_order,
    allowNone: row.allow_none,
    photoEnabled: row.photo_enabled,
    inputType: row.input_type,
  };
}

function constitutionCacheKey(assessment, tier) {
  return `@lglow/content_cache/constitution_questions/${assessment}_${tier}`;
}

export async function loadConstitutionQuestions(assessment, tier) {
  const cached = await AsyncStorage.getItem(constitutionCacheKey(assessment, tier));
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to empty */ }
  }
  return [];
}

export async function refreshConstitutionQuestions(assessment, tier) {
  try {
    const { data, error } = await supabase
      .from('constitution_questions')
      .select('*')
      .eq('assessment', assessment)
      .eq('tier', tier)
      .order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(constitutionCacheKey(assessment, tier), JSON.stringify(data.map(rowToConstitutionQuestion)));
  } catch (err) {
    console.warn(`Refresh constitution questions (${assessment}/${tier}) failed (using cached):`, err.message);
  }
}
