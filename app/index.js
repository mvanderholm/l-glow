import { View, Text, StyleSheet, Pressable, ScrollView, Share, Platform, Linking, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import { loadDoshaResult, buildSessionSummary, loadTodayIntention, saveIntention } from '../data/user/storage';
import { intentionSuggestions } from '../data/content/intentions';
import { currentMythbuster } from '../data/content/mythbusters';
import LogoAlt from '../components/LogoAlt';
import { BotanicalDivider, CornerSprig } from '../components/BotanicalAccent';

export default function Home() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const season = currentSeason();
  const styles = makeStyles(colors, spacing, radius);

  const [savedDosha, setSavedDosha] = useState(null);
  const [userName, setUserName] = useState('Lindsey');
  const [selectedRemedy] = useState({ name: 'amber candle, tea & dried flowers', emoji: '🕯️' });
  const [selectedAffirmation] = useState({ text: 'I am rooted, but I flow.' });

  useEffect(() => {
    loadDoshaResult().then(result => {
      setSavedDosha(result ? result.dosha : false);
    });
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with menu, logo, bell */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton}>
            <Text style={styles.headerIcon}>☰</Text>
          </Pressable>
          <View style={styles.logo}>
            <Text style={styles.logoText}>L. GL</Text>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>W</Text>
          </View>
          <Pressable style={styles.headerButton}>
            <Text style={styles.headerIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <Text style={[type.label, { color: colors.textMuted, marginBottom: spacing.sm }]}>
            SATURDAY · {season.name.toUpperCase()}
          </Text>
          <Text style={[type.h1, { color: colors.text }]}>
            Good morning,
          </Text>
          <Text style={[type.h1, { color: colors.text, marginBottom: spacing.md }]}>
            {userName}
          </Text>
          <Text style={[type.muted, { color: colors.textMuted }]}>
            Let's take care of you today.
          </Text>
        </View>

        {/* Remedy Recommendation Card */}
        <View style={styles.remedyCard}>
          <View style={styles.remedyImage}>
            <Text style={styles.remedyEmoji}>{selectedRemedy.emoji}</Text>
          </View>
          <Text style={[type.body, { color: colors.text, marginTop: spacing.md }]}>
            {selectedRemedy.name}
          </Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.actionBtn}>
              <Text style={[type.label, { color: colors.accent, fontSize: 11 }]}>Replace</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Text style={[type.label, { color: colors.accent, fontSize: 11 }]}>Remove</Text>
            </Pressable>
          </View>
        </View>

        {/* Start My Day Button */}
        <Link href="/checkin" asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Start my day</Text>
          </Pressable>
        </Link>

        {/* Daily Affirmation Card */}
        <View style={styles.affirmationCard}>
          <View style={styles.affirmationImageWrapper}>
            <View style={styles.affirmationImagePlaceholder}>
              <Text style={styles.affirmationEmoji}>🏛️</Text>
            </View>
          </View>
          <View style={styles.affirmationContent}>
            <Text style={[type.label, { color: colors.accent, marginBottom: spacing.xs }]}>
              DAILY AFFIRMATION
            </Text>
            <Text style={[styles.affirmationText]}>
              {selectedAffirmation.text}
            </Text>
            <Pressable style={{ marginTop: spacing.md }}>
              <Text style={styles.refreshIcon}>🔄</Text>
            </Pressable>
          </View>
        </View>

        {/* Begin Here Section */}
        <View style={styles.beginHereSection}>
          <Text style={[type.h2, { color: colors.text, marginBottom: spacing.lg }]}>
            Begin here
          </Text>
          <View style={styles.featureGrid}>
            <Link href="/herbs" asChild>
              <Pressable style={styles.featureCard}>
                <Text style={styles.featureEmoji}>🌿</Text>
                <Text style={[type.body, { color: colors.text, textAlign: 'center' }]}>Apothecary</Text>
              </Pressable>
            </Link>
            <Link href="/breathwork" asChild>
              <Pressable style={styles.featureCard}>
                <Text style={styles.featureEmoji}>💨</Text>
                <Text style={[type.body, { color: colors.text, textAlign: 'center' }]}>Breathwork</Text>
              </Pressable>
            </Link>
            <Link href="/recipes" asChild>
              <Pressable style={styles.featureCard}>
                <Text style={styles.featureEmoji}>🍲</Text>
                <Text style={[type.body, { color: colors.text, textAlign: 'center' }]}>Recipes</Text>
              </Pressable>
            </Link>
            <Link href="/meditation" asChild>
              <Pressable style={styles.featureCard}>
                <Text style={styles.featureEmoji}>🧘</Text>
                <Text style={[type.body, { color: colors.text, textAlign: 'center' }]}>Meditate</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[type.label, { color: colors.textMuted, fontSize: 20, marginBottom: spacing.sm }]}>❧</Text>
          <Text style={[type.muted, { color: colors.textMuted, textAlign: 'center' }]}>
            Wellness, rooted in you.
          </Text>
        </View>

        {/* Additional content for returning users */}
        {savedDosha === null ? null : savedDosha ? (
          <ReturningUser dosha={savedDosha} />
        ) : (
          <NewUser />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ReturningUser({ dosha }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const info = doshaInfo[dosha];

  async function shareWithThea() {
    const summary = await buildSessionSummary();
    await Share.share({ message: summary });
  }

  return (
    <View style={styles.returningBlock}>
      <Text style={type.label}>Welcome back</Text>
      <Text style={[type.h2, { color: info.color, marginTop: spacing.xs }]}>
        {info.name}
      </Text>

      <IntentionCard dosha={dosha} />

      <Link href={{ pathname: '/recommendations', params: { dosha } }} asChild>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Today's Guidance</Text>
        </Pressable>
      </Link>

      <Link href="/checkin" asChild>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Daily Check-in</Text>
        </Pressable>
      </Link>

      {Platform.OS !== 'web' && (
        <Pressable style={styles.secondaryBtn} onPress={shareWithThea}>
          <Text style={styles.secondaryBtnText}>Share summary with Thea</Text>
        </Pressable>
      )}

      <Link href="/quiz" asChild>
        <Pressable style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Retake the quiz</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function NewUser() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Link href="/quiz" asChild>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Take the Dosha Quiz</Text>
        </Pressable>
      </Link>

      <Link href="/recommendations" asChild>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Today's Guidance</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function IntentionCard({ dosha }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const suggestions = intentionSuggestions(dosha);
  const [intention, setIntention] = useState(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    loadTodayIntention().then(val => setIntention(val ?? ''));
  }, []);

  async function choose(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    await saveIntention(trimmed);
    setIntention(trimmed);
    setDraft('');
  }

  if (intention === null) return null;

  return (
    <View style={styles.intentionCard}>
      {intention ? (
        <>
          <Text style={type.label}>Just for today</Text>
          <Text style={[type.body, { marginTop: spacing.sm }]}>I will {intention}</Text>
          <Pressable onPress={() => setIntention('')} style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>change</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={type.label}>Just for today, I will…</Text>
          <View style={styles.intentionChipRow}>
            {suggestions.map(s => (
              <Pressable
                key={s.id}
                style={({ pressed }) => [styles.intentionChip, pressed && { opacity: 0.6 }]}
                onPress={() => choose(s.text)}
              >
                <Text style={styles.intentionChipText}>{s.text}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.intentionInput}
            placeholder="write your own…"
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => choose(draft)}
            returnKeyType="done"
          />
        </>
      )}
    </View>
  );
}

function makeStyles(colors, spacing, radius) {
  return StyleSheet.create({
    safeArea: { 
      flex: 1, 
      backgroundColor: colors.bg 
    },
    scrollContent: { 
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    
    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.xs,
    },
    headerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerIcon: {
      fontSize: 24,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    logoText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 24,
      color: colors.text,
      letterSpacing: 2,
    },
    logoDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },

    // Greeting Card
    greetingCard: {
      marginBottom: spacing.lg,
    },

    // Remedy Card
    remedyCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      alignItems: 'center',
    },
    remedyImage: {
      width: 80,
      height: 80,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    remedyEmoji: {
      fontSize: 48,
    },
    cardActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    actionBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },

    // Primary Button
    primaryBtn: {
      backgroundColor: colors.accent,
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    primaryBtnText: { 
      color: '#FFFFFF', 
      fontFamily: 'Inter_700Bold', 
      fontSize: 16,
      letterSpacing: 0.5,
    },

    // Affirmation Card
    affirmationCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: spacing.lg,
    },
    affirmationImageWrapper: {
      width: 100,
      backgroundColor: colors.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },
    affirmationImagePlaceholder: {
      width: 80,
      height: 80,
      backgroundColor: colors.border,
      borderRadius: radius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    affirmationEmoji: {
      fontSize: 40,
    },
    affirmationContent: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'flex-start',
    },
    affirmationText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 16,
      lineHeight: 22,
      color: colors.text,
      fontStyle: 'italic',
    },
    refreshIcon: {
      fontSize: 18,
    },

    // Begin Here Section
    beginHereSection: {
      marginBottom: spacing.xl,
    },
    featureGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      justifyContent: 'space-between',
    },
    featureCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 120,
    },
    featureEmoji: {
      fontSize: 40,
      marginBottom: spacing.md,
    },

    // Footer
    footer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },

    // Returning User
    returningBlock: {
      marginTop: spacing.xl,
      paddingTop: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    secondaryBtn: {
      marginTop: spacing.md,
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryBtnText: { 
      color: colors.text, 
      fontFamily: 'Inter_600SemiBold', 
      fontSize: 16 
    },
    ghostBtn: {
      marginTop: spacing.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    ghostBtnText: { 
      color: colors.textMuted, 
      fontFamily: 'Inter_400Regular', 
      fontSize: 14 
    },

    // Intention
    intentionCard: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent,
    },
    intentionChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    intentionChip: {
      backgroundColor: colors.surfaceAlt,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.accent + '66',
    },
    intentionChipText: {
      color: colors.accent,
      fontSize: 14,
    },
    intentionInput: {
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 14,
    },
  });
}
