import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { loadDoshaResult } from '../data/user/storage';
import { DoshaWheel, DOSHA_COLORS } from '../components/DoshaWheel';
import { useDrawer } from '../context/DrawerContext';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const SETTINGS = [
  { label: 'Reminders',           Icon: BellIcon,     soon: true  },
  { label: 'My dosha & intake',   Icon: LeafIcon,     soon: false },
  { label: 'Saved & favourites',  Icon: HeartIcon,    soon: true  },
  { label: 'Help & guidance',     Icon: QuestionIcon, soon: true  },
];

export default function You() {
  const { theme: { colors: c, spacing } } = useTheme();
  const router = useRouter();
  const { open: openDrawer } = useDrawer();
  const [result, setResult] = useState(null);

  useEffect(() => { loadDoshaResult().then(r => setResult(r || false)); }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <Pressable style={styles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>
        <Text style={[styles.hTitle, { color: c.text }]}>You</Text>
        <Pressable style={styles.hBtn}><SlidersIcon color={c.text} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { borderColor: c.border }]}>
            <View style={[styles.avatarInner, { backgroundColor: c.surfaceAlt }]}>
              <ImgPlaceholder color={c.textMuted} />
            </View>
            <View style={[styles.editBadge, { backgroundColor: c.accent, borderColor: c.bg }]}>
              <PenIcon color="#FBF9F4" size={10} />
            </View>
          </View>
          <Text style={[styles.name, { color: c.text }]}>Lindsey</Text>
          <Text style={[styles.tagline, { color: c.textMedium }]}>Wellness is a return to you.</Text>
        </View>

        {/* Dosha wheel — only shown after quiz is taken */}
        {result && result.scores && (
          <View style={[styles.wheelCard, { backgroundColor: c.surface, ...card }]}>
            <Text style={[styles.wheelLabel, { color: c.textMuted }]}>Your Constitution</Text>
            <DoshaWheel scores={result.scores} primary={result.dosha} size={180} />
            <Pressable
              style={[styles.retakeBtn, { borderColor: c.border }]}
              onPress={() => router.push('/quiz')}
            >
              <Text style={[styles.retakeBtnText, { color: c.textMuted }]}>Retake quiz</Text>
            </Pressable>
          </View>
        )}

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {[
            { Icon: SunIcon,    value: '12', label: 'Day streak'  },
            { Icon: LotusIcon,  value: '84', label: 'Practices'   },
            { Icon: LeafIcon,   value: '0',  label: 'In ritual'   },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: c.surface, ...card }]}>
              <s.Icon color={c.textMuted} size={18} />
              <Text style={[styles.statValue, { color: c.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: c.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View style={[styles.progressCard, { backgroundColor: c.surface, ...card, marginBottom: 28 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.progressTitle, { color: c.text }]}>Your progress</Text>
            <Text style={{ color: c.textMuted, fontFamily: 'Inter_400Regular', fontSize: 12 }}>This month</Text>
          </View>
          <Text style={[styles.progressPct, { color: c.accent }]}>
            78%{'  '}
            <Text style={[styles.progressOf, { color: c.textMedium }]}>of your rituals kept</Text>
          </Text>
          <View style={[styles.track, { backgroundColor: c.border, marginTop: 10 }]}>
            <View style={[styles.fill, { backgroundColor: c.accent, width: '78%' }]} />
          </View>
          <Text style={[styles.progressNote, { color: c.textMedium }]}>You're showing up for you. Keep going.</Text>
        </View>

        {/* Settings */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12 }]}>Settings</Text>
        <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
          {SETTINGS.map((item, idx) => (
            <Pressable
              key={item.label}
              style={[styles.settingsRow, idx < SETTINGS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
              onPress={() => { if (!item.soon && item.label === 'My dosha & intake') router.push('/quiz'); }}
            >
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <item.Icon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: item.soon ? c.textMuted : c.text }]}>{item.label}</Text>
              {item.soon
                ? <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
                : <ChevronIcon color={c.textMuted} />}
            </Pressable>
          ))}
        </View>

        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: c.accentSoft, fontSize: 15, marginBottom: 6 }}>❧</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted }}>L. GLOW</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ImgPlaceholder({ color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth={1.3} />
        <Circle cx="8" cy="10" r="2" stroke={color} strokeWidth={1.3} />
        <Path d="M2 17l5-4 4 4 3-3 6 5" stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
      </Svg>
      <Text style={{ color, fontSize: 9, marginTop: 5, fontFamily: 'Inter_400Regular' }}>portrait</Text>
    </View>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function MenuIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>;
}
function SlidersIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx="8" cy="6" r="2" fill={color} />
    <Circle cx="16" cy="12" r="2" fill={color} />
    <Circle cx="10" cy="18" r="2" fill={color} />
  </Svg>;
}
function PenIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" stroke={color} strokeWidth={1.4} />
    <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function SunIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function LotusIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={1.4} />
    <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function LeafIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} />
    <Path d="M12 21V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function BellIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 10a6 6 0 0 1 12 0c0 3 1.5 5 2 6H4c.5-1 2-3 2-6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M10 20a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function HeartIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function QuestionIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.4} />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function ChevronIcon({ color }) {
  return <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:   { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },

  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  avatarRing:    { width: 88, height: 88, borderRadius: 44, borderWidth: 1.5, position: 'relative', marginBottom: 12 },
  avatarInner:   { width: 88, height: 88, borderRadius: 44, overflow: 'hidden' },
  editBadge:     { position: 'absolute', bottom: 0, right: 0, width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  name:          { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 28, lineHeight: 36 },
  tagline:       { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 15.5, fontStyle: 'italic', marginTop: 2 },

  wheelCard:     { borderRadius: 26, padding: 20, alignItems: 'center', marginBottom: 14 },
  wheelLabel:    { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98, textTransform: 'uppercase', marginBottom: 20 },
  retakeBtn:     { marginTop: 16, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999, borderWidth: 1 },
  retakeBtnText: { fontFamily: 'Inter_400Regular', fontSize: 13 },

  statCard:  { flex: 1, borderRadius: 26, padding: 15, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 25, lineHeight: 32 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', lineHeight: 15 },

  progressCard:  { borderRadius: 26, padding: 20 },
  progressTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 24 },
  progressPct:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 34, lineHeight: 40, color: '#9A5151' },
  progressOf:    { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  track:         { height: 4, borderRadius: 2 },
  fill:          { height: 4, borderRadius: 2 },
  progressNote:  { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 14.5, fontStyle: 'italic', marginTop: 10, lineHeight: 20 },

  sectionH: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
  settingsList: { borderRadius: 26, overflow: 'hidden' },
  settingsRow:  { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  settingsIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  settingsLabel:{ fontFamily: 'Inter_500Medium', fontSize: 15, flex: 1 },
});
