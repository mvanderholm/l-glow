import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { supabase } from '../config/supabase';
import { syncToSupabase } from '../data/user/storage';
import BackButton from '../components/BackButton';
import Svg, { Path } from 'react-native-svg';

const JOURNAL_PREFIX = '@lglow/journal2_';
const KEY = (d = new Date()) => `${JOURNAL_PREFIX}${d.toISOString().slice(0, 10)}`;
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// Pulls the last 90 days of journal entries down from Supabase on a fresh
// device — only fills dates with no local entry yet, never overwrites.
// Exported for AuthContext to call alongside the other hydrate*() functions.
export async function hydrateJournal(userId) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const { data } = await supabase.from('journal_entries')
    .select('date, grateful, showed, tomorrow')
    .eq('user_id', userId).gte('date', cutoff.toISOString().slice(0, 10));
  if (!data?.length) return;
  for (const row of data) {
    const key = KEY(new Date(row.date + 'T12:00:00'));
    if (await AsyncStorage.getItem(key)) continue; // local already has this day
    await AsyncStorage.setItem(key, JSON.stringify({
      grateful: row.grateful || '', showed: row.showed || '', tomorrow: row.tomorrow || '',
    }));
  }
}

// Pushes existing local journal entries up to Supabase on first sign-in —
// only for dates Supabase doesn't already have. Reverse of hydrateJournal(),
// scans full local history (not a bounded window) since this is a one-time
// backlog catch-up, not an ongoing sync. Part of the local→Supabase
// migration, called from AuthContext.
export async function migrateJournal(userId) {
  const allKeys = await AsyncStorage.getAllKeys();
  const journalKeys = allKeys.filter(k => k.startsWith(JOURNAL_PREFIX));
  if (!journalKeys.length) return;
  const pairs = await AsyncStorage.multiGet(journalKeys);
  const { data: existing } = await supabase.from('journal_entries').select('date').eq('user_id', userId);
  const existingDates = new Set((existing || []).map(r => r.date));
  const rows = [];
  for (const [key, raw] of pairs) {
    if (!raw) continue;
    const date = key.replace(JOURNAL_PREFIX, '');
    if (existingDates.has(date)) continue;
    const entry = JSON.parse(raw);
    rows.push({ user_id: userId, date, grateful: entry.grateful || null, showed: entry.showed || null, tomorrow: entry.tomorrow || null });
  }
  if (rows.length) await supabase.from('journal_entries').upsert(rows, { onConflict: 'user_id,date' });
}

const PROMPTS = [
  { id: 'grateful', label: "Today I'm grateful for…" },
  { id: 'showed',   label: "I showed up for myself by…" },
  { id: 'tomorrow', label: "Tomorrow I will…" },
];

const PAST = [
  { month: 'MAY', day: 19, title: 'Morning pages',        excerpt: 'Woke before the sun. The garden was still. I felt the quiet hold me…',           body: 'Woke before the sun. The garden was still. I felt the quiet hold me in a way that the middle of the day never does. No agenda. Just the sound of birds and the smell of earth after rain. I am grateful for mornings that ask nothing of me.' },
  { month: 'MAY', day: 17, title: 'After abhyanga',       excerpt: 'Warm sesame oil, slow strokes toward the heart. My shoulders finally dropped…',   body: 'Warm sesame oil, slow strokes toward the heart. My shoulders finally dropped — I did not realize how high I had been holding them. Twenty minutes. That is all it takes. I showed up for myself today by actually doing the thing instead of just thinking about doing the thing.' },
  { month: 'MAY', day: 14, title: 'A heavy day, softened', excerpt: 'Kapha season is asking me to move. A walk among the eucalyptus helped…',        body: 'Kapha season is asking me to move and I have been resisting it. A walk among the eucalyptus helped. The air was cool and sharp. By the time I got back, the heaviness had lifted enough to breathe. Tomorrow I will try to move before noon instead of waiting until I feel like it.' },
];

