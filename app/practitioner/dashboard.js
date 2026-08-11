import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { computeAttention } from './index';
import { SECTIONS, sectionProgress } from '../intake';

// Dashboard — Matt's ask, Aug 10 2026: "she doesn't want to have to go into
// each user every time to see what their activity is, she needs a way to
// understand what the most pertinent work is." Two sections, both answering
// a different half of that: Needs Attention (who's gone quiet — reuses the
// same computeAttention logic the Clients screen already used to sort/flag
// rows) and Recent Activity (who just did something — a merged, chronological
// feed across every assessment type, the intake form, and messages). This
// screen doesn't decide what's "most pertinent" for her — it surfaces both
// signals and lets her judge, same spirit as everywhere else in this app
// that avoids scoring/ranking a person's state as good or bad.
//
// Tapping a row deep-links to /practitioner?clientId=... — see ClientList's
// own effect in index.js for how that gets consumed.

const TIER_LABELS = { foundation: 'Foundation', level1: 'Level 1', level2: 'Level 2', level3: 'Level 3' };

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function clientLabel(client) {
  return client?.display_name || client?.email || 'A client';
}

// Same completeness check as app/intake.js's own isFullyComplete — not
// exported there, small enough to duplicate rather than force an export for
// one caller. intake_forms has no reliable "completed at" timestamp of its
// own (notified_at exists in the schema per its migration, but the live
// query rejected it — schema cache or migration-not-run, not worth
// depending on), so this uses updated_at gated by actual completeness
// instead, computed from the same data the Intake tab already renders.
function isIntakeComplete(data) {
  const totalFilled = SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, data)?.filled || 0), 0);
  const totalFields = SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, data)?.total || 0), 0);
  return totalFields > 0 && totalFilled === totalFields;
}

function buildEvents(clients) {
  const events = [];
  for (const client of clients) {
    const label = clientLabel(client);
    const push = (type, text, ts) => { if (ts) events.push({ id: `${type}-${client.id}`, type, text, ts, client }); };
    const intake = Array.isArray(client.intake_forms) ? client.intake_forms[0] : client.intake_forms;
    if (intake?.data && isIntakeComplete(intake.data)) push('intake', `${label} completed their intake form`, intake.updated_at);
    push('dosha', `${label} took the Dosha Quiz`, client.dosha_results?.[0]?.taken_at);
    push('guna', `${label} took the Guna Assessment`, client.guna_results?.[0]?.taken_at);
    push('agni', `${label} took the Agni Assessment`, client.agni_results?.[0]?.taken_at);
    push('tongue', `${label} did a Tongue Check`, client.tongue_checks?.[0]?.taken_at);
    const prakriti = client.prakriti_responses?.[0];
    if (prakriti) push('prakriti', `${label} completed Prakriti — ${TIER_LABELS[prakriti.tier] ?? prakriti.tier}`, prakriti.completed_at);
    const vikriti = client.vikriti_responses?.[0];
    if (vikriti) push('vikriti', `${label} completed Vikriti — ${TIER_LABELS[vikriti.tier] ?? vikriti.tier}`, vikriti.completed_at);
  }
  return events;
}

