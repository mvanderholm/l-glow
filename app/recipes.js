import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';

export default function Recipes() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        <BackButton onPress={() => smartBack('/')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        <Text style={type.label}>Kitchen</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Recipes</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          Dosha-wise meals and kitchen medicine — food as practice, not performance.
        </Text>

        <View style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          backgroundColor: c.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          borderLeftWidth: 3,
          borderLeftColor: c.honeyAmber,
        }}>
          <Text style={[type.label, { color: c.honeyAmber }]}>Coming soon</Text>
          <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 26 }]}>
            Thea is building this one recipe at a time — each one matched to a dosha, a season, and a moment. No meal plans, no macros. Just good food that makes sense for your body right now.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
