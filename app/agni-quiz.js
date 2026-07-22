import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { agniQuestions } from '../data/content/agniQuiz';
import { saveAgniResult } from '../data/user/storage';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

export default function AgniQuiz() {
  const { theme: { colors: c } } = useTheme();
  const [index, setIndex]     = useState(0);
  const [answers, setAnswers] = useState([]);

  const q        = agniQuestions[index];
  const progress = (index / agniQuestions.length) * 100;

  async function pick(opt) {
    const next = [...answers, { agni: opt.agni, questionId: q.id, prompt: q.prompt, selectedLabels: [opt.label] }];

    if (index + 1 >= agniQuestions.length) {
      const counts = next.reduce(
        (acc, a) => ({ ...acc, [a.agni]: (acc[a.agni] || 0) + 1 }),
        { sama: 0, vishama: 0, tikshna: 0, manda: 0 }
      );
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      const answerLog = next.map(({ questionId, prompt, selectedLabels }) => ({ questionId, section: null, prompt, selectedLabels }));
      await saveAgniResult(dominant, counts, answerLog);
      router.replace({
        pathname: '/agni-result',
        params: { dominant, ...counts },
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
            {index + 1} / {agniQuestions.length}
          </Text>
        </View>

        {/* Label */}
        <Text style={[s.overline, { color: c.textMuted }]}>Digestive fire</Text>

        {/* Question */}
        <Text style={[s.prompt, { color: c.text }]}>{q.prompt}</Text>

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
