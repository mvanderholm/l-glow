// CONTENT NOTE: All copy below is [DRAFT] — rewritten against voice guide v1.0 (approved by
// Thea, July 2026). Still her final line-edit pass before this page ships publicly — being
// grounded in the approved guide isn't the same as being her own words verbatim.
// Photo placeholder (photoFrame) = swap in assets/thea.jpg when ready.

import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { saveOnboarded } from '../data/user/storage';
import Svg, { Path, Circle, G } from 'react-native-svg';

const PILLARS = [
  { label: 'Lifestyle',    desc: 'Rhythms, routines, and seasonal living.',    bg: '#F5EDE3' },
  { label: 'Movement',     desc: 'Asana and practices for your constitution.',  bg: '#EBF0E8' },
  { label: 'Herbs',        desc: 'An apothecary organized by what you need.',  bg: '#F0EBE8' },
  { label: 'Nourishment',  desc: 'Food as information, not reward or punishment.', bg: '#EEE8F0' },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Find your type',  body: 'A short quiz surfaces your dosha — your unique mind-body constitution. Everything else is built on this.' },
  { n: '02', title: 'Read your day',   body: 'The daily check-in asks what you actually need right now. Not what worked last month.' },
  { n: '03', title: 'Do something about it', body: 'Guidance on food, movement, herbs, and rhythm — specific to your type and today\'s season.' },
];

