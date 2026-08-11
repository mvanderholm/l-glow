import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from '../../config/supabase';

// AsyncStorage stays the source of truth and the only thing any load*()
// function reads from — Supabase is a best-effort write-through for signed-in
// users. If a Supabase write fails (offline, RLS misconfigured, etc.) it's
// logged and swallowed; it must never block or fail the local save.
async function currentUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// Exported so screens that manage their own AsyncStorage outside this module
// (journal.js, intake.js) can use the same best-effort dual-write pattern
// instead of duplicating the getSession/try-catch boilerplate.
export async function syncToSupabase(fn) {
  try {
    const userId = await currentUserId();
    if (!userId) return; // not signed in — local-only, same as before Supabase existed
    await fn(userId);
  } catch (err) {
    console.warn('Supabase sync failed (local save already succeeded):', err.message);
  }
}

// ── Reproductive/menstrual health question preference ──────────────────────
// Shared between the intake form's Reproductive Health section and Vikriti
// Level 3's Women's Health section — asked once, remembered everywhere after
// that. Deliberately not derived from Section 1's free-text gender identity
// field — see migration 20260726000000_reproductive_health_pref.sql for why.
// null = never asked yet (caller should show the opt-in prompt); true/false
// is their actual answer. Signed-out users get null every time — there's no
// user row to persist against, so callers fall back to asking fresh, same as
// this behaved everywhere before this shared version existed.

export async function loadReproductiveHealthPref() {
  const userId = await currentUserId();
  if (!userId) return null;
  const { data } = await supabase.from('users').select('wants_reproductive_health_questions').eq('id', userId).maybeSingle();
  return data?.wants_reproductive_health_questions ?? null;
}

export async function saveReproductiveHealthPref(value) {
  await syncToSupabase(userId => supabase.from('users').update({ wants_reproductive_health_questions: value }).eq('id', userId));
}

const KEYS = {
  PRIMARY_DOSHA:  '@lglow/primary_dosha',
  DOSHA_SCORES:   '@lglow/dosha_scores',
  GUNA_DOMINANT:  '@lglow/guna_dominant',
  GUNA_SCORES:    '@lglow/guna_scores',
  AGNI_TYPE:      '@lglow/agni_type',
  AGNI_COUNTS:    '@lglow/agni_counts',
  TONGUE_READING: '@lglow/tongue_reading',
  TONGUE_DETAILS: '@lglow/tongue_details',
  CHECKIN_PREFIX: '@lglow/checkins/',
  INTENTION_PREFIX: '@lglow/intentions/',
  USER_NAME:      '@lglow/user_name',
  FIRST_NAME:     '@lglow/first_name',
  LAST_NAME:      '@lglow/last_name',
  PHONE:          '@lglow/phone',
  ADDRESS:        '@lglow/address',
  CITY:           '@lglow/city',
  STATE:          '@lglow/state',
  ZIP:            '@lglow/zip',
  ONBOARDED:      '@lglow/onboarded',
  ONBOARDING_JOURNEY_SEEN: '@lglow/onboarding_journey_seen',
  PRAKRITI_TIER_PREFIX: '@lglow/prakriti_answers/',
  VIKRITI_TIER_PREFIX:  '@lglow/vikriti_answers/',
  PRACTICE_COMPLETIONS_PREFIX: '@lglow/practice_completions/',
};

// --- Dosha result ---

export async function saveDoshaResult(primaryDosha, scores, answers = null) {
  await AsyncStorage.multiSet([
    [KEYS.PRIMARY_DOSHA, primaryDosha],
    [KEYS.DOSHA_SCORES, JSON.stringify(scores)],
  ]);
  await syncToSupabase(userId => supabase.from('dosha_results').insert({
    user_id: userId,
    dosha: primaryDosha,
    vata_score: scores.vata,
    pitta_score: scores.pitta,
    kapha_score: scores.kapha,
    answers,
    platform: Platform.OS,
  }));
}

export async function loadDoshaResult() {
  const [[, dosha], [, scoresRaw]] = await AsyncStorage.multiGet([
    KEYS.PRIMARY_DOSHA,
    KEYS.DOSHA_SCORES,
  ]);
  if (!dosha) return null;
  return {
    dosha,
    scores: scoresRaw ? JSON.parse(scoresRaw) : null,
  };
}

