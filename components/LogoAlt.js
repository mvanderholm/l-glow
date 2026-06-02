import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Alternate lettermark: large Ô anchored right, L. GLÔW / LIVING stacked left.
// Same width prop convention as LogoFull; viewBox is 480×200.
export default function LogoAlt({ width = 320 }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const height = Math.round(width * (200 / 480));

  return (
    <Svg viewBox="0 0 480 200" width={width} height={height}>
      <Rect width="480" height="200" fill={c.bg} />

      {/* Large Ô — right side */}
      <SvgText
        x="392"
        y="172"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="160"
        textAnchor="middle"
        fill={c.accent}
      >
        Ô
      </SvgText>

      {/* L. GLÔW — left */}
      <SvgText
        x="24"
        y="90"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="42"
        fontWeight="500"
        letterSpacing="3"
        textAnchor="start"
        fill={c.text}
      >
        L. GLÔW
      </SvgText>

      {/* Divider */}
      <Line
        x1="24" y1="106"
        x2="218" y2="106"
        stroke={c.accent}
        strokeWidth="0.6"
        opacity="0.5"
      />

      {/* LIVING */}
      <SvgText
        x="24"
        y="128"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="12"
        letterSpacing="8"
        textAnchor="start"
        fill={c.textMuted}
      >
        LIVING
      </SvgText>
    </Svg>
  );
}