export default function Welcome() {
  const router = useRouter();
  const { theme: { colors: c, spacing, radius, type } } = useTheme();
  const pad = spacing.lg;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#0E0A07' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 64 }}
      >

        {/* ── HERO ── */}
        <View style={{ width: '100%', maxWidth: 680, position: 'relative' }}>
          <Image
            source={require('../assets/about-archway.jpg')}
            style={{ width: '100%', height: 580 }}
            resizeMode="cover"
          />
          {/* dark overlay */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(14,10,7,0.52)' }]} pointerEvents="none" />
          <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', padding: pad, paddingBottom: 44 }]}>
            <LogoLockup color="#F5EDE3" />
            {/* [DRAFT] */}
            <Text style={[styles.heroHead, { color: '#F5EDE3', marginTop: 20 }]}>
              Your body already knows.{'\n'}This helps you listen.
            </Text>
            <Text style={[styles.heroSub, { color: 'rgba(245,237,227,0.78)', marginTop: 12 }]}>
              {/* [DRAFT] */}
              Ayurvedic guidance from Thea — teaching you to read your own body, not follow her rules.
            </Text>
            <Pressable
              style={[styles.heroCta, { marginTop: 28 }]}
              onPress={() => { saveOnboarded(); router.push('/quiz'); }}
            >
              <Text style={styles.heroCtaText}>FIND YOUR TYPE  ›</Text>
            </Pressable>
          </View>
        </View>

        {/* ── LIGHT SECTIONS ── */}
        <View style={{ width: '100%', maxWidth: 680, backgroundColor: c.bg, paddingHorizontal: pad }}>

          {/* ── SIGN IN LINK ── */}
          <View style={{ alignItems: 'flex-end', paddingTop: 16, paddingBottom: 4 }}>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={{ color: c.textMuted, fontFamily: 'Inter_500Medium', fontSize: 13 }}>
                Already have an account? <Text style={{ color: c.accent }}>Sign in</Text>
              </Text>
            </Pressable>
          </View>

          {/* ── DIFFERENTIATION ── */}
          <View style={{ paddingVertical: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }}>
            {/* [DRAFT] */}
            <Text style={[type.h2, { color: c.text, lineHeight: 30 }]}>
              Most wellness apps hand you someone else's rules.
            </Text>
            <Text style={[type.body, { color: c.textMedium, marginTop: 14, lineHeight: 26 }]}>
              {/* [DRAFT] */}
              Ayurveda doesn't work that way. What's medicine for one person is noise for another. L. Glow is Thea teaching you to read your own body's signals — not handing down her opinions about you, not running you through a generic protocol. Her tools. Your read.
            </Text>
          </View>

          {/* ── HOW IT WORKS ── */}
          <View style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }}>
            <Text style={[type.label, { color: c.textMuted, marginBottom: spacing.lg }]}>How it works</Text>
            {HOW_IT_WORKS.map((step, i) => (
              <View key={step.n} style={{ flexDirection: 'row', gap: 16, marginBottom: i < HOW_IT_WORKS.length - 1 ? spacing.lg : 0 }}>
                <Text style={{ fontFamily: 'PlayfairDisplay_400Regular', fontSize: 13, color: c.accentSoft, width: 28, paddingTop: 2 }}>{step.n}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[type.h4, { color: c.text, marginBottom: 4 }]}>{step.title}</Text>
                  <Text style={[type.body, { color: c.textMedium, fontSize: 15, lineHeight: 23 }]}>{step.body}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── DOSHA QUIZ ENTRY (= TBM's "Be Seen Challenge") ── */}
          <View style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }}>
            <Text style={[type.label, { color: c.textMuted, marginBottom: spacing.lg }]}>Start here</Text>
            <View style={[styles.quizCard, { backgroundColor: c.surface, ...card }]}>
              <Image
                source={require('../assets/checkin-tea.jpg')}
                style={{ width: '100%', height: 200, borderRadius: radius.lg, marginBottom: 20 }}
                resizeMode="cover"
              />
              {/* [DRAFT] */}
              <Text style={[type.h2, { color: c.text, marginBottom: 10 }]}>The Dosha Quiz</Text>
              <Text style={[type.body, { color: c.textMedium, lineHeight: 24, marginBottom: 20 }]}>
                {/* [DRAFT] */}
                Fourteen questions, about five minutes. Not a personality test — it finds your baseline blend, the color that's yours. Everything else in here reads off of it.
              </Text>
              <Pressable
                style={[styles.quizBtn, { backgroundColor: c.accent }]}
                onPress={() => { saveOnboarded(); router.push('/quiz'); }}
              >
                <Text style={styles.quizBtnText}>TAKE THE QUIZ  ›</Text>
              </Pressable>
            </View>
          </View>

          {/* ── ABOUT THEA ── */}
          <View style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }}>
            <Text style={[type.label, { color: c.textMuted, marginBottom: spacing.lg }]}>The practitioner</Text>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>
              {/* Photo placeholder — swap in assets/thea.jpg */}
              <View style={[styles.photoFrame, { backgroundColor: c.surface, borderColor: c.honeyAmber }]}>
                <Text style={{ color: c.border, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: 'Inter_400Regular' }}>Photo</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.h2, { color: c.text, marginBottom: 4 }]}>Thea</Text>
                <Text style={[type.label, { color: c.textMuted, marginBottom: 12 }]}>
                  Ayurvedic Medicine · RYT · Certified Wellness Coach
                </Text>
                {/* [DRAFT] */}
                <Text style={[type.body, { color: c.textMedium, fontSize: 15, lineHeight: 23 }]}>
                  A gymnast turned yoga teacher turned Ayurvedic practitioner — she spent years chasing her own answers about food, weight, and what "well" even means before Ayurveda gave her a different lens. Now she teaches other people to find theirs.
                </Text>
                <Pressable style={{ marginTop: 12 }} onPress={() => router.push('/about')}>
                  <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Full bio →</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── WHAT'S INSIDE ── */}
          <View style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }}>
            <Text style={[type.label, { color: c.textMuted, marginBottom: spacing.lg }]}>What's inside</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {PILLARS.map(p => (
                <View
                  key={p.label}
                  style={[styles.pillarCard, { backgroundColor: p.bg, flexBasis: '47%', flexGrow: 1 }]}
                >
                  <Text style={[type.h4, { color: '#443733', marginBottom: 6 }]}>{p.label}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, color: '#6E635C' }}>{p.desc}</Text>
                </View>
              ))}
            </View>
            <Text style={[type.body, { color: c.textMedium, marginTop: 20, fontSize: 14, lineHeight: 22 }]}>
              {/* [DRAFT] */}
              Plus tools: a daily check-in, Agni assessment, tongue analysis, herb apothecary, and Thea's weekly myth-busting column.
            </Text>
          </View>

          {/* ── FINAL CTA ── */}
          <View style={{ paddingTop: spacing.xl, alignItems: 'center', paddingBottom: spacing.xl }}>
            {/* [DRAFT] */}
            <Text style={[type.h2, { color: c.text, textAlign: 'center', marginBottom: 8 }]}>
              So. What does your body need today?
            </Text>
            <Text style={[type.body, { color: c.textMedium, textAlign: 'center', marginBottom: 28, lineHeight: 24 }]}>
              {/* [DRAFT] */}
              Start with the quiz. The rest follows.
            </Text>
            <Pressable
              style={[styles.quizBtn, { backgroundColor: c.accent, width: '100%' }]}
              onPress={() => { saveOnboarded(); router.push('/quiz'); }}
            >
              <Text style={styles.quizBtnText}>TAKE THE DOSHA QUIZ  ›</Text>
            </Pressable>
            <Pressable style={{ marginTop: 20 }} onPress={() => router.push('/login')}>
              <Text style={{ color: c.textMuted, fontFamily: 'Inter_400Regular', fontSize: 14 }}>
                Already a member? <Text style={{ color: c.accent }}>Sign in</Text>
              </Text>
            </Pressable>
          </View>

          {/* ── FOOTER ── */}
          <View style={{ alignItems: 'center', paddingBottom: spacing.xl }}>
            <Text style={{ color: c.accentSoft, fontSize: 15, marginBottom: 6 }}>❧</Text>
            <Text style={{ fontFamily: 'PlayfairDisplay_400Regular', fontSize: 13, fontStyle: 'italic', color: c.textMuted }}>
              It changes.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Logo (inline, no deps) ────────────────────────────────────────────────────

