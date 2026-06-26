import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { card } from '../theme/index';
import Svg, { Path, Circle } from 'react-native-svg';

const PRACTICES = [
  { href: '/breathwork',  title: 'Breathwork',   desc: 'Pranayama practices', Icon: BreathIcon, dark: false },
  { href: '/meditation',  title: 'Meditation',   desc: 'Guided & silent',     Icon: LotusIcon,  dark: false },
  { href: '/selfmassage', title: 'Self Massage',  desc: 'Abhyanga rituals',    Icon: HandIcon,   dark: false },
];

const ASSESSMENTS = [
  { href: '/tongue-check', title: 'Tongue Check', desc: 'An ayurvedic morning read — what your tongue is telling you.', Icon: TongueIcon },
];

const COMING_SOON = [
  { title: 'Asana & Postures', desc: 'Dosha-tuned movement sequences — Vata, Pitta, and Kapha each have their own medicine.' },
  { title: 'Pulse Reading',    desc: 'Seasonal self-assessment. Thea\'s content coming.' },
];

export default function Movement() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const { open: openDrawer } = useDrawer();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <Pressable style={styles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>
        <Text style={[styles.hTitle, { color: c.text }]}>Movement</Text>
        <View style={styles.hBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: c.textMedium }]}>How you move — breath, stillness, body care, and body literacy.</Text>

        {/* Practices grid */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Practices</Text>
        <View style={styles.grid}>
          {PRACTICES.map(item => (
            <Pressable
              key={item.href}
              style={({ pressed }) => [styles.tile, { backgroundColor: c.surface, opacity: pressed ? 0.85 : 1, ...card }]}
              onPress={() => router.push(item.href)}
            >
              <View style={[styles.iconCircle, { backgroundColor: c.surfaceAlt }]}>
                <item.Icon color={c.textMuted} size={20} />
              </View>
              <Text style={[styles.tileTitle, { color: c.text }]}>{item.title}</Text>
              <Text style={[styles.tileDesc, { color: c.textMuted }]}>{item.desc}</Text>
            </Pressable>
          ))}
        </View>

        {/* Self-assessments */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Self-assessments</Text>
        {ASSESSMENTS.map(item => (
          <Pressable
            key={item.href}
            style={({ pressed }) => [styles.rowCard, { backgroundColor: c.surface, opacity: pressed ? 0.85 : 1, ...card }]}
            onPress={() => router.push(item.href)}
          >
            <View style={[styles.rowIcon, { backgroundColor: c.surfaceAlt }]}>
              <item.Icon color={c.textMuted} size={20} />
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, { color: c.text }]}>{item.title}</Text>
              <Text style={[styles.rowDesc, { color: c.textMuted }]}>{item.desc}</Text>
            </View>
            <ChevronIcon color={c.textMuted} />
          </Pressable>
        ))}

        {/* Coming soon */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Coming soon</Text>
        {COMING_SOON.map(item => (
          <View
            key={item.title}
            style={[styles.soonRow, { backgroundColor: c.surface, borderColor: c.border, ...card }]}
          >
            <View style={styles.soonBody}>
              <Text style={[styles.soonTitle, { color: c.textMuted }]}>{item.title}</Text>
              <Text style={[styles.soonDesc, { color: c.textMuted }]}>{item.desc}</Text>
            </View>
            <Text style={[styles.soonBadge, { color: c.textMuted }]}>soon</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function MenuIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>;
}

function ChevronIcon({ color }) {
  return <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

function BreathIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 8c3 0 5 3 5 3s2-3 5-3 5 3 5 3" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M3 14c2 0 4 2 4 2s2-2 5-2 5 2 5 2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}

function LotusIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={1.4} />
    <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}

function HandIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 11V8a2 2 0 0 0-4 0v3M14 8V6a2 2 0 0 0-4 0v2M10 7V6a2 2 0 0 0-4 0v8l-1.5-2a1.5 1.5 0 0 0-2.1 2.1L6 19a6 6 0 0 0 6 0 6 6 0 0 0 6-5v-3a2 2 0 0 0-4 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

function TongueIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3C8.5 3 6 6 6 9.5v5a6 6 0 0 0 12 0v-5C18 6 15.5 3 12 3Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M12 3v9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },

  subtitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, fontStyle: 'italic', lineHeight: 22, marginBottom: 8 },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98,
    textTransform: 'uppercase', marginTop: 28, marginBottom: 12,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    flexBasis: '47.5%', flexGrow: 1, maxWidth: '50%',
    borderRadius: 18, padding: 18, paddingBottom: 16, minHeight: 120,
  },
  iconCircle: { width: 39, height: 39, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, lineHeight: 22 },
  tileDesc:   { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 3 },

  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, padding: 16, marginBottom: 10 },
  rowIcon: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowBody: { flex: 1 },
  rowTitle:{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, lineHeight: 22 },
  rowDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, marginTop: 3 },

  soonRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.6,
  },
  soonBody:  { flex: 1 },
  soonTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  soonDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18, marginTop: 3 },
  soonBadge: { fontFamily: 'Inter_400Regular', fontSize: 11 },
});
