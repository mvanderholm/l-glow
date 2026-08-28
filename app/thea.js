import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image, Linking, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { loadMessages, sendMessageAsClient } from '../data/user/messages';
import { BOOKING_URL } from '../data/booking';
import { INSTAGRAM_HANDLE } from '../data/instagram';
import { SPOTIFY_PROFILE_URL } from '../data/content/music';
import LogoMark from '../components/LogoMark';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Thea tab (nav restructure, Move 3/4) — consolidates app/about.js's booking
// CTA, app/messages.js's thread, and the practitioner-view consent toggle
// (moved off /you since it's about what Thea can see) into one destination.
// The full bio stays at /about (too long to duplicate here) — "Her story"
// below is a short excerpt with a link through. app/messages.js becomes a
// redirect stub to here.

export default function Thea() {
  const { theme: { colors: c, spacing, type } } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [consented, setConsented] = useState(null); // null = loading/signed out
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [consentBusy, setConsentBusy] = useState(false);

  useEffect(() => {
    if (!user) { setConsented(false); return; }
    supabase.from('users').select('consented_to_practitioner_view').eq('id', user.id).single()
      .then(({ data }) => setConsented(!!data?.consented_to_practitioner_view));
  }, [user]);

  useEffect(() => {
    if (!user || !consented) { setMessages(null); return; }
    loadMessages(user.id).then(setMessages);
  }, [user, consented]);

  async function toggleConsent(next) {
    setConsented(next);
    setConsentBusy(true);
    const { error } = await supabase.from('users').update({ consented_to_practitioner_view: next }).eq('id', user.id);
    if (error) setConsented(!next);
    setConsentBusy(false);
  }

  async function send() {
    const body = draft.trim();
    if (!body || sending || !user) return;
    setSending(true);
    setDraft('');
    try {
      await sendMessageAsClient(user.id, body);
      setMessages(await loadMessages(user.id));
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 }}>
        <LogoMark size={36} compact />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { backgroundColor: c.surfaceAlt, alignSelf: 'center' }]}>
          <Image source={require('../assets/thea.jpg')} style={{ width: '100%', height: '100%', transform: [{ scale: 1.4 }, { translateY: 5 }] }} resizeMode="cover" />
        </View>
        <Text style={[type.label, { color: c.textMuted, marginTop: spacing.md }]}>Ayurvedic Medicine · RYT · Certified Wellness Coach</Text>
        <Text style={[type.display, { color: c.text, marginTop: 4 }]}>Thea</Text>
        <Text style={[type.bodyItalic, { color: c.textMedium, marginTop: 4 }]}>
          "Nothing is for everybody, and everything is for somebody."
        </Text>

        <View style={[styles.card, { backgroundColor: c.surface, ...card, marginTop: spacing.lg }]}>
          <Text style={[type.label, { color: c.textMuted }]}>Your next step</Text>
          <Text style={[type.h3, { color: c.text, marginTop: 8, marginBottom: 14 }]}>Go through this with Thea directly, one on one.</Text>
          <Pressable style={[styles.bookBtn, { backgroundColor: c.accent }]} onPress={() => Linking.openURL(BOOKING_URL)}>
            <Text style={styles.bookBtnText}>Book a session</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionH, { color: c.text }]}>Messages</Text>
        {!user ? (
          <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13.5, color: c.textMuted, lineHeight: 20, marginBottom: 10 }}>
              Sign in to message Thea directly.
            </Text>
            <Pressable onPress={() => router.push('/login?returnTo=/thea')}>
              <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Go to sign in →</Text>
            </Pressable>
          </View>
        ) : !consented ? (
          <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13.5, color: c.textMuted, lineHeight: 20 }}>
              Turn on "Share my intake form" below first — that's what lets Thea see and reply to your messages.
            </Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
            {messages === null ? (
              <ActivityIndicator color={c.accent} />
            ) : messages.length === 0 ? (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13.5, color: c.textMuted, marginBottom: 10 }}>No messages yet — say hi.</Text>
            ) : (
              <View style={{ marginBottom: 10 }}>
                {messages.slice(-6).map(m => {
                  const mine = m.sender_id === user.id;
                  return (
                    <View key={m.id} style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                      <View style={{ maxWidth: '78%', paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14, backgroundColor: mine ? c.accent : c.surfaceAlt }}>
                        <Text style={{ color: mine ? '#FBF9F4' : c.text, fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 }}>{m.body}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
              <TextInput
                style={[styles.msgInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
                value={draft}
                onChangeText={setDraft}
                placeholder="Write to Thea…"
                placeholderTextColor={c.textMuted}
                multiline
              />
              <Pressable style={[styles.sendBtn, { backgroundColor: draft.trim() ? c.accent : c.border }]} onPress={send} disabled={!draft.trim() || sending}>
                <SendIcon color="#FBF9F4" size={16} />
              </Pressable>
            </View>
          </View>
        )}

        <Text style={[styles.sectionH, { color: c.text }]}>Her story</Text>
        <Pressable style={[styles.card, { backgroundColor: c.surface, ...card }]} onPress={() => router.push('/about')}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 21, color: c.textMedium, fontStyle: 'italic' }}>
            "In 2017, I found yoga after a long run left me realizing my body needed something different. Then, in 2019, my husband challenged me to do something just for me…"
          </Text>
          <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 10 }}>Read her story ›</Text>
        </Pressable>

        {user && (
          <>
            <Text style={[styles.sectionH, { color: c.text }]}>What she can see</Text>
            <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: c.text }}>Share my intake form</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 2 }}>Thea can read your intake and assessments</Text>
                </View>
                <Switch value={!!consented} onValueChange={toggleConsent} disabled={consentBusy} />
              </View>
            </View>
          </>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.xl }}>
          <Pressable style={[styles.socialBtn, { borderColor: c.border }]} onPress={() => Linking.openURL(`https://instagram.com/${INSTAGRAM_HANDLE}`)}>
            <InstagramIcon color={c.textMuted} size={16} />
            <Text style={{ color: c.text, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Instagram</Text>
          </Pressable>
          <Pressable style={[styles.socialBtn, { borderColor: c.border, opacity: SPOTIFY_PROFILE_URL ? 1 : 0.45 }]} onPress={() => SPOTIFY_PROFILE_URL && Linking.openURL(SPOTIFY_PROFILE_URL)} disabled={!SPOTIFY_PROFILE_URL}>
            <SpotifyIcon color={c.textMuted} size={16} />
            <Text style={{ color: c.text, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Spotify</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SendIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 3L10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function InstagramIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="6" stroke={color} strokeWidth={1.5} />
    <Circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth={1.5} />
    <Circle cx="17.5" cy="6.5" r="1.2" fill={color} />
  </Svg>;
}
function SpotifyIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
    <Path d="M7.5 16c2.8-1.1 5.5-1.3 9 0" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M6.5 12.5c3.2-1.3 7-1.5 11 0" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M7.5 9c3-1.4 6.5-1.6 9.5-.2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  hero: { width: 190, height: 240, borderRadius: 18, overflow: 'hidden' },
  card: { borderRadius: 18, padding: 16 },
  sectionH: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, marginTop: 26, marginBottom: 10 },
  bookBtn: { borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  bookBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13, letterSpacing: 1 },
  msgInput: { flex: 1, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13.5, fontFamily: 'Inter_400Regular', maxHeight: 90 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rows: { borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 999, borderWidth: 1 },
});
