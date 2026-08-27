import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { DOSHA_COLORS } from './DoshaWheel';

// Extracted from app/journey.js's AyurvedaTab (nav restructure, Move 3),
// rebuilt as percentage bars per the mockup Matt shared instead of the
// venn-diagram wheel — same underlying data (doshaResult.scores /
// computeVikritiScores), just a denser, list-appropriate visual for a
// screen that isn't dedicated to this one thing anymore. The "Coming from
// Thea" placeholder is carried forward untouched — real clinical
// interpretation of Vikriti-vs-Prakriti has to come from Thea in her own
// words, not be invented here (CLAUDE.md's content-authorship rules).

function pctsFor(scores) {
  const total = (scores.vata + scores.pitta + scores.kapha) || 1;
  return {
    vata:  Math.round((scores.vata  / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };
}

function Bar({ label, elements, pct, colors: c }) {
  return (
    <View style={{ gap: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: c.textMedium }}>
          {label} <Text style={{ color: c.textMuted }}>· {elements}</Text>
        </Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: c.textMedium }}>{pct}%</Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: c.border }}>
        <View style={{ width: `${pct}%`, height: 6, borderRadius: 3, backgroundColor: DOSHA_COLORS[label.toLowerCase()] }} />
      </View>
    </View>
  );
}

export default function Constitution({ doshaResult, vikritiScores, colors: c }) {
  const router = useRouter();

  const scores = doshaResult && doshaResult.scores;
  const hasResult = !!(scores && (scores.vata || scores.pitta || scores.kapha));
  const pcts = hasResult ? pctsFor(scores) : null;

  const vikritiPcts = vikritiScores?.hasEnoughData ? pctsFor(vikritiScores.scores) : null;

  if (!hasResult) {
    return (
      <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: c.textMuted, lineHeight: 20, marginBottom: 10 }}>
          Take the dosha quiz to see your constitution here.
        </Text>
        <Pressable onPress={() => router.push('/quiz')}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: c.accent }}>Take the quiz →</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
      <View style={{ gap: 11 }}>
        <Bar label="Vata"  elements="Air · Ether"   pct={pcts.vata}  colors={c} />
        <Bar label="Pitta" elements="Fire · Water"  pct={pcts.pitta} colors={c} />
        <Bar label="Kapha" elements="Earth · Water" pct={pcts.kapha} colors={c} />
      </View>

      <View style={[styles.vikritiWrap, { borderTopColor: c.border }]}>
        <Text style={[styles.eyebrow, { color: c.textMuted }]}>Vikriti · how you're expressing now</Text>
        {vikritiPcts ? (
          <View style={{ gap: 8, marginTop: 8 }}>
            <Bar label="Vata"  elements="Air · Ether"   pct={vikritiPcts.vata}  colors={c} />
            <Bar label="Pitta" elements="Fire · Water"  pct={vikritiPcts.pitta} colors={c} />
            <Bar label="Kapha" elements="Earth · Water" pct={vikritiPcts.kapha} colors={c} />
          </View>
        ) : (
          <>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 19, color: c.textMedium, marginTop: 6 }}>
              {vikritiScores?.scores
                ? "You've started the Vikriti assessment, but there isn't quite enough tagged information yet to show a real reading."
                : 'Still gathering signal. Take the Vikriti assessment to see the gap between the blueprint and today.'}
            </Text>
            <Pressable onPress={() => router.push('/vikriti')} style={{ marginTop: 6 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', color: c.accent }}>Take the assessment ›</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Reserved for Thea's own words — see CLAUDE.md content-authorship
          rules. Do not fill in with invented clinical guidance. */}
      <View style={[styles.draftNotice, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.5, textTransform: 'uppercase', color: c.textMuted, marginBottom: 3 }}>Coming from Thea</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11.5, lineHeight: 16, color: c.textMuted }}>
          Guidance on bringing your Vikriti back into alignment with your Prakriti is being written in Thea's own words.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, padding: 18 },
  vikritiWrap: { marginTop: 14, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  draftNotice: { marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
});
