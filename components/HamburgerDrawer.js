import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Modal, StyleSheet, Dimensions, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { NAV_SECTIONS } from '../data/nav';
import Svg, { Path, Circle } from 'react-native-svg';

// Icons keyed by data/nav.js's item `key` — kept here (not in the shared
// data module) since they're a presentation detail specific to this
// component; WebLayout's sidebar doesn't use icons at all.
const ICONS = {
  home: HomeIcon,
  profile: YouIcon,
  journey: JourneyIcon,
  learn: BookIcon,
  journal: PenIcon,
  about: PersonIcon,
  booking: CalendarIcon,
  quizzes: QuizIcon,
  playlist: MusicIcon,
};

const W = Math.min(Dimensions.get('window').width * 0.78, 300);

export default function HamburgerDrawer() {
  const { isOpen, close } = useDrawer();
  const { theme: { colors: c } } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const slideX   = useRef(new Animated.Value(-W)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(slideX,   { toValue: 0,  useNativeDriver: true, tension: 65, friction: 11 }),
        Animated.timing(fadeAnim, { toValue: 1,  duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideX,   { toValue: -W, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0,  duration: 200, useNativeDriver: true }),
      ]).start(() => setModalVisible(false));
    }
  }, [isOpen]);

  function navigate(path) {
    close();
    setTimeout(() => router.push(path), 50);
  }

  function openExternal(url) {
    close();
    setTimeout(() => Linking.openURL(url), 50);
  }

  function handlePress(item) {
    return item.external ? () => openExternal(item.external) : () => navigate(item.href);
  }

  return (
    <Modal transparent visible={modalVisible} animationType="none" onRequestClose={close}>
      {/* Visual backdrop — pointerEvents none so the row Pressable behind still works */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)', opacity: fadeAnim }]}
        pointerEvents="none"
      />

      {/* Row layout: drawer panel | tap-to-close area */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Animated.View style={[styles.panel, { backgroundColor: c.surface, transform: [{ translateX: slideX }] }]}>
          <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: c.border }]}>
              <Text style={[styles.brand, { color: c.text }]}>L. GLOW</Text>
              <Pressable onPress={close} style={styles.closeBtn} hitSlop={10}>
                <CloseIcon color={c.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

              {/* Nav items — data/nav.js is the single source of truth,
                  shared with WebLayout's fixed sidebar so the two can't drift
                  out of sync the way they used to (see docs/roadmap.md #52). */}
              {NAV_SECTIONS.map((section, i) => (
                <View key={i}>
                  {i > 0 && <View style={[styles.sep, { backgroundColor: c.border }]} />}
                  <View style={styles.section}>
                    {section.map(item => (
                      <DrawerItem key={item.key} icon={ICONS[item.key]} label={item.label} onPress={handlePress(item)} c={c} />
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.footerInline}>
                <Text style={[styles.footerText, { color: c.textMuted }]}>L. Glow · v0.1</Text>
              </View>

            </ScrollView>

          </SafeAreaView>
        </Animated.View>

        {/* Tap here to close */}
        <Pressable style={{ flex: 1 }} onPress={close} />
      </View>
    </Modal>
  );
}

function DrawerItem({ icon: Icon, label, onPress, c, soon = false }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <View style={[styles.itemIcon, { backgroundColor: c.surfaceAlt }]}>
        <Icon color={soon ? c.textMuted : c.text} size={16} />
      </View>
      <Text style={[styles.itemLabel, { color: soon ? c.textMuted : c.text }]}>{label}</Text>
      {soon
        ? <Text style={[styles.soonBadge, { color: c.textMuted }]}>soon</Text>
        : <ChevronIcon color={c.textMuted} />
      }
    </Pressable>
  );
}

function CloseIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
function ChevronIcon({ color }) {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function PersonIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
function CalendarIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 9.5A2.5 2.5 0 0 1 6.5 7h11A2.5 2.5 0 0 1 20 9.5v9A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-9Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M4 10.5h16M8 4v4M16 4v4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
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
function YouIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
      <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
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
function BookIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}
function PenIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" stroke={color} strokeWidth={1.4} />
      <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}
function QuizIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 11.5 11 13.5 15.5 9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    </Svg>
  );
}
function MusicIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="7" cy="17" r="2.5" stroke={color} strokeWidth={1.4} />
      <Circle cx="17" cy="15" r="2.5" stroke={color} strokeWidth={1.4} />
      <Path d="M9.5 17V6l10-2v9" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: W,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brand: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    letterSpacing: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  section: {
    paddingVertical: 8,
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    marginVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 14,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 15.5,
  },
  soonBadge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  footerInline: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
});
