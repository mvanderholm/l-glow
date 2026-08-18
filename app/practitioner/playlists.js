import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshPlaylists } from '../../data/content/remote';
import { notify, confirmAsync } from '../../components/practitioner/webSafeAlert';

// Playlists admin — rebuilt Aug 17 2026 from a fixed 3-row dosha-keyed
// table into full add/edit/delete, matching the CRUD pattern every other
// admin content type here already uses (intentions.js, affirmations.js).
// See supabase/migrations/20260817000000_playlists_sound_library.sql for
// why: the old design used `dosha` itself as the primary key, so there was
// structurally no way to add a second playlist for the same dosha, let
// alone one that wasn't dosha-specific at all (Thea's actual Sound Library
// vision — morning energy, focus, sleep, grounding, etc., transcript 28).
//
// Category is plain free text, not a fixed list — Thea can invent her own
// categories here with no code change needed. Dosha tagging is now
// optional and multi-select (a playlist can fit more than one dosha, or
// none) instead of required-and-singular.

const DOSHA_OPTIONS = ['vata', 'pitta', 'kapha'];
const EMPTY_DRAFT = { name: '', category: '', url: '', mood: '', dosha: [], sort_order: '0' };

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
        autoCapitalize="none"
      />
    </View>
  );
}

function DoshaToggle({ selected, onChange, colors: c }) {
  function toggle(d) {
    onChange(selected.includes(d) ? selected.filter(x => x !== d) : [...selected, d]);
  }
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[s.fieldLabel, { color: c.textMuted }]}>Dosha (optional — leave blank to fit anyone)</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {DOSHA_OPTIONS.map(d => {
          const sel = selected.includes(d);
          return (
            <Pressable
              key={d}
              onPress={() => toggle(d)}
              style={[s.doshaChip, { backgroundColor: sel ? c.accent : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
            >
              <Text style={{ color: sel ? '#FBF9F4' : c.textMedium, fontFamily: 'Inter_500Medium', fontSize: 13, textTransform: 'capitalize' }}>{d}</Text>
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
      <Field colors={c} label="Playlist name" value={draft.name} onChangeText={t => setDraft({ ...draft, name: t })} placeholder="e.g. Grounding & Slow" />
      <Field colors={c} label="Category (your own words — e.g. Sleep, Focus, Morning Energy)" value={draft.category} onChangeText={t => setDraft({ ...draft, category: t })} placeholder="Sleep" />
      <Field colors={c} label="Spotify URL (optional until you have it)" value={draft.url} onChangeText={t => setDraft({ ...draft, url: t })} placeholder="https://open.spotify.com/playlist/…" />
      <Field colors={c} label="Mood copy" value={draft.mood} onChangeText={t => setDraft({ ...draft, mood: t })} multiline placeholder="Cool and easy. Nothing too intense today." />
      <DoshaToggle colors={c} selected={draft.dosha} onChange={d => setDraft({ ...draft, dosha: d })} />
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

export default function PlaylistsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('playlists').select('*').order('sort_order', { ascending: true });
    if (error) { setError(error.message); return; }
    // Defensive: dosha is only a real array post-migration. Normalizing
    // here (once, on load) means every downstream .join()/.filter() call
    // on item.dosha is safe regardless of migration state, instead of
    // crashing if this screen is ever opened before the migration runs.
    setItems((data ?? []).map(row => ({ ...row, dosha: Array.isArray(row.dosha) ? row.dosha : [] })));
  }

  function startCreate() {
    setDraft(EMPTY_DRAFT);
    setEditingId('new');
  }

  function startEdit(item) {
    setDraft({
      name: item.name || '', category: item.category || '', url: item.url || '',
      mood: item.mood || '', dosha: item.dosha || [], sort_order: String(item.sort_order ?? 0),
    });
    setEditingId(item.id);
  }

  async function save() {
    if (!draft.name.trim() || !draft.mood.trim()) {
      notify('Missing fields', 'Playlist name and mood copy are required.');
      return;
    }
    const sortOrder = parseInt(draft.sort_order, 10);
    const payload = {
      name: draft.name.trim(),
      category: draft.category.trim() || null,
      url: draft.url.trim() || null,
      mood: draft.mood.trim(),
      dosha: draft.dosha,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    };
    setSaving(true);
    const { error } = editingId === 'new'
      ? await supabase.from('playlists').insert(payload)
      : await supabase.from('playlists').update(payload).eq('id', editingId);
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setEditingId(null);
    await load();
    refreshPlaylists();
  }

  async function deleteItem(item) {
    const ok = await confirmAsync('Delete this playlist?', `"${item.name || 'Untitled'}" — this can't be undone.`);
    if (!ok) return;
    const { error } = await supabase.from('playlists').delete().eq('id', item.id);
    if (error) { notify('Couldn\'t delete', error.message); return; }
    await load();
    refreshPlaylists();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load playlists — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  const categories = ['all', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = filterCategory === 'all' ? items : items.filter(i => i.category === filterCategory);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={[s.title, { color: c.text }]}>Playlists ({filtered.length})</Text>
        {editingId === null && (
          <Pressable style={[s.actionBtn, { backgroundColor: c.accent }]} onPress={startCreate}>
            <Text style={s.actionBtnText}>+ New</Text>
          </Pressable>
        )}
      </View>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>
        Add as many as you want — name a category yourself (Sleep, Focus, whatever makes sense to you), and tag a dosha only if a playlist is specifically for that constitution. "Today's sound" on the home screen picks one that fits the signed-in user, rotating daily.
      </Text>

      {categories.length > 1 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {categories.map(cat => {
            const sel = filterCategory === cat;
            return (
              <Pressable key={cat} onPress={() => setFilterCategory(cat)} style={[s.doshaChip, { backgroundColor: sel ? c.accent : 'transparent', borderColor: sel ? c.accent : c.border }]}>
                <Text style={{ color: sel ? '#FBF9F4' : c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 12.5 }}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

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
                  <Text style={[s.itemMeta, { color: c.textMuted }]}>
                    {item.category || 'Uncategorized'}{item.dosha?.length ? ` · ${item.dosha.join(', ')}` : ''}
                  </Text>
                  <Text style={[s.itemLabel, { color: c.text }]}>{item.name || '(no playlist name set)'}</Text>
                  <Text style={[s.itemDesc, { color: c.textMedium }]}>{item.mood}</Text>
                  {item.url ? (
                    <Pressable onPress={() => Linking.openURL(item.url)}>
                      <Text style={[s.itemHint, { color: c.accent }]}>{item.url}</Text>
                    </Pressable>
                  ) : (
                    <Text style={[s.itemHint, { color: c.textMuted }]}>No URL set yet</Text>
                  )}
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
  fieldInputMultiline: { minHeight: 50, textAlignVertical: 'top' },

  doshaChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },

  editorCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 16, padding: 16, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemLabel: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16 },
  itemDesc: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginTop: 4 },
  itemHint: { fontFamily: 'Inter_400Regular', fontSize: 12.5, fontStyle: 'italic', marginTop: 6 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
