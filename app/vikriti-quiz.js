import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { loadVikritiQuestions, refreshVikritiQuestions } from '../data/content/remote';
import { saveVikritiTierAnswers, loadVikritiProgress, loadReproductiveHealthPref, saveReproductiveHealthPref } from '../data/user/storage';
import { tierClosings } from '../data/content/tierClosings';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';
import AssessmentsChecklistModal from '../components/AssessmentsChecklistModal';

// Vikriti tier quiz — mirrors prakriti-quiz.js (see that file's header
// comment for the drafts-array back-navigation fix and the recap/closing
// screen). Two things only Vikriti needs: escape-option wording tuned to
// its "listening to the body right now" framing (vs. Prakriti's identity
// framing — both phrases already decided, see docs/roadmap.md #52), and a
// one-time gating question before Level 3 lets someone skip the Women's
// Health section entirely rather than guessing from the intake form's
// unstructured free-text gender field.

const NONE = '__none__';
const NONE_TEXT = 'None of these are speaking to me';
const TIER_ORDER = ['level1', 'level2', 'level3'];
const TIER_LABELS = { level1: 'Check Your Signals', level2: 'Pattern Finder', level3: 'Your Story' };
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

export default function VikritiQuiz() {
  const { theme: { colors: c, spacing } } = useTheme();
  const params = useLocalSearchParams();
  const tier = TIER_ORDER.includes(params.tier) ? params.tier : 'level1';

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [locked, setLocked] = useState(false);
  const [gatingDone, setGatingDone] = useState(false);
  const [includeWomensHealth, setIncludeWomensHealth] = useState(true);
  const [showAssessments, setShowAssessments] = useState(false);

  useEffect(() => {
    // router.replace to this same route with a new `tier` param (the
    // "Continue to Pattern Finder" button below) reuses this mounted
    // component rather than remounting it — reset all per-question state
    // or the next tier would open already showing the previous tier's
    // "done" screen.
    setQuestions([]);
    setIndex(0);
    setDrafts([]);
    setCompleted(false);
    setSavedAnswers([]);
    setLocked(false);
    loadVikritiQuestions(tier).then(setQuestions);
    refreshVikritiQuestions(tier).then(() => loadVikritiQuestions(tier)).then(setQuestions);

    if (tier !== 'level3') {
      setGatingDone(true);
      setIncludeWomensHealth(true);
      return;
    }
    // Reuse a prior answer if this user already told us (here or in the
    // intake form) whether they want this content — only ask fresh when
    // nobody's ever been asked. See data/user/storage.js.
    setGatingDone(false);
    loadReproductiveHealthPref().then(pref => {
      if (pref !== null) {
        setIncludeWomensHealth(pref);
        setGatingDone(true);
      }
    });
  }, [tier]);

  useEffect(() => {
    const tierIdx = TIER_ORDER.indexOf(tier);
    if (tierIdx === 0) return;
    loadVikritiProgress().then(progress => {
      if (!progress[TIER_ORDER[tierIdx - 1]]) setLocked(true);
    });
  }, [tier]);

  const visibleQuestions = includeWomensHealth ? questions : questions.filter(q => q.section !== 'womens_health');
  const q = visibleQuestions[index];
  const draft = drafts[index] || EMPTY_DRAFT;
  const progressPct = visibleQuestions.length ? (index / visibleQuestions.length) * 100 : 0;

  if (locked) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: c.textMuted, textAlign: 'center', marginBottom: 20 }}>
          Complete the tier before this one first.
        </Text>
        <Pressable onPress={() => router.replace('/vikriti')}>
          <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Back to Vikriti</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!gatingDone) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={[s.doneTitle, { color: c.text, textAlign: 'center' }]}>Before we start...</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: c.textMuted, textAlign: 'center', marginTop: 12, marginBottom: 28 }}>
          Want to answer questions about menstrual and reproductive health? Totally your call.
        </Text>
        <Pressable style={[s.primaryBtn, { backgroundColor: c.accent, alignSelf: 'stretch' }]} onPress={() => { setIncludeWomensHealth(true); setDrafts([]); setIndex(0); setGatingDone(true); saveReproductiveHealthPref(true); }}>
          <Text style={s.primaryBtnText}>Yes, include those</Text>
        </Pressable>
        <Pressable style={{ marginTop: 16 }} onPress={() => { setIncludeWomensHealth(false); setDrafts([]); setIndex(0); setGatingDone(true); saveReproductiveHealthPref(false); }}>
          <Text style={{ color: c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 14 }}>Skip this section</Text>
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
            {tierClosings.vikriti[tier]}
          </Text>

          {/* Honest expectation-setting, Aug 17 2026 — see the identical note
              in prakriti-quiz.js. Vikriti specifically also gets a real
              computed wheel once enough is tagged (Journey's Ayurveda tab),
              so this points there rather than just saying "not yet." */}
          <View style={[s.noteCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Text style={[s.noteLabel, { color: c.textMuted }]}>Not scored yet</Text>
            <Text style={[s.noteBody, { color: c.textMuted }]}>
              This tier doesn't have a computed dosha reading yet — that's still being built. What's below is exactly what you shared. Once it's ready, you'll see a real reading on your Vikriti wheel in Journey's Ayurveda tab.
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
            <Pressable style={[s.primaryBtn, { backgroundColor: c.accent }]} onPress={() => router.replace({ pathname: '/vikriti-quiz', params: { tier: nextTier } })}>
              <Text style={s.primaryBtnText}>Continue to {TIER_LABELS[nextTier]}</Text>
            </Pressable>
          ) : (
            <Pressable style={[s.primaryBtn, { backgroundColor: c.accent }]} onPress={() => setShowAssessments(true)}>
              <Text style={s.primaryBtnText}>See what else you can explore</Text>
            </Pressable>
          )}
          <Pressable style={{ marginTop: 16, alignItems: 'center' }} onPress={() => router.replace('/vikriti')}>
            <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Back to Vikriti</Text>
          </Pressable>
        </ScrollView>

        {!nextTier && (
          <AssessmentsChecklistModal
            visible={showAssessments}
            onDismiss={() => setShowAssessments(false)}
            title="Nice work. What's next?"
            subtitle="You just finished checking in on your current state. A few more reads whenever you're ready — take them in any order."
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
    if (index + 1 >= visibleQuestions.length) {
      const merged = [...drafts];
      merged[index] = currentDraftValue;
      const finalAnswers = visibleQuestions.map((question, i) => buildAnswer(question, merged[i] || EMPTY_DRAFT));
      await saveVikritiTierAnswers(tier, finalAnswers);
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
    if (index === 0) {
      if (tier === 'level3') { setGatingDone(false); return; }
      smartBack('/vikriti');
      return;
    }
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
          <Text style={[s.counter, { color: c.textMuted }]}>{index + 1} / {visibleQuestions.length}</Text>
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
