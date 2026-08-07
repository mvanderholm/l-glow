import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import ReorderableList from './ReorderableList';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { notify, confirmAsync } from './webSafeAlert';

// Shared editor for prakriti_questions / vikriti_questions. Originally
// split into this full-CRUD screen plus a separate fast-tagging screen
// (dosha-tagging.js) — merged back into one screen July 20 2026 since
// tagging turned out to just be a lighter view onto the same list this
// screen already renders: every option row below now has tap-to-tag
// dosha chips that save immediately (no edit mode needed just to tag),
// while Edit still opens the full form for changing prompt/section/
// options themselves. Table name and tier list are props so Prakriti and
// Vikriti stay separate at the route/nav/table level.

const DOSHA_OPTIONS = ['vata', 'pitta', 'kapha'];

const emptyOption = () => ({ label: '', dosha: [], imageUrl: '' });
const emptyDraft = () => ({ id: '', section: '', prompt: '', sort_order: '0', allow_none: true, photo_enabled: false, input_type: 'multi_select', options: [emptyOption(), emptyOption(), emptyOption()] });
const INPUT_TYPES = [
  { key: 'multi_select', label: 'Multi-select' },
  { key: 'free_text', label: 'Free text' },
];

function Field({ label, value, onChangeText, colors: c, multiline, placeholder, keyboardType }) {
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
        keyboardType={keyboardType}
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

function DoshaToggle({ selected, onChange, colors: c }) {
  function toggle(d) {
    onChange(selected.includes(d) ? selected.filter(x => x !== d) : [...selected, d]);
  }
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {DOSHA_OPTIONS.map(d => {
        const sel = selected.includes(d);
        return (
          <Pressable
            key={d}
            onPress={() => toggle(d)}
            style={[s.doshaChip, { backgroundColor: sel ? c.accent : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
          >
            <Text style={{ color: sel ? '#FBF9F4' : c.textMedium, fontFamily: 'Inter_600SemiBold', fontSize: 11.5, textTransform: 'uppercase' }}>{d.slice(0, 1).toUpperCase()}</Text>
          </Pressable>
        );
      })}
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
  function updateOption(idx, patch) {
    const next = draft.options.map((o, i) => i === idx ? { ...o, ...patch } : o);
    setDraft({ ...draft, options: next });
  }
  function addOption() {
    setDraft({ ...draft, options: [...draft.options, emptyOption()] });
  }
  function removeOption(idx) {
    setDraft({ ...draft, options: draft.options.filter((_, i) => i !== idx) });
  }

  return (
    <View style={[s.editorCard, { backgroundColor: c.surface, ...card }]}>
      <Field colors={c} label="ID (unique slug, e.g. body-frame)" value={draft.id} onChangeText={t => setDraft({ ...draft, id: t })} placeholder="unique-slug" />
      <Field colors={c} label="Section (optional grouping, e.g. identity)" value={draft.section} onChangeText={t => setDraft({ ...draft, section: t })} placeholder="identity" />
      <Field colors={c} label="Prompt" value={draft.prompt} onChangeText={t => setDraft({ ...draft, prompt: t })} multiline placeholder="Which of these feels most like you?" />
      <Field colors={c} label="Sort order" value={draft.sort_order} onChangeText={t => setDraft({ ...draft, sort_order: t })} keyboardType="number-pad" />

      <ChipPicker colors={c} label="Answer type" options={INPUT_TYPES} value={draft.input_type} onChange={v => setDraft({ ...draft, input_type: v })} />
      <ToggleRow colors={c} label={'"None of these" escape'} value={draft.allow_none} onChange={v => setDraft({ ...draft, allow_none: v })} />
      <ToggleRow colors={c} label="Photo/illustration candidate" value={draft.photo_enabled} onChange={v => setDraft({ ...draft, photo_enabled: v })} />

      {draft.input_type === 'free_text' ? (
        <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 4 }]}>
          Free text — no options to tag. The user's own words are the answer.
        </Text>
      ) : (
        <>
        <Text style={[s.fieldLabel, { color: c.textMuted, marginTop: 4 }]}>Options</Text>
        {draft.options.map((opt, idx) => (
        <View key={idx} style={[s.optionEditRow, { borderColor: c.border, backgroundColor: c.surfaceAlt }]}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[s.optionInput, { color: c.text }]}
              value={opt.label}
              onChangeText={t => updateOption(idx, { label: t })}
              placeholder={`Option ${idx + 1} label`}
              placeholderTextColor={c.textMuted}
              multiline
            />
            <DoshaToggle colors={c} selected={opt.dosha} onChange={d => updateOption(idx, { dosha: d })} />
            <TextInput
              style={[s.optionImageInput, { color: c.textMedium, borderColor: c.border }]}
              value={opt.imageUrl || ''}
              onChangeText={t => updateOption(idx, { imageUrl: t })}
              placeholder="Illustration URL (optional, none yet)"
              placeholderTextColor={c.textMuted}
              autoCapitalize="none"
            />
          </View>
          {draft.options.length > 2 && (
            <Pressable onPress={() => removeOption(idx)} style={{ padding: 4 }}>
              <Text style={{ color: c.terracotta || '#C97855', fontSize: 18, lineHeight: 18 }}>×</Text>
            </Pressable>
          )}
        </View>
      ))}
        <Pressable onPress={addOption} style={{ marginBottom: 14 }}>
          <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>+ Add option</Text>
        </Pressable>
        </>
      )}

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

// Shared row rendering for both the static list (editing/filtered views,
// where drag would be ambiguous — see ConstitutionEditor below) and the
// draggable list (default browsing view). dragHandle is only passed in the
// latter case.
function QuestionCard({ item, colors: c, savingTagId, onEdit, onDelete, onToggleDosha, dragHandle }) {
  return (
    <View style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={[s.itemMeta, { color: c.textMuted }]}>
            {item.section || 'no section'} · #{item.sort_order}
            {item.input_type === 'free_text' ? ' · free text' : ''}
            {item.allow_none ? ' · none-escape' : ''}
            {item.photo_enabled ? ' · 📷' : ''}
            {savingTagId === item.id ? ' · saving…' : ''}
          </Text>
          <Text style={[s.itemText, { color: c.text }]}>{item.prompt}</Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          {dragHandle}
          <Pressable onPress={() => onEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
          <Pressable onPress={() => onDelete(item)}><Text style={[s.linkText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
        </View>
      </View>

      {item.input_type === 'free_text' ? (
        <Text style={[s.optionPreview, { color: c.textMuted, fontStyle: 'italic', marginTop: 6 }]}>Free text — no options to tag.</Text>
      ) : (
        (item.options ?? []).map((opt, idx) => (
          <View key={idx} style={[s.optionTagRow, { borderColor: c.border, backgroundColor: c.surfaceAlt }]}>
            <Text style={[s.optionLabel, { color: c.text }]}>{opt.label}</Text>
            <DoshaToggle colors={c} selected={opt.dosha ?? []} onChange={d => onToggleDosha(item, idx, d)} />
          </View>
        ))
      )}
    </View>
  );
}

export default function ConstitutionEditor({ table, tierOptions, title, subtitle }) {
  const { theme: { colors: c } } = useTheme();
  const [tier, setTier] = useState(tierOptions[0].key);
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [savingTagId, setSavingTagId] = useState(null);
  const [untaggedOnly, setUntaggedOnly] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => { load(); }, [tier]);

  async function load() {
    setItems(null);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('tier', tier)
      .order('sort_order', { ascending: true });
    if (error) { setError(error.message); return; }
    setError(null);
    setItems(data ?? []);
  }

  function startCreate() {
    setDraft(emptyDraft());
    setEditingId('new');
  }

  function startEdit(item) {
    setDraft({
      id: item.id,
      section: item.section || '',
      prompt: item.prompt,
      sort_order: String(item.sort_order ?? 0),
      allow_none: item.allow_none ?? true,
      photo_enabled: item.photo_enabled ?? false,
      input_type: item.input_type || 'multi_select',
      options: (item.options || []).map(o => ({ label: o.label, dosha: o.dosha || [], imageUrl: o.imageUrl || '' })),
    });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.id.trim() || !draft.prompt.trim()) {
      notify('Missing fields', 'ID and prompt are required.');
      return;
    }
    if (draft.input_type === 'multi_select' && draft.options.some(o => !o.label.trim())) {
      notify('Empty option', 'Every option needs label text.');
      return;
    }
    const sortOrder = parseInt(draft.sort_order, 10);
    setSaving(true);
    const payload = {
      id: draft.id.trim(),
      tier,
      section: draft.section.trim() || null,
      prompt: draft.prompt.trim(),
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      allow_none: draft.allow_none,
      photo_enabled: draft.photo_enabled,
      input_type: draft.input_type,
      options: draft.input_type === 'free_text' ? [] : draft.options.map(o => ({ label: o.label.trim(), dosha: o.dosha, imageUrl: o.imageUrl?.trim() || null })),
    };
    const { error } = await supabase.from(table).upsert(payload, { onConflict: 'id' });
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
  }

  async function deleteItem(item) {
    const ok = await confirmAsync('Delete this question?', `"${item.prompt}" — this can't be undone.`);
    if (!ok) return;
    const { error } = await supabase.from(table).delete().eq('id', item.id);
    if (error) { notify('Couldn\'t delete', error.message); return; }
    await load();
  }

  async function toggleDosha(item, optIdx, dosha) {
    const newOptions = item.options.map((o, i) => {
      if (i !== optIdx) return o;
      const has = (o.dosha || []).includes(dosha);
      return { ...o, dosha: has ? o.dosha.filter(x => x !== dosha) : [...(o.dosha || []), dosha] };
    });
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, options: newOptions } : it));
    setSavingTagId(item.id);
    const { error } = await supabase.from(table).update({ options: newOptions }).eq('id', item.id);
    setSavingTagId(null);
    if (error) {
      notify('Couldn\'t save tag', error.message);
      load();
    }
  }

  // Only reachable from the unfiltered, non-editing view (see render below)
  // so `items` here is always the full, currently-displayed order — no
  // reconciling against a filtered subset. Renumbers sequentially rather
  // than trying to preserve original gaps/duplicates in sort_order, since
  // those were never meaningful (freeform integer field, no gap convention
  // documented anywhere).
  async function handleDragEnd({ data }) {
    const prevOrder = new Map(items.map(it => [it.id, it.sort_order]));
    const reordered = data.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(reordered);
    const changed = reordered.filter(it => prevOrder.get(it.id) !== it.sort_order);
    if (changed.length === 0) return;
    setSavingOrder(true);
    const results = await Promise.all(changed.map(it => supabase.from(table).update({ sort_order: it.sort_order }).eq('id', it.id)));
    setSavingOrder(false);
    const failed = results.find(r => r.error);
    if (failed) {
      notify('Couldn\'t save new order', failed.error.message);
      await load();
    }
  }

  const multiSelect = (items ?? []).filter(i => i.input_type !== 'free_text');
  const totalOptions = multiSelect.reduce((sum, i) => sum + (i.options?.length ?? 0), 0);
  const taggedOptions = multiSelect.reduce((sum, i) => sum + (i.options ?? []).filter(o => (o.dosha ?? []).length > 0).length, 0);

  const visibleItems = untaggedOnly
    ? multiSelect.filter(i => (i.options ?? []).some(o => (o.dosha ?? []).length === 0))
    : (items ?? []);

  // Dragging is only offered from the plain, unfiltered browsing view — once
  // an item's mid-edit its row becomes a form (different shape entirely),
  // and the untagged-only filter shows a subset whose visual adjacency
  // wouldn't match the real underlying order. Both cases fall back to the
  // original static list below.
  const draggable = editingId === null && !untaggedOnly;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <Text style={[s.title, { color: c.text, marginBottom: 4 }]}>{title}</Text>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>{subtitle}</Text>

      <ChipPicker colors={c} options={tierOptions} value={tier} onChange={setTier} />

      {error && <Text style={[s.emptyText, { color: c.textMuted, marginTop: 12 }]}>Couldn't load questions — {error}</Text>}
      {!error && !items && <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>}

      {items && (
        <>
          <View style={[s.progressCard, { backgroundColor: c.surface, ...card }]}>
            <Text style={[s.progressText, { color: c.text }]}>{taggedOptions} of {totalOptions} options tagged</Text>
            <Text style={[s.mutedNote, { color: c.textMuted, marginTop: 2 }]}>
              Some options (catch-alls, "balanced" readings) are meant to stay untagged — this count won't reach 100% even when tagging is done.
            </Text>
            <Pressable onPress={() => setUntaggedOnly(v => !v)} style={[s.chip, { alignSelf: 'flex-start', marginTop: 10, backgroundColor: untaggedOnly ? c.accent : c.surfaceAlt, borderColor: untaggedOnly ? c.accent : c.border }]}>
              <Text style={{ color: untaggedOnly ? '#FBF9F4' : c.textMedium, fontFamily: 'Inter_500Medium', fontSize: 13 }}>
                {untaggedOnly ? 'Showing untagged only' : 'Show untagged only'}
              </Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[s.title, { color: c.text, fontSize: 16 }]}>{visibleItems.length} question{visibleItems.length === 1 ? '' : 's'}</Text>
            {editingId === null && (
              <Pressable style={[s.actionBtn, { backgroundColor: c.accent }]} onPress={startCreate}>
                <Text style={s.actionBtnText}>+ New</Text>
              </Pressable>
            )}
          </View>

          {editingId === 'new' && (
            <EditorForm draft={draft} setDraft={setDraft} isNew colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
          )}

          {visibleItems.length === 0 && editingId !== 'new' && (
            <Text style={[s.emptyText, { color: c.textMuted }]}>
              {untaggedOnly ? 'Nothing untagged left in this tier.' : 'No questions yet for this tier.'}
            </Text>
          )}

          {draggable && (
            <>
              {savingOrder && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 8 }]}>Saving new order…</Text>}
              <ReorderableList
                data={visibleItems}
                keyExtractor={item => item.id}
                onDragEnd={handleDragEnd}
                renderItem={({ item, isActive, dragHandleProps }) => (
                  <QuestionCard
                    item={item}
                    colors={c}
                    savingTagId={savingTagId}
                    onEdit={startEdit}
                    onDelete={deleteItem}
                    onToggleDosha={toggleDosha}
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

          {!draggable && visibleItems.map(item => (
            <View key={item.id}>
              {editingId === item.id ? (
                <EditorForm draft={draft} setDraft={setDraft} isNew={false} colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
              ) : (
                <QuestionCard
                  item={item}
                  colors={c}
                  savingTagId={savingTagId}
                  onEdit={startEdit}
                  onDelete={deleteItem}
                  onToggleDosha={toggleDosha}
                />
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  centerPad: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22 },
  title: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },
  mutedNote: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  fieldInputMultiline: { minHeight: 50, textAlignVertical: 'top' },

  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  doshaChip: { borderWidth: 1, borderRadius: 8, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },

  optionEditRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 8 },
  optionInput: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginBottom: 8, minHeight: 20 },
  optionImageInput: { fontFamily: 'Inter_400Regular', fontSize: 11.5, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, marginTop: 8 },
  optionPreview: { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18, marginTop: 4 },

  optionTagRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, marginTop: 6 },
  optionLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  editorCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  progressCard: { borderRadius: 18, padding: 16, marginBottom: 16 },
  progressText: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17 },

  itemCard: { borderRadius: 16, padding: 14, marginBottom: 8 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemText: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