function LogoLockup({ color }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, color, letterSpacing: 3 }}>L. GL</Text>
      <LogoStar color={color} size={16} />
      <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, color, letterSpacing: 3 }}>W</Text>
    </View>
  );
}

function _starD(R) {
  const r = R * 0.30;
  const q = (r / Math.SQRT2).toFixed(3);
  return `M 0,${-R} L ${q},${-q} L ${R},0 L ${q},${q} L 0,${R} L ${-q},${q} L ${-R},0 L ${-q},${-q} Z`;
}

function LogoStar({ color, size = 16 }) {
  const R = size / 2;
  const sw = R * 0.22;
  const circR = R - sw / 2;
  const innerR = R * 0.57;
  const accentR = R * 0.24;
  const accentGap = R * 0.14;
  const accentCY = -(R + accentGap + accentR);
  const extraTop = accentGap + accentR * 2;
  const svgH = size + extraTop;
  return (
    <Svg width={size} height={svgH} viewBox={`${-R} ${-(R + extraTop)} ${size} ${svgH}`} style={{ marginTop: -(extraTop / 2) }}>
      <Circle cx="0" cy="0" r={circR} stroke={color} strokeWidth={sw} fill="none" />
      <Path d={_starD(innerR)} fill={color} />
      <G transform={`translate(0,${accentCY.toFixed(2)})`}>
        <Path d={_starD(accentR)} fill={color} />
      </G>
    </Svg>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  heroHead: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 0.2,
  },
  heroSub: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 17,
    lineHeight: 25,
    fontStyle: 'italic',
  },
  heroCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5EDE3',
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  heroCtaText: {
    color: '#443733',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 1.4,
  },
  quizCard: {
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
  },
  quizBtn: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#9A5151',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 4,
  },
  quizBtnText: {
    color: '#FBF9F4',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 1.4,
  },
  photoFrame: {
    width: 90,
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  pillarCard: {
    borderRadius: 18,
    padding: 16,
    paddingBottom: 20,
  },
});
