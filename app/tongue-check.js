import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { tongueSteps, tongueSignList, computeReading } from '../data/content/tongueCheck';
import { saveTongueResult } from '../data/user/storage';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';
import Svg, { Path } from 'react-native-svg';

// Source: transcript 27 (062426_01), June 2026. Content is DRAFT — Thea to review.

// phase 0 = intro, 1–4 = observation steps, 5 = other signs
const SIGNS_PHASE = tongueSteps.length + 1;

export default function TongueCheck() {
  const { theme: { colors: c } } = useTheme();
  const [phase, setPhase]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [signs, setSigns]     = useState(new Set());
  const [stepPicked, setStepPicked] = useState(null); // index into step.options for the current observation step

  const isIntro = phase === 0;
  const isSigns = phase === SIGNS_PHASE;
  const isStep  = !isIntro && !isSigns;
  const step    = isStep ? tongueSteps[phase - 1] : null;
  const progress = isIntro ? 0 : (phase / SIGNS_PHASE) * 100;

  function goBack() {
    if (phase === 0) smartBack();
    else setPhase(phase - 1);
    setStepPicked(null);
  }

  function confirmStep() {
    const opt = step.options[stepPicked];
    setAnswers({ ...answers, [step.id]: { signal: opt.signal, ama: opt.ama ?? null } });
    setStepPicked(null);
    setPhase(phase + 1);
  }

  function toggleSign(id) {
    const next = new Set(signs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSigns(next);
  }

  async function finish() {
    const shape   = answers.shape?.signal   ?? 'unclear';
    const size    = answers.size?.signal    ?? 'unclear';
    const color   = answers.color?.signal   ?? 'unclear';
    const coating = answers.coating?.signal ?? 'none';
    const amaLevel = answers.coating?.ama   ?? 0;
    const signList = [...signs];
    const reading = computeReading(shape, size, color);

    await saveTongueResult(reading, { shape, size, color, coating, amaLevel, signs: signList });

    router.replace({
      pathname: '/tongue-result',
      params: { shape, size, color, coating, ama: amaLevel, signs: signList.join(',') },
    });
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>

      {!isIntro && (
        <View style={[s.progressTrack, { backgroundColor: c.surfaceAlt }]}>
          <View style={[s.progressFill, { width: `${progress}%`, backgroundColor: c.saffron }]} />
        </View>
      )}

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Intro ── */}
        {isIntro && (
          <>
            <BackButton onPress={goBack} color={c.textMuted} style={{ marginBottom: 20 }} />

            <Text style={[s.overline, { color: c.textMuted }]}>Tongue check-in</Text>
            <Text style={[s.prompt, { color: c.text }]}>Your body is always talking.</Text>
            <Text style={[s.body, { color: c.textMedium }]}>
              {'The tongue is one of Ayurveda\'s oldest diagnostic windows — a map of what\'s happening inside. This isn\'t medical. It\'s the language of the body, and you\'re learning to read it.'}
            </Text>

            <View style={[s.disclaimerCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[s.disclaimerTitle, { color: c.text }]}>Before you begin</Text>
              <Text style={[s.disclaimerBody, { color: c.textMedium }]}>
                {'Best time is morning — before food, coffee, tongue scraping, brushing, or supplements. Take a few deep breaths first. Your body reads differently when you\'re settled than when you\'re rushing.\n\nThis tool is for self-awareness and Ayurvedic education only. It is not a medical diagnosis or a substitute for professional care.'}
              </Text>
            </View>

            <View style={[s.phraseCard, { backgroundColor: c.surfaceAlt }]}>
              <Text style={[s.phrase, { color: c.text }]}>These are clues, not conclusions.</Text>
            </View>

            <Pressable style={[s.btn, { backgroundColor: c.accent }]} onPress={() => setPhase(1)}>
              <Text style={s.btnText}>BEGIN  ›</Text>
            </Pressable>
          </>
        )}

        {/* ── Observation steps ── */}
        {isStep && (
          <>
            <View style={s.topRow}>
              <BackButton onPress={goBack} color={c.textMuted} />
              <Text style={[s.counter, { color: c.textMuted }]}>
                {phase} / {SIGNS_PHASE}
              </Text>
            </View>

            <Text style={[s.overline, { color: c.textMuted }]}>Tongue check-in</Text>
            {step.instruction && (
              <Text style={[s.instruction, { color: c.textMuted }]}>{step.instruction}</Text>
            )}
            <Text style={[s.prompt, { color: c.text }]}>{step.prompt}</Text>

            {step.options.map((opt, i) => (
              <Pressable
                key={i}
                style={[s.option, { backgroundColor: c.surface, borderColor: c.border }, stepPicked === i && { borderColor: c.saffron, backgroundColor: c.surfaceAlt }]}
                onPress={() => setStepPicked(i)}
              >
                <Text style={[s.optionLabel, { color: c.text }]}>{opt.label}</Text>
                {opt.sub && (
                  <Text style={[s.optionSub, { color: c.textMuted }]}>{opt.sub}</Text>
                )}
              </Pressable>
            ))}

            <Pressable
              style={[s.btn, { backgroundColor: c.accent, marginTop: 8 }, stepPicked === null && { opacity: 0.4 }]}
              disabled={stepPicked === null}
              onPress={confirmStep}
            >
              <Text style={s.btnText}>CONTINUE  ›</Text>
            </Pressable>
          </>
        )}

        {/* ── Other signs (multi-select) ── */}
        {isSigns && (
          <>
            <View style={s.topRow}>
              <BackButton onPress={goBack} color={c.textMuted} />
              <Text style={[s.counter, { color: c.textMuted }]}>
                {phase} / {SIGNS_PHASE}
              </Text>
            </View>

            <Text style={[s.overline, { color: c.textMuted }]}>Tongue check-in</Text>
            <Text style={[s.prompt, { color: c.text }]}>Anything else you notice?</Text>
            <Text style={[s.instruction, { color: c.textMuted }]}>
              Select all that apply, or skip straight through.
            </Text>

            {tongueSignList.map(sign => {
              const selected = signs.has(sign.id);
              return (
                <Pressable
                  key={sign.id}
                  style={[
                    s.option,
                    {
                      backgroundColor: c.surface,
                      borderColor: selected ? c.saffron : c.border,
                    },
                  ]}
                  onPress={() => toggleSign(sign.id)}
                >
                  <View style={s.signRow}>
                    <Text style={[s.optionLabel, { color: c.text, flex: 1 }]}>{sign.label}</Text>
                    {selected && <CheckIcon color={c.saffron} />}
                  </View>
                </Pressable>
              );
            })}

            <Pressable style={[s.btn, { backgroundColor: c.accent, marginTop: 8 }]} onPress={finish}>
              <Text style={s.btnText}>SEE MY READING  ›</Text>
            </Pressable>

            <Pressable style={s.skipBtn} onPress={finish}>
              <Text style={[s.skipText, { color: c.textMuted }]}>None of these — skip</Text>
            </Pressable>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function CheckIcon({ color }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const s = StyleSheet.create({
  progressTrack: { height: 3, width: '100%' },
  progressFill:  { height: 3 },

  scroll:  { padding: 24, paddingTop: 16, paddingBottom: 48 },
  topRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, height: 40 },
  counter: { fontFamily: 'Inter_400Regular', fontSize: 13.5 },

  overline:    { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  instruction: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginBottom: 8, color: '#9A8F86' },
  prompt:      { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 34, marginBottom: 24 },
  body:        { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 25, marginBottom: 20 },

  disclaimerCard:  { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 16 },
  disclaimerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 8 },
  disclaimerBody:  { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 },

  phraseCard: { borderRadius: 18, padding: 18, marginBottom: 28, alignItems: 'center' },
  phrase:     { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 18, lineHeight: 26, textAlign: 'center' },

  option: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  optionLabel: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22 },
  optionSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, marginTop: 4 },
  signRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },

  btn:     { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },

  skipBtn:  { alignSelf: 'center', paddingVertical: 10 },
  skipText: { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
});
