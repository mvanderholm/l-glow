import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const TABS = [
  { name: 'Home',     href: '/',        icon: HomeIcon },
  { name: 'Journey',  href: '/journey', icon: JourneyIcon },
  { name: 'Tools',    href: '/tools',   icon: ToolsIcon },
  { name: 'Check In', href: '/checkin', icon: CheckInIcon },
  { name: 'You',      href: '/you',     icon: YouIcon },
];

const PRIMARY_ROUTES = new Set(['/', '/journey', '/tools', '/checkin', '/you']);

export default function BottomNav() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const visible = PRIMARY_ROUTES.has(pathname);

  return (
    <View
      style={[styles.container, {
        backgroundColor: c.surface,
        borderTopColor: c.border,
        paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 6 : 0),
        opacity: visible ? 1 : 0,
      }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {TABS.map(tab => {
        const active = pathname === tab.href;
        const color = active ? c.accent : c.textMuted;
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.href}
            style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}
            onPress={() => { if (!active) router.replace(tab.href); }}
            accessibilityLabel={tab.name}
            accessibilityRole="button"
          >
            <Icon color={color} size={22} />
            <Text style={[
              styles.label,
              { color, fontFamily: active ? 'Inter_700Bold' : 'Inter_400Regular' },
            ]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

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

function CheckInIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
      <Path d="M8.5 12l2.5 2.5 4.5-4.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 10,
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
    letterSpacing: 0.3,
  },
});
