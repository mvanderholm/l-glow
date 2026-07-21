import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import BackButton from '../components/BackButton';
import { loadVikritiProgress } from '../data/user/storage';

// Vikriti hub — same shape as prakriti.js (three-tier progressive
// assessment, kept separate from /quiz). Vikriti is the current state,
// meant to change day to day — retaking a tier isn't just allowed, it's
// the point over time. No computed dosha type/score yet, same reason as
// Prakriti (see docs/roadmap.md #52).

const TIERS = [
  { key: 'level1', label: 'Check Your Signals', tagline: 'Think about the past 2-4 weeks.' },
  { key: 'level2', label: 'Pattern Finder', tagline: 'A closer look at what your body has been showing you.' },
  { key: 'level3', label: 'Your Story', tagline: 'The life context behind the signals.' },
];

export default function Vikriti() {
  const { theme: { colors: c } } = useTheme();
  const [progress, setProgress] = useState(null);

  useFocusEffect(useCallback(() => { loadVikritiProgress().then(setProgress); }, []));

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[s.topHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={() => router.back()} color={c.text} />
        <Text style={[s.topHeaderTitle, { color: c.text }]}>Vikriti</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Text style={[s.intro, { color: c.textMuted }]}>
          Vikriti is your current state — not who you've always been, but what's true right now. Your body isn't failing you, it's giving you clues. Three tiers, each a little closer. Go as deep as feels right; stopping after one tier is still a valid read.
        </Text>

        {!progress && <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>}

        {progress && TIERS.map((tier, i) => {
          const done = progress[tier.key];
          const locked = i > 0 && !progress[TIERS[i - 1].key];
          return (
            <Pressable
              key={tier.key}
              disabled={locked}
              onPress={() => router.push({ pathname: '/vikriti-quiz', params: { tier: tier.key } })}
              style={[s.tierCard, { backgroundColor: c.surface, ...card }, locked && { opacity: 0.5 }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.tierLabel, { color: c.text }]}>{tier.label}</Text>
                <Text style={[s.tierTagline, { color: c.textMuted }]}>{locked ? 'Complete the tier above to unlock' : tier.tagline}</Text>
              </View>
              <Text style={[s.tierState, { color: done ? c.accent : c.textMuted }]}>
                {locked ? '🔒' : done ? 'Retake' : 'Start'}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  topHeaderTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },
  intro: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 21, marginBottom: 20 },
  centerPad: { alignItems: 'center', justifyContent: 'center', padding: 32 },

  tierCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 18, marginBottom: 12 },
  tierLabel: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, marginBottom: 3 },
  tierTagline: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  tierState: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginLeft: 12 },
});
