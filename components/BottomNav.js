import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Nav restructure Move 3 — replaces the old 5 pillar tabs (Lifestyle/
// Movement/Check In/Herbs/Nourishment) with the 4 tabs from Matt's mockup.
// Icon path data copied verbatim from that mockup's SVGs for visual parity.
export const TABS = [
  { name: 'Today',   href: '/',            icon: TodayIcon },
  { name: 'Explore', href: '/explore',     icon: ExploreIcon },
  { name: 'You',     href: '/you',         icon: YouIcon },
  { name: 'Thea',    href: '/thea',        icon: TheaIcon },
];

// Quiz/check-in/intake flows and the Assessments screen own the whole
// screen while active — no tab bar underneath, per the mockup and the
// nav-restructure plan's "linear flows own the screen" constraint.
const HIDDEN_ROUTES = new Set([
  '/welcome', '/login', '/signup',
  '/checkin', '/quiz', '/guna-quiz', '/agni-quiz', '/vikriti-quiz', '/prakriti-quiz',
  '/tongue-check', '/intake', '/assessments',
]);

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

function TodayIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.4} />
      <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

function ExploreIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function YouIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.4" stroke={color} strokeWidth={1.4} />
      <Path d="M5.5 20a6.5 6.5 0 0 1 13 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

function TheaIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
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
