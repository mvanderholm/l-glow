import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { loadPrakritiQuestions, refreshPrakritiQuestions } from '../data/content/remote';
import { savePrakritiTierAnswers, loadPrakritiProgress } from '../data/user/storage';
import { tierClosings } from '../data/content/tierClosings';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';
import AssessmentsChecklistModal from '../components/AssessmentsChecklistModal';

// Prakriti tier quiz — one question at a time, same shell as guna-quiz.js
// (the one existing quiz that already does cache-then-live-refresh instead
// of a static import). No computed result at the end — dosha tagging on
// this content is effectively at 0%, so this saves the raw Q&A only, plus
// a plain recap + a draft Thea-voiced closing line (see tierClosings.js).
// See docs/roadmap.md #52.
//
// Per-question state lives in `drafts`, indexed by question position, not
// just a flattened answers array — that's what lets goBack() restore what
// was previously picked instead of showing a blank question (a real bug
// found and fixed the same day this file was reworked for feedback).

const NONE = '__none__';
const NONE_TEXT = 'None of these really sound like me';
const TIER_ORDER = ['foundation', 'level2', 'level3'];
const TIER_LABELS = { foundation: 'Foundation', level2: 'Level 2', level3: 'Level 3' };
const EMPTY_DRAFT = { picked: [], freeText: '', comment: '', commentOpen: false, skipped: false };

function buildAnswer(q, draft) {
  const base = { questionId: q.id, section: q.section, prompt: q.prompt, skipped: !!draft.skipped, comment: draft.comment?.trim() || null };
  if (q.inputType === 'free_text') {
    return { ...base, freeText: draft.freeText?.trim() || null };
  }
  const selectedLabels = draft.picked.includes(NONE) ? [NONE_TEXT] : draft.picked.map(i => q.options[i]?.label).filter(Boolean);
  return { ...base, selectedLabels };
}

function buildRecap(answers) {
  const bySection = {};
  for (const a of answers) {
    if (a.skipped) continue;
    const value = a.freeText !== undefined ? a.freeText : (a.selectedLabels || []).join(', ');
    if (!value) continue;
    const key = a.section || 'general';
    if (!bySection[key]) bySection[key] = [];
    bySection[key].push({ prompt: a.prompt, value, comment: a.comment });
  }
  return bySection;
}

