import AsyncStorage from '@react-native-async-storage/async-storage';
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

const KEYS = {
  PRIMARY_DOSHA:  '@lglow/primary_dosha',
  DOSHA_SCORES:   '@lglow/dosha_scores',
  GUNA_DOMINANT:  '@lglow/guna_dominant',
  GUNA_SCORES:    '@lglow/guna_scores',
  AGNI_TYPE:      '@lglow/agni_type',
  AGNI_COUNTS:    '@lglow/agni_counts',
  CHECKIN_PREFIX: '@lglow/checkins/',
  INTENTION_PREFIX: '@lglow/intentions/',
  USER_NAME:      '@lglow/user_name',
  ONBOARDED:      '@lglow/onboarded',
};

// --- Dosha result ---

export async function saveDoshaResult(primaryDosha, scores) {
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

export async function saveGunaResult(dominant, scores) {
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

export async function saveAgniResult(agniType, counts) {
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

// --- Onboarding flag ---

export async function loadOnboarded() {
  return AsyncStorage.getItem(KEYS.ONBOARDED);
}

export async function saveOnboarded() {
  await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
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
  }, { onConflict: 'user_id,date' }));
}

export async function loadTodayIntention() {
  const key = KEYS.INTENTION_PREFIX + new Date().toISOString().slice(0, 10);
  return AsyncStorage.getItem(key);
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
      hydrateUserName(userId),
      hydrateCheckins(userId),
      hydrateIntention(userId),
    ]);
  } catch (err) {
    console.warn('Hydration from Supabase failed:', err.message);
  }
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

async function hydrateUserName(userId) {
  if (await loadUserName()) return;
  const { data } = await supabase.from('users').select('display_name').eq('id', userId).maybeSingle();
  if (data?.display_name) await AsyncStorage.setItem(KEYS.USER_NAME, data.display_name);
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
