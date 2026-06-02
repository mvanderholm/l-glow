import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { recommendations, currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import { herbs, tasteColors } from '../data/content/herbs';
import { asanas } from '../data/content/movement';
import { useTheme } from '../context/ThemeContext';
import { routineAnchors, routines } from '../data/content/routines';
import { loadDoshaResult } from '../data/user/storage';

export default function Recommendations() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const params = useLocalSearchParams();
  const router = useRouter();
  const [dosha, setDosha] = useState(params.dosha || null);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [selectedAsana, setSelectedAsana] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!dosha) {
      loadDoshaResult().then(result => {
        if (result) {
          setDosha(result.dosha);
        } else {
          setRedirecting(true);
          setTimeout(() => router.replace('/quiz'), 1800);
        }
      });
    }
  }, []);

  if (redirecting) {
    return (
      <View style={styles.redirectContainer}>
        <Text style={type.label}>First things first</Text>
        <Text style={[type.h2, { marginTop: spacing.sm }]}>
          Let's find your constitution.
        </Text>
        <Text style={[type.muted, { marginTop: spacing.sm }]}>
          Taking you to the quiz…
        </Text>
      </View>
    );
  }

  if (!dosha) {
    return (
      <View style={styles.redirectContainer}>
        <Text style={type.muted}>Loading…</Text>
      </View>
    );
  }

  const rec = recommendations[dosha];
  const info = doshaInfo[dosha];
  const season = currentSeason();

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.label}>Tuned for</Text>
        <Text style={[type.display, { color: info.color, marginTop: spacing.xs }]}>{info.name}</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          {season.name} · this season tends to aggravate {season.aggravates}
        </Text>

        <Section title="Your Constitution" accent={info.color}>
          <Text style={type.body}>{info.constitution}</Text>
          <Text style={[type.body, { marginTop: spacing.sm }]}>{info.movementFocus}</Text>
        </Section>

        <Section title="Foods to Favor" accent={colors.sage}>
          {rec.foods.favor.map(f => <Bullet key={f}>{f}</Bullet>)}
        </Section>

        <Section title="Foods to Reduce" accent={colors.terracotta}>
          {rec.foods.avoid.map(f => <Bullet key={f}>{f}</Bullet>)}
        </Section>

        <Section title="Herbs & Spices" accent={colors.saffron}>
          <Text style={[type.muted, { fontSize: 12, marginBottom: spacing.sm }]}>
            Tap any herb for details
          </Text>
          <View style={styles.chipRow}>
            {rec.herbs.map(h => (
              <Pressable
                key={h}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => setSelectedHerb(herbs[h] ? { name: h, ...herbs[h] } : null)}
              >
                <Text style={styles.chipText}>{h}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Movement" accent={colors.terracotta}>
          <Text style={[type.muted, { fontSize: 12, marginBottom: spacing.sm }]}>
            Tap any pose for details
          </Text>
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
        </Section>

        <Section title="Today's Meditation" accent={colors.vata}>
          <Text style={type.body}>{rec.meditation}</Text>
        </Section>

        <Section title="Lifestyle Note" accent={colors.kapha}>
          <Text style={type.body}>{rec.lifestyle}</Text>
        </Section>

        <Section title="Daily Rhythms" accent={colors.accentAlt}>
          {routines[dosha].map(r => (
            <RoutineRow key={r.id} time={r.time} label={r.label} />
          ))}
          {routineAnchors.map(a => (
            <RoutineRow key={a.id} time={a.time} label={a.label} />
          ))}
        </Section>
      </ScrollView>

      <HerbModal herb={selectedHerb} onClose={() => setSelectedHerb(null)} />
      <AsanaModal asana={selectedAsana} onClose={() => setSelectedAsana(null)} />
    </SafeAreaView>
  );
}

