import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import ReorderableList from '../../components/practitioner/ReorderableList';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshAgniQuestions } from '../../data/content/remote';
import { notify, confirmAsync } from '../../components/practitioner/webSafeAlert';

// Agni Assessment questions — same CRUD/reorder pattern as guna-questions.js.
// Each question always maps to exactly one option per agni type (sama/
// vishama/tikshna/manda), flattened into 4 label fields rather than a
// dynamic options list. Content is still [DRAFT] — see agniQuiz.js's header
// comment — making it admin-editable doesn't change that; Thea still owns
// final review before any of this is approved copy.

const EMPTY_DRAFT = { id: '', prompt: '', sama_label: '', vishama_label: '', tikshna_label: '', manda_label: '' };

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
      <Field colors={c} label="ID (unique slug, e.g. appetite)" value={draft.id} onChangeText={t => setDraft({ ...draft, id: t })} placeholder="unique-slug" />
      <Field colors={c} label="Prompt" value={draft.prompt} onChangeText={t => setDraft({ ...draft, prompt: t })} multiline />
      <Field colors={c} label="Sama answer (balanced)" value={draft.sama_label} onChangeText={t => setDraft({ ...draft, sama_label: t })} multiline />
      <Field colors={c} label="Vishama answer (irregular)" value={draft.vishama_label} onChangeText={t => setDraft({ ...draft, vishama_label: t })} multiline />
      <Field colors={c} label="Tikshna answer (intense)" value={draft.tikshna_label} onChangeText={t => setDraft({ ...draft, tikshna_label: t })} multiline />
      <Field colors={c} label="Manda answer (slow)" value={draft.manda_label} onChangeText={t => setDraft({ ...draft, manda_label: t })} multiline />

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

function QuestionCard({ item, i, colors: c, onEdit, onDelete, dragHandle }) {
  return (
    <View style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={[s.itemMeta, { color: c.textMuted }]}>Q{i + 1} · {item.id}</Text>
          <Text style={[s.itemPrompt, { color: c.text }]}>{item.prompt}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {dragHandle}
          <Pressable onPress={() => onEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
          <Pressable onPress={() => onDelete(item)}><Text style={[s.linkText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
        </View>
      </View>
      <View style={{ marginTop: 8, gap: 4 }}>
        <Text style={[s.optionText, { color: c.textMedium }]}>Sama: {item.sama_label}</Text>
        <Text style={[s.optionText, { color: c.textMedium }]}>Vishama: {item.vishama_label}</Text>
        <Text style={[s.optionText, { color: c.textMedium }]}>Tikshna: {item.tikshna_label}</Text>
        <Text style={[s.optionText, { color: c.textMedium }]}>Manda: {item.manda_label}</Text>
      </View>
    </View>
  );
}

export default function AgniQuestionsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('agni_questions').select('*').order('sort_order', { ascending: true });
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
      sama_label: item.sama_label, vishama_label: item.vishama_label,
      tikshna_label: item.tikshna_label, manda_label: item.manda_label,
    });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.id.trim() || !draft.prompt.trim() || !draft.sama_label.trim() || !draft.vishama_label.trim() || !draft.tikshna_label.trim() || !draft.manda_label.trim()) {
      notify('Missing fields', 'All fields are required.');
      return;
    }
    setSaving(true);
    const payload = {
      id: draft.id.trim(), prompt: draft.prompt.trim(),
      sama_label: draft.sama_label.trim(), vishama_label: draft.vishama_label.trim(),
      tikshna_label: draft.tikshna_label.trim(), manda_label: draft.manda_label.trim(),
      sort_order: draft.sort_order ?? (items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1),
    };
    const { error } = await supabase.from('agni_questions').upsert(payload, { onConflict: 'id' });
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
    refreshAgniQuestions();
  }

  async function deleteItem(item) {
    const ok = await confirmAsync('Delete this question?', `"${item.prompt}" — this can't be undone.`);
    if (!ok) return;
    const { error } = await supabase.from('agni_questions').delete().eq('id', item.id);
    if (error) { notify('Couldn\'t delete', error.message); return; }
    await load();
    refreshAgniQuestions();
  }

  async function handleDragEnd({ data }) {
    const prevOrder = new Map(items.map(it => [it.id, it.sort_order]));
    const reordered = data.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(reordered);
    const changed = reordered.filter(it => prevOrder.get(it.id) !== it.sort_order);
    if (changed.length === 0) return;
    setSavingOrder(true);
    const results = await Promise.all(changed.map(it => supabase.from('agni_questions').update({ sort_order: it.sort_order }).eq('id', it.id)));
    setSavingOrder(false);
    const failed = results.find(r => r.error);
    if (failed) {
      notify('Couldn\'t save new order', failed.error.message);
      await load();
      return;
    }
    refreshAgniQuestions();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load agni questions — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  const draggable = editingId === null;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={[s.title, { color: c.text }]}>Agni Assessment questions ({items.length})</Text>
        {editingId === null && (
          <Pressable style={[s.actionBtn, { backgroundColor: c.accent }]} onPress={startCreate}>
            <Text style={s.actionBtnText}>+ New</Text>
          </Pressable>
        )}
      </View>

      {editingId === 'new' && (
        <EditorForm draft={draft} setDraft={setDraft} isNew colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
      )}

      {draggable && (
        <>
          {savingOrder && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 8 }]}>Saving new order…</Text>}
          <ReorderableList
            data={items}
            keyExtractor={item => item.id}
            onDragEnd={handleDragEnd}
            renderItem={({ item, index, isActive, dragHandleProps }) => (
              <QuestionCard
                item={item}
                i={index}
                colors={c}
                onEdit={startEdit}
                onDelete={deleteItem}
                dragHandle={dragHandleProps && (
                  <View {...dragHandleProps.listeners} {...dragHandleProps.attributes} style={{ opacity: isActive ? 0.5 : 1, cursor: 'grab' }}>
                    <Text style={{ color: c.textMuted, fontSize: 18, lineHeight: 18 }}>⠿</Text>
                  </View>
                )}
              />
            )}
          />
        </>
      )}

      {!draggable && items.map((item, i) => (
        <View key={item.id}>
          {editingId === item.id ? (
            <EditorForm draft={draft} setDraft={setDraft} isNew={false} colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
          ) : (
            <QuestionCard item={item} i={i} colors={c} onEdit={startEdit} onDelete={deleteItem} />
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
  mutedNote: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

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
