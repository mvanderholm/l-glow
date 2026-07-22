import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useViewMode } from '../context/ViewModeContext';
import { NAV_SECTIONS } from '../data/nav';
import { TABS as BOTTOM_TABS } from './BottomNav';
import LogoMark from './LogoMark';

// Web View has no separate bottom tab bar, so this sidebar has to cover both
// navigational planes mobile splits across two controls: BottomNav's 5 tabs,
// plus the hamburger drawer's items (data/nav.js — same list the drawer
// renders, so the two can't drift apart the way they used to). Home/Your
// Profile/My Journey leads, matching the drawer's own order, then the
// BottomNav tabs, then the rest of the drawer's groups.
const NAV_SECTIONS_WITH_TABS = [
  NAV_SECTIONS[0],
  BOTTOM_TABS.map(t => ({ key: t.href, label: t.name, href: t.href })),
  ...NAV_SECTIONS.slice(1),
];

export default function WebLayout({ children }) {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { setViewMode } = useViewMode();
  const router = useRouter();
  const pathname = usePathname();
  const styles = makeStyles(c, spacing, radius);

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarTop}>
          <LogoMark size={40} compact />
          <Text style={[type.h2, { marginTop: spacing.md }]}>L. Glow</Text>
          <Text style={[type.muted, { fontSize: 12, marginTop: 2 }]}>Ayurvedic companion</Text>
        </View>

        <View style={styles.nav}>
          {NAV_SECTIONS_WITH_TABS.map((section, i) => (
            <View key={i} style={[i > 0 && styles.navSection]}>
              {section.map(link => {
                const active = !link.external && pathname === link.href;
                return (
                  <Pressable
                    key={link.key}
                    onPress={() => link.external ? Linking.openURL(link.external) : router.push(link.href)}
                    style={({ pressed }) => [
                      styles.navLink,
                      active && styles.navLinkActive,
                      pressed && styles.navLinkPressed,
                    ]}
                  >
                    <Text style={[styles.navLinkText, active && styles.navLinkTextActive]}>
                      {link.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <Pressable style={styles.toggleBtn} onPress={() => setViewMode('app')}>
          <Text style={styles.toggleBtnText}>Switch to App View</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: c.bg,
    },
    sidebar: {
      width: 240,
      backgroundColor: c.surface,
      borderRightWidth: 1,
      borderRightColor: c.border,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      justifyContent: 'space-between',
    },
    sidebarTop: {},
    nav: {
      flex: 1,
      marginTop: spacing.xl,
    },
    navSection: {
      marginTop: spacing.md,
    },
    navLink: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      marginBottom: 2,
    },
    navLinkActive: {
      backgroundColor: c.bg,
    },
    navLinkPressed: {
      opacity: 0.7,
    },
    navLinkText: {
      color: c.textMuted,
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
    },
    navLinkTextActive: {
      color: c.text,
      fontFamily: 'Inter_700Bold',
    },
    toggleBtn: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
    },
    toggleBtnText: {
      color: c.textMuted,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      letterSpacing: 0.3,
    },
    content: {
      flex: 1,
      backgroundColor: c.bg,
    },
  });
}
