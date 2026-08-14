import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import Svg, { Path, Circle } from 'react-native-svg';
import { SEASONAL_CONTENT, LUNAR_CONTENT } from '../data/content/cycles';
import { loadDoshaResult, loadRecentCheckins, loadTodayPracticeCompletions, togglePracticeCompletion } from '../data/user/storage';
import { computeVikritiScores } from '../data/user/vikritiScoring';
import { useAuth } from '../context/AuthContext';
import { loadCheckinDimensions, refreshCheckinDimensions, loadRoutines, refreshRoutines } from '../data/content/remote';
import { routineAnchors, routines as staticRoutines } from '../data/content/routines';
import { recommendations } from '../data/content/recommendations';
import { asanas } from '../data/content/movement';
import { DoshaWheel, DOSHA_COLORS } from '../components/DoshaWheel';
import CheckinTrendChart from '../components/CheckinTrendChart';
import Header from '../components/Header';

const TABS = ['Overview', 'Ayurveda', 'Habits', 'Cycles'];

const FOCUS = ['Nourish your body', 'Calm your mind', 'Honor your pace'];

// done: false for all — buildPractices() only fills in content, never
// completion state. Real completion state now lives in Supabase's
// practice_completions table (data/user/storage.js's loadTodayPracticeCompletions/
// togglePracticeCompletion, wired below), keyed per day so it resets every
// morning rather than carrying yesterday's checks forward. Starting two of
// these pre-checked showed every user, including a brand-new one, fake
// completed progress on first load — fixed July 2026, stayed fixed now that
// completion is real persisted state instead of local-only.
//
// Stable ids for the checked-state initializer below — independent of
// whatever personalized content buildPractices() fills in, so toggling a
// checkbox never breaks when the dosha/routines data finishes loading after
// mount.
const PRACTICE_IDS = ['morning', 'move', 'meal', 'mind', 'eve'];

// Deterministic daily pick — stable on refresh, rotates each day. Same
// helper as app/today.js's "Today's Rhythm"/pillar-card picks; duplicated
// rather than shared since it's a 3-line pure function, not worth a new
// module for.
function dailyPick(arr) {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return arr[dayIndex % arr.length];
}

function pickForTime(pool, time) {
  const candidates = pool.filter(item => item.time === time);
  return candidates.length ? dailyPick(candidates) : null;
}

// Daily Practices, personalized where real content exists — pulls from the
// same authored sources already used elsewhere (Daily Rhythms routine
// items, movement.js asanas, recommendations.js foods/meditation) rather
// than inventing anything new. Falls back to the original generic line
// for any slot without dosha-specific content yet (e.g. a dosha with no
// morning routine_items authored, or before the quiz is taken at all).
function buildPractices(dosha, routinesData) {
  const rec = dosha && recommendations[dosha];
  const asanaList = dosha && asanas[dosha];
  const pool = dosha && routinesData
    ? [...(routinesData.anchors ?? []), ...(routinesData.routines[dosha] ?? [])]
    : [];
  const morningPick = pickForTime(pool, 'morning');
  const eveningPick = pickForTime(pool, 'evening');
  const asanaPick = asanaList?.length ? dailyPick(asanaList) : null;
  const foodPick = rec?.foods?.favor?.length ? dailyPick(rec.foods.favor) : null;
  const meditationLine = rec?.meditation ? rec.meditation.split('. ')[0].replace(/\.$/, '') + '.' : null;

  return [
    { id: 'morning', title: 'Morning Ritual',   desc: morningPick?.label ?? 'Warm water, oil pulling, tongue scrape', time: '10 min',                    Icon: SunIcon,    done: false },
    { id: 'move',    title: 'Movement',          desc: asanaPick?.name ?? 'Gentle flow + breath',                     time: asanaPick?.duration ?? '20 min', Icon: BreathIcon, done: false },
    { id: 'meal',    title: 'Nourishing Meal',   desc: foodPick ?? 'Breakfast — warm & grounding',                    time: 'Breakfast',                 Icon: BowlIcon,   done: false },
    { id: 'mind',    title: 'Mindful Moment',    desc: meditationLine ?? 'Seated stillness',                          time: '10 min',                    Icon: LotusIcon,  done: false },
    { id: 'eve',     title: 'Evening Wind Down', desc: eveningPick?.label ?? 'Abhyanga + early rest',                 time: '15 min',                    Icon: MoonIcon,   done: false },
  ];
}

