import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import BackButton, { smartBack } from '../components/BackButton';
import { buildContentIndex, buildUserIndex, matchEntries } from '../data/searchIndex';

// Global search (#44). Content index (Learn/Herbs/Mythbusters/Recommendations/
// Tongue Check/Guna & Agni result copy/Journey cycles) and "your data" index
// (journal + check-in notes) are built once on mount, not rebuilt per
// keystroke — matching is a plain substring filter over each entry's
// pre-joined searchableText, same simple-filtering philosophy as the
// existing herbs.js search. See data/searchIndex.js.

const RESULT_CAP = 20;

export default function Search() {
  const { theme: { colors: c } } = useTheme();
  const [query, setQuery] = useState('');
  const [contentIndex, setContentIndex] = useState([]);
  const [userIndex, setUserIndex] = useState([]);
  const [detailEntry, setDetailEntry] = useState(null);

  useEffect(() => {
    buildContentIndex().then(setContentIndex);
    buildUserIndex().then(setUserIndex);
  }, []);

  const results = matchEntries([...contentIndex, ...userIndex], query);
  const contentResults = results.filter(r => r.group === 'content');
  const yoursResults = results.filter(r => r.group === 'yours');

  function openEntry(entry) {
    if (entry.route) router.push({ pathname: entry.route, params: entry.params || {} });
    else setDetailEntry(entry);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[s.topHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={() => smartBack('/')} color={c.text} />
        <Text style={[s.topHeaderTitle, { color: c.text }]}>Search</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <TextInput
          style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search Learn, Herbs, your journal…"
          placeholderTextColor={c.textMuted}
          autoFocus
          autoCorrect={false}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {query.trim() === '' && (
          <Text style={[s.hint, { color: c.textMuted }]}>
            Search Learn, Herbs, Mythbusters, your recommendations — plus your own journal and check-in notes.
          </Text>
        )}

        {query.trim() !== '' && results.length === 0 && (
          <Text style={[s.hint, { color: c.textMuted }]}>No results for "{query}"</Text>
        )}

        {contentResults.length > 0 && (
          <ResultGroup title="Content" entries={contentResults} onSelect={openEntry} colors={c} />
        )}
        {yoursResults.length > 0 && (
          <ResultGroup title="Your Data" entries={yoursResults} onSelect={openEntry} colors={c} />
        )}
      </ScrollView>

      {detailEntry && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setDetailEntry(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} onPress={() => setDetailEntry(null)} />
          <View style={[s.sheet, { backgroundColor: c.surface }]}>
            <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[s.sheetLabel, { color: c.textMuted }]}>{detailEntry.sourceLabel}</Text>
              <Text style={[s.sheetTitle, { color: c.text }]}>{detailEntry.title}</Text>
              <Text style={[s.sheetBody, { color: c.textMedium }]}>{detailEntry.snippet}</Text>
            </ScrollView>
            <Pressable style={[s.closeBtn, { backgroundColor: c.surfaceAlt, borderColor: c.border }]} onPress={() => setDetailEntry(null)}>
              <Text style={[s.closeBtnText, { color: c.text }]}>CLOSE</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

function ResultGroup({ title, entries, onSelect, colors: c }) {
  const shown = entries.slice(0, RESULT_CAP);
  const overflow = entries.length - shown.length;
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={[s.groupLabel, { color: c.textMuted }]}>{title}</Text>
      <View style={[s.list, { backgroundColor: c.surface, ...card }]}>
        {shown.map((entry, idx) => (
          <Pressable
            key={entry.id}
            onPress={() => onSelect(entry)}
            style={[s.row, idx < shown.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
          >
            <Text style={[s.pill, { backgroundColor: c.surfaceAlt, color: c.textMuted }]}>{entry.sourceLabel}</Text>
            <Text style={[s.rowTitle, { color: c.text }]}>{entry.title}</Text>
            {entry.snippet ? <Text style={[s.rowSnippet, { color: c.textMedium }]} numberOfLines={2}>{entry.snippet}</Text> : null}
          </Pressable>
        ))}
      </View>
      {overflow > 0 && (
        <Text style={[s.overflowText, { color: c.textMuted }]}>+{overflow} more — refine your search</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  topHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  topHeaderTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },

  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'Inter_400Regular', fontSize: 15 },
  hint:  { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },

  groupLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98, textTransform: 'uppercase', marginBottom: 10 },
  list: { borderRadius: 18, overflow: 'hidden' },
  row: { paddingHorizontal: 16, paddingVertical: 14 },
  pill: { alignSelf: 'flex-start', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden', marginBottom: 4 },
  rowTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16 },
  rowSnippet: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, marginTop: 3 },
  overflowText: { fontFamily: 'Inter_400Regular', fontSize: 12.5, marginTop: 8 },

  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '75%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  sheetTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, lineHeight: 28 },
  sheetBody:  { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24, marginTop: 12 },
  closeBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 999, alignItems: 'center', borderWidth: 1 },
  closeBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, letterSpacing: 1 },
});