// --- Guna result ---

export async function saveGunaResult(dominant, scores, answers = null) {
  await AsyncStorage.multiSet([
    [KEYS.GUNA_DOMINANT, dominant],
    [KEYS.GUNA_SCORES, JSON.stringify(scores)],
  ]);
  await syncToSupabase(userId => supabase.from('guna_results').insert({
    user_id: userId,
    dominant,
    sattva_score: scores.sattva,
    rajas_score: scores.rajas,
    tamas_score: scores.tamas,
    answers,
    platform: Platform.OS,
  }));
}

export async function loadGunaResult() {
  const [[, dominant], [, scoresRaw]] = await AsyncStorage.multiGet([
    KEYS.GUNA_DOMINANT,
    KEYS.GUNA_SCORES,
  ]);
  if (!dominant) return null;
  return {
    dominant,
    scores: scoresRaw ? JSON.parse(scoresRaw) : null,
  };
}

// --- Agni result ---

export async function saveAgniResult(agniType, counts, answers = null) {
  await AsyncStorage.multiSet([
    [KEYS.AGNI_TYPE,   agniType],
    [KEYS.AGNI_COUNTS, JSON.stringify(counts)],
  ]);
  await syncToSupabase(userId => supabase.from('agni_results').insert({
    user_id: userId,
    agni_type: agniType,
    sama_count: counts.sama ?? 0,
    vishama_count: counts.vishama ?? 0,
    tikshna_count: counts.tikshna ?? 0,
    manda_count: counts.manda ?? 0,
    answers,
    platform: Platform.OS,
  }));
}

export async function loadAgniResult() {
  const [[, agniType], [, countsRaw]] = await AsyncStorage.multiGet([
    KEYS.AGNI_TYPE,
    KEYS.AGNI_COUNTS,
  ]);
  if (!agniType) return null;
  return {
    agniType,
    counts: countsRaw ? JSON.parse(countsRaw) : null,
  };
}

// --- Tongue check result ---
// Found during a July 2026 sync audit: this self-assessment computed a
// reading and threw it away — not even saved to AsyncStorage, let alone
// synced. `details` holds the raw shape/size/color/coating signals plus the
// selected "other signs" list, so the full assessment can be reconstructed
// later, same spirit as the agni/guna/dosha result shape.

export async function saveTongueResult(reading, details) {
  await AsyncStorage.multiSet([
    [KEYS.TONGUE_READING, reading],
    [KEYS.TONGUE_DETAILS, JSON.stringify(details)],
  ]);
  await syncToSupabase(userId => supabase.from('tongue_checks').insert({
    user_id: userId,
    reading,
    shape: details.shape, size: details.size, color: details.color, coating: details.coating,
    ama_level: details.amaLevel ?? 0,
    signs: details.signs ?? [],
    platform: Platform.OS,
  }));
}

export async function loadTongueResult() {
  const [[, reading], [, detailsRaw]] = await AsyncStorage.multiGet([
    KEYS.TONGUE_READING,
    KEYS.TONGUE_DETAILS,
  ]);
  if (!reading) return null;
  return {
    reading,
    details: detailsRaw ? JSON.parse(detailsRaw) : null,
  };
}

// --- Prakriti / Vikriti tier answers ---
// Not a computed result like dosha/guna/agni/tongue above — dosha tagging on
// these questions is effectively at 0% (verified live before this was
// built), so there's nothing to score yet. This stores the raw denormalized
// Q&A for a completed tier: prompt/section/selected-label text captured at
// answer time, not just question ids, so a historical response stays
// readable even if a question is later edited or deleted in the admin
// editor. Locally, AsyncStorage keeps only the latest completion per tier
// (used for unlock-gating and "you already did this" state, same as every
// other result type); Supabase keeps full history via insert, never
// upsert, since Vikriti in particular is meant to change over time.

function prakritiTierKey(tier) {
  return KEYS.PRAKRITI_TIER_PREFIX + tier;
}
function vikritiTierKey(tier) {
  return KEYS.VIKRITI_TIER_PREFIX + tier;
}

