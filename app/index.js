import { View, Text, StyleSheet, Pressable, ScrollView, Share, Platform, TextInput, Linking, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import { affirmationsForDosha } from '../data/content/affirmations';
import { routineAnchors, routines as staticRoutines } from '../data/content/routines';
import { loadDoshaResult, buildSessionSummary, loadTodayIntention, saveIntention, loadUserName, loadOnboarded, loadTodayIntentionDeclines, declineIntention } from '../data/user/storage';
import { useAuth } from '../context/AuthContext';
import { intentionSuggestions } from '../data/content/intentions';
import { appendIntentionToJournal } from './journal';
import { currentMythbuster } from '../data/content/mythbusters';
import { loadMythbusters, refreshMythbusters, loadIntentions, refreshIntentions, loadPlaylists, refreshPlaylists, loadRoutines, refreshRoutines, loadAffirmations, refreshAffirmations } from '../data/content/remote';
import { pickTodaysPlaylist } from '../data/content/music';
import OnboardingJourneyModal from '../components/OnboardingJourneyModal';
import DailyPractices from '../components/DailyPractices';
import TodaysGuidance from '../components/TodaysGuidance';
import TodayCheckIn from '../components/TodayCheckIn';
import Svg, { Path, Circle, G } from 'react-native-svg';

// Picks a starting index from an affirmation pool that changes each day but
// is stable within a day — same helper as app/affirmations.js.
function dailyStartIndex(len) {
  if (!len) return 0;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return parseInt(today, 10) % len;
}

const WEEK_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SEASONS = [
  null,'Late Winter','Late Winter','Early Spring','Spring','Spring',
  'Late Spring','Summer','Summer','Late Summer','Early Autumn','Autumn','Late Autumn',
];

function todayLabel() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  let season;
  if (m === 6 && day < 21) season = 'Late Spring';
  else if (m <= 2 || m === 12) season = 'Late Winter';
  else if (m === 3) season = 'Early Spring';
  else if (m <= 5) season = 'Spring';
  else if (m <= 8) season = 'Summer';
  else if (m === 9) season = 'Early Autumn';
  else season = 'Autumn';
  return `${WEEK_DAYS[d.getDay()]} · ${season}`;
}

