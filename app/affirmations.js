import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { loadDoshaResult } from '../data/user/storage';
import { affirmationsForDosha } from '../data/content/affirmations';
import { loadAffirmations, refreshAffirmations } from '../data/content/remote';

// Picks a starting index from the pool that changes each day but is stable within a day.
function dailyStartIndex(len) {
  if (!len) return 0;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return parseInt(today, 10) % len;
}

export default function Affirmations() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const styles = makeStyles(c, spacing, radius);

  const [pool, setPool]   = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function build(list) {
      const result = await loadDoshaResult();
      const pool = affirmationsForDosha(result?.dosha ?? null, { list });
      setPool(pool);
      setIndex(dailyStartIndex(pool.length));
    }
    loadAffirmations().then(build);
    refreshAffirmations().then(loadAffirmations).then(build);
  }, []);

  const affirmation = pool[index] ?? null;

  function next() {
    setIndex(i => (i + 1) % pool.length);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.label}>Your Practice</Text>
        <Text style={[type.h1, { marginTop: spacing.sm }]}>Affirmation</Text>

        <View style={styles.card}>
          {affirmation ? (
            <>
              <Text style={[type.label, { color: c.accentAlt }]}>Just for today</Text>
              <Text style={[type.display, { marginTop: spacing.md, lineHeight: 52 }]}>
                {affirmation.text}
              </Text>
              {pool.length > 1 && (
                <Pressable
                  style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.5 }]}
                  onPress={next}
                >
                  <Text style={[type.muted, { fontSize: 13 }]}>another one →</Text>
                </Pressable>
              )}
            </>
          ) : (
            <Text style={type.muted}>Content coming soon.</Text>
          )}
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
    card: {
      marginTop: spacing.xl,
      padding: spacing.lg,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 3,
      borderLeftColor: c.accentAlt,
    },
    nextBtn: {
      marginTop: spacing.lg,
      alignSelf: 'flex-end',
    },
  });
}
