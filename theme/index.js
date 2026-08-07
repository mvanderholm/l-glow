// Exact values extracted from prototype DOM via computed styles

export const card = {
  shadowColor: '#4B3E3A',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.07,
  shadowRadius: 16,
  elevation: 4,
};

export const cardSubtle = {
  shadowColor: '#4B3E3A',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
};

// Shadow shape for accent-colored CTA buttons (shadowColor is theme-dependent
// so it isn't baked in here — spread this alongside `{ shadowColor: c.accent }`
// at the usage site). Previously hand-typed identically in three places
// (app/index.js's ctaBtn and ReturningUser CTA, app/journal.js's save
// button) — one of which hardcoded the shadow color as a literal hex that
// only matched the cream/lavender themes, so the button's shadow was the
// wrong color in Midnight.
export const accentShadow = {
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.28,
  shadowRadius: 18,
  elevation: 4,
};

// Smaller variant of accentShadow, for secondary CTA buttons — same
// shadowColor-is-dynamic rule applies. Found hand-typed identically (always
// with the same hardcoded, Midnight-broken '#9A5151') in five files:
// agni-result.js, guna-result.js, tongue-result.js, login.js, signup.js.
export const accentShadowSm = {
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.22,
  shadowRadius: 14,
  elevation: 3,
};

function makeType(text, medium, muted, accent) {
  return {
    display:    { color: text,   fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 40, lineHeight: 41, letterSpacing: 0.2 },
    h1:         { color: text,   fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, lineHeight: 28, letterSpacing: 0.22 },
    h2:         { color: text,   fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
    h3:         { color: text,   fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 23 },
    h4:         { color: text,   fontFamily: 'Inter_600SemiBold',           fontSize: 15.5, lineHeight: 21 },
    body:       { color: text,   fontFamily: 'Inter_400Regular',            fontSize: 16, lineHeight: 24 },
    bodyItalic: { color: medium, fontFamily: 'PlayfairDisplay_400Regular',  fontSize: 20, fontStyle: 'italic', lineHeight: 26 },
    label:      { color: muted,  fontFamily: 'Inter_600SemiBold',           fontSize: 11, letterSpacing: 1.98, textTransform: 'uppercase' },
    labelSm:    { color: accent, fontFamily: 'Inter_600SemiBold',           fontSize: 11.5, letterSpacing: 0.69, textTransform: 'uppercase' },
    caption:    { color: muted,  fontFamily: 'Inter_400Regular',            fontSize: 12.5, lineHeight: 17 },
    captionSm:  { color: muted,  fontFamily: 'Inter_400Regular',            fontSize: 12, lineHeight: 16 },
    muted:      { color: medium, fontFamily: 'Inter_400Regular',            fontSize: 16, lineHeight: 24 },
  };
}

const shared = {
  // screenPad/screenPadBottom: the quiz/result screens' own consistent
  // padding (agni-result, guna-result, tongue-result, prakriti-quiz,
  // vikriti-quiz all independently agreed on 24/48) — named here so it's one
  // source of truth instead of five copies of the same two numbers.
  spacing: { xs: 4, sm: 8, md: 16, lg: 20, xl: 32, screenPad: 24, screenPadBottom: 48 },
  radius:  { sm: 12, md: 18, lg: 26, pill: 999 },
};

export const themes = {
  cream: {
    name: 'cream',
    label: 'Linen',
    statusBar: 'dark',
    colors: {
      bg:          '#ECE7DD',
      surface:     '#FBF9F4',
      surfaceAlt:  'rgba(75,62,58,0.05)',
      border:      'rgba(75,62,58,0.10)',
      borderFaint: 'rgba(75,62,58,0.06)',
      text:        '#443733',
      textMedium:  '#6E635C',
      textMuted:   '#9A8F86',
      accent:      '#9A5151',
      accentSoft:  '#B76D67',
      saffron:     '#DBA441',
      honeyAmber:  '#C38B52',
      terracotta:  '#C97855',
      sage:        '#7AB878',
      olive:       '#7C7357',
      vata:        '#8B6A7A',
      kapha:       '#566357',
      herbsGreen:  '#566357',
    },
    type: makeType('#443733', '#6E635C', '#9A8F86', '#9A5151'),
    ...shared,
  },

  lavender: {
    name: 'lavender',
    label: 'Mauve',
    statusBar: 'dark',
    colors: {
      bg:          '#DBC8D5',
      surface:     '#F0E8ED',
      surfaceAlt:  'rgba(75,62,58,0.05)',
      border:      'rgba(75,62,58,0.10)',
      borderFaint: 'rgba(75,62,58,0.06)',
      text:        '#443733',
      textMedium:  '#6E635C',
      textMuted:   '#9A8F86',
      accent:      '#9A5151',
      accentSoft:  '#B76D67',
      saffron:     '#DBA441',
      honeyAmber:  '#C38B52',
      terracotta:  '#C97855',
      sage:        '#7AB878',
      olive:       '#7C7357',
      vata:        '#8B6A7A',
      kapha:       '#566357',
      herbsGreen:  '#566357',
    },
    type: makeType('#443733', '#6E635C', '#9A8F86', '#9A5151'),
    ...shared,
  },

  midnight: {
    name: 'midnight',
    label: 'Midnight',
    statusBar: 'light',
    colors: {
      bg:          '#1A1410',
      surface:     '#231C16',
      surfaceAlt:  'rgba(255,255,255,0.05)',
      border:      'rgba(255,255,255,0.08)',
      borderFaint: 'rgba(255,255,255,0.04)',
      text:        '#ECE8DF',
      textMedium:  '#A9A29B',
      textMuted:   '#7A7370',
      accent:      '#B76D67',
      accentSoft:  '#C97855',
      saffron:     '#DBA441',
      honeyAmber:  '#C38B52',
      terracotta:  '#C97855',
      sage:        '#7AB878',
      olive:       '#7C7357',
      vata:        '#8B6A7A',
      kapha:       '#566357',
      herbsGreen:  '#566357',
    },
    type: makeType('#ECE8DF', '#A9A29B', '#7A7370', '#B76D67'),
    ...shared,
  },
};
