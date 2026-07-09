// Photo placeholder is intentionally blank — swap in assets/thea.jpg when ready.
// assets/about-archway.jpg (formerly the top banner here) is no longer used on this
// screen — kept in assets/ for reuse elsewhere, placement TBD. See roadmap #47.

import { View, Text, StyleSheet, Pressable, ScrollView, Platform, useWindowDimensions, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../theme';
import InstagramFeed from '../components/InstagramFeed';
import { CornerSprig, LeafSprig, BotanicalDivider } from '../components/BotanicalAccent';
import { INSTAGRAM_HANDLE } from '../data/instagram';
import { SPOTIFY_PROFILE_URL } from '../data/content/music';
import { BOOKING_URL } from '../data/booking';
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
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Photo — lead image, top of page. Swap in assets/thea.jpg when ready */}
        <View style={[styles.photoFrame, { marginTop: spacing.lg }]}>
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
        <View style={styles.bioBlock}>
          <Text style={[type.body, styles.bioEmphasis]}>
            Hi, I'm Thea.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            I've always been fascinated by the human body.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            As a gymnast growing up, I learned to listen closely to mine. But like many women, my relationship with my body wasn't always rooted in love. I spent years navigating disordered eating, constantly searching for answers about health, weight, food, and what it truly means to be well. Looking back, that experience became one of my greatest teachers.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            In 2017, I found yoga after a long run left me realizing my body needed something different. Then, in 2019, my husband challenged me to do something just for me. At the time, I was focused on being a wife, a mom, and building a career. So I signed up for yoga teacher training — not because I wanted to teach, but because I wanted to learn.
          </Text>
          <Text style={[type.body, styles.bioEmphasis]}>
            That's where Ayurveda found me.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            For years, I had been asking questions.
          </Text>
          <Text style={[type.body, styles.bioQuestion]}>
            Why can two people eat the same thing and have completely different outcomes?
          </Text>
          <Text style={[type.body, styles.bioQuestion]}>
            Why do some people struggle with anxiety while others struggle with inflammation, weight, exhaustion, or burnout?
          </Text>
          <Text style={[type.body, styles.bioQuestion]}>
            Why does wellness feel so complicated?
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            Ayurveda gave me a completely different lens. It taught me that wellness isn't about following the latest trend or finding the perfect diet. It's about understanding your unique nature and creating a lifestyle that supports it.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            On New Year's Eve 2023, I recorded a video declaring that the coming year would be my Year of Ayurveda. It felt terrifying to say out loud. In fact, I almost deleted the video. But something told me not to.
          </Text>
          <Text style={[type.body, styles.bioEmphasis]}>
            That decision changed everything.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            Since then, I've become an Ayurveda Health Coach, continued my studies as an Ayurveda Counselor, and begun helping others reconnect with themselves through the wisdom of this 5,000-year-old science.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            What I love most about Ayurveda is its simplicity. It teaches that healing doesn't have to be overwhelming. Through four pillars — lifestyle, diet, exercise, and herbs — we can make small changes that create profound shifts. Most people think healing starts with a supplement or a meal plan. More often, it starts with how we live.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            I also believe Mother Earth is constantly showing us what we need. The dandelions that emerge in spring help us release the heaviness of winter. Lavender offers calm when life feels overwhelming. Nature has always been speaking — we just have to learn how to listen.
          </Text>
          <View style={styles.bioPhilosophy}>
            <Text style={[type.body, { color: c.text, fontStyle: 'italic', textAlign: 'center', lineHeight: 28, fontWeight: '500' }]}>
              "Nothing is for everybody,{'\n'}and everything is for somebody."
            </Text>
          </View>
          <Text style={[type.body, styles.bioPara]}>
            Your path to wellness won't look like anyone else's, and that's exactly the way it's supposed to be.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            As a mother, this work has become about more than my own healing. It's about breaking cycles and changing the conversation for future generations. I want my children — and their children — to grow up knowing that their worth is not tied to a number on a scale, a clothing size, or someone else's definition of health. When we heal ourselves, we create ripple effects that extend far beyond us.
          </Text>
          <Text style={[type.body, styles.bioPara]}>
            Today, through L. Glôw Living, I help people reconnect with their bodies, understand their unique blueprint, and create sustainable habits rooted in nature, awareness, and self-compassion. Because the work isn't just about feeling better today — it's about creating a healthier legacy for the generations that follow.
          </Text>
          <View style={styles.bioClosing}>
            <Text style={{ color: c.honeyAmber, fontStyle: 'italic', textAlign: 'center', lineHeight: 30, fontSize: 16 }}>
              Because when we heal, we bloom.{'\n'}And when we bloom, we spread seeds.
            </Text>
          </View>
        </View>

        <BotanicalDivider color={c.sage} borderColor={c.border} width={innerWidth} />

        {/* Book a session */}
        <Text style={[type.label, { textAlign: 'center' }]}>Work with Thea</Text>
        <Text style={[type.muted, { textAlign: 'center', marginTop: spacing.xs }]}>
          Go through this with Thea directly, one on one.
        </Text>
        <Pressable style={styles.bookBtn} onPress={() => Linking.openURL(BOOKING_URL)}>
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
      alignItems: 'center',
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
    bioEmphasis: {
      marginTop: spacing.lg,
      lineHeight: 28,
      color: c.text,
      fontWeight: '600',
      fontSize: 17,
    },
    bioQuestion: {
      marginTop: spacing.sm,
      lineHeight: 26,
      color: c.textMuted,
      fontStyle: 'italic',
      paddingLeft: spacing.lg,
    },
    bioPhilosophy: {
      alignSelf: 'stretch',
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: c.border,
    },
    bioClosing: {
      alignSelf: 'stretch',
      alignItems: 'center',
      marginTop: spacing.xl,
      paddingVertical: spacing.lg,
    },
    bookBtn: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.accent,
      backgroundColor: c.accent + '1A',
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
