import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { SEASONAL_CONTENT, LUNAR_CONTENT } from '../data/content/cycles';
import { AYURVEDA_HISTORY, AYURVEDA_HERBS } from '../data/content/ayurvedaEssays';
import BackButton, { smartBack } from '../components/BackButton';

// "From Thea" full essays destination (nav restructure, Move 4) — the
// tradition/herbs/seasonal/lunar draft content that used to live inside
// journey.js's Ayurveda and Cycles tabs, now reached from Explore's
// "From Thea" preview card. Content moved verbatim, not rewritten.

function ContentCard({ section, c, type, accentColor }) {
  return (
    <View style={[styles.contentCard, { backgroundColor: c.surface, borderLeftColor: accentColor, ...card }]}>
      <Text style={[type.label, { color: accentColor, marginBottom: 8 }]}>{section.label}</Text>
      <Text style={[type.h2, { color: c.text, marginBottom: 12 }]}>{section.title}</Text>
      <Text style={[type.body, { color: c.textMedium, lineHeight: 26 }]}>{section.body}</Text>
    </View>
  );
}

export default function Cycles() {
  const { theme: { colors: c, spacing, type } } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <BackButton onPress={() => smartBack('/explore')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />
        <Text style={[type.label, { color: c.textMuted }]}>From Thea</Text>
        <Text style={[type.display, { color: c.text, marginTop: 4 }]}>The tradition</Text>
        <Text style={[type.muted, { marginTop: 6, lineHeight: 22 }]}>
          Where Ayurveda came from, how the seasons and moon shape it, and why plants matter.
        </Text>

        <View style={{ marginTop: spacing.lg, marginBottom: 4 }}>
          <Text style={[type.label, { color: c.textMuted }]}>The tradition</Text>
          <Text style={[type.h1, { color: c.text, marginTop: 4 }]}>Ayurveda</Text>
        </View>
        {AYURVEDA_HISTORY.map(section => (
          <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.honeyAmber} />
        ))}

        <View style={{ marginTop: spacing.lg, marginBottom: 4 }}>
          <Text style={[type.label, { color: c.textMuted }]}>The apothecary</Text>
          <Text style={[type.h2, { color: c.text, marginTop: 4 }]}>Herbs in healing</Text>
        </View>
        {AYURVEDA_HERBS.map(section => (
          <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.sage} />
        ))}

        <View style={{ marginTop: spacing.lg, marginBottom: 4 }}>
          <Text style={[type.label, { color: c.textMuted }]}>The seasons</Text>
          <Text style={[type.h2, { color: c.text, marginTop: 4 }]}>Living with the year</Text>
        </View>
        {SEASONAL_CONTENT.map(section => (
          <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.honeyAmber} />
        ))}

        <View style={{ marginTop: spacing.lg, marginBottom: 4 }}>
          <Text style={[type.label, { color: c.textMuted }]}>The moon</Text>
          <Text style={[type.h2, { color: c.text, marginTop: 4 }]}>Lunar rhythms</Text>
        </View>
        {LUNAR_CONTENT.map(section => (
          <ContentCard key={section.id} section={section} c={c} type={type} accentColor={c.vata} />
        ))}

        <View style={[styles.draftNotice, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={[type.label, { color: c.textMuted, marginBottom: 4 }]}>Draft</Text>
          <Text style={[type.caption, { color: c.textMuted, lineHeight: 18 }]}>
            This content was written in Thea's voice from open classical sources. It is awaiting her review before it ships publicly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentCard: { borderRadius: 26, padding: 20, borderLeftWidth: 3, marginBottom: 12 },
  draftNotice: { borderRadius: 14, padding: 16, borderWidth: 1, marginTop: 8 },
});
