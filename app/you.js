import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { loadDoshaResult, loadGunaResult, loadTongueResult, loadUserName, loadRecentCheckins } from '../data/user/storage';
import { tongueReadings } from '../data/content/tongueCheck';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { DoshaWheel, DOSHA_COLORS } from '../components/DoshaWheel';
import { useDrawer } from '../context/DrawerContext';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

function computeStats(checkins) {
  const total = checkins.length;

  // Check-ins in the last 7 days (rolling window)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const thisWeek = checkins.filter(c => c.date >= cutoffStr).length;

  // Consecutive day streak going backwards from today (or yesterday if today not yet done)
  const dates = new Set(checkins.map(c => c.date));
  const today = new Date().toISOString().slice(0, 10);
  const cursor = new Date();
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1); // grace: don't break streak if today isn't done yet
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = cursor.toISOString().slice(0, 10);
    if (!dates.has(d)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { streak, total, thisWeek };
}

const SETTINGS = [
  { label: 'Reminders',           Icon: BellIcon,     soon: true  },
  { label: 'Help & guidance',     Icon: QuestionIcon, soon: true  },
];

export default function You() {
  const { theme: { colors: c, spacing } } = useTheme();
  const router = useRouter();
  const { open: openDrawer } = useDrawer();
  const { user, signOut } = useAuth();
  const [result, setResult]         = useState(null);
  const [gunaResult, setGunaResult] = useState(null);
  const [tongueResult, setTongueResult] = useState(null);
  const [stats, setStats]           = useState({ streak: 0, total: 0, thisWeek: 0 });
  const [userName, setUserName]     = useState('');
  const [consented, setConsented]   = useState(false);
  const [consentBusy, setConsentBusy] = useState(false);

  useEffect(() => {
    loadDoshaResult().then(r => setResult(r || false));
    loadGunaResult().then(r => setGunaResult(r));
    loadTongueResult().then(r => setTongueResult(r));
    loadUserName().then(n => { if (n) setUserName(n); });
    loadRecentCheckins(365).then(list => {
      setStats(computeStats(list));
    });
  }, []);

  useEffect(() => {
    if (!user) { setConsented(false); return; }
    supabase.from('users').select('consented_to_practitioner_view').eq('id', user.id).single()
      .then(({ data }) => setConsented(!!data?.consented_to_practitioner_view));
  }, [user]);

  async function toggleConsent(next) {
    setConsented(next); // optimistic — RLS already lets a user update their own row
    setConsentBusy(true);
    const { error } = await supabase.from('users').update({ consented_to_practitioner_view: next }).eq('id', user.id);
    if (error) setConsented(!next); // revert on failure
    setConsentBusy(false);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <Pressable style={styles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>
        <Text style={[styles.hTitle, { color: c.text }]}>You</Text>
        {/* Right header slot — was an unwired filter/sliders icon (dead tap, removed July 2026).
            Reserved for a future per-screen action, possibly search (see roadmap #44). Spacer
            keeps the title centered until something real goes here.
            <Pressable style={styles.hBtn}><SlidersIcon color={c.text} /></Pressable> */}
        <View style={styles.hBtn} />
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
          <Text style={[styles.name, { color: c.text }]}>{userName || 'You'}</Text>
          <Text style={[styles.tagline, { color: c.textMedium }]}>Wellness is a return to you.</Text>
          {user && (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 4 }} numberOfLines={1}>
              {user.email}
            </Text>
          )}
        </View>

        {/* Dosha wheel — only shown after quiz is taken */}
        {result && result.scores && (() => {
          const total = (result.scores.vata + result.scores.pitta + result.scores.kapha) || 1;
          const pcts = {
            vata:  Math.round((result.scores.vata  / total) * 100),
            pitta: Math.round((result.scores.pitta / total) * 100),
            kapha: Math.round((result.scores.kapha / total) * 100),
          };
          return (
            <View style={[styles.wheelCard, { backgroundColor: c.surface, ...card }]}>
              <Text style={[styles.wheelLabel, { color: c.textMuted }]}>Your Constitution</Text>
              <DoshaWheel scores={result.scores} primary={result.dosha} size={180} />

              {/* Three-dosha percentage breakdown */}
              <View style={styles.doshaBreakdown}>
                {[
                  { key: 'vata',  label: 'Vata'  },
                  { key: 'pitta', label: 'Pitta' },
                  { key: 'kapha', label: 'Kapha' },
                ].map(({ key, label }) => (
                  <View key={key} style={[styles.doshaStat, { backgroundColor: c.surfaceAlt }]}>
                    <Text style={[styles.doshaStatPct, { color: DOSHA_COLORS[key] }]}>{pcts[key]}%</Text>
                    <Text style={[styles.doshaStatName, { color: c.textMuted }]}>{label}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={[styles.retakeBtn, { borderColor: c.border }]}
                onPress={() => router.push('/quiz')}
              >
                <Text style={[styles.retakeBtnText, { color: c.textMuted }]}>Retake quiz</Text>
              </Pressable>
            </View>
          );
        })()}

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {[
            { Icon: SunIcon,   value: stats.streak,   label: 'Day streak' },
            { Icon: LotusIcon, value: stats.total,    label: 'Check-ins'  },
            { Icon: LeafIcon,  value: stats.thisWeek, label: 'This week'  },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: c.surface, ...card }]}>
              <s.Icon color={c.textMuted} size={18} />
              <Text style={[styles.statValue, { color: c.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: c.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Your Assessments — dosha/guna results + intake form live here now, not just the drawer */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12 }]}>Your Assessments</Text>
        {(() => {
          const rows = [
            { label: 'My Dosha',        Icon: LeafIcon, dosha: true },
            { label: 'Guna Assessment', Icon: GunaIcon, guna: true },
            { label: 'Tongue Check',    Icon: TongueIcon, tongue: true },
            { label: 'My Intake Form',  Icon: ClipboardIcon, intake: true },
            ...(user ? [{ label: 'Share with Thea', Icon: ShareIcon, share: true }] : []),
          ];
          return (
            <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
              {rows.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={[styles.settingsRow, idx < rows.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
                  disabled={item.share}
                  onPress={() => {
                    if (item.dosha) router.push('/quiz');
                    if (item.intake) router.push('/intake');
                    if (item.guna) {
                      if (gunaResult) {
                        router.push({
                          pathname: '/guna-result',
                          params: {
                            dominant: gunaResult.dominant,
                            sattva: gunaResult.scores?.sattva ?? 0,
                            rajas:  gunaResult.scores?.rajas  ?? 0,
                            tamas:  gunaResult.scores?.tamas  ?? 0,
                          },
                        });
                      } else {
                        router.push('/guna-quiz');
                      }
                    }
                    if (item.tongue) {
                      if (tongueResult) {
                        router.push({
                          pathname: '/tongue-result',
                          params: {
                            shape: tongueResult.details?.shape, size: tongueResult.details?.size,
                            color: tongueResult.details?.color, coating: tongueResult.details?.coating,
                            ama: tongueResult.details?.amaLevel ?? 0,
                            signs: (tongueResult.details?.signs ?? []).join(','),
                          },
                        });
                      } else {
                        router.push('/tongue-check');
                      }
                    }
                  }}
                >
                  <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                    <item.Icon color={c.textMuted} size={15} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingsLabel, { color: c.text, flex: 0 }]}>{item.label}</Text>
                    {item.guna && gunaResult && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 1 }}>
                        {gunaResult.dominant.charAt(0).toUpperCase() + gunaResult.dominant.slice(1)} dominant
                      </Text>
                    )}
                    {item.share && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 1 }}>
                        {consented ? 'Thea can see your intake form' : 'Your intake form stays private'}
                      </Text>
                    )}
                    {item.tongue && tongueResult && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 1 }}>
                        {(tongueReadings[tongueResult.reading] ?? tongueReadings.balanced).name}
                      </Text>
                    )}
                  </View>
                  {item.share
                    ? <Switch value={consented} onValueChange={toggleConsent} disabled={consentBusy} />
                    : <ChevronIcon color={c.textMuted} />}
                </Pressable>
              ))}
            </View>
          );
        })()}

        {/* Settings */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>Settings</Text>
        <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
          {SETTINGS.map((item, idx) => (
            <Pressable
              key={item.label}
              style={[styles.settingsRow, idx < SETTINGS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
              onPress={() => {}}
            >
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <item.Icon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: c.textMuted }]}>{item.label}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
            </Pressable>
          ))}
        </View>

        {/* Account */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>Account</Text>
        <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
          {user ? (
            <Pressable
              style={styles.settingsRow}
              onPress={signOut}
            >
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <SignOutIcon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: c.text }]}>Sign out</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={[styles.settingsRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
                onPress={() => router.push('/login')}
              >
                <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                  <PersonIcon color={c.textMuted} size={15} />
                </View>
                <Text style={[styles.settingsLabel, { color: c.text }]}>Sign in</Text>
                <ChevronIcon color={c.textMuted} />
              </Pressable>
              <Pressable
                style={styles.settingsRow}
                onPress={() => router.push('/signup')}
              >
                <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                  <PersonIcon color={c.accent} size={15} />
                </View>
                <Text style={[styles.settingsLabel, { color: c.accent }]}>Create account</Text>
                <ChevronIcon color={c.accent} />
              </Pressable>
            </>
          )}
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
function PersonIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
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
function ShareIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="12" r="2.5" stroke={color} strokeWidth={1.4} />
    <Circle cx="18" cy="6" r="2.5" stroke={color} strokeWidth={1.4} />
    <Circle cx="18" cy="18" r="2.5" stroke={color} strokeWidth={1.4} />
    <Path d="M8.2 10.8 15.8 7.2M8.2 13.2 15.8 16.8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function ClipboardIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" stroke={color} strokeWidth={1.4} />
    <Path d="M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function SignOutIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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
  doshaBreakdown:  { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  doshaStat:       { flex: 1, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 4 },
  doshaStatPct:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 30 },
  doshaStatName:   { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  retakeBtn:     { marginTop: 14, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999, borderWidth: 1 },
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
