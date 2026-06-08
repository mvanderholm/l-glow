import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { card } from '../theme/index';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const TOOLS = [
  { href: '/recipes',    title: 'Recipes',      desc: 'Seasonal, dosha-balancing', Icon: BowlIcon,       dark: false },
  { href: '/herbs',      title: 'Herbs',         desc: 'The apothecary',            Icon: LeafIcon,       dark: true  },
  { href: '/breathwork', title: 'Breathwork',    desc: 'Pranayama practices',       Icon: BreathIcon,     dark: false },
  { href: '/meditation', title: 'Meditation',    desc: 'Guided & silent',           Icon: LotusIcon,      dark: false },
  { href: '/selfmassage',title: 'Self Massage',  desc: 'Abhyanga rituals',          Icon: PlusStarIcon,   dark: false },
  { href: '/journal',    title: 'Journaling',    desc: 'Reflect & release',         Icon: PenIcon,        dark: false },
];

const EDUCATION = [
  { href: '/learn', title: 'Learn', desc: 'Ayurveda in Thea\'s voice — essentials through advanced.', Icon: BookIcon },
  { href: '/about', title: 'About Thea', desc: 'Her story, credentials, and the worldview underneath the app.', Icon: PersonIcon },
];

const HERBS_BG = '#566357'; // rgb(86,99,87) — exact from prototype

export default function Tools() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const { open: openDrawer } = useDrawer();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <Pressable style={styles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>
        <Text style={[styles.hTitle, { color: c.text }]}>Tools</Text>
        <Pressable style={styles.hBtn}><InfoIcon color={c.text} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: c.textMedium }]}>Gentle practices for body, mind & spirit.</Text>

        <View style={styles.grid}>
          {TOOLS.map(tool => {
            const bg        = tool.dark ? HERBS_BG : c.surface;
            const textColor = tool.dark ? '#F3ECDF' : c.text;
            const descColor = tool.dark ? 'rgba(243,236,223,0.8)' : c.textMuted;
            const iconBg    = tool.dark ? 'rgba(255,255,255,0.14)' : c.surfaceAlt;
            const iconColor = tool.dark ? '#F3ECDF' : c.textMuted;
            return (
              <Pressable
                key={tool.href}
                style={({ pressed }) => [styles.tile, { backgroundColor: bg, opacity: pressed ? 0.85 : 1, ...card }]}
                onPress={() => router.push(tool.href)}
              >
                {tool.dark && (
                  <View style={styles.tileArrow}>
                    <ChevronIcon color="rgba(243,236,223,0.6)" />
                  </View>
                )}
                <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                  <tool.Icon color={iconColor} size={20} />
                </View>
                <Text style={[styles.tileTitle, { color: textColor }]}>{tool.title}</Text>
                <Text style={[styles.tileDesc, { color: descColor }]}>{tool.desc}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Education section */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Education</Text>
        {EDUCATION.map(item => (
          <Pressable
            key={item.href}
            style={({ pressed }) => [styles.eduCard, { backgroundColor: c.surface, opacity: pressed ? 0.85 : 1, ...card }]}
            onPress={() => router.push(item.href)}
          >
            <View style={[styles.eduIconCircle, { backgroundColor: c.surfaceAlt }]}>
              <item.Icon color={c.textMuted} size={20} />
            </View>
            <View style={styles.eduBody}>
              <Text style={[styles.eduTitle, { color: c.text }]}>{item.title}</Text>
              <Text style={[styles.eduDesc, { color: c.textMuted }]}>{item.desc}</Text>
            </View>
            <ChevronIcon color={c.textMuted} />
          </Pressable>
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

function InfoIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
    <Path d="M12 11v5M12 8.5v.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>;
}

function ChevronIcon({ color }) {
  return <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

function BowlIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3C10 3 7 5 7 8h10c0-3-3-5-5-5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M7 8h10l-1.5 9H8.5L7 8Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M9 13h6" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}

function LeafIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M12 21V10M9 13l3-3 3 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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

function PlusStarIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 4v16M4 12h16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

function PenIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" stroke={color} strokeWidth={1.4} />
    <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}

function BookIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M9 7h7M9 11h5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

function PersonIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },

  subtitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, fontStyle: 'italic', lineHeight: 22, marginBottom: 20 },

  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile:     { flexBasis: '47.5%', flexGrow: 1, maxWidth: '50%', borderRadius: 18, padding: 18, paddingBottom: 16, minHeight: 120 },
  tileArrow:{ position: 'absolute', top: 12, right: 12 },
  iconCircle:{ width: 39, height: 39, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle:{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 23 },
  tileDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 3 },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98,
    textTransform: 'uppercase', marginTop: 28, marginBottom: 12,
  },
  eduCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 18, padding: 16, marginBottom: 10,
  },
  eduIconCircle: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  eduBody:  { flex: 1 },
  eduTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, lineHeight: 22 },
  eduDesc:  { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, marginTop: 3 },
});
