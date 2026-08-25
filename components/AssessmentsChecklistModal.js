// Shared "here are the six assessments, here's what's done" checklist —
// extracted Aug 23 2026 from OnboardingJourneyModal (which still owns its
// own auto-show-once-on-Home logic and just renders this underneath) so
// every individual assessment's result screen can point to the same list
// after finishing, without duplicating the icons/done-state/row rendering
// six more times. Aug 23 2026, Matt's ask: assessments were dead-ending
// (Home, or a hub screen) instead of guiding someone toward the rest.
//
// Deliberately stateless about *why* it's open — the caller owns its own
// `visible` state and decides what that means (first-run tour vs. "just
// finished one assessment, want to see what's left"). Done-state is always
// re-loaded fresh whenever `visible` flips true, so whatever the caller
// just completed shows up checked automatically, no special-casing needed.

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import {
  loadDoshaResult, loadPrakritiProgress, loadGunaResult,
  loadVikritiProgress, loadAgniResult, loadTongueResult,
} from '../data/user/storage';
import Svg, { Path } from 'react-native-svg';
import SignupNudge from './SignupNudge';

const STEPS = [
  { key: 'dosha',    label: 'Meet your Dosha',          sub: 'A five-minute quiz — your baseline blend.',    href: '/quiz',         Icon: LeafIcon },
  { key: 'prakriti', label: 'Discover your Blueprint',   sub: 'What you were built with, from birth.',        href: '/prakriti',     Icon: PrakritiIcon },
  { key: 'guna',     label: "Where's your mind at",      sub: 'The mental and emotional layer.',              href: '/guna-quiz',    Icon: GunaIcon },
  { key: 'vikriti',  label: 'Check your current state',  sub: "What's true for you right now.",               href: '/vikriti',      Icon: VikritiIcon },
  { key: 'agni',     label: 'Read your digestive fire',  sub: 'How your body is processing things lately.',   href: '/agni-quiz',    Icon: FireIcon },
  { key: 'tongue',   label: 'Do a Tongue Check',         sub: 'A quick morning read, before coffee.',         href: '/tongue-check', Icon: TongueIcon },
];

export default function AssessmentsChecklistModal({ visible, onDismiss, title, subtitle }) {
  const { theme: { colors: c, type, spacing } } = useTheme();
  const router = useRouter();
  const [done, setDone] = useState({});

  useEffect(() => {
    if (visible) loadDoneState();
  }, [visible]);

  async function loadDoneState() {
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
  }

  function go(href) {
    onDismiss();
    router.push(href);
  }

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={s.backdrop}>
        <View style={[s.sheet, { backgroundColor: c.surface }]}>
          <Pressable style={s.closeBtn} onPress={onDismiss} hitSlop={10}>
            <Text style={{ color: c.textMuted, fontSize: 22, lineHeight: 22 }}>×</Text>
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
            <Text style={[type.h2, { color: c.text, marginBottom: 6, paddingRight: 24 }]}>{title}</Text>
            <Text style={[type.body, { color: c.textMedium, marginBottom: spacing.lg }]}>{subtitle}</Text>

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

            <SignupNudge message="Create a free account and everything you've shared here is saved and waiting for you next time." />

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
  // instead of matching the frame. maxWidth/alignSelf are no-ops on native.
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
