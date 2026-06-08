import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const TABS = [
  { name: 'Home',    href: '/',        icon: HomeIcon },
  { name: 'Journey', href: '/journey', icon: JourneyIcon },
  { name: 'Tools',   href: '/tools',   icon: ToolsIcon },
  { name: 'Journal', href: '/journal', icon: JournalIcon },
  { name: 'You',     href: '/you',     icon: YouIcon },
];

const PRIMARY_ROUTES = new Set(['/', '/journey', '/tools', '/journal', '/you']);

export default function BottomNav() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad, backgroundColor: c.bg }]}>
      <View style={[styles.pill, {
        backgroundColor: 'rgba(251,249,244,0.90)',
        borderColor: 'rgba(75,62,58,0.06)',
        // iOS shadow
        shadowColor: '#3C302C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 28,
        // Android
        elevation: 8,
      }]}>
        {TABS.map(tab => {
          const active = pathname === tab.href;
          const color = active ? c.accent : c.textMuted;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.href}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => { if (!active) router.replace(tab.href); }}
              accessibilityLabel={tab.name}
              accessibilityRole="button"
            >
              <Icon color={color} size={22} />
              <Text style={[
                styles.label,
                {
                  color,
                  fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                },
              ]}>
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────────

function HomeIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M9 22V14h6v8" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

function JourneyIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
      <Circle cx="12" cy="12" r="2" fill={color} />
      <Path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function ToolsIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3"    y="3"    width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth={1.5} />
      <Rect x="13.5" y="3"    width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth={1.5} />
      <Rect x="3"    y="13.5" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth={1.5} />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function JournalIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5v-15Z" stroke={color} strokeWidth={1.5} />
      <Path d="M10 7h4M10 11h4M10 15h2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function YouIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
      <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  pill: {
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1,
    paddingTop: 9,
    paddingBottom: 10,
    paddingHorizontal: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
