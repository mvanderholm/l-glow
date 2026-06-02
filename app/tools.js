import { View, Text, StyleSheet, Pressable, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const PRACTICES = [
  { href: '/recipes',     label: 'Kitchen',   title: 'Recipes',      desc: 'Dosha-wise meals and kitchen medicine.',        accent: 'honeyAmber' },
  { href: '/herbs',       label: 'Apothecary', title: 'Herbs',       desc: 'Properties, uses, and what each one does.',     accent: 'sage' },
  { href: '/breathwork',  label: 'Breath',    title: 'Breathwork',   desc: 'Pranayama for your dosha and the moment.',      accent: 'accentAlt' },
  { href: '/meditation',  label: 'Mind',      title: 'Meditation',   desc: 'Grounded practice, not a performance.',         accent: 'vata' },
  { href: '/selfmassage', label: 'Abhyanga',  title: 'Self Massage', desc: 'Touch yourself. Your body knows.',              accent: 'terracotta' },
  { href: '/journal',     label: 'Daily',     title: 'Journal',      desc: 'A place to put what needs putting somewhere.',  accent: 'olive' },
];

const EDUCATION = [
  { href: '/learn', label: 'The Tradition', title: 'Learn',      desc: 'Classical ayurvedic concepts taught in Thea\'s voice. Essentials through advanced.', accent: 'accentAlt' },
  { href: '/about', label: 'The Practice',  title: 'About Thea', desc: 'Thea\'s story, credentials, and the worldview underneath everything in this app.',   accent: 'sage' },
];

export default function Tools() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const safeWidth = Math.max((Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth) - spacing.lg * 2, 1);
  const innerWidth = safeWidth;
  const tileWidth = Math.max((innerWidth - spacing.sm) / 2, 1);
  const router = useRouter();
  const styles = makeStyles(c, spacing, radius);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardShell}>
          <Text style={type.label}>Explore</Text>
          <Text style={[type.h1, { marginTop: spacing.sm }]}>Tools</Text>
          <Text style={[type.muted, { marginTop: spacing.xs, lineHeight: 22 }]}>Gentle practices for body, mind & spirit. This is the new shell for the existing guidance and rituals you already built.</Text>
          <View style={styles.chipRow}>
            <QuickLink label="Dosha Quiz" href="/quiz" accent={c.accent} />
            <QuickLink label="Check-in" href="/checkin" accent={c.sage} />
            <QuickLink label="Guidance" href="/recommendations" accent={c.saffron} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Practices</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm }}>
          {PRACTICES.map(tool => (
            <Pressable
              key={tool.href}
              style={({ pressed }) => [styles.tile, { width: tileWidth, borderLeftColor: c[tool.accent] }, pressed && { opacity: 0.7 }]}
              onPress={() => router.push(tool.href)}
            >
              <Text style={[type.label, { color: c[tool.accent], fontSize: 10 }]}>{tool.label}</Text>
              <Text style={[type.h2, { marginTop: spacing.xs }]}>{tool.title}</Text>
              <Text style={[type.muted, { marginTop: spacing.xs, fontSize: 13, lineHeight: 18 }]}>{tool.desc}</Text>
              <Text style={[styles.arrow, { color: c[tool.accent] }]}>→</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Education</Text>
        {EDUCATION.map(tool => (
          <Pressable
            key={tool.href}
            style={({ pressed }) => [styles.card, { borderLeftColor: c[tool.accent] }, pressed && { opacity: 0.75 }]}
            onPress={() => router.push(tool.href)}
          >
            <Text style={type.label}>{tool.label}</Text>
            <Text style={[type.h2, { marginTop: spacing.xs }]}>{tool.title}</Text>
            <Text style={[type.muted, { marginTop: spacing.sm, lineHeight: 22 }]}>{tool.desc}</Text>
            <Text style={[styles.arrow, { color: c[tool.accent] }]}>→</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickLink({ label, href, accent }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        makeStyles(useTheme().theme.colors, useTheme().theme.spacing, useTheme().theme.radius).chip,
        { borderColor: accent },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={{ color: accent, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    cardShell: {
      padding: spacing.lg,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 3,
      borderLeftColor: c.sage,
    },
    sectionLabel: {
      color: c.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      backgroundColor: c.surface,
    },
    tile: {
      padding: spacing.md,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 3,
    },
    card: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 3,
    },
    arrow: {
      marginTop: spacing.md,
      fontSize: 18,
    },
  });
}