export async function savePrakritiTierAnswers(tier, answers) {
  await AsyncStorage.setItem(prakritiTierKey(tier), JSON.stringify({ answers, completedAt: new Date().toISOString() }));
  await syncToSupabase(userId => supabase.from('prakriti_responses').insert({ user_id: userId, tier, answers, platform: Platform.OS }));
}

export async function loadPrakritiTierAnswers(tier) {
  const raw = await AsyncStorage.getItem(prakritiTierKey(tier));
  return raw ? JSON.parse(raw) : null;
}

export async function loadPrakritiProgress() {
  const tiers = ['foundation', 'level2', 'level3'];
  const pairs = await AsyncStorage.multiGet(tiers.map(prakritiTierKey));
  return Object.fromEntries(tiers.map((tier, i) => [tier, pairs[i][1] !== null]));
}

export async function saveVikritiTierAnswers(tier, answers) {
  await AsyncStorage.setItem(vikritiTierKey(tier), JSON.stringify({ answers, completedAt: new Date().toISOString() }));
  await syncToSupabase(userId => supabase.from('vikriti_responses').insert({ user_id: userId, tier, answers, platform: Platform.OS }));
}

export async function loadVikritiTierAnswers(tier) {
  const raw = await AsyncStorage.getItem(vikritiTierKey(tier));
  return raw ? JSON.parse(raw) : null;
}

export async function loadVikritiProgress() {
  const tiers = ['level1', 'level2', 'level3'];
  const pairs = await AsyncStorage.multiGet(tiers.map(vikritiTierKey));
  return Object.fromEntries(tiers.map((tier, i) => [tier, pairs[i][1] !== null]));
}

// --- Onboarding flag ---

export async function loadOnboarded() {
  return AsyncStorage.getItem(KEYS.ONBOARDED);
}

export async function saveOnboarded() {
  await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
}

// Separate from ONBOARDED above (which just means "has seen the welcome
// screen") — this flag is specifically "has seen/dismissed the full
// six-step guided journey modal," so the two don't reference each other.
export async function loadOnboardingJourneySeen() {
  return AsyncStorage.getItem(KEYS.ONBOARDING_JOURNEY_SEEN);
}

export async function saveOnboardingJourneySeen() {
  await AsyncStorage.setItem(KEYS.ONBOARDING_JOURNEY_SEEN, 'true');
}

// --- User name ---

export async function saveUserName(name) {
  const trimmed = name.trim();
  await AsyncStorage.setItem(KEYS.USER_NAME, trimmed);
  await syncToSupabase(userId => supabase.from('users')
    .update({ display_name: trimmed })
    .eq('id', userId));
}

export async function loadUserName() {
  return AsyncStorage.getItem(KEYS.USER_NAME);
}

// --- Profile fields (first/last name, phone, address) ---
// Same shape as display name above — local-first, best-effort sync to the
// users table columns added in 20260730010000_user_profile_fields.sql.

export async function saveFirstName(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.FIRST_NAME, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ first_name: trimmed }).eq('id', userId));
}
export async function loadFirstName() {
  return AsyncStorage.getItem(KEYS.FIRST_NAME);
}

export async function saveLastName(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.LAST_NAME, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ last_name: trimmed }).eq('id', userId));
}
export async function loadLastName() {
  return AsyncStorage.getItem(KEYS.LAST_NAME);
}

export async function savePhone(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.PHONE, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ phone: trimmed }).eq('id', userId));
}
export async function loadPhone() {
  return AsyncStorage.getItem(KEYS.PHONE);
}

export async function saveAddress(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.ADDRESS, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ address: trimmed }).eq('id', userId));
}
export async function loadAddress() {
  return AsyncStorage.getItem(KEYS.ADDRESS);
}

export async function saveCity(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.CITY, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ city: trimmed }).eq('id', userId));
}
export async function loadCity() {
  return AsyncStorage.getItem(KEYS.CITY);
}

export async function saveState(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.STATE, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ state: trimmed }).eq('id', userId));
}
export async function loadState() {
  return AsyncStorage.getItem(KEYS.STATE);
}

export async function saveZip(value) {
  const trimmed = value.trim();
  await AsyncStorage.setItem(KEYS.ZIP, trimmed);
  await syncToSupabase(userId => supabase.from('users').update({ zip: trimmed }).eq('id', userId));
}
export async function loadZip() {
  return AsyncStorage.getItem(KEYS.ZIP);
}

