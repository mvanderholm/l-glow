import { View, Pressable, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { useViewMode } from '../context/ViewModeContext';
import BackButton from './BackButton';
import SearchButton from './SearchButton';

// Shared header for every screen — replaces ~14 copies of two near-identical
// inline header blocks that had quietly drifted apart (title rendering at
// 22px-with-letterSpacing in one family, 20px-with-no-letterSpacing in the
// other; 16px vs 20px horizontal padding). Standardizes on type.h1 for the
// title and spacing.lg for padding rather than preserving either prior
// variant. See docs/roadmap.md's design-cohesion audit (July 30 2026) for
// the full inventory this was built from.
//
// left: 'menu' | 'back' | 'none' — 'menu' auto-hides (renders an empty
//   same-width spacer instead) in Web View, matching how every hub screen
//   already hid its hamburger there before this component existed.
// onBack: passed straight to BackButton's onPress when left='back' — the
//   caller decides between router.back(), smartBack('/'), or a custom
//   handler (e.g. intake.js's SectionForm uses a different back target).
// right: 'search' | any custom ReactNode | null. Omitted (undefined)
//   renders an invisible same-width spacer so the title stays centered;
//   pass null explicitly if you want no spacer at all.
// bordered: adds the hairline bottom border sub-pages use; hub screens
//   (tab roots) omit it.
export default function Header({ title, left = 'none', onBack, right, bordered = false }) {
  const { theme: { colors: c, spacing, type } } = useTheme();
  const { open: openDrawer } = useDrawer();
  const { isWebMode } = useViewMode();

  const leftEl = left === 'menu'
    ? (isWebMode ? <View style={s.btn} /> : <Pressable style={s.btn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>)
    : left === 'back'
    ? <BackButton onPress={onBack} color={c.text} />
    : null;

  const rightEl = right === 'search'
    ? <SearchButton color={c.text} style={s.btn} />
    : right === undefined
    ? (left !== 'none' ? <View style={s.btn} /> : null)
    : right;

  return (
    <View style={[
      s.row,
      { paddingHorizontal: spacing.lg },
      bordered && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
    ]}>
      {leftEl}
      <Text style={[type.h1, { color: c.text }]} numberOfLines={1}>{title}</Text>
      {rightEl}
    </View>
  );
}

function MenuIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
