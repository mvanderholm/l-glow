import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import BackButton, { smartBack } from '../components/BackButton';

export default function SelfMassage() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        <BackButton onPress={() => smartBack('/')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />

        <Text style={type.label}>Abhyanga</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Self Massage</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          Touch yourself. Your body knows what it needs — this practice helps you listen.
        </Text>

        <View style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          backgroundColor: c.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          borderLeftWidth: 3,
          borderLeftColor: c.terracotta,
        }}>
          <Text style={[type.label, { color: c.terracotta }]}>Coming soon</Text>
          <Text style={[type.body, { marginTop: spacing.sm, lineHeight: 26 }]}>
            Abhyanga — self-massage with warm oil — is one of the oldest daily practices in ayurveda. Not a luxury. A basic act of attention toward your own body. Thea is working on protocols by dosha: which oils, which strokes, which time of day, and why.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
