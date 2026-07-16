import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
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
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={[s.topHeader, { borderBottomColor: c.border }]}>
          <BackButton onPress={() => router.back()} color={c.text} />
          <Text style={[s.topHeaderTitle, { color: c.text }]}>Practitioner View</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: c.textMuted, textAlign: 'center' }}>
            This view is for practitioners only.
          </Text>
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
      <View style={[s.navBar, { borderBottomColor: c.border }]}>
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
      </View>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  topHeaderTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },
  navBar:    { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  navBtn:    { paddingVertical: 12, paddingHorizontal: 14, marginRight: 4 },
  navBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});
