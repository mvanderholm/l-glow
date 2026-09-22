import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { useAuth } from '../context/AuthContext';
import {
  CLEANSE_META, SAFETY_INTRO, SAFETY_QUESTIONS, SAFETY_STOP_COPY, EAT_ENOUGH_COPY,
  PHASES, ONE_RULE, DAILY_CHANGES, MEAL_PLAN, findRecipe,
} from '../data/content/cleanse';
import {
  loadActiveCleansePlan, startCleansePlan, updateCleansePlanStatus,
  loadCleanseJournalEntries, saveCleanseJournalEntry, loadRecipeOverrides,
} from '../data/user/cleanse';
import { buildCleansePdfHtml } from '../data/pdf/cleansePdf';
import BackButton, { smartBack } from '../components/BackButton';

// Ayurvedic Cleanse builder (Sept 2026) — digitizes
// "LGlow 15-Day Ayurvedic Cleanse Guide.pdf" (Thea-authored, confirmed
// approved by Matt Sept 21 2026). Gated behind a signed-in account from
// the first screen. Flow: intro -> safety gate (a real gate, not
// decorative — see SAFETY_QUESTIONS) -> preferences (start date, ghee/oil)
// -> active plan view, with a PDF export matching the source guide's
// design (data/pdf/cleansePdf.js) and a day-11+ reintroduction journal.
//
// Recipe content itself is static/pre-generated (data/content/
// cleanseRecipes.js), flagged there as draft pending Thea's review — this
// screen doesn't call the live generate-cleanse-recipe function unless a
// user explicitly asks to regenerate one (not built in this first pass;
// the Edge Function exists and the data layer supports it).

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayNumberFor(startDate) {
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date(todayISO() + 'T00:00:00');
  const diff = Math.floor((today - start) / 86400000) + 1;
  return diff;
}

