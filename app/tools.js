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
  const innerWidth = (Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth) - spacing.lg * 2;
  const tileWidth = (innerWidth - spacing.sm) / 2;
  const router = useRouter();
  const styles = makeStyles(c, spacing, radius);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.label}>Explore</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Tools</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          Practices, references, and Thea's building blocks — reach for what you need.
        </Text>

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

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    sectionLabel: {
      color: c.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
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
