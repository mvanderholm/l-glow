import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { quizQuestions } from '../data/content/quiz';
import { useTheme } from '../context/ThemeContext';

const NONE = '__none__';

const SECTION_LABELS = {
  physical: 'The obvious stuff',
  physiological: 'How your body runs',
  psychological: 'How your mind runs',
};

export default function Quiz() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // array of dosha[] per question (multi-select answers hold >1)
  const [picked, setPicked] = useState([]);   // in-progress selections for the current multi-select question
  const styles = makeStyles(colors, spacing, radius);
  const q = quizQuestions[index];
  const progress = (index / quizQuestions.length) * 100;
  const sectionLabel = q.section && SECTION_LABELS[q.section];

  function finish(allAnswers) {
    const tally = allAnswers.flat().reduce((acc, d) => ({ ...acc, [d]: (acc[d] || 0) + 1 }), {});
    // Floor of 3 per dosha — caps the max single-dosha result at ~65%, ensures all three are always present
    router.replace({
      pathname: '/result',
      params: { vata: (tally.vata || 0) + 3, pitta: (tally.pitta || 0) + 3, kapha: (tally.kapha || 0) + 3 },
    });
  }

  function advance(doshasForQuestion) {
    const next = [...answers, doshasForQuestion];
    setPicked([]);
    if (index + 1 >= quizQuestions.length) {
      finish(next);
    } else {
      setAnswers(next);
      setIndex(index + 1);
    }
  }

  function pickSingle(dosha) {
    advance(dosha === NONE ? [] : [dosha]);
  }

  function toggleMulti(dosha) {
    if (dosha === NONE) {
      setPicked(sel => (sel.includes(NONE) ? [] : [NONE]));
      return;
    }
    setPicked(sel => {
      const withoutNone = sel.filter(d => d !== NONE);
      return withoutNone.includes(dosha)
        ? withoutNone.filter(d => d !== dosha)
        : [...withoutNone, dosha];
    });
  }

  function confirmMulti() {
    advance(picked.includes(NONE) ? [] : picked);
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={[type.label, { marginTop: spacing.md }]}>
        Question {index + 1} of {quizQuestions.length}{sectionLabel ? ` · ${sectionLabel}` : ''}
      </Text>
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
        const isSelected = q.multiSelect && picked.includes(opt.dosha);
        return (
          <Pressable
            key={i}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => (q.multiSelect ? toggleMulti(opt.dosha) : pickSingle(opt.dosha))}
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
