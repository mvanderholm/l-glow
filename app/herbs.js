import { View, Text, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { herbFoodDatabase, HERB_FOOD_TYPES } from '../data/content/herbFoodDatabase';
import { DOSHA_COLORS } from '../components/DoshaWheel';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Svg, { Path } from 'react-native-svg';

const ENERGY_COLOR = { heating: '#C97855', cooling: '#4A8FA8' };
const DOSHAS = ['vata', 'pitta', 'kapha'];

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function searchableText(h) {
  return [h.name, h.latinName, ...h.types, ...h.taste, ...h.actions, ...h.medicineWhen, ...h.poisonWhen, h.lglowTranslation]
    .filter(Boolean).join(' ').toLowerCase();
}

export default function Herbs() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { herb } = useLocalSearchParams();
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('all');

  // Deep link from global search — see data/searchIndex.js
  useEffect(() => {
    if (herb) {
      const found = herbFoodDatabase.find(h => h.name === herb);
      if (found) setSelected(found);
    }
  }, [herb]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return herbFoodDatabase.filter(h => {
      if (activeType !== 'all' && !h.types.includes(activeType)) return false;
      if (q && !searchableText(h).includes(q)) return false;
      return true;
    });
  }, [query, activeType]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <Header title="Herbs" left="menu" right="search" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[type.muted, { marginBottom: spacing.md, fontStyle: 'italic', lineHeight: 18 }]}>
          For education and wellness support only — not diagnosis or dosing instructions. Nothing here is for everybody; it's for somebody.
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or what you're feeling — bloating, low energy…"
          placeholderTextColor={c.textMuted}
          style={{
            backgroundColor: c.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: c.border,
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
            fontSize: 15,
            color: c.text,
            fontFamily: 'Inter_400Regular',
            marginBottom: spacing.sm,
          }}
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }} contentContainerStyle={{ gap: 8 }}>
          {['all', ...HERB_FOOD_TYPES].map(t => {
            const active = activeType === t;
            return (
              <Pressable
                key={t}
                onPress={() => setActiveType(t)}
                style={{
                  paddingHorizontal: 13, paddingVertical: 6, borderRadius: radius.pill,
                  borderWidth: 1, borderColor: active ? c.accent : c.border,
                  backgroundColor: active ? c.accent : c.surface,
                }}
              >
                <Text style={{ fontSize: 12.5, fontFamily: 'Inter_600SemiBold', color: active ? '#FBF9F4' : c.textMuted, textTransform: 'capitalize' }}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[type.muted, { marginBottom: spacing.sm, fontSize: 12.5 }]}>
          {list.length} {list.length === 1 ? 'entry' : 'entries'}
        </Text>

        {list.length === 0 && (
          <Text style={[type.muted, { textAlign: 'center', marginTop: spacing.xl }]}>
            Nothing found for "{query}"
          </Text>
        )}

        {list.map(h => {
          const energyColor = ENERGY_COLOR[h.energy] || c.accentAlt;
          return (
            <Pressable
              key={h.name}
              style={({ pressed }) => [{
                marginBottom: spacing.sm,
                padding: spacing.md,
                backgroundColor: c.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: c.border,
                borderLeftWidth: 3,
                borderLeftColor: energyColor,
                opacity: pressed ? 0.7 : 1,
              }]}
              onPress={() => setSelected(h)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={type.body}>{h.name}</Text>
                  {h.latinName && <Text style={[type.muted, { fontSize: 12, fontStyle: 'italic', marginTop: 2 }]}>{h.latinName}</Text>}
                </View>
                {h.energy && (
                  <View style={{
                    backgroundColor: energyColor + '22', paddingHorizontal: spacing.sm, paddingVertical: 3,
                    borderRadius: radius.pill, borderWidth: 1, borderColor: energyColor + '66',
                  }}>
                    <Text style={{ fontSize: 11, color: energyColor, fontWeight: '600' }}>{h.energy}</Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm, flexWrap: 'wrap' }}>
                {h.doshaImpact
                  ? DOSHAS.filter(d => h.doshaImpact[d] !== 0).map(d => (
                      <View key={d} style={{
                        paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill,
                        backgroundColor: DOSHA_COLORS[d] + '33', borderWidth: 1, borderColor: DOSHA_COLORS[d] + '66',
                      }}>
                        <Text style={{ fontSize: 11, color: DOSHA_COLORS[d], textTransform: 'capitalize' }}>
                          {d} {h.doshaImpact[d] < 0 ? '↓' : '↑'}
                        </Text>
                      </View>
                    ))
                  : h.doshaRaw ? (
                      <View style={{ paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, borderWidth: 1, borderColor: c.border }}>
                        <Text style={{ fontSize: 11, color: c.textMuted }}>{h.doshaRaw}</Text>
                      </View>
                    ) : null}
                {h.needsGuidance && (
                  <View style={{ paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: (c.terracotta || '#C97855') + '22', borderWidth: 1, borderColor: (c.terracotta || '#C97855') + '55' }}>
                    <Text style={{ fontSize: 11, color: c.terracotta || '#C97855' }}>Practitioner guidance</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {selected && <HerbModal herb={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

function HerbModal({ herb: h, onClose }) {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const energyColor = ENERGY_COLOR[h.energy] || c.accentAlt;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={onClose} />
      <View style={{
        backgroundColor: c.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        maxHeight: '85%',
      }}>
        <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.lg }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Snapshot */}
          <Text style={type.label}>
            {[h.energy, h.vipaka && `${h.vipaka} vipaka`, ...h.taste].filter(Boolean).join(' · ')}
          </Text>
          <Text style={[type.h1, { marginTop: spacing.xs }]}>{h.name}</Text>
          {h.latinName && <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{h.latinName}</Text>}

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}>
            {h.doshaImpact
              ? DOSHAS.map(d => {
                  const v = h.doshaImpact[d];
                  const label = v < 0 ? `Balances ${d}` : v > 0 ? `Increases ${d}` : `Neutral to ${d}`;
                  return (
                    <View key={d} style={{
                      paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill,
                      backgroundColor: DOSHA_COLORS[d] + '2A', borderWidth: 1, borderColor: DOSHA_COLORS[d] + '66',
                    }}>
                      <Text style={{ color: DOSHA_COLORS[d], textTransform: 'capitalize', fontWeight: '600' }}>{label}</Text>
                    </View>
                  );
                })
              : h.doshaRaw && (
                  <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, borderWidth: 1, borderColor: c.border }}>
                    <Text style={{ color: c.textMuted }}>{h.doshaRaw}</Text>
                  </View>
                )}
          </View>

          {h.needsGuidance && (
            <View style={{ marginTop: spacing.sm, alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: (c.terracotta || '#C97855') + '1A', borderWidth: 1, borderColor: (c.terracotta || '#C97855') + '55' }}>
              <Text style={{ color: c.terracotta || '#C97855', fontWeight: '600', fontSize: 13 }}>Worth checking with a practitioner first</Text>
            </View>
          )}

          {h.medicineWhen?.length > 0 && (
            <View style={{ marginTop: spacing.xl }}>
              <Text style={type.label}>Medicine when</Text>
              <Text style={[type.body, { lineHeight: 24, marginTop: spacing.xs }]}>{h.medicineWhen.join(', ')}</Text>
            </View>
          )}

          {h.poisonWhen?.length > 0 && (
            <View style={{ marginTop: spacing.lg }}>
              <Text style={type.label}>Poison when</Text>
              <Text style={[type.body, { lineHeight: 24, marginTop: spacing.xs }]}>{h.poisonWhen.join(', ')}</Text>
            </View>
          )}

          {h.actions?.length > 0 && (
            <View style={{ marginTop: spacing.lg }}>
              <Text style={type.label}>Actions</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.xs }}>
                {h.actions.map(a => (
                  <View key={a} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, borderWidth: 1, borderColor: c.border }}>
                    <Text style={{ fontSize: 12, color: c.textMedium }}>{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {h.lglowTranslation && (
            <View style={{
              marginTop: spacing.xl, padding: spacing.md, backgroundColor: c.surfaceAlt, borderRadius: radius.md,
              borderWidth: 1, borderColor: c.border, borderLeftWidth: 3, borderLeftColor: c.honeyAmber,
            }}>
              <Text style={[type.label, { color: c.honeyAmber }]}>L. Glôw tip</Text>
              <Text style={[type.muted, { marginTop: spacing.sm, lineHeight: 22, color: c.text }]}>{h.lglowTranslation}</Text>
            </View>
          )}
        </ScrollView>

        <Pressable
          style={{ marginTop: spacing.lg, backgroundColor: c.surfaceAlt, paddingVertical: spacing.md, borderRadius: radius.pill, alignItems: 'center', borderWidth: 1, borderColor: c.border }}
          onPress={onClose}
        >
          <Text style={{ color: c.text, fontWeight: '600', fontSize: 16 }}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

