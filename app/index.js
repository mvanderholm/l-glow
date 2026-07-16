import { View, Text, StyleSheet, Pressable, ScrollView, Share, Platform, TextInput, Linking, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useDrawer } from '../context/DrawerContext';
import { card } from '../theme/index';
import { currentSeason } from '../data/content/recommendations';
import { doshaInfo } from '../data/content/quiz';
import { loadDoshaResult, buildSessionSummary, loadTodayIntention, saveIntention, loadUserName, loadOnboarded } from '../data/user/storage';
import { useAuth } from '../context/AuthContext';
import { intentionSuggestions } from '../data/content/intentions';
import { currentMythbuster } from '../data/content/mythbusters';
import { loadMythbusters, refreshMythbusters } from '../data/content/remote';
import { playlistForDosha } from '../data/content/music';
import Svg, { Path, Circle, G } from 'react-native-svg';

const WEEK_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SEASONS = [
  null,'Late Winter','Late Winter','Early Spring','Spring','Spring',
  'Late Spring','Summer','Summer','Late Summer','Early Autumn','Autumn','Late Autumn',
];

function todayLabel() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  let season;
  if (m === 6 && day < 21) season = 'Late Spring';
  else if (m <= 2 || m === 12) season = 'Late Winter';
  else if (m === 3) season = 'Early Spring';
  else if (m <= 5) season = 'Spring';
  else if (m <= 8) season = 'Summer';
  else if (m === 9) season = 'Early Autumn';
  else season = 'Autumn';
  return `${WEEK_DAYS[d.getDay()]} · ${season}`;
}