export default function PrakritiQuiz() {
  const { theme: { colors: c, spacing } } = useTheme();
  const params = useLocalSearchParams();
  const tier = TIER_ORDER.includes(params.tier) ? params.tier : 'foundation';

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showAssessments, setShowAssessments] = useState(false);

  useEffect(() => {
    // router.replace to this same route with a new `tier` param (the
    // "Continue to Level 2" button below) reuses this mounted component
    // rather than remounting it — reset all per-question state or the next
    // tier would open already showing the previous tier's "done" screen.
    setQuestions([]);
    setIndex(0);
    setDrafts([]);
    setCompleted(false);
    setSavedAnswers([]);
    setLocked(false);
    loadPrakritiQuestions(tier).then(setQuestions);
    refreshPrakritiQuestions(tier).then(() => loadPrakritiQuestions(tier)).then(setQuestions);
  }, [tier]);

  useEffect(() => {
    const tierIdx = TIER_ORDER.indexOf(tier);
    if (tierIdx === 0) return;
    loadPrakritiProgress().then(progress => {
      if (!progress[TIER_ORDER[tierIdx - 1]]) setLocked(true);
    });
  }, [tier]);

  const q = questions[index];
  const draft = drafts[index] || EMPTY_DRAFT;
  const progressPct = questions.length ? (index / questions.length) * 100 : 0;

  if (locked) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: c.textMuted, textAlign: 'center', marginBottom: 20 }}>
          Complete the tier before this one first.
        </Text>
        <Pressable onPress={() => router.replace('/prakriti')}>
          <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Back to Prakriti</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (completed) {
    const nextTier = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];
    const recap = buildRecap(savedAnswers);
    const sections = Object.keys(recap);
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ padding: spacing.screenPad, paddingBottom: spacing.screenPadBottom }} showsVerticalScrollIndicator={false}>
          <Text style={[s.doneTitle, { color: c.text }]}>Nice — {TIER_LABELS[tier]} done.</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 21, color: c.textMuted, marginTop: 8, marginBottom: 20 }}>
            {tierClosings.prakriti[tier]}
          </Text>

          {/* Honest expectation-setting, Aug 17 2026 — this used to just show
              the recap with no explanation, which could read as a lesser
              version of what the Dosha Quiz gives rather than what it
              actually is: real content waiting on the dosha-tagging pass
              (#52), not a finished, deliberately spare result. */}
          <View style={[s.noteCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Text style={[s.noteLabel, { color: c.textMuted }]}>Not scored yet</Text>
            <Text style={[s.noteBody, { color: c.textMuted }]}>
              This tier doesn't have a computed dosha reading yet — that's still being built. What's below is exactly what you shared, kept as-is until it's ready.
            </Text>
          </View>

          {sections.length > 0 && (
            <View style={[s.recapCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[s.recapTitle, { color: c.text }]}>Here's what you shared</Text>
              {sections.map(section => (
                <View key={section} style={{ marginBottom: 10 }}>
                  {section !== 'general' && <Text style={[s.recapSection, { color: c.textMuted }]}>{section}</Text>}
                  {recap[section].map((item, i) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      <Text style={[s.recapPrompt, { color: c.textMuted }]}>{item.prompt}</Text>
                      <Text style={[s.recapValue, { color: c.text }]}>{item.value}</Text>
                      {item.comment && <Text style={[s.recapComment, { color: c.textMuted }]}>"{item.comment}"</Text>}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {nextTier ? (
            <Pressable style={[s.primaryBtn, { backgroundColor: c.accent }]} onPress={() => router.replace({ pathname: '/prakriti-quiz', params: { tier: nextTier } })}>
              <Text style={s.primaryBtnText}>Continue to {TIER_LABELS[nextTier]}</Text>
            </Pressable>
          ) : (
            <Pressable style={[s.primaryBtn, { backgroundColor: c.accent }]} onPress={() => setShowAssessments(true)}>
              <Text style={s.primaryBtnText}>See what else you can explore</Text>
            </Pressable>
          )}
          <Pressable style={{ marginTop: 16, alignItems: 'center' }} onPress={() => router.replace('/prakriti')}>
            <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Back to Prakriti</Text>
          </Pressable>
        </ScrollView>

        {!nextTier && (
          <AssessmentsChecklistModal
            visible={showAssessments}
            onDismiss={() => setShowAssessments(false)}
            title="Nice work. What's next?"
            subtitle="You just finished your full Blueprint. A few more reads whenever you're ready — take them in any order."
          />
        )}
      </SafeAreaView>
    );
  }

  if (!q) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></SafeAreaView>;

  function patchDraft(i, patch) {
    setDrafts(prev => {
      const next = [...prev];
      next[i] = { ...(next[i] || EMPTY_DRAFT), ...patch };
      return next;
    });
  }

  async function proceed(currentDraftValue) {
    if (index + 1 >= questions.length) {
      const merged = [...drafts];
      merged[index] = currentDraftValue;
      const finalAnswers = questions.map((question, i) => buildAnswer(question, merged[i] || EMPTY_DRAFT));
      await savePrakritiTierAnswers(tier, finalAnswers);
      setSavedAnswers(finalAnswers);
      setCompleted(true);
    } else {
      setIndex(index + 1);
    }
  }

  function toggleOption(optIdx) {
    const nextPicked = optIdx === NONE
      ? (draft.picked.includes(NONE) ? [] : [NONE])
      : (() => {
          const withoutNone = draft.picked.filter(x => x !== NONE);
          return withoutNone.includes(optIdx) ? withoutNone.filter(x => x !== optIdx) : [...withoutNone, optIdx];
        })();
    const justPickedNone = optIdx === NONE && !draft.picked.includes(NONE);
    patchDraft(index, { picked: nextPicked, ...(justPickedNone ? { commentOpen: true } : {}) });
  }

  function confirmMultiSelect() {
    const nextDraft = { ...draft, skipped: false };
    patchDraft(index, nextDraft);
    proceed(nextDraft);
  }

  function skipQuestion() {
    const nextDraft = { ...draft, picked: [], freeText: '', skipped: true };
    patchDraft(index, nextDraft);
    proceed(nextDraft);
  }

  function confirmFreeText() {
    const nextDraft = { ...draft, skipped: false };
    patchDraft(index, nextDraft);
    proceed(nextDraft);
  }

  function goBack() {
    if (index === 0) { smartBack('/prakriti'); return; }
    setIndex(index - 1);
  }

  const commentVisible = draft.commentOpen || !!draft.comment;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[s.progressTrack, { backgroundColor: c.surfaceAlt }]}>
        <View style={[s.progressFill, { width: `${progressPct}%`, backgroundColor: c.saffron }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.topRow}>
          <BackButton onPress={goBack} color={c.textMuted} />
          <Text style={[s.counter, { color: c.textMuted }]}>{index + 1} / {questions.length}</Text>
        </View>

        <Text style={[s.overline, { color: c.textMuted }]}>{TIER_LABELS[tier]}{q.section ? ` · ${q.section}` : ''}</Text>
        <Text style={[s.prompt, { color: c.text }]}>{q.prompt}</Text>

        {q.inputType === 'free_text' ? (
          <>
            <TextInput
              style={[s.freeTextInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
              value={draft.freeText}
              onChangeText={t => patchDraft(index, { freeText: t })}
              placeholder="Whatever comes to mind..."
              placeholderTextColor={c.textMuted}
              multiline
            />
            <Pressable
              style={[s.continueBtn, { backgroundColor: c.accent }, !draft.freeText.trim() && { opacity: 0.4 }]}
              disabled={!draft.freeText.trim()}
              onPress={confirmFreeText}
            >
              <Text style={s.continueBtnText}>Continue</Text>
            </Pressable>
            <Pressable style={{ marginTop: 14, alignItems: 'center' }} onPress={skipQuestion}>
              <Text style={{ color: c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 13.5 }}>Skip for now</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[s.smallPrint, { color: c.textMuted }]}>Select all that apply.</Text>
            {q.options.map((opt, i) => (
              <Pressable
                key={i}
                style={[s.option, { backgroundColor: c.surface, borderColor: c.border }, draft.picked.includes(i) && { borderColor: c.saffron, backgroundColor: c.surfaceAlt }]}
                onPress={() => toggleOption(i)}
              >
                <Text style={[s.optionText, { color: c.text }]}>{opt.label}</Text>
              </Pressable>
            ))}
            {q.allowNone && (
              <Pressable
                style={[s.option, s.noneOption, { borderColor: c.border }, draft.picked.includes(NONE) && { borderColor: c.saffron, backgroundColor: c.surfaceAlt }]}
                onPress={() => toggleOption(NONE)}
              >
                <Text style={[s.optionText, { color: c.textMuted, fontStyle: 'italic' }]}>{NONE_TEXT}</Text>
              </Pressable>
            )}

            {commentVisible ? (
              <TextInput
                style={[s.commentInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
                value={draft.comment}
                onChangeText={t => patchDraft(index, { comment: t })}
                placeholder={draft.picked.includes(NONE) ? "What's true for you instead? (optional)" : 'Add a note (optional)'}
                placeholderTextColor={c.textMuted}
                multiline
                autoFocus={draft.picked.includes(NONE) && !draft.comment}
              />
            ) : (
              <Pressable style={{ marginTop: 4, marginBottom: 8 }} onPress={() => patchDraft(index, { commentOpen: true })}>
                <Text style={{ color: c.accent, fontFamily: 'Inter_500Medium', fontSize: 13 }}>+ Add a note</Text>
              </Pressable>
            )}

            <Pressable
              style={[s.continueBtn, { backgroundColor: c.accent }, draft.picked.length === 0 && { opacity: 0.4 }]}
              disabled={draft.picked.length === 0}
              onPress={confirmMultiSelect}
            >
              <Text style={s.continueBtnText}>Continue</Text>
            </Pressable>
            <Pressable style={{ marginTop: 14, alignItems: 'center' }} onPress={skipQuestion}>
              <Text style={{ color: c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 13.5 }}>Skip for now</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  progressTrack: { height: 3, width: '100%' },
  progressFill:  { height: 3 },

  scroll:  { padding: 24, paddingTop: 8, paddingBottom: 48 },
  topRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, height: 40 },
  counter: { fontFamily: 'Inter_400Regular', fontSize: 13.5 },

  overline: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  prompt:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 34, marginBottom: 10 },
  smallPrint: { fontFamily: 'Inter_400Regular', fontSize: 12.5, marginBottom: 16 },

  option:     { borderWidth: 1, borderRadius: 18, padding: 18, marginBottom: 12 },
  noneOption: { borderStyle: 'dashed' },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22 },

  freeTextInput: { borderWidth: 1, borderRadius: 18, padding: 18, minHeight: 140, textAlignVertical: 'top', fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22, marginBottom: 4 },
  commentInput:  { borderWidth: 1, borderRadius: 14, padding: 14, minHeight: 70, textAlignVertical: 'top', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 14 },

  continueBtn:     { marginTop: 8, paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  continueBtnText: { color: '#FBF9F4', fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 1 },

  doneTitle:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 24 },
  primaryBtn:     { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 999, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14.5 },

  noteCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  noteLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  noteBody: { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18 },

  recapCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 20 },
  recapTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, marginBottom: 12 },
  recapSection: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6, marginTop: 4 },
  recapPrompt: { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18 },
  recapValue:  { fontFamily: 'Inter_500Medium', fontSize: 14.5, lineHeight: 20, marginTop: 2 },
  recapComment: { fontFamily: 'Inter_400Regular', fontStyle: 'italic', fontSize: 13, lineHeight: 19, marginTop: 3 },
});