export default function Dashboard() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const [practitionerId, setPractitionerId] = useState(null);
  const [clients, setClients] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setPractitionerId(session?.user?.id ?? null));
  }, []);

  useEffect(() => {
    supabase
      .from('users')
      .select(`
        id, email, display_name,
        checkins(date, physical, mental, emotional),
        intake_forms(data, updated_at),
        dosha_results(taken_at),
        guna_results(taken_at),
        agni_results(taken_at),
        tongue_checks(taken_at),
        prakriti_responses(tier, completed_at),
        vikriti_responses(tier, completed_at)
      `)
      .eq('consented_to_practitioner_view', true)
      .eq('role', 'user')
      .order('date', { foreignTable: 'checkins', ascending: false })
      .order('taken_at', { foreignTable: 'dosha_results', ascending: false })
      .order('taken_at', { foreignTable: 'guna_results', ascending: false })
      .order('taken_at', { foreignTable: 'agni_results', ascending: false })
      .order('taken_at', { foreignTable: 'tongue_checks', ascending: false })
      .order('completed_at', { foreignTable: 'prakriti_responses', ascending: false })
      .order('completed_at', { foreignTable: 'vikriti_responses', ascending: false })
      .limit(1, { foreignTable: 'dosha_results' })
      .limit(1, { foreignTable: 'guna_results' })
      .limit(1, { foreignTable: 'agni_results' })
      .limit(1, { foreignTable: 'tongue_checks' })
      .limit(1, { foreignTable: 'prakriti_responses' })
      .limit(1, { foreignTable: 'vikriti_responses' })
      .then(({ data, error }) => {
        if (error) { setError(error.message); return; }
        setClients(data ?? []);
      });
  }, []);

  useEffect(() => {
    if (!practitionerId) return;
    supabase
      .from('messages')
      .select('id, user_id, sender_id, body, created_at')
      .neq('sender_id', practitionerId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error) { setMessages([]); return; }
        setMessages(data ?? []);
      });
  }, [practitionerId]);

  function openClient(client, tab) {
    router.push({ pathname: '/practitioner', params: tab ? { clientId: client.id, tab } : { clientId: client.id } });
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load the dashboard — {error}</Text></View>;
  }
  if (!clients || messages === null) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  const needsAttention = clients
    .map(client => ({ client, reasons: computeAttention(client.checkins ?? [], (Array.isArray(client.intake_forms) ? client.intake_forms[0] : client.intake_forms)?.data) }))
    .filter(row => row.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length);

  const clientsById = Object.fromEntries(clients.map(cl => [cl.id, cl]));
  const messageEvents = messages
    .filter(msg => clientsById[msg.user_id])
    .map(msg => ({
      id: `message-${msg.id}`,
      type: 'message',
      text: `${clientLabel(clientsById[msg.user_id])} sent a message`,
      preview: msg.body,
      ts: msg.created_at,
      client: clientsById[msg.user_id],
    }));

  const activity = [...buildEvents(clients), ...messageEvents]
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 15);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <Text style={[s.title, { color: c.text, marginBottom: 16 }]}>Dashboard</Text>

      <Text style={[s.sectionLabel, { color: c.textMuted }]}>Needs attention ({needsAttention.length})</Text>
      {needsAttention.length === 0 ? (
        <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 20 }]}>Nobody's flagged right now.</Text>
      ) : (
        <View style={{ marginBottom: 20 }}>
          {needsAttention.map(({ client, reasons }) => (
            <Pressable key={client.id} style={[s.itemCard, { backgroundColor: c.surface, ...card }]} onPress={() => openClient(client)}>
              <Text style={[s.itemTitle, { color: c.text }]}>{clientLabel(client)}</Text>
              <View style={s.chipRow}>
                {reasons.map(reason => (
                  <View key={reason} style={[s.chip, { backgroundColor: c.terracotta ? c.terracotta + '22' : '#C9785522', borderColor: c.terracotta || '#C97855' }]}>
                    <Text style={[s.chipText, { color: c.terracotta || '#C97855' }]}>{reason}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={[s.sectionLabel, { color: c.textMuted }]}>Recent activity</Text>
      {activity.length === 0 ? (
        <Text style={[s.mutedNote, { color: c.textMuted }]}>Nothing yet.</Text>
      ) : (
        activity.map(event => (
          <Pressable key={event.id} style={[s.itemCard, { backgroundColor: c.surface, ...card }]} onPress={() => openClient(event.client, event.type === 'message' ? 'messages' : undefined)}>
            <Text style={[s.itemTitle, { color: c.text }]} numberOfLines={1}>
              {event.text}
              <Text style={{ color: c.textMuted, fontWeight: '400' }}>  ·  {relativeTime(event.ts)}</Text>
            </Text>
            {event.preview && <Text style={[s.mutedNote, { color: c.textMuted, marginTop: 2 }]} numberOfLines={1}>{event.preview}</Text>}
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
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 10 },
  mutedNote: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  itemCard: { borderRadius: 14, padding: 14, marginBottom: 8 },
  itemTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
});
