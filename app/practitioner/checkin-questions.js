import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshCheckinDimensions } from '../../data/content/remote';

// Third admin-editable content type — different shape from the other two:
// this is edit-only, not a free collection. The 5 keys
// (physical/mental/emotional/hunger/tongue) are fixed columns on the
// checkins table, so there's no add/delete here — only rewording
// label/description/hints for the 5 that already exist.

function Field({ label, value, onChangeText, colors: c, multiline, placeholder }) {
  return (
    <View style={{ marginBottom: 10 }}>
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

export default function CheckinQuestionsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('checkin_dimensions').select('*').order('sort_order', { ascending: true });
    if (error) { setError(error.message); return; }
    setItems(data ?? []);
  }

  function startEdit(item) {
    setDraft({ label: item.label, description: item.description, hint_low: item.hint_low || '', hint_high: item.hint_high || '' });
    setEditingKey(item.key);
  }

  async function save(key) {
    if (!draft.label.trim() || !draft.description.trim()) {
      Alert.alert('Missing fields', 'Label and description are required.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('checkin_dimensions').update({
      label: draft.label.trim(), description: draft.description.trim(),
      hint_low: draft.hint_low.trim() || null, hint_high: draft.hint_high.trim() || null,
    }).eq('key', key);
    setSaving(false);
    if (error) { Alert.alert('Couldn\'t save', error.message); return; }
    setEditingKey(null);
    await load();
    refreshCheckinDimensions();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load check-in questions — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <Text style={[s.title, { color: c.text, marginBottom: 6 }]}>Check-in questions</Text>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>
        These 5 dimensions are fixed — no add/delete here, since they're tied to the check-in data structure. Reword the label, description, or hints as needed.
      </Text>

      {items.map(item => (
        <View key={item.key} style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
          {editingKey === item.key ? (
            <>
              <Field colors={c} label="Label" value={draft.label} onChangeText={t => setDraft({ ...draft, label: t })} />
              <Field colors={c} label="Description" value={draft.description} onChangeText={t => setDraft({ ...draft, description: t })} multiline />
              <Field colors={c} label="Hint — low end (optional)" value={draft.hint_low} onChangeText={t => setDraft({ ...draft, hint_low: t })} placeholder="e.g. none at all" />
              <Field colors={c} label="Hint — high end (optional)" value={draft.hint_high} onChangeText={t => setDraft({ ...draft, hint_high: t })} placeholder="e.g. genuinely hungry" />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Pressable style={[s.actionBtn, { flex: 1, backgroundColor: c.accent }]} onPress={() => save(item.key)} disabled={saving}>
                  <Text style={s.actionBtnText}>{saving ? 'Saving…' : 'Save changes'}</Text>
                </Pressable>
                <Pressable style={[s.actionBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={() => setEditingKey(null)}>
                  <Text style={[s.actionBtnText, { color: c.textMuted }]}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[s.itemMeta, { color: c.textMuted }]}>{item.key}</Text>
                  <Text style={[s.itemLabel, { color: c.text }]}>{item.label}</Text>
                  <Text style={[s.itemDesc, { color: c.textMedium }]}>{item.description}</Text>
                  {(item.hint_low || item.hint_high) && (
                    <Text style={[s.itemHint, { color: c.textMuted }]}>{item.hint_low} → {item.hint_high}</Text>
                  )}
                </View>
                <Pressable onPress={() => startEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
              </View>
            </>
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

  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 16, padding: 16, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemLabel: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16 },
  itemDesc: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginTop: 4 },
  itemHint: { fontFamily: 'Inter_400Regular', fontSize: 12.5, fontStyle: 'italic', marginTop: 6 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
