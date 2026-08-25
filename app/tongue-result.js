import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card, accentShadowSm } from '../theme/index';
import { tongueReadings, amaReadings, tongueMap, tongueSignList, computeReading } from '../data/content/tongueCheck';
import BackButton, { smartBack } from '../components/BackButton';
import { BOOKING_URL } from '../data/booking';
import AssessmentsChecklistModal from '../components/AssessmentsChecklistModal';

// Source: transcript 27 (062426_01), June 2026. Content is DRAFT — Thea to review.

function Bullet({ text, color }) {
  const { theme: { colors: c } } = useTheme();
  return (
    <View style={s.bulletRow}>
      <View style={[s.dot, { backgroundColor: color }]} />
      <Text style={[s.bulletText, { color: c.text }]}>{text}</Text>
    </View>
  );
}

export default function TongueResult() {
  const { theme: { colors: c, spacing } } = useTheme();
  const params = useLocalSearchParams();
  const { shape, size, color, coating, ama: amaParam, signs: signsParam } = params;
  // tongue-check.js always sends at least a shape param on a real
  // completion — no params at all means a stale link or direct navigation,
  // not a real reading. Redirect instead of silently showing the fabricated
  // "Balanced" reading computeReading() falls back to when every input is
  // undefined (same class of bug the other three result screens already
  // guard against).
  const hasParams = shape !== undefined;
  const [redirecting, setRedirecting] = useState(false);
  const [showAssessments, setShowAssessments] = useState(false);

  useEffect(() => {
    if (!hasParams) {
      setRedirecting(true);
      setTimeout(() => router.replace('/tongue-check'), 1800);
    }
  }, []);

  const amaLevel   = Math.min(Number(amaParam) || 0, 3);
  const signIds    = signsParam ? signsParam.split(',').filter(Boolean) : [];
  const readingKey = computeReading(shape, size, color);
  const reading    = tongueReadings[readingKey] ?? tongueReadings.balanced;
  const amaRead    = amaReadings[amaLevel] ?? amaReadings[0];
  const notedSigns = tongueSignList.filter(s => signIds.includes(s.id));

  if (redirecting) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: c.textMuted }}>First things first</Text>
        <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, color: c.text, marginTop: 8, textAlign: 'center' }}>Let's take a look at your tongue.</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: c.textMuted, marginTop: 8 }}>Taking you to the check…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <BackButton onPress={() => smartBack('/')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        {/* Header */}
        <Text style={[s.overline, { color: c.textMuted }]}>Tongue reading</Text>
        <Text style={[s.readingName, { color: reading.color }]}>{reading.name}</Text>
        <Text style={[s.summary, { color: c.textMedium }]}>{reading.summary}</Text>

        {/* Pattern clues */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>What this pattern often calls for</Text>
          {reading.clues.map((clue, i) => (
            <Bullet key={i} text={clue} color={reading.color} />
          ))}
        </View>

        {/* Ama reading */}
        <View style={[s.amaCard, { backgroundColor: c.surface, borderLeftColor: c.saffron }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Ama — coating</Text>
          <Text style={[s.amaLabel, { color: c.saffron }]}>{amaRead.label}</Text>
          <Text style={[s.amaDesc, { color: c.text }]}>{amaRead.desc}</Text>
        </View>

        {/* Other signs */}
        {notedSigns.length > 0 && (
          <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
            <Text style={[s.sectionLabel, { color: c.textMuted }]}>Other signs you noticed</Text>
            {notedSigns.map(sign => (
              <View key={sign.id} style={s.signItem}>
                <Text style={[s.signLabel, { color: c.text }]}>{sign.label}</Text>
                <Text style={[s.signMeaning, { color: c.textMedium }]}>{sign.meaning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tongue map */}
        <View style={[s.card, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>Tongue map</Text>
          {tongueMap.map(({ zone, meaning }) => (
            <View key={zone} style={s.mapRow}>
              <Text style={[s.mapZone, { color: reading.color }]}>{zone}</Text>
              <Text style={[s.mapMeaning, { color: c.textMedium }]}>{meaning}</Text>
            </View>
          ))}
        </View>

        {/* Closing reminder */}
        <View style={[s.closingCard, { backgroundColor: c.surfaceAlt }]}>
          <Text style={[s.closingPhrase, { color: c.text }]}>
            These are clues, not conclusions.
          </Text>
          <Text style={[s.closingBody, { color: c.textMedium }]}>
            {'Your body doesn\'t lie, but it speaks in symbols. What you notice here is information — not a verdict. If something persists, worsens, or concerns you, that\'s what qualified medical care is for.'}
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          style={[s.btn, { backgroundColor: c.accent, shadowColor: c.accent }]}
          onPress={() => setShowAssessments(true)}
        >
          <Text style={s.btnText}>SEE WHAT'S NEXT  ›</Text>
        </Pressable>

        <Pressable style={s.retakeBtn} onPress={() => router.replace('/tongue-check')}>
          <Text style={[s.retakeText, { color: c.textMuted }]}>Check again</Text>
        </Pressable>

        <Pressable style={s.retakeBtn} onPress={() => Linking.openURL(BOOKING_URL)}>
          <Text style={[s.retakeText, { color: c.accent }]}>Want to talk to Thea? Book a session</Text>
        </Pressable>

        <Pressable style={s.retakeBtn} onPress={() => router.replace('/')}>
          <Text style={[s.retakeText, { color: c.textMuted }]}>Return home</Text>
        </Pressable>

      </ScrollView>

      <AssessmentsChecklistModal
        visible={showAssessments}
        onDismiss={() => setShowAssessments(false)}
        title="Nice work. What's next?"
        subtitle="You just did a Tongue Check. Five more reads whenever you're ready — take them in any order."
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },

  overline:    { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  readingName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 48, lineHeight: 54, marginBottom: 6 },
  summary:     { fontFamily: 'Inter_400Regular', fontSize: 15.5, lineHeight: 25, marginBottom: 20 },

  card:         { borderRadius: 26, padding: 20, marginBottom: 12 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 },

  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  dot:        { width: 6, height: 6, borderRadius: 3, marginTop: 9, flexShrink: 0 },
  bulletText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },

  amaCard:  { borderRadius: 26, padding: 20, marginBottom: 12, borderLeftWidth: 3 },
  amaLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, marginBottom: 6 },
  amaDesc:  { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },

  signItem:    { marginBottom: 14 },
  signLabel:   { fontFamily: 'Inter_600SemiBold', fontSize: 15, marginBottom: 4 },
  signMeaning: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 22 },

  mapRow:    { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  mapZone:   { fontFamily: 'Inter_600SemiBold', fontSize: 13, width: 90, flexShrink: 0 },
  mapMeaning:{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },

  closingCard:   { borderRadius: 26, padding: 20, marginBottom: 20 },
  closingPhrase: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 18, lineHeight: 26, marginBottom: 10 },
  closingBody:   { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 22 },

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
