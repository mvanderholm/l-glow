import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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