// DRAFT — Ayurveda tab copy written in Thea's voice. Awaiting her review before treating as final.
const AYURVEDA_HISTORY = [
  {
    id: 'origin',
    label: 'The tradition',
    title: 'A science of life',
    body: 'Ayurveda has been around for somewhere between 3,000 and 5,000 years, depending on who you ask. It came out of the same Vedic tradition that gave us yoga — same roots, same time period, same intention. The two have always been used together. The idea of separating them into the movement practice and the medicine practice is a Western invention.\n\nThe word itself: ayur means life, veda means knowledge. The science of life. Not the science of not dying. Not the science of treating symptoms. The science of understanding what life actually is and how to work with it rather than against it.',
  },
  {
    id: 'texts',
    label: 'The classical texts',
    title: 'Written down, not invented',
    body: 'The foundational Ayurvedic texts — the Charaka Samhita and the Sushruta Samhita — were written somewhere around 600 to 900 BCE. But the knowledge they codified was oral tradition long before that. What strikes most people when they first encounter it: almost nothing in those texts has been disproven. The framework is that stable.\n\nWhat makes it different from how most of us learned to think about health: it does not treat disease. It treats the person who has the disease. The same fever, the same headache, the same digestive problem — the recommendation differs depending on who has it, what season it is, what the person has been eating and doing and feeling. Context is not incidental. It is the whole diagnosis.',
  },
];

const AYURVEDA_HERBS = [
  {
    id: 'intro',
    label: 'The apothecary',
    title: 'Plants as medicine',
    body: 'Herbs are where a lot of people first touch Ayurveda — usually through ashwagandha or turmeric appearing in a latte. That is not nothing. But it is about five percent of what plants actually do in this system.\n\nIn Ayurveda, every plant has qualities — heating or cooling, heavy or light, dry or oily. Those qualities interact with your constitution and your current state the same way food does. Which is why the herb that is right for one person in one season can be actively wrong for the same person in a different season. There is no universally good herb. There is no universally good anything.',
  },
  {
    id: 'sequence',
    label: 'Clear before you nourish',
    title: 'The order matters',
    body: 'Herbs in this system fall into two broad categories: herbs that clear and herbs that nourish. You do not nourish a body that has not cleared first. This is the same logic as agni and ama — you have to kindle the fire before you add more wood.\n\nThe apothecary is not a supplement store. It is a relationship with plants that is matched to you, your season, and where you are right now. Which is why we do not just hand you a list. We start with the check-in. We start with what is actually happening in your body today.',
  },
];

const DOSHA_INFO = {
  vata:  { elements: 'Air · Ether',  desc: 'Air & ether — movement, creativity' },
  pitta: { elements: 'Fire · Water', desc: 'Fire & water — focus, digestion'    },
  kapha: { elements: 'Earth · Water',desc: 'Earth & water — calm, stability'    },
};

