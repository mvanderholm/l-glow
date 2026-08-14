import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import { smartBack } from '../../components/BackButton';

// Practitioner hub — its own nav structure, separate from the rest of the
// app (Matt's call, July 2026): a "Clients" dashboard plus an admin content
// section Thea can use to edit her own copy (mythbusters first, more content
// types to follow the same pattern — see data/content/remote.js). The role
// check lives here once, gating every sub-route under /practitioner instead
// of each screen re-checking it.

// Quiz entries (dosha/prakriti/guna/vikriti/agni) ordered to match the
// consumer sequence Matt scoped in supabase/migrations/TODO.md — Dosha Quiz
// first (the ungated entry point), then Prakriti, Guna, Vikriti, Agni.
// Tongue Check still has no admin editor (its 4-step shape/size/color/
// coating protocol is fixed, not a growable question list like the others —
// see roadmap notes, Aug 2026) — a known, deliberate gap, not an oversight.
const NAV_ITEMS = [
  { key: 'dashboard',    label: 'Dashboard',    href: '/practitioner/dashboard' },
  { key: 'inbox',        label: 'Inbox',        href: '/practitioner/inbox' },
  { key: 'clients',      label: 'Clients',      href: '/practitioner' },
  { key: 'dosha',        label: 'Dosha Quiz',   href: '/practitioner/dosha-questions' },
  { key: 'prakriti',     label: 'Prakriti',     href: '/practitioner/prakriti-questions' },
  { key: 'guna',         label: 'Guna Quiz',    href: '/practitioner/guna-questions' },
  { key: 'vikriti',      label: 'Vikriti',      href: '/practitioner/vikriti-questions' },
  { key: 'agni',         label: 'Agni Quiz',    href: '/practitioner/agni-questions' },
  { key: 'checkin',      label: 'Check-in Qs',  href: '/practitioner/checkin-questions' },
  { key: 'affirmations', label: 'Affirmations', href: '/practitioner/affirmations' },
  { key: 'mythbusters',  label: 'Mythbusters',  href: '/practitioner/mythbusters' },
  { key: 'intentions',   label: 'Intentions',   href: '/practitioner/intentions' },
  { key: 'routines',     label: 'Daily Rhythms',href: '/practitioner/routines' },
  { key: 'playlists',    label: 'Playlists',    href: '/practitioner/playlists' },
];

// Sidebar nav on wide (desktop) screens, matching the pattern from the old
// left-side nav that used to be there before it was replaced with a top tab
// bar — brought back as a purpose-built practitioner sidebar instead of the
// removed consumer WebLayout one. Below this width it falls back to the
// horizontal scrolling tab bar, since a fixed-width sidebar would eat too
// much of a phone screen.
const SIDEBAR_BREAKPOINT = 720;

function NavLink({ item, active, variant, colors: c, onPress }) {
  if (variant === 'sidebar') {
    return (
      <Pressable
        onPress={onPress}
        style={[s.sidebarBtn, active && { backgroundColor: c.surfaceAlt }]}
      >
        <Text style={[s.sidebarBtnText, { color: active ? c.text : c.textMuted }]}>{item.label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={[s.navBtn, active && { borderBottomColor: c.accent, borderBottomWidth: 2 }]}
    >
      <Text style={[s.navBtnText, { color: active ? c.text : c.textMuted }]}>{item.label}</Text>
    </Pressable>
  );
}

export default function PractitionerLayout() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isWide = width >= SIDEBAR_BREAKPOINT;
  const { user, role, isPractitioner } = useAuth();
  // Derived from AuthContext's user/role rather than its own query now — same
  // undefined/null/false/true shape as before: undefined = still checking,
  // null = no session, false = signed in but not a practitioner, true = yes.
  const authorized = user === undefined || (user && role === undefined)
    ? undefined
    : user === null ? null : isPractitioner;

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
        <Header title="Practitioner View" left="back" onBack={() => smartBack('/')} bordered />
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
      <Header title="Practitioner Hub" left="back" onBack={() => smartBack('/')} bordered />

      {isWide ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <ScrollView style={[s.sidebar, { borderRightColor: c.border }]} contentContainerStyle={{ paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.key}
                item={item}
                active={pathname === item.href}
                variant="sidebar"
                colors={c}
                onPress={() => router.push(item.href)}
              />
            ))}
          </ScrollView>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Slot />
          </View>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.navBar, { borderBottomColor: c.border }]} contentContainerStyle={s.navBarContent}>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.key}
                item={item}
                active={pathname === item.href}
                variant="tabs"
                colors={c}
                onPress={() => router.push(item.href)}
              />
            ))}
          </ScrollView>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  navBar:    { flexGrow: 0, borderBottomWidth: StyleSheet.hairlineWidth },
  navBarContent: { flexDirection: 'row', paddingHorizontal: 16 },
  navBtn:    { paddingVertical: 12, paddingHorizontal: 14, marginRight: 4 },
  navBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  signInBtn:     { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20 },
  signInBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  sidebar:       { width: 220, flexGrow: 0, flexShrink: 0, flexBasis: 220, paddingHorizontal: 10, borderRightWidth: StyleSheet.hairlineWidth },
  sidebarBtn:    { paddingVertical: 11, paddingHorizontal: 14, borderRadius: 10, marginBottom: 2 },
  sidebarBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14.5 },
});
