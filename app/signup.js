import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Svg, { Path } from 'react-native-svg';

function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':    return 'An account with that email already exists. Try signing in.';
    case 'auth/invalid-email':           return 'That doesn\'t look like a valid email address.';
    case 'auth/weak-password':           return 'Password must be at least 6 characters.';
    case 'auth/network-request-failed':  return 'No connection. Check your internet and try again.';
    default:                             return 'Something went wrong. Try again.';
  }
}

export default function Signup() {
  const { theme: { colors: c } } = useTheme();
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const canSubmit = email.trim() && password.length >= 6 && password === confirm;

  async function handleSignUp() {
    if (!canSubmit) {
      if (password !== confirm) { setError('Passwords don\'t match.'); return; }
      if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      router.replace('/');
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Back */}
          <Pressable style={s.back} onPress={() => router.back()} hitSlop={8}>
            <BackIcon color={c.textMuted} />
          </Pressable>

          {/* Header */}
          <Text style={[s.overline, { color: c.textMuted }]}>L. Glow</Text>
          <Text style={[s.title, { color: c.text }]}>Create your account.</Text>
          <Text style={[s.sub, { color: c.textMedium }]}>
            Save your practice and access it on any device. Free to start.
          </Text>

          {/* Form */}
          <View style={s.form}>
            <View style={s.fieldWrap}>
              <Text style={[s.label, { color: c.textMuted }]}>Email</Text>
              <TextInput
                style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
                value={email}
                onChangeText={t => { setEmail(t); setError(''); }}
                placeholder="your@email.com"
                placeholderTextColor={c.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            <View style={s.fieldWrap}>
              <Text style={[s.label, { color: c.textMuted }]}>Password</Text>
              <TextInput
                style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
                value={password}
                onChangeText={t => { setPassword(t); setError(''); }}
                placeholder="6 characters minimum"
                placeholderTextColor={c.textMuted}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
              />
            </View>

            <View style={s.fieldWrap}>
              <Text style={[s.label, { color: c.textMuted }]}>Confirm password</Text>
              <TextInput
                style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text,
                  borderColor: confirm && password !== confirm ? (c.terracotta || '#C97855') : c.border }]}
                value={confirm}
                onChangeText={t => { setConfirm(t); setError(''); }}
                placeholder="Same password again"
                placeholderTextColor={c.textMuted}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                onSubmitEditing={handleSignUp}
                returnKeyType="go"
              />
            </View>

            {error ? (
              <Text style={[s.error, { color: c.terracotta || '#C97855' }]}>{error}</Text>
            ) : null}

            <Pressable
              style={[s.btn, { backgroundColor: canSubmit ? c.accent : c.border }]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FBF9F4" />
                : <Text style={s.btnText}>CREATE ACCOUNT  ›</Text>
              }
            </Pressable>
          </View>

          {/* Divider */}
          <View style={[s.divider, { backgroundColor: c.border }]} />

          {/* Sign in link */}
          <View style={s.footerRow}>
            <Text style={[s.footerText, { color: c.textMedium }]}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={[s.footerLink, { color: c.accent }]}>  Sign in</Text>
            </Pressable>
          </View>

          {/* Continue without account */}
          <Pressable style={s.skipBtn} onPress={() => router.replace('/')}>
            <Text style={[s.skipText, { color: c.textMuted }]}>Continue without signing in</Text>
          </Pressable>

          <Text style={[s.legal, { color: c.textMuted }]}>
            By creating an account you agree to share your practice data with L. Glow. Your data is private and never sold.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BackIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const s = StyleSheet.create({
  scroll:    { flexGrow: 1, padding: 28, paddingTop: 12 },
  back:      { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  overline:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  title:     { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 34, lineHeight: 40, marginBottom: 8 },
  sub:       { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginBottom: 36 },
  form:      { gap: 4 },
  fieldWrap: { marginBottom: 16 },
  label:     { fontFamily: 'Inter_600SemiBold', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input:     { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontFamily: 'Inter_400Regular' },
  error:     { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 8 },
  btn:       { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8,
               shadowColor: '#9A5151', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 3 },
  btnText:   { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },
  divider:   { height: StyleSheet.hairlineWidth, marginVertical: 28 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  footerText:{ fontFamily: 'Inter_400Regular', fontSize: 15 },
  footerLink:{ fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  skipBtn:   { alignSelf: 'center', paddingVertical: 10, marginBottom: 12 },
  skipText:  { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
  legal:     { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 8 },
});
