import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { quizQuestions } from '../data/content/quiz';
import { saveDoshaResult } from '../data/user/storage';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

const NONE = '__none__';
const NONE_LABEL = 'None of these feels right';

const SECTION_LABELS = {
  physical: 'The obvious stuff',
  physiological: 'How your body runs',
  psychological: 'How your mind runs',
};

export default function Quiz() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // array of {section, prompt, doshas, selectedLabels} per question
  const [picked, setPicked] = useState([]);   // in-progress option indices for the current multi-select question
  const styles = makeStyles(colors, spacing, radius);
  const q = quizQuestions[index];
  const progress = (index / quizQuestions.length) * 100;
  const sectionLabel = q.section && SECTION_LABELS[q.section];

  async function finish(allAnswers) {
    const tally = allAnswers.flatMap(a => a.doshas).reduce((acc, d) => ({ ...acc, [d]: (acc[d] || 0) + 1 }), {});
    // Floor of 3 per dosha — caps the max single-dosha result at ~65%, ensures all three are always present
    const scores = { vata: (tally.vata || 0) + 3, pitta: (tally.pitta || 0) + 3, kapha: (tally.kapha || 0) + 3 };
    const primary = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const answerLog = allAnswers.map(({ section, prompt, selectedLabels }) => ({ section, prompt, selectedLabels }));
    await saveDoshaResult(primary, scores, answerLog);
    router.replace({
      pathname: '/result',
      params: { vata: scores.vata, pitta: scores.pitta, kapha: scores.kapha },
    });
  }

  function advance(doshasForQuestion, selectedLabels) {
    const next = [...answers, { section: q.section ?? null, prompt: q.prompt, doshas: doshasForQuestion, selectedLabels }];
    setPicked([]);
    if (index + 1 >= quizQuestions.length) {
      finish(next);
    } else {
      setAnswers(next);
      setIndex(index + 1);
    }
  }

  function pickSingle(opt) {
    if (opt === NONE) {
      advance([], [NONE_LABEL]);
    } else {
      advance([opt.dosha], [opt.label]);
    }
  }

  function toggleMulti(i) {
    if (i === NONE) {
      setPicked(sel => (sel.includes(NONE) ? [] : [NONE]));
      return;
    }
    setPicked(sel => {
      const withoutNone = sel.filter(x => x !== NONE);
      return withoutNone.includes(i)
        ? withoutNone.filter(x => x !== i)
        : [...withoutNone, i];
    });
  }

  function confirmMulti() {
    if (picked.includes(NONE)) {
      advance([], [NONE_LABEL]);
    } else {
      const chosen = picked.map(i => q.options[i]);
      advance(chosen.map(o => o.dosha), chosen.map(o => o.label));
    }
  }

  function goBack() {
    if (index === 0) {
      router.back();
    } else {
      setAnswers(answers.slice(0, -1));
      setPicked([]);
      setIndex(index - 1);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={[styles.topRow, { marginTop: spacing.md }]}>
        <BackButton onPress={goBack} color={colors.textMuted} style={{ marginLeft: -10 }} />
        <Text style={type.label}>
          Question {index + 1} of {quizQuestions.length}{sectionLabel ? ` · ${sectionLabel}` : ''}
        </Text>
      </View>
      <Text style={[type.h1, { marginTop: spacing.sm, marginBottom: spacing.sm }]}>{q.prompt}</Text>
      {index === 0 && (
        <Pressable
          style={{ marginBottom: spacing.lg }}
          onPress={() => router.push({ pathname: '/learn', params: { conceptId: 'doshas' } })}
        >
          <Text style={{ color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
            What's a dosha, anyway? →
          </Text>
        </Pressable>
      )}
      {q.multiSelect && (
        <Text style={[type.muted, { marginBottom: spacing.md }]}>Check everything that fits.</Text>
      )}

      {q.options.map((opt, i) => {
        const isSelected = q.multiSelect && picked.includes(i);
        return (
          <Pressable
            key={i}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => (q.multiSelect ? toggleMulti(i) : pickSingle(opt))}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </Pressable>
        );
      })}

      <Pressable
        style={[
          styles.option,
          styles.noneOption,
          q.multiSelect && picked.includes(NONE) && styles.optionSelected,
        ]}
        onPress={() => (q.multiSelect ? toggleMulti(NONE) : pickSingle(NONE))}
      >
        <Text style={[styles.optionText, styles.noneOptionText]}>None of these feels right</Text>
      </Pressable>

      {q.multiSelect && (
        <Pressable
          style={[styles.continueBtn, picked.length === 0 && styles.continueBtnDisabled]}
          disabled={picked.length === 0}
          onPress={confirmMulti}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </Pressable>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors, spacing, radius) {
return StyleSheet.create({
  container: { padding: spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  optionSelected: {
    borderColor: colors.saffron,
    backgroundColor: colors.surfaceAlt,
  },
  optionText: { color: colors.text, fontSize: 16, lineHeight: 22 },
  noneOption: {
    borderStyle: 'dashed',
  },
  noneOptionText: { color: colors.textMuted, fontStyle: 'italic' },
  continueBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 1 },
});
}
