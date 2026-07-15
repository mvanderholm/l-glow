import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { supabase } from '../config/supabase';
import { SECTIONS, sectionProgress } from './intake';
import BackButton from '../components/BackButton';

// Practitioner dashboard — v2, still built ahead of the real conversation
// with Thea about what she wants to see (see roadmap #30 Phase 2). v1 was
// intake-form-only; this pass shows everything the app has on a consented
// client (assessment results, check-in history, journal) plus a private
// follow-up notes log Thea writes herself. Deliberately does NOT generate
// suggested follow-up actions or clinical guidance — that's fabricating
// exactly the kind of content CLAUDE.md's authorship rules forbid. The
// "needs attention" flagging below is limited to objective, computed facts
// (staleness, a numeric trend, incompleteness) — descriptive, not
// diagnostic. Access is enforced by RLS, not by this screen.

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

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

// Objective, computed signals only — no invented clinical judgment.
// checkins must already be sorted newest-first.
function computeAttention(checkins = [], intakeData) {
  const reasons = [];

  if (checkins.length === 0) {
    reasons.push('No check-ins yet');
  } else {
    const daysSince = Math.floor((Date.now() - new Date(checkins[0].date + 'T00:00:00').getTime()) / 86400000);
    if (daysSince >= 10) reasons.push(`No check-in in ${daysSince} days`);
  }

  if (checkins.length >= 6) {
    const avgOf = list => list.reduce((sum, c) => sum + (c.physical + c.mental + c.emotional) / 3, 0) / list.length;
    const recent = avgOf(checkins.slice(0, 3));
    const prior = avgOf(checkins.slice(3, 6));
    if (recent <= prior - 0.5) reasons.push('Trending down recently');
  }

  if (!intakeData) {
    reasons.push('Intake form not started');
  } else {
    const totalFilled = SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intakeData)?.filled || 0), 0);
    const totalFields = SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intakeData)?.total || 0), 0);
    if (totalFields > 0 && totalFilled < totalFields) reasons.push('Intake form incomplete');
  }

  return reasons;
}

