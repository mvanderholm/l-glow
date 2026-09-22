import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { useAuth } from '../context/AuthContext';
import {
  HABIT_TRACKER_META, HABIT_CATEGORIES, WEEKDAY_LABELS, WEEKDAY_NAMES,
  REFLECTION_PROMPTS, DAILY_JOURNAL_PROMPTS, weekStartFor,
} from '../data/content/habitTracker';
import { loadHabitWeek, saveHabitWeek } from '../data/user/habitTracker';
import BackButton, { smartBack } from '../components/BackButton';

// Weekly Habit Tracker (Sept 2026) — digitized from "The Habit Ayurveda:
// My Vedic Practice" worksheet (see the cleanse developer guide's own
// section on this). Two parts: a weekly habit grid (4 categories x 3
// user-editable slots x 7 tappable days) and a daily journal (morning/
// evening free text per weekday). Saves on blur/toggle, not a separate
// "Save" button, matching this app's general low-friction pattern
// elsewhere (journal.js, checkin.js).

function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function HabitTracker() {
  const { theme: { colors: c, spacing, type } } = useTheme();
  const { user } = useAuth();
  const [weekOf, setWeekOf] = useState(weekStartFor());
  const [week, setWeek] = useState(null); // null = loading

  const load = useCallback(async () => {
    if (!user) { setWeek(null); return; }
    const data = await loadHabitWeek(weekOf);
    setWeek(data);
  }, [user, weekOf]);

  useEffect(() => { load(); }, [load]);

  async function persist(next) {
    setWeek(next);
    await saveHabitWeek(weekOf, { habits: next.habits, daily_journal: next.daily_journal, reflections: next.reflections });
  }

  function toggleDay(category, slotIndex, dayIndex) {
    const habits = { ...week.habits };
    habits[category] = habits[category].map((slot, i) =>
      i === slotIndex ? { ...slot, days: slot.days.map((v, di) => di === dayIndex ? !v : v) } : slot
    );
    persist({ ...week, habits });
  }

  function updateLabel(category, slotIndex, label) {
    const habits = { ...week.habits };
    habits[category] = habits[category].map((slot, i) => i === slotIndex ? { ...slot, label } : slot);
    setWeek({ ...week, habits }); // local only while typing
  }

  function commitLabel() {
    persist(week);
  }

  function updateReflection(id, value) {
    setWeek({ ...week, reflections: { ...week.reflections, [id]: value } });
  }

  function updateJournal(dayIndex, field, value) {
    const daily_journal = { ...week.daily_journal, [dayIndex]: { ...week.daily_journal[dayIndex], [field]: value } };
    setWeek({ ...week, daily_journal });
  }

  if (!user) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
        <BackButton onPress={() => smartBack('/you')} color={c.textMuted} style={{ marginLeft: 10, marginTop: 8 }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: c.textMuted, textAlign: 'center' }}>You'll need to sign in first.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!week) {
    return <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></SafeAreaView>;
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <BackButton onPress={() => smartBack('/you')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        <Text style={[type.label, { color: c.textMuted }]}>{HABIT_TRACKER_META.eyebrow}</Text>
        <Text style={[type.display, { color: c.text, marginTop: 4 }]}>{HABIT_TRACKER_META.title}</Text>
        <Text style={[type.bodyItalic, { color: c.textMedium, marginTop: 4 }]}>{HABIT_TRACKER_META.tagline}</Text>

        <View style={styles.weekNav}>
          <Pressable onPress={() => setWeekOf(addDays(weekOf, -7))}><Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold' }}>‹ Prev</Text></Pressable>
          <Text style={{ color: c.text, fontFamily: 'Inter_600SemiBold' }}>Week of {new Date(weekOf + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
          <Pressable onPress={() => setWeekOf(addDays(weekOf, 7))}><Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold' }}>Next ›</Text></Pressable>
        </View>

        {HABIT_CATEGORIES.map(cat => (
          <View key={cat.id} style={[styles.categoryCard, { backgroundColor: c.surface, ...card }]}>
            <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16, color: c.text, marginBottom: 10 }}>{cat.label}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 4, paddingLeft: 130 }}>
              {WEEKDAY_LABELS.map((d, i) => (
                <Text key={i} style={{ width: 28, textAlign: 'center', fontSize: 10.5, color: c.textMuted, fontFamily: 'Inter_600SemiBold' }}>{d}</Text>
              ))}
            </View>
            {week.habits[cat.id].map((slot, slotIndex) => (
              <View key={slotIndex} style={styles.habitRow}>
                <TextInput
                  style={[styles.habitLabelInput, { color: c.text, borderBottomColor: c.border, width: 130 }]}
                  value={slot.label}
                  onChangeText={t => updateLabel(cat.id, slotIndex, t)}
                  onBlur={commitLabel}
                  placeholder="Add a habit…"
                  placeholderTextColor={c.textMuted}
                />
                <View style={{ flexDirection: 'row' }}>
                  {slot.days.map((done, dayIndex) => (
                    <Pressable key={dayIndex} style={{ width: 28, alignItems: 'center' }} onPress={() => toggleDay(cat.id, slotIndex, dayIndex)}>
                      <View style={[styles.dot, { borderColor: c.border, backgroundColor: done ? c.accent : 'transparent' }]} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={{ marginTop: spacing.lg }}>
          {REFLECTION_PROMPTS.map(r => (
            <View key={r.id} style={{ marginBottom: 14 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: c.text }}>{r.label}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11.5, color: c.textMuted, marginBottom: 6 }}>{r.hint}</Text>
              <TextInput
                style={[styles.reflectionInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
                value={week.reflections[r.id] || ''}
                onChangeText={v => updateReflection(r.id, v)}
                onBlur={() => persist(week)}
                multiline
                placeholder="Write here…"
                placeholderTextColor={c.textMuted}
              />
            </View>
          ))}
        </View>

        <Text style={[type.h2, { color: c.text, marginTop: spacing.xl, marginBottom: 4 }]}>Daily journal</Text>
        {WEEKDAY_NAMES.map((name, i) => (
          <View key={i} style={[styles.dayCard, { backgroundColor: c.surface, ...card }]}>
            <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 15, color: c.text, marginBottom: 8 }}>{name}</Text>
            <Text style={[styles.journalLabel, { color: c.textMuted }]}>{DAILY_JOURNAL_PROMPTS.morning}</Text>
            <TextInput
              style={[styles.reflectionInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
              value={week.daily_journal[i]?.morning || ''}
              onChangeText={v => updateJournal(i, 'morning', v)}
              onBlur={() => persist(week)}
              multiline
              placeholder="…"
              placeholderTextColor={c.textMuted}
            />
            <Text style={[styles.journalLabel, { color: c.textMuted, marginTop: 8 }]}>{DAILY_JOURNAL_PROMPTS.evening}</Text>
            <TextInput
              style={[styles.reflectionInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
              value={week.daily_journal[i]?.evening || ''}
              onChangeText={v => updateJournal(i, 'evening', v)}
              onBlur={() => persist(week)}
              multiline
              placeholder="…"
              placeholderTextColor={c.textMuted}
            />
          </View>
        ))}

        <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontStyle: 'italic', fontSize: 12.5, color: c.textMuted, textAlign: 'center', lineHeight: 19 }}>
            "{HABIT_TRACKER_META.closingQuote}"
          </Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11.5, color: c.textMuted, marginTop: 6 }}>— {HABIT_TRACKER_META.closingQuoteAttribution}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  weekNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  categoryCard: { borderRadius: 18, padding: 14, marginTop: 12 },
  habitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  habitLabelInput: { fontFamily: 'Inter_400Regular', fontSize: 12.5, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 4, paddingRight: 8 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5 },
  reflectionInput: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 13, fontFamily: 'Inter_400Regular', minHeight: 44 },
  dayCard: { borderRadius: 16, padding: 14, marginTop: 8 },
  journalLabel: { fontFamily: 'Inter_500Medium', fontSize: 11.5, marginBottom: 4 },
});
