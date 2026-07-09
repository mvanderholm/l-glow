import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-email':          return 'That doesn\'t look like a valid email address.';
    case 'auth/user-not-found':         return 'No account found with that email.';
    case 'auth/wrong-password':         return 'Wrong password. Try again, or reset it below.';
    case 'auth/invalid-credential':     return 'Email or password is incorrect.';
    case 'auth/too-many-requests':      return 'Too many attempts. Try again in a few minutes.';
    case 'auth/network-request-failed': return 'No connection. Check your internet and try again.';
    case 'auth/invalid-action-code':    return 'That link has expired or already been used. Request a new one.';
    default:                            return 'Something went wrong. Try again.';
  }
}

// ── Password tab ───────────────────────────────────────────────────────────

function PasswordTab({ colors: c }) {
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) return;
    setError(''); setLoading(true);
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
    setError(''); setLoading(true);
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
    <View style={s.tabBody}>
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

      {error     ? <Text style={[s.msg, { color: '#C97855' }]}>{error}</Text>     : null}
      {resetSent ? <Text style={[s.msg, { color: '#7AB878' }]}>Reset link sent — check your inbox.</Text> : null}

      <Pressable
        style={[s.btn, { backgroundColor: (email.trim() && password) ? c.accent : c.border }]}
        onPress={handleSignIn}
        disabled={loading || !email.trim() || !password}
      >
        {loading ? <ActivityIndicator color="#FBF9F4" /> : <Text style={s.btnText}>SIGN IN  ›</Text>}
      </Pressable>

      <Pressable style={s.forgotBtn} onPress={handleReset} disabled={loading}>
        <Text style={[s.forgotText, { color: c.textMuted }]}>Forgot password?</Text>
      </Pressable>
    </View>
  );
}

// ── Magic link tab ─────────────────────────────────────────────────────────

