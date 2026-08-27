import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { buildContentIndex, buildUserIndex, matchEntries } from '../data/searchIndex';
import { herbFoodDatabase } from '../data/content/herbFoodDatabase';
import { concepts } from '../data/content/learn';
import { SEASONAL_CONTENT } from '../data/content/cycles';
import LogoMark from '../components/LogoMark';
import Svg, { Path, Circle } from 'react-native-svg';

// Explore tab (nav restructure, Move 4) — flattens the old Lifestyle/
// Movement/Nourishment/Herbs/Learn/Search screens into one filterable
// library, matching the mockup Matt shared. Search reuses the existing
// content+user index (data/searchIndex.js) rather than rebuilding search
// logic. Herbs & Foods and Learn keep their full interactive browse+modal
// experience at /herbs and /learn (linked via "See all") rather than
// duplicating ~250 lines of working filter/modal UI inline here.

const CHIPS = ['All', 'Herbs & Foods', 'Recipes', 'Practices', 'Learn', 'From Thea'];

const PRACTICES = [
  { href: '/breathwork',  title: 'Breathwork',   desc: 'Pranayama practices', Icon: BreathIcon },
  { href: '/meditation',  title: 'Meditation',   desc: 'Guided & silent',     Icon: MeditationIcon },
  { href: '/selfmassage', title: 'Self-Massage', desc: 'Abhyanga rituals',    Icon: HandIcon },
];

// Coming-soon teasers consolidated from the retiring Lifestyle/Movement/
// Nourishment hub screens — copy carried forward verbatim, not invented.
const COMING_SOON = [
  { title: 'Food Guide',        desc: "Thea's A–Z guide: what's medicine and what's poison depends entirely on who you are." },
  { title: 'Freedom with Food', desc: "Untangling the fear, the guilt, and the rules you didn't choose. Thea's signature content area." },
  { title: 'Weight Balancing',  desc: 'Not weight loss. Weight balancing — because it goes both directions and starts with agni.' },
  { title: 'Asana & Postures',  desc: 'Dosha-tuned movement sequences — Vata, Pitta, and Kapha each have their own medicine.' },
  { title: 'Pulse Reading',     desc: "Seasonal self-assessment. Thea's content coming." },
];

