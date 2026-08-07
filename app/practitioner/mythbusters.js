import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshMythbusters } from '../../data/content/remote';
import { notify, confirmAsync } from '../../components/practitioner/webSafeAlert';

// First admin-editable content type — see data/content/remote.js for the
// caching pattern every future content type (affirmations, check-in
// question wording, guna quiz questions, ...) should follow. Structured
// fields (dosha_breakdown, challenge) are shown read-only for now — no
// builder UI for nested JSON yet, edit those via SQL until a real need for
// an in-app editor shows up.

const EMPTY_DRAFT = { id: '', series: 'general', week_start: '', myth: '', take: '', reframe: '', app_prompt: '' };

function Field({ label, value, onChangeText, colors: c, multiline, placeholder }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[s.fieldLabel, { color: c.textMuted }]}>{label}</Text>
      <TextInput
        style={[s.fieldInput, multiline && s.fieldInputMultiline, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
        multiline={multiline}
      />
    </View>
  );
}

function EditorForm({ draft, setDraft, isNew, colors: c, onSave, onCancel, saving }) {
  return (
    <View style={[s.editorCard, { backgroundColor: c.surface, ...card }]}>
      <Field colors={c} label="ID (unique slug, e.g. cold-drinks-healthy)" value={draft.id} onChangeText={t => setDraft({ ...draft, id: t })} placeholder="unique-slug" />
      <Field colors={c} label="Series" value={draft.series} onChangeText={t => setDraft({ ...draft, series: t })} placeholder="agni / general / ..." />
      <Field colors={c} label="Week start (YYYY-MM-DD)" value={draft.week_start} onChangeText={t => setDraft({ ...draft, week_start: t })} placeholder="2026-08-17" />
      <Field colors={c} label="Myth" value={draft.myth} onChangeText={t => setDraft({ ...draft, myth: t })} multiline />
      <Field colors={c} label="Take" value={draft.take} onChangeText={t => setDraft({ ...draft, take: t })} multiline />
      <Field colors={c} label="Reframe" value={draft.reframe} onChangeText={t => setDraft({ ...draft, reframe: t })} multiline />
      <Field colors={c} label="App prompt (optional)" value={draft.app_prompt} onChangeText={t => setDraft({ ...draft, app_prompt: t })} multiline />

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        <Pressable style={[s.actionBtn, { flex: 1, backgroundColor: c.accent }]} onPress={onSave} disabled={saving}>
          <Text style={s.actionBtnText}>{saving ? 'Saving…' : isNew ? 'Create' : 'Save changes'}</Text>
        </Pressable>
        <Pressable style={[s.actionBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={onCancel}>
          <Text style={[s.actionBtnText, { color: c.textMuted }]}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function MythbustersAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // null = not editing, 'new' = creating, else an existing id
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('mythbusters').select('*').order('week_start', { ascending: true });
    if (error) { setError(error.message); return; }
    setItems(data ?? []);
  }

  function startCreate() {
    setDraft(EMPTY_DRAFT);
    setEditingId('new');
  }

  function startEdit(item) {
    setDraft({
      id: item.id, series: item.series, week_start: item.week_start,
      myth: item.myth, take: item.take || '', reframe: item.reframe || '', app_prompt: item.app_prompt || '',
    });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.id.trim() || !draft.myth.trim() || !draft.week_start.trim()) {
      notify('Missing fields', 'ID, week start, and myth are required.');
      return;
    }
    setSaving(true);
    const payload = {
      id: draft.id.trim(), series: draft.series.trim() || 'general', week_start: draft.week_start.trim(),
      myth: draft.myth.trim(), take: draft.take.trim() || null, reframe: draft.reframe.trim() || null,
      app_prompt: draft.app_prompt.trim() || null,
    };
    const { error } = await supabase.from('mythbusters').upsert(payload, { onConflict: 'id' });
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
    refreshMythbusters(); // fire-and-forget — keeps the app's local cache in sync
  }

  async function deleteItem(item) {
    const ok = await confirmAsync('Delete this myth?', `"${item.myth}" — this can't be undone.`);
    if (!ok) return;
    const { error } = await supabase.from('mythbusters').delete().eq('id', item.id);
    if (error) { notify('Couldn\'t delete', error.message); return; }
    await load();
    refreshMythbusters();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load mythbusters — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={[s.title, { color: c.text }]}>Mythbusters ({items.length})</Text>
        {editingId === null && (
          <Pressable style={[s.actionBtn, { backgroundColor: c.accent }]} onPress={startCreate}>
            <Text style={s.actionBtnText}>+ New</Text>
          </Pressable>
        )}
      </View>

      {editingId === 'new' && (
        <EditorForm draft={draft} setDraft={setDraft} isNew colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
      )}

      {items.map(item => (
        <View key={item.id}>
          {editingId === item.id ? (
            <EditorForm draft={draft} setDraft={setDraft} isNew={false} colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
          ) : (
            <View style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[s.itemMeta, { color: c.textMuted }]}>{item.week_start} · {item.series}</Text>
                  <Text style={[s.itemMyth, { color: c.text }]}>{item.myth}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => startEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
                  <Pressable onPress={() => deleteItem(item)}><Text style={[s.linkText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
                </View>
              </View>
              {item.take && <Text style={[s.itemBody, { color: c.textMedium }]}>{item.take}</Text>}
              {item.reframe && <Text style={[s.itemReframe, { color: c.text, backgroundColor: c.surfaceAlt }]}>{item.reframe}</Text>}
              {(item.dosha_breakdown || item.challenge) && (
                <Text style={[s.itemMeta, { color: c.textMuted, marginTop: 8 }]}>
                  Also has structured {item.dosha_breakdown ? 'dosha breakdown' : ''}{item.dosha_breakdown && item.challenge ? ' + ' : ''}{item.challenge ? 'challenge' : ''} data — edit via SQL for now.
                </Text>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  title: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },

  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  fieldInputMultiline: { minHeight: 70, textAlignVertical: 'top' },

  editorCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 18, padding: 16, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemMyth: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16, lineHeight: 22 },
  itemBody: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginTop: 8 },
  itemReframe: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginTop: 8, padding: 10, borderRadius: 10 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
