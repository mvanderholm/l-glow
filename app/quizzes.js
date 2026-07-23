import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import BackButton, { smartBack } from '../components/BackButton';
import SearchButton from '../components/SearchButton';
import Svg, { Path } from 'react-native-svg';

// Quizzes — one nav item in the hamburger drawer, replacing the six
// individual assessment links that used to live there directly (Matt's
// follow-up the same day, July 21 2026). Same "quick access, always start/
// retake" behavior as those links had — doesn't branch to a saved result
// screen the way the You tab rows do (see docs/roadmap.md #52's note on
// this deliberate simplification). You tab's "Your Assessments" section is
// untouched; this is a second, faster-to-reach entry point.
//
// Back button uses smartBack() rather than a bare router.back() — this
// screen (and Prakriti/Vikriti's hubs) briefly had no back control at all,
// relying on the native Stack header's auto-back, which only appears when
// there's real navigation history. A direct URL load, refresh, or shared
// link on the deployed site has none, so that was a dead end in production
// (found live, July 2026). headerShown:false in _layout.js now, so this is
// the only back control — no risk of the duplicate that got this removed
// the first time.

const ROWS = [
  { label: 'My Dosha',        Icon: LeafIcon,     href: '/quiz' },
  { label: 'Agni Assessment', Icon: FireIcon,     href: '/agni-quiz' },
  { label: 'Guna Assessment', Icon: GunaIcon,      href: '/guna-quiz' },
  { label: 'Tongue Check',    Icon: TongueIcon,   href: '/tongue-check' },
  { label: 'Prakriti',        Icon: PrakritiIcon, href: '/prakriti' },
  { label: 'Vikriti',         Icon: VikritiIcon,  href: '/vikriti' },
];

export default function Quizzes() {
  const { theme: { colors: c } } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[s.topHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={() => smartBack('/')} color={c.text} />
        <Text style={[s.topHeaderTitle, { color: c.text }]}>Quizzes</Text>
        <SearchButton color={c.text} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View style={[s.list, { backgroundColor: c.surface, ...card }]}>
          {ROWS.map((item, idx) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.href)}
              style={[s.row, idx < ROWS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
            >
              <View style={[s.iconWrap, { backgroundColor: c.surfaceAlt }]}>
                <item.Icon color={c.textMuted} size={15} />
              </View>
              <Text style={[s.rowLabel, { color: c.text }]}>{item.label}</Text>
              <ChevronIcon color={c.textMuted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChevronIcon({ color }) {
  return <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
function LeafIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} />
    <Path d="M12 21V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function FireIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 2 2.5 2 4.5A5 5 0 0 1 7 14.5C7 9 12 7 12 2Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function GunaIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3 L20 18 L4 18 Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 8 L17 18 L7 18 Z" stroke={color} strokeWidth={0.8} strokeLinejoin="round" opacity="0.5" />
  </Svg>;
}
function TongueIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3c3 0 5 2 5 5.5S15.5 19 12 21C8.5 19 7 12.5 7 8.5S9 3 12 3Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 9v9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function PrakritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21V11" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M12 11c0-4 3-6 7-6 0 4-2 7-7 7Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 14c0-3.5-2.5-5.5-6-5.5 0 3.5 2 6 6 6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function VikritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h3.5l2-6 3 12 2-9 1.5 3H21" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const s = StyleSheet.create({
  topHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  topHeaderTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },

  list: { borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15.5 },
});
