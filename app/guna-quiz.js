import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { gunaQuestions as staticGunaQuestions } from '../data/content/gunaQuiz';
import { loadGunaQuestions, refreshGunaQuestions } from '../data/content/remote';
import { saveGunaResult } from '../data/user/storage';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

export default function GunaQuiz() {
  const { theme: { colors: c } } = useTheme();
  const [index, setIndex]     = useState(0);
  const [answers, setAnswers] = useState([]);
  const [gunaQuestions, setGunaQuestions] = useState(staticGunaQuestions);

  useEffect(() => {
    loadGunaQuestions().then(setGunaQuestions);
    refreshGunaQuestions().then(loadGunaQuestions).then(setGunaQuestions);
  }, []);

  const q        = gunaQuestions[index];
  const progress = (index / gunaQuestions.length) * 100;

  if (!q) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></SafeAreaView>;

  async function pick(opt) {
    const next = [...answers, { guna: opt.guna, questionId: q.id, prompt: q.prompt, selectedLabels: [opt.label] }];

    if (index + 1 >= gunaQuestions.length) {
      const scores = next.reduce(
        (acc, a) => ({ ...acc, [a.guna]: (acc[a.guna] || 0) + 1 }),
        { sattva: 0, rajas: 0, tamas: 0 }
      );
      const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      const answerLog = next.map(({ questionId, prompt, selectedLabels }) => ({ questionId, section: null, prompt, selectedLabels }));
      await saveGunaResult(dominant, scores, answerLog);
      router.replace({
        pathname: '/guna-result',
        params: { dominant, sattva: scores.sattva, rajas: scores.rajas, tamas: scores.tamas },
      });
    } else {
      setAnswers(next);
      setIndex(index + 1);
    }
  }

  function goBack() {
    if (index === 0) {
      router.back();
    } else {
      setAnswers(answers.slice(0, -1));
      setIndex(index - 1);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>

      {/* Progress bar */}
      <View style={[s.progressTrack, { backgroundColor: c.surfaceAlt }]}>
        <View style={[s.progressFill, { width: `${progress}%`, backgroundColor: c.saffron }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Back + counter */}
        <View style={s.topRow}>
          <BackButton onPress={goBack} color={c.textMuted} />
          <Text style={[s.counter, { color: c.textMuted }]}>
            {index + 1} / {gunaQuestions.length}
          </Text>
        </View>

        {/* Label */}
        <Text style={[s.overline, { color: c.textMuted }]}>Mental constitution</Text>

        {/* Question */}
        <Text style={[s.prompt, { color: c.text }]}>{q.prompt}</Text>

        {index === 0 && (
          <Pressable
            style={{ marginTop: -20, marginBottom: 20 }}
            onPress={() => router.push({ pathname: '/learn', params: { conceptId: 'gunas-mental' } })}
          >
            <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
              What are the gunas? →
            </Text>
          </Pressable>
        )}

        {/* Options */}
        {q.options.map((opt, i) => (
          <Pressable
            key={i}
            style={[s.option, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => pick(opt)}
          >
            <Text style={[s.optionText, { color: c.text }]}>{opt.label}</Text>
          </Pressable>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  progressTrack: { height: 3, width: '100%' },
  progressFill:  { height: 3 },

  scroll:    { padding: 24, paddingTop: 8 },
  topRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, height: 40 },
  counter:   { fontFamily: 'Inter_400Regular', fontSize: 13.5 },

  overline:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  prompt:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 34, marginBottom: 28 },

  option: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  optionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },
});
