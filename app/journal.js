import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const dateKey = (d = new Date()) =>
  `@lavender-glow/journal_${d.toISOString().slice(0, 10)}`;

const formatDate = (d = new Date()) =>
  d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

export default function Journal() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const styles = makeStyles(c, spacing, radius);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const today = new Date();

  useEffect(() => {
    AsyncStorage.getItem(dateKey(today)).then(val => {
      if (val) setText(val);
    });
  }, []);

  async function save() {
    await AsyncStorage.setItem(dateKey(today), text.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[type.label, { color: c.textMuted }]}>{formatDate(today)}</Text>
          <Text style={[type.h1, { marginTop: spacing.sm }]}>Journal</Text>
          <Text style={[type.muted, { marginTop: spacing.xs }]}>
            What are you carrying today? What moved?
          </Text>

          <TextInput
            style={[styles.input, { color: c.text }]}
            value={text}
            onChangeText={t => { setText(t); setSaved(false); }}
            placeholder="Start writing…"
            placeholderTextColor={c.textMuted}
            multiline
            textAlignVertical="top"
          />

          <Pressable
            style={[styles.saveBtn, { backgroundColor: saved ? c.sage : c.saffron }]}
            onPress={save}
          >
            <Text style={[styles.saveBtnText, { color: c.bg }]}>
              {saved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    input: {
      marginTop: spacing.xl,
      minHeight: 280,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      fontSize: 16,
      lineHeight: 26,
      fontFamily: 'Inter_400Regular',
      borderWidth: 1,
      borderColor: c.border,
    },
    saveBtn: {
      marginTop: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      alignItems: 'center',
    },
    saveBtnText: {
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
    },
  });
}
