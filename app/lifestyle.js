import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { useViewMode } from '../context/ViewModeContext';
import { card } from '../theme/index';
import Svg, { Path, Circle } from 'react-native-svg';

const DAILY = [
  { href: '/checkin',     title: 'Daily Check-in',    desc: 'Body, mind, energy — where you are today', Icon: CheckCircleIcon, dark: false },
  { href: '/tongue-check',title: 'Tongue Check',      desc: 'Morning body read before coffee',           Icon: TongueIcon,      dark: false },
  { href: '/journal',     title: 'Journal',            desc: 'Reflect, release, process',                 Icon: PenIcon,         dark: false },
  { href: '/affirmations',title: 'Affirmations',       desc: 'Today\'s anchor in your dosha',             Icon: StarIcon,        dark: false },
];

const COMING_SOON = [
  { title: 'Morning Ritual',   desc: 'Dinacharya — the sequence that sets your whole day.' },
  { title: 'Evening Wind-down',desc: 'The janitor hour. 10pm–2am is when the house cleans itself.' },
  { title: 'Daily Routine',    desc: 'A dosha-tuned rhythm for waking, eating, moving, resting.' },
  { title: 'Sleep Guidance',   desc: 'Night practices for deep, restorative rest.' },
];

export default function Lifestyle() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const { open: openDrawer } = useDrawer();
  const { isWebMode } = useViewMode();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        {isWebMode ? <View style={styles.hBtn} /> : <Pressable style={styles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>}
        <Text style={[styles.hTitle, { color: c.text }]}>Lifestyle</Text>
        <View style={styles.hBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: c.textMedium }]}>How you live — daily rhythms, rituals, and awareness.</Text>

        {/* Hero image */}
        <View style={[styles.hero, { backgroundColor: c.surfaceAlt, overflow: 'hidden', marginBottom: 24 }]}>
          <Image source={require('../assets/botanicals-warm.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        {/* Daily practices */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Daily practices</Text>
        <View style={styles.grid}>
          {DAILY.map(item => (
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

function CheckCircleIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
    <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

function TongueIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3C8.5 3 6 6 6 9.5v5a6 6 0 0 0 12 0v-5C18 6 15.5 3 12 3Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M12 3v9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

function PenIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" stroke={color} strokeWidth={1.4} />
    <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}

function StarIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },

  subtitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, fontStyle: 'italic', lineHeight: 22, marginBottom: 16 },

  hero: { height: 160, borderRadius: 22, marginBottom: 0 },

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