export default function Journal() {
  const { theme: { colors: c, spacing } } = useTheme();
  const today = new Date();
  const [answers, setAnswers] = useState({ grateful: '', showed: '', tomorrow: '' });
  const [saved, setSaved] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY(today)).then(v => {
      if (v) try { setAnswers(JSON.parse(v)); } catch {}
    });
  }, []);

  async function save() {
    await AsyncStorage.setItem(KEY(today), JSON.stringify(answers));
    const date = today.toISOString().slice(0, 10);
    await syncToSupabase(userId => supabase.from('journal_entries').upsert({
      user_id: userId,
      date,
      grateful: answers.grateful || null,
      showed: answers.showed || null,
      tomorrow: answers.tomorrow || null,
    }, { onConflict: 'user_id,date' }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <BackButton onPress={() => router.back()} color={c.text} />
        <Text style={[styles.hTitle, { color: c.text }]}>Journal</Text>
        <Pressable style={styles.hBtn}><PlusIcon color={c.text} /></Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Main form card */}
          <View style={[styles.formCard, { backgroundColor: c.surface, ...card }]}>
            {/* Date badge + image row */}
            <View style={styles.topRow}>
              <View style={[styles.dateBadge, { backgroundColor: 'rgba(251,249,244,0.94)', ...card }]}>
                <Text style={[styles.dateMonth, { color: c.accent }]}>{MONTHS[today.getMonth()]}</Text>
                <Text style={[styles.dateDay, { color: c.text }]}>{today.getDate()}</Text>
              </View>
              <View style={[styles.topImage, { backgroundColor: c.surfaceAlt, overflow: 'hidden' }]}>
                <Image source={require('../assets/hero-candles.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
            </View>

            <View style={styles.formBody}>
              <Text style={[styles.formTitle, { color: c.text }]}>Evening Reflection</Text>
              <Text style={[styles.formSub, { color: c.textMuted }]}>A few honest lines before rest.</Text>

              {PROMPTS.map((p, idx) => (
                <View key={p.id}>
                  <View style={[styles.promptBlock, idx > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border, paddingTop: 16 }]}>
                    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
                      <Text style={{ color: c.textMuted, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>+</Text>
                      <Text style={[styles.promptLabel, { color: c.text }]}>{p.label}</Text>
                    </View>
                    <TextInput
                      style={[styles.input, { color: c.text }]}
                      value={answers[p.id]}
                      onChangeText={t => { setAnswers(prev => ({ ...prev, [p.id]: t })); setSaved(false); }}
                      placeholder="Write here..."
                      placeholderTextColor={c.border}
                      multiline
                    />
                  </View>
                  {idx < PROMPTS.length - 1 && <View style={{ height: 16 }} />}
                </View>
              ))}

              <Pressable
                style={[styles.saveBtn, { backgroundColor: saved ? '#7AB878' : c.accent,
                  shadowColor: c.accent, shadowOffset: {width:0,height:6}, shadowOpacity:0.28, shadowRadius:18, elevation:4 }]}
                onPress={save}
              >
                <Text style={styles.saveBtnText}>{saved ? '✓  SAVED' : '✓  SAVE REFLECTION'}</Text>
              </Pressable>
            </View>
          </View>

          {/* Earlier section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, marginBottom: 16 }}>
            <Text style={[styles.sectionH, { color: c.text }]}>Earlier</Text>
            <Text style={{ color: c.textMedium, fontFamily: 'Inter_500Medium', fontSize: 12.5 }}>This week</Text>
          </View>

          {PAST.map(entry => (
            <Pressable
              key={entry.day}
              style={({ pressed }) => [styles.pastCard, { backgroundColor: c.surface, ...card, marginBottom: 10, opacity: pressed ? 0.75 : 1 }]}
              onPress={() => setSelectedEntry(entry)}
            >
              <View style={styles.pastLeft}>
                <Text style={[styles.pastMonth, { color: c.textMuted }]}>{entry.month}</Text>
                <Text style={[styles.pastDay, { color: c.accentSoft }]}>{entry.day}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.pastTitle, { color: c.text }]}>{entry.title}</Text>
                <Text style={[styles.pastExcerpt, { color: c.textMedium }]} numberOfLines={2}>{entry.excerpt}</Text>
              </View>
            </Pressable>
          ))}

        </ScrollView>
      </KeyboardAvoidingView>

      {selectedEntry && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedEntry(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} onPress={() => setSelectedEntry(null)} />
          <View style={[styles.entrySheet, { backgroundColor: c.surface }]}>
            <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
                <View style={styles.pastLeft}>
                  <Text style={[styles.pastMonth, { color: c.textMuted }]}>{selectedEntry.month}</Text>
                  <Text style={[styles.pastDay, { color: c.accentSoft }]}>{selectedEntry.day}</Text>
                </View>
                <Text style={[styles.formTitle, { color: c.text, flex: 1 }]}>{selectedEntry.title}</Text>
              </View>
              <Text style={[styles.input, { color: c.textMedium, lineHeight: 26 }]}>{selectedEntry.body}</Text>
            </ScrollView>
            <Pressable
              style={[styles.saveBtn, { backgroundColor: c.surfaceAlt, marginTop: 16, borderWidth: 1, borderColor: c.border }]}
              onPress={() => setSelectedEntry(null)}
            >
              <Text style={[styles.saveBtnText, { color: c.text }]}>CLOSE</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}


function PlusIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:   { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },

  formCard: { borderRadius: 26, overflow: 'hidden' },
  topRow:   { flexDirection: 'row', height: 80 },
  dateBadge:{ width: 62, alignItems: 'center', justifyContent: 'center', margin: 12, borderRadius: 12 },
  dateMonth:{ fontFamily: 'Inter_700Bold', fontSize: 9.5, letterSpacing: 0.95 },
  dateDay:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, lineHeight: 28 },
  topImage: { flex: 1 },

  formBody:  { padding: 20, paddingTop: 0 },
  formTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 23, lineHeight: 30 },
  formSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 4, marginBottom: 20, lineHeight: 18 },

  promptBlock:{ paddingBottom: 0 },
  promptLabel:{ fontFamily: 'PlayfairDisplay_400Regular', fontSize: 15.5, fontStyle: 'italic', lineHeight: 21, flex: 1 },
  input:      { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, minHeight: 32, color: '#443733' },

  saveBtn:    { borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText:{ color: '#FBF9F4', fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.4 },

  sectionH: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },

  entrySheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 32, maxHeight: '72%' },

  pastCard:  { flexDirection: 'row', borderRadius: 26, padding: 16, gap: 14 },
  pastLeft:  { alignItems: 'center', width: 32 },
  pastMonth: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.72 },
  pastDay:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
  pastTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14.5, lineHeight: 20 },
  pastExcerpt:{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, marginTop: 2 },
});
