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
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth;
  const safeContentWidth = Math.max(contentWidth, 1);
  const heroWidth = Platform.OS !== 'web' ? safeContentWidth : Math.max(safeContentWidth - spacing.lg * 2, 1);
  const heroLogoWidth = Math.max(heroWidth - spacing.lg * 2, 1);
  const innerWidth = Math.max(safeContentWidth - spacing.lg * 2, 1);
  const season = currentSeason();
  const router = useRouter();
  const styles = makeStyles(colors, spacing, radius, heroWidth);

  // null = loading, false = no result, string = saved dosha
  const [savedDosha, setSavedDosha] = useState(null);

  useEffect(() => {
    loadDoshaResult().then(result => {
      setSavedDosha(result ? result.dosha : false);
    });
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {Platform.OS === 'web' ? (
          <View style={styles.prototypeHeroCard}>
            <View style={styles.prototypeHeroHeader}>
              <Text style={[type.label, { color: colors.textMuted }]}>Official prototype shell</Text>
              <Text style={[type.muted, { marginTop: spacing.xs, fontSize: 12 }]}>This is the new baseline. Existing flows will be folded into this design instead of layered on top of the old screen treatment.</Text>
            </View>
            <View style={styles.quickActionRow}>
              <QuickActionChip label="Dosha Quiz" href="/quiz" accent={colors.accent} />
              <QuickActionChip label="Daily Check-in" href="/checkin" accent={colors.sage} />
              <QuickActionChip label="Today’s Guidance" href="/recommendations" accent={colors.saffron} />
            </View>
            <View style={styles.prototypeFrame}>
              <iframe
                src="/prototype.html"
                title="Prototype design"
                style={styles.prototypeIframe}
              />
            </View>
          </View>
        ) : (
          <View style={styles.heroSection}>
            <View style={styles.heroCard}>
            <View style={styles.aboutRow}>
              <Link href="/learn" asChild>
                <Pressable><Text style={[styles.aboutLink, { color: 'rgba(236,232,223,0.9)' }]}>Learn</Text></Pressable>
              </Link>
              <Text style={[styles.aboutLinkDivider, { color: 'rgba(236,232,223,0.5)' }]}>·</Text>
              <Link href="/about" asChild>
                <Pressable><Text style={[styles.aboutLink, { color: 'rgba(236,232,223,0.9)' }]}>About Thea</Text></Pressable>
              </Link>
            </View>
            <View style={styles.heroContent}>
              <Text style={[type.label, { color: colors.textMuted }]}>Saturday · {season.name}</Text>
              <Text style={[type.h1, { color: colors.text, marginTop: spacing.sm }]}>Good morning, {savedDosha ? 'friend' : 'let’s begin'}.</Text>
              <Text style={[type.muted, { marginTop: spacing.sm, maxWidth: 320 }]}>Tap into your constitution, today’s season, and the small rituals that help you feel more like yourself.</Text>
              <Link href="/checkin" asChild>
                <Pressable style={styles.heroAction}>
                  <Text style={styles.heroActionText}>Start my day</Text>
                </Pressable>
              </Link>
            </View>
            </View>
          </View>
        )}





        {savedDosha === null ? (
          // Loading — render nothing where the CTAs will be to avoid flicker
          <View style={{ height: 160 }} />
        ) : savedDosha ? (
          // Returning user
          <ReturningUser dosha={savedDosha} />
        ) : (
          // New user
          <NewUser />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const APP_STORE_URL = 'https://apps.apple.com/app/lavender-glow/id0000000000';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.lavenderglow.app';

function DownloadCTAs() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  if (Platform.OS !== 'web') return null;
  return (
    <View style={styles.downloadBlock}>
      <Text style={[type.label, { textAlign: 'center', marginBottom: spacing.md }]}>
        Get the full experience
      </Text>
      <Pressable style={styles.downloadBtn} onPress={() => Linking.openURL(APP_STORE_URL)}>
        <Text style={styles.downloadBtnText}>Download on the App Store</Text>
      </Pressable>
      <Pressable style={[styles.downloadBtn, { marginTop: spacing.sm }]} onPress={() => Linking.openURL(PLAY_STORE_URL)}>
        <Text style={styles.downloadBtnText}>Get it on Google Play</Text>
      </Pressable>
    </View>
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

      <DownloadCTAs />
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

      <Link href="/checkin" asChild>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Daily Check-in</Text>
        </Pressable>
      </Link>

      <Link href="/recommendations" asChild>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Today's Guidance</Text>
        </Pressable>
      </Link>

      <DownloadCTAs />
    </View>
  );
}

function MythbusterCard() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const myth = currentMythbuster();
  if (!myth) return null;

  return (
    <View style={styles.mythbusterCard}>
      <CornerSprig color={colors.saffron} size={44} style={{ position: 'absolute', top: 0, right: 0 }} />
      <Text style={type.label}>This Week</Text>
      <Text style={[type.h2, { marginTop: spacing.xs }]}>Mythbusters</Text>
      <Text style={[type.body, { marginTop: spacing.sm, fontStyle: 'italic' }]}>
        "{myth.myth}"
      </Text>
      {myth.take && (
        <Text style={[type.body, { marginTop: spacing.md, lineHeight: 24 }]}>{myth.take}</Text>
      )}
      {myth.reframe && (
        <Text style={[type.muted, { marginTop: spacing.sm, lineHeight: 22 }]}>{myth.reframe}</Text>
      )}
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

function QuickActionChip({ label, href, accent }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        makeStyles(useTheme().theme.colors, useTheme().theme.spacing, useTheme().theme.radius).quickActionChip,
        { borderColor: accent },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={{ color: accent, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(colors, spacing, radius, heroWidth = 390) {
return StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg },
    heroSection: {
      height: Math.round(heroWidth * 0.9),
      ...Platform.select({
        web: { borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.xs },
        default: { marginHorizontal: -spacing.lg, marginTop: -spacing.lg, overflow: 'hidden' },
      }),
    },
    heroCard: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    heroHeader: {
      marginBottom: spacing.md,
    },
  heroAction: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(236,232,223,0.95)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  heroActionText: {
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  prototypeHeroCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  prototypeHeroHeader: {
    marginBottom: spacing.md,
  },
  prototypeFrame: {
    marginTop: spacing.md,
    height: 420,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  prototypeIframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    backgroundColor: colors.bg,
  },
  quickActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickActionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  prototypeShell: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  prototypeCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.sage,
  },
  primaryPill: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  primaryPillText: {
    color: colors.bg,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  sectionBlock: {
    marginTop: spacing.sm,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tile: {
    width: '48%',
    minWidth: 140,
    flexGrow: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
  },
  returningBlock: {
    marginTop: spacing.xl,
  },
  primaryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
    primaryBtnText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 1 },
  secondaryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.text, fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  ghostBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ghostBtnText: { color: colors.textMuted, fontFamily: 'Inter_400Regular', fontSize: 14 },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aboutLink: {
    color: colors.textMuted,
    fontSize: 13,
  },
  aboutLinkDivider: {
    color: colors.border,
    fontSize: 13,
  },
  downloadBlock: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  downloadBtn: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  downloadBtnText: { color: colors.text, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  mythbusterCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.saffron,
    overflow: 'hidden',
  },
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
