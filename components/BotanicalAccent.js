import Svg, { Path, G, Defs, LinearGradient, RadialGradient, Stop, Rect, Circle } from 'react-native-svg';

// Internal: sprig paths rendered at origin — use inside a <G transform="...">
function SprigPaths({ color, opacity = 1 }) {
  return (
    <G stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
      <Path d="M0,52 L0,4" />
      <Path d="M0,40 Q10,34 14,26 Q7,28 0,34" />
      <Path d="M0,27 Q10,21 14,13 Q7,15 0,21" />
      <Path d="M0,14 Q4,9 4,4" />
      <Path d="M0,34 Q-10,28 -14,20 Q-7,22 0,28" />
      <Path d="M0,21 Q-10,15 -14,7 Q-7,9 0,15" />
    </G>
  );
}

// Full-width hero gradient with botanical sprig overlays
export function HeroBackground({ colors, width }) {
  const height = Math.round(width * 0.62);
  const vw = 400;
  const vh = Math.round(400 * 0.62);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="lgHeroBg" x1="0" y1="0" x2="100" y2={`${vh}`} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.surface} stopOpacity="1" />
          <Stop offset="1" stopColor={colors.bg} stopOpacity="1" />
        </LinearGradient>
        <RadialGradient id="lgWarmGlow" cx={`${Math.round(vw * 0.72)}`} cy={`${Math.round(vh * 0.78)}`} r={`${Math.round(vw * 0.5)}`} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.saffron} stopOpacity="0.22" />
          <Stop offset="1" stopColor={colors.saffron} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="lgRoseHint" cx={`${Math.round(vw * 0.18)}`} cy={`${Math.round(vh * 0.22)}`} r={`${Math.round(vw * 0.38)}`} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.accent} stopOpacity="0.09" />
          <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Rect width={vw} height={vh} fill="url(#lgHeroBg)" />
      <Rect width={vw} height={vh} fill="url(#lgWarmGlow)" />
      <Rect width={vw} height={vh} fill="url(#lgRoseHint)" />

      <G transform="translate(360, -15) rotate(18) scale(2.1)">
        <SprigPaths color={colors.sage} opacity={0.17} />
      </G>
      <G transform="translate(38, 118) rotate(-14) scale(1.35)">
        <SprigPaths color={colors.kapha} opacity={0.14} />
      </G>
      <G transform="translate(215, -28) rotate(6) scale(0.9)">
        <SprigPaths color={colors.sage} opacity={0.09} />
      </G>

      <G stroke={colors.sage} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity={0.18}>
        <Path d="M138,22 Q147,14 143,7 Q135,14 138,22" />
        <Path d="M272,108 Q281,100 277,93 Q269,100 272,108" />
        <Path d="M82,68 Q89,61 85,54 Q78,61 82,68" />
      </G>

      <Circle cx={162} cy={36} r={2.2} fill={colors.terracotta} opacity={0.18} />
      <Circle cx={308} cy={76} r={1.6} fill={colors.border} opacity={0.28} />
      <Circle cx={90} cy={44} r={1.8} fill={colors.saffron} opacity={0.2} />
    </Svg>
  );
}

// Horizontal section divider with a center botanical sprig
export function BotanicalDivider({ color, borderColor, width }) {
  const cx = width / 2;
  return (
    <Svg width={width} height={44} viewBox={`0 0 ${width} 44`}>
      <G fill="none" strokeLinecap="round">
        <Path d={`M0,22 L${cx - 22},22`} stroke={borderColor} strokeWidth="0.6" />
        <Path d={`M${cx + 22},22 L${width},22`} stroke={borderColor} strokeWidth="0.6" />
        <G stroke={color} strokeWidth="1.1">
          <Path d={`M${cx},38 L${cx},10`} />
          <Path d={`M${cx},30 Q${cx + 8},25 ${cx + 11},18`} />
          <Path d={`M${cx},30 Q${cx - 8},25 ${cx - 11},18`} />
          <Path d={`M${cx},20 Q${cx + 5},15 ${cx + 6},10`} />
          <Path d={`M${cx},20 Q${cx - 5},15 ${cx - 6},10`} />
        </G>
      </G>
    </Svg>
  );
}

// Corner botanical accent — position absolutely in a card's corner. Opacity/
// stroke bumped up Aug 28 2026 (Matt: "still not seeing the sprigs on the
// About page") — the original 0.35 opacity + 1px stroke was essentially
// invisible against the cream background at this size.
export function CornerSprig({ color, size = 44, style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" style={style}>
      <G stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity={0.7}>
        <Path d="M40,4 Q22,4 4,40" />
        <Path d="M40,14 Q30,14 22,26" />
        <Path d="M30,4 Q30,14 18,22" />
        <Circle cx={40} cy={4} r={3} fill={color} stroke="none" opacity={0.8} />
        <Circle cx={40} cy={14} r={2} fill={color} stroke="none" opacity={0.65} />
      </G>
    </Svg>
  );
}

// Standalone leaf sprig for inline accents
export function LeafSprig({ color, size = 48, style }) {
  return (
    <Svg width={size * 0.5} height={size} viewBox="0 0 24 48" style={style}>
      <G stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round">
        <Path d="M12,46 L12,4" />
        <Path d="M12,36 Q19,31 21,24 Q15,26 12,32" />
        <Path d="M12,24 Q19,19 21,12 Q15,14 12,20" />
        <Path d="M12,14 Q15,9 14,5" />
        <Path d="M12,30 Q5,25 3,18 Q9,20 12,26" />
        <Path d="M12,18 Q5,13 3,6 Q9,8 12,14" />
      </G>
    </Svg>
  );
}
