import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../config/supabase';
import BackButton from '../../components/BackButton';

// Practitioner hub — its own nav structure, separate from the rest of the
// app (Matt's call, July 2026): a "Clients" dashboard plus an admin content
// section Thea can use to edit her own copy (mythbusters first, more content
// types to follow the same pattern — see data/content/remote.js). The role
// check lives here once, gating every sub-route under /practitioner instead
// of each screen re-checking it.

const NAV_ITEMS = [
  { key: 'clients',      label: 'Clients',      href: '/practitioner' },
  { key: 'mythbusters',  label: 'Mythbusters',  href: '/practitioner/mythbusters' },
  { key: 'affirmations', label: 'Affirmations', href: '/practitioner/affirmations' },
  { key: 'checkin',      label: 'Check-in Qs',  href: '/practitioner/checkin-questions' },
  { key: 'guna',         label: 'Guna Quiz',    href: '/practitioner/guna-questions' },
  { key: 'intentions',   label: 'Intentions',   href: '/practitioner/intentions' },
  { key: 'routines',     label: 'Daily Rhythms',href: '/practitioner/routines' },
  { key: 'playlists',    label: 'Playlists',    href: '/practitioner/playlists' },
];

export default function PractitionerLayout() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(undefined); // undefined = checking, null = no session, false = signed in but not a practitioner, true = yes

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setAuthorized(null); return; }
      const { data, error } = await supabase.from('users').select('role').eq('id', session.user.id).single();
      if (error) console.error('Practitioner role check failed:', error.message, error);
      setAuthorized(data?.role === 'practitioner');
    });
  }, []);

  if (authorized === undefined) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} />
      </SafeAreaView>
    );
  }

  if (authorized !== true) {
    // authorized === null means no session — most likely Thea landing on
    // /practitioner cold, before signing in. Point her at /login instead of
    // showing the same "not a practitioner" message a wrong-role account
    // would see (see roadmap #50 tighten-up note, July 2026).
    const noSession = authorized === null;
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={[s.topHeader, { borderBottomColor: c.border }]}>
          <BackButton onPress={() => router.back()} color={c.text} />
          <Text style={[s.topHeaderTitle, { color: c.text }]}>Practitioner View</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: c.textMuted, textAlign: 'center' }}>
            {noSession ? "You'll need to sign in first." : 'This view is for practitioners only.'}
          </Text>
          {noSession && (
            <Pressable
              onPress={() => router.push('/login?returnTo=/practitioner')}
              style={[s.signInBtn, { backgroundColor: c.accent, marginTop: 20 }]}
            >
              <Text style={s.signInBtnText}>Go to sign in</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[s.topHeader, { borderBottomColor: c.border }]}>
        <BackButton onPress={() => router.back()} color={c.text} />
        <Text style={[s.topHeaderTitle, { color: c.text }]}>Practitioner Hub</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.navBar, { borderBottomColor: c.border }]} contentContainerStyle={s.navBarContent}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.href)}
              style={[s.navBtn, active && { borderBottomColor: c.accent, borderBottomWidth: 2 }]}
            >
              <Text style={[s.navBtnText, { color: active ? c.text : c.textMuted }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  topHeaderTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },
  navBar:    { flexGrow: 0, borderBottomWidth: StyleSheet.hairlineWidth },
  navBarContent: { flexDirection: 'row', paddingHorizontal: 16 },
  navBtn:    { paddingVertical: 12, paddingHorizontal: 14, marginRight: 4 },
  navBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  signInBtn:     { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20 },
  signInBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
