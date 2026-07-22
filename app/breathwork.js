import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';

export default function Breathwork() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        <BackButton onPress={() => smartBack('/')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        <Text style={type.label}>Breath</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Breathwork</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          The breath is the fastest thing you can change. Pranayama for your dosha and the moment.
        </Text>

        <View style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          backgroundColor: c.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          borderLeftWidth: 3,
          borderLeftColor: c.accentAlt,
        }}>
          <Text style={[type.label, { color: c.accentAlt }]}>Coming soon</Text>
          <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 26 }]}>
            Thea is working on pranayama techniques matched to each dosha — calming practices for vata, cooling ones for pitta, energizing ones for kapha. Not a library of every technique that exists. Just the ones she actually uses.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