export default function Cleanse() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState('loading'); // loading | intro | safety | preferences | active
  const [plan, setPlan] = useState(null);
  const [safetyAnswers, setSafetyAnswers] = useState({});
  const [hardBlock, setHardBlock] = useState(false);
  const [startDate, setStartDate] = useState(todayISO());
  const [gheePreference, setGheePreference] = useState('ghee');
  const [exporting, setExporting] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [overrides, setOverrides] = useState({});

  const refresh = useCallback(async () => {
    if (user === undefined) return;
    if (!user) { setStep('intro'); return; }
    const active = await loadActiveCleansePlan();
    if (active) {
      setPlan(active);
      const [entries, recipeOverrides] = await Promise.all([
        loadCleanseJournalEntries(active.id),
        loadRecipeOverrides(active.id),
      ]);
      setJournalEntries(entries);
      setOverrides(recipeOverrides);
      setStep('active');
    } else {
      setStep('intro');
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  function toggleSafety(id, value) {
    setSafetyAnswers(prev => ({ ...prev, [id]: value }));
  }

  function beginSafetyGate() {
    if (!user) { router.push('/login?returnTo=/cleanse'); return; }
    setStep('safety');
  }

  function submitSafetyGate() {
    const hardHit = SAFETY_QUESTIONS.some(q => q.blockLevel === 'hard' && safetyAnswers[q.id]);
    if (hardHit) { setHardBlock(true); return; }
    setStep('preferences');
  }

  async function confirmStart() {
    const created = await startCleansePlan({ startDate, gheePreference, safetyAnswers });
    setPlan(created);
    setJournalEntries([]);
    setOverrides({});
    setStep('active');
  }

  async function abandonPlan() {
    await updateCleansePlanStatus(plan.id, 'abandoned');
    setPlan(null);
    setStep('intro');
  }

  async function exportPdf() {
    setExporting(true);
    try {
      const html = buildCleansePdfHtml({ startDate: plan.start_date, gheePreference: plan.ghee_preference, overrides });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (Platform.OS === 'web') {
        // expo-print on web returns a blob URL — open it directly so the
        // browser's own "save as PDF" / print dialog handles the rest.
        if (typeof window !== 'undefined') window.open(uri, '_blank');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
      }
    } catch (err) {
      console.error('Cleanse PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  }

  async function updateJournalField(day, field, value) {
    setJournalEntries(prev => {
      const existing = prev.find(e => e.day === day) || { day };
      const updated = { ...existing, [field]: value };
      return [...prev.filter(e => e.day !== day), updated].sort((a, b) => a.day - b.day);
    });
  }

  async function saveJournalField(day) {
    const entry = journalEntries.find(e => e.day === day);
    if (!entry) return;
    await saveCleanseJournalEntry(plan.id, day, {
      digestion: entry.digestion, energy: entry.energy, mood: entry.mood, skin: entry.skin, notes: entry.notes,
    });
  }

  if (step === 'loading') {
    return <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></SafeAreaView>;
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <BackButton onPress={() => smartBack('/explore')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        {step === 'intro' && (
          <>
            <Text style={[type.label, { color: c.textMuted }]}>From Thea</Text>
            <Text style={[type.display, { color: c.text, marginTop: 4 }]}>{CLEANSE_META.title}</Text>
            <Text style={[type.muted, { color: c.textMuted, marginTop: 4 }]}>{CLEANSE_META.tagline}</Text>
            <Text style={[type.body, { color: c.textMedium, marginTop: spacing.lg, lineHeight: 24 }]}>{CLEANSE_META.intro}</Text>

            {PHASES.map(p => (
              <View key={p.id} style={[styles.card, { backgroundColor: c.surface, ...card, marginTop: spacing.md }]}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text }}>{p.label} · {p.days}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: c.textMuted, marginTop: 4, lineHeight: 19 }}>{p.description}</Text>
              </View>
            ))}

            <View style={[styles.callout, { backgroundColor: c.sage + '14', borderColor: c.sage, marginTop: spacing.lg }]}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text }}>{ONE_RULE.title}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: c.textMedium, marginTop: 6, lineHeight: 19 }}>{ONE_RULE.body}</Text>
            </View>

            <Pressable style={[styles.primaryBtn, { backgroundColor: c.accent, marginTop: spacing.xl }]} onPress={beginSafetyGate}>
              <Text style={styles.primaryBtnText}>{user ? 'Get started' : 'Sign in to get started'}</Text>
            </Pressable>
          </>
        )}

        {step === 'safety' && (
          <>
            <Text style={[type.display, { color: c.text }]}>Before you begin</Text>
            <Text style={[type.body, { color: c.textMedium, marginTop: spacing.md, lineHeight: 24 }]}>{SAFETY_INTRO}</Text>

            {hardBlock ? (
              <View style={[styles.callout, { backgroundColor: c.terracotta + '14', borderColor: c.terracotta, marginTop: spacing.lg }]}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text }}>This one isn't for you right now</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: c.textMedium, marginTop: 6, lineHeight: 19 }}>
                  Based on what you shared, this cleanse isn't a good fit right now. Talk with your doctor about what might work better for you.
                </Text>
              </View>
            ) : (
              <>
                {SAFETY_QUESTIONS.map(q => (
                  <View key={q.id} style={[styles.qRow, { borderBottomColor: c.border }]}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: c.text, flex: 1, marginRight: 12 }}>{q.label}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Pressable
                        style={[styles.yn, { borderColor: c.border, backgroundColor: safetyAnswers[q.id] === true ? c.accent : 'transparent' }]}
                        onPress={() => toggleSafety(q.id, true)}
                      >
                        <Text style={{ color: safetyAnswers[q.id] === true ? '#FBF9F4' : c.textMuted, fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>Yes</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.yn, { borderColor: c.border, backgroundColor: safetyAnswers[q.id] === false ? c.accent : 'transparent' }]}
                        onPress={() => toggleSafety(q.id, false)}
                      >
                        <Text style={{ color: safetyAnswers[q.id] === false ? '#FBF9F4' : c.textMuted, fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>No</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}

                {SAFETY_QUESTIONS.some(q => q.blockLevel === 'acknowledge' && safetyAnswers[q.id]) && (
                  <View style={[styles.callout, { backgroundColor: c.amber ? c.amber + '14' : c.honeyAmber + '14', borderColor: c.honeyAmber, marginTop: spacing.md }]}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: c.textMedium, lineHeight: 19 }}>
                      Please talk with your doctor before starting, given what you shared above — especially around any changes to caffeine or alcohol intake. Only continue once you've done that.
                    </Text>
                  </View>
                )}

                <Text style={[type.muted, { color: c.textMuted, marginTop: spacing.lg, fontStyle: 'italic' }]}>{SAFETY_STOP_COPY}</Text>

                <Pressable
                  style={[styles.primaryBtn, { backgroundColor: SAFETY_QUESTIONS.every(q => safetyAnswers[q.id] !== undefined) ? c.accent : c.border, marginTop: spacing.xl }]}
                  disabled={!SAFETY_QUESTIONS.every(q => safetyAnswers[q.id] !== undefined)}
                  onPress={submitSafetyGate}
                >
                  <Text style={styles.primaryBtnText}>Continue</Text>
                </Pressable>
              </>
            )}
          </>
        )}

        {step === 'preferences' && (
          <>
            <Text style={[type.display, { color: c.text }]}>A couple of preferences</Text>
            <Text style={[type.muted, { color: c.textMuted, marginTop: spacing.sm }]}>{EAT_ENOUGH_COPY}</Text>

            <Text style={[styles.fieldLabel, { color: c.textMuted, marginTop: spacing.xl }]}>Start date</Text>
            <TextInput
              style={[styles.dateInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={c.textMuted}
            />

            <Text style={[styles.fieldLabel, { color: c.textMuted, marginTop: spacing.xl }]}>Cooking fat</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              {[{ key: 'ghee', label: 'Ghee' }, { key: 'olive_oil', label: 'Olive oil' }].map(opt => (
                <Pressable
                  key={opt.key}
                  style={[styles.choice, { borderColor: gheePreference === opt.key ? c.accent : c.border, backgroundColor: gheePreference === opt.key ? c.accent + '14' : 'transparent' }]}
                  onPress={() => setGheePreference(opt.key)}
                >
                  <Text style={{ color: gheePreference === opt.key ? c.accent : c.textMuted, fontFamily: 'Inter_600SemiBold', fontSize: 13.5 }}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={[styles.primaryBtn, { backgroundColor: c.accent, marginTop: spacing.xl }]} onPress={confirmStart}>
              <Text style={styles.primaryBtnText}>Start my cleanse</Text>
            </Pressable>
          </>
        )}

        {step === 'active' && plan && (() => {
          const day = Math.min(Math.max(dayNumberFor(plan.start_date), 1), 15);
          const todaysMeals = MEAL_PLAN.find(m => m.day === day);
          const change = DAILY_CHANGES.find(c2 => String(c2.day) === String(day));
          const inReintroduction = day >= 11;

          return (
            <>
              <Text style={[type.label, { color: c.textMuted }]}>{CLEANSE_META.title}</Text>
              <Text style={[type.display, { color: c.text, marginTop: 4 }]}>Day {day} of 15</Text>
              {change && <Text style={[type.body, { color: c.accent, marginTop: 4, fontFamily: 'Inter_600SemiBold' }]}>{change.change}</Text>}

              {todaysMeals && (
                <View style={[styles.card, { backgroundColor: c.surface, ...card, marginTop: spacing.lg }]}>
                  <Text style={[styles.fieldLabel, { color: c.textMuted }]}>Breakfast</Text>
                  <Text style={{ color: c.text, fontFamily: 'Inter_500Medium', fontSize: 14, marginBottom: 10 }}>{mealNames(todaysMeals.breakfast)}</Text>
                  <Text style={[styles.fieldLabel, { color: c.textMuted }]}>Lunch</Text>
                  <Text style={{ color: c.text, fontFamily: 'Inter_500Medium', fontSize: 14, marginBottom: 10 }}>{mealNames(todaysMeals.lunch)}</Text>
                  <Text style={[styles.fieldLabel, { color: c.textMuted }]}>Dinner</Text>
                  <Text style={{ color: c.text, fontFamily: 'Inter_500Medium', fontSize: 14 }}>{mealNames(todaysMeals.dinner)}</Text>
                </View>
              )}

              <Pressable style={[styles.primaryBtn, { backgroundColor: c.accent, marginTop: spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }]} onPress={exportPdf} disabled={exporting}>
                {exporting && <ActivityIndicator color="#FBF9F4" size="small" />}
                <Text style={styles.primaryBtnText}>{exporting ? 'Preparing your PDF…' : 'Download full guide (PDF)'}</Text>
              </Pressable>

              {inReintroduction && (
                <View style={{ marginTop: spacing.xl }}>
                  <Text style={[type.h2, { color: c.text }]}>Reintroduction journal</Text>
                  {[day].map(d => {
                    const entry = journalEntries.find(e => e.day === d) || { day: d };
                    return (
                      <View key={d} style={[styles.card, { backgroundColor: c.surface, ...card, marginTop: spacing.md }]}>
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text, marginBottom: 8 }}>Day {d}</Text>
                        {['digestion', 'energy', 'mood', 'skin', 'notes'].map(field => (
                          <TextInput
                            key={field}
                            style={[styles.journalInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            placeholderTextColor={c.textMuted}
                            value={entry[field] || ''}
                            onChangeText={v => updateJournalField(d, field, v)}
                            onBlur={() => saveJournalField(d)}
                          />
                        ))}
                      </View>
                    );
                  })}
                </View>
              )}

              <Pressable style={{ marginTop: spacing.xl, alignItems: 'center' }} onPress={() => router.push('/habit-tracker')}>
                <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13.5 }}>Open my Weekly Habit Tracker →</Text>
              </Pressable>

              <Pressable style={{ marginTop: spacing.xl, alignItems: 'center' }} onPress={abandonPlan}>
                <Text style={{ color: c.textMuted, fontSize: 12.5 }}>End this cleanse</Text>
              </Pressable>
            </>
          );
        })()}
      </ScrollView>
    </SafeAreaView>
  );
}

function mealNames(ids) {
  if (!ids) return '—';
  const list = Array.isArray(ids) ? ids : [ids];
  return list.map(id => findRecipe(id)?.title).filter(Boolean).join(', ');
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, padding: 16 },
  callout: { borderRadius: 14, borderWidth: 1, padding: 14 },
  primaryBtn: { borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  primaryBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  qRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  yn: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
  dateInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 6 },
  choice: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  journalInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 8 },
});