// --- Daily check-ins ---

function checkinKey(date) {
  return KEYS.CHECKIN_PREFIX + date;
}

function todayKey() {
  return checkinKey(new Date().toISOString().slice(0, 10));
}

export async function saveCheckin(values, note) {
  const entry = { values, note, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(todayKey(), JSON.stringify(entry));
  const date = new Date().toISOString().slice(0, 10);
  await syncToSupabase(userId => supabase.from('checkins').upsert({
    user_id: userId,
    date,
    physical: values.physical,
    mental: values.mental,
    emotional: values.emotional,
    hunger: values.hunger ?? null,
    tongue: values.tongue ?? null,
    note: note || null,
    saved_at: entry.savedAt,
    platform: Platform.OS,
  }, { onConflict: 'user_id,date' }));
}

export async function loadTodayCheckin() {
  const raw = await AsyncStorage.getItem(todayKey());
  return raw ? JSON.parse(raw) : null;
}

export async function loadRecentCheckins(days = 7) {
  const keys = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(checkinKey(d.toISOString().slice(0, 10)));
  }
  const pairs = await AsyncStorage.multiGet(keys);
  return pairs
    .filter(([, v]) => v !== null)
    .map(([k, v]) => ({
      date: k.replace(KEYS.CHECKIN_PREFIX, ''),
      ...JSON.parse(v),
    }));
}

// --- Daily intention ---

export async function saveIntention(text) {
  const date = new Date().toISOString().slice(0, 10);
  const key = KEYS.INTENTION_PREFIX + date;
  await AsyncStorage.setItem(key, text);
  await syncToSupabase(userId => supabase.from('intentions').upsert({
    user_id: userId,
    date,
    text,
    platform: Platform.OS,
  }, { onConflict: 'user_id,date' }));
}

export async function loadTodayIntention() {
  const key = KEYS.INTENTION_PREFIX + new Date().toISOString().slice(0, 10);
  return AsyncStorage.getItem(key);
}

// --- Daily practice completions ---
// practice_completions is a log table (user_id, practice_id, completed_at) —
// no uniqueness constraint, since it was scaffolded ahead of any feature
// using it (see roadmap #30). AsyncStorage holds one flat {practiceId: bool}
// map per day as the source of truth (same shape as a check-in day); each
// toggle mirrors to Supabase as an insert (checking on) or a delete scoped to
// today's completed_at range (checking off), so the log never accumulates
// duplicate rows for the same day's toggling back and forth.

