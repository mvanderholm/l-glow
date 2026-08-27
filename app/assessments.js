import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import {
  loadDoshaResult, loadGunaResult, loadTongueResult, loadAgniResult,
  loadPrakritiProgress, loadVikritiProgress,
} from '../data/user/storage';
import { tongueReadings } from '../data/content/tongueCheck';
import { agniResults } from '../data/content/agniQuiz';
import { gunaResults } from '../data/content/gunaQuiz';
import { DOSHA_COLORS } from '../components/DoshaWheel';
import { SECTIONS, sectionProgress, loadIntake } from './intake';
import BackButton, { smartBack } from '../components/BackButton';

// Consolidated Assessments screen (nav restructure, Move 2), rebuilt Aug 26
// 2026 to match the detailed mockup Matt shared — kicker label + big title
// + status per card, a "Six reads on one person" headline, and a progress
// bar, replacing the plainer first draft. Dosha + Prakriti collapse into
// one card (three tier rows, each with its own Retake) instead of two
// separate entries; Intake becomes a real 6th card instead of a
// separately-styled "skip the self-serve route" CTA.

const PRAKRITI_TIER_LABELS = { foundation: 'Foundation', level2: 'Level 2', level3: 'Level 3' };
const VIKRITI_TIER_LABELS  = { level1: 'Check Your Signals', level2: 'Pattern Finder', level3: 'Your Story' };

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function TierRow({ label, done, colors: c, onRetake }) {
  return (
    <View style={styles.tierRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={[styles.tierDot, { backgroundColor: done ? c.accent : c.border }]} />
        <Text style={[styles.tierLabel, { color: done ? c.text : c.textMuted }]}>{label}</Text>
      </View>
      <Pressable onPress={onRetake} hitSlop={8}>
        <Text style={[styles.retakeText, { color: c.accent }]}>Retake</Text>
      </Pressable>
    </View>
  );
}

function AssessmentCard({ kicker, title, done, subtitle, tiers, colors: c, onPress, onTierRetake }) {
  return (
    <Pressable style={[styles.card, { backgroundColor: c.surface, ...card }]} onPress={onPress}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View style={[styles.statusDot, { borderColor: done ? c.accent : c.border, backgroundColor: done ? c.accent : 'transparent' }]}>
            {done && <Text style={{ color: '#FBF9F4', fontSize: 9, fontFamily: 'Inter_700Bold' }}>✓</Text>}
          </View>
          <Text style={[styles.kicker, { color: c.textMuted }]} numberOfLines={1}>{kicker}</Text>
        </View>
        {done ? (
          <Text style={[styles.completeText, { color: c.accent }]}>Complete</Text>
        ) : (
          <View style={[styles.takePill, { backgroundColor: c.accent }]}>
            <Text style={styles.takePillText}>Take</Text>
          </View>
        )}
      </View>

      <Text style={[styles.cardTitle, { color: c.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.cardSubtitle, { color: c.textMuted }]}>{subtitle}</Text>}

      {tiers && (
        <View style={[styles.tiersWrap, { borderTopColor: c.border }]}>
          {tiers.map(t => (
            <TierRow key={t.key} label={t.label} done={t.done} colors={c} onRetake={() => onTierRetake(t.key)} />
          ))}
        </View>
      )}
    </Pressable>
  );
}

export default function Assessments() {
  const { theme: { colors: c, spacing } } = useTheme();
  const router = useRouter();

  const [doshaResult, setDoshaResult] = useState(null);
  const [prakritiProgress, setPrakritiProgress] = useState(null);
  const [vikritiProgress, setVikritiProgress] = useState(null);
  const [agniResult, setAgniResult] = useState(null);
  const [gunaResult, setGunaResult] = useState(null);
  const [tongueResult, setTongueResult] = useState(null);
  const [intake, setIntake] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      loadDoshaResult().then(r => setDoshaResult(r || false)),
      loadPrakritiProgress().then(setPrakritiProgress),
      loadVikritiProgress().then(setVikritiProgress),
      loadAgniResult().then(r => setAgniResult(r || false)),
      loadGunaResult().then(r => setGunaResult(r || false)),
      loadTongueResult().then(r => setTongueResult(r || false)),
      loadIntake().then(setIntake),
    ]).then(() => setReady(true));
  }, []);

  if (!ready) {
    return <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }} />;
  }

  const intakeFilled = intake ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intake)?.filled || 0), 0) : 0;
  const intakeTotal  = intake ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intake)?.total  || 0), 0) : 0;
  const intakeDone = intakeTotal > 0 && intakeFilled === intakeTotal;
  const intakeSubtitle = !intakeTotal || intakeFilled === 0 ? 'Not started'
    : intakeDone ? 'Complete · shared with Thea'
    : `${Math.round((intakeFilled / intakeTotal) * 100)}% complete`;

  const doshaDone = !!(doshaResult && prakritiProgress.foundation);
  const vikritiDone = Object.values(vikritiProgress).some(Boolean);

  const doneFlags = [doshaDone, vikritiDone, !!agniResult, !!gunaResult, !!tongueResult, intakeDone];
  const doneCount = doneFlags.filter(Boolean).length;

  const agni = agniResult ? (agniResults[agniResult.agniType] ?? agniResults.sama) : null;
  const guna = gunaResult ? gunaResults[gunaResult.dominant] : null;
  const tongue = tongueResult ? (tongueReadings[tongueResult.reading] ?? tongueReadings.balanced) : null;

  const scores = doshaResult && doshaResult.scores;
  let doshaSubtitle = 'Not yet taken';
  if (doshaResult && scores) {
    const total = (scores.vata + scores.pitta + scores.kapha) || 1;
    const pct = k => Math.round((scores[k] / total) * 100);
    doshaSubtitle = `${cap(doshaResult.dosha)} dominant · ${pct('vata')} / ${pct('pitta')} / ${pct('kapha')}`;
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <BackButton onPress={() => smartBack('/you')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />
        <Text style={[styles.headline, { color: c.text }]}>Six reads{'\n'}on one person</Text>
        <Text style={[styles.intro, { color: c.textMuted }]}>
          Each one sharpens what Today can tell you. Stop wherever feels right — a partial read is still a read.
        </Text>

        <View style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={[styles.progressLabel, { color: c.textMuted }]}>Progress</Text>
            <Text style={[styles.progressCount, { color: c.textMuted }]}>{doneCount} of 6 complete</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
            <View style={[styles.progressFill, { backgroundColor: c.accent, width: `${(doneCount / 6) * 100}%` }]} />
          </View>
        </View>

        <AssessmentCard
          kicker="The Blueprint"
          title="Dosha"
          done={doshaDone}
          subtitle={doshaSubtitle}
          colors={c}
          onPress={() => router.push(doshaResult ? '/result' : '/quiz')}
          tiers={Object.entries(PRAKRITI_TIER_LABELS).map(([key, label]) => ({ key, label, done: !!prakritiProgress[key] }))}
          onTierRetake={() => router.push('/prakriti')}
        />

        <AssessmentCard
          kicker="How You're Expressing Now"
          title="Vikriti"
          done={vikritiDone}
          subtitle={vikritiDone ? 'Your current state, layer by layer' : 'Not started · this is what unlocks the gap reading'}
          colors={c}
          onPress={() => router.push('/vikriti')}
        />

        <AssessmentCard
          kicker="Digestive Fire"
          title="Agni"
          done={!!agni}
          subtitle={agni ? `${agni.name} · ${agni.subtitle}` : 'Not yet taken'}
          colors={c}
          onPress={() => agniResult
            ? router.push({ pathname: '/agni-result', params: { dominant: agniResult.agniType, sama: agniResult.counts?.sama ?? 0, vishama: agniResult.counts?.vishama ?? 0, tikshna: agniResult.counts?.tikshna ?? 0, manda: agniResult.counts?.manda ?? 0 } })
            : router.push('/agni-quiz')}
        />

        <AssessmentCard
          kicker="Qualities of Mind"
          title="Guna"
          done={!!guna}
          subtitle={guna ? `${cap(gunaResult.dominant)} dominant` : 'Not yet taken'}
          colors={c}
          onPress={() => gunaResult
            ? router.push({ pathname: '/guna-result', params: { dominant: gunaResult.dominant, sattva: gunaResult.scores?.sattva ?? 0, rajas: gunaResult.scores?.rajas ?? 0, tamas: gunaResult.scores?.tamas ?? 0 } })
            : router.push('/guna-quiz')}
        />

        <AssessmentCard
          kicker="Morning Body Read"
          title="Tongue Check"
          done={!!tongue}
          subtitle={tongue ? tongue.name : 'Not started · before coffee, takes a minute'}
          colors={c}
          onPress={() => tongueResult
            ? router.push({ pathname: '/tongue-result', params: { shape: tongueResult.details?.shape, size: tongueResult.details?.size, color: tongueResult.details?.color, coating: tongueResult.details?.coating, ama: tongueResult.details?.amaLevel ?? 0, signs: (tongueResult.details?.signs ?? []).join(',') } })
            : router.push('/tongue-check')}
        />

        <AssessmentCard
          kicker="For Your Sessions"
          title="Intake Form"
          done={intakeDone}
          subtitle={intakeSubtitle}
          colors={c}
          onPress={() => router.push('/intake')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headline: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 30, lineHeight: 36, marginTop: 4 },
  intro:    { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 20, marginTop: 10 },

  progressLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  progressCount: { fontFamily: 'Inter_500Medium', fontSize: 12.5 },
  progressTrack: { height: 4, borderRadius: 2 },
  progressFill:  { height: 4, borderRadius: 2 },

  card:     { borderRadius: 22, padding: 18, marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase' },
  completeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
  takePill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999 },
  takePillText: { color: '#FBF9F4', fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },

  cardTitle:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 21, marginTop: 8 },
  cardSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 3 },

  tiersWrap: { marginTop: 12, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, gap: 8 },
  tierRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tierDot:  { width: 8, height: 8, borderRadius: 4 },
  tierLabel:{ fontFamily: 'Inter_400Regular', fontSize: 13 },
  retakeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
});
