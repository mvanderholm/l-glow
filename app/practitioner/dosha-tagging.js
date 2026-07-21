import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';

// Purpose-built companion to constitution-questions.js: that screen is full
// CRUD (create/edit/delete questions, fix prompts, add/remove options) but
// tagging one option there means opening a whole edit form. This screen
// does one thing fast: browse every question in a tier and tap dosha chips
// directly, no edit mode, no save button -- each tap writes immediately.
// Fixing prompt text, sections, or the option list itself still happens in
// Constitution -- this screen only ever touches the `dosha` array.
//
// Not every "last option" is a taggable dosha-leaning answer. Vikriti
// Level 2 and Level 3 bake a personalized "none of these fit" catch-all
// into the last option of every question instead of a separate escape
// (see those migrations); Vikriti Level 1's last option is a "balanced/no
// signal" reading. Both are expected to stay untagged by design, not
// incomplete -- there's no stored flag distinguishing that from "not yet
// tagged," so it's a judgment call same as when the content was authored,
// not something this screen tries to guess at.

const TIERS = {
  prakriti: [
    { key: 'foundation', label: 'Foundation' },
    { key: 'level2', label: 'Level 2' },
    { key: 'level3', label: 'Level 3' },
  ],
  vikriti: [
    { key: 'level1', label: 'Level 1' },
    { key: 'level2', label: 'Level 2' },
    { key: 'level3', label: 'Level 3' },
  ],
};
const ASSESSMENTS = [
  { key: 'prakriti', label: 'Prakriti' },
  { key: 'vikriti', label: 'Vikriti' },
];
const DOSHA_OPTIONS = ['vata', 'pitta', 'kapha'];

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
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {DOSHA_OPTIONS.map(d => {
        const sel = selected.includes(d);
        return (
          <Pressable
            key={d}
            onPress={() => onChange(sel ? selected.filter(x => x !== d) : [...selected, d])}
            style={[s.doshaChip, { backgroundColor: sel ? c.accent : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
          >
            <Text style={{ color: sel ? '#FBF9F4' : c.textMedium, fontFamily: 'Inter_600SemiBold', fontSize: 11.5, textTransform: 'uppercase' }}>{d.slice(0, 1).toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function DoshaTaggingAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [assessment, setAssessment] = useState('prakriti');
  const [tier, setTier] = useState('foundation');
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [untaggedOnly, setUntaggedOnly] = useState(false);

  useEffect(() => { load(); }, [assessment, tier]);

  function changeAssessment(next) {
    setAssessment(next);
    setTier(TIERS[next][0].key);
  }

  async function load() {
    setItems(null);
    const { data, error } = await supabase
      .from('constitution_questions')
      .select('*')
      .eq('assessment', assessment)
      .eq('tier', tier)
      .order('sort_order', { ascending: true });
    if (error) { setError(error.message); return; }
    setError(null);
    setItems(data ?? []);
  }

  async function toggleDosha(item, optIdx, dosha) {
    const newOptions = item.options.map((o, i) => {
      if (i !== optIdx) return o;
      const has = (o.dosha || []).includes(dosha);
      return { ...o, dosha: has ? o.dosha.filter(x => x !== dosha) : [...(o.dosha || []), dosha] };
    });
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, options: newOptions } : it));
    setSavingId(item.id);
    const { error } = await supabase.from('constitution_questions').update({ options: newOptions }).eq('id', item.id);
    setSavingId(null);
    if (error) {
      Alert.alert('Couldn\'t save tag', error.message);
      load();
    }
  }

  const multiSelect = (items ?? []).filter(i => i.input_type !== 'free_text');
  const totalOptions = multiSelect.reduce((sum, i) => sum + (i.options?.length ?? 0), 0);
  const taggedOptions = multiSelect.reduce((sum, i) => sum + (i.options ?? []).filter(o => (o.dosha ?? []).length > 0).length, 0);

  const visibleItems = untaggedOnly
    ? multiSelect.filter(i => (i.options ?? []).some(o => (o.dosha ?? []).length === 0))
    : (items ?? []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <Text style={[s.title, { color: c.text, marginBottom: 4 }]}>Tag Doshas</Text>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>
        Tap a letter to tag or untag that dosha for an option — saves immediately, no edit mode. To fix a prompt, section, or the option list itself, use Constitution instead.
      </Text>

      <ChipPicker colors={c} options={ASSESSMENTS} value={assessment} onChange={changeAssessment} />
      <ChipPicker colors={c} options={TIERS[assessment]} value={tier} onChange={setTier} />

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

          {visibleItems.length === 0 && (
            <Text style={[s.emptyText, { color: c.textMuted, marginTop: 12 }]}>
              {untaggedOnly ? 'Nothing untagged left in this tier.' : 'No questions yet for this tier.'}
            </Text>
          )}

          {visibleItems.map(item => (
            <View key={item.id} style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
              <Text style={[s.itemMeta, { color: c.textMuted }]}>
                {item.section || 'no section'} · #{item.sort_order}
                {savingId === item.id ? ' · saving…' : ''}
              </Text>
              <Text style={[s.itemText, { color: c.text }]}>{item.prompt}</Text>

              {item.input_type === 'free_text' ? (
                <Text style={[s.optionPreview, { color: c.textMuted, fontStyle: 'italic', marginTop: 6 }]}>Free text — no options to tag.</Text>
              ) : (
                (item.options ?? []).map((opt, idx) => (
                  <View key={idx} style={[s.optionRow, { borderColor: c.border, backgroundColor: c.surfaceAlt }]}>
                    <Text style={[s.optionLabel, { color: c.text }]}>{opt.label}</Text>
                    <DoshaToggle colors={c} selected={opt.dosha ?? []} onChange={d => toggleDosha(item, idx, d)} />
                  </View>
                ))
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
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  doshaChip: { borderWidth: 1, borderRadius: 8, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },

  progressCard: { borderRadius: 18, padding: 16, marginBottom: 16 },
  progressText: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17 },

  itemCard: { borderRadius: 16, padding: 14, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemText: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20, marginBottom: 10 },

  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 6 },
  optionLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  optionPreview: { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18 },
});
