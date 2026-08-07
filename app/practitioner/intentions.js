import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshIntentions } from '../../data/content/remote';
import { notify, confirmAsync } from '../../components/practitioner/webSafeAlert';

// Fifth admin-editable content type — same CRUD pattern as affirmations.js.
// Unlike affirmations, order matters here (intentionSuggestions() takes the
// first few per dosha), so there's a sort_order field instead of just
// ordering by id.

const DOSHA_OPTIONS = ['universal', 'vata', 'pitta', 'kapha'];
const EMPTY_DRAFT = { id: '', text: '', dosha: 'universal', sort_order: '0' };

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

function DoshaPicker({ value, onChange, colors: c }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[s.fieldLabel, { color: c.textMuted }]}>Dosha</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {DOSHA_OPTIONS.map(opt => {
          const sel = value === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[s.doshaChip, { backgroundColor: sel ? c.accent : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
            >
              <Text style={{ color: sel ? '#FBF9F4' : c.textMedium, fontFamily: 'Inter_500Medium', fontSize: 13 }}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function EditorForm({ draft, setDraft, isNew, colors: c, onSave, onCancel, saving }) {
  return (
    <View style={[s.editorCard, { backgroundColor: c.surface, ...card }]}>
      <Field colors={c} label="ID (unique slug, e.g. v-morning-oil)" value={draft.id} onChangeText={t => setDraft({ ...draft, id: t })} placeholder="unique-slug" />
      <Field colors={c} label="Text" value={draft.text} onChangeText={t => setDraft({ ...draft, text: t })} multiline placeholder="drink warm water" />
      <DoshaPicker colors={c} value={draft.dosha} onChange={d => setDraft({ ...draft, dosha: d })} />
      <Field colors={c} label="Sort order" value={draft.sort_order} onChangeText={t => setDraft({ ...draft, sort_order: t })} keyboardType="number-pad" />

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

export default function IntentionsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [filterDosha, setFilterDosha] = useState('all');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('intention_suggestions').select('*').order('sort_order', { ascending: true });
    if (error) { setError(error.message); return; }
    setItems(data ?? []);
  }

  function startCreate() {
    setDraft(EMPTY_DRAFT);
    setEditingId('new');
  }

  function startEdit(item) {
    setDraft({ id: item.id, text: item.text, dosha: item.dosha, sort_order: String(item.sort_order ?? 0) });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.id.trim() || !draft.text.trim()) {
      notify('Missing fields', 'ID and text are required.');
      return;
    }
    const sortOrder = parseInt(draft.sort_order, 10);
    setSaving(true);
    const payload = {
      id: draft.id.trim(), text: draft.text.trim(), dosha: draft.dosha,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    };
    const { error } = await supabase.from('intention_suggestions').upsert(payload, { onConflict: 'id' });
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
    refreshIntentions();
  }

  async function deleteItem(item) {
    const ok = await confirmAsync('Delete this intention?', `"${item.text}" — this can't be undone.`);
    if (!ok) return;
    const { error } = await supabase.from('intention_suggestions').delete().eq('id', item.id);
    if (error) { notify('Couldn\'t delete', error.message); return; }
    await load();
    refreshIntentions();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load intentions — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  const filtered = filterDosha === 'all' ? items : items.filter(i => i.dosha === filterDosha);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={[s.title, { color: c.text }]}>Intentions ({filtered.length})</Text>
        {editingId === null && (
          <Pressable style={[s.actionBtn, { backgroundColor: c.accent }]} onPress={startCreate}>
            <Text style={s.actionBtnText}>+ New</Text>
          </Pressable>
        )}
      </View>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>
        "Just for today" suggestions shown on the home screen — universal suggestions always show, dosha-specific ones show first for a matching user.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {['all', ...DOSHA_OPTIONS].map(opt => {
          const sel = filterDosha === opt;
          return (
            <Pressable key={opt} onPress={() => setFilterDosha(opt)} style={[s.doshaChip, { backgroundColor: sel ? c.accent : 'transparent', borderColor: sel ? c.accent : c.border }]}>
              <Text style={{ color: sel ? '#FBF9F4' : c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 12.5 }}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>

      {editingId === 'new' && (
        <EditorForm draft={draft} setDraft={setDraft} isNew colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
      )}

      {filtered.map(item => (
        <View key={item.id}>
          {editingId === item.id ? (
            <EditorForm draft={draft} setDraft={setDraft} isNew={false} colors={c} saving={saving} onSave={save} onCancel={() => setEditingId(null)} />
          ) : (
            <View style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[s.itemMeta, { color: c.textMuted }]}>{item.dosha} · #{item.sort_order}</Text>
                  <Text style={[s.itemText, { color: c.text }]}>{item.text}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => startEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
                  <Pressable onPress={() => deleteItem(item)}><Text style={[s.linkText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
                </View>
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
  mutedNote: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  fieldInputMultiline: { minHeight: 60, textAlignVertical: 'top' },

  doshaChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },

  editorCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 16, padding: 14, marginBottom: 8 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemText: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
