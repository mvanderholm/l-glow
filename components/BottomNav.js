import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const TABS = [
  { name: 'Lifestyle',   href: '/lifestyle',   icon: LifestyleIcon },
  { name: 'Movement',    href: '/movement',    icon: MovementIcon },
  { name: 'Check In',   href: '/checkin',     icon: CheckInIcon },
  { name: 'Herbs',       href: '/herbs',       icon: HerbsIcon },
  { name: 'Nourishment', href: '/nourishment', icon: NourishIcon },
];

const HIDDEN_ROUTES = new Set(['/welcome', '/login', '/signup']);

export default function BottomNav() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  if (HIDDEN_ROUTES.has(pathname) || pathname.startsWith('/practitioner')) return null;

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

function LifestyleIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
      <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function MovementIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8c3 0 5 3 5 3s2-3 5-3 5 3 5 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M3 14c2 0 4 2 4 2s2-2 5-2 5 2 5 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function CheckInIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
      <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HerbsIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12 21V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function NourishIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C10 3 7 5 7 8h10c0-3-3-5-5-5Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M7 8h10l-1.5 9H8.5L7 8Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M9 13h6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
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