export default function Home() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [savedDosha, setSavedDosha] = useState(null);
  const [userName, setUserName] = useState(null);
  const [routinesData, setRoutinesData] = useState({ anchors: routineAnchors, routines: staticRoutines });
  const scrollRef = useRef(null);

  useEffect(() => {
    loadDoshaResult().then(r => setSavedDosha(r ? r.dosha : false));
    loadOnboarded().then(flag => { if (!flag) router.replace('/welcome'); });
    loadRoutines().then(setRoutinesData);
    refreshRoutines().then(() => loadRoutines()).then(setRoutinesData);
  }, []);

  // No more anonymous "what's your name" prompt — name only shows once
  // there's an actual signed-in account. `display_name` (set via loadUserName,
  // hydrated from Supabase) wins if it's ever been set; otherwise fall back
  // to a friendly version of the email's local-part.
  useEffect(() => {
    loadUserName().then(n => {
      if (n) { setUserName(n); return; }
      if (user?.email) {
        const local = user.email.split('@')[0];
        setUserName(local.charAt(0).toUpperCase() + local.slice(1));
      } else {
        setUserName(null);
      }
    });
  }, [user]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <OnboardingJourneyModal />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header — just the mark, no hamburger/search (nav restructure,
            Move 3): the drawer's gone and Explore's own search bar replaces
            the header search icon, matching the mockup on every tab root. */}
        <View style={styles.header}>
          <LogoLockup color={c.text} />
        </View>

        {/* Greeting */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>{todayLabel()}</Text>
          <Text style={[styles.greetLine, { color: c.textMedium }]}>Good morning,</Text>
          <Text style={[type.display, { color: c.text, marginBottom: 6 }]}>{userName ?? ''}</Text>
          <Text style={[type.bodyItalic, { color: c.textMedium }]}>Let's see where you are today.</Text>
        </View>

        {/* Hero image — same shot as the Welcome screen's hero
            (assets/about-archway.jpg); Thea's favorite of the two, swapped
            in here in place of the old checkin-tea.jpg, Aug 27 2026. */}
        <View style={[styles.heroCard, { backgroundColor: c.surface, ...card }]}>
          <Image source={require('../assets/about-archway.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        {/* Inline check-in — merges checkin.js's first-question UI with
            today.js's multi-check-in dot rows (nav restructure, Move 1). */}
        <TodayCheckIn dosha={savedDosha || null} />

        {/* Daily Practices — extracted from journey.js's Overview tab so
            /journey and / share one implementation during the migration. */}
        <DailyPractices dosha={savedDosha || null} routinesData={routinesData} />

        {/* Today's Guidance — merged in from /recommendations, collapsed
            except Nourishment; the season label doubles as the "your
            blueprint" pointer into /result (nav restructure, Move 1 —
            revised to match the mockup Matt shared Aug 26 2026: dropped the
            hero image, CTA button, Getting Started card, and Begin Here
            grid, none of which appear in that design). Agni and an
            always-visible Daily Rhythms strip were cut from this screen for
            the same reason — Agni already lives on /assessments. */}
        {savedDosha && <TodaysGuidance dosha={savedDosha} onBlueprintPress={() => router.push('/result')} />}

        {savedDosha === null ? null : savedDosha ? (
          <ReturningUser dosha={savedDosha} userName={userName} colors={c} spacing={spacing} type={type} scrollRef={scrollRef} />
        ) : null}

        {/* Affirmation — real rotating logic ported from app/affirmations.js
            (nav restructure, Move 1); this card used to render a hardcoded
            string with a dead button. */}
        <AffirmationCard dosha={savedDosha || null} colors={c} type={type} spacing={spacing} />

        {/* Daily music suggestion */}
        {savedDosha && <MusicCard dosha={savedDosha} colors={c} type={type} />}

        {/* Mythbusters */}
        <MythbusterCard colors={c} type={type} />

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
          <Text style={{ color: c.accentSoft, fontSize: 15, marginBottom: 6 }}>❧</Text>
          <Text style={[styles.footerText, { color: c.textMuted }]}>It changes.</Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AffirmationCard({ dosha, colors: c, type, spacing }) {
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function build(list) {
      const built = affirmationsForDosha(dosha, { list });
      setPool(built);
      setIndex(dailyStartIndex(built.length));
    }
    loadAffirmations().then(build);
    refreshAffirmations().then(loadAffirmations).then(build);
  }, [dosha]);

  const affirmation = pool[index] ?? null;
  if (!affirmation) return null;

  return (
    <View style={[styles.affirmCard, { backgroundColor: c.surface, ...card }]}>
      <View style={[styles.affirmImage, { backgroundColor: c.surfaceAlt, overflow: 'hidden' }]}>
        <Image source={require('../assets/about-archway.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
      <View style={styles.affirmContent}>
        <Text style={[type.label, { color: c.textMuted, marginBottom: 6 }]}>Daily Affirmation</Text>
        <Text style={[styles.affirmText, { color: c.text }]}>{affirmation.text}</Text>
        {pool.length > 1 && (
          <Pressable style={{ marginTop: 12 }} onPress={() => setIndex(i => (i + 1) % pool.length)}>
            <Text style={{ color: c.accentSoft, fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>another one →</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function MusicCard({ dosha, colors: c, type }) {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    loadPlaylists().then(setPlaylists);
    refreshPlaylists().then(() => loadPlaylists()).then(setPlaylists);
  }, []);

  if (!playlists) return null;
  const playlist = pickTodaysPlaylist(dosha, playlists);
  if (!playlist) return null;

  return (
    <View style={[styles.musicCard, { backgroundColor: c.surface }]}>
      <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>Today's sound</Text>
      {playlist.name && (
        <Text style={[styles.musicName, { color: c.text }]}>{playlist.name}</Text>
      )}
      <Text style={[styles.musicMood, { color: c.textMedium }]}>{playlist.mood}</Text>
      {playlist.url ? (
        <Pressable
          style={({ pressed }) => [styles.musicBtn, { borderColor: c.border, opacity: pressed ? 0.7 : 1 }]}
          onPress={() => Linking.openURL(playlist.url)}
        >
          <Text style={[styles.musicBtnText, { color: c.textMedium }]}>Open on Spotify  ↗</Text>
        </Pressable>
      ) : (
        <Text style={[styles.musicMood, { color: c.textMuted, fontStyle: 'italic', marginTop: 6 }]}>
          Playlist coming soon.
        </Text>
      )}
    </View>
  );
}

function MythbusterCard({ colors: c, type }) {
  const [list, setList] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadMythbusters().then(setList);
    refreshMythbusters().then(() => loadMythbusters()).then(fresh => setList(fresh));
  }, []);

  if (!list) return null;
  const myth = currentMythbuster(list);

  if (myth) {
    return (
      <View style={[styles.mythCard, { backgroundColor: c.surface }]}>
        <Text style={[type.label, { color: c.textMuted, marginBottom: 10 }]}>This week · Myth</Text>
        <Text style={[styles.mythMyth, { color: c.text }]}>"{myth.myth}"</Text>
        {myth.take && (
          <Text style={[styles.mythBody, { color: c.textMedium, marginTop: 10 }]}>{myth.take}</Text>
        )}
        {myth.reframe && (
          <View style={[styles.mythReframe, { backgroundColor: c.surfaceAlt, borderLeftColor: c.accentAlt }]}>
            <Text style={[type.label, { color: c.textMuted, marginBottom: 4 }]}>The reframe</Text>
            <Text style={[styles.mythBody, { color: c.text }]}>{myth.reframe}</Text>
          </View>
        )}
        {myth.challenge && (
          // Deliberately not labeled "Challenge" — voice-guide constraint #27,
          // reads as an offering, not a task. track[] are soft tags to notice,
          // not a checklist — no tap target, no completion/streak state. Single
          // interaction routes into the existing Journal screen rather than
          // building new tracking storage. See roadmap #51 / the approved sketch.
          <View style={[styles.mythChallenge, { backgroundColor: c.honeyAmber + '14', borderColor: c.honeyAmber + '33' }]}>
            <Text style={[type.label, { color: c.honeyAmber, marginBottom: 4 }]}>Something to try</Text>
            <Text style={[styles.mythChallengeTitle, { color: c.text }]}>{myth.challenge.title}</Text>
            {myth.challenge.instructions && (
              <Text style={[styles.mythBody, { color: c.textMedium, marginTop: 6 }]}>{myth.challenge.instructions}</Text>
            )}
            {myth.challenge.track?.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={[type.label, { color: c.textMuted, fontSize: 10, marginBottom: 6 }]}>Notice this week</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {myth.challenge.track.map(item => (
                    <View key={item} style={[styles.trackTag, { backgroundColor: c.honeyAmber + '1A' }]}>
                      <Text style={[styles.trackTagText, { color: c.honeyAmber }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <Pressable
              style={{ marginTop: 14, alignSelf: 'flex-start' }}
              onPress={() => router.push({ pathname: '/journal', params: { reflect: myth.challenge.title } })}
            >
              <Text style={{ color: c.honeyAmber, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Reflect in Journal →</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.mythCard, { backgroundColor: c.surface }]}>
      <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>Mythbusters</Text>
      <Text style={[styles.mythBody, { color: c.textMedium, fontStyle: 'italic' }]}>
        Every week, Thea takes apart one wellness belief that deserves a closer look. Check back soon.
      </Text>
    </View>
  );
}

function ReturningUser({ dosha, userName, colors: c, spacing, type, scrollRef }) {
  const router = useRouter();
  const info = doshaInfo[dosha];
  const { theme: { radius } } = useTheme();
  const [intentionsData, setIntentionsData] = useState(null);
  const [declinedIds, setDeclinedIds] = useState([]);
  const suggestions = intentionsData ? intentionSuggestions(dosha, intentionsData, declinedIds) : [];
  // null = still loading from storage; once loaded, { text, suggestionId }
  // — text: '' means nothing chosen yet today. suggestionId is null for a
  // freehand-typed intention (nothing to decline/log for those).
  const [intention, setIntention] = useState(null);
  const [draft, setDraft] = useState('');
  const [journalAdded, setJournalAdded] = useState(false);

  useEffect(() => {
    loadTodayIntention().then(v => setIntention(v ?? { text: '', suggestionId: null }));
    loadTodayIntentionDeclines().then(setDeclinedIds);
  }, []);
  useEffect(() => {
    loadIntentions().then(setIntentionsData);
    refreshIntentions().then(() => loadIntentions()).then(setIntentionsData);
  }, []);

  async function choose(text, suggestionId = null) {
    const t = text.trim();
    if (!t) return;
    await saveIntention(t, suggestionId);
    setIntention({ text: t, suggestionId });
    setDraft('');
    setJournalAdded(false);
  }

  async function declineCurrent() {
    if (intention?.suggestionId) {
      await declineIntention(intention.suggestionId);
      setDeclinedIds(prev => [...prev, intention.suggestionId]);
    }
    setIntention({ text: '', suggestionId: null });
    setJournalAdded(false);
  }

  async function addToJournal() {
    if (!intention?.text) return;
    await appendIntentionToJournal(intention.text);
    setJournalAdded(true);
  }

  if (intention === null) return null;

  return (
    <View style={{ marginTop: spacing.xl, paddingTop: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }}>
      <Text style={[type.h2, { color: c.text }]}>Welcome back{userName ? `, ${userName}` : ''}</Text>
      <Text style={[type.h3, { color: info.color, marginTop: 4 }]}>{info.name}</Text>

      <View style={[{ marginTop: spacing.lg, padding: spacing.lg, backgroundColor: c.surface, borderRadius: 26, ...card }]}>
        {intention.text ? (
          <>
            <Text style={[type.label, { color: c.textMuted }]}>Just for today</Text>
            <Text style={[type.body, { color: c.text, marginTop: 8 }]}>{intention.text}</Text>
            <View style={{ flexDirection: 'row', gap: 18, marginTop: 10 }}>
              <Pressable onPress={addToJournal} disabled={journalAdded}>
                <Text style={{ color: journalAdded ? c.textMuted : c.accent, fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
                  {journalAdded ? 'Added to journal ✓' : 'Add to journal'}
                </Text>
              </Pressable>
              <Pressable onPress={declineCurrent}>
                <Text style={{ color: c.textMuted, fontSize: 12 }}>not feeling it? choose another</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={[type.label, { color: c.textMuted }]}>Just for today, I will…</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 6, marginBottom: 2 }}>Choose one, or write your own.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {suggestions.map(s => (
                <Pressable key={s.id} onPress={() => choose(s.text, s.id)}
                  style={{ backgroundColor: c.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm }}>
                  <Text style={{ color: c.accent, fontSize: 13, fontFamily: 'Inter_400Regular' }}>{s.text}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={{ marginTop: 12, padding: 10, backgroundColor: c.surfaceAlt, borderRadius: 12, color: c.text, fontSize: 14, fontFamily: 'Inter_400Regular' }}
              placeholder="write your own…"
              placeholderTextColor={c.textMuted}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => choose(draft)}
              returnKeyType="done"
              onFocus={() => setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 100)}
            />
          </>
        )}
      </View>
    </View>
  );
}


// ── Inline SVG icons ───────────────────────────────────────────────────────

function LogoLockup({ color }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, color, letterSpacing: 3, includeFontPadding: false }}>L. GL</Text>
      <LogoStar color={color} />
      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, color, letterSpacing: 3, includeFontPadding: false }}>W</Text>
    </View>
  );
}

function _starD(R) {
  const r = R * 0.30;
  const q = (r / Math.SQRT2).toFixed(3);
  return `M 0,${-R} L ${q},${-q} L ${R},0 L ${q},${q} L 0,${R} L ${-q},${q} L ${-R},0 L ${-q},${-q} Z`;
}

function LogoStar({ color, size = 14 }) {
  const R         = size / 2;
  const sw        = R * 0.22;
  const circR     = R - sw / 2;
  const innerR    = R * 0.57;
  const accentR   = R * 0.24;
  const accentGap = R * 0.14;
  const accentCY  = -(R + accentGap + accentR);
  const extraTop  = accentGap + accentR * 2;
  const svgH      = size + extraTop;
  return (
    <Svg
      width={size}
      height={svgH}
      viewBox={`${-R} ${-(R + extraTop)} ${size} ${svgH}`}
      style={{ marginTop: -(extraTop / 2) }}
    >
      <Circle cx="0" cy="0" r={circR} stroke={color} strokeWidth={sw} fill="none" />
      <Path d={_starD(innerR)} fill={color} />
      <G transform={`translate(0,${accentCY.toFixed(2)})`}>
        <Path d={_starD(accentR)} fill={color} />
      </G>
    </Svg>
  );
}



// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  greetLine: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 20,
  },

  heroCard: {
    height: 190,
    borderRadius: 26,
    marginBottom: 16,
    overflow: 'hidden',
  },

  affirmCard: {
    flexDirection: 'row',
    borderRadius: 26,
    marginBottom: 28,
    overflow: 'hidden',
    height: 128,
  },
  affirmImage: {
    width: 96,
  },
  affirmContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  affirmText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  footerText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 13.5,
    fontStyle: 'italic',
  },

  musicCard: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  musicName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 4,
  },
  musicMood: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  musicBtn: {
    marginTop: 14,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  musicBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },

  mythCard: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mythMyth: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  mythBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  mythReframe: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
  },
  mythChallenge: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  mythChallengeTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15.5,
    lineHeight: 20,
  },
  trackTag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trackTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11.5,
  },
});