export default function Home() {
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const { open: openDrawer } = useDrawer();
  const { user } = useAuth();
  const router = useRouter();
  const [savedDosha, setSavedDosha] = useState(null);
  const [userName, setUserName] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadDoshaResult().then(r => setSavedDosha(r ? r.dosha : false));
    loadOnboarded().then(flag => { if (!flag) router.replace('/welcome'); });
  }, []);

  // No more anonymous "what's your name" prompt — name only shows once
  // there's an actual signed-in account. `display_name` (set via loadUserName,
  // hydrated from Supabase) wins if it's ever been set; otherwise fall back
  // to a friendly version of the email's local-part.
  useEffect(() => {
    loadUserName().then(n => {
      if (n) { setUserName(n); return; }
      if (user?.email) {
        const local = user.email.split('@')[0];
        setUserName(local.charAt(0).toUpperCase() + local.slice(1));
      } else {
        setUserName(null);
      }
    });
  }, [user]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={openDrawer}><MenuIcon color={c.text} /></Pressable>
          <LogoLockup color={c.text} />
          <Pressable style={styles.headerBtn}><BellIcon color={c.text} /></Pressable>
        </View>

        {/* Greeting */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[styles.overline, { color: c.textMuted }]}>{todayLabel()}</Text>
          <Text style={[styles.greetLine, { color: c.textMedium }]}>Good morning,</Text>
          <Text style={[styles.greetName, { color: c.text }]}>{userName ?? ''}</Text>
          <Text style={[styles.greetSub, { color: c.textMedium }]}>Let's see where you are today.</Text>
        </View>

        {/* Hero remedy card */}
        <View style={[styles.heroCard, { backgroundColor: c.surface, ...card }]}>
          <Image source={require('../assets/checkin-tea.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        {/* CTA button */}
        <CtaButton colors={c} />

        {/* Affirmation card */}
        <View style={[styles.affirmCard, { backgroundColor: c.surface, ...card }]}>
          <View style={[styles.affirmImage, { backgroundColor: c.surfaceAlt, overflow: 'hidden' }]}>
            <Image source={require('../assets/about-archway.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          <View style={styles.affirmContent}>
            <Text style={[styles.overline, { color: c.textMuted, marginBottom: 6 }]}>Daily Affirmation</Text>
            <Text style={[styles.affirmText, { color: c.text }]}>I am rooted, but I flow.</Text>
            <Pressable style={{ marginTop: 12 }}>
              <LeafIcon color={c.accentSoft} size={16} />
            </Pressable>
          </View>
        </View>

        {/* Daily music suggestion */}
        {savedDosha && <MusicCard dosha={savedDosha} colors={c} />}

        {/* Monday Mythbusters */}
        <MythbusterCard colors={c} spacing={spacing} />

        {/* Begin here */}
        <Text style={[styles.sectionTitle, { color: c.text, marginBottom: spacing.md }]}>Begin here</Text>
        <BeginGrid colors={c} />

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
          <Text style={{ color: c.accentSoft, fontSize: 15, marginBottom: 6 }}>❧</Text>
          <Text style={[styles.footerText, { color: c.textMuted }]}>It changes.</Text>
        </View>

        {savedDosha === null ? null : savedDosha ? (
          <ReturningUser dosha={savedDosha} userName={userName} colors={c} spacing={spacing} type={type} scrollRef={scrollRef} />
        ) : null}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MusicCard({ dosha, colors: c }) {
  const playlist = playlistForDosha(dosha);
  if (!playlist) return null;

  return (
    <View style={[styles.musicCard, { backgroundColor: c.surface }]}>
      <Text style={[styles.overline, { color: c.textMuted, marginBottom: 8 }]}>Today's sound</Text>
      {playlist.name && (
        <Text style={[styles.musicName, { color: c.text }]}>{playlist.name}</Text>
      )}
      <Text style={[styles.musicMood, { color: c.textMedium }]}>{playlist.mood}</Text>
      {playlist.url ? (
        <Pressable
          style={({ pressed }) => [styles.musicBtn, { borderColor: c.border, opacity: pressed ? 0.7 : 1 }]}
          onPress={() => Linking.openURL(playlist.url)}
        >
          <Text style={[styles.musicBtnText, { color: c.textMedium }]}>Open on Spotify  ↗</Text>
        </Pressable>
      ) : (
        <Text style={[styles.musicMood, { color: c.textMuted, fontStyle: 'italic', marginTop: 6 }]}>
          Playlist coming soon.
        </Text>
      )}
    </View>
  );
}

function MythbusterCard({ colors: c, spacing }) {
  const [list, setList] = useState(null);

  useEffect(() => {
    loadMythbusters().then(setList);
    refreshMythbusters().then(() => loadMythbusters()).then(fresh => setList(fresh));
  }, []);

  if (!list) return null;
  const myth = currentMythbuster(list);

  if (myth) {
    return (
      <View style={[styles.mythCard, { backgroundColor: c.surface }]}>
        <Text style={[styles.overline, { color: c.textMuted, marginBottom: 10 }]}>This week · Myth</Text>
        <Text style={[styles.mythMyth, { color: c.text }]}>"{myth.myth}"</Text>
        {myth.take && (
          <Text style={[styles.mythBody, { color: c.textMedium, marginTop: 10 }]}>{myth.take}</Text>
        )}
        {myth.reframe && (
          <View style={[styles.mythReframe, { backgroundColor: c.surfaceAlt, borderLeftColor: c.accentAlt }]}>
            <Text style={[styles.overline, { color: c.textMuted, marginBottom: 4 }]}>The reframe</Text>
            <Text style={[styles.mythBody, { color: c.text }]}>{myth.reframe}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.mythCard, { backgroundColor: c.surface }]}>
      <Text style={[styles.overline, { color: c.textMuted, marginBottom: 8 }]}>Monday Mythbusters</Text>
      <Text style={[styles.mythBody, { color: c.textMedium, fontStyle: 'italic' }]}>
        Every Monday, Thea takes apart one wellness belief that deserves a closer look. Check back then.
      </Text>
    </View>
  );
}

function CtaButton({ colors: c }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.ctaBtn, { backgroundColor: c.accent, opacity: pressed ? 0.9 : 1 }]}
      onPress={() => router.push('/checkin')}
    >
      <Text style={styles.ctaBtnText}>START MY DAY  ›</Text>
    </Pressable>
  );
}

const BEGIN_ITEMS = [
  { href: '/herbs',      label: 'Apothecary', Icon: HerbsIcon,      colorKey: 'kapha'      },
  { href: '/breathwork', label: 'Breathwork', Icon: BreathIcon,     colorKey: 'sage'       },
  { href: '/recipes',    label: 'Recipes',    Icon: RecipesIcon,    colorKey: 'honeyAmber' },
  { href: '/meditation', label: 'Meditate',   Icon: MeditationIcon, colorKey: 'vata'       },
];

function BeginGrid({ colors: c }) {
  const router = useRouter();
  return (
    <View style={styles.beginGrid}>
      {BEGIN_ITEMS.map(item => (
        <Pressable
          key={item.href}
          style={({ pressed }) => [styles.beginCard, { backgroundColor: c.surface, ...card, opacity: pressed ? 0.8 : 1 }]}
          onPress={() => router.push(item.href)}
        >
          <View style={[styles.beginIconWrap, { backgroundColor: c.surfaceAlt }]}>
            <item.Icon color={c[item.colorKey]} size={20} />
          </View>
          <Text style={[styles.beginLabel, { color: c.textMedium }]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ReturningUser({ dosha, userName, colors: c, spacing, type, scrollRef }) {
  const router = useRouter();
  const info = doshaInfo[dosha];
  const { theme: { radius } } = useTheme();
  const suggestions = intentionSuggestions(dosha);
  const [intention, setIntention] = useState(null);
  const [draft, setDraft] = useState('');

  useEffect(() => { loadTodayIntention().then(v => setIntention(v ?? '')); }, []);

  async function choose(text) {
    const t = text.trim();
    if (!t) return;
    await saveIntention(t);
    setIntention(t);
    setDraft('');
  }

  if (intention === null) return null;

  return (
    <View style={{ marginTop: spacing.xl, paddingTop: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }}>
      <Text style={[type.h2, { color: c.text }]}>Welcome back{userName ? `, ${userName}` : ''}</Text>
      <Text style={[type.h3, { color: info.color, marginTop: 4 }]}>{info.name}</Text>

      <View style={[{ marginTop: spacing.lg, padding: spacing.lg, backgroundColor: c.surface, borderRadius: 26, ...card }]}>
        {intention ? (
          <>
            <Text style={[type.label, { color: c.textMuted }]}>Just for today</Text>
            <Text style={[type.body, { color: c.text, marginTop: 8 }]}>I will {intention}</Text>
            <Pressable onPress={() => setIntention('')} style={{ marginTop: 8 }}>
              <Text style={{ color: c.textMuted, fontSize: 12 }}>change</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[type.label, { color: c.textMuted }]}>Just for today, I will…</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 6, marginBottom: 2 }}>Choose one, or write your own.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {suggestions.map(s => (
                <Pressable key={s.id} onPress={() => choose(s.text)}
                  style={{ backgroundColor: c.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
                  <Text style={{ color: c.accent, fontSize: 13, fontFamily: 'Inter_400Regular' }}>{s.text}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={{ marginTop: 12, padding: 10, backgroundColor: c.surfaceAlt, borderRadius: 12, color: c.text, fontSize: 14, fontFamily: 'Inter_400Regular' }}
              placeholder="write your own…"
              placeholderTextColor={c.textMuted}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => choose(draft)}
              returnKeyType="done"
              onFocus={() => setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 100)}
            />
          </>
        )}
      </View>

      <Pressable style={[{ backgroundColor: c.accent, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: spacing.lg,
        shadowColor: c.accent, shadowOffset: {width:0,height:6}, shadowOpacity:0.28, shadowRadius:18, elevation:4 }]}
        onPress={() => router.push({ pathname: '/recommendations', params: { dosha } })}>
        <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 14, letterSpacing: 1 }}>TODAY'S GUIDANCE</Text>
      </Pressable>
    </View>
  );
}


// ── Inline SVG icons ───────────────────────────────────────────────────────

function LogoLockup({ color }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, color, letterSpacing: 3, includeFontPadding: false }}>L. GL</Text>
      <LogoStar color={color} />
      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, color, letterSpacing: 3, includeFontPadding: false }}>W</Text>
    </View>
  );
}

function _starD(R) {
  const r = R * 0.30;
  const q = (r / Math.SQRT2).toFixed(3);
  return `M 0,${-R} L ${q},${-q} L ${R},0 L ${q},${q} L 0,${R} L ${-q},${q} L ${-R},0 L ${-q},${-q} Z`;
}

function LogoStar({ color, size = 14 }) {
  const R         = size / 2;
  const sw        = R * 0.22;
  const circR     = R - sw / 2;
  const innerR    = R * 0.57;
  const accentR   = R * 0.24;
  const accentGap = R * 0.14;
  const accentCY  = -(R + accentGap + accentR);
  const extraTop  = accentGap + accentR * 2;
  const svgH      = size + extraTop;
  return (
    <Svg
      width={size}
      height={svgH}
      viewBox={`${-R} ${-(R + extraTop)} ${size} ${svgH}`}
      style={{ marginTop: -(extraTop / 2) }}
    >
      <Circle cx="0" cy="0" r={circR} stroke={color} strokeWidth={sw} fill="none" />
      <Path d={_starD(innerR)} fill={color} />
      <G transform={`translate(0,${accentCY.toFixed(2)})`}>
        <Path d={_starD(accentR)} fill={color} />
      </G>
    </Svg>
  );
}

function MenuIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function BellIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M6 10a6 6 0 0 1 12 0c0 3 1.5 5 2 6H4c.5-1 2-3 2-6Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M10 20a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function LeafIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} />
      <Path d="M12 21V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function HerbsIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M12 21V10M9 13l3-3 3 3" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BreathIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8c3 0 5 3 5 3s2-3 5-3 5 3 5 3" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 14c2 0 4 2 4 2s2-2 5-2 5 2 5 2" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RecipesIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C10 3 7 5 7 8h10c0-3-3-5-5-5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M7 8h10l-1.5 9H8.5L7 8Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    </Svg>
  );
}

function MeditationIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.4} />
      <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={1.4} />
      <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.98,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  greetLine: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 20,
  },
  greetName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 40,
    lineHeight: 41,
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  greetSub: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    fontStyle: 'italic',
    lineHeight: 26,
  },

  heroCard: {
    height: 190,
    borderRadius: 26,
    marginBottom: 16,
    overflow: 'hidden',
  },

  ctaBtn: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#9A5151',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 4,
  },
  ctaBtnText: {
    color: '#FBF9F4',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 1.4,
  },

  affirmCard: {
    flexDirection: 'row',
    borderRadius: 26,
    marginBottom: 28,
    overflow: 'hidden',
    height: 128,
  },
  affirmImage: {
    width: 96,
  },
  affirmContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  affirmText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  sectionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 19,
    lineHeight: 24,
  },
  beginGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  beginCard: {
    flexBasis: '47.5%',
    flexGrow: 1,
    maxWidth: '50%',
    borderRadius: 18,
    padding: 16,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  beginIconWrap: {
    width: 37,
    height: 37,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beginLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },

  footerText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 13.5,
    fontStyle: 'italic',
  },

  musicCard: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  musicName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 4,
  },
  musicMood: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  musicBtn: {
    marginTop: 14,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  musicBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },

  mythCard: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mythMyth: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  mythBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  mythReframe: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
  },
});