// DRAFT — insights copy awaiting Thea's review before shipping publicly.
const INSIGHTS_DRAFT = {
  vata:  'Grounding, warm, and routine-rich practices support you now.',
  pitta: 'Cool, sweet, and calming practices support you now.',
  kapha: 'Favour light, warm, energizing foods and daily movement to feel buoyant.',
};

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function Journey() {
  const { theme: { colors: c, spacing, type } } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(PRACTICE_IDS.map(id => [id, false]))
  );
  const [doshaResult, setDoshaResult] = useState(null);
  const [vikritiScores, setVikritiScores] = useState(undefined); // undefined = loading, null = signed out or not enough data
  const [routinesData, setRoutinesData] = useState({ anchors: routineAnchors, routines: staticRoutines });
  useEffect(() => { loadDoshaResult().then(r => setDoshaResult(r || false)); }, []);
  useEffect(() => {
    if (!user) { setVikritiScores(null); return; }
    computeVikritiScores(user.id).then(setVikritiScores);
  }, [user]);
  useEffect(() => {
    loadRoutines().then(setRoutinesData);
    refreshRoutines().then(() => loadRoutines()).then(setRoutinesData);
  }, []);
  useEffect(() => {
    loadTodayPracticeCompletions().then(saved =>
      setChecked(prev => ({ ...prev, ...saved }))
    );
  }, []);

  function toggleChecked(id) {
    setChecked(prev => {
      const done = !prev[id];
      togglePracticeCompletion(id, done);
      return { ...prev, [id]: done };
    });
  }

  const practices = buildPractices(doshaResult?.dosha, routinesData);

  // Deep link from global search — see data/searchIndex.js
  useEffect(() => {
    if (tab === 'cycles') setActiveTab(TABS.indexOf('Cycles'));
  }, [tab]);

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <Header title="My Journey" left="menu" right="search" />

      {/* Tab strip */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={[styles.tabRow, { backgroundColor: 'rgba(75,62,58,0.06)' }]}>
          {TABS.map((t, i) => (
            <Pressable
              key={t}
              style={[styles.tabPill, activeTab === i && [styles.tabPillActive, { backgroundColor: c.surface, shadowColor: '#4B3E3A', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }]]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabText, { color: activeTab === i ? c.accent : c.textMedium }]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 0 && (
          <OverviewTab
            c={c} spacing={spacing} type={type}
            checked={checked} toggleChecked={toggleChecked} doneCount={doneCount}
            practices={practices}
          />
        )}
        {activeTab === 1 && <AyurvedaTab c={c} type={type} doshaResult={doshaResult} vikritiScores={vikritiScores} router={router} />}
        {activeTab === 2 && <HabitsTab c={c} type={type} />}
        {activeTab === 3 && <CyclesTab c={c} type={type} />}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Overview tab ────────────────────────────────────────────────────────────

function OverviewTab({ c, spacing, type, checked, toggleChecked, doneCount, practices }) {
  return (
    <>
      {/* Today's focus card */}
      <View style={[styles.focusCard, { backgroundColor: c.surface, ...card }]}>
        <View style={styles.focusLeft}>
          <Text style={[styles.focusLabel, { color: c.accent }]}>Today's Focus</Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            {FOCUS.map(f => (
              <View key={f} style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>+</Text>
                <Text style={{ color: c.text, fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16.5, lineHeight: 21, flex: 1 }}>{f}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.focusImg, { backgroundColor: c.surfaceAlt, overflow: 'hidden' }]}>
          <Image source={require('../assets/botanicals-warm.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        </View>
      </View>

      {/* Daily Practices */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
        <Text style={[styles.sectionH, { color: c.text }]}>Daily Practices</Text>
        <Text style={{ color: c.textMedium, fontFamily: 'Inter_500Medium', fontSize: 12.5 }}>{doneCount} of {practices.length} completed</Text>
      </View>

      <View style={[styles.track, { backgroundColor: c.border }]}>
        <View style={[styles.fill, { backgroundColor: c.accent, width: `${(doneCount / practices.length) * 100}%` }]} />
      </View>

      <View style={[styles.checkList, { backgroundColor: c.surface, ...card }]}>
        {practices.map((p, idx) => {
          const done = checked[p.id];
          return (
            <Pressable
              key={p.id}
              style={[styles.checkRow, idx < practices.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
              onPress={() => toggleChecked(p.id)}
            >
              <View style={[styles.iconCircle, { backgroundColor: c.surfaceAlt }]}>
                <p.Icon color={c.textMuted} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkTitle, { color: c.text }]}>{p.title}</Text>
                <Text style={[styles.checkDesc, { color: c.textMuted }]}>{p.desc} · {p.time}</Text>
              </View>
              <View style={[styles.checkbox, {
                backgroundColor: done ? c.accent : 'transparent',
                borderColor: done ? c.accent : 'rgba(75,62,58,0.22)',
              }]}>
                {done && <CheckIcon />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

// ── Ayurveda tab ────────────────────────────────────────────────────────────

function AyurvedaTab({ c, type, doshaResult, vikritiScores, router }) {
  const scores = doshaResult && doshaResult.scores;
  const hasResult = !!(scores && (scores.vata || scores.pitta || scores.kapha));

  let pcts = null, primaryDosha = null;
  if (hasResult) {
    const total = (scores.vata + scores.pitta + scores.kapha) || 1;
    pcts = {
      vata:  Math.round((scores.vata  / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
    };
    primaryDosha = ['vata', 'pitta', 'kapha'].reduce((a, b) => pcts[a] > pcts[b] ? a : b);
  }

  // Vikriti percentages, computed the same way as Prakriti's above, but
  // from computeVikritiScores() (data/user/vikritiScoring.js) instead of
  // the Dosha Quiz result — see that file for the scoring/coverage rules.
  const vikritiPcts = vikritiScores?.hasEnoughData ? (() => {
    const { vata, pitta, kapha } = vikritiScores.scores;
    const total = (vata + pitta + kapha) || 1;
    return {
      vata:  Math.round((vata  / total) * 100),
      pitta: Math.round((pitta / total) * 100),
      kapha: Math.round((kapha / total) * 100),
    };
  })() : null;

  return (
    <>
      {/* ── Prakriti header ── */}
      <View style={{ alignItems: 'center', marginBottom: 8, marginTop: 4 }}>
        <Text style={[styles.doshaBalanceTitle, { color: c.text }]}>Your Prakriti</Text>
        <Text style={[styles.doshaBalanceSub, { color: c.textMuted }]}>The blueprint you were born with</Text>
      </View>

      {hasResult ? (
        <>
          {/* Venn wheel with labels inside circles */}
          <DoshaWheel scores={scores} labelsInside size={220} />

          {/* Three dosha info rows */}
          {['vata', 'pitta', 'kapha'].map(d => (
            <View key={d} style={[styles.doshaRow, { backgroundColor: c.surface, ...card }]}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: DOSHA_COLORS[d], marginTop: 5 }} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text }}>{cap(d)}</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted }}>{' · '}{DOSHA_INFO[d].elements}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 2, lineHeight: 18 }}>{DOSHA_INFO[d].desc}</Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 30, color: DOSHA_COLORS[d], lineHeight: 36, marginLeft: 8 }}>{pcts[d]}%</Text>
            </View>
          ))}

          {/* Insights card — DRAFT copy awaiting Thea's review */}
          <View style={[styles.insightsCard, { backgroundColor: c.surface, ...card }]}>
            <View style={{ flex: 1 }}>
              <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>Insights</Text>
              <Text style={[type.body, { color: c.textMedium, lineHeight: 24 }]}>
                {'Your '}
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: c.text }}>{cap(primaryDosha)}</Text>
                {' is highest right now. '}
                <Text style={{ fontStyle: 'italic' }}>{INSIGHTS_DRAFT[primaryDosha]}</Text>
              </Text>
            </View>
            <View style={[styles.insightsImg, { backgroundColor: c.surfaceAlt }]}>
              <Image source={require('../assets/soaking-tub.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            </View>
          </View>

          <View style={[styles.draftNotice, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Text style={[type.label, { color: c.textMuted, marginBottom: 4 }]}>Draft</Text>
            <Text style={[type.caption, { color: c.textMuted, lineHeight: 18 }]}>
              Insights copy is awaiting Thea's review before shipping publicly.
            </Text>
          </View>
        </>
      ) : doshaResult === false ? (
        <View style={[styles.contentCard, { backgroundColor: c.surface, borderLeftColor: c.border, ...card }]}>
          <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>Your constitution</Text>
          <Text style={[type.h2, { color: c.text, marginBottom: 10 }]}>Take the dosha quiz</Text>
          <Text style={[type.muted, { lineHeight: 22, marginBottom: 16 }]}>
            Your dosha balance shows how your constitution is expressing itself right now.
          </Text>
          <Pressable style={[styles.quizBtn, { borderColor: c.accent }]} onPress={() => router.push('/quiz')}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: c.accent }}>Take the quiz</Text>
          </Pressable>
        </View>
      ) : null}

      {/* ── Vikriti — how you're expressing right now, distinct from
          Prakriti above. Aug 12 2026, Matt's ask: separate Prakriti/Vikriti
          renderings, with Prakriti as the sticky/fixed reading and Vikriti
          as the thing that moves — the "Longer horizon" design goal this
          roadmap already named. No computed Vikriti score exists for
          almost anyone yet (dosha-tagging on Vikriti's questions was at
          0/943 options as of the last check) — vikritiScores === undefined
          means still loading; a resolved result without hasEnoughData
          means real, not-yet-sufficient data, so this shows an honest
          empty state rather than a wheel built on noise. */}
      <View style={{ height: 24 }} />
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Text style={[styles.doshaBalanceTitle, { color: c.text }]}>Your Vikriti</Text>
        <Text style={[styles.doshaBalanceSub, { color: c.textMuted }]}>How you're expressing right now</Text>
      </View>

      {vikritiScores === undefined ? (
        <ActivityIndicator color={c.accent} style={{ marginVertical: 20 }} />
      ) : vikritiPcts ? (
        <>
          <DoshaWheel scores={vikritiScores.scores} labelsInside size={220} />
          {['vata', 'pitta', 'kapha'].map(d => (
            <View key={d} style={[styles.doshaRow, { backgroundColor: c.surface, ...card }]}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: DOSHA_COLORS[d], marginTop: 5 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text }}>{cap(d)}</Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 30, color: DOSHA_COLORS[d], lineHeight: 36, marginLeft: 8 }}>{vikritiPcts[d]}%</Text>
            </View>
          ))}
        </>
      ) : (
        <View style={[styles.contentCard, { backgroundColor: c.surface, borderLeftColor: c.border, ...card }]}>
          <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>Not ready yet</Text>
          <Text style={[type.h2, { color: c.text, marginBottom: 10 }]}>Your Vikriti reading is still gathering signal</Text>
          <Text style={[type.muted, { lineHeight: 22, marginBottom: vikritiScores ? 0 : 16 }]}>
            {vikritiScores
              ? "You've started the Vikriti assessment, but there isn't quite enough tagged information behind your answers yet to show a real reading — this fills in as more of the assessment gets connected to constitution data, not as you retake anything."
              : "Take the Vikriti assessment to start building this — it looks at how you're doing right now, separately from the constitution you were born with."}
          </Text>
          {!vikritiScores && (
            <Pressable style={[styles.quizBtn, { borderColor: c.accent }]} onPress={() => router.push('/vikriti')}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: c.accent }}>Take the Vikriti assessment</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* ── Alignment guidance — intentionally empty. This is real clinical
          interpretation (what it means when Vikriti differs from Prakriti,
          and how to move back toward it) and must come from Thea in her
          own words, not be invented here — see CLAUDE.md's content-
          authorship rules. Flagged on her printable checklist. */}
      <View style={[styles.draftNotice, { backgroundColor: c.surfaceAlt, borderColor: c.border, marginTop: 16 }]}>
        <Text style={[type.label, { color: c.textMuted, marginBottom: 4 }]}>Coming from Thea</Text>
        <Text style={[type.caption, { color: c.textMuted, lineHeight: 18 }]}>
          Guidance on bringing your Vikriti back into alignment with your Prakriti is being written in Thea's own words — this space is reserved for it, not filled with a placeholder.
        </Text>
      </View>

      {/* ── Existing Ayurveda history + herbs content ── */}
      <View style={{ height: 16 }} />

      <View style={{ marginBottom: 4 }}>
        <Text style={[type.label, { color: c.textMuted }]}>The tradition</Text>
        <Text style={[type.h1, { color: c.text, marginTop: 4 }]}>Ayurveda</Text>
        <Text style={[type.muted, { marginTop: 6, lineHeight: 22 }]}>
          Where it came from, how it works, and why plants matter.
        </Text>
      </View>

      {AYURVEDA_HISTORY.map(section => (
        <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.honeyAmber} />
      ))}

      <View style={{ marginTop: 8, marginBottom: 4 }}>
        <Text style={[type.label, { color: c.textMuted }]}>The apothecary</Text>
        <Text style={[type.h2, { color: c.text, marginTop: 4 }]}>Herbs in healing</Text>
      </View>

      {AYURVEDA_HERBS.map(section => (
        <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.sage} />
      ))}

      <View style={[styles.draftNotice, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
        <Text style={[type.label, { color: c.textMuted, marginBottom: 4 }]}>Draft</Text>
        <Text style={[type.caption, { color: c.textMuted, lineHeight: 18 }]}>
          This content was written in Thea's voice and is awaiting her review. It may be rewritten or reorganised before it ships publicly.
        </Text>
      </View>
    </>
  );
}