export default function Explore() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All');
  const [contentIndex, setContentIndex] = useState([]);
  const [userIndex, setUserIndex] = useState([]);

  useEffect(() => {
    buildContentIndex().then(setContentIndex);
    buildUserIndex().then(setUserIndex);
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return matchEntries([...contentIndex, ...userIndex], query);
  }, [query, contentIndex, userIndex]);

  const herbPreview = herbFoodDatabase.slice(0, 3);
  const learnPreview = concepts.slice(0, 2);
  const seasonalPreview = SEASONAL_CONTENT[0];

  const show = section => chip === 'All' || chip === section;
  const searching = query.trim() !== '';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 }}>
        <LogoMark size={36} compact />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={[type.display, { color: c.text }]}>Explore</Text>
        <Text style={[type.muted, { color: c.textMuted, marginTop: 4 }]}>Herbs, food, practices, and the tradition behind them.</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search everything"
          placeholderTextColor={c.textMuted}
          style={[styles.searchInput, { backgroundColor: c.surface, color: c.text, marginTop: spacing.md }]}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {!searching && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.md }} contentContainerStyle={{ gap: 8 }}>
            {CHIPS.map(label => {
              const active = chip === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => setChip(label)}
                  style={[styles.chip, { borderColor: active ? c.accent : c.border, backgroundColor: active ? c.accent : 'transparent' }]}
                >
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: active ? '#FBF9F4' : c.textMedium }}>{label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {searching ? (
          <View style={{ marginTop: spacing.lg }}>
            {searchResults.length === 0 ? (
              <Text style={[type.muted, { color: c.textMuted }]}>No results for "{query}"</Text>
            ) : (
              <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
                {searchResults.slice(0, 30).map((entry, idx, arr) => (
                  <Pressable
                    key={entry.id}
                    style={[styles.row, idx < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
                    onPress={() => entry.route && router.push({ pathname: entry.route, params: entry.params || {} })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', color: c.accent, marginBottom: 2 }}>{entry.sourceLabel}</Text>
                      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 15, color: c.text }}>{entry.title}</Text>
                      {entry.snippet ? <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 2 }} numberOfLines={2}>{entry.snippet}</Text> : null}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {show('Herbs & Foods') && (
              <Section title="Herbs & Foods" count={`${herbFoodDatabase.length} entries`} c={c} type={type} spacing={spacing}>
                <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
                  {herbPreview.map((h, idx) => (
                    <Pressable key={h.name} style={[styles.row, idx < herbPreview.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]} onPress={() => router.push({ pathname: '/herbs', params: { herb: h.name } })}>
                      <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><HerbIcon color={c.accent} size={18} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: c.text }}>{h.name}</Text>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 1 }}>{[h.latinName, h.energy].filter(Boolean).join(' · ')}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                <SeeAll label="See all herbs & foods" onPress={() => router.push('/herbs')} c={c} />
              </Section>
            )}

            {show('Recipes') && (
              <Section title="Recipes" c={c} type={type} spacing={spacing}>
                <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 20, color: c.textMuted }}>
                    Seasonal, dosha-balancing recipes are coming — nothing fabricated here in the meantime.
                  </Text>
                </View>
              </Section>
            )}

            {show('Practices') && (
              <Section title="Practices" c={c} type={type} spacing={spacing}>
                <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
                  {PRACTICES.map((item, idx) => (
                    <Pressable key={item.href} style={[styles.row, idx < PRACTICES.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]} onPress={() => router.push(item.href)}>
                      <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><item.Icon color={c.accent} size={18} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: c.text }}>{item.title}</Text>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 1 }}>{item.desc}</Text>
                      </View>
                      <ChevronIcon color={c.textMuted} />
                    </Pressable>
                  ))}
                </View>
              </Section>
            )}

            {show('Learn') && (
              <Section title="Learn" count={`${concepts.length} concepts`} c={c} type={type} spacing={spacing}>
                <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
                  {learnPreview.map((con, idx) => (
                    <Pressable key={con.id} style={[styles.row, idx < learnPreview.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]} onPress={() => router.push({ pathname: '/learn', params: { conceptId: con.id } })}>
                      <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><BookIcon color={c.accent} size={18} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: c.text }}>{con.title}</Text>
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 1 }} numberOfLines={1}>{con.sanskrit ? `${con.sanskrit} · ` : ''}{con.teaser}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                <SeeAll label="See all concepts" onPress={() => router.push('/learn')} c={c} />
              </Section>
            )}

            {show('From Thea') && seasonalPreview && (
              <Section title="From Thea" c={c} type={type} spacing={spacing}>
                <Pressable style={[styles.card, { backgroundColor: c.surface, ...card }]} onPress={() => router.push('/cycles')}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: c.textMuted }}>Seasonal & lunar</Text>
                  <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, color: c.text, marginTop: 4 }}>{seasonalPreview.title}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 19, color: c.textMuted, marginTop: 6 }} numberOfLines={3}>{seasonalPreview.body}</Text>
                  <View style={{ alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: c.surfaceAlt }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: c.textMuted }}>Draft · awaiting review</Text>
                  </View>
                </Pressable>
              </Section>
            )}

            {chip === 'All' && COMING_SOON.length > 0 && (
              <Section title="Coming Soon" c={c} type={type} spacing={spacing}>
                {COMING_SOON.map(item => (
                  <View key={item.title} style={[styles.card, { backgroundColor: c.surface, ...card, marginBottom: 8 }]}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: c.text }}>{item.title}</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18, color: c.textMuted, marginTop: 3 }}>{item.desc}</Text>
                  </View>
                ))}
              </Section>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, count, children, c, type, spacing }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.md }}>
        <Text style={[type.h2, { color: c.text }]}>{title}</Text>
        {count && <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted }}>{count}</Text>}
      </View>
      {children}
    </View>
  );
}

function SeeAll({ label, onPress, c }) {
  return (
    <Pressable onPress={onPress} style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: c.accent }}>{label} →</Text>
    </Pressable>
  );
}

function HerbIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3s6 4 6 9a6 6 0 0 1-12 0c0-5 6-9 6-9z" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function BreathIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function MeditationIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.4} />
    <Path d="M12 7.5v4.8l3 1.7" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function HandIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.4} />
    <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function BookIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H19v14H6.5a2 2 0 0 0-2 2z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function ChevronIcon({ color }) {
  return <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  searchInput: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 13, fontFamily: 'Inter_400Regular', fontSize: 14.5 },
  chip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  rows: { borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  ico: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 18, padding: 16 },
});
