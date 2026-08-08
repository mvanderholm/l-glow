import { View, Text, StyleSheet, Pressable, ScrollView, Platform, useWindowDimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doshaInfo } from '../data/content/quiz';
import { useTheme } from '../context/ThemeContext';
import { BotanicalDivider } from '../components/BotanicalAccent';
import BackButton, { smartBack } from '../components/BackButton';
import { BOOKING_URL } from '../data/booking';

export default function Result() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const innerWidth = (Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth) - spacing.lg * 2;
  const styles = makeStyles(colors, spacing, radius);
  const params = useLocalSearchParams();
  // The quiz always sends a floor of 3 per dosha (see quiz.js), so real
  // completions never arrive with every param missing. Landing here with
  // none of them set means a stale link, browser history weirdness, or
  // direct navigation — not a real result. Redirect instead of saving a
  // fake all-zero dosha over whatever the user actually has (or doesn't).
  const hasParams = params.vata !== undefined || params.pitta !== undefined || params.kapha !== undefined;
  const [redirecting, setRedirecting] = useState(false);

  const scores = {
    vata:  Number(params.vata  || 0),
    pitta: Number(params.pitta || 0),
    kapha: Number(params.kapha || 0),
  };
  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const info = doshaInfo[primary];

  const pcts = {
    vata:  Math.round((scores.vata  / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  useEffect(() => {
    // quiz.js saves the result (with per-question answers) before navigating
    // here — this screen only needs to redirect on a params-less landing.
    if (!hasParams) {
      setRedirecting(true);
      setTimeout(() => router.replace('/quiz'), 1800);
    }
  }, []);

  if (redirecting) {
    return (
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
        <Text style={type.label}>First things first</Text>
        <Text style={[type.h2, { marginTop: spacing.sm, textAlign: 'center' }]}>Let's find your constitution.</Text>
        <Text style={[type.muted, { marginTop: spacing.sm }]}>Taking you to the quiz…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>

        <BackButton onPress={() => smartBack('/')} color={colors.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        {/* Primary result */}
        <Text style={type.label}>Your Primary Dosha</Text>
        <Text style={[type.display, { color: info.color, marginTop: spacing.sm }]}>{info.name}</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>{info.elements} · {info.qualities}</Text>

        <View style={[styles.summaryCard, { borderLeftColor: info.color }]}>
          <Text style={[type.body, { lineHeight: 26 }]}>{info.summary}</Text>
        </View>

        {/* Breakdown */}
        <Text style={[type.label, { marginTop: spacing.xl }]}>Your Breakdown</Text>
        {sorted.map(([dosha, score]) => {
          const pct = Math.round((score / total) * 100);
          return (
            <View key={dosha} style={{ marginTop: spacing.md }}>
              <View style={styles.barRow}>
                <Text style={[type.body, { textTransform: 'capitalize' }]}>{dosha}</Text>
                <Text style={type.muted}>{pct}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: doshaInfo[dosha].color }]} />
              </View>
            </View>
          );
        })}

        <BotanicalDivider color={colors.sage} borderColor={colors.border} width={innerWidth} />

        {/* Colors metaphor */}
        <Text style={type.label}>Your constitution</Text>
        <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 26 }]}>
          Think of the doshas like primary colors — three forces that combine in unique proportions in every person. Yours came back {pcts.vata}% vata, {pcts.pitta}% pitta, and {pcts.kapha}% kapha. {info.name} is your dominant hue. It shapes how you move, digest, and think — but it's not the whole picture.
        </Text>
        <Text style={[type.body, { marginTop: spacing.md, lineHeight: 26, color: colors.textMuted }]}>
          {info.constitution}
        </Text>

        <BotanicalDivider color={colors.sage} borderColor={colors.border} width={innerWidth} />

        {/* Elements in the body */}
        <Text style={type.label}>In the body</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          {info.name} is made of {info.elements.toLowerCase()}. Here's what that actually means.
        </Text>
        {info.elementGrounding.map(({ element, body }) => (
          <View key={element} style={[styles.elementCard, { borderLeftColor: info.color }]}>
            <Text style={[type.label, { color: info.color }]}>{element}</Text>
            <Text style={[type.muted, { marginTop: spacing.xs, lineHeight: 22 }]}>{body}</Text>
          </View>
        ))}

        <BotanicalDivider color={colors.sage} borderColor={colors.border} width={innerWidth} />

        {/* Prakriti / vikriti */}
        <View style={styles.prakritCard}>
          <Text style={[type.label, { marginBottom: spacing.sm }]}>Prakriti & Vikriti</Text>
          <Text style={[type.body, { lineHeight: 26 }]}>
            This result is your <Text style={{ fontFamily: 'Inter_700Bold' }}>prakriti</Text> — the constitution you were born with. Your blueprint. The daily check-in tracks <Text style={{ fontFamily: 'Inter_700Bold' }}>vikriti</Text> — where you actually are right now. The two are usually different. The whole point of practice is noticing the gap and gently moving back toward it.
          </Text>
        </View>

        <BotanicalDivider color={colors.sage} borderColor={colors.border} width={innerWidth} />

        {/* Archetype — source: transcript 19. DRAFT, awaiting Thea's review. */}
        <Text style={type.label}>Your pattern</Text>
        <Text style={[type.display, { color: info.color, fontSize: 28, lineHeight: 34, marginTop: spacing.sm, marginBottom: spacing.md }]}>
          {info.archetype.name}
        </Text>

        <View style={[styles.elementCard, { borderLeftColor: info.color }]}>
          <Text style={[type.label, { color: colors.textMuted, marginBottom: spacing.sm }]}>When in balance</Text>
          {info.archetype.balanced.map((t, i) => (
            <Text key={i} style={[type.muted, { lineHeight: 22, marginBottom: 4 }]}>· {t}</Text>
          ))}
        </View>

        <View style={[styles.elementCard, { borderLeftColor: colors.textMuted }]}>
          <Text style={[type.label, { color: colors.textMuted, marginBottom: spacing.sm }]}>When off track</Text>
          {info.archetype.imbalanced.map((t, i) => (
            <Text key={i} style={[type.muted, { lineHeight: 22, marginBottom: 4 }]}>· {t}</Text>
          ))}
        </View>

        <View style={[styles.elementCard, { borderLeftColor: info.color }]}>
          <Text style={[type.body, { lineHeight: 24, marginBottom: spacing.sm }]}>{info.archetype.trap}</Text>
          <Text style={[type.muted, { lineHeight: 22, fontStyle: 'italic' }]}>{info.archetype.truth}</Text>
        </View>

        <View style={[styles.reminderCard, { borderLeftColor: info.color }]}>
          <Text style={[styles.reminderText, { color: colors.text }]}>"{info.archetype.reminder}"</Text>
        </View>

        <Text style={[type.muted, { textAlign: 'center', lineHeight: 22, marginTop: spacing.md, marginBottom: spacing.lg, paddingHorizontal: spacing.md }]}>
          We are all three. The question isn't what dosha am I — it's what part of me is asking for attention right now.
        </Text>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.replace({ pathname: '/recommendations', params: { dosha: primary } })}
        >
          <Text style={styles.primaryBtnText}>See Today's Guidance</Text>
        </Pressable>

        <Pressable style={styles.retakeBtn} onPress={() => router.replace('/quiz')}>
          <Text style={styles.retakeText}>Retake quiz</Text>
        </Pressable>

        <Pressable style={styles.retakeBtn} onPress={() => Linking.openURL(BOOKING_URL)}>
          <Text style={[styles.retakeText, { color: colors.accent }]}>Want to talk to Thea? Book a session</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    summaryCard: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderLeftWidth: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    barRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    barTrack: {
      height: 8,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.pill,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: radius.pill,
    },
    elementCard: {
      marginTop: spacing.md,
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 3,
    },
    prakritCard: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 3,
      borderLeftColor: colors.olive,
    },
    reminderCard: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 3,
    },
    reminderText: {
      fontFamily: 'PlayfairDisplay_400Regular',
      fontStyle: 'italic',
      fontSize: 18,
      lineHeight: 28,
    },
    primaryBtn: {
      marginTop: spacing.xl,
      backgroundColor: colors.accent,
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      alignItems: 'center',
    },
    primaryBtnText: {
      color: colors.bg,
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
    },
    retakeBtn: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
      marginTop: spacing.xs,
    },
    retakeText: {
      color: colors.textMuted,
      fontFamily: 'Inter_400Regular',
      fontSize: 13.5,
    },
  });
}
