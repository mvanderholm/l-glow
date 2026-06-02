function makeType(text, accent, muted) {
  return {
    display: { color: text, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 40, lineHeight: 50 },
    h1:      { color: text, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, lineHeight: 36 },
    h2:      { color: text, fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20, lineHeight: 28 },
    body:    { color: text, fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24 },
    label:   { color: accent, fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
    muted:   { color: muted, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22 },
  };
}

const shared = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  radius:  { sm: 6, md: 12, lg: 16, pill: 999 },
};

export const themes = {
  cream: {
    name: 'cream',
    label: 'Linen',
    statusBar: 'dark',
    colors: {
      bg:         '#C8BFB1',
      surface:    '#FAF8F6',
      surfaceAlt: '#F0EDE8',
      border:     '#D4CCC3',
      text:       '#443733',
      textMuted:  '#6E635C',
      accent:     '#9A5151',
      accentAlt:  '#8B4A4A',
      saffron:    '#DBA441',
      honeyAmber: '#C38B52',
      terracotta: '#C97855',
      sage:       '#7AB878',
      olive:      '#7C7357',
      vata:       '#8B6A7A',
      kapha:      '#566357',
    },
    type: makeType('#443733', '#9A5151', '#6E635C'),
    ...shared,
  },

  lavender: {
    name: 'lavender',
    label: 'Mauve',
    statusBar: 'dark',
    colors: {
      bg:         '#DBC8D5',
      surface:    '#F0E8ED',
      surfaceAlt: '#E5DDE0',
      border:     '#D4CCC3',
      text:       '#443733',
      textMuted:  '#6E635C',
      accent:     '#9A5151',
      accentAlt:  '#8B4A4A',
      saffron:    '#DBA441',
      honeyAmber: '#C38B52',
      terracotta: '#C97855',
      sage:       '#7AB878',
      olive:      '#7C7357',
      vata:       '#8B6A7A',
      kapha:      '#566357',
    },
    type: makeType('#443733', '#9A5151', '#6E635C'),
    ...shared,
  },

  midnight: {
    name: 'midnight',
    label: 'Midnight',
    statusBar: 'light',
    colors: {
      bg:         '#1A1410',
      surface:    '#231C16',
      surfaceAlt: '#2E2520',
      border:     '#4B3E3A',
      text:       '#ECE8DF',
      textMuted:  '#A9A29B',
      accent:     '#B76D67',
      accentAlt:  '#9A5151',
      saffron:    '#DBA441',
      honeyAmber: '#C38B52',
      terracotta: '#C97855',
      sage:       '#7AB878',
      olive:      '#7C7357',
      vata:       '#8B6A7A',
      kapha:      '#566357',
    },
    type: makeType('#ECE8DF', '#B76D67', '#A9A29B'),
    ...shared,
  },
};
