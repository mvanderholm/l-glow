import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import {
  loadDoshaResult, loadGunaResult, loadTongueResult, loadAgniResult, loadRecentCheckins, loadPrakritiProgress, loadVikritiProgress,
  loadUserName,
} from '../data/user/storage';
import { loadAllJournalEntries } from './journal';
import { computeVikritiScores } from '../data/user/vikritiScoring';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { SECTIONS, sectionProgress, loadIntake } from './intake';
import Constitution from '../components/Constitution';
import LogoMark from '../components/LogoMark';
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

export default function You() {
  const { theme: { colors: c, spacing } } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [result, setResult]         = useState(null);
  const [gunaResult, setGunaResult] = useState(null);
  const [tongueResult, setTongueResult] = useState(null);
  const [agniResult, setAgniResult] = useState(null);
  const [prakritiProgress, setPrakritiProgress] = useState(null);
  const [vikritiProgress, setVikritiProgress]   = useState(null);
  const [vikritiScores, setVikritiScores] = useState(undefined); // undefined = loading, null = signed out or not enough data
  const [intake, setIntake]         = useState(null);
  const [stats, setStats]           = useState({ streak: 0, total: 0, thisWeek: 0 });
  const [hungerBars, setHungerBars] = useState([]); // last 7 check-ins' hunger values, oldest first
  const [journalEntries, setJournalEntries] = useState(null);
  const [userName, setUserName]     = useState('');
  const [manualAvailable, setManualAvailable] = useState(false);

  useEffect(() => {
    loadDoshaResult().then(r => setResult(r || false));
    loadGunaResult().then(r => setGunaResult(r));
    loadTongueResult().then(r => setTongueResult(r));
    loadAgniResult().then(r => setAgniResult(r));
    loadPrakritiProgress().then(setPrakritiProgress);
    loadVikritiProgress().then(setVikritiProgress);
    loadIntake().then(setIntake);
    loadUserName().then(n => { if (n) setUserName(n); });
    loadAllJournalEntries().then(setJournalEntries);
    loadRecentCheckins(365).then(list => {
      setStats(computeStats(list));
      setHungerBars(list.slice(0, 7).reverse().map(c => c.hunger ?? 3));
    });
  }, []);

  useEffect(() => {
    if (!user) { setVikritiScores(null); return; }
    computeVikritiScores(user.id).then(setVikritiScores);
  }, [user]);

  // RLS on user_manuals only returns a row to its owner when status =
  // 'approved' — so "did this query return anything" already is the
  // readiness check, no separate status field to read client-side.
  useEffect(() => {
    if (!user) { setManualAvailable(false); return; }
    supabase.from('user_manuals').select('id').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setManualAvailable(!!data));
  }, [user]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 }}>
        <LogoMark size={36} compact />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { borderColor: c.border }]}>
            <View style={[styles.avatarInner, { backgroundColor: c.surfaceAlt }]}>
              <ImgPlaceholder color={c.textMuted} />
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

        {/* Your Constitution — Prakriti bars + Vikriti, extracted from
            journey.js's AyurvedaTab (nav restructure, Move 3). */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <Text style={[styles.sectionH, { color: c.text }]}>Your Constitution</Text>
          {result && result.dosha && (
            <Text style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: c.accent, fontFamily: 'Inter_600SemiBold' }}>
              {result.dosha}
            </Text>
          )}
        </View>
        <Constitution doshaResult={result} vikritiScores={vikritiScores} colors={c} />

        <View style={{ marginTop: 24 }} />

        {/* Assessments — one summary row linking to the consolidated
            /assessments screen (nav restructure, Move 2), replacing the
            flat 6-row list this used to be. */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12 }]}>Assessments</Text>
        {(() => {
          const doshaDone = !!(result && prakritiProgress?.foundation);
          const vikritiDone = !!vikritiProgress && Object.values(vikritiProgress).some(Boolean);
          const intakeFilled = intake ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intake)?.filled || 0), 0) : 0;
          const intakeTotal  = intake ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intake)?.total  || 0), 0) : 0;
          const intakeDone = intakeTotal > 0 && intakeFilled === intakeTotal;

          const items = [
            { label: 'Dosha',        done: doshaDone },
            { label: 'Vikriti',      done: vikritiDone },
            { label: 'Agni',         done: !!agniResult },
            { label: 'Guna',         done: !!gunaResult },
            { label: 'Tongue Check', done: !!tongueResult },
            { label: 'Intake Form',  done: intakeDone },
          ];
          const doneCount = items.filter(i => i.done).length;
          const missing = items.filter(i => !i.done).map(i => i.label);
          const subtitle = missing.length === 0
            ? 'All six complete'
            : `${doneCount} complete · ${missing.length === 1 ? missing[0] : `${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}`} still open`;

          return (
            <Pressable style={[styles.settingsList, { backgroundColor: c.surface, ...card }]} onPress={() => router.push('/assessments')}>
              <View style={[styles.settingsRow]}>
                <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                  <PrakritiIcon color={c.textMuted} size={15} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingsLabel, { color: c.text, flex: 0 }]}>All six assessments</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 3 }}>{subtitle}</Text>
                </View>
                <ChevronIcon color={c.textMuted} />
              </View>
            </Pressable>
          );
        })()}

        {/* History — stats + a compact 7-day appetite sparkline (extracted
            from journey.js's HabitsTab, simplified to match the mockup's
            card instead of the full dimension-picker chart, which is still
            reachable via Activity log → /activity) + Journal/Activity rows. */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>History</Text>
        <View style={[styles.historyCard, { backgroundColor: c.surface, ...card }]}>
          <View style={{ flexDirection: 'row' }}>
            {[
              { value: stats.total, label: 'Check-ins' },
              { value: journalEntries?.length ?? 0, label: 'Journal entries' },
              { value: stats.total ? Math.max(stats.total, stats.thisWeek) : 0, label: 'Days tracked' },
            ].map(s => (
              <View key={s.label} style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, color: c.text }}>{s.value}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>{s.label}</Text>
              </View>
            ))}
          </View>
          {hungerBars.length > 0 && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 52, marginTop: 14 }}>
                {hungerBars.map((v, i) => (
                  <View key={i} style={{ flex: 1, height: `${20 + (v / 5) * 80}%`, borderRadius: 3, backgroundColor: c.accent, opacity: 0.35 + (v / 5) * 0.5 }} />
                ))}
              </View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11.5, color: c.textMuted, marginTop: 8 }}>
                Nourishment appetite · last {hungerBars.length} check-ins
              </Text>
            </>
          )}
        </View>

        <View style={[styles.settingsList, { backgroundColor: c.surface, ...card, marginTop: 10 }]}>
          <Pressable style={[styles.settingsRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]} onPress={() => router.push('/journal')}>
            <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <JournalIcon color={c.textMuted} size={15} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingsLabel, { color: c.text, flex: 0 }]}>Journal</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 3 }}>
                {journalEntries?.length ? `Last entry ${new Date(journalEntries[0].date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : 'No entries yet'}
              </Text>
            </View>
            <ChevronIcon color={c.textMuted} />
          </Pressable>
          <Pressable style={styles.settingsRow} onPress={() => router.push('/activity')}>
            <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <ActivityIcon color={c.textMuted} size={15} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingsLabel, { color: c.text, flex: 0 }]}>Activity log</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 3 }}>Every check-in, intention, and practice · 90 days</Text>
            </View>
            <ChevronIcon color={c.textMuted} />
          </Pressable>
        </View>

        {/* Your User's Manual — AI-drafted from everything you've shared, in
            Thea's voice, but only ever visible once she's reviewed and
            approved it. RLS on user_manuals returns a row to its owner only
            when status='approved', so manualAvailable already is the
            readiness check. */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>Your User's Manual</Text>
        {manualAvailable ? (
          <Pressable style={[styles.manualCard, { backgroundColor: c.surface, ...card }]} onPress={() => router.push('/manual')}>
            <Text style={[styles.manualExcerpt, { color: c.text }]}>
              "Your body has been handing you pieces of your user's manual your entire life, hoping you'd slow down long enough to notice."
            </Text>
            <Text style={[styles.manualLink, { color: c.accent }]}>Read yours →</Text>
          </Pressable>
        ) : (
          <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
            <View style={styles.settingsRow}>
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <ManualIcon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: c.textMuted }]}>Your User's Manual</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
            </View>
          </View>
        )}

        {/* Settings & account — consolidated to one row linking to
            /settings (nav restructure, Move 3), matching the mockup;
            personal details, reminders, help, the practitioner-only hub
            link, and sign in/out all live there now. */}
        <View style={{ marginTop: 28 }}>
          <Pressable style={[styles.settingsList, { backgroundColor: c.surface, ...card }]} onPress={() => router.push('/settings')}>
            <View style={styles.settingsRow}>
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <GearIcon color={c.textMuted} size={15} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingsLabel, { color: c.text, flex: 0 }]}>Settings & account</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 3 }}>Personal details, reminders, sign out</Text>
              </View>
              <ChevronIcon color={c.textMuted} />
            </View>
          </Pressable>
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

function ChevronIcon({ color }) {
  return <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function JournalIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H19v14H6.5a2 2 0 0 0-2 2z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M8 8h7M8 11.5h5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function GearIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.4} />
    <Path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.5 15a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7 2 2 0 1 1 0 4h-.2z" stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
  </Svg>;
}
function PrakritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21V11" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M12 11c0-4 3-6 7-6 0 4-2 7-7 7Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 14c0-3.5-2.5-5.5-6-5.5 0 3.5 2 6 6 6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function ActivityIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.4} />
    <Path d="M12 7.5V12l3 2" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function ManualIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 4.5C5 3.7 5.7 3 6.5 3H18a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6.5c-.8 0-1.5-.7-1.5-1.5v-14Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M5 17.5C5 16.7 5.7 16 6.5 16H19" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M8.5 7h7M8.5 10h7" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
  </Svg>;
}
const styles = StyleSheet.create({

  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  avatarRing:    { width: 88, height: 88, borderRadius: 44, borderWidth: 1.5, position: 'relative', marginBottom: 12 },
  avatarInner:   { width: 88, height: 88, borderRadius: 44, overflow: 'hidden' },
  name:          { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 28, lineHeight: 36 },
  tagline:       { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 15.5, fontStyle: 'italic', marginTop: 2 },

  historyCard: { borderRadius: 22, padding: 18 },

  sectionH: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
  manualCard:    { borderRadius: 26, padding: 20 },
  manualExcerpt: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 15.5, fontStyle: 'italic', lineHeight: 22, marginBottom: 12 },
  manualLink:    { fontFamily: 'Inter_600SemiBold', fontSize: 13.5 },
  settingsList: { borderRadius: 26, overflow: 'hidden' },
  settingsRow:  { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  settingsIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  settingsLabel:{ fontFamily: 'Inter_500Medium', fontSize: 15, flex: 1 },
});
