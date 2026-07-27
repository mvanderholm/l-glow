import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { loadDoshaResult, loadTodayCheckin } from '../data/user/storage';
import { recommendations, currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import BackButton, { smartBack } from '../components/BackButton';

// Deterministic daily pick — stable on refresh, rotates each day
function dailyPick(arr) {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return arr[dayIndex % arr.length];
}

function buildCards(dosha) {
  const rec = recommendations[dosha];
  if (!rec) return [];
  return [
    { key: 'nourishment', label: 'Nourishment', route: '/nourishment', content: dailyPick(rec.foods.favor) },
    { key: 'herbs',       label: 'Herbs',        route: '/herbs',       content: dailyPick(rec.herbs) },
    { key: 'movement',    label: 'Movement',     route: '/movement',    content: rec.meditation },
    { key: 'lifestyle',   label: 'Lifestyle',    route: '/lifestyle',   content: rec.lifestyle },
  ];
}

const DOT_KEYS = ['physical', 'mental', 'emotional', 'hunger', 'tongue'];

export default function Today() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const router = useRouter();
  const styles = makeStyles(c, spacing, radius);

  const [dosha, setDosha]     = useState(null);
  const [checkin, setCheckin] = useState(null);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    Promise.all([loadDoshaResult(), loadTodayCheckin()])
      .then(([doshaResult, checkinResult]) => {
        setDosha(doshaResult?.dosha ?? null);
        setCheckin(checkinResult ?? null);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  // No dosha — haven't taken the quiz yet
  if (!dosha) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={styles.emptyState}>
          <Text style={[type.h2, { textAlign: 'center', marginBottom: spacing.lg }]}>
            Take the dosha quiz first — it's how we know what you need.
          </Text>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: c.accent }]}
            onPress={() => router.replace('/quiz')}
          >
            <Text style={styles.primaryBtnText}>Take the quiz  ›</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const info    = doshaInfo[dosha];
  const cards   = buildCards(dosha);
  const season  = currentSeason();
  const date    = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <BackButton onPress={() => smartBack('/')} color={c.text} style={{ marginBottom: spacing.xs }} />
        <Text style={[type.label, { color: c.textMuted }]}>{date}</Text>
        <Text style={[type.display, { marginTop: spacing.xs }]}>Here's today.</Text>

        {/* Check-in score dots — only shown when a check-in exists for today */}
        {checkin?.values && (
          <View style={styles.dotsRow}>
            {DOT_KEYS.map(k => {
              const val = checkin.values[k] ?? 3;
              const opacity = 0.2 + (val / 5) * 0.8;
              return (
                <View
                  key={k}
                  style={[styles.dot, { backgroundColor: info.color, opacity }]}
                />
              );
            })}
          </View>
        )}

        {/* Blueprint badge */}
        <Pressable
          style={[styles.blueprintBadge, { backgroundColor: c.surface, borderColor: c.border }]}
          onPress={() => router.push('/result')}
        >
          <View style={[styles.blueprintDot, { backgroundColor: info.color }]} />
          <Text style={[type.label, { color: c.text, flex: 1 }]}>
            Your {info.name} blueprint
          </Text>
          <Text style={{ color: c.textMuted, fontSize: 18 }}>›</Text>
        </Pressable>

        {/* Season context */}
        <Text style={[type.muted, { marginTop: spacing.sm, marginLeft: spacing.xs }]}>
          {season.name} · {season.focus.toLowerCase()}
        </Text>

        {/* Four pillar cards */}
        <View style={styles.cards}>
          {cards.map(card => (
            <Pressable
              key={card.key}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: c.surface, borderColor: c.border, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => router.push(card.route)}
            >
              <Text style={[type.label, { color: c.textMuted, marginBottom: spacing.sm }]}>
                {card.label}
              </Text>
              <Text
                style={[type.body, { color: c.text, lineHeight: 24, flex: 1 }]}
                numberOfLines={3}
              >
                {card.content}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[type.muted, { color: c.textMuted, fontSize: 12 }]}>
                  Explore {card.label.toLowerCase()}  ›
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Reference link */}
        <Pressable
          style={[styles.refLink, { borderTopColor: c.border }]}
          onPress={() => router.push('/recommendations')}
        >
          <Text style={[type.muted, { color: c.textMuted }]}>See full guidance  ›</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl * 2,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    dotsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: spacing.lg,
    },
    dot: {
      width: 11,
      height: 11,
      borderRadius: 6,
    },
    blueprintBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
    },
    blueprintDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    cards: {
      marginTop: spacing.xl,
      gap: spacing.md,
    },
    card: {
      padding: spacing.lg,
      borderRadius: radius.md,
      borderWidth: 1,
    },
    cardFooter: {
      marginTop: spacing.md,
      alignItems: 'flex-end',
    },
    refLink: {
      marginTop: spacing.xl,
      paddingTop: spacing.lg,
      alignItems: 'center',
      borderTopWidth: 1,
    },
    primaryBtn: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      alignItems: 'center',
    },
    primaryBtnText: {
      color: '#fff',
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
      letterSpacing: 1,
    },
  });
}