function MagicLinkTab({ colors: c }) {
  const { sendMagicLink, completeMagicLink, pendingMagicUrl, clearPendingMagicUrl } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  // "wrong device" — link opened here but email wasn't stored on this device
  const [confirmEmail, setConfirmEmail] = useState('');

  // If AuthContext surfaces a pending URL (link opened on a different device),
  // switch to the confirm-email prompt automatically.
  const needsEmailConfirm = !!pendingMagicUrl;

  async function handleSend() {
    if (!email.trim()) return;
    setError(''); setLoading(true);
    try {
      await sendMagicLink(email.trim());
      setSent(true);
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    if (!confirmEmail.trim()) return;
    setError(''); setLoading(true);
    try {
      await completeMagicLink(confirmEmail.trim());
      router.replace('/');
    } catch (e) {
      setError(friendlyError(e.code));
      setLoading(false);
    }
  }

  // "Wrong device" confirm-email prompt
  if (needsEmailConfirm) {
    return (
      <View style={s.tabBody}>
        <Text style={[s.magicHeading, { color: c.text }]}>One more thing</Text>
        <Text style={[s.magicSub, { color: c.textMedium }]}>
          You opened the sign-in link on a different device. Enter your email to finish signing in.
        </Text>
        <View style={s.fieldWrap}>
          <Text style={[s.label, { color: c.textMuted }]}>Your email address</Text>
          <TextInput
            style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
            value={confirmEmail}
            onChangeText={t => { setConfirmEmail(t); setError(''); }}
            placeholder="your@email.com"
            placeholderTextColor={c.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
        </View>
        {error ? <Text style={[s.msg, { color: '#C97855' }]}>{error}</Text> : null}
        <Pressable
          style={[s.btn, { backgroundColor: confirmEmail.trim() ? c.accent : c.border }]}
          onPress={handleComplete}
          disabled={loading || !confirmEmail.trim()}
        >
          {loading ? <ActivityIndicator color="#FBF9F4" /> : <Text style={s.btnText}>FINISH SIGNING IN  ›</Text>}
        </Pressable>
        <Pressable style={s.forgotBtn} onPress={clearPendingMagicUrl}>
          <Text style={[s.forgotText, { color: c.textMuted }]}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  // Post-send confirmation
  if (sent) {
    return (
      <View style={[s.tabBody, { alignItems: 'center', paddingTop: 20 }]}>
        <Text style={[s.sentEmoji]}>✉️</Text>
        <Text style={[s.magicHeading, { color: c.text, textAlign: 'center' }]}>Check your inbox</Text>
        <Text style={[s.magicSub, { color: c.textMedium, textAlign: 'center' }]}>
          We sent a sign-in link to{'\n'}<Text style={{ color: c.text, fontFamily: 'Inter_600SemiBold' }}>{email}</Text>
        </Text>
        <Text style={[s.magicSub, { color: c.textMuted, textAlign: 'center', marginTop: 8 }]}>
          Tap the link in the email on this device and you'll be signed in automatically.
        </Text>
        <Pressable style={s.forgotBtn} onPress={() => { setSent(false); setEmail(''); }}>
          <Text style={[s.forgotText, { color: c.textMuted }]}>Use a different address</Text>
        </Pressable>
      </View>
    );
  }

  // Default: email entry
  return (
    <View style={s.tabBody}>
      <Text style={[s.magicSub, { color: c.textMedium, marginBottom: 20 }]}>
        No password needed. We'll email you a link — tap it and you're in.
      </Text>
      <View style={s.fieldWrap}>
        <Text style={[s.label, { color: c.textMuted }]}>Your email address</Text>
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
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
      </View>
      {error ? <Text style={[s.msg, { color: '#C97855' }]}>{error}</Text> : null}
      <Pressable
        style={[s.btn, { backgroundColor: email.trim() ? c.accent : c.border }]}
        onPress={handleSend}
        disabled={loading || !email.trim()}
      >
        {loading ? <ActivityIndicator color="#FBF9F4" /> : <Text style={s.btnText}>SEND LINK  ›</Text>}
      </Pressable>
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function Login() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState('magic'); // 'password' | 'magic'

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <BackButton onPress={() => router.back()} color={c.textMuted} style={s.back} />

          {/* Header */}
          <Text style={[s.overline, { color: c.textMuted }]}>L. Glow</Text>
          <Text style={[s.title, { color: c.text }]}>Welcome back.</Text>

          {/* Tab switcher */}
          <View style={[s.tabs, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            {[
              { key: 'magic',    label: 'Magic link' },
              { key: 'password', label: 'Password' },
            ].map(t => (
              <Pressable
                key={t.key}
                style={[s.tab, tab === t.key && { backgroundColor: c.surface, ...tabShadow }]}
                onPress={() => setTab(t.key)}
              >
                <Text style={[s.tabText, { color: tab === t.key ? c.text : c.textMuted }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Tab content */}
          {tab === 'magic' ? <MagicLinkTab colors={c} /> : <PasswordTab colors={c} />}

          {/* Divider */}
          <View style={[s.divider, { backgroundColor: c.border }]} />

          {/* Sign up */}
          <View style={s.footerRow}>
            <Text style={[s.footerText, { color: c.textMedium }]}>No account yet?</Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text style={[s.footerLink, { color: c.accent }]}>  Create one</Text>
            </Pressable>
          </View>

          {/* Skip */}
          <Pressable style={s.skipBtn} onPress={() => router.replace('/')}>
            <Text style={[s.skipText, { color: c.textMuted }]}>Continue without signing in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const tabShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
};

const s = StyleSheet.create({
  scroll:    { flexGrow: 1, padding: 28, paddingTop: 12 },
  back:      { marginBottom: 12 },
  overline:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  title:     { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 34, lineHeight: 40, marginBottom: 20 },

  tabs:      { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, marginBottom: 24 },
  tab:       { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  tabText:   { fontFamily: 'Inter_600SemiBold', fontSize: 14 },

  tabBody:   { gap: 0 },
  fieldWrap: { marginBottom: 16 },
  label:     { fontFamily: 'Inter_600SemiBold', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input:     { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontFamily: 'Inter_400Regular' },
  msg:       { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 2, marginBottom: 8 },
  btn:       { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8,
               shadowColor: '#9A5151', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 3 },
  btnText:   { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5, letterSpacing: 1.4 },
  forgotBtn: { alignSelf: 'center', paddingVertical: 12, marginTop: 4 },
  forgotText:{ fontFamily: 'Inter_400Regular', fontSize: 13.5 },

  magicHeading: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, lineHeight: 28, marginBottom: 8 },
  magicSub:     { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22 },
  sentEmoji:    { fontSize: 44, marginBottom: 16 },

  divider:   { height: StyleSheet.hairlineWidth, marginVertical: 28 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  footerText:{ fontFamily: 'Inter_400Regular', fontSize: 15 },
  footerLink:{ fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  skipBtn:   { alignSelf: 'center', paddingVertical: 10 },
  skipText:  { fontFamily: 'Inter_400Regular', fontSize: 13.5 },
});