function ContentCard({ section, c, type, accentColor }) {
  return (
    <View style={[styles.contentCard, { backgroundColor: c.surface, borderLeftColor: accentColor, ...card }]}>
      <Text style={[type.label, { color: accentColor, marginBottom: 8 }]}>{section.label}</Text>
      <Text style={[type.h2, { color: c.text, marginBottom: 12 }]}>{section.title}</Text>
      <Text style={[type.body, { color: c.textMedium, lineHeight: 26 }]}>{section.body}</Text>
    </View>
  );
}

// ── Coming soon tab ──────────────────────────────────────────────────────────

// ── Cycles tab ────────────────────────────────────────────────────────────────

// DRAFT — copy in data/content/cycles.js awaiting Thea's review.
function CyclesTab({ c, type }) {
  return (
    <>
      {/* Intro */}
      <View style={{ marginBottom: 4 }}>
        <Text style={[type.label, { color: c.textMuted }]}>Seasonal & lunar</Text>
        <Text style={[type.h1, { color: c.text, marginTop: 4 }]}>Cycles</Text>
        <Text style={[type.muted, { marginTop: 6, lineHeight: 22 }]}>
          How the rhythms outside you shape the rhythms inside you.
        </Text>
      </View>

      {/* Seasonal section */}
      <View style={{ marginTop: 8, marginBottom: 4 }}>
        <Text style={[type.label, { color: c.textMuted }]}>The seasons</Text>
        <Text style={[type.h2, { color: c.text, marginTop: 4 }]}>Living with the year</Text>
      </View>

      {SEASONAL_CONTENT.map(section => (
        <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.honeyAmber} />
      ))}

      {/* Lunar section */}
      <View style={{ marginTop: 8, marginBottom: 4 }}>
        <Text style={[type.label, { color: c.textMuted }]}>The moon</Text>
        <Text style={[type.h2, { color: c.text, marginTop: 4 }]}>Lunar rhythms</Text>
      </View>

      {LUNAR_CONTENT.map(section => (
        <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.vata} />
      ))}

      {/* Draft notice */}
      <View style={[styles.draftNotice, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
        <Text style={[type.label, { color: c.textMuted, marginBottom: 4 }]}>Draft</Text>
        <Text style={[type.caption, { color: c.textMuted, lineHeight: 18 }]}>
          This content was written in Thea's voice from open classical sources. It is awaiting her review before it ships publicly.
        </Text>
      </View>
    </>
  );
}

