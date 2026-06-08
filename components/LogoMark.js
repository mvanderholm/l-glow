import { View, Text } from 'react-native';
import Svg, { Path, Circle as SvgCircle, G } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// 4-pointed star path, centered at origin, outer radius R
function starD(R) {
  const r = R * 0.30;
  const q = (r / Math.SQRT2).toFixed(3);
  return `M 0,${-R} L ${q},${-q} L ${R},0 L ${q},${q} L 0,${R} L ${-q},${q} L ${-R},0 L ${-q},${-q} Z`;
}

// "O" glyph: circle outline + inner 4-pointed star + tiny accent star above
// size = circle diameter (approximate cap height of the surrounding text)
function StarGlyph({ color, size }) {
  const R         = size / 2;
  const sw        = R * 0.22;          // circle stroke width
  const circR     = R - sw / 2;        // circle draw radius (inset by half sw)
  const innerR    = R * 0.57;          // inner star — fits inside circle
  const accentR   = R * 0.24;          // small accent star above
  const accentGap = R * 0.14;          // gap between circle top and accent star

  // Accent star center in SVG coords (above circle center)
  const accentCY  = -(R + accentGap + accentR);
  // Total SVG height: circle diameter + gap + accent star diameter
  const extraTop  = accentGap + accentR * 2;
  const svgH      = size + extraTop;

  // marginTop compensates so the circle (not the full SVG) is centered in the flex row
  return (
    <Svg
      width={size}
      height={svgH}
      viewBox={`${-R} ${-(R + extraTop)} ${size} ${svgH}`}
      style={{ marginTop: -(extraTop / 2) }}
    >
      <SvgCircle cx="0" cy="0" r={circR} stroke={color} strokeWidth={sw} fill="none" />
      <Path d={starD(innerR)} fill={color} />
      <G transform={`translate(0,${accentCY.toFixed(2)})`}>
        <Path d={starD(accentR)} fill={color} />
      </G>
    </Svg>
  );
}

// compact=true — wordmark only, used in Stack nav headers
// compact=false — full lockup with tagline, for splash / about page use
export default function LogoMark({ size = 120, compact = false }) {
  const { theme: { colors: c } } = useTheme();

  const fs       = Math.round(compact ? size * 0.44 : size * 0.28);
  const ls       = Math.round(fs * 0.18);
  const starSize = Math.round(fs * 0.78); // cap height ≈ 72–75% of em

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{
          fontFamily: 'PlayfairDisplay_600SemiBold',
          fontSize: fs,
          color: c.text,
          letterSpacing: ls,
          includeFontPadding: false,
        }}>
          L. GL
        </Text>
        <StarGlyph color={c.text} size={starSize} />
        <Text style={{
          fontFamily: 'PlayfairDisplay_600SemiBold',
          fontSize: fs,
          color: c.text,
          letterSpacing: ls,
          includeFontPadding: false,
        }}>
          W
        </Text>
      </View>
      {!compact && (
        <Text style={{
          fontFamily: 'Inter_400Regular',
          fontSize: Math.round(size * 0.09),
          color: c.textMuted,
          letterSpacing: Math.round(size * 0.028),
          marginTop: Math.round(size * 0.07),
        }}>
          WELLNESS, ROOTED IN YOU.
        </Text>
      )}
    </View>
  );
}
