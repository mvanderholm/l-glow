import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshGunaQuestions } from '../../data/content/remote';

// Fourth admin-editable content type — same CRUD pattern as mythbusters.js.
// Each question always maps to exactly one option per guna (sattva/rajas/
// tamas), flattened into 3 label fields rather than a dynamic options list.

const EMPTY_DRAFT = { id: '', prompt: '', sattva_label: '', rajas_label: '', tamas_label: '' };

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
      <Field colors={c} label="ID (unique slug, e.g. diet)" value={draft.id} onChangeText={t => setDraft({ ...draft, id: t })} placeholder="unique-slug" />
      <Field colors={c} label="Prompt" value={draft.prompt} onChangeText={t => setDraft({ ...draft, prompt: t })} multiline />
      <Field colors={c} label="Sattva answer (left)" value={draft.sattva_label} onChangeText={t => setDraft({ ...draft, sattva_label: t })} multiline />
      <Field colors={c} label="Rajas answer (middle)" value={draft.rajas_label} onChangeText={t => setDraft({ ...draft, rajas_label: t })} multiline />
      <Field colors={c} label="Tamas answer (right)" value={draft.tamas_label} onChangeText={t => setDraft({ ...draft, tamas_label: t })} multiline />

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

export default function GunaQuestionsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('guna_questions').select('*').order('sort_order', { ascending: true });
    if (error) { setError(error.message); return; }
    setItems(data ?? []);
  }

  function startCreate() {
    const nextOrder = items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
    setDraft({ ...EMPTY_DRAFT, sort_order: nextOrder });
    setEditingId('new');
  }

  function startEdit(item) {
    setDraft({
      id: item.id, prompt: item.prompt, sort_order: item.sort_order,
      sattva_label: item.sattva_label, rajas_label: item.rajas_label, tamas_label: item.tamas_label,
    });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.id.trim() || !draft.prompt.trim() || !draft.sattva_label.trim() || !draft.rajas_label.trim() || !draft.tamas_label.trim()) {
      Alert.alert('Missing fields', 'All fields are required.');
      return;
    }
    setSaving(true);
    const payload = {
      id: draft.id.trim(), prompt: draft.prompt.trim(),
      sattva_label: draft.sattva_label.trim(), rajas_label: draft.rajas_label.trim(), tamas_label: draft.tamas_label.trim(),
      sort_order: draft.sort_order ?? (items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1),
    };
    const { error } = await supabase.from('guna_questions').upsert(payload, { onConflict: 'id' });
    setSaving(false);
    if (error) { Alert.alert('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
    refreshGunaQuestions();
  }

  function deleteItem(item) {
    Alert.alert('Delete this question?', `"${item.prompt}" — this can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('guna_questions').delete().eq('id', item.id);
          if (error) { Alert.alert('Couldn\'t delete', error.message); return; }
          await load();
          refreshGunaQuestions();
        },
      },
    ]);
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load guna questions — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={[s.title, { color: c.text }]}>Guna Quiz questions ({items.length})</Text>
        {editingId === null && (
          <Pressable style={[s.actionBtn, { backgroundColor: c.accent }]} onPress={startCreate}>
            <Text style={s.actionBtnText}>+ New</Text>
          </Pressable>
        )}
      </View>

      {editingId === 'new' && (
        <EditorForm draft={draft} setDraft={setDraft} isNew colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
      )}

      {items.map((item, i) => (
        <View key={item.id}>
          {editingId === item.id ? (
            <EditorForm draft={draft} setDraft={setDraft} isNew={false} colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
          ) : (
            <View style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[s.itemMeta, { color: c.textMuted }]}>Q{i + 1} · {item.id}</Text>
                  <Text style={[s.itemPrompt, { color: c.text }]}>{item.prompt}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => startEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
                  <Pressable onPress={() => deleteItem(item)}><Text style={[s.linkText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
                </View>
              </View>
              <View style={{ marginTop: 8, gap: 4 }}>
                <Text style={[s.optionText, { color: c.textMedium }]}>A (Sattva): {item.sattva_label}</Text>
                <Text style={[s.optionText, { color: c.textMedium }]}>B (Rajas): {item.rajas_label}</Text>
                <Text style={[s.optionText, { color: c.textMedium }]}>C (Tamas): {item.tamas_label}</Text>
              </View>
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
  fieldInputMultiline: { minHeight: 50, textAlignVertical: 'top' },

  editorCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 16, padding: 16, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemPrompt: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16, lineHeight: 22 },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
