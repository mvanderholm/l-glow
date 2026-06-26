import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { card } from '../theme/index';
import Svg, { Path, Circle } from 'react-native-svg';

const PRACTICES = [
  { href: '/recipes', title: 'Recipes', desc: 'Seasonal, dosha-balancing meals', Icon: BowlIcon, dark: false },
];

const COMING_SOON = [
  { title: 'Food Guide',        desc: 'Thea\'s A–Z guide: what\'s medicine and what\'s poison depends entirely on who you are.' },
  { title: 'Freedom with Food', desc: 'Untangling the fear, the guilt, and the rules you didn\'t choose. Thea\'s signature content area.' },
  { title: 'Weight Balancing',  desc: 'Not weight loss. Weight balancing — because it goes both directions and starts with agni.' },
  { title: 'Herb + Food Guide', desc: 'A searchable encyclopedia of herbs and foods with dosha-specific medicine/poison breakdowns.' },
];

export default function Nourishment() {
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const { open: openDrawer } = useDrawer();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <Pressable style={styles.hBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>
        <Text style={[styles.hTitle, { color: c.text }]}>Nourishment</Text>
        <View style={styles.hBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: c.textMedium }]}>How you feed body and mind — food, recipes, and your relationship with eating.</Text>

        {/* Live content */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>In the kitchen</Text>
        <View style={styles.grid}>
          {PRACTICES.map(item => (
            <Pressable
              key={item.href}
              style={({ pressed }) => [styles.tile, { backgroundColor: c.surface, opacity: pressed ? 0.85 : 1, ...card }]}
              onPress={() => router.push(item.href)}
            >
              <View style={[styles.iconCircle, { backgroundColor: c.surfaceAlt }]}>
                <item.Icon color={c.textMuted} size={20} />
              </View>
              <Text style={[styles.tileTitle, { color: c.text }]}>{item.title}</Text>
              <Text style={[styles.tileDesc, { color: c.textMuted }]}>{item.desc}</Text>
            </Pressable>
          ))}
        </View>

        {/* Coming soon */}
        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Coming soon</Text>
        {COMING_SOON.map(item => (
          <View
            key={item.title}
            style={[styles.soonRow, { backgroundColor: c.surface, borderColor: c.border, ...card }]}
          >
            <View style={styles.soonBody}>
              <Text style={[styles.soonTitle, { color: c.textMuted }]}>{item.title}</Text>
              <Text style={[styles.soonDesc, { color: c.textMuted }]}>{item.desc}</Text>
            </View>
            <Text style={[styles.soonBadge, { color: c.textMuted }]}>soon</Text>
          </View>
        ))}

        {/* Philosophy note */}
        <View style={[styles.noteCard, { backgroundColor: c.surface, borderLeftColor: c.accent, ...card }]}>
          <Text style={[styles.noteLabel, { color: c.textMuted }]}>The principle</Text>
          <Text style={[styles.noteBody, { color: c.textMedium }]}>
            {"We are what we digest, not what we eat. Carbs are beautiful. Fat is good. Ice cream is medicine — in the right season, for the right person."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function MenuIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>;
}

function BowlIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3C10 3 7 5 7 8h10c0-3-3-5-5-5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M7 8h10l-1.5 9H8.5L7 8Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M9 13h6" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  hBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, letterSpacing: 0.22 },

  subtitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, fontStyle: 'italic', lineHeight: 22, marginBottom: 8 },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98,
    textTransform: 'uppercase', marginTop: 28, marginBottom: 12,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    flexBasis: '47.5%', flexGrow: 1, maxWidth: '50%',
    borderRadius: 18, padding: 18, paddingBottom: 16, minHeight: 120,
  },
  iconCircle: { width: 39, height: 39, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, lineHeight: 22 },
  tileDesc:   { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 3 },

  soonRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.6,
  },
  soonBody:  { flex: 1 },
  soonTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  soonDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18, marginTop: 3 },
  soonBadge: { fontFamily: 'Inter_400Regular', fontSize: 11 },

  noteCard: { borderRadius: 18, padding: 18, borderLeftWidth: 3, marginTop: 8 },
  noteLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 },
  noteBody:  { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 16, lineHeight: 26 },
});