// Roadmap #17 — held until real users had at least a week of data, per the
// original note. Built July 25 2026 once that data existed; the exact shape
// (gap-breaking, 90-day window, default dimension) was checked against a
// real early tester's actual check-in history before deciding on any of it,
// not assumed — see components/CheckinTrendChart.js's own comments.
function HabitsTab({ c, type }) {
  const [checkins, setCheckins] = useState(null); // null = loading
  const [dimensions, setDimensions] = useState(null);
  const [activeDim, setActiveDim] = useState('hunger'); // "the first diagnostically interesting view" per the original roadmap note

  useEffect(() => {
    loadRecentCheckins(90).then(list => setCheckins(list.slice().reverse())); // storage returns newest-first; the chart wants ascending
    loadCheckinDimensions().then(setDimensions);
    refreshCheckinDimensions().then(() => loadCheckinDimensions()).then(setDimensions);
  }, []);

  if (!checkins || !dimensions) {
    return <View style={{ paddingVertical: 40, alignItems: 'center' }}><ActivityIndicator color={c.accent} /></View>;
  }

  const activeMeta = dimensions.find(d => d.key === activeDim) || dimensions[0];
  const series = checkins
    .filter(ci => ci[activeDim] != null)
    .map(ci => ({ date: ci.date, value: ci[activeDim] }));

  return (
    <>
      <View style={{ marginBottom: 4 }}>
        <Text style={[type.label, { color: c.textMuted }]}>Your habits</Text>
        <Text style={[type.h1, { color: c.text, marginTop: 4 }]}>Check-in trends</Text>
        <Text style={[type.muted, { marginTop: 6, lineHeight: 22 }]}>
          How you've been showing up, one check-in at a time.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4, marginBottom: 4 }}>
        {dimensions.map(d => {
          const active = d.key === activeDim;
          return (
            <Pressable
              key={d.key}
              onPress={() => setActiveDim(d.key)}
              style={{
                paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999,
                borderWidth: 1, borderColor: active ? c.accent : c.border,
                backgroundColor: active ? c.accent : c.surface,
              }}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: active ? '#FBF9F4' : c.textMedium }}>
                {d.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.contentCard, { backgroundColor: c.surface, borderLeftColor: c.honeyAmber, ...card }]}>
        {series.length >= 3 ? (
          <>
            <Text style={[type.label, { color: c.textMuted, marginBottom: activeMeta.hint ? 2 : 10 }]}>{activeMeta.label}</Text>
            {activeMeta.hint && (
              <Text style={[type.captionSm, { color: c.textMuted, marginBottom: 10 }]}>
                1 = {activeMeta.hint.low} · 5 = {activeMeta.hint.high}
              </Text>
            )}
            <CheckinTrendChart data={series} color={c.accent} />
            <Text style={[type.caption, { color: c.textMuted, marginTop: 10, textAlign: 'center' }]}>
              {series.length} check-ins logged
            </Text>
          </>
        ) : (
          <>
            <Text style={[type.label, { color: c.textMuted, marginBottom: 8 }]}>{activeMeta.label}</Text>
            <Text style={[type.muted, { lineHeight: 22 }]}>
              Not quite enough here yet — a few more check-ins and this will start to take real shape.
            </Text>
          </>
        )}
      </View>
    </>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function SlidersIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx="8" cy="6" r="2" fill={color} />
    <Circle cx="16" cy="12" r="2" fill={color} />
    <Circle cx="10" cy="18" r="2" fill={color} />
  </Svg>;
}
function CheckIcon() {
  return <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12l5 5 9-9" stroke="#FFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function SunIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function BreathIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 8c3 0 5 3 5 3s2-3 5-3 5 3 5 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M3 14c2 0 4 2 4 2s2-2 5-2 5 2 5 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function BowlIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3C10 3 7 5 7 8h10c0-3-3-5-5-5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M7 8h10l-1.5 9H8.5L7 8Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function LotusIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={1.4} />
    <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function MoonIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  tabRow:        { flexDirection: 'row', borderRadius: 999, padding: 3, gap: 2 },
  tabPill:       { flex: 1, paddingVertical: 7, paddingHorizontal: 2, borderRadius: 999, alignItems: 'center' },
  tabPillActive: {},
  tabText:       { fontFamily: 'Inter_600SemiBold', fontSize: 11.5, letterSpacing: 0.69, textTransform: 'uppercase' },

  focusCard: { flexDirection: 'row', borderRadius: 26, overflow: 'hidden', minHeight: 130 },
  focusLeft: { flex: 1, padding: 16 },
  focusLabel:{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98, textTransform: 'uppercase' },
  focusImg:  { width: 95 },

  sectionH:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
  track:     { height: 3, borderRadius: 2 },
  fill:      { height: 3, borderRadius: 2 },

  checkList: { borderRadius: 26, overflow: 'hidden' },
  checkRow:  { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  iconCircle:{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  checkTitle:{ fontFamily: 'Inter_600SemiBold', fontSize: 15.5, lineHeight: 20 },
  checkDesc: { fontFamily: 'Inter_400Regular',  fontSize: 12.5, lineHeight: 17, marginTop: 1 },
  checkbox:  { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },

  contentCard: {
    borderRadius: 26,
    padding: 20,
    borderLeftWidth: 3,
  },
  draftNotice: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
  },

  doshaBalanceTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 28, letterSpacing: 0.2, textAlign: 'center' },
  doshaBalanceSub:   { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 14, fontStyle: 'italic', marginTop: 4, textAlign: 'center' },

  doshaRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 22, padding: 14 },

  insightsCard: { flexDirection: 'row', borderRadius: 22, padding: 16, overflow: 'hidden', minHeight: 100, gap: 12 },
  insightsImg:  { width: 80, borderRadius: 12, overflow: 'hidden' },

  quizBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999, borderWidth: 1.5 },
});
