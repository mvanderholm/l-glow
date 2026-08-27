import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import {
  loadUserName, saveUserName, loadFirstName, saveFirstName, loadLastName, saveLastName,
  loadPhone, savePhone, loadAddress, saveAddress, loadCity, saveCity, loadState, saveState, loadZip, saveZip,
} from '../data/user/storage';
import { useAuth } from '../context/AuthContext';
import BackButton, { smartBack } from '../components/BackButton';
import Svg, { Path, Circle } from 'react-native-svg';

// Consolidated Settings screen (nav restructure, Move 3) — replaces the
// separate "Settings" and "Account" sections that used to sit directly on
// /you, matching the mockup's single "Settings & account" row pattern.
// Personal Details, Reminders, Help, the practitioner-only hub link, and
// Sign in/out all live here now instead of on the tab root.

function Field({ label, value, onChangeText, colors: c, placeholder, keyboardType, containerStyle }) {
  return (
    <View style={[{ marginBottom: 12 }, containerStyle]}>
      <Text style={[styles.fieldLabel, { color: c.textMuted }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
        keyboardType={keyboardType}
      />
    </View>
  );
}

export default function Settings() {
  const { theme: { colors: c, spacing } } = useTheme();
  const router = useRouter();
  const { user, role, signOut } = useAuth();

  const [draft, setDraft] = useState(null); // null = loading
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Promise.all([
      loadUserName(), loadFirstName(), loadLastName(), loadPhone(), loadAddress(), loadCity(), loadState(), loadZip(),
    ]).then(([displayName, firstName, lastName, phone, address, city, state, zip]) => {
      setDraft({ displayName: displayName || '', firstName: firstName || '', lastName: lastName || '', phone: phone || '', address: address || '', city: city || '', state: state || '', zip: zip || '' });
    });
  }, []);

  async function save() {
    setSaving(true);
    await Promise.all([
      saveFirstName(draft.firstName), saveLastName(draft.lastName), saveUserName(draft.displayName),
      savePhone(draft.phone), saveAddress(draft.address), saveCity(draft.city), saveState(draft.state), saveZip(draft.zip),
    ]);
    setSaving(false);
    setEditing(false);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <BackButton onPress={() => smartBack('/you')} color={c.textMuted} style={{ marginLeft: -10, marginBottom: 8 }} />
        <Text style={[styles.title, { color: c.text }]}>Settings & account</Text>

        <Text style={[styles.sectionH, { color: c.text }]}>Personal details</Text>
        <View style={[styles.card, { backgroundColor: c.surface, ...card }]}>
          {!draft ? null : editing ? (
            <>
              <Field colors={c} label="First name" value={draft.firstName} onChangeText={t => setDraft({ ...draft, firstName: t })} />
              <Field colors={c} label="Last name" value={draft.lastName} onChangeText={t => setDraft({ ...draft, lastName: t })} />
              <Field colors={c} label="Display name" value={draft.displayName} onChangeText={t => setDraft({ ...draft, displayName: t })} placeholder="What should we call you?" />
              <Field colors={c} label="Phone" value={draft.phone} onChangeText={t => setDraft({ ...draft, phone: t })} keyboardType="phone-pad" />
              <Field colors={c} label="Address" value={draft.address} onChangeText={t => setDraft({ ...draft, address: t })} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Field colors={c} label="City" value={draft.city} onChangeText={t => setDraft({ ...draft, city: t })} containerStyle={{ flex: 2 }} />
                <Field colors={c} label="State" value={draft.state} onChangeText={t => setDraft({ ...draft, state: t })} containerStyle={{ flex: 1 }} />
                <Field colors={c} label="Zip" value={draft.zip} onChangeText={t => setDraft({ ...draft, zip: t })} keyboardType="number-pad" containerStyle={{ flex: 1 }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Pressable style={[styles.saveBtn, { flex: 1, backgroundColor: c.accent }]} onPress={save} disabled={saving}>
                  <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
                </Pressable>
                <Pressable style={[styles.saveBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={() => setEditing(false)} disabled={saving}>
                  <Text style={[styles.saveBtnText, { color: c.textMuted }]}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: c.text }}>
                {[draft.firstName, draft.lastName].filter(Boolean).join(' ') || draft.displayName || 'Add your details'}
              </Text>
              {(draft.phone || draft.address) && (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 2 }}>
                  {[draft.phone, draft.address].filter(Boolean).join(' · ')}
                </Text>
              )}
              <Pressable onPress={() => setEditing(true)} style={{ marginTop: 8 }}>
                <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Edit</Text>
              </Pressable>
            </>
          )}
        </View>

        <Text style={[styles.sectionH, { color: c.text }]}>App</Text>
        <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
          <View style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}>
            <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><BellIcon color={c.textMuted} size={15} /></View>
            <Text style={[styles.rowLabel, { color: c.textMuted, flex: 1 }]}>Reminders</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><QuestionIcon color={c.textMuted} size={15} /></View>
            <Text style={[styles.rowLabel, { color: c.textMuted, flex: 1 }]}>Help & guidance</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
          </View>
          {role === 'practitioner' && (
            <Pressable style={[styles.row, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]} onPress={() => router.push('/practitioner')}>
              <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><PersonIcon color={c.textMuted} size={15} /></View>
              <Text style={[styles.rowLabel, { color: c.text, flex: 1 }]}>Practitioner Hub</Text>
              <ChevronIcon color={c.textMuted} />
            </Pressable>
          )}
        </View>

        <Text style={[styles.sectionH, { color: c.text }]}>Account</Text>
        <View style={[styles.rows, { backgroundColor: c.surface, ...card }]}>
          {user ? (
            <Pressable style={styles.row} onPress={signOut}>
              <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><SignOutIcon color={c.textMuted} size={15} /></View>
              <Text style={[styles.rowLabel, { color: c.text }]}>Sign out</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]} onPress={() => router.push('/login')}>
                <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><PersonIcon color={c.textMuted} size={15} /></View>
                <Text style={[styles.rowLabel, { color: c.text, flex: 1 }]}>Sign in</Text>
                <ChevronIcon color={c.textMuted} />
              </Pressable>
              <Pressable style={styles.row} onPress={() => router.push('/signup')}>
                <View style={[styles.ico, { backgroundColor: c.surfaceAlt }]}><PersonIcon color={c.accent} size={15} /></View>
                <Text style={[styles.rowLabel, { color: c.accent, flex: 1 }]}>Create account</Text>
                <ChevronIcon color={c.accent} />
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BellIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function QuestionIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.4} />
    <Path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .8-1 1.7" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="0.9" fill={color} />
  </Svg>;
}
function PersonIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.6" stroke={color} strokeWidth={1.4} />
    <Path d="M5 20a7 7 0 0 1 14 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function SignOutIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function ChevronIcon({ color }) {
  return <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  title: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 24, marginBottom: 20 },
  sectionH: { fontFamily: 'Inter_600SemiBold', fontSize: 13, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10, marginTop: 22 },
  card: { borderRadius: 18, padding: 16 },
  rows: { borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  ico: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 11.5, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  fieldInput: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Inter_400Regular', fontSize: 14 },
  saveBtn: { borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13.5 },
});
