import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useViewMode } from '../context/ViewModeContext';
import { NAV_SECTIONS } from '../data/nav';
import { TABS as BOTTOM_TABS } from './BottomNav';
import LogoMark from './LogoMark';

// Web View has no separate bottom tab bar, so this sidebar covers both
// navigational planes mobile splits across two controls: BottomNav's 4
// tabs, plus whatever's left in data/nav.js's own list — the tabs lead,
// same live-import relationship as before (nav restructure, Move 3).
// Practitioner Hub no longer gets its own sidebar section — it's a plain
// row on /settings now, reachable through the You tab like everywhere else.
const NAV_SECTIONS_WITH_TABS = [
  BOTTOM_TABS.map(t => ({ key: t.href, label: t.name, href: t.href })),
  ...NAV_SECTIONS,
];

export default function WebLayout({ children }) {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { setViewMode } = useViewMode();
  const router = useRouter();
  const pathname = usePathname();
  const styles = makeStyles(c, spacing, radius);
  const sections = NAV_SECTIONS_WITH_TABS;

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarTop}>
          <LogoMark size={40} compact />
          <Text style={[type.h2, { marginTop: spacing.md }]}>L. Glow</Text>
          <Text style={[type.muted, { fontSize: 12, marginTop: 2 }]}>Ayurvedic companion</Text>
        </View>

        <View style={styles.nav}>
          {sections.map((section, i) => (
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
