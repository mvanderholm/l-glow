import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { recommendations, currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import { herbFoodDatabase } from '../data/content/herbFoodDatabase';
import { asanas } from '../data/content/movement';
import { agniResults } from '../data/content/agniQuiz';
import { useTheme } from '../context/ThemeContext';
import { routineAnchors, routines } from '../data/content/routines';
import { loadRoutines, refreshRoutines } from '../data/content/remote';
import { loadDoshaResult, loadAgniResult, loadTodayRoutineDeclines, declineRoutineItem, loadTodayIntention } from '../data/user/storage';
import { useAuth } from '../context/AuthContext';
import BackButton, { smartBack } from '../components/BackButton';
import SearchButton from '../components/SearchButton';

// data/content/recommendations.js's per-dosha herb lists (Thea's authored
// content, untouched here) predate the 256-entry database (#36) and use
// slightly different names for the same herb in a few spots — checked
// directly against the real data, not assumed, July 2026. Two of the 21
// referenced herbs genuinely aren't single entries in the new database at
// all (not a naming issue): Brahmi/Bacopa was never captured, and Trikatu
// is a 3-herb compound formula, not a single plant — those stay as plain
// labels with no tap-to-detail rather than fabricating a match or quietly
// dropping them from the dosha's herb list.
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

// Daily Rhythms — one pick per time-of-day category instead of showing
// every qualifying item at once (Aug 18 2026, Matt's ask). A category's
// pick is always the first qualifying item (universal anchors, then the
// client's dosha-specific ones, in their existing sort order) that isn't
// in that category's declined-today set — never stored separately, always
// derived, so declining just means "recompute with one more id excluded."
const ROUTINE_TIME_ORDER = ['morning', 'midday', 'evening', 'night'];

function buildDailyRhythmPicks(routinesData, dosha, declines) {
  const pool = [...(routinesData.anchors ?? []), ...((dosha && routinesData.routines[dosha]) ?? [])];
  return ROUTINE_TIME_ORDER
    .map(category => {
      const declinedIds = declines?.[category] ?? [];
      const item = pool.find(r => r.time === category && !declinedIds.includes(r.id));
      return item ? { category, item } : null;
    })
    .filter(Boolean);
}

export default function Recommendations() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [dosha, setDosha] = useState(params.dosha || null);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [selectedAsana, setSelectedAsana] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const [routinesData, setRoutinesData] = useState({ anchors: routineAnchors, routines });
  const [agniResult, setAgniResult] = useState(null); // null = loading, false = not taken
  const [declines, setDeclines] = useState(null); // null = loading, then { category: [itemId, ...] }
  const [intention, setIntention] = useState(null); // null = loading, then { text, suggestionId } | { text: '' }

  useEffect(() => {
    loadRoutines().then(setRoutinesData);
    refreshRoutines().then(() => loadRoutines()).then(setRoutinesData);
    loadTodayRoutineDeclines().then(setDeclines);
    loadAgniResult().then(r => setAgniResult(r || false));
    loadTodayIntention().then(v => setIntention(v ?? { text: '' }));
  }, []);

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

  function declineRhythm(category, itemId) {
    setDeclines(prev => ({ ...prev, [category]: [...(prev?.[category] ?? []), itemId] }));
    declineRoutineItem(category, itemId);
  }

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
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackButton onPress={() => smartBack('/')} color={colors.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />
          <SearchButton color={colors.textMuted} style={{ marginBottom: 8 }} />
        </View>

        <Text style={type.label}>Tuned for</Text>
        <Text style={[type.display, { color: info.color, marginTop: spacing.xs }]}>{info.name}</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          {season.name} · this season tends to aggravate {season.aggravates}
        </Text>

        {intention?.text ? (
          <Section title="Just For Today" accent={colors.accentAlt}>
            <Text style={type.body}>I will {intention.text}</Text>
          </Section>
        ) : null}

        <Section title="Your Constitution" accent={info.color}>
          <Text style={type.body}>{info.constitution}</Text>
          <Text style={[type.body, { marginTop: spacing.sm }]}>{info.movementFocus}</Text>
        </Section>

        {/* Agni — secondary signal alongside dosha, not a replacement for it.
            Reuses the existing (Thea-review-pending) Agni result content
            rather than inventing new copy. See roadmap #37 step 5. */}
        {agniResult && (() => {
          const agni = agniResults[agniResult.agniType] ?? agniResults.sama;
          return (
            <Section title="Your Agni" accent={agni.color}>
              <Text style={[type.body, { fontWeight: '600' }]}>{agni.name} · {agni.subtitle}</Text>
              {agni.practices?.diet?.length > 0 && (
                <View style={{ marginTop: spacing.sm }}>
                  {agni.practices.diet.slice(0, 3).map(tip => <Bullet key={tip}>{tip}</Bullet>)}
                </View>
              )}
              <Pressable
                style={{ marginTop: spacing.sm }}
                onPress={() => router.push({
                  pathname: '/agni-result',
                  params: {
                    dominant: agniResult.agniType,
                    sama:    agniResult.counts?.sama    ?? 0,
                    vishama: agniResult.counts?.vishama ?? 0,
                    tikshna: agniResult.counts?.tikshna ?? 0,
                    manda:   agniResult.counts?.manda   ?? 0,
                  },
                })}
              >
                <Text style={{ color: agni.color, fontWeight: '600', fontSize: 13 }}>See your full Agni picture →</Text>
              </Pressable>
            </Section>
          );
        })()}
        {agniResult === false && (
          <Pressable style={{ marginTop: spacing.lg }} onPress={() => router.push('/agni-quiz')}>
            <Text style={[type.muted, { textAlign: 'center', fontStyle: 'italic' }]}>
              Curious about your digestive fire too? Take the Agni check-in →
            </Text>
          </Pressable>
        )}

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
          {rec.lifestyle.split('. ').filter(s => s.trim()).map((sentence, i) => (
            <Bullet key={i}>{sentence.replace(/\.$/, '')}</Bullet>
          ))}
        </Section>

        <Section title="Daily Rhythms" accent={colors.accentAlt}>
          {(() => {
            const picks = buildDailyRhythmPicks(routinesData, dosha, declines);
            if (!picks.length) {
              return <Text style={type.muted}>That's everything for today — check back tomorrow.</Text>;
            }
            return picks.map(({ category, item }) => (
              <View key={category} style={styles.routineRhythmRow}>
                <View style={{ flex: 1 }}>
                  <RoutineRow time={item.time} label={item.label} />
                </View>
                <Pressable onPress={() => declineRhythm(category, item.id)} hitSlop={8}>
                  <Text style={[type.captionSm, { color: colors.textMuted }]}>Not today</Text>
                </Pressable>
              </View>
            ));
          })()}
        </Section>

        {/* Closing CTA — this screen used to just end after Daily Rhythms
            with no path onward. Aug 25 2026, Matt's ask. */}
        {!user && (
          <View style={styles.closingCard}>
            <Text style={type.label}>Don't lose this</Text>
            <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 24 }]}>
              Create a free account and today's guidance — plus everything else you've shared — is saved and waiting for you next time.
            </Text>
            <Pressable style={styles.closingPrimaryBtn} onPress={() => router.push('/signup')}>
              <Text style={styles.closingPrimaryBtnText}>Create account</Text>
            </Pressable>
            <Pressable style={styles.closingSecondaryBtn} onPress={() => router.push('/login')}>
              <Text style={[styles.closingSecondaryBtnText, { color: colors.textMuted }]}>Already have an account? Sign in</Text>
            </Pressable>
          </View>
        )}

        <Pressable style={styles.closingSecondaryBtn} onPress={() => router.push('/you')}>
          <Text style={[styles.closingSecondaryBtnText, { color: colors.accent }]}>See your profile & progress →</Text>
        </Pressable>
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
          {herb.latinName && <Text style={[type.muted, { fontStyle: 'italic', marginTop: 2 }]}>{herb.latinName}</Text>}

          <View style={styles.row}>
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

const ROUTINE_TIME_STYLE_KEYS = {
  morning: 'routineTimeMorning',
  midday:  'routineTimeMidday',
  evening: 'routineTimeEvening',
  night:   'routineTimeNight',
};

function RoutineRow({ time, label }) {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const timeStyle = styles[ROUTINE_TIME_STYLE_KEYS[time]] ?? styles.routineTimeMorning;
  return (
    <View style={styles.routineRow}>
      <View style={[styles.routineTimeBadge, timeStyle]}>
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
  closingCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closingPrimaryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  closingPrimaryBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  closingSecondaryBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  closingSecondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13.5,
  },
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
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  routineRhythmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  routineTimeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    minWidth: 68,
    alignItems: 'center',
  },
  routineTimeMorning: { backgroundColor: colors.saffron + '33' },
  routineTimeMidday:  { backgroundColor: colors.terracotta + '33' },
  routineTimeEvening: { backgroundColor: colors.vata + '33' },
  routineTimeNight:   { backgroundColor: colors.kapha + '33' },
  routineTimeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
}
