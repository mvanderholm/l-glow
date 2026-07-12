import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { supabase } from '../config/supabase';
import { SECTIONS } from './intake';
import BackButton from '../components/BackButton';

// Practitioner dashboard — v1, rough pass. Built to react to, not a final
// design; the real conversation with Thea about what she wants to see hasn't
// happened yet (see roadmap #30 Phase 2). Deliberately narrow scope: client
// list + read-only intake form view only. No consent UI, no role-assignment
// UI — both are manual SQL for now (see supabase/migrations/20260712*.sql).
// Access is enforced by RLS, not by this screen — a non-practitioner or a
// client who hasn't consented simply gets empty query results here, same as
// if this screen didn't exist.

function fieldDisplayValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    if (value.length === 1 && value[0] === 'skip') return 'Skipped';
    return value.filter(v => v !== 'skip').join(', ') || '—';
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === 'skip') return 'Skipped';
  if (!value) return '—';
  return String(value);
}

function ClientList({ colors: c, onSelect }) {
  const [clients, setClients] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('users')
      .select('id, email, display_name')
      .eq('consented_to_practitioner_view', true)
      .eq('role', 'user')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setClients(data ?? []);
      });
  }, []);

  if (error) {
    return (
      <View style={s.centerPad}>
        <Text style={[s.emptyText, { color: c.textMuted }]}>
          Couldn't load clients — {error}
        </Text>
      </View>
    );
  }

  if (!clients) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  if (clients.length === 0) {
    return (
      <View style={s.centerPad}>
        <Text style={[s.emptyText, { color: c.textMuted }]}>
          No clients have consented to sharing their intake form yet.{'\n\n'}
          (This is v1 — consent is a manual flag in Supabase for now, not something a user can grant themselves yet.)
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      {clients.map(client => (
        <Pressable
          key={client.id}
          style={({ pressed }) => [s.clientRow, { backgroundColor: c.surface, ...card, opacity: pressed ? 0.8 : 1 }]}
          onPress={() => onSelect(client)}
        >
          <Text style={[s.clientName, { color: c.text }]}>{client.display_name || client.email || 'Unnamed client'}</Text>
          {client.display_name && client.email && (
            <Text style={[s.clientEmail, { color: c.textMuted }]}>{client.email}</Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

function IntakeDetail({ client, colors: c, onBack }) {
  const [intake, setIntake] = useState(undefined); // undefined = loading, null = none found
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('intake_forms')
      .select('data, updated_at')
      .eq('user_id', client.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setIntake(data);
      });
  }, [client.id]);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <View style={[s.detailHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={onBack} color={c.text} />
        <View style={{ flex: 1 }}>
          <Text style={[s.detailTitle, { color: c.text }]}>{client.display_name || client.email}</Text>
          <Text style={[s.detailSub, { color: c.textMuted }]}>Intake form</Text>
        </View>
      </View>

      {error && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load this form — {error}</Text>
        </View>
      )}

      {intake === undefined && !error && (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      )}

      {intake === null && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>This client hasn't started their intake form yet.</Text>
        </View>
      )}

      {intake && (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          <Text style={[s.updatedText, { color: c.textMuted }]}>
            Last updated {new Date(intake.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </Text>
          {SECTIONS.map(section => {
            const dataFields = section.fields.filter(f => f.key);
            if (dataFields.length === 0) return null;
            return (
              <View key={section.id} style={[s.sectionCard, { backgroundColor: c.surface, ...card }]}>
                <Text style={[s.sectionTitle, { color: c.text }]}>{section.title}</Text>
                {dataFields.map(field => (
                  <View key={field.key} style={s.answerRow}>
                    <Text style={[s.answerLabel, { color: c.textMuted }]}>{field.label}</Text>
                    <Text style={[s.answerValue, { color: c.text }]}>{fieldDisplayValue(intake.data[field.key])}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default function Practitioner() {
  const { theme: { colors: c } } = useTheme();
  const [authorized, setAuthorized] = useState(undefined); // undefined = checking, null = no, true = yes
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setAuthorized(null); return; }
      const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single();
      setAuthorized(data?.role === 'practitioner');
    });
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {!selectedClient && (
        <View style={[s.header, { borderBottomColor: c.border }]}>
          <BackButton onPress={() => router.back()} color={c.text} />
          <Text style={[s.headerTitle, { color: c.text }]}>Practitioner View</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      {authorized === undefined && (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      )}

      {authorized === null && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>This view is for practitioners only.</Text>
        </View>
      )}

      {authorized === false && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>This view is for practitioners only.</Text>
        </View>
      )}

      {authorized === true && (
        selectedClient
          ? <IntakeDetail client={selectedClient} colors={c} onBack={() => setSelectedClient(null)} />
          : <ClientList colors={c} onSelect={setSelectedClient} />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },

  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },

  clientRow:   { borderRadius: 16, padding: 16, marginBottom: 10 },
  clientName:  { fontFamily: 'Inter_600SemiBold', fontSize: 15.5 },
  clientEmail: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 2 },

  detailHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  detailTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18 },
  detailSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },

  updatedText: { fontFamily: 'Inter_400Regular', fontSize: 12, fontStyle: 'italic', marginBottom: 16 },
  sectionCard: { borderRadius: 18, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, letterSpacing: 0.3, marginBottom: 10 },
  answerRow:   { marginBottom: 10 },
  answerLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 },
  answerValue: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 },
});
