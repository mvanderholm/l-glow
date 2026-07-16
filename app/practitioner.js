import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput, useWindowDimensions, Alert } from 'react-native';
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
  const [search, setSearch] = useState('');
  const [attentionOnly, setAttentionOnly] = useState(false);

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

  const q = search.trim().toLowerCase();
  const filtered = clients.filter(client => {
    if (attentionOnly && client.attentionReasons.length === 0) return false;
    if (!q) return true;
    return (client.display_name || '').toLowerCase().includes(q) || (client.email || '').toLowerCase().includes(q);
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      <TextInput
        style={[s.searchInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={search}
        onChangeText={setSearch}
        placeholder="Search clients…"
        placeholderTextColor={c.textMuted}
      />
      <Pressable
        style={[s.attentionToggle, { borderColor: attentionOnly ? c.accent : c.border, backgroundColor: attentionOnly ? (c.accent + '18') : 'transparent' }]}
        onPress={() => setAttentionOnly(v => !v)}
      >
        <Text style={[s.attentionToggleText, { color: attentionOnly ? c.accent : c.textMuted }]}>Needs attention only</Text>
      </Pressable>

      {filtered.length === 0 && (
        <Text style={[s.mutedNote, { color: c.textMuted, textAlign: 'center', marginTop: 24 }]}>No clients match.</Text>
      )}

      {filtered.map(client => (
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

const CLIENT_TABS = [
  { key: 'summary',     label: 'Summary' },
  { key: 'assessments', label: 'Assessments' },
  { key: 'checkins',    label: 'Check-ins' },
  { key: 'journal',     label: 'Journal' },
  { key: 'intake',      label: 'Intake' },
  { key: 'notes',       label: 'Notes' },
];

function StatCard({ label, value, colors: c }) {
  return (
    <View style={[s.statCard, { backgroundColor: c.surface, ...card }]}>
      <Text style={[s.statValue, { color: c.text }]}>{value}</Text>
      <Text style={[s.statLabel, { color: c.textMuted }]}>{label}</Text>
    </View>
  );
}

function ClientDetail({ client, practitionerId, colors: c, onBack }) {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => { setActiveTab('summary'); load(); }, [client.id]);

  async function load() {
    const [doshaRes, gunaRes, agniRes, tongueRes, checkinsRes, journalRes, intakeRes, notesRes] = await Promise.all([
      supabase.from('dosha_results').select('dosha, vata_score, pitta_score, kapha_score, taken_at').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('guna_results').select('dominant, sattva_score, rajas_score, tamas_score, taken_at').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('agni_results').select('agni_type, taken_at').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('tongue_checks').select('reading, taken_at').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('checkins').select('date, physical, mental, emotional, hunger, tongue, note').eq('user_id', client.id).order('date', { ascending: false }).limit(15),
      supabase.from('journal_entries').select('date, grateful, showed, tomorrow').eq('user_id', client.id).order('date', { ascending: false }).limit(10),
      supabase.from('intake_forms').select('data, updated_at').eq('user_id', client.id).maybeSingle(),
      supabase.from('practitioner_notes').select('id, note, created_at').eq('client_id', client.id).order('created_at', { ascending: false }),
    ]);

    const firstError = [doshaRes, gunaRes, agniRes, tongueRes, checkinsRes, journalRes, intakeRes, notesRes].find(r => r.error)?.error;
    if (firstError) { setError(firstError.message); return; }

    setClientData({
      doshaResults: doshaRes.data ?? [], gunaResults: gunaRes.data ?? [], agniResults: agniRes.data ?? [], tongueResults: tongueRes.data ?? [],
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

  function startEditNote(note) {
    setEditingNoteId(note.id);
    setEditDraft(note.note);
  }

  async function saveEditNote(id) {
    const text = editDraft.trim();
    if (!text) return;
    const { error } = await supabase.from('practitioner_notes').update({ note: text }).eq('id', id);
    if (!error) {
      setClientData(prev => ({ ...prev, notes: prev.notes.map(n => n.id === id ? { ...n, note: text } : n) }));
      setEditingNoteId(null);
    }
  }

  function deleteNote(id) {
    Alert.alert('Delete this note?', 'This can\'t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('practitioner_notes').delete().eq('id', id);
          if (!error) setClientData(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
        },
      },
    ]);
  }

  const attentionReasons = clientData ? computeAttention(clientData.checkins, clientData.intakeRow?.data) : [];

  const daysSinceLastCheckin = clientData?.checkins[0]
    ? Math.floor((Date.now() - new Date(clientData.checkins[0].date + 'T00:00:00').getTime()) / 86400000)
    : null;
  const intakeFilled = clientData?.intakeRow ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, clientData.intakeRow.data)?.filled || 0), 0) : 0;
  const intakeTotal  = clientData?.intakeRow ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, clientData.intakeRow.data)?.total  || 0), 0) : 0;
  const intakePct = intakeTotal ? Math.round((intakeFilled / intakeTotal) * 100) : 0;

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
        <>
          {attentionReasons.length > 0 && (
            <View style={[s.attentionRow, { paddingHorizontal: 16, paddingTop: 12 }]}>
              {attentionReasons.map(reason => (
                <View key={reason} style={[s.attentionChip, { backgroundColor: c.terracotta ? c.terracotta + '22' : '#C9785522', borderColor: c.terracotta || '#C97855' }]}>
                  <Text style={[s.attentionChipText, { color: c.terracotta || '#C97855' }]}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[s.tabBar, { borderBottomColor: c.border }]}>
            {CLIENT_TABS.map(tab => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[s.tabBtn, activeTab === tab.key && { borderBottomColor: c.accent, borderBottomWidth: 2 }]}
              >
                <Text style={[s.tabBtnText, { color: activeTab === tab.key ? c.text : c.textMuted }]}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

            {activeTab === 'summary' && (
              <>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                  <StatCard colors={c} label="Last check-in" value={daysSinceLastCheckin != null ? `${daysSinceLastCheckin}d ago` : '—'} />
                  <StatCard colors={c} label="Check-ins" value={clientData.checkins.length} />
                  <StatCard colors={c} label="Intake" value={`${intakePct}%`} />
                </View>

                <Pressable onPress={() => setActiveTab('assessments')}>
                  <SectionCard title="Current snapshot" colors={c}>
                    <AnswerRow label="Dosha" colors={c} value={clientData.doshaResults[0]
                      ? `${cap(clientData.doshaResults[0].dosha)} · V${clientData.doshaResults[0].vata_score} P${clientData.doshaResults[0].pitta_score} K${clientData.doshaResults[0].kapha_score}`
                      : 'Not yet taken'} />
                    <AnswerRow label="Guna" colors={c} value={clientData.gunaResults[0]
                      ? `${cap(clientData.gunaResults[0].dominant)} · S${clientData.gunaResults[0].sattva_score} R${clientData.gunaResults[0].rajas_score} T${clientData.gunaResults[0].tamas_score}`
                      : 'Not yet taken'} />
                    <AnswerRow label="Agni" colors={c} value={clientData.agniResults[0] ? cap(clientData.agniResults[0].agni_type) : 'Not yet taken'} />
                    <AnswerRow label="Tongue check" colors={c} value={clientData.tongueResults[0] ? cap(clientData.tongueResults[0].reading) : 'Not yet taken'} />
                    <Text style={[s.mutedNote, { color: c.accent, marginTop: 4 }]}>See full history →</Text>
                  </SectionCard>
                </Pressable>

                {clientData.notes.length > 0 && (
                  <Pressable onPress={() => setActiveTab('notes')}>
                    <SectionCard title="Latest follow-up note" colors={c}>
                      <Text style={[s.noteDate, { color: c.textMuted }]}>
                        {new Date(clientData.notes[0].created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </Text>
                      <Text style={[s.noteText, { color: c.text }]} numberOfLines={3}>{clientData.notes[0].note}</Text>
                      <Text style={[s.mutedNote, { color: c.accent, marginTop: 8 }]}>See all notes →</Text>
                    </SectionCard>
                  </Pressable>
                )}
              </>
            )}

            {activeTab === 'assessments' && (
              <>
                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10 }]}>Dosha history</Text>
                {clientData.doshaResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.doshaResults.map((r, i) => (
                  <View key={r.taken_at} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>{new Date(r.taken_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</Text>
                    <Text style={[s.logDetail, { color: c.textMuted }]}>{cap(r.dosha)} · V{r.vata_score} P{r.pitta_score} K{r.kapha_score}</Text>
                  </View>
                ))}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Guna history</Text>
                {clientData.gunaResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.gunaResults.map(r => (
                  <View key={r.taken_at} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>{new Date(r.taken_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</Text>
                    <Text style={[s.logDetail, { color: c.textMuted }]}>{cap(r.dominant)} · S{r.sattva_score} R{r.rajas_score} T{r.tamas_score}</Text>
                  </View>
                ))}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Agni history</Text>
                {clientData.agniResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.agniResults.map(r => (
                  <View key={r.taken_at} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>{new Date(r.taken_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</Text>
                    <Text style={[s.logDetail, { color: c.textMuted }]}>{cap(r.agni_type)}</Text>
                  </View>
                ))}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Tongue check history</Text>
                {clientData.tongueResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>Not yet taken.</Text>}
                {clientData.tongueResults.map(r => (
                  <View key={r.taken_at} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>{new Date(r.taken_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</Text>
                    <Text style={[s.logDetail, { color: c.textMuted }]}>{cap(r.reading)}</Text>
                  </View>
                ))}
              </>
            )}

            {activeTab === 'checkins' && (
              <>
                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10 }]}>{`Check-ins (${clientData.checkins.length})`}</Text>
                {clientData.checkins.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>No check-ins yet.</Text>}
                {clientData.checkins.map(ci => (
                  <View key={ci.date} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>
                      {new Date(ci.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={[s.logDetail, { color: c.textMuted }]}>
                      P{ci.physical} M{ci.mental} E{ci.emotional}{ci.hunger != null ? ` H${ci.hunger}` : ''}{ci.tongue != null ? ` T${ci.tongue}` : ''}
                    </Text>
                    {ci.note ? <Text style={[s.logNote, { color: c.textMedium }]}>"{ci.note}"</Text> : null}
                  </View>
                ))}
              </>
            )}

            {activeTab === 'journal' && (
              <>
                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10 }]}>{`Journal (${clientData.journal.length})`}</Text>
                {clientData.journal.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>No journal entries yet.</Text>}
                {clientData.journal.map(j => (
                  <View key={j.date} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>
                      {new Date(j.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    {j.grateful ? <Text style={[s.logDetail, { color: c.textMuted }]}>Grateful: {j.grateful}</Text> : null}
                    {j.showed ? <Text style={[s.logDetail, { color: c.textMuted }]}>Showed up: {j.showed}</Text> : null}
                    {j.tomorrow ? <Text style={[s.logDetail, { color: c.textMuted }]}>Tomorrow: {j.tomorrow}</Text> : null}
                  </View>
                ))}
              </>
            )}

            {activeTab === 'intake' && (
              <>
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
              </>
            )}

            {activeTab === 'notes' && (
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={[s.noteDate, { color: c.textMuted, marginBottom: 0 }]}>
                        {new Date(note.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </Text>
                      {editingNoteId !== note.id && (
                        <View style={{ flexDirection: 'row', gap: 14 }}>
                          <Pressable onPress={() => startEditNote(note)}><Text style={[s.noteActionText, { color: c.accent }]}>Edit</Text></Pressable>
                          <Pressable onPress={() => deleteNote(note.id)}><Text style={[s.noteActionText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
                        </View>
                      )}
                    </View>
                    {editingNoteId === note.id ? (
                      <>
                        <TextInput
                          style={[s.noteInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border, marginTop: 6 }]}
                          value={editDraft}
                          onChangeText={setEditDraft}
                          multiline
                        />
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <Pressable style={[s.addNoteBtn, { flex: 1, backgroundColor: editDraft.trim() ? c.accent : c.border }]} onPress={() => saveEditNote(note.id)} disabled={!editDraft.trim()}>
                            <Text style={s.addNoteBtnText}>Save</Text>
                          </Pressable>
                          <Pressable style={[s.addNoteBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={() => setEditingNoteId(null)}>
                            <Text style={[s.addNoteBtnText, { color: c.textMuted }]}>Cancel</Text>
                          </Pressable>
                        </View>
                      </>
                    ) : (
                      <Text style={[s.noteText, { color: c.text }]}>{note.note}</Text>
                    )}
                  </View>
                ))}
              </SectionCard>
            )}

          </ScrollView>
        </>
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

  searchInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  attentionToggle: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 },
  attentionToggleText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  clientRow:   { borderRadius: 16, padding: 16, marginBottom: 10 },
  clientName:  { fontFamily: 'Inter_600SemiBold', fontSize: 15.5 },
  clientEmail: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 2 },

  attentionRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  attentionChip:     { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  attentionChipText: { fontFamily: 'Inter_500Medium', fontSize: 11.5 },

  detailHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  detailTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18 },
  detailSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },

  tabBar:     { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, paddingHorizontal: 8 },
  tabBtn:     { paddingVertical: 12, paddingHorizontal: 10, marginRight: 4 },
  tabBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  statCard:  { flex: 1, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20, lineHeight: 26 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center' },

  updatedText: { fontFamily: 'Inter_400Regular', fontSize: 12, fontStyle: 'italic', marginBottom: 16, marginTop: 4 },
  mutedNote:   { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  sectionCard: { borderRadius: 18, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, letterSpacing: 0.3, marginBottom: 10 },
  answerRow:   { marginBottom: 10 },
  answerLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 },
  answerValue: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 },

  entryCard: { borderRadius: 14, padding: 14, marginBottom: 8 },
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
  noteActionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});
