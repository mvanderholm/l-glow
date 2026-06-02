import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { BotanicalDivider } from '../components/BotanicalAccent';
import { useWindowDimensions, Platform } from 'react-native';

export default function Journey() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const innerWidth = (Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth) - spacing.lg * 2;
  const styles = makeStyles(c, spacing, radius);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.label}>Over time</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Journey</Text>
        <Text style={[type.muted, { marginTop: spacing.xs }]}>
          Your practice over time. Patterns, check-in history, and what the body has been telling you.
        </Text>

        <BotanicalDivider color={c.sage} borderColor={c.border} width={innerWidth} />

        <View style={styles.pendingCard}>
          <Text style={[type.h2, { color: c.textMuted }]}>Coming soon.</Text>
          <Text style={[type.muted, { marginTop: spacing.sm, lineHeight: 22 }]}>
            Keep checking in daily. Your history is already being recorded — this view is where it surfaces.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    pendingCard: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 3,
      borderLeftColor: c.honeyAmber,
    },
  });
}
