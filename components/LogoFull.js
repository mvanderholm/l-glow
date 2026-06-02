import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Stacked wordmark: LAVENDER / GLÔW / LIVING / tagline
// width prop controls rendered size; viewBox is 520×220
export default function LogoFull({ width = 320 }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const height = Math.round(width * (220 / 520));

  return (
    <Svg viewBox="0 0 520 220" width={width} height={height}>
      <Rect width="520" height="220" fill={c.bg} />

      <SvgText
        x="260" y="78"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="44"
        fontWeight="500"
        letterSpacing="8"
        textAnchor="middle"
        fill={c.text}
      >
        LAVENDER
      </SvgText>

      <SvgText
        x="260" y="132"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="44"
        fontWeight="500"
        letterSpacing="8"
        textAnchor="middle"
        fill={c.text}
      >
        GLÔW
      </SvgText>

      <Line x1="130" y1="148" x2="390" y2="148" stroke={c.accent} strokeWidth="0.6" opacity="0.5" />

      <SvgText
        x="260" y="170"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="13"
        letterSpacing="8"
        textAnchor="middle"
        fill={c.textMuted}
      >
        LIVING
      </SvgText>

      <SvgText
        x="260" y="200"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="11"
        fontStyle="italic"
        letterSpacing="0.8"
        textAnchor="middle"
        fill={c.textMuted}
      >
        Your Story. Your sanctuary. Your Ayurveda.
      </SvgText>
    </Svg>
  );
}
