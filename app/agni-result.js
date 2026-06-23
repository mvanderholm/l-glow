import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { agniResults } from '../data/content/agniQuiz';

// Source: transcript 21 (062126_02). Result copy is DRAFT — Thea to review before launch.

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

export default function AgniResult() {
  const { theme: { colors: c } } = useTheme();
  const params   = useLocalSearchParams();
  const dominant = params.dominant ?? 'sama';
  const res      = agniResults[dominant] ?? agniResults.sama;

  const counts = {
    sama:    Number(params.sama)    || 0,
    vishama: Number(params.vishama) || 0,
    tikshna: Number(params.tikshna) || 0,
    manda:   Number(params.manda)   || 0,
  };
  const total = counts.sama + counts.vishama + counts.tikshna + counts.manda || agniResults.length;

  const BARS = [
    { key: 'sama',    label: 'Sama',    color: agniResults.sama.color    },
    { key: 'vishama', label: 'Vishama', color: agniResults.vishama.color  },
    { key: 'tikshna', label: 'Tikshna', color: agniResults.tikshna.color },
    { key: 'manda',   label: 'Manda',   color: agniResults.manda.color   },
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={[s.overline, { color: c.textMuted }]}>Your Agni</Text>
        <Text style={[s.typeName, { color: res.color }]}>{res.name}</Text>
        <Text style={[s.subtitle, { color: c.textMuted }]}>{res.subtitle}</Text>

        {/* Score bars */}
        <View style={[s.card, { backgroundColor: c.surface }]}>
          {BARS.map(({ key, label, color }) => {
            const pct = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
            return (
              <View key={key} style={s.barRow}>
                <Text style={[s.barLabel, { color: c.textMuted }]}>{label}</Text>
                <View style={[s.barTrack, { backgroundColor: c.surfaceAlt }]}>
                  <View style={[s.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                <Text style={[s.barPct, { color }]}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={[s.card, { backgroundColor: c.surface }]}>
          <Text style={[s.body, { color: c.text }]}>{res.summary}</Text>
        </View>

        {/* Gifts */}
        <View style={[s.card, { backgroundColor: c.surface }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Signs of {res.name}</Text>
          {res.gifts.map((g, i) => <Bullet key={i} text={g} color={res.color} />)}
        </View>

        {/* Watch for */}
        <View style={[s.card, { backgroundColor: c.surface }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Things to watch for</Text>
          {res.watchFor.map((w, i) => <Bullet key={i} text={w} color={c.textMuted} />)}
        </View>

        {/* Reflection */}
        <View style={[s.reflectionCard, { borderLeftColor: res.color, backgroundColor: c.surface }]}>
          <Text style={[s.reflectionLabel, { color: c.textMuted }]}>A question worth sitting with</Text>
          <Text style={[s.reflectionText, { color: c.text }]}>"{res.reflection}"</Text>
        </View>

        {/* Path forward */}
        <View style={[s.card, { backgroundColor: c.surface }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Path forward</Text>
          <Text style={[s.body, { color: c.text }]}>{res.pathForward}</Text>
        </View>

        {/* Practices */}
        <View style={[s.card, { backgroundColor: c.surface }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>What supports {res.name}</Text>
          <PracticeSection label="Diet"                  items={res.practices.diet}      color={res.color} />
          <PracticeSection label="Lifestyle"             items={res.practices.lifestyle}  color={res.color} />
          <PracticeSection label="Spiritual & emotional" items={res.practices.spiritual}  color={res.color} />
        </View>

        {/* L. Glow closing note — shows only when Thea has authored it */}
        {res.lGlowNote ? (
          <View style={[s.lGlowCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[s.lGlowText, { color: c.text }]}>{res.lGlowNote}</Text>
          </View>
        ) : null}

        {/* CTA */}
        <Pressable
          style={[s.btn, { backgroundColor: c.accent }]}
          onPress={() => router.replace('/')}
        >
          <Text style={s.btnText}>RETURN HOME  ›</Text>
        </Pressable>

        {/* Retake */}
        <Pressable style={s.retakeBtn} onPress={() => router.replace('/agni-quiz')}>
          <Text style={[s.retakeText, { color: c.textMuted }]}>Retake assessment</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },

  overline:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  typeName:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 48, lineHeight: 54, marginBottom: 4 },
  subtitle:  { fontFamily: 'Inter_400Regular', fontSize: 15, marginBottom: 24 },

  card: { borderRadius: 20, padding: 20, marginBottom: 12 },

  barRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  barLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 0.4, width: 60 },
  barTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill:  { height: 6, borderRadius: 3 },
  barPct:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, width: 36, textAlign: 'right' },

  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 },
  body:         { fontFamily: 'Inter_400Regular', fontSize: 15.5, lineHeight: 25 },

  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  dot:        { width: 6, height: 6, borderRadius: 3, marginTop: 9, flexShrink: 0 },
  bulletText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },

  reflectionCard:  { borderRadius: 20, padding: 20, marginBottom: 12, borderLeftWidth: 3 },
  reflectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },
  reflectionText:  { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 18, lineHeight: 28 },

  practiceBlock: { marginBottom: 16 },
  practiceLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 6 },
  practiceItem:  { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 22, marginBottom: 3 },

  lGlowCard: { borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1 },
  lGlowText: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 16, lineHeight: 27 },

  btn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#9A5151',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 3,
  },
  btnText:    { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },
  retakeBtn:  { alignSelf: 'center', paddingVertical: 10 },
  retakeText: { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
});
