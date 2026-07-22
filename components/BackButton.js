import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// Goes back if there's actual navigation history to go back to, otherwise
// falls back to a known-safe route. Matters on web: a direct URL load, a
// refresh, or a shared/bookmarked link all start with an empty history, so
// `router.back()` alone silently does nothing — found live on the Quizzes/
// Prakriti/Vikriti hub screens (no back control at all reached that state),
// July 2026. Every screen whose only way out is "go back" should use this
// instead of a bare router.back(), not just the ones that hit it first.
export function smartBack(fallback = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

// Shared back-chevron button — consolidates what used to be 8 near-identical
// local copies (checkin, journal, tongue-check, guna-quiz, agni-quiz, intake,
// login, signup). `overlay` gives it a circular dark backdrop for use on top
// of a photo/hero (e.g. checkin's tea image); omit it on plain backgrounds.
export default function BackButton({ onPress, color, overlay = false, style }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.btn, overlay && styles.overlay, style]}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
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
  overlay: {
    borderRadius: 20,
    backgroundColor: 'rgba(20,10,5,0.35)',
  },
});
