import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { accentShadowSm } from '../theme/index';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import Svg, { Path, Circle } from 'react-native-svg';

function EyeIcon({ color, visible }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.6} />
      {!visible && <Path d="M3 3l18 18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />}
    </Svg>
  );
}

function friendlyError(code) {
  switch (code) {
    case 'user_already_exists':          return 'An account with that email already exists. Try signing in.';
    case 'validation_failed':            return 'That doesn\'t look like a valid email address.';
    case 'weak_password':                return 'Password must be at least 6 characters.';
    case 'over_email_send_rate_limit':   return 'Too many attempts. Try again in a few minutes.';
    case 'network_error':                return 'No connection. Check your internet and try again.';
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
  const [confirmSent, setConfirmSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

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
      const { needsEmailConfirmation } = await signUp(email.trim(), password);
      if (needsEmailConfirmation) {
        setConfirmSent(true);
      } else {
        router.replace('/');
      }
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  if (confirmSent) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={[s.scroll, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 44, marginBottom: 16 }}>✉️</Text>
          <Text style={[s.title, { color: c.text, textAlign: 'center', fontSize: 26 }]}>Confirm your email</Text>
          <Text style={[s.sub, { color: c.textMedium, textAlign: 'center' }]}>
            We sent a confirmation link to{'\n'}
            <Text style={{ color: c.text, fontFamily: 'Inter_600SemiBold' }}>{email}</Text>
            {'\n\n'}Tap it on this device to finish creating your account.
          </Text>
          <Pressable style={s.skipBtn} onPress={() => router.replace('/')}>
            <Text style={[s.skipText, { color: c.textMuted }]}>Continue without signing in</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Back */}
          <BackButton onPress={() => router.back()} color={c.textMuted} style={s.back} />

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
              <View style={s.inputRow}>
                <TextInput
                  style={[s.input, s.inputWithIcon, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
                  value={password}
                  onChangeText={t => { setPassword(t); setError(''); }}
                  placeholder="6 characters minimum"
                  placeholderTextColor={c.textMuted}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                  <EyeIcon color={c.textMuted} visible={showPassword} />
                </Pressable>
              </View>
            </View>

            <View style={s.fieldWrap}>
              <Text style={[s.label, { color: c.textMuted }]}>Confirm password</Text>
              <View style={s.inputRow}>
                <TextInput
                  style={[s.input, s.inputWithIcon, { backgroundColor: c.surface, borderColor: c.border, color: c.text,
                    borderColor: confirm && password !== confirm ? (c.terracotta || '#C97855') : c.border }]}
                  value={confirm}
                  onChangeText={t => { setConfirm(t); setError(''); }}
                  placeholder="Same password again"
                  placeholderTextColor={c.textMuted}
                  secureTextEntry={!showConfirm}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  onSubmitEditing={handleSignUp}
                  returnKeyType="go"
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
                  <EyeIcon color={c.textMuted} visible={showConfirm} />
                </Pressable>
              </View>
            </View>

            {error ? (
              <Text style={[s.error, { color: c.terracotta || '#C97855' }]}>{error}</Text>
            ) : null}

            <Pressable
              style={[s.btn, { backgroundColor: canSubmit ? c.accent : c.border, shadowColor: c.accent }]}
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

const s = StyleSheet.create({
  scroll:    { flexGrow: 1, padding: 20, paddingTop: 12 },
  back:      { marginBottom: 12 },
  overline:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  title:     { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 34, lineHeight: 40, marginBottom: 8 },
  sub:       { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginBottom: 36 },
  form:      { gap: 4 },
  fieldWrap: { marginBottom: 16 },
  label:     { fontFamily: 'Inter_600SemiBold', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input:     { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontFamily: 'Inter_400Regular' },
  inputRow:  { position: 'relative', justifyContent: 'center' },
  inputWithIcon: { paddingRight: 48 },
  eyeBtn:    { position: 'absolute', right: 14, height: '100%', justifyContent: 'center', alignItems: 'center' },
  error:     { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 8 },
  btn:       { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8, ...accentShadowSm },
  btnText:   { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },
  divider:   { height: StyleSheet.hairlineWidth, marginVertical: 28 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  footerText:{ fontFamily: 'Inter_400Regular', fontSize: 15 },
  footerLink:{ fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  skipBtn:   { alignSelf: 'center', paddingVertical: 10, marginBottom: 12 },
  skipText:  { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
  legal:     { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 8 },
});
