import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { loadMessages, sendMessageAsClient } from '../data/user/messages';
import { smartBack } from '../components/BackButton';
import Header from '../components/Header';

// Message Thea (roadmap #59) — one flat thread, no read receipts, no live
// updates (reloads on send and on focus, not a Realtime subscription — v1,
// same "start simple" call the roadmap sketch made). Promoted as a nav
// entry only on native (app/you.js) — Matt's call, Aug 7 2026: in-app
// messaging is app-only, not a web feature. The route itself still works
// on web if reached directly, same as /practitioner having no nav entry
// but a working route — nothing below is Platform-gated.

export default function Messages() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const scrollRef = useRef(null);

  const [consented, setConsented] = useState(null); // null = loading
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user === null) return; // not signed in — nothing to load
    if (!user) return;
    supabase.from('users').select('consented_to_practitioner_view').eq('id', user.id).single()
      .then(({ data }) => setConsented(!!data?.consented_to_practitioner_view));
  }, [user]);

  useEffect(() => {
    if (!user || !consented) return;
    load();
  }, [user, consented]);

  async function load() {
    try {
      const rows = await loadMessages(user.id);
      setMessages(rows);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 50);
    } catch (err) {
      setError(err.message);
    }
  }

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft('');
    try {
      await sendMessageAsClient(user.id, body);
      await load();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (user === undefined) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
        <Header title="Message Thea" left="back" onBack={() => smartBack('/you')} bordered />
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>You'll need to sign in first.</Text>
          <Pressable style={[s.primaryBtn, { backgroundColor: c.accent, marginTop: 16 }]} onPress={() => router.push('/login?returnTo=/messages')}>
            <Text style={s.primaryBtnText}>Go to sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (consented === null) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} />
      </SafeAreaView>
    );
  }

  if (!consented) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
        <Header title="Message Thea" left="back" onBack={() => smartBack('/you')} bordered />
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>
            Turn on "Share with Thea" in Your Assessments first — that's what lets her see and reply to your messages.
          </Text>
          <Pressable style={[s.primaryBtn, { backgroundColor: c.accent, marginTop: 16 }]} onPress={() => router.push('/you')}>
            <Text style={s.primaryBtnText}>Go to Your Assessments</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <Header title="Message Thea" left="back" onBack={() => smartBack('/you')} bordered />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
          {error && <Text style={{ color: c.terracotta, marginBottom: 12 }}>{error}</Text>}
          {messages === null ? (
            <ActivityIndicator color={c.accent} />
          ) : messages.length === 0 ? (
            <Text style={[s.emptyText, { color: c.textMuted }]}>No messages yet — say hi.</Text>
          ) : (
            messages.map(m => {
              const mine = m.sender_id === user.id;
              return (
                <View key={m.id} style={[s.bubbleRow, mine ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                  <View style={[s.bubble, { backgroundColor: mine ? c.accent : c.surface, borderColor: c.border, borderWidth: mine ? 0 : 1 }]}>
                    <Text style={{ color: mine ? '#FBF9F4' : c.text, fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 }}>{m.body}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={[s.composer, { borderTopColor: c.border, backgroundColor: c.bg }]}>
          <TextInput
            style={[s.input, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message…"
            placeholderTextColor={c.textMuted}
            multiline
          />
          <Pressable style={[s.sendBtn, { backgroundColor: c.accent, opacity: draft.trim() && !sending ? 1 : 0.5 }]} onPress={send} disabled={!draft.trim() || sending}>
            <Text style={s.sendBtnText}>{sending ? '…' : 'Send'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  primaryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 999, alignItems: 'center' },
  primaryBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14 },

  bubbleRow: { flexDirection: 'row', marginBottom: 10 },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },

  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14.5, fontFamily: 'Inter_400Regular', maxHeight: 100 },
  sendBtn: { borderRadius: 18, paddingHorizontal: 18, paddingVertical: 11 },
  sendBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});
