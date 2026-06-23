// CONTENT NOTE: Bio copy and credentials below are structural placeholders.
// All text marked [DRAFT] needs Thea's review and approval before shipping.
// Photo placeholder is intentionally blank — swap in assets/thea.jpg when ready.

import { View, Text, StyleSheet, Pressable, ScrollView, Platform, useWindowDimensions, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../theme';
import InstagramFeed from '../components/InstagramFeed';
import { CornerSprig, LeafSprig, BotanicalDivider } from '../components/BotanicalAccent';
import { INSTAGRAM_HANDLE } from '../data/instagram';
import { SPOTIFY_PROFILE_URL } from '../data/content/music';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const SWATCHES = [
  { name: 'cream',    dot: '#8B7287' },
  { name: 'lavender', dot: '#F5EDD0' },
  { name: 'midnight', dot: '#E8A030' },
];

export default function About() {
  const { theme, themeName, setThemeName, brandStyle, setBrandStyle } = useTheme();
  const { colors: c, spacing, radius, type } = theme;
  const { width: windowWidth } = useWindowDimensions();
  const innerWidth = (Platform.OS === 'web' ? Math.min(windowWidth, 480) : windowWidth) - spacing.lg * 2;
  const styles = makeStyles(c, spacing, radius);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Archway header — full bleed mood image */}
        <View style={styles.archwayBanner}>
          <Image
            source={require('../assets/about-archway.jpg')}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,5,0,0.52)' }]} pointerEvents="none" />
        </View>

        {/* Photo — swap in assets/thea.jpg when ready */}
        <View style={styles.photoFrame}>
          <CornerSprig color={c.olive} size={40} style={{ position: 'absolute', top: 6, right: 6 }} />
          <View style={{ position: 'absolute', bottom: 6, left: 6, transform: [{ rotate: '180deg' }] }}>
            <CornerSprig color={c.olive} size={40} />
          </View>
          <LeafSprig color={c.honeyAmber} size={44} />
          <Text style={styles.photoLabel}>Photo</Text>
        </View>

        {/* Name + credentials */}
        <Text style={[type.h1, { marginTop: spacing.lg, textAlign: 'center' }]}>
          Thea
        </Text>
        <Text style={[type.label, { textAlign: 'center', marginTop: spacing.xs }]}>
          Ayurvedic Medicine · RYT · Certified Wellness Coach
        </Text>

        {/* Bio */}
        {/* [DRAFT — distilled from Thea's voice memo. Her review required before shipping.] */}
        <View style={styles.bioBlock}>
          <Text style={[type.body, styles.bioPara]}>
            She came to yoga in 2017 the way most people do — sideways, via necessity. A Sunday run destroyed her hips, a friend said just come to class, and she walked in absolutely certain it wasn't her thing. She was wrong. It was the first time she'd understood her body through balance rather than force, and she hasn't looked back.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            She completed her yoga teacher training at Lotus House of Yoga in 2019, which is where Ayurveda found her. One session was enough to know there was something there. She's been studying and practicing ever since, earning her certification in Ayurvedic Medicine through the Shakti School in 2025.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            L. Glow is her practice in app form — a way to bring the core tools of Ayurveda into the daily lives of people between sessions, or in lieu of them. Her worldview, her methodology, her voice. The eventual physical center is coming. For now, this.
          </Text>
        </View>

        <BotanicalDivider color={c.sage} borderColor={c.border} width={innerWidth} />

        {/* Book a session */}
        <Text style={[type.label, { textAlign: 'center' }]}>Work with Thea</Text>
        <Text style={[type.muted, { textAlign: 'center', marginTop: spacing.xs }]}>
          One-on-one sessions coming soon.
        </Text>
        <Pressable style={styles.bookBtn} disabled>
          <Text style={[styles.bookBtnText, { color: c.text }]}>Book a Session</Text>
        </Pressable>

        {/* Theme switcher — commented out, defaulting to lavender. Uncomment to re-enable.
        <BotanicalDivider color={c.sage} borderColor={c.border} width={innerWidth} />
        <Text style={[type.label, { textAlign: 'center' }]}>App Theme</Text>
        <View style={styles.swatchRow}>
          {SWATCHES.map(s => {
            const selected = themeName === s.name;
            const bg = themes[s.name].colors.bg;
            return (
              <Pressable
                key={s.name}
                onPress={() => setThemeName(s.name)}
                style={[
                  styles.swatch,
                  { backgroundColor: bg, borderColor: selected ? s.dot : c.border, borderWidth: selected ? 2 : 1 },
                ]}
              >
                {selected && (
                  <View style={[styles.swatchDot, { backgroundColor: s.dot }]} />
                )}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.swatchLabels}>
          {SWATCHES.map(s => (
            <Text key={s.name} style={[styles.swatchLabel, { color: c.textMuted }]}>
              {themes[s.name].label.toUpperCase()}
            </Text>
          ))}
        </View>
        */}

        {/* Brand style toggle — commented out, defaulting to wordmark. Uncomment to re-enable.
        <BotanicalDivider color={c.sage} borderColor={c.border} width={innerWidth} />
        <Text style={[type.label, { textAlign: 'center' }]}>Branding</Text>
        <View style={styles.brandToggle}>
          {['wordmark', 'lettermark'].map(opt => {
            const active = brandStyle === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => setBrandStyle(opt)}
                style={[styles.brandBtn, active && { backgroundColor: c.accent, borderColor: c.accent }]}
              >
                <Text style={[styles.brandBtnText, { color: active ? c.bg : c.textMuted }]}>
                  {opt === 'wordmark' ? 'Wordmark' : 'Lettermark'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[type.muted, { fontSize: 12, textAlign: 'center', marginTop: spacing.sm }]}>
          Changes the logo on the home screen.
        </Text>
        */}

        {/* Aspirational image — the future center */}
        <View style={styles.tubBanner}>
          <Image
            source={require('../assets/soaking-tub.jpg')}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,5,0,0.28)' }]} pointerEvents="none" />
        </View>

        <BotanicalDivider color={c.sage} borderColor={c.border} width={innerWidth} />

        {/* Social links */}
        <View style={styles.socialRow}>
          <Pressable
            style={[styles.socialBtn, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => Linking.openURL(`https://instagram.com/${INSTAGRAM_HANDLE}`)}
          >
            <InstagramIcon color={c.textMuted} size={17} />
            <Text style={[styles.socialBtnText, { color: c.text }]}>Instagram</Text>
          </Pressable>
          <Pressable
            style={[styles.socialBtn, { backgroundColor: c.surface, borderColor: c.border, opacity: SPOTIFY_PROFILE_URL ? 1 : 0.45 }]}
            onPress={() => SPOTIFY_PROFILE_URL && Linking.openURL(SPOTIFY_PROFILE_URL)}
            disabled={!SPOTIFY_PROFILE_URL}
          >
            <SpotifyIcon color={c.textMuted} size={17} />
            <Text style={[styles.socialBtnText, { color: c.text }]}>Spotify</Text>
          </Pressable>
        </View>

        <InstagramFeed />

      </ScrollView>
    </SafeAreaView>
  );
}

function InstagramIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="20" height="20" rx="6" stroke={color} strokeWidth={1.5} />
      <Circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth={1.5} />
      <Circle cx="17.5" cy="6.5" r="1.2" fill={color} />
    </Svg>
  );
}

function SpotifyIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
      <Path d="M7.5 16c2.8-1.1 5.5-1.3 9 0" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6.5 12.5c3.2-1.3 7-1.5 11 0" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M7.5 9c3-1.4 6.5-1.6 9.5-.2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingTop: 0,
      alignItems: 'center',
    },
    archwayBanner: {
      alignSelf: 'stretch',
      marginHorizontal: -spacing.lg,
      height: 320,
      marginBottom: spacing.xl,
    },
    tubBanner: {
      alignSelf: 'stretch',
      height: 300,
      marginBottom: spacing.lg,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    photoFrame: {
      width: 140,
      height: 180,
      borderRadius: radius.lg,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.honeyAmber,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    photoLabel: {
      color: c.border,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    bioBlock: {
      marginTop: spacing.xl,
      alignSelf: 'stretch',
    },
    bioPara: {
      marginTop: spacing.md,
      lineHeight: 26,
      color: c.textMuted,
    },
    bookBtn: {
      marginTop: spacing.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      opacity: 0.4,
    },
    bookBtnText: {
      fontWeight: '600',
      fontSize: 16,
    },
    swatchRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: spacing.lg,
    },
    swatch: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: 'center',
      alignItems: 'center',
    },
    swatchDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    swatchLabels: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: spacing.sm,
    },
    swatchLabel: {
      width: 52,
      textAlign: 'center',
      fontSize: 9,
      letterSpacing: 0.8,
    },
    brandToggle: {
      flexDirection: 'row',
      marginTop: spacing.lg,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    brandBtn: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderWidth: 0,
    },
    brandBtnText: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.5,
    },

    socialRow: {
      flexDirection: 'row',
      gap: 12,
      alignSelf: 'stretch',
      marginBottom: spacing.xl,
    },
    socialBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 13,
      borderRadius: radius.pill,
      borderWidth: 1,
    },
    socialBtnText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
    },
  });
}
