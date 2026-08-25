// Soft "you've done real work here, don't lose it" prompt for a signed-out
// guest — never a hard gate (the app lets people explore everything before
// committing to an account, on purpose, and this doesn't change that).
// Shown at most once ever across every surface that renders it (see
// loadSignupNudgeDismissed/saveSignupNudgeDismissed in data/user/storage.js)
// — dismissing it here (closing it, or tapping either button) means it
// won't reappear on the next completion moment either. Aug 25 2026, scoped
// with Matt to three specific completion moments (Dosha Quiz result, the
// assessments checklist modal, a fully-filled intake form) rather than
// nudging on every recurring action (check-ins, journal) — that would cross
// into the nagging mechanics the app's tone explicitly avoids.

import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { loadSignupNudgeDismissed, saveSignupNudgeDismissed } from '../data/user/storage';

export default function SignupNudge({ message }) {
  const { user } = useAuth();
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(true); // default hidden until we know it's safe to show

  useEffect(() => {
    if (user) return;
    loadSignupNudgeDismissed().then(setDismissed);
  }, [user]);

  if (user || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    saveSignupNudgeDismissed();
  }

  function go(href) {
    dismiss();
    router.push(href);
  }

  return (
    <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Pressable style={s.closeBtn} onPress={dismiss} hitSlop={10}>
        <Text style={{ color: c.textMuted, fontSize: 20, lineHeight: 20 }}>×</Text>
      </Pressable>
      <Text style={[type.label, { color: c.textMuted, paddingRight: 24 }]}>Don't lose this</Text>
      <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 24 }]}>{message}</Text>
      <Pressable style={[s.primaryBtn, { backgroundColor: c.accent }]} onPress={() => go('/signup')}>
        <Text style={s.primaryBtnText}>Create account</Text>
      </Pressable>
      <Pressable style={s.secondaryBtn} onPress={() => go('/login')}>
        <Text style={[s.secondaryBtnText, { color: c.textMuted }]}>Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  secondaryBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 6,
  },
  secondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13.5,
  },
});
