import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import BackButton from '../components/BackButton';
import { loadPrakritiProgress } from '../data/user/storage';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

// Prakriti hub — three-tier progressive assessment, kept fully separate
// from the existing Dosha Quiz (/quiz) per Matt's explicit call, July 2026,
// until he and Thea decide which they prefer. Tier N unlocks tier N+1 once
// N is completed at least once; a completed tier can always be retaken
// (no punishing re-lock — "it changes," "nothing is required"). No
// computed dosha type/score here yet: dosha tagging on these questions is
// effectively at 0%, so this is raw-answer logging only for now (see
// docs/roadmap.md #52).

const TIERS = [
  { key: 'foundation', label: 'Foundation', tagline: 'Who have you always been?' },
  { key: 'level2', label: 'Level 2', tagline: 'What body and mind were you born into?' },
  { key: 'level3', label: 'Level 3', tagline: "Let's look more closely at the blueprint nature gave you." },
];

export default function Prakriti() {
  const { theme: { colors: c } } = useTheme();
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [expandedTier, setExpandedTier] = useState(null);
  const [history, setHistory] = useState({});

  useFocusEffect(useCallback(() => { loadPrakritiProgress().then(setProgress); }, []));

  async function toggleHistory(tierKey) {
    if (expandedTier === tierKey) { setExpandedTier(null); return; }
    setExpandedTier(tierKey);
    if (!user || history[tierKey]) return;
    const { data } = await supabase.from('prakriti_responses').select('completed_at').eq('user_id', user.id).eq('tier', tierKey).order('completed_at', { ascending: false });
    setHistory(prev => ({ ...prev, [tierKey]: data ?? [] }));
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[s.topHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={() => router.back()} color={c.text} />
        <Text style={[s.topHeaderTitle, { color: c.text }]}>Prakriti</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Text style={[s.intro, { color: c.textMuted }]}>
          Prakriti is the constitution you were born with — fixed, not something that changes with the season or the day. Three tiers, each a little closer. Go as deep as feels right; stopping after one tier is still a valid read.
        </Text>

        {!progress && <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>}

        {progress && TIERS.map((tier, i) => {
          const done = progress[tier.key];
          const locked = i > 0 && !progress[TIERS[i - 1].key];
          const expanded = expandedTier === tier.key;
          return (
            <View key={tier.key} style={[s.tierCard, { backgroundColor: c.surface, ...card }, locked && { opacity: 0.5 }]}>
              <Pressable
                disabled={locked}
                onPress={() => router.push({ pathname: '/prakriti-quiz', params: { tier: tier.key } })}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[s.tierLabel, { color: c.text }]}>{tier.label}</Text>
                  <Text style={[s.tierTagline, { color: c.textMuted }]}>{locked ? 'Complete the tier above to unlock' : tier.tagline}</Text>
                </View>
                <Text style={[s.tierState, { color: done ? c.accent : c.textMuted }]}>
                  {locked ? '🔒' : done ? 'Retake' : 'Start'}
                </Text>
              </Pressable>

              {done && user && (
                <Pressable onPress={() => toggleHistory(tier.key)} style={{ marginTop: 10 }}>
                  <Text style={{ color: c.accent, fontFamily: 'Inter_500Medium', fontSize: 12.5 }}>
                    {expanded ? 'Hide past attempts' : 'Past attempts'}
                  </Text>
                </Pressable>
              )}

              {expanded && (
                <View style={{ marginTop: 8 }}>
                  {!history[tier.key] && <ActivityIndicator color={c.accent} size="small" />}
                  {history[tier.key]?.map((h, i2) => (
                    <Text key={i2} style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 2 }}>
                      {new Date(h.completed_at).toLocaleDateString(undefined, { dateStyle: 'medium' })} at {new Date(h.completed_at).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                    </Text>
                  ))}
                  {history[tier.key]?.length === 0 && (
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted }}>Nothing on record yet.</Text>
                  )}
                </View>
              )}
            </View>
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

  tierCard: { borderRadius: 18, padding: 18, marginBottom: 12 },
  tierLabel: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, marginBottom: 3 },
  tierTagline: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  tierState: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginLeft: 12 },
});
