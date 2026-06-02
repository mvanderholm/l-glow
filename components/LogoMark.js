import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// compact=true — Ô glyph only, used in nav header at small sizes
// compact=false (default) — full mark: Ô + L. GLÔW + LIVING
export default function LogoMark({ size = 120, compact = false }) {
  const { theme } = useTheme();
  const c = theme.colors;

  if (compact) {
    return (
      <Svg viewBox="0 0 200 200" width={size} height={size}>
        <Rect width="200" height="200" fill={c.bg} />
        <SvgText
          x="100" y="140"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="100"
          textAnchor="middle"
          fill={c.accent}
        >
          Ô
        </SvgText>
      </Svg>
    );
  }

  return (
    <Svg viewBox="0 0 200 215" width={size} height={size * (215 / 200)}>
      <Rect width="200" height="215" fill={c.bg} />
      <SvgText
        x="100" y="128"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="100"
        textAnchor="middle"
        fill={c.accent}
      >
        Ô
      </SvgText>
      <Line x1="58" y1="146" x2="142" y2="146" stroke={c.accent} strokeWidth="0.7" opacity="0.45" />
      <SvgText
        x="100" y="167"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        letterSpacing="3"
        textAnchor="middle"
        fill={c.accent}
      >
        L. GLÔW
      </SvgText>
      <SvgText
        x="100" y="188"
        fontFamily="Georgia, serif"
        fontSize="11"
        letterSpacing="5"
        textAnchor="middle"
        fill={c.accent}
      >
        LIVING
      </SvgText>
    </Svg>
  );
}
