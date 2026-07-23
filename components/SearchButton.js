import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

// Shared search-icon trigger — mirrors BackButton.js's shape (same 40x40 hit
// target, same "consolidate near-identical per-screen copies" reasoning),
// since every hub/content screen needs identical `router.push('/search')`
// wiring. See docs/roadmap.md #44.
export default function SearchButton({ color, style }) {
  return (
    <Pressable onPress={() => router.push('/search')} hitSlop={8} style={[styles.btn, style]}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.7} />
        <Path d="M21 21l-4.3-4.3" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
