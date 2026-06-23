import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { gunaQuestions } from '../data/content/gunaQuiz';
import { saveGunaResult } from '../data/user/storage';
import { useTheme } from '../context/ThemeContext';
import Svg, { Path } from 'react-native-svg';

export default function GunaQuiz() {
  const { theme: { colors: c } } = useTheme();
  const [index, setIndex]     = useState(0);
  const [answers, setAnswers] = useState([]);

  const q        = gunaQuestions[index];
  const progress = (index / gunaQuestions.length) * 100;

  async function pick(guna) {
    const next = [...answers, guna];

    if (index + 1 >= gunaQuestions.length) {
      const scores = next.reduce(
        (acc, g) => ({ ...acc, [g]: (acc[g] || 0) + 1 }),
        { sattva: 0, rajas: 0, tamas: 0 }
      );
      const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      await saveGunaResult(dominant, scores);
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
          <Pressable onPress={goBack} hitSlop={8} style={s.backBtn}>
            <BackIcon color={c.textMuted} />
          </Pressable>
          <Text style={[s.counter, { color: c.textMuted }]}>
            {index + 1} / {gunaQuestions.length}
          </Text>
        </View>

        {/* Label */}
        <Text style={[s.overline, { color: c.textMuted }]}>Mental constitution</Text>

        {/* Question */}
        <Text style={[s.prompt, { color: c.text }]}>{q.prompt}</Text>

        {/* Options */}
        {q.options.map((opt, i) => (
          <Pressable
            key={i}
            style={[s.option, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => pick(opt.guna)}
          >
            <Text style={[s.optionText, { color: c.text }]}>{opt.label}</Text>
          </Pressable>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function BackIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const s = StyleSheet.create({
  progressTrack: { height: 3, width: '100%' },
  progressFill:  { height: 3 },

  scroll:    { padding: 24, paddingTop: 8 },
  topRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, height: 40 },
  backBtn:   { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
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
