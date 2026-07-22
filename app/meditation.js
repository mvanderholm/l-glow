import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';

export default function Meditation() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        <BackButton onPress={() => smartBack('/')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        <Text style={type.label}>Mind</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Meditation</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          Grounded practice, not a performance. Stillness that actually fits your life.
        </Text>

        <View style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          backgroundColor: c.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          borderLeftWidth: 3,
          borderLeftColor: c.vata,
        }}>
          <Text style={[type.label, { color: c.vata }]}>Coming soon</Text>
          <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 26 }]}>
            Different doshas need different approaches to stillness — vata needs anchoring, pitta needs cooling, kapha needs momentum. Thea is working on guidance for each. No mantras you didn't ask for. No guided visualizations of golden light.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
