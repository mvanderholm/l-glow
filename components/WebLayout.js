import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useViewMode } from '../context/ViewModeContext';
import LogoMark from './LogoMark';

const NAV_LINKS = [
  { label: 'Home',              href: '/' },
  { label: 'Journey',           href: '/journey' },
  { label: 'Tools',             href: '/tools' },
  { label: 'Learn',             href: '/learn',            indent: true },
  { label: 'Journal',           href: '/journal',          indent: true },
  { label: 'About Thea',        href: '/about',            indent: true },
  { label: 'Check In',          href: '/checkin' },
  { label: 'You',               href: '/you' },
  { label: 'Dosha Quiz',        href: '/quiz',             indent: true },
  { label: 'Today\'s Guidance', href: '/recommendations',  indent: true },
  { label: 'Affirmation',       href: '/affirmations',     indent: true },
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
          <Text style={[type.h2, { marginTop: spacing.md }]}>Lavender Glow</Text>
          <Text style={[type.muted, { fontSize: 12, marginTop: 2 }]}>Ayurvedic companion</Text>
        </View>

        <View style={styles.nav}>
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Pressable
                key={link.href}
                onPress={() => router.push(link.href)}
                style={({ pressed }) => [
                  styles.navLink,
                  link.indent && styles.navLinkIndent,
                  active && styles.navLinkActive,
                  pressed && styles.navLinkPressed,
                ]}
              >
                <Text style={[styles.navLinkText, link.indent && styles.navLinkTextIndent, active && styles.navLinkTextActive]}>
                  {link.label}
                </Text>
              </Pressable>
            );
          })}
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
    navLink: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      marginBottom: 2,
    },
    navLinkIndent: {
      paddingLeft: spacing.lg + spacing.sm,
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
    navLinkTextIndent: {
      fontSize: 13,
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
