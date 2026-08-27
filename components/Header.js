import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
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
// left: 'back' | 'none' — the drawer 'menu' variant was removed in the
//   nav restructure (Aug 2026); every tab root renders just the centered
//   mark now, with no per-screen Header call at all.
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

  const leftEl = left === 'back'
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

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