function ClientList({ colors: c, onSelect, selectedId }) {
  const [clients, setClients] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('users')
      .select('id, email, display_name, checkins(date, physical, mental, emotional), intake_forms(data)')
      .eq('consented_to_practitioner_view', true)
      .eq('role', 'user')
      .order('date', { foreignTable: 'checkins', ascending: false })
      .then(({ data, error }) => {
        if (error) { setError(error.message); return; }
        const withAttention = (data ?? []).map(client => {
          const intakeRow = Array.isArray(client.intake_forms) ? client.intake_forms[0] : client.intake_forms;
          const reasons = computeAttention(client.checkins ?? [], intakeRow?.data);
          return { ...client, attentionReasons: reasons };
        });
        withAttention.sort((a, b) => b.attentionReasons.length - a.attentionReasons.length);
        setClients(withAttention);
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
          No clients have consented to sharing their data yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      {clients.map(client => (
        <Pressable
          key={client.id}
          style={({ pressed }) => [
            s.clientRow,
            { backgroundColor: c.surface, ...card, opacity: pressed ? 0.8 : 1 },
            client.id === selectedId && { borderWidth: 1.5, borderColor: c.accent },
          ]}
          onPress={() => onSelect(client)}
        >
          <Text style={[s.clientName, { color: c.text }]}>{client.display_name || client.email || 'Unnamed client'}</Text>
          {client.display_name && client.email && (
            <Text style={[s.clientEmail, { color: c.textMuted }]}>{client.email}</Text>
          )}
          {client.attentionReasons.length > 0 && (
            <View style={s.attentionRow}>
              {client.attentionReasons.map(reason => (
                <View key={reason} style={[s.attentionChip, { backgroundColor: c.terracotta ? c.terracotta + '22' : '#C9785522', borderColor: c.terracotta || '#C97855' }]}>
                  <Text style={[s.attentionChipText, { color: c.terracotta || '#C97855' }]}>{reason}</Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

function SectionCard({ title, children, colors: c }) {
  return (
    <View style={[s.sectionCard, { backgroundColor: c.surface, ...card }]}>
      <Text style={[s.sectionTitle, { color: c.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function AnswerRow({ label, value, colors: c }) {
  return (
    <View style={s.answerRow}>
      <Text style={[s.answerLabel, { color: c.textMuted }]}>{label}</Text>
      <Text style={[s.answerValue, { color: c.text }]}>{value}</Text>
    </View>
  );
}

function ClientDetail({ client, practitionerId, colors: c, onBack }) {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => { load(); }, [client.id]);

  async function load() {
    const [doshaRes, gunaRes, agniRes, tongueRes, checkinsRes, journalRes, intakeRes, notesRes] = await Promise.all([
      supabase.from('dosha_results').select('dosha, vata_score, pitta_score, kapha_score').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('guna_results').select('dominant, sattva_score, rajas_score, tamas_score').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('agni_results').select('agni_type').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('tongue_checks').select('reading').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('checkins').select('date, physical, mental, emotional, hunger, tongue, note').eq('user_id', client.id).order('date', { ascending: false }).limit(15),
      supabase.from('journal_entries').select('date, grateful, showed, tomorrow').eq('user_id', client.id).order('date', { ascending: false }).limit(10),
      supabase.from('intake_forms').select('data, updated_at').eq('user_id', client.id).maybeSingle(),
      supabase.from('practitioner_notes').select('id, note, created_at').eq('client_id', client.id).order('created_at', { ascending: false }),
    ]);

    const firstError = [doshaRes, gunaRes, agniRes, tongueRes, checkinsRes, journalRes, intakeRes, notesRes].find(r => r.error)?.error;
    if (firstError) { setError(firstError.message); return; }

    setClientData({
      dosha: doshaRes.data, guna: gunaRes.data, agni: agniRes.data, tongue: tongueRes.data,
      checkins: checkinsRes.data ?? [], journal: journalRes.data ?? [],
      intakeRow: intakeRes.data, notes: notesRes.data ?? [],
    });
  }

  async function addNote() {
    const text = noteDraft.trim();
    if (!text) return;
    setSavingNote(true);
    const { data: inserted, error } = await supabase.from('practitioner_notes')
      .insert({ client_id: client.id, practitioner_id: practitionerId, note: text })
      .select('id, note, created_at')
      .single();
    if (!error && inserted) {
      setClientData(prev => ({ ...prev, notes: [inserted, ...prev.notes] }));
      setNoteDraft('');
    }
    setSavingNote(false);
  }

  const attentionReasons = clientData ? computeAttention(clientData.checkins, clientData.intakeRow?.data) : [];

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <View style={[s.detailHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={onBack} color={c.text} />
        <View style={{ flex: 1 }}>
          <Text style={[s.detailTitle, { color: c.text }]}>{client.display_name || client.email}</Text>
          <Text style={[s.detailSub, { color: c.textMuted }]}>{client.email}</Text>
        </View>
      </View>

      {error && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load this client — {error}</Text>
        </View>
      )}

      {!clientData && !error && (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      )}

      {clientData && (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

          {attentionReasons.length > 0 && (
            <View style={s.attentionRow}>
              {attentionReasons.map(reason => (
                <View key={reason} style={[s.attentionChip, { backgroundColor: c.terracotta ? c.terracotta + '22' : '#C9785522', borderColor: c.terracotta || '#C97855' }]}>
                  <Text style={[s.attentionChipText, { color: c.terracotta || '#C97855' }]}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          <SectionCard title="Assessments" colors={c}>
            <AnswerRow label="Dosha" colors={c} value={clientData.dosha
              ? `${cap(clientData.dosha.dosha)} · V${clientData.dosha.vata_score} P${clientData.dosha.pitta_score} K${clientData.dosha.kapha_score}`
              : 'Not yet taken'} />
            <AnswerRow label="Guna" colors={c} value={clientData.guna
              ? `${cap(clientData.guna.dominant)} · S${clientData.guna.sattva_score} R${clientData.guna.rajas_score} T${clientData.guna.tamas_score}`
              : 'Not yet taken'} />
            <AnswerRow label="Agni" colors={c} value={clientData.agni ? cap(clientData.agni.agni_type) : 'Not yet taken'} />
            <AnswerRow label="Tongue check" colors={c} value={clientData.tongue ? cap(clientData.tongue.reading) : 'Not yet taken'} />
          </SectionCard>

          <SectionCard title={`Check-ins (${clientData.checkins.length})`} colors={c}>
            {clientData.checkins.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>No check-ins yet.</Text>}
            {clientData.checkins.map(ci => (
              <View key={ci.date} style={s.logRow}>
                <Text style={[s.logDate, { color: c.text }]}>
                  {new Date(ci.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={[s.logDetail, { color: c.textMuted }]}>
                  P{ci.physical} M{ci.mental} E{ci.emotional}{ci.hunger != null ? ` H${ci.hunger}` : ''}{ci.tongue != null ? ` T${ci.tongue}` : ''}
                </Text>
                {ci.note ? <Text style={[s.logNote, { color: c.textMedium }]}>"{ci.note}"</Text> : null}
              </View>
            ))}
          </SectionCard>

          <SectionCard title={`Journal (${clientData.journal.length})`} colors={c}>
            {clientData.journal.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>No journal entries yet.</Text>}
            {clientData.journal.map(j => (
              <View key={j.date} style={s.logRow}>
                <Text style={[s.logDate, { color: c.text }]}>
                  {new Date(j.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
                {j.grateful ? <Text style={[s.logDetail, { color: c.textMuted }]}>Grateful: {j.grateful}</Text> : null}
                {j.showed ? <Text style={[s.logDetail, { color: c.textMuted }]}>Showed up: {j.showed}</Text> : null}
                {j.tomorrow ? <Text style={[s.logDetail, { color: c.textMuted }]}>Tomorrow: {j.tomorrow}</Text> : null}
              </View>
            ))}
          </SectionCard>

          <Text style={[s.updatedText, { color: c.textMuted }]}>
            Intake form {clientData.intakeRow ? `— last updated ${new Date(clientData.intakeRow.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}` : ''}
          </Text>
          {!clientData.intakeRow && (
            <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 12 }]}>This client hasn't started their intake form yet.</Text>
          )}
          {clientData.intakeRow && SECTIONS.map(section => {
            const dataFields = section.fields.filter(f => f.key);
            if (dataFields.length === 0) return null;
            return (
              <SectionCard key={section.id} title={section.title} colors={c}>
                {dataFields.map(field => (
                  <AnswerRow key={field.key} label={field.label} colors={c} value={fieldDisplayValue(clientData.intakeRow.data[field.key])} />
                ))}
              </SectionCard>
            );
          })}

          <SectionCard title="Follow-up notes" colors={c}>
            <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 10 }]}>
              Private — only you can see these. Not shared with the client.
            </Text>
            <TextInput
              style={[s.noteInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Add a follow-up note…"
              placeholderTextColor={c.textMuted}
              multiline
            />
            <Pressable
              style={[s.addNoteBtn, { backgroundColor: noteDraft.trim() ? c.accent : c.border }]}
              onPress={addNote}
              disabled={!noteDraft.trim() || savingNote}
            >
              <Text style={s.addNoteBtnText}>{savingNote ? 'Saving…' : 'Add note'}</Text>
            </Pressable>
            {clientData.notes.map(note => (
              <View key={note.id} style={[s.noteRow, { borderTopColor: c.border }]}>
                <Text style={[s.noteDate, { color: c.textMuted }]}>
                  {new Date(note.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </Text>
                <Text style={[s.noteText, { color: c.text }]}>{note.note}</Text>
              </View>
            ))}
          </SectionCard>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Two-pane list+detail layout kicks in above this width — roughly "wide
// enough that a fixed-width client list plus a readable detail pane both
// fit," matching the room the app's Web View mode actually gives this
// screen (viewport minus WebLayout's 240px sidebar).
const WIDE_BREAKPOINT = 800;

export default function Practitioner() {
  const { theme: { colors: c } } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const [authorized, setAuthorized] = useState(undefined); // undefined = checking, null = no, true = yes
  const [practitionerId, setPractitionerId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setAuthorized(null); return; }
      const { data, error } = await supabase.from('users').select('role').eq('id', session.user.id).single();
      if (error) console.error('Practitioner role check failed:', error.message, error);
      setAuthorized(data?.role === 'practitioner');
      setPractitionerId(session.user.id);
    });
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {(isWide || !selectedClient) && (
        <View style={[s.header, { borderBottomColor: c.border }]}>
          <BackButton onPress={() => router.back()} color={c.text} />
          <Text style={[s.headerTitle, { color: c.text }]}>Practitioner View</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      {authorized === undefined && (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      )}

      {(authorized === null || authorized === false) && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>This view is for practitioners only.</Text>
        </View>
      )}

      {authorized === true && (
        isWide ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={[s.listPane, { borderRightColor: c.border }]}>
              <ClientList colors={c} onSelect={setSelectedClient} selectedId={selectedClient?.id} />
            </View>
            <View style={{ flex: 1 }}>
              {selectedClient
                ? <ClientDetail client={selectedClient} practitionerId={practitionerId} colors={c} onBack={() => setSelectedClient(null)} />
                : <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Select a client to view their details.</Text></View>}
            </View>
          </View>
        ) : (
          selectedClient
            ? <ClientDetail client={selectedClient} practitionerId={practitionerId} colors={c} onBack={() => setSelectedClient(null)} />
            : <ClientList colors={c} onSelect={setSelectedClient} />
        )
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  listPane:    { width: 340, borderRightWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },

  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },

  clientRow:   { borderRadius: 16, padding: 16, marginBottom: 10 },
  clientName:  { fontFamily: 'Inter_600SemiBold', fontSize: 15.5 },
  clientEmail: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 2 },

  attentionRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  attentionChip:     { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  attentionChipText: { fontFamily: 'Inter_500Medium', fontSize: 11.5 },

  detailHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  detailTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18 },
  detailSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },

  updatedText: { fontFamily: 'Inter_400Regular', fontSize: 12, fontStyle: 'italic', marginBottom: 16, marginTop: 4 },
  mutedNote:   { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  sectionCard: { borderRadius: 18, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, letterSpacing: 0.3, marginBottom: 10 },
  answerRow:   { marginBottom: 10 },
  answerLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 },
  answerValue: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 },

  logRow:    { marginBottom: 12 },
  logDate:   { fontFamily: 'Inter_600SemiBold', fontSize: 12.5, marginBottom: 2 },
  logDetail: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  logNote:   { fontFamily: 'Inter_400Regular', fontSize: 13, fontStyle: 'italic', marginTop: 2, lineHeight: 18 },

  noteInput:   { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 70, textAlignVertical: 'top', marginBottom: 10 },
  addNoteBtn:  { borderRadius: 999, paddingVertical: 10, alignItems: 'center', marginBottom: 16 },
  addNoteBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  noteRow:  { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, marginTop: 10 },
  noteDate: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  noteText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
});