function practiceKey(date) {
  return KEYS.PRACTICE_COMPLETIONS_PREFIX + date;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function dayRange(date) {
  const start = `${date}T00:00:00.000Z`;
  const end = new Date(new Date(start).getTime() + 86400000).toISOString();
  return { start, end };
}

export async function loadTodayPracticeCompletions() {
  const raw = await AsyncStorage.getItem(practiceKey(todayDate()));
  return raw ? JSON.parse(raw) : {};
}

export async function togglePracticeCompletion(practiceId, done) {
  const date = todayDate();
  const current = await loadTodayPracticeCompletions();
  await AsyncStorage.setItem(practiceKey(date), JSON.stringify({ ...current, [practiceId]: done }));

  await syncToSupabase(async userId => {
    const { start, end } = dayRange(date);
    if (done) {
      const { data: existing } = await supabase.from('practice_completions')
        .select('id').eq('user_id', userId).eq('practice_id', practiceId)
        .gte('completed_at', start).lt('completed_at', end).maybeSingle();
      if (!existing) {
        await supabase.from('practice_completions').insert({ user_id: userId, practice_id: practiceId });
      }
    } else {
      await supabase.from('practice_completions').delete()
        .eq('user_id', userId).eq('practice_id', practiceId)
        .gte('completed_at', start).lt('completed_at', end);
    }
  });
}

// --- Cross-device hydration ---
// Pulls existing Supabase data down to a fresh device's AsyncStorage. Only
// fills in what's missing locally — never overwrites existing local data, so
// a device with its own history is left alone and only gains what it
// genuinely doesn't have yet. Call whenever a signed-in session is confirmed
// (app boot already-logged-in, or right after a fresh sign-in).
export async function hydrateFromSupabase() {
  const userId = await currentUserId();
  if (!userId) return;
  try {
    await Promise.all([
      hydrateDoshaResult(userId),
      hydrateGunaResult(userId),
      hydrateAgniResult(userId),
      hydrateTongueResult(userId),
      hydrateUserName(userId),
      hydrateProfileFields(userId),
      hydrateCheckins(userId),
      hydrateIntention(userId),
      hydratePrakritiTiers(userId),
      hydrateVikritiTiers(userId),
      hydratePracticeCompletions(userId),
    ]);
  } catch (err) {
    console.warn('Hydration from Supabase failed:', err.message);
  }
}

async function hydratePrakritiTiers(userId) {
  await Promise.all(['foundation', 'level2', 'level3'].map(async tier => {
    if (await loadPrakritiTierAnswers(tier)) return;
    const { data } = await supabase.from('prakriti_responses')
      .select('answers, completed_at')
      .eq('user_id', userId).eq('tier', tier).order('completed_at', { ascending: false }).limit(1).maybeSingle();
    if (!data) return;
    await AsyncStorage.setItem(prakritiTierKey(tier), JSON.stringify({ answers: data.answers, completedAt: data.completed_at }));
  }));
}

async function hydrateVikritiTiers(userId) {
  await Promise.all(['level1', 'level2', 'level3'].map(async tier => {
    if (await loadVikritiTierAnswers(tier)) return;
    const { data } = await supabase.from('vikriti_responses')
      .select('answers, completed_at')
      .eq('user_id', userId).eq('tier', tier).order('completed_at', { ascending: false }).limit(1).maybeSingle();
    if (!data) return;
    await AsyncStorage.setItem(vikritiTierKey(tier), JSON.stringify({ answers: data.answers, completedAt: data.completed_at }));
  }));
}

async function hydrateDoshaResult(userId) {
  if (await loadDoshaResult()) return;
  const { data } = await supabase.from('dosha_results')
    .select('dosha, vata_score, pitta_score, kapha_score')
    .eq('user_id', userId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
  if (!data) return;
  await AsyncStorage.multiSet([
    [KEYS.PRIMARY_DOSHA, data.dosha],
    [KEYS.DOSHA_SCORES, JSON.stringify({ vata: data.vata_score, pitta: data.pitta_score, kapha: data.kapha_score })],
  ]);
}

async function hydrateGunaResult(userId) {
  if (await loadGunaResult()) return;
  const { data } = await supabase.from('guna_results')
    .select('dominant, sattva_score, rajas_score, tamas_score')
    .eq('user_id', userId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
  if (!data) return;
  await AsyncStorage.multiSet([
    [KEYS.GUNA_DOMINANT, data.dominant],
    [KEYS.GUNA_SCORES, JSON.stringify({ sattva: data.sattva_score, rajas: data.rajas_score, tamas: data.tamas_score })],
  ]);
}

async function hydrateAgniResult(userId) {
  if (await loadAgniResult()) return;
  const { data } = await supabase.from('agni_results')
    .select('agni_type, sama_count, vishama_count, tikshna_count, manda_count')
    .eq('user_id', userId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
  if (!data) return;
  await AsyncStorage.multiSet([
    [KEYS.AGNI_TYPE, data.agni_type],
    [KEYS.AGNI_COUNTS, JSON.stringify({ sama: data.sama_count, vishama: data.vishama_count, tikshna: data.tikshna_count, manda: data.manda_count })],
  ]);
}

async function hydrateTongueResult(userId) {
  if (await loadTongueResult()) return;
  const { data } = await supabase.from('tongue_checks')
    .select('reading, shape, size, color, coating, ama_level, signs')
    .eq('user_id', userId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
  if (!data) return;
  await AsyncStorage.multiSet([
    [KEYS.TONGUE_READING, data.reading],
    [KEYS.TONGUE_DETAILS, JSON.stringify({ shape: data.shape, size: data.size, color: data.color, coating: data.coating, amaLevel: data.ama_level, signs: data.signs })],
  ]);
}

async function hydrateUserName(userId) {
  if (await loadUserName()) return;
  const { data } = await supabase.from('users').select('display_name').eq('id', userId).maybeSingle();
  if (data?.display_name) await AsyncStorage.setItem(KEYS.USER_NAME, data.display_name);
}

// One combined query/write for all four profile fields rather than four
// separate hydrate functions (same "don't overwrite local" rule as
// hydrateUserName above) — they live on the same users row anyway.
async function hydrateProfileFields(userId) {
  const { data } = await supabase.from('users').select('first_name, last_name, phone, address, city, state, zip').eq('id', userId).maybeSingle();
  if (!data) return;
  const pairs = [];
  if (data.first_name && !(await loadFirstName())) pairs.push([KEYS.FIRST_NAME, data.first_name]);
  if (data.last_name && !(await loadLastName())) pairs.push([KEYS.LAST_NAME, data.last_name]);
  if (data.phone && !(await loadPhone())) pairs.push([KEYS.PHONE, data.phone]);
  if (data.address && !(await loadAddress())) pairs.push([KEYS.ADDRESS, data.address]);
  if (data.city && !(await loadCity())) pairs.push([KEYS.CITY, data.city]);
  if (data.state && !(await loadState())) pairs.push([KEYS.STATE, data.state]);
  if (data.zip && !(await loadZip())) pairs.push([KEYS.ZIP, data.zip]);
  if (pairs.length) await AsyncStorage.multiSet(pairs);
}

async function hydrateCheckins(userId) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 365);
  const { data } = await supabase.from('checkins')
    .select('date, physical, mental, emotional, hunger, tongue, note, saved_at')
    .eq('user_id', userId).gte('date', cutoff.toISOString().slice(0, 10));
  if (!data?.length) return;
  const pairs = [];
  for (const row of data) {
    const key = checkinKey(row.date);
    if (await AsyncStorage.getItem(key)) continue; // local already has this day
    pairs.push([key, JSON.stringify({
      values: { physical: row.physical, mental: row.mental, emotional: row.emotional, hunger: row.hunger, tongue: row.tongue },
      note: row.note || '',
      savedAt: row.saved_at,
    })]);
  }
  if (pairs.length) await AsyncStorage.multiSet(pairs);
}

async function hydrateIntention(userId) {
  const date = new Date().toISOString().slice(0, 10);
  if (await loadTodayIntention()) return;
  const { data } = await supabase.from('intentions').select('text').eq('user_id', userId).eq('date', date).maybeSingle();
  if (data?.text) await AsyncStorage.setItem(KEYS.INTENTION_PREFIX + date, data.text);
}

async function hydratePracticeCompletions(userId) {
  const date = todayDate();
  if (await AsyncStorage.getItem(practiceKey(date))) return;
  const { start, end } = dayRange(date);
  const { data } = await supabase.from('practice_completions')
    .select('practice_id').eq('user_id', userId)
    .gte('completed_at', start).lt('completed_at', end);
  if (!data?.length) return;
  const completions = Object.fromEntries(data.map(row => [row.practice_id, true]));
  await AsyncStorage.setItem(practiceKey(date), JSON.stringify(completions));
}

// --- One-time local→Supabase migration ---
// Someone who used the app before creating an account has local history that
// predates any Supabase account — syncToSupabase() no-ops when signed out,
// so none of it was ever pushed up. Runs once per device (tracked by a local
// flag, not per-account — the local backlog belongs to whichever account
// claims it first) on first sign-in: pushes full local history up, but only
// fills gaps, mirroring hydrateFromSupabase()'s "never overwrite" policy in
// the opposite direction. A same day/result that exists independently on
// both sides is left as-is on both — this closes the "never synced at all"
// gap, not a full two-way merge.
const MIGRATED_KEY = '@lglow/migrated_to_supabase';

export async function migrateLocalToSupabase() {
  if (await AsyncStorage.getItem(MIGRATED_KEY)) return;
  const userId = await currentUserId();
  if (!userId) return;
  try {
    await Promise.all([
      migrateDoshaResult(userId),
      migrateGunaResult(userId),
      migrateAgniResult(userId),
      migrateTongueResult(userId),
      migrateUserName(userId),
      migrateProfileFields(userId),
      migrateCheckins(userId),
      migrateIntentions(userId),
      migratePrakritiTiers(userId),
      migrateVikritiTiers(userId),
    ]);
    await AsyncStorage.setItem(MIGRATED_KEY, 'true');
  } catch (err) {
    console.warn('Migration to Supabase failed (will retry next sign-in):', err.message);
    // deliberately not setting MIGRATED_KEY — retry next sign-in
  }
}

async function migrateDoshaResult(userId) {
  const local = await loadDoshaResult();
  if (!local) return;
  const { count } = await supabase.from('dosha_results').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (count > 0) return; // Supabase already has history for this user — don't guess which is newer
  await supabase.from('dosha_results').insert({
    user_id: userId, dosha: local.dosha,
    vata_score: local.scores?.vata ?? 0, pitta_score: local.scores?.pitta ?? 0, kapha_score: local.scores?.kapha ?? 0,
    platform: Platform.OS,
  });
}

async function migrateGunaResult(userId) {
  const local = await loadGunaResult();
  if (!local) return;
  const { count } = await supabase.from('guna_results').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (count > 0) return;
  await supabase.from('guna_results').insert({
    user_id: userId, dominant: local.dominant,
    sattva_score: local.scores?.sattva ?? 0, rajas_score: local.scores?.rajas ?? 0, tamas_score: local.scores?.tamas ?? 0,
    platform: Platform.OS,
  });
}

async function migrateAgniResult(userId) {
  const local = await loadAgniResult();
  if (!local) return;
  const { count } = await supabase.from('agni_results').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (count > 0) return;
  await supabase.from('agni_results').insert({
    user_id: userId, agni_type: local.agniType,
    sama_count: local.counts?.sama ?? 0, vishama_count: local.counts?.vishama ?? 0,
    tikshna_count: local.counts?.tikshna ?? 0, manda_count: local.counts?.manda ?? 0,
    platform: Platform.OS,
  });
}

async function migrateTongueResult(userId) {
  const local = await loadTongueResult();
  if (!local) return;
  const { count } = await supabase.from('tongue_checks').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (count > 0) return;
  await supabase.from('tongue_checks').insert({
    user_id: userId, reading: local.reading,
    shape: local.details?.shape, size: local.details?.size, color: local.details?.color, coating: local.details?.coating,
    ama_level: local.details?.amaLevel ?? 0, signs: local.details?.signs ?? [],
    platform: Platform.OS,
  });
}

async function migratePrakritiTiers(userId) {
  await Promise.all(['foundation', 'level2', 'level3'].map(async tier => {
    const local = await loadPrakritiTierAnswers(tier);
    if (!local) return;
    const { count } = await supabase.from('prakriti_responses').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('tier', tier);
    if (count > 0) return; // Supabase already has history for this user+tier — don't guess which is newer
    await supabase.from('prakriti_responses').insert({ user_id: userId, tier, answers: local.answers, platform: Platform.OS });
  }));
}

async function migrateVikritiTiers(userId) {
  await Promise.all(['level1', 'level2', 'level3'].map(async tier => {
    const local = await loadVikritiTierAnswers(tier);
    if (!local) return;
    const { count } = await supabase.from('vikriti_responses').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('tier', tier);
    if (count > 0) return;
    await supabase.from('vikriti_responses').insert({ user_id: userId, tier, answers: local.answers, platform: Platform.OS });
  }));
}

async function migrateUserName(userId) {
  const local = await loadUserName();
  if (!local) return;
  const { data } = await supabase.from('users').select('display_name').eq('id', userId).maybeSingle();
  if (data?.display_name) return; // Supabase already has a name — don't overwrite
  await supabase.from('users').update({ display_name: local }).eq('id', userId);
}

async function migrateProfileFields(userId) {
  const [firstName, lastName, phone, address, city, state, zip] = await Promise.all([
    loadFirstName(), loadLastName(), loadPhone(), loadAddress(), loadCity(), loadState(), loadZip(),
  ]);
  if (!firstName && !lastName && !phone && !address && !city && !state && !zip) return;
  const { data } = await supabase.from('users').select('first_name, last_name, phone, address, city, state, zip').eq('id', userId).maybeSingle();
  const patch = {};
  if (firstName && !data?.first_name) patch.first_name = firstName;
  if (lastName && !data?.last_name) patch.last_name = lastName;
  if (phone && !data?.phone) patch.phone = phone;
  if (address && !data?.address) patch.address = address;
  if (city && !data?.city) patch.city = city;
  if (state && !data?.state) patch.state = state;
  if (zip && !data?.zip) patch.zip = zip;
  if (Object.keys(patch).length) await supabase.from('users').update(patch).eq('id', userId);
}

async function migrateCheckins(userId) {
  const allKeys = await AsyncStorage.getAllKeys();
  const checkinKeys = allKeys.filter(k => k.startsWith(KEYS.CHECKIN_PREFIX));
  if (!checkinKeys.length) return;
  const pairs = await AsyncStorage.multiGet(checkinKeys);
  const { data: existing } = await supabase.from('checkins').select('date').eq('user_id', userId);
  const existingDates = new Set((existing || []).map(r => r.date));
  const rows = [];
  for (const [key, raw] of pairs) {
    if (!raw) continue;
    const date = key.replace(KEYS.CHECKIN_PREFIX, '');
    if (existingDates.has(date)) continue; // Supabase already has this day
    const entry = JSON.parse(raw);
    rows.push({
      user_id: userId, date,
      physical: entry.values.physical, mental: entry.values.mental, emotional: entry.values.emotional,
      hunger: entry.values.hunger ?? null, tongue: entry.values.tongue ?? null,
      note: entry.note || null, saved_at: entry.savedAt,
      platform: Platform.OS,
    });
  }
  if (rows.length) await supabase.from('checkins').upsert(rows, { onConflict: 'user_id,date' });
}

async function migrateIntentions(userId) {
  const allKeys = await AsyncStorage.getAllKeys();
  const intentionKeys = allKeys.filter(k => k.startsWith(KEYS.INTENTION_PREFIX));
  if (!intentionKeys.length) return;
  const pairs = await AsyncStorage.multiGet(intentionKeys);
  const { data: existing } = await supabase.from('intentions').select('date').eq('user_id', userId);
  const existingDates = new Set((existing || []).map(r => r.date));
  const rows = [];
  for (const [key, text] of pairs) {
    if (!text) continue;
    const date = key.replace(KEYS.INTENTION_PREFIX, '');
    if (existingDates.has(date)) continue;
    rows.push({ user_id: userId, date, text, platform: Platform.OS });
  }
  if (rows.length) await supabase.from('intentions').upsert(rows, { onConflict: 'user_id,date' });
}

// --- Session summary (plain text for sharing) ---

export async function buildSessionSummary() {
  const [doshaResult, checkins] = await Promise.all([
    loadDoshaResult(),
    loadRecentCheckins(7),
  ]);

  const lines = [];
  const generated = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  lines.push('L. GLOW · Session Summary');
  lines.push(generated);
  lines.push('');

  if (doshaResult) {
    const { dosha, scores } = doshaResult;
    lines.push('CONSTITUTION');
    lines.push(`Primary dosha: ${dosha.charAt(0).toUpperCase() + dosha.slice(1)}`);
    if (scores) {
      const total = scores.vata + scores.pitta + scores.kapha || 1;
      const pct = d => Math.round((scores[d] / total) * 100);
      lines.push(`Breakdown: Vata ${pct('vata')}%  ·  Pitta ${pct('pitta')}%  ·  Kapha ${pct('kapha')}%`);
    }
    lines.push('');
  }

  if (checkins.length > 0) {
    lines.push(`RECENT CHECK-INS (last ${checkins.length} day${checkins.length > 1 ? 's' : ''})`);
    for (const c of checkins) {
      const label = new Date(c.date + 'T12:00:00').toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric',
      });
      lines.push('');
      lines.push(label);
      const { physical, mental, emotional, hunger, tongue } = c.values;
      let scoreLine = `  Physical ${physical}/5  ·  Mental ${mental}/5  ·  Emotional ${emotional}/5`;
      if (hunger != null) scoreLine += `  ·  Hunger ${hunger}/5`;
      if (tongue != null) scoreLine += `  ·  Tongue ${tongue}/5`;
      lines.push(scoreLine);
      if (c.note?.trim()) lines.push(`  Note: "${c.note.trim()}"`);
    }
  } else {
    lines.push('No check-ins recorded yet.');
  }

  lines.push('');
  lines.push('—');
  lines.push('Shared from L. Glow');

  return lines.join('\n');
}
