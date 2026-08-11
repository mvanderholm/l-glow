import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';

// Inbox — Matt's ask, Aug 11 2026: somewhere to look through every client's
// messages without opening clients one at a time. Distinct from the
// Dashboard's "Recent activity" feed (which mixes messages with intake and
// assessment events across a 15-row cap) — this is messages only, every
// consented thread that has at least one message, sorted by its most recent
// one. Tapping a row deep-links into that client's own Messages tab via the
// same ?clientId=&tab=messages pattern the Dashboard already uses.
//
// `messages.user_id`/`sender_id` reference auth.users, not public.users, so
// there's no FK for PostgREST to embed a join through — fetched in two
// steps instead: every message, then the users row for whichever ids came
// back. RLS on `messages` already limits what a practitioner can see to
// consented clients' threads, so no extra consent filter is needed here.

function clientLabel(client) {
  return client?.display_name || client?.email || 'A client';
}

function formatTimestamp(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function Inbox() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const [practitionerId, setPractitionerId] = useState(null);
  const [threads, setThreads] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setPractitionerId(session?.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!practitionerId) return;
    load();
  }, [practitionerId]);

  async function load() {
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('id, user_id, sender_id, body, created_at')
      .order('created_at', { ascending: false });
    if (msgError) { setError(msgError.message); return; }

    // Messages already arrive newest-first, so the first row seen per
    // user_id (the thread key) is that thread's most recent message.
    const latestByClient = new Map();
    for (const m of messages ?? []) {
      if (!latestByClient.has(m.user_id)) latestByClient.set(m.user_id, m);
    }
    const clientIds = [...latestByClient.keys()];
    if (!clientIds.length) { setThreads([]); return; }

    const { data: clients } = await supabase.from('users').select('id, display_name, email').in('id', clientIds);
    const clientsById = Object.fromEntries((clients ?? []).map(cl => [cl.id, cl]));

    const rows = clientIds
      .map(id => {
        const lastMessage = latestByClient.get(id);
        return { clientId: id, client: clientsById[id], lastMessage, fromClient: lastMessage.sender_id === id };
      })
      .filter(row => row.client) // consent revoked since the message was sent — nothing to open
      .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));

    setThreads(rows);
  }

  function openThread(clientId) {
    router.push({ pathname: '/practitioner', params: { clientId, tab: 'messages' } });
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load the inbox — {error}</Text></View>;
  }
  if (!threads) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <Text style={[s.title, { color: c.text, marginBottom: 4 }]}>Inbox</Text>
      <Text style={[s.subtitle, { color: c.textMuted, marginBottom: 20 }]}>
        Every client thread, most recent message first.
      </Text>

      {threads.length === 0 ? (
        <Text style={[s.mutedNote, { color: c.textMuted }]}>No messages yet.</Text>
      ) : (
        threads.map(({ clientId, client, lastMessage, fromClient }) => (
          <Pressable key={clientId} style={[s.row, { backgroundColor: c.surface, ...card }]} onPress={() => openThread(clientId)}>
            <View style={{ flex: 1 }}>
              <View style={s.rowTop}>
                <Text style={[s.name, { color: c.text }]} numberOfLines={1}>{clientLabel(client)}</Text>
                <Text style={[s.timestamp, { color: c.textMuted }]}>{formatTimestamp(lastMessage.created_at)}</Text>
              </View>
              <Text style={[s.preview, { color: c.textMuted }]} numberOfLines={1}>
                {fromClient ? '' : 'You: '}{lastMessage.body}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  title: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  mutedNote: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  row: { borderRadius: 14, padding: 14, marginBottom: 8 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 3 },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 14.5, flexShrink: 1 },
  timestamp: { fontFamily: 'Inter_400Regular', fontSize: 11.5, flexShrink: 0 },
  preview: { fontFamily: 'Inter_400Regular', fontSize: 13 },
});
