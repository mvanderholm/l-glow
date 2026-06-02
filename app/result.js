import { View, Text, StyleSheet, Pressable, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useLocalSearchParams, Link } from 'expo-router';
import { doshaInfo } from '../data/content/quiz';
import { useTheme } from '../context/ThemeContext';
import { saveDoshaResult } from '../data/user/storage';
import { BotanicalDivider } from '../components/BotanicalAccent';

export default function Result() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const innerWidth = (Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth) - spacing.lg * 2;
  const styles = makeStyles(colors, spacing, radius);
  const params = useLocalSearchParams();

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
    saveDoshaResult(primary, scores).catch(err =>
      console.error('Failed to save dosha result:', err)
    );
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>

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
            This result is your <Text style={{ fontFamily: 'Inter_700Bold' }}>prakriti</Text> — the constitution you were born with. Your home base. The daily check-in tracks <Text style={{ fontFamily: 'Inter_700Bold' }}>vikriti</Text> — where you actually are right now. The two are usually different. The whole point of practice is noticing the gap and gently moving back toward home.
          </Text>
        </View>

        <Link href={{ pathname: '/recommendations', params: { dosha: primary } }} asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>See Today's Guidance</Text>
          </Pressable>
        </Link>

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
  });
}
