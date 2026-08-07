import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import ReorderableList from '../../components/practitioner/ReorderableList';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshDoshaQuestions } from '../../data/content/remote';
import { notify, confirmAsync } from '../../components/practitioner/webSafeAlert';

// Standalone Dosha Quiz (`/quiz`, 14 questions) — same pattern as
// guna-questions.js: each question always maps to exactly one option per
// dosha (vata/pitta/kapha), flattened into 3 label fields rather than a
// dynamic options list. Two differences from Guna: `section` groups
// questions into quiz.js's physical/physiological/psychological headers,
// and `multiSelect` lets a question (skin, hair) accept more than one
// checked option instead of a single pick.

const SECTIONS = [
  { key: 'physical', label: 'Physical' },
  { key: 'physiological', label: 'Physiological' },
  { key: 'psychological', label: 'Psychological' },
];

// multi_select defaults true — every Dosha Quiz question is "check all that
// apply" now (Matt, July 30 2026), not just the two that started that way.
const EMPTY_DRAFT = { id: '', section: 'physical', prompt: '', vata_label: '', pitta_label: '', kapha_label: '', multi_select: true };

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

function ChipPicker({ label, options, value, onChange, colors: c }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label && <Text style={[s.fieldLabel, { color: c.textMuted }]}>{label}</Text>}
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => {
          const sel = value === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChange(opt.key)}
              style={[s.chip, { backgroundColor: sel ? c.accent : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
            >
              <Text style={{ color: sel ? '#FBF9F4' : c.textMedium, fontFamily: 'Inter_500Medium', fontSize: 13 }}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({ label, value, onChange, colors: c }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text style={[s.fieldLabel, { color: c.textMuted, marginBottom: 0 }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function EditorForm({ draft, setDraft, isNew, colors: c, onSave, onCancel, saving }) {
  return (
    <View style={[s.editorCard, { backgroundColor: c.surface, ...card }]}>
      <Field colors={c} label="ID (unique slug, e.g. body-frame)" value={draft.id} onChangeText={t => setDraft({ ...draft, id: t })} placeholder="unique-slug" />
      <ChipPicker colors={c} label="Section" options={SECTIONS} value={draft.section} onChange={v => setDraft({ ...draft, section: v })} />
      <Field colors={c} label="Prompt" value={draft.prompt} onChangeText={t => setDraft({ ...draft, prompt: t })} multiline />
      <ToggleRow colors={c} label="Allow checking more than one option" value={draft.multi_select} onChange={v => setDraft({ ...draft, multi_select: v })} />
      <Field colors={c} label="Vata answer" value={draft.vata_label} onChangeText={t => setDraft({ ...draft, vata_label: t })} multiline />
      <Field colors={c} label="Pitta answer" value={draft.pitta_label} onChangeText={t => setDraft({ ...draft, pitta_label: t })} multiline />
      <Field colors={c} label="Kapha answer" value={draft.kapha_label} onChangeText={t => setDraft({ ...draft, kapha_label: t })} multiline />

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
  const sectionLabel = SECTIONS.find(s2 => s2.key === item.section)?.label ?? item.section ?? 'no section';
  return (
    <View style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={[s.itemMeta, { color: c.textMuted }]}>
            Q{i + 1} · {item.id} · {sectionLabel}{item.multi_select ? ' · multi-select' : ''}
          </Text>
          <Text style={[s.itemPrompt, { color: c.text }]}>{item.prompt}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {dragHandle}
          <Pressable onPress={() => onEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
          <Pressable onPress={() => onDelete(item)}><Text style={[s.linkText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
        </View>
      </View>
      <View style={{ marginTop: 8, gap: 4 }}>
        <Text style={[s.optionText, { color: c.textMedium }]}>Vata: {item.vata_label}</Text>
        <Text style={[s.optionText, { color: c.textMedium }]}>Pitta: {item.pitta_label}</Text>
        <Text style={[s.optionText, { color: c.textMedium }]}>Kapha: {item.kapha_label}</Text>
      </View>
    </View>
  );
}

export default function DoshaQuestionsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('dosha_questions').select('*').order('sort_order', { ascending: true });
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
      id: item.id, section: item.section || 'physical', prompt: item.prompt, sort_order: item.sort_order,
      multi_select: item.multi_select ?? false,
      vata_label: item.vata_label, pitta_label: item.pitta_label, kapha_label: item.kapha_label,
    });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.id.trim() || !draft.prompt.trim() || !draft.vata_label.trim() || !draft.pitta_label.trim() || !draft.kapha_label.trim()) {
      notify('Missing fields', 'ID, prompt, and all three answers are required.');
      return;
    }
    setSaving(true);
    const payload = {
      id: draft.id.trim(), section: draft.section, prompt: draft.prompt.trim(),
      multi_select: draft.multi_select,
      vata_label: draft.vata_label.trim(), pitta_label: draft.pitta_label.trim(), kapha_label: draft.kapha_label.trim(),
      sort_order: draft.sort_order ?? (items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1),
    };
    const { error } = await supabase.from('dosha_questions').upsert(payload, { onConflict: 'id' });
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
    refreshDoshaQuestions();
  }

  async function deleteItem(item) {
    const ok = await confirmAsync('Delete this question?', `"${item.prompt}" — this can't be undone.`);
    if (!ok) return;
    const { error } = await supabase.from('dosha_questions').delete().eq('id', item.id);
    if (error) { notify('Couldn\'t delete', error.message); return; }
    await load();
    refreshDoshaQuestions();
  }

  // Renumbers sequentially on drop rather than preserving original sort_order
  // values — same reasoning as guna-questions.js's handleDragEnd: this is a
  // freeform integer field with no documented gap convention.
  async function handleDragEnd({ data }) {
    const prevOrder = new Map(items.map(it => [it.id, it.sort_order]));
    const reordered = data.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(reordered);
    const changed = reordered.filter(it => prevOrder.get(it.id) !== it.sort_order);
    if (changed.length === 0) return;
    setSavingOrder(true);
    const results = await Promise.all(changed.map(it => supabase.from('dosha_questions').update({ sort_order: it.sort_order }).eq('id', it.id)));
    setSavingOrder(false);
    const failed = results.find(r => r.error);
    if (failed) {
      notify('Couldn\'t save new order', failed.error.message);
      await load();
      return;
    }
    refreshDoshaQuestions();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load dosha questions — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  const draggable = editingId === null;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={[s.title, { color: c.text }]}>Dosha Quiz questions ({items.length})</Text>
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

  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },

  editorCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 16, padding: 16, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemPrompt: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16, lineHeight: 22 },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
