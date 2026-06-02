import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { saveCheckin } from '../data/user/storage';

const dimensions = [
  { key: 'physical', label: 'Physical', desc: 'Energy, digestion, body' },
  { key: 'mental', label: 'Mental', desc: 'Focus, clarity, sharpness' },
  { key: 'emotional', label: 'Emotional', desc: 'Mood, calm, openness' },
  { key: 'hunger', label: 'Morning hunger', desc: 'How strong is your appetite right now?', hint: { low: 'none at all', high: 'genuinely hungry' } },
  { key: 'tongue', label: 'Tongue coating', desc: 'Check before eating or drinking anything.', hint: { low: 'clear', high: 'heavy coating' } },
];

const scale = [1, 2, 3, 4, 5];

export default function CheckIn() {
  const { theme: { colors, spacing, radius, type } } = useTheme();
  const [values, setValues] = useState({ physical: 3, mental: 3, emotional: 3, hunger: 3, tongue: 3 });
  const [note, setNote] = useState('');
  const styles = makeStyles(colors, spacing, radius);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.teaHeader}>
        <Image
          source={require('../assets/checkin-tea.jpg')}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,10,5,0.45)' }]} pointerEvents="none" />
        <View style={styles.teaHeaderContent}>
          <Text style={[type.label, { color: 'rgba(236,232,223,0.8)' }]}>
            Today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={[type.h1, { color: '#ECE8DF', marginTop: spacing.sm }]}>How are you, really?</Text>
          <Text style={[type.muted, { color: 'rgba(236,232,223,0.75)', marginTop: spacing.xs }]}>
            The body keeps score. Five questions to read where you actually are.
          </Text>
        </View>
      </View>

      {dimensions.map(d => (
        <View key={d.key} style={styles.section}>
          <Text style={type.h2}>{d.label}</Text>
          <Text style={type.muted}>{d.desc}</Text>
          <View style={styles.scaleRow}>
            {scale.map(n => (
              <Pressable
                key={n}
                onPress={() => setValues({ ...values, [d.key]: n })}
                style={[styles.scaleDot, values[d.key] === n && styles.scaleDotActive]}
              >
                <Text style={[styles.scaleNum, values[d.key] === n && styles.scaleNumActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          {d.hint && (
            <View style={styles.hintRow}>
              <Text style={styles.hintText}>{d.hint.low}</Text>
              <Text style={styles.hintText}>{d.hint.high}</Text>
            </View>
          )}
        </View>
      ))}

      <View style={styles.section}>
        <Text style={type.h2}>A note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What's present for you today?"
          placeholderTextColor={colors.textMuted}
          multiline
          style={styles.input}
        />
      </View>

      <Pressable
        style={styles.primaryBtn}
        onPress={async () => {
          try {
            await saveCheckin(values, note);
          } catch (err) {
            console.error('Failed to save check-in:', err);
          }
          router.push('/recommendations');
        }}
      >
        <Text style={styles.primaryBtnText}>Save & See Guidance</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors, spacing, radius) {
return StyleSheet.create({
  container: { padding: spacing.lg },
  teaHeader: {
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.lg,
    height: 300,
    overflow: 'hidden',
  },
  teaHeaderContent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: { marginTop: spacing.xl, paddingLeft: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.accentAlt },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  hintText: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic' },
  scaleDot: {
    width: 52, height: 52, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  scaleDotActive: { backgroundColor: colors.saffron, borderColor: colors.saffron },
  scaleNum: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  scaleNumActive: { color: colors.bg },
  input: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    minHeight: 90,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.bg, fontFamily: 'Inter_700Bold', fontSize: 16 },
});
}
