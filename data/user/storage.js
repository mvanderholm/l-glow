import AsyncStorage from '@react-native-async-storage/async-storage';

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
  await AsyncStorage.setItem(KEYS.USER_NAME, name.trim());
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
  const key = KEYS.INTENTION_PREFIX + new Date().toISOString().slice(0, 10);
  await AsyncStorage.setItem(key, text);
}

export async function loadTodayIntention() {
  const key = KEYS.INTENTION_PREFIX + new Date().toISOString().slice(0, 10);
  return AsyncStorage.getItem(key);
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