function HerbModal({ herb, onClose }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  if (!herb) return null;

  return (
    <Modal
      visible={!!herb}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={type.label}>Herb & Spice</Text>
          <Text style={[type.h1, { marginTop: spacing.xs }]}>{herb.name}</Text>
          <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{herb.latin}</Text>

          <View style={styles.row}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Potency</Text>
              <View style={[styles.potencyBadge, herb.potency === 'cooling' ? styles.potencyCool : styles.potencyWarm]}>
                <Text style={styles.potencyText}>{herb.potency}</Text>
              </View>
            </View>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Balances</Text>
              <View style={styles.doshaPills}>
                {herb.balances.map(d => (
                  <View key={d} style={[styles.doshaPill, { backgroundColor: doshaInfo[d]?.color + '33' }]}>
                    <Text style={[styles.doshaPillText, { color: doshaInfo[d]?.color }]}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>

            {herb.aggravates?.length > 0 && (
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Use care with</Text>
                <View style={styles.doshaPills}>
                  {herb.aggravates.map(d => (
                    <View key={d} style={[styles.doshaPill, { backgroundColor: colors.surfaceAlt }]}>
                      <Text style={[styles.doshaPillText, { color: colors.textMuted }]}>{d}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.tasteRow}>
            <Text style={styles.metaLabel}>Taste  </Text>
            {herb.taste.map(t => (
              <View key={t} style={[styles.tastePill, { backgroundColor: tasteColors[t] + '33', borderColor: tasteColors[t] + '66' }]}>
                <Text style={[styles.tastePillText, { color: tasteColors[t] }]}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[type.body, { marginTop: spacing.lg, lineHeight: 26 }]}>{herb.summary}</Text>

          <View style={styles.useBlock}>
            <Text style={styles.metaLabel}>How to use</Text>
            <Text style={[type.body, { marginTop: spacing.xs, lineHeight: 24 }]}>{herb.use}</Text>
          </View>

          {herb.prabhav && (
            <View style={[styles.useBlock, { marginTop: spacing.md, borderLeftWidth: 2, borderLeftColor: colors.accent + '66' }]}>
              <Text style={styles.metaLabel}>Prabhav — Special Power</Text>
              <Text style={[type.muted, { marginTop: spacing.xs, lineHeight: 24, fontStyle: 'italic' }]}>{herb.prabhav}</Text>
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

function AsanaModal({ asana, onClose }) {
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

          <View style={styles.row}>
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

function RoutineRow({ time, label }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const isMorning = time === 'morning';
  return (
    <View style={styles.routineRow}>
      <View style={[styles.routineTimeBadge, isMorning ? styles.routineTimeMorning : styles.routineTimeEvening]}>
        <Text style={styles.routineTimeText}>{time}</Text>
      </View>
      <Text style={[type.body, { flex: 1 }]}>{label}</Text>
    </View>
  );
}

function Section({ title, accent, children }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  return (
    <View style={[styles.section, { borderLeftColor: accent }]}>
      <Text style={type.label}>{title}</Text>
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </View>
  );
}

function Bullet({ children }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>·</Text>
      <Text style={[type.body, { flex: 1 }]}>{children}</Text>
    </View>
  );
}

function makeStyles(colors, spacing, radius) {
return StyleSheet.create({
  container: { padding: spacing.lg },
  redirectContainer: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  section: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderLeftWidth: 3,
  },
  bulletRow: { flexDirection: 'row', marginTop: spacing.xs },
  bulletDot: { color: colors.saffron, fontSize: 20, marginRight: spacing.sm, lineHeight: 22 },
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginTop: spacing.lg },
  metaBlock: { gap: spacing.xs },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  potencyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  potencyWarm: { backgroundColor: colors.saffron + '33' },
  potencyCool: { backgroundColor: colors.kapha + '33' },
  potencyText: { color: colors.text, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  doshaPills: { flexDirection: 'row', gap: spacing.xs },
  doshaPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  doshaPillText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  tasteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  tastePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tastePillText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  useBlock: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
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
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  routineTimeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    minWidth: 68,
    alignItems: 'center',
  },
  routineTimeMorning: { backgroundColor: colors.saffron + '33' },
  routineTimeEvening: { backgroundColor: colors.vata + '33' },
  routineTimeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
}
