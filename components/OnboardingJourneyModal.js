// [DRAFT] copy — written in Thea's voice per the voice guide, but not yet
// reviewed by her. Flag for her line-edit pass before this is final, same
// as the other [DRAFT]-tagged screens (welcome.js, about.js).
//
// Shows once, automatically, on a new signee's first home-screen visit —
// answers "I don't know what to do" directly (real test-user feedback, see
// supabase/migrations/TODO.md). Two paths: self-serve (all six assessments,
// take in any order, no locking) or skip straight to working with Thea
// (intake form). Gated on its own AsyncStorage flag (loadOnboardingJourneySeen
// / saveOnboardingJourneySeen in data/user/storage.js) — separate from the
// existing ONBOARDED flag, which just means "has seen the welcome screen."
// Deliberately kept alongside the smaller GettingStartedCard on the home
// screen (Matt's call) rather than replacing it — this modal is the one-time
// full tour; that card is the ongoing nudge for whichever of its two steps
// (dosha quiz, first check-in) aren't done yet.
//
// Step "done" status is derived from existing result data (no new schema):
// Prakriti/Vikriti count as started once their first tier (foundation/
// level1) has been completed, same proxy the tier hubs themselves use.

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import {
  loadDoshaResult, loadPrakritiProgress, loadGunaResult,
  loadVikritiProgress, loadAgniResult, loadTongueResult,
  loadOnboardingJourneySeen, saveOnboardingJourneySeen,
} from '../data/user/storage';
import Svg, { Path } from 'react-native-svg';

const STEPS = [
  { key: 'dosha',    label: 'Meet your Dosha',          sub: 'A five-minute quiz — your baseline blend.',    href: '/quiz',         Icon: LeafIcon },
  { key: 'prakriti', label: 'Discover your Blueprint',   sub: 'What you were built with, from birth.',        href: '/prakriti',     Icon: PrakritiIcon },
  { key: 'guna',     label: "Where's your mind at",      sub: 'The mental and emotional layer.',              href: '/guna-quiz',    Icon: GunaIcon },
  { key: 'vikriti',  label: 'Check your current state',  sub: "What's true for you right now.",               href: '/vikriti',      Icon: VikritiIcon },
  { key: 'agni',     label: 'Read your digestive fire',  sub: 'How your body is processing things lately.',   href: '/agni-quiz',    Icon: FireIcon },
  { key: 'tongue',   label: 'Do a Tongue Check',         sub: 'A quick morning read, before coffee.',         href: '/tongue-check', Icon: TongueIcon },
];

export default function OnboardingJourneyModal() {
  const { theme: { colors: c, type, spacing } } = useTheme();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState({});

  useEffect(() => { checkAndMaybeShow(); }, []);

  async function checkAndMaybeShow() {
    const seen = await loadOnboardingJourneySeen();
    if (seen) return;
    const [dosha, prakriti, guna, vikriti, agni, tongue] = await Promise.all([
      loadDoshaResult(), loadPrakritiProgress(), loadGunaResult(),
      loadVikritiProgress(), loadAgniResult(), loadTongueResult(),
    ]);
    setDone({
      dosha: !!dosha,
      prakriti: !!prakriti.foundation,
      guna: !!guna,
      vikriti: !!vikriti.level1,
      agni: !!agni,
      tongue: !!tongue,
    });
    setVisible(true);
  }

  function dismiss() {
    setVisible(false);
    saveOnboardingJourneySeen();
  }

  function go(href) {
    dismiss();
    router.push(href);
  }

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismiss}>
      <View style={s.backdrop}>
        <View style={[s.sheet, { backgroundColor: c.surface }]}>
          <Pressable style={s.closeBtn} onPress={dismiss} hitSlop={10}>
            <Text style={{ color: c.textMuted, fontSize: 22, lineHeight: 22 }}>×</Text>
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
            <Text style={[type.h2, { color: c.text, marginBottom: 6, paddingRight: 24 }]}>New here? We got you.</Text>
            <Text style={[type.body, { color: c.textMedium, marginBottom: spacing.lg }]}>
              Six quick reads on your body and mind. Take them in order, or jump around — nothing here is timed or graded.
            </Text>

            {STEPS.map(step => (
              <Pressable key={step.key} style={s.row} onPress={() => go(step.href)}>
                <View style={[s.dot, { borderColor: done[step.key] ? c.accent : c.border, backgroundColor: done[step.key] ? c.accent : 'transparent' }]}>
                  {done[step.key] && <Text style={{ color: '#FBF9F4', fontSize: 10, fontFamily: 'Inter_700Bold' }}>✓</Text>}
                </View>
                <step.Icon color={c.textMuted} size={16} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[s.rowLabel, { color: c.text, opacity: done[step.key] ? 0.5 : 1 }]}>{step.label}</Text>
                  <Text style={[s.rowSub, { color: c.textMuted }]}>{step.sub}</Text>
                </View>
                <Text style={{ color: c.textMuted, fontSize: 16 }}>›</Text>
              </Pressable>
            ))}

            <View style={[s.divider, { borderTopColor: c.border }]} />

            <Text style={[type.label, { color: c.textMuted, marginBottom: 10 }]}>Or skip the self-serve route</Text>
            <Pressable style={[s.introBtn, { backgroundColor: c.accent }]} onPress={() => go('/intake')}>
              <Text style={s.introBtnText}>Work with Thea directly</Text>
            </Pressable>
            <Text style={[s.rowSub, { color: c.textMuted, marginTop: 10 }]}>
              Fill out an intake form and she'll take it from there.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function LeafIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} />
    <Path d="M12 21V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function FireIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 2 2.5 2 4.5A5 5 0 0 1 7 14.5C7 9 12 7 12 2Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function GunaIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3 L20 18 L4 18 Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 8 L17 18 L7 18 Z" stroke={color} strokeWidth={0.8} strokeLinejoin="round" opacity="0.5" />
  </Svg>;
}
function TongueIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3c3 0 5 2 5 5.5S15.5 19 12 21C8.5 19 7 12.5 7 8.5S9 3 12 3Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 9v9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function PrakritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21V11" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M12 11c0-4 3-6 7-6 0 4-2 7-7 7Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 14c0-3.5-2.5-5.5-6-5.5 0 3.5 2 6 6 6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function VikritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h3.5l2-6 3 12 2-9 1.5 3H21" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  // RN Web's Modal portals straight to document.body, outside the 480px
  // mobile-frame wrapper app/_layout.js uses to simulate the phone frame on
  // web — without this, the sheet stretches to the full browser width
  // instead of matching the frame. maxWidth/alignSelf are no-ops on native
  // (screen width is already well under 480), so no Platform check needed.
  sheet: { width: '100%', maxWidth: 480, alignSelf: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 20, maxHeight: '85%' },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 1, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  rowLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14.5, marginBottom: 2 },
  rowSub: { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 17 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, marginVertical: 18 },
  introBtn: { borderRadius: 999, paddingVertical: 13, alignItems: 'center' },
  introBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});
