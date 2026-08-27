import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { recommendations, currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import { herbFoodDatabase } from '../data/content/herbFoodDatabase';
import { asanas } from '../data/content/movement';

// Extracted from app/recommendations.js (nav restructure, Move 1), collapsed
// to 4 rows (Nourishment/Herbs/Movement/Lifestyle) — Agni and Daily Rhythms
// moved off Today entirely (Agni lives on /assessments; see the
// nav-restructure plan's Aug 26 2026 revision, matching the mockup Matt
// shared). Nourishment starts expanded, the other three start collapsed
// with a one-line preview under the label; the season tag doubles as the
// entry point back to /result ("your blueprint").

// Deterministic daily pick — stable on refresh, rotates each day. Same
// helper duplicated in a few places across this app; a 3-line pure function
// isn't worth sharing as its own module.
function dailyPick(arr) {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return arr[dayIndex % arr.length];
}

// data/content/recommendations.js's per-dosha herb lists (Thea's authored
// content, untouched here) predate the 256-entry database (#36) and use
// slightly different names for the same herb in a few spots — checked
// directly against the real data, not assumed, July 2026.
const HERB_NAME_ALIASES = {
  Ajwain: 'Ajwan',
  Sesame: 'Sesame Seeds',
  Guggulu: 'Guggul',
  Mint: 'Mint / Peppermint',
  Rose: 'Rose Flowers / Petals',
  Tulsi: 'Basil / Tulsi',
};

function findHerb(name) {
  const resolved = HERB_NAME_ALIASES[name] || name;
  return herbFoodDatabase.find(h => h.name === resolved) || null;
}

export default function TodaysGuidance({ dosha, onBlueprintPress }) {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const styles = makeStyles(c, spacing, radius);
  const [expanded, setExpanded] = useState('nourishment');
  const [reduceOpen, setReduceOpen] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [selectedAsana, setSelectedAsana] = useState(null);

  const rec = recommendations[dosha];
  if (!rec) return null;
  const season = currentSeason();

  function toggle(key) {
    setExpanded(prev => (prev === key ? null : key));
  }

  return (
    <View style={styles.wrap}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <Text style={[type.h2, { color: c.text }]}>Today's Guidance</Text>
        <Pressable onPress={onBlueprintPress} hitSlop={8}>
          <Text style={[type.label, { color: c.accent }]}>{season.name.toUpperCase()}</Text>
        </Pressable>
      </View>

      <Row
        title="Nourishment"
        preview={dailyPick(rec.foods.favor)}
        open={expanded === 'nourishment'}
        onPress={() => toggle('nourishment')}
        styles={styles}
        type={type}
      >
        <Text style={[type.label, { color: c.sage }]}>Foods to Favor</Text>
        <View style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
          {rec.foods.favor.map(f => <Bullet key={f} dotColor={c.saffron} type={type}>{f}</Bullet>)}
        </View>
        <Pressable onPress={() => setReduceOpen(v => !v)}>
          <Text style={[type.label, { color: c.terracotta }]}>{reduceOpen ? 'Foods to Reduce' : 'Foods to Reduce ›'}</Text>
        </Pressable>
        {reduceOpen && (
          <View style={{ marginTop: spacing.xs }}>
            {rec.foods.avoid.map(f => <Bullet key={f} dotColor={c.saffron} type={type}>{f}</Bullet>)}
          </View>
        )}
      </Row>

      <Row
        title="Herbs"
        preview={dailyPick(rec.herbs)}
        open={expanded === 'herbs'}
        onPress={() => toggle('herbs')}
        styles={styles}
        type={type}
      >
        <Text style={[type.muted, { fontSize: 12, marginBottom: spacing.sm }]}>Tap any herb for details</Text>
        <View style={styles.chipRow}>
          {rec.herbs.map(h => {
            const found = findHerb(h);
            if (!found) {
              return (
                <View key={h} style={[styles.chip, { opacity: 0.5 }]}>
                  <Text style={styles.chipText}>{h}</Text>
                </View>
              );
            }
            return (
              <Pressable
                key={h}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => setSelectedHerb(found)}
              >
                <Text style={styles.chipText}>{h}</Text>
              </Pressable>
            );
          })}
        </View>
      </Row>

      <Row
        title="Movement"
        preview={dailyPick(asanas[dosha]).name}
        open={expanded === 'movement'}
        onPress={() => toggle('movement')}
        styles={styles}
        type={type}
      >
        <Text style={[type.muted, { fontSize: 12, marginBottom: spacing.sm }]}>Tap any pose for details</Text>
        <View style={styles.chipRow}>
          {asanas[dosha].map(a => (
            <Pressable
              key={a.name}
              style={({ pressed }) => [styles.chip, styles.chipAsana, pressed && styles.chipPressed]}
              onPress={() => setSelectedAsana(a)}
            >
              <Text style={styles.chipAsanaText}>{a.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[type.label, { color: c.vata, marginTop: spacing.md }]}>Today's Meditation</Text>
        <Text style={[type.body, { color: c.text, marginTop: spacing.xs }]}>{rec.meditation}</Text>
      </Row>

      <Row
        title="Lifestyle"
        preview={rec.lifestyle.split('. ')[0].replace(/\.$/, '')}
        open={expanded === 'lifestyle'}
        onPress={() => toggle('lifestyle')}
        styles={styles}
        type={type}
        last
      >
        {rec.lifestyle.split('. ').filter(s => s.trim()).map((sentence, i) => (
          <Bullet key={i} dotColor={c.saffron} type={type}>{sentence.replace(/\.$/, '')}</Bullet>
        ))}
      </Row>

      <RecommendationHerbModal herb={selectedHerb} onClose={() => setSelectedHerb(null)} />
      <RecommendationAsanaModal asana={selectedAsana} onClose={() => setSelectedAsana(null)} />
    </View>
  );
}

function Row({ title, preview, open, onPress, children, styles, type, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Pressable style={styles.rowHeader} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={[type.label, styles.rowTitle]}>{title}</Text>
          {!open && preview && <Text style={[type.body, styles.rowPreview]} numberOfLines={1}>{preview}</Text>}
        </View>
        <Text style={styles.rowChevron}>{open ? '︿' : '﹀'}</Text>
      </Pressable>
      {open && <View style={styles.rowBody}>{children}</View>}
    </View>
  );
}

function Bullet({ children, dotColor, type }) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
      <Text style={{ color: dotColor, fontSize: 20, marginRight: 8, lineHeight: 22 }}>·</Text>
      <Text style={[type.body, { flex: 1 }]}>{children}</Text>
    </View>
  );
}

function RecommendationHerbModal({ herb, onClose }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  if (!herb) return null;

  return (
    <Modal visible={!!herb} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={type.label}>Herb & Spice</Text>
          <Text style={[type.h1, { marginTop: spacing.xs }]}>{herb.name}</Text>
          {herb.latinName && <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{herb.latinName}</Text>}

          <View style={styles.row2}>
            {herb.energy && (
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Energy</Text>
                <View style={[styles.potencyBadge, herb.energy === 'cooling' ? styles.potencyCool : styles.potencyWarm]}>
                  <Text style={styles.potencyText}>{herb.energy}</Text>
                </View>
              </View>
            )}
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Dosha effect</Text>
              <View style={styles.doshaPills}>
                {herb.doshaImpact
                  ? ['vata', 'pitta', 'kapha'].filter(d => herb.doshaImpact[d] !== 0).map(d => (
                      <View key={d} style={[styles.doshaPill, { backgroundColor: doshaInfo[d]?.color + '33' }]}>
                        <Text style={[styles.doshaPillText, { color: doshaInfo[d]?.color }]}>{d} {herb.doshaImpact[d] < 0 ? '↓' : '↑'}</Text>
                      </View>
                    ))
                  : herb.doshaRaw ? (
                      <View style={[styles.doshaPill, { backgroundColor: colors.surfaceAlt }]}>
                        <Text style={[styles.doshaPillText, { color: colors.textMuted }]}>{herb.doshaRaw}</Text>
                      </View>
                    ) : null}
              </View>
            </View>
          </View>

          {herb.taste?.length > 0 && (
            <View style={styles.tasteRow}>
              <Text style={styles.metaLabel}>Taste  </Text>
              <Text style={[type.muted, { textTransform: 'capitalize' }]}>{herb.taste.join(', ')}</Text>
            </View>
          )}

          {herb.needsGuidance && (
            <View style={{ marginTop: spacing.sm, alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: (colors.terracotta || '#C97855') + '1A', borderWidth: 1, borderColor: (colors.terracotta || '#C97855') + '55' }}>
              <Text style={{ color: colors.terracotta || '#C97855', fontWeight: '600', fontSize: 13 }}>Worth checking with a practitioner first</Text>
            </View>
          )}

          {herb.medicineWhen?.length > 0 && (
            <View style={styles.useBlock}>
              <Text style={styles.metaLabel}>Medicine when</Text>
              <Text style={[type.body, { marginTop: spacing.xs, lineHeight: 24 }]}>{herb.medicineWhen.join(', ')}</Text>
            </View>
          )}

          {herb.poisonWhen?.length > 0 && (
            <View style={[styles.useBlock, { marginTop: spacing.md }]}>
              <Text style={styles.metaLabel}>Poison when</Text>
              <Text style={[type.body, { marginTop: spacing.xs, lineHeight: 24 }]}>{herb.poisonWhen.join(', ')}</Text>
            </View>
          )}

          {herb.actions?.length > 0 && (
            <View style={[styles.useBlock, { marginTop: spacing.md }]}>
              <Text style={styles.metaLabel}>Actions</Text>
              <Text style={[type.body, { marginTop: spacing.xs, lineHeight: 24, textTransform: 'capitalize' }]}>{herb.actions.join(', ')}</Text>
            </View>
          )}

          {herb.lglowTranslation && (
            <View style={[styles.useBlock, { marginTop: spacing.md, borderLeftWidth: 2, borderLeftColor: colors.honeyAmber + '66' }]}>
              <Text style={[styles.metaLabel, { color: colors.honeyAmber }]}>L. Glôw tip</Text>
              <Text style={[type.muted, { marginTop: spacing.xs, lineHeight: 24, color: colors.text }]}>{herb.lglowTranslation}</Text>
            </View>
          )}
        </ScrollView>

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function RecommendationAsanaModal({ asana, onClose }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  if (!asana) return null;
  return (
    <Modal visible={!!asana} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={type.label}>Movement</Text>
          <Text style={[type.h1, { marginTop: spacing.xs }]}>{asana.name}</Text>
          <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{asana.sanskrit}</Text>

          <View style={styles.row2}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Duration</Text>
              <View style={[styles.potencyBadge, styles.potencyWarm]}>
                <Text style={styles.potencyText}>{asana.duration}</Text>
              </View>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>When</Text>
              <View style={[styles.potencyBadge, styles.potencyCool]}>
                <Text style={styles.potencyText}>{asana.timing}</Text>
              </View>
            </View>
          </View>

          <View style={styles.useBlock}>
            <Text style={styles.metaLabel}>How to do it</Text>
            <Text style={[type.body, { marginTop: spacing.xs, lineHeight: 24 }]}>{asana.description}</Text>
          </View>

          <View style={[styles.useBlock, { marginTop: spacing.md }]}>
            <Text style={styles.metaLabel}>Why this for you</Text>
            <Text style={[type.body, { marginTop: spacing.xs, lineHeight: 24 }]}>{asana.benefit}</Text>
          </View>
        </ScrollView>

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function makeStyles(colors, spacing, radius) {
  return StyleSheet.create({
    wrap: { marginTop: spacing.xl },
    row: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    rowTitle: { color: colors.text },
    rowPreview: { color: colors.textMedium, marginTop: 2 },
    rowChevron: { color: colors.textMuted, fontSize: 13 },
    rowBody: { paddingBottom: spacing.lg },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      backgroundColor: colors.surfaceAlt,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.saffron + '66',
    },
    chipPressed: { opacity: 0.6 },
    chipText: { color: colors.saffron, fontSize: 14 },
    chipAsana: { borderColor: colors.terracotta + '66' },
    chipAsanaText: { color: colors.terracotta, fontSize: 14 },

    // modal
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      maxHeight: '80%',
    },
    sheetHandle: {
      width: 40, height: 4, backgroundColor: colors.border,
      borderRadius: 2, alignSelf: 'center', marginBottom: spacing.lg,
    },
    row2: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginTop: spacing.lg },
    metaBlock: { gap: spacing.xs },
    metaLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    potencyBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
    potencyWarm: { backgroundColor: colors.saffron + '33' },
    potencyCool: { backgroundColor: colors.kapha + '33' },
    potencyText: { color: colors.text, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
    doshaPills: { flexDirection: 'row', gap: spacing.xs },
    doshaPill: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
    doshaPillText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
    tasteRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg },
    useBlock: { marginTop: spacing.lg, padding: spacing.lg, backgroundColor: colors.surfaceAlt, borderRadius: radius.lg },
    closeBtn: {
      marginTop: spacing.lg, backgroundColor: colors.surfaceAlt, paddingVertical: spacing.md,
      borderRadius: radius.pill, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    },
    closeBtnText: { color: colors.text, fontWeight: '600', fontSize: 16 },
  });
}
