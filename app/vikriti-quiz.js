import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { loadVikritiQuestions, refreshVikritiQuestions } from '../data/content/remote';
import { saveVikritiTierAnswers, loadVikritiProgress } from '../data/user/storage';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

// Vikriti tier quiz — mirrors prakriti-quiz.js exactly, different tier
// order, table, save function, and escape-option wording (Vikriti's
// "listening to the body right now" framing vs. Prakriti's identity
// framing — both phrases already decided, see docs/roadmap.md #52). Note
// most Vikriti tiers don't use allow_none at all — Level 2/3 bake their
// own uniquely-worded catch-all into the last option instead, so it just
// renders like any other option here, no special-casing needed.

const NONE = '__none__';
const NONE_TEXT = 'None of these are speaking to me';
const TIER_ORDER = ['level1', 'level2', 'level3'];
const TIER_LABELS = { level1: 'Check Your Signals', level2: 'Pattern Finder', level3: 'Your Story' };

export default function VikritiQuiz() {
  const { theme: { colors: c } } = useTheme();
  const params = useLocalSearchParams();
  const tier = TIER_ORDER.includes(params.tier) ? params.tier : 'level1';

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState([]);
  const [freeText, setFreeText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // router.replace to this same route with a new `tier` param (the
    // "Continue to Pattern Finder" button below) reuses this mounted
    // component rather than remounting it — reset all per-question state
    // or the next tier would open already showing the previous tier's
    // "done" screen.
    setQuestions([]);
    setIndex(0);
    setAnswers([]);
    setPicked([]);
    setFreeText('');
    setCompleted(false);
    setLocked(false);
    loadVikritiQuestions(tier).then(setQuestions);
    refreshVikritiQuestions(tier).then(() => loadVikritiQuestions(tier)).then(setQuestions);
  }, [tier]);

  useEffect(() => {
    const tierIdx = TIER_ORDER.indexOf(tier);
    if (tierIdx === 0) return;
    loadVikritiProgress().then(progress => {
      if (!progress[TIER_ORDER[tierIdx - 1]]) setLocked(true);
    });
  }, [tier]);

  const q = questions[index];
  const progressPct = questions.length ? (index / questions.length) * 100 : 0;

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

  if (completed) {
    const nextTier = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={[s.doneTitle, { color: c.text }]}>Nice — {TIER_LABELS[tier]} done.</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 21, color: c.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 28 }}>
          Thanks for sharing that. It's saved and part of your story now.
        </Text>
        {nextTier ? (
          <Pressable style={[s.primaryBtn, { backgroundColor: c.accent }]} onPress={() => router.replace({ pathname: '/vikriti-quiz', params: { tier: nextTier } })}>
            <Text style={s.primaryBtnText}>Continue to {TIER_LABELS[nextTier]}</Text>
          </Pressable>
        ) : null}
        <Pressable style={{ marginTop: 16 }} onPress={() => router.replace('/vikriti')}>
          <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Back to Vikriti</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!q) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></SafeAreaView>;

  async function advance(answer) {
    const next = [...answers, answer];
    setPicked([]);
    setFreeText('');
    if (index + 1 >= questions.length) {
      await saveVikritiTierAnswers(tier, next);
      setAnswers(next);
      setCompleted(true);
    } else {
      setAnswers(next);
      setIndex(index + 1);
    }
  }

  function toggleOption(idx) {
    setPicked(sel => {
      if (idx === NONE) return sel.includes(NONE) ? [] : [NONE];
      const withoutNone = sel.filter(x => x !== NONE);
      return withoutNone.includes(idx) ? withoutNone.filter(x => x !== idx) : [...withoutNone, idx];
    });
  }

  function confirmMultiSelect() {
    const selectedLabels = picked.includes(NONE) ? [NONE_TEXT] : picked.map(i => q.options[i].label);
    advance({ questionId: q.id, section: q.section, prompt: q.prompt, selectedLabels });
  }

  function goBack() {
    if (index === 0) { router.back(); return; }
    setAnswers(answers.slice(0, -1));
    setIndex(index - 1);
    setPicked([]);
    setFreeText('');
  }

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
              value={freeText}
              onChangeText={setFreeText}
              placeholder="Whatever comes to mind..."
              placeholderTextColor={c.textMuted}
              multiline
            />
            <Pressable
              style={[s.continueBtn, { backgroundColor: c.accent }, !freeText.trim() && { opacity: 0.4 }]}
              disabled={!freeText.trim()}
              onPress={() => advance({ questionId: q.id, section: q.section, prompt: q.prompt, freeText: freeText.trim() })}
            >
              <Text style={s.continueBtnText}>Continue</Text>
            </Pressable>
            <Pressable style={{ marginTop: 14, alignItems: 'center' }} onPress={() => advance({ questionId: q.id, section: q.section, prompt: q.prompt, freeText: null })}>
              <Text style={{ color: c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 13.5 }}>Skip for now</Text>
            </Pressable>
          </>
        ) : (
          <>
            {q.options.map((opt, i) => (
              <Pressable
                key={i}
                style={[s.option, { backgroundColor: c.surface, borderColor: c.border }, picked.includes(i) && { borderColor: c.saffron, backgroundColor: c.surfaceAlt }]}
                onPress={() => toggleOption(i)}
              >
                <Text style={[s.optionText, { color: c.text }]}>{opt.label}</Text>
              </Pressable>
            ))}
            {q.allowNone && (
              <Pressable
                style={[s.option, s.noneOption, { borderColor: c.border }, picked.includes(NONE) && { borderColor: c.saffron, backgroundColor: c.surfaceAlt }]}
                onPress={() => toggleOption(NONE)}
              >
                <Text style={[s.optionText, { color: c.textMuted, fontStyle: 'italic' }]}>{NONE_TEXT}</Text>
              </Pressable>
            )}
            <Pressable
              style={[s.continueBtn, { backgroundColor: c.accent }, picked.length === 0 && { opacity: 0.4 }]}
              disabled={picked.length === 0}
              onPress={confirmMultiSelect}
            >
              <Text style={s.continueBtnText}>Continue</Text>
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
  prompt:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 34, marginBottom: 28 },

  option:     { borderWidth: 1, borderRadius: 18, padding: 18, marginBottom: 12 },
  noneOption: { borderStyle: 'dashed' },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22 },

  freeTextInput: { borderWidth: 1, borderRadius: 18, padding: 18, minHeight: 140, textAlignVertical: 'top', fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22, marginBottom: 4 },

  continueBtn:     { marginTop: 8, paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  continueBtnText: { color: '#FBF9F4', fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 1 },

  doneTitle:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 24, textAlign: 'center' },
  primaryBtn:     { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 999 },
  primaryBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14.5 },
});
