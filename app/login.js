import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Svg, { Path, Circle } from 'react-native-svg';

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-email':           return 'That doesn\'t look like a valid email address.';
    case 'auth/user-not-found':          return 'No account found with that email.';
    case 'auth/wrong-password':          return 'Wrong password. Try again, or reset it below.';
    case 'auth/invalid-credential':      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':       return 'Too many attempts. Try again in a few minutes.';
    case 'auth/network-request-failed':  return 'No connection. Check your internet and try again.';
    default:                             return 'Something went wrong. Try again.';
  }
}

export default function Login() {
  const { theme: { colors: c } } = useTheme();
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/');
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email.trim()) { setError('Enter your email address above first.'); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
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
          <Text style={[s.title, { color: c.text }]}>Welcome back.</Text>
          <Text style={[s.sub, { color: c.textMedium }]}>Sign in to sync your practice across devices.</Text>

          {/* Form */}
          <View style={s.form}>
            <View style={s.fieldWrap}>
              <Text style={[s.label, { color: c.textMuted }]}>Email</Text>
              <TextInput
                style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
                value={email}
                onChangeText={t => { setEmail(t); setError(''); setResetSent(false); }}
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
                placeholder="Your password"
                placeholderTextColor={c.textMuted}
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                onSubmitEditing={handleSignIn}
                returnKeyType="go"
              />
            </View>

            {error ? (
              <Text style={[s.error, { color: c.terracotta || '#C97855' }]}>{error}</Text>
            ) : null}

            {resetSent ? (
              <Text style={[s.resetSent, { color: c.sage || '#7AB878' }]}>
                Reset link sent — check your inbox.
              </Text>
            ) : null}

            <Pressable
              style={[s.btn, { backgroundColor: (email.trim() && password) ? c.accent : c.border }]}
              onPress={handleSignIn}
              disabled={loading || !email.trim() || !password}
            >
              {loading
                ? <ActivityIndicator color="#FBF9F4" />
                : <Text style={s.btnText}>SIGN IN  ›</Text>
              }
            </Pressable>

            <Pressable style={s.forgotBtn} onPress={handleReset} disabled={loading}>
              <Text style={[s.forgotText, { color: c.textMuted }]}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={[s.divider, { backgroundColor: c.border }]} />

          {/* Sign up link */}
          <View style={s.footerRow}>
            <Text style={[s.footerText, { color: c.textMedium }]}>No account yet?</Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text style={[s.footerLink, { color: c.accent }]}>  Create one</Text>
            </Pressable>
          </View>

          {/* Continue without account */}
          <Pressable style={s.skipBtn} onPress={() => router.replace('/')}>
            <Text style={[s.skipText, { color: c.textMuted }]}>Continue without signing in</Text>
          </Pressable>

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
  resetSent: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 8 },
  btn:       { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8,
               shadowColor: '#9A5151', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 3 },
  btnText:   { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },
  forgotBtn: { alignSelf: 'center', paddingVertical: 12, marginTop: 4 },
  forgotText:{ fontFamily: 'Inter_400Regular', fontSize: 13.5 },
  divider:   { height: StyleSheet.hairlineWidth, marginVertical: 28 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  footerText:{ fontFamily: 'Inter_400Regular', fontSize: 15 },
  footerLink:{ fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  skipBtn:   { alignSelf: 'center', paddingVertical: 10 },
  skipText:  { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
});
