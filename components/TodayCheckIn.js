import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { doshaInfo } from '../data/content/quiz';
import { loadCheckinDimensions, refreshCheckinDimensions } from '../data/content/remote';
import { saveCheckin, loadTodayCheckin, loadTodayCheckins } from '../data/user/storage';

const scale = [1, 2, 3, 4, 5];
const DOT_KEYS = ['physical', 'mental', 'emotional', 'hunger', 'tongue'];

// Inline check-in card for `/` (nav restructure, Move 1) — merges checkin.js's
// first-question UI (answer inline, no navigation) with today.js's
// multi-check-in dot rows (the one piece of today.js with no other home).
// Answering the first dimension saves a real check-in immediately — the
// remaining dimensions default to a neutral 3 — so "Continue" into the full
// /checkin flow for a more thorough pass creates a second entry rather than
// leaving today uncredited if someone never continues. That's intentional:
// multiple check-ins a day are allowed now (Aug 25 2026), not an accident.
export default function TodayCheckIn({ dosha, onSaved }) {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const styles = makeStyles(c, spacing, radius);
  const router = useRouter();
  const info = dosha ? doshaInfo[dosha] : null;

  const [checkins, setCheckins] = useState(null); // null = loading
  const [dimensions, setDimensions] = useState([]);
  const [answeredValue, setAnsweredValue] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTodayCheckins().then(setCheckins);
    loadCheckinDimensions().then(setDimensions);
    refreshCheckinDimensions().then(loadCheckinDimensions).then(setDimensions);
  }, []);

  async function answerFirst(n) {
    if (saving) return;
    setAnsweredValue(n);
    setSaving(true);
    const firstKey = dimensions[0]?.key ?? 'physical';
    const values = Object.fromEntries(DOT_KEYS.map(k => [k, k === firstKey ? n : 3]));
    try {
      await saveCheckin(values, '');
    } catch (err) {
      console.error('Failed to save check-in:', err);
    }
    const fresh = await loadTodayCheckins();
    setCheckins(fresh);
    setSaving(false);
    onSaved?.();
  }

  if (checkins === null) return null;

  const alreadyToday = checkins.length > 0;
  const firstDim = dimensions[0];

  return (
    <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
      <Text style={[type.label, { color: c.textMuted, marginBottom: 10 }]}>Check-in</Text>

      {alreadyToday && (
        <View style={{ marginBottom: answeredValue == null ? 0 : spacing.md }}>
          {checkins.map((entry, i) => (
            <View key={i} style={[styles.dotsRow, i > 0 && { marginTop: spacing.sm }]}>
              {entry.savedAt && (
                <Text style={[type.muted, { color: c.textMuted, marginRight: spacing.sm, width: 62 }]}>
                  {new Date(entry.savedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </Text>
              )}
              {DOT_KEYS.map(k => {
                const val = entry.values[k] ?? 3;
                const opacity = 0.2 + (val / 5) * 0.8;
                return <View key={k} style={[styles.dot, { backgroundColor: info?.color ?? c.accent, opacity }]} />;
              })}
            </View>
          ))}
        </View>
      )}

      {!alreadyToday && firstDim && (
        <>
          <Text style={[type.h3, { color: c.text }]}>{firstDim.label}</Text>
          <Text style={[type.muted, { color: c.textMuted, marginTop: 2 }]}>{firstDim.desc}</Text>
          <View style={styles.scaleRow}>
            {scale.map(n => (
              <Pressable
                key={n}
                onPress={() => answerFirst(n)}
                disabled={saving}
                style={[styles.scaleDot, { borderColor: c.border, backgroundColor: c.surfaceAlt }, answeredValue === n && { backgroundColor: c.saffron, borderColor: c.saffron }]}
              >
                <Text style={[styles.scaleNum, { color: c.textMuted }, answeredValue === n && { color: c.bg }]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          {firstDim.hint && (
            <View style={styles.hintRow}>
              <Text style={[styles.hintText, { color: c.textMuted }]}>{firstDim.hint.low}</Text>
              <Text style={[styles.hintText, { color: c.textMuted }]}>{firstDim.hint.high}</Text>
            </View>
          )}
        </>
      )}

      {(alreadyToday || answeredValue != null) && (
        <Pressable
          style={[styles.continueBtn, { borderColor: c.border }]}
          onPress={() => router.push('/checkin')}
        >
          <Text style={[type.muted, { color: c.accent, fontFamily: 'Inter_600SemiBold' }]}>
            {alreadyToday ? 'Check in again  ›' : 'Continue the rest  ›'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    card: { borderRadius: 26, padding: 20, marginBottom: 16 },
    dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    dot: { width: 11, height: 11, borderRadius: 6 },
    scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
    scaleDot: { width: 44, height: 44, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    scaleNum: { fontSize: 15, fontWeight: '600' },
    hintRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
    hintText: { fontSize: 11, fontStyle: 'italic' },
    continueBtn: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
  });
}
