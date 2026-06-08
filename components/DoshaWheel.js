import { View, Text } from 'react-native';
import Svg, { Circle as SvgCircle, G, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Colors matched to the style guide — muted earthy tones, not saturated
export const DOSHA_COLORS = {
  vata:  '#C4A8A4',   // soft dusty rose
  pitta: '#A07068',   // muted terracotta rose
  kapha: '#7A9870',   // muted sage green
};

const DOSHAS = ['vata', 'pitta', 'kapha'];
const IC = 'rgba(255,255,255,0.72)'; // icon stroke/fill color

export function DoshaWheel({ scores, size = 240, labelsInside = false }) {
  const { theme: { colors: c } } = useTheme();

  const total = (scores.vata + scores.pitta + scores.kapha) || 1;
  const pcts = {
    vata:  Math.round((scores.vata  / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  // Circle radii scale with percentage share
  const minR = size * 0.165;
  const maxR = size * 0.275;
  const rFor = d => minR + (maxR - minR) * (pcts[d] / 100);

  // Tight equilateral triangle — circles overlap ~30% of diameter
  const half = size * 0.138;
  const triH = half * Math.sqrt(3);
  // labelsInside: tighter layout — circles centered in the SVG, no room needed above for outside labels
  const yTop = labelsInside ? size * 0.33 : size * 0.48;
  const cx   = size / 2;

  const cV = { x: cx - half, y: yTop };           // Vata  — top left
  const cP = { x: cx + half, y: yTop };           // Pitta — top right
  const cK = { x: cx,        y: yTop + triH };    // Kapha — bottom center

  // Triangle centroid — where the center flower goes
  const flX = cx;
  const flY = yTop + triH / 3;

  const rV = rFor('vata');
  const rP = rFor('pitta');
  const rK = rFor('kapha');

  // Icon centers — pushed outward from triangle center into each circle's exclusive zone
  const iV = { x: cV.x - 0.42 * rV, y: cV.y - 0.24 * rV };   // upper-left of Vata
  const iP = { x: cP.x + 0.42 * rP, y: cP.y - 0.24 * rP };   // upper-right of Pitta
  const iK = { x: cK.x,              y: cK.y + 0.40 * rK };   // lower of Kapha

  // Icon sizing unit — proportional to component size
  const s = size * 0.060;

  // ── Precomputed path strings ────────────────────────────────────────────────

  // Sun icon (Vata): 8 rays from inner gap to outer tip
  const sunRays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const rad = a * Math.PI / 180;
    const x1 = (s * 0.42) * Math.sin(rad);
    const y1 = -(s * 0.42) * Math.cos(rad);
    const x2 = (s * 0.78) * Math.sin(rad);
    const y2 = -(s * 0.78) * Math.cos(rad);
    return `M ${x1.toFixed(3)} ${y1.toFixed(3)} L ${x2.toFixed(3)} ${y2.toFixed(3)}`;
  }).join(' ');

  // Herb sprig (Pitta): central stem + two pairs of leaves + top tip
  const sprigW  = (v) => (v * s).toFixed(3);
  const sprig = [
    `M 0 ${sprigW(0.83)} L 0 ${sprigW(-0.83)}`,
    `M 0 ${sprigW(0.32)} Q ${sprigW(-0.60)} ${sprigW(0.09)} ${sprigW(-0.60)} ${sprigW(-0.19)}`,
    `M 0 ${sprigW(0.32)} Q ${sprigW(0.60)}  ${sprigW(0.09)} ${sprigW(0.60)}  ${sprigW(-0.19)}`,
    `M 0 ${sprigW(-0.09)} Q ${sprigW(-0.51)} ${sprigW(-0.33)} ${sprigW(-0.46)} ${sprigW(-0.65)}`,
    `M 0 ${sprigW(-0.09)} Q ${sprigW(0.51)}  ${sprigW(-0.33)} ${sprigW(0.46)}  ${sprigW(-0.65)}`,
  ].join(' ');

  // Leaf (Kapha): oval outline + center vein + side veins
  const lf  = (v) => (v * s).toFixed(3);
  const leafOutline = `M 0 ${lf(0.79)} C ${lf(-0.56)} ${lf(0.37)} ${lf(-0.56)} ${lf(-0.37)} 0 ${lf(-0.79)} C ${lf(0.56)} ${lf(-0.37)} ${lf(0.56)} ${lf(0.37)} 0 ${lf(0.79)}`;
  const leafVeins   = `M 0 ${lf(0.79)} L 0 ${lf(-0.79)} M 0 ${lf(0.09)} L ${lf(-0.37)} ${lf(-0.19)} M 0 ${lf(0.09)} L ${lf(0.37)} ${lf(-0.19)} M 0 ${lf(0.42)} L ${lf(-0.23)} ${lf(0.19)} M 0 ${lf(0.42)} L ${lf(0.23)} ${lf(0.19)}`;

  // Center flower petal (single, pointing up, cubic bezier)
  // L = petal length, W = half-width at widest
  const pL = s * 1.22;
  const pW = s * 0.33;
  const petalD = `M 0 0 C ${(-pW).toFixed(3)} ${(-pL * 0.28).toFixed(3)} ${(-pW).toFixed(3)} ${(-pL * 0.72).toFixed(3)} 0 ${(-pL).toFixed(3)} C ${pW.toFixed(3)} ${(-pL * 0.72).toFixed(3)} ${pW.toFixed(3)} ${(-pL * 0.28).toFixed(3)} 0 0`;

  const labelGap = size * 0.04;
  const svgH = labelsInside ? size : size * 1.22;

  return (
    <View style={{ width: size, height: svgH, alignSelf: 'center' }}>
      <Svg width={size} height={svgH} style={{ position: 'absolute', top: 0, left: 0 }}>

        {/* ── Three Venn circles ── */}
        {[{ d: 'vata', ctr: cV }, { d: 'pitta', ctr: cP }, { d: 'kapha', ctr: cK }].map(({ d, ctr }) => (
          <SvgCircle key={d} cx={ctr.x} cy={ctr.y} r={rFor(d)} fill={DOSHA_COLORS[d]} opacity={0.84} />
        ))}

        {/* ── Dosha icons — only when labels are outside ── */}
        {!labelsInside && (
          <>
            <G transform={`translate(${iV.x.toFixed(2)},${iV.y.toFixed(2)})`} opacity="0.80">
              <SvgCircle cx="0" cy="0" r={s * 0.26} fill="none" stroke={IC} strokeWidth={s * 0.11} />
              <Path d={sunRays} stroke={IC} strokeWidth={s * 0.11} strokeLinecap="round" />
            </G>
            <G transform={`translate(${iP.x.toFixed(2)},${iP.y.toFixed(2)})`} opacity="0.80">
              <Path d={sprig} stroke={IC} strokeWidth={s * 0.12} strokeLinecap="round" fill="none" />
            </G>
            <G transform={`translate(${iK.x.toFixed(2)},${iK.y.toFixed(2)})`} opacity="0.80">
              <Path d={leafOutline} stroke={IC} strokeWidth={s * 0.12} fill="none" strokeLinecap="round" />
              <Path d={leafVeins}   stroke={IC} strokeWidth={s * 0.09} fill="none" strokeLinecap="round" />
            </G>
          </>
        )}

        {/* ── Center lotus flower — always shown ── */}
        <G transform={`translate(${flX.toFixed(2)},${flY.toFixed(2)})`}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
            <G key={deg} transform={`rotate(${deg})`}>
              <Path d={petalD} fill="rgba(255,255,255,0.80)" />
            </G>
          ))}
          <SvgCircle cx="0" cy="0" r={s * 0.28} fill="rgba(255,255,255,0.88)" />
        </G>

        {/* ── Inside labels — dosha name + % in each circle's exclusive zone ── */}
        {labelsInside && DOSHAS.map(d => {
          const ctr = d === 'vata' ? cV : d === 'pitta' ? cP : cK;
          const r   = rFor(d);
          const ox  = d === 'vata' ? -0.26 : d === 'pitta' ? 0.26 : 0;
          const oy  = d === 'kapha' ? 0.30 : -0.10;
          const tx  = ctr.x + ox * r;
          const ty  = ctr.y + oy * r;
          const nSz = size * 0.052;
          const pSz = size * 0.080;
          const name = d.charAt(0).toUpperCase() + d.slice(1);
          return (
            <G key={`lbl-${d}`} transform={`translate(${tx.toFixed(2)},${ty.toFixed(2)})`}>
              <SvgText
                textAnchor="middle" fontStyle="italic" fontFamily="Georgia, serif"
                fontSize={nSz} fill="rgba(255,255,255,0.90)" y={-pSz * 0.45}
              >
                {name}
              </SvgText>
              <SvgText
                textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold"
                fontSize={pSz} fill="rgba(255,255,255,0.85)" y={nSz * 0.6 + pSz * 0.5}
              >
                {pcts[d]}%
              </SvgText>
            </G>
          );
        })}

      </Svg>

      {/* ── Labels outside circles — only when not labelsInside ── */}
      {!labelsInside && (
        <>
          <View style={{ position: 'absolute', right: size - cV.x, top: cV.y - rV - labelGap - 34, alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', color: c.textMuted, lineHeight: 13 }}>Vata</Text>
            <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 22, color: DOSHA_COLORS.vata }}>{pcts.vata}%</Text>
          </View>
          <View style={{ position: 'absolute', left: cP.x, top: cP.y - rP - labelGap - 34, alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', color: c.textMuted, lineHeight: 13 }}>Pitta</Text>
            <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 22, color: DOSHA_COLORS.pitta }}>{pcts.pitta}%</Text>
          </View>
          <View style={{ position: 'absolute', left: cx - 28, top: cK.y + rK + labelGap, alignItems: 'center', width: 56 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', color: c.textMuted, lineHeight: 13 }}>Kapha</Text>
            <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 22, color: DOSHA_COLORS.kapha }}>{pcts.kapha}%</Text>
          </View>
        </>
      )}

    </View>
  );
}
