import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { quizQuestions } from '../data/content/quiz';
import { useTheme } from '../context/ThemeContext';

export default function Quiz() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const styles = makeStyles(colors, spacing, radius);
  const q = quizQuestions[index];
  const progress = (index / quizQuestions.length) * 100;

  function pick(dosha) {
    const next = [...answers, dosha];
    if (index + 1 >= quizQuestions.length) {
      const tally = next.reduce((acc, d) => ({ ...acc, [d]: (acc[d] || 0) + 1 }), {});
      router.replace({
        pathname: '/result',
        params: { vata: tally.vata || 0, pitta: tally.pitta || 0, kapha: tally.kapha || 0 },
      });
    } else {
      setAnswers(next);
      setIndex(index + 1);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={[type.label, { marginTop: spacing.md }]}>
        Question {index + 1} of {quizQuestions.length}
      </Text>
      <Text style={[type.h1, { marginTop: spacing.sm, marginBottom: spacing.lg }]}>{q.prompt}</Text>

      {q.options.map((opt, i) => (
        <Pressable key={i} style={styles.option} onPress={() => pick(opt.dosha)}>
          <Text style={styles.optionText}>{opt.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors, spacing, radius) {
return StyleSheet.create({
  container: { padding: spacing.lg },
  progressBar: { height: 4, backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.saffron },
  option: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionText: { color: colors.text, fontSize: 16, lineHeight: 22 },
});
}
