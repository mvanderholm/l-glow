import { View, Text, Pressable, ScrollView, Modal, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { herbs } from '../data/content/herbs';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { useViewMode } from '../context/ViewModeContext';
import Svg, { Path } from 'react-native-svg';

const DOSHA_COLORS = { vata: '#8B6A7A', pitta: '#E8A030', kapha: '#4A8FA8' };
const POTENCY_COLOR = { warming: '#C97855', cooling: '#4A8FA8', neutral: '#7C7357' };

export default function Herbs() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { open: openDrawer } = useDrawer();
  const { isWebMode } = useViewMode();
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const herbList = Object.entries(herbs).filter(([name, herb]) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return name.toLowerCase().includes(q) || (herb.latin || '').toLowerCase().includes(q);
  });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[herbStyles.header, { paddingHorizontal: 20 }]}>
        {isWebMode ? <View style={herbStyles.hBtn} /> : <Pressable style={herbStyles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>}
        <Text style={[herbStyles.hTitle, { color: c.text }]}>Herbs</Text>
        <View style={herbStyles.hBtn} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[type.muted, { marginBottom: spacing.md, fontStyle: 'italic' }]}>
          Properties and uses. Content pending Thea's review.
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search herbs…"
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
            marginBottom: spacing.lg,
          }}
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />

        {herbList.length === 0 && (
          <Text style={[type.muted, { textAlign: 'center', marginTop: spacing.xl }]}>
            No herbs found for "{query}"
          </Text>
        )}

        {herbList.map(([name, herb]) => {
          const potencyColor = POTENCY_COLOR[herb.potency] || c.accentAlt;
          return (
            <Pressable
              key={name}
              style={({ pressed }) => [{
                marginBottom: spacing.sm,
                padding: spacing.md,
                backgroundColor: c.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: c.border,
                borderLeftWidth: 3,
                borderLeftColor: potencyColor,
                opacity: pressed ? 0.7 : 1,
              }]}
              onPress={() => setSelected({ name, ...herb })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={type.body}>{name}</Text>
                  <Text style={[type.muted, { fontSize: 12, fontStyle: 'italic', marginTop: 2 }]}>{herb.latin}</Text>
                </View>
                <View style={{
                  backgroundColor: potencyColor + '22',
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 3,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: potencyColor + '66',
                }}>
                  <Text style={{ fontSize: 11, color: potencyColor, fontWeight: '600' }}>{herb.potency}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm, flexWrap: 'wrap' }}>
                {(herb.balances || []).map(d => (
                  <View key={'b-' + d} style={{
                    paddingHorizontal: spacing.sm, paddingVertical: 2,
                    borderRadius: radius.pill,
                    backgroundColor: DOSHA_COLORS[d] + '22',
                    borderWidth: 1, borderColor: DOSHA_COLORS[d] + '55',
                  }}>
                    <Text style={{ fontSize: 11, color: DOSHA_COLORS[d], textTransform: 'capitalize' }}>{d} ↓</Text>
                  </View>
                ))}
                {(herb.aggravates || []).map(d => (
                  <View key={'a-' + d} style={{
                    paddingHorizontal: spacing.sm, paddingVertical: 2,
                    borderRadius: radius.pill,
                    backgroundColor: c.surfaceAlt,
                    borderWidth: 1, borderColor: c.border,
                  }}>
                    <Text style={{ fontSize: 11, color: c.textMuted, textTransform: 'capitalize' }}>{d} ↑</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {selected && <HerbModal herb={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

function HerbModal({ herb, onClose }) {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const potencyColor = POTENCY_COLOR[herb.potency] || c.accentAlt;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={onClose} />
      <View style={{
        backgroundColor: c.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        maxHeight: '80%',
      }}>
        <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.lg }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={type.label}>{herb.potency} · {(herb.taste || []).join(', ')}</Text>
          <Text style={[type.h1, { marginTop: spacing.xs }]}>{herb.name}</Text>
          <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{herb.latin}</Text>

          <Text style={[type.body, { lineHeight: 26, marginTop: spacing.xl }]}>{herb.summary}</Text>

          <View style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            backgroundColor: c.surfaceAlt,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: c.border,
          }}>
            <Text style={type.label}>How to use</Text>
            <Text style={[type.muted, { marginTop: spacing.sm, lineHeight: 22 }]}>{herb.use}</Text>
          </View>

          {herb.prabhav && (
            <View style={{
              marginTop: spacing.md,
              padding: spacing.md,
              backgroundColor: c.surfaceAlt,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: c.border,
              borderLeftWidth: 3,
              borderLeftColor: c.honeyAmber,
            }}>
              <Text style={[type.label, { color: c.honeyAmber }]}>Special action</Text>
              <Text style={[type.muted, { marginTop: spacing.sm, lineHeight: 22 }]}>{herb.prabhav}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' }}>
            {(herb.balances || []).map(d => (
              <View key={'b-' + d} style={{
                paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
                borderRadius: radius.pill,
                backgroundColor: DOSHA_COLORS[d] + '22',
                borderWidth: 1, borderColor: DOSHA_COLORS[d] + '55',
              }}>
                <Text style={{ color: DOSHA_COLORS[d], textTransform: 'capitalize', fontWeight: '600' }}>Balances {d}</Text>
              </View>
            ))}
            {(herb.aggravates || []).map(d => (
              <View key={'a-' + d} style={{
                paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
                borderRadius: radius.pill,
                backgroundColor: c.surfaceAlt,
                borderWidth: 1, borderColor: c.border,
              }}>
                <Text style={{ color: c.textMuted, textTransform: 'capitalize' }}>Aggravates {d}</Text>
              </View>
            ))}
          </View>
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

function MenuIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

const herbStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:   { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },
});
