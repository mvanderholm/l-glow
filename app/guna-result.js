import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card, accentShadowSm } from '../theme/index';
import { gunaResults } from '../data/content/gunaQuiz';
import BackButton, { smartBack } from '../components/BackButton';

// Source: transcript 18 (061926_02). Result copy is DRAFT — Thea to review before launch.

function Bullet({ text, color }) {
  const { theme: { colors: c } } = useTheme();
  return (
    <View style={s.bulletRow}>
      <View style={[s.dot, { backgroundColor: color }]} />
      <Text style={[s.bulletText, { color: c.text }]}>{text}</Text>
    </View>
  );
}

function PracticeSection({ label, items, color }) {
  const { theme: { colors: c } } = useTheme();
  return (
    <View style={s.practiceBlock}>
      <Text style={[s.practiceLabel, { color }]}>{label}</Text>
      {items.map((item, i) => (
        <Text key={i} style={[s.practiceItem, { color: c.textMuted }]}>· {item}</Text>
      ))}
    </View>
  );
}

export default function GunaResult() {
  const { theme: { colors: c, spacing, type } } = useTheme();
  const params   = useLocalSearchParams();
  // guna-quiz.js always sends a dominant guna plus all three scores on a
  // real completion — no params at all means a stale link or direct
  // navigation, not a real result. Redirect to the quiz instead of showing
  // a fabricated "Rajas" reading nobody actually got.
  const hasParams = params.dominant !== undefined;
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!hasParams) {
      setRedirecting(true);
      setTimeout(() => router.replace('/guna-quiz'), 1800);
    }
  }, []);

  const dominant = params.dominant ?? 'rajas';
  const res      = gunaResults[dominant] ?? gunaResults.rajas;

  const scores = {
    sattva: Number(params.sattva) || 0,
    rajas:  Number(params.rajas)  || 0,
    tamas:  Number(params.tamas)  || 0,
  };
  const total = scores.sattva + scores.rajas + scores.tamas || 15;
  const pcts  = {
    sattva: Math.round((scores.sattva / total) * 100),
    rajas:  Math.round((scores.rajas  / total) * 100),
    tamas:  Math.round((scores.tamas  / total) * 100),
  };

  const BARS = [
    { key: 'sattva', label: 'Sattva', color: gunaResults.sattva.color },
    { key: 'rajas',  label: 'Rajas',  color: gunaResults.rajas.color  },
    { key: 'tamas',  label: 'Tamas',  color: gunaResults.tamas.color  },
  ];

  if (redirecting) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
        <Text style={type.label}>First things first</Text>
        <Text style={[type.h2, { marginTop: spacing.sm, textAlign: 'center' }]}>Let's find your mental constitution.</Text>
        <Text style={[type.muted, { marginTop: spacing.sm }]}>Taking you to the assessment…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <BackButton onPress={() => smartBack('/')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        {/* Header */}
        <Text style={[s.overline, { color: c.textMuted }]}>Your Gunas</Text>
        <Text style={[s.dominant, { color: res.color }]}>{res.name}</Text>

        {/* Score bars */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          {BARS.map(({ key, label, color }) => (
            <View key={key} style={s.barRow}>
              <Text style={[s.barLabel, { color: c.textMuted }]}>{label}</Text>
              <View style={[s.barTrack, { backgroundColor: c.surfaceAlt }]}>
                <View style={[s.barFill, { width: `${pcts[key]}%`, backgroundColor: color }]} />
              </View>
              <Text style={[s.barPct, { color }]}>{pcts[key]}%</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.body, { color: c.text }]}>{res.summary}</Text>
        </View>

        {/* Gifts */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>When {res.name} is dominant</Text>
          {res.gifts.map((g, i) => <Bullet key={i} text={g} color={res.color} />)}
        </View>

        {/* Watch for */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Things to watch for</Text>
          {res.watchFor.map((w, i) => <Bullet key={i} text={w} color={c.textMuted} />)}
        </View>

        {/* Reflection */}
        <View style={[s.reflectionCard, { borderLeftColor: res.color, backgroundColor: c.surface }]}>
          <Text style={[s.reflectionLabel, { color: c.textMuted }]}>A question worth sitting with</Text>
          <Text style={[s.reflectionText, { color: c.text }]}>"{res.reflection}"</Text>
        </View>

        {/* Path forward */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Path forward</Text>
          <Text style={[s.body, { color: c.text }]}>{res.pathForward}</Text>
        </View>

        {/* Practices */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>What supports {res.name}</Text>
          <PracticeSection label="Diet" items={res.practices.diet} color={res.color} />
          <PracticeSection label="Lifestyle" items={res.practices.lifestyle} color={res.color} />
          <PracticeSection label="Spiritual & emotional" items={res.practices.spiritual} color={res.color} />
        </View>

        {/* L. Glow closing note */}
        <View style={[s.lGlowCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[s.lGlowText, { color: c.text }]}>{res.lGlowNote}</Text>
        </View>

        {/* CTA */}
        <Pressable
          style={[s.btn, { backgroundColor: c.accent, shadowColor: c.accent }]}
          onPress={() => router.replace('/')}
        >
          <Text style={s.btnText}>RETURN HOME  ›</Text>
        </Pressable>

        {/* Retake */}
        <Pressable style={s.retakeBtn} onPress={() => router.replace('/guna-quiz')}>
          <Text style={[s.retakeText, { color: c.textMuted }]}>Retake assessment</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },

  overline:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  dominant:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 52, lineHeight: 58, marginBottom: 24 },

  card: { borderRadius: 26, padding: 20, marginBottom: 12 },

  barRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  barLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 0.4, width: 52 },
  barTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill:  { height: 6, borderRadius: 3 },
  barPct:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, width: 36, textAlign: 'right' },

  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 },
  body:         { fontFamily: 'Inter_400Regular', fontSize: 15.5, lineHeight: 25 },

  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  dot:        { width: 6, height: 6, borderRadius: 3, marginTop: 9, flexShrink: 0 },
  bulletText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },

  reflectionCard:  { borderRadius: 26, padding: 20, marginBottom: 12, borderLeftWidth: 3 },
  reflectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },
  reflectionText:  { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 18, lineHeight: 28 },

  practiceBlock: { marginBottom: 16 },
  practiceLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 6 },
  practiceItem:  { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 22, marginBottom: 3 },

  lGlowCard: { borderRadius: 26, padding: 20, marginBottom: 20, borderWidth: 1 },
  lGlowText: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 16, lineHeight: 27 },

  btn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    ...accentShadowSm,
  },
  btnText:    { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },
  retakeBtn:  { alignSelf: 'center', paddingVertical: 10 },
  retakeText: { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
});
