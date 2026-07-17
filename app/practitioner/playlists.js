import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Alert, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { refreshPlaylists } from '../../data/content/remote';

// Seventh admin-editable content type — edit-only like checkin-questions.js:
// dosha (vata/pitta/kapha) is the primary key, so there's no add/delete,
// just filling in name/url once Thea has her Spotify links (see roadmap #10)
// and adjusting mood copy.

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
        autoCapitalize="none"
      />
    </View>
  );
}

export default function PlaylistsAdmin() {
  const { theme: { colors: c } } = useTheme();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingDosha, setEditingDosha] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data, error } = await supabase.from('playlists').select('*').order('dosha', { ascending: true });
    if (error) { setError(error.message); return; }
    setItems(data ?? []);
  }

  function startEdit(item) {
    setDraft({ name: item.name || '', url: item.url || '', mood: item.mood });
    setEditingDosha(item.dosha);
  }

  async function save(dosha) {
    if (!draft.mood.trim()) {
      Alert.alert('Missing field', 'Mood copy is required.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('playlists').update({
      name: draft.name.trim() || null, url: draft.url.trim() || null, mood: draft.mood.trim(),
    }).eq('dosha', dosha);
    setSaving(false);
    if (error) { Alert.alert('Couldn\'t save', error.message); return; }
    setEditingDosha(null);
    await load();
    refreshPlaylists();
  }

  if (error) {
    return <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load playlists — {error}</Text></View>;
  }
  if (!items) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      <Text style={[s.title, { color: c.text, marginBottom: 6 }]}>Playlists</Text>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>
        One per dosha, fixed set — no add/delete. Leave name/URL blank until there's a real Spotify link; "Today's sound" shows "Playlist coming soon" when URL is empty.
      </Text>

      {items.map(item => (
        <View key={item.dosha} style={[s.itemCard, { backgroundColor: c.surface, ...card }]}>
          {editingDosha === item.dosha ? (
            <>
              <Field colors={c} label="Playlist name (optional)" value={draft.name} onChangeText={t => setDraft({ ...draft, name: t })} placeholder="e.g. Grounding & Slow" />
              <Field colors={c} label="Spotify URL (optional)" value={draft.url} onChangeText={t => setDraft({ ...draft, url: t })} placeholder="https://open.spotify.com/playlist/…" />
              <Field colors={c} label="Mood copy" value={draft.mood} onChangeText={t => setDraft({ ...draft, mood: t })} multiline />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Pressable style={[s.actionBtn, { flex: 1, backgroundColor: c.accent }]} onPress={() => save(item.dosha)} disabled={saving}>
                  <Text style={s.actionBtnText}>{saving ? 'Saving…' : 'Save changes'}</Text>
                </Pressable>
                <Pressable style={[s.actionBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={() => setEditingDosha(null)}>
                  <Text style={[s.actionBtnText, { color: c.textMuted }]}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[s.itemMeta, { color: c.textMuted }]}>{item.dosha}</Text>
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
              <Pressable onPress={() => startEdit(item)}><Text style={[s.linkText, { color: c.accent }]}>Edit</Text></Pressable>
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

  actionBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  itemCard: { borderRadius: 16, padding: 16, marginBottom: 10 },
  itemMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  itemLabel: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16 },
  itemDesc: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginTop: 4 },
  itemHint: { fontFamily: 'Inter_400Regular', fontSize: 12.5, fontStyle: 'italic', marginTop: 6 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5 },
});
