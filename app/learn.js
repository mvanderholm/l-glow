import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { concepts, tierLabels } from '../data/content/learn';
import { useTheme } from '../context/ThemeContext';

export default function Learn() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const [selected, setSelected] = useState(null);
  const styles = makeStyles(colors, spacing, radius);

  const tiers = [1, 2, 3];
  const tierAccents = {
    1: colors.accentAlt,
    2: colors.olive,
    3: colors.honeyAmber,
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.label}>The Tradition</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Learn</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          Classical ayurvedic concepts, explored in depth. New entries added as they're recorded.
        </Text>

        {tiers.map(tier => {
          const group = concepts.filter(c => c.tier === tier);
          return (
            <View key={tier} style={styles.tierBlock}>
              <Text style={styles.tierLabel}>{tierLabels[tier]}</Text>
              {group.map(concept => (
                <Pressable
                  key={concept.id}
                  style={({ pressed }) => [styles.row, { borderLeftColor: tierAccents[tier] }, pressed && styles.rowPressed]}
                  onPress={() => setSelected(concept)}
                >
                  <View style={styles.rowMain}>
                    <Text style={type.body}>{concept.title}</Text>
                    <Text style={[type.muted, { fontSize: 12, fontStyle: 'italic', marginTop: 2 }]}>
                      {concept.sanskrit}
                    </Text>
                    <Text style={[type.muted, { marginTop: spacing.xs, fontSize: 14 }]}>
                      {concept.teaser}
                    </Text>
                  </View>
                  <View style={[styles.statusDot, concept.body ? styles.dotReady : styles.dotPending]} />
                </Pressable>
              ))}
            </View>
          );
        })}

        <Text style={styles.footer}>
          · ready to read &nbsp;&nbsp; ○ coming soon
        </Text>
      </ScrollView>

      <ConceptModal concept={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

function ConceptModal({ concept, onClose }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  if (!concept) return null;

  return (
    <Modal
      visible={!!concept}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={type.label}>{tierLabels[concept.tier]}</Text>
          <Text style={[type.h1, { marginTop: spacing.xs }]}>{concept.title}</Text>
          <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{concept.sanskrit}</Text>

          <View style={styles.bodyBlock}>
            {concept.body ? (
              <>
                <Text style={[type.body, { lineHeight: 26 }]}>{concept.body}</Text>
                {concept.attributedDate && (
                  <Text style={styles.attribution}>Taught by Thea · {concept.attributedDate}</Text>
                )}
              </>
            ) : (
              <View style={styles.pendingBlock}>
                <Text style={[type.muted, { textAlign: 'center' }]}>
                  This one's still being recorded.
                </Text>
                <Text style={[type.muted, { textAlign: 'center', fontSize: 12, marginTop: spacing.xs }]}>
                  Check back soon.
                </Text>
              </View>
            )}
          </View>

          {concept.body && concept.matrix && (
            <MatrixSection
              matrix={concept.matrix}
              colors={colors}
              spacing={spacing}
              radius={radius}
              type={type}
            />
          )}
        </ScrollView>

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function hasAnyMatrixContent(matrix) {
  if (!matrix) return false;
  return Object.values(matrix).some(
    dim => dim && Object.values(dim).some(cell => !!cell)
  );
}

function MatrixSection({ matrix, colors, spacing, radius, type }) {
  const DIMS = [
    { key: 'physical',  label: 'Physical' },
    { key: 'mental',    label: 'Mental' },
    { key: 'emotional', label: 'Emotional' },
    { key: 'spiritual', label: 'Spiritual' },
  ];
  const ROWS = [
    { key: 'lifestyle', label: 'Lifestyle' },
    { key: 'diet',      label: 'Diet' },
    { key: 'exercises', label: 'Exercises' },
    { key: 'herbs',     label: 'Herbs' },
  ];
  const [activeDim, setActiveDim] = useState('physical');
  const dimData = matrix[activeDim] || {};

  // If no cells have content yet, show a teaser instead of four identical empty tabs
  if (!hasAnyMatrixContent(matrix)) {
    return (
      <View style={{ marginTop: spacing.xl }}>
        <Text style={type.label}>How it applies</Text>
        <View style={{
          marginTop: spacing.md,
          padding: spacing.lg,
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          gap: spacing.xs,
        }}>
          <Text style={[type.muted, { textAlign: 'center' }]}>
            Physical · Mental · Emotional · Spiritual
          </Text>
          <Text style={[type.muted, { textAlign: 'center', fontSize: 12 }]}>
            The practice matrix for this concept is still being built out.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={type.label}>How it applies</Text>
      <Text style={[type.muted, { fontSize: 12, marginTop: 4, marginBottom: spacing.md }]}>
        Select a dimension to see how this concept shows up.
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
        {DIMS.map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setActiveDim(key)}
            style={{
              flex: 1,
              paddingVertical: 6,
              borderRadius: radius.pill,
              backgroundColor: activeDim === key ? colors.sage : colors.surfaceAlt,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: activeDim === key ? colors.sage : colors.border,
            }}
          >
            <Text style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: activeDim === key ? colors.bg : colors.textMuted,
            }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: spacing.md }}>
        {ROWS.map(({ key, label }) => (
          <View
            key={key}
            style={{
              marginBottom: spacing.sm,
              padding: spacing.md,
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: colors.textMuted,
              marginBottom: 4,
            }}>
              {label}
            </Text>
            <Text style={[type.muted, { lineHeight: 20, fontSize: 14 }]}>
              {dimData[key] || 'Coming soon.'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function makeStyles(colors, spacing, radius) {
return StyleSheet.create({
  container: { padding: spacing.lg },
  tierBlock: { marginTop: spacing.xl },
  tierLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentAlt,
  },
  rowPressed: { opacity: 0.6 },
  rowMain: { flex: 1 },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: spacing.md,
  },
  dotReady: { backgroundColor: colors.sage },
  dotPending: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  footer: {
    marginTop: spacing.xl,
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },

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
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  bodyBlock: { marginTop: spacing.xl },
  pendingBlock: {
    padding: spacing.xl,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  attribution: {
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  closeBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeBtnText: { color: colors.text, fontWeight: '600', fontSize: 16 },
});
}
