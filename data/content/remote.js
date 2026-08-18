import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { mythbusters as staticMythbusters } from './mythbusters';
import { affirmations as staticAffirmations } from './affirmations';
import { checkinDimensions as staticCheckinDimensions } from './checkinDimensions';
import { gunaQuestions as staticGunaQuestions } from './gunaQuiz';
import { agniQuestions as staticAgniQuestions } from './agniQuiz';
import { quizQuestions as staticDoshaQuestions } from './quiz';
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
  agniQuestions:      '@lglow/content_cache/agni_questions',
  doshaQuestions:     '@lglow/content_cache/dosha_questions',
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

// Agni Assessment (`/agni-quiz`) — same flattened-columns shape as
// guna_questions, one option per agni type (sama/vishama/tikshna/manda).
function rowToAgniQuestion(row) {
  return {
    id: row.id,
    prompt: row.prompt,
    options: [
      { label: row.sama_label, agni: 'sama' },
      { label: row.vishama_label, agni: 'vishama' },
      { label: row.tikshna_label, agni: 'tikshna' },
      { label: row.manda_label, agni: 'manda' },
    ],
  };
}

export async function loadAgniQuestions() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.agniQuestions);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticAgniQuestions;
}

export async function refreshAgniQuestions() {
  try {
    const { data, error } = await supabase.from('agni_questions').select('*').order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.agniQuestions, JSON.stringify(data.map(rowToAgniQuestion)));
  } catch (err) {
    console.warn('Refresh agni questions failed (using cached/static):', err.message);
  }
}

// Standalone Dosha Quiz (`/quiz`, 14 questions) — same flattened-columns
// shape as guna_questions (each question always has exactly one option per
// dosha), plus `section` (for quiz.js's SECTION_LABELS grouping) and
// `multi_select` (skin/hair allow checking more than one option).
function rowToDoshaQuestion(row) {
  return {
    id: row.id,
    section: row.section ?? undefined,
    prompt: row.prompt,
    multiSelect: row.multi_select,
    options: [
      { label: row.vata_label, dosha: 'vata' },
      { label: row.pitta_label, dosha: 'pitta' },
      { label: row.kapha_label, dosha: 'kapha' },
    ],
  };
}

export async function loadDoshaQuestions() {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.doshaQuestions);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to static */ }
  }
  return staticDoshaQuestions;
}

export async function refreshDoshaQuestions() {
  try {
    const { data, error } = await supabase.from('dosha_questions').select('*').order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(CACHE_KEYS.doshaQuestions, JSON.stringify(data.map(rowToDoshaQuestion)));
  } catch (err) {
    console.warn('Refresh dosha questions failed (using cached/static):', err.message);
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

// Aug 17 2026: playlists is now a real list, not a fixed dosha-keyed object
// (see the Sound Library migration) — rows pass through as-is, ordered so
// pickTodaysPlaylist()'s daily rotation is stable across a refresh.
function rowsToPlaylists(rows) {
  return rows
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(row => ({ id: row.id, category: row.category, name: row.name, url: row.url, mood: row.mood, dosha: row.dosha ?? [] }));
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

// Prakriti and Vikriti constitution questions — parameterized by tier,
// unlike every other type above which loads one whole table. Split into
// two fully separate tables/loader pairs July 20 2026 (were one shared
// constitution_questions table filtered by an `assessment` column; Matt
// wants Prakriti and Vikriti fully independent now, not just
// organizationally distinct). No static-file fallback yet: there's no
// consumer screen reading this data yet (no quiz UI built for it), so
// there's nothing that needs to survive being offline on first launch.
// Add a static fallback file when the first real quiz screen for one of
// these tiers gets built, mirroring the other content types — and treat
// that as two separate builds (Prakriti flow, Vikriti flow), not one
// combined assessment screen, per the same split.
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

export async function loadPrakritiQuestions(tier) {
  const cached = await AsyncStorage.getItem(`@lglow/content_cache/prakriti_questions/${tier}`);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to empty */ }
  }
  return [];
}

export async function refreshPrakritiQuestions(tier) {
  try {
    const { data, error } = await supabase
      .from('prakriti_questions')
      .select('*')
      .eq('tier', tier)
      .order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(`@lglow/content_cache/prakriti_questions/${tier}`, JSON.stringify(data.map(rowToConstitutionQuestion)));
  } catch (err) {
    console.warn(`Refresh prakriti questions (${tier}) failed (using cached):`, err.message);
  }
}

export async function loadVikritiQuestions(tier) {
  const cached = await AsyncStorage.getItem(`@lglow/content_cache/vikriti_questions/${tier}`);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through to empty */ }
  }
  return [];
}

export async function refreshVikritiQuestions(tier) {
  try {
    const { data, error } = await supabase
      .from('vikriti_questions')
      .select('*')
      .eq('tier', tier)
      .order('sort_order', { ascending: true });
    if (error || !data) return;
    await AsyncStorage.setItem(`@lglow/content_cache/vikriti_questions/${tier}`, JSON.stringify(data.map(rowToConstitutionQuestion)));
  } catch (err) {
    console.warn(`Refresh vikriti questions (${tier}) failed (using cached):`, err.message);
  }
}
