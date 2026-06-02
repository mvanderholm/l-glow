import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

export const DOSHA_COLORS = {
  vata:  '#8B7BA8',
  pitta: '#E8A030',
  kapha: '#4A8FA8',
};

const DOSHAS = ['vata', 'pitta', 'kapha'];

function polarToCartesian(cx, cy, r, deg) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(cx, cy, outerR, innerR, startDeg, endDeg) {
  const p1 = polarToCartesian(cx, cy, outerR, startDeg);
  const p2 = polarToCartesian(cx, cy, outerR, endDeg);
  const p3 = polarToCartesian(cx, cy, innerR, endDeg);
  const p4 = polarToCartesian(cx, cy, innerR, startDeg);
  const large = (endDeg - startDeg) > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    `L ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x.toFixed(3)} ${p4.y.toFixed(3)}`,
    'Z',
  ].join(' ');
}

export function DoshaWheel({ scores, primary, size = 200 }) {
  const { theme: { colors: c, type, spacing } } = useTheme();

  const total = (scores.vata + scores.pitta + scores.kapha) || 1;
  const pcts = {
    vata:  Math.round((scores.vata  / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  const cx = size / 2, cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.27;
  const GAP = 4;
  const active = DOSHAS.filter(d => scores[d] > 0);
  const totalGap = GAP * active.length;

  let angle = 0;
  const segments = active.map(dosha => {
    const span = (scores[dosha] / total) * (360 - totalGap);
    const start = angle;
    const end = start + span;
    angle = end + GAP;
    return { dosha, start, end };
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map(({ dosha, start, end }) => (
            <Path
              key={dosha}
              d={segmentPath(cx, cy, outerR, innerR, start, end)}
              fill={DOSHA_COLORS[dosha]}
            />
          ))}
        </Svg>

        {/* Center label */}
        <View style={{
          position: 'absolute',
          top: 0, left: 0,
          width: size, height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={[type.label, { fontSize: 9, color: c.textMuted, letterSpacing: 1 }]}>
            PRAKRITI
          </Text>
          <Text style={[type.h2, { color: DOSHA_COLORS[primary], marginTop: 2, textTransform: 'capitalize' }]}>
            {primary}
          </Text>
          <Text style={[type.muted, { fontSize: 13 }]}>{pcts[primary]}%</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md }}>
        {DOSHAS.map(dosha => (
          <View key={dosha} style={{ alignItems: 'center', gap: 4 }}>
            <View style={{
              width: 10, height: 10, borderRadius: 5,
              backgroundColor: DOSHA_COLORS[dosha],
              opacity: scores[dosha] > 0 ? 1 : 0.25,
            }} />
            <Text style={{
              color: c.textMuted, fontSize: 10, fontWeight: '700',
              letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              {dosha}
            </Text>
            <Text style={{ color: c.text, fontSize: 17, fontWeight: '600' }}>
              {pcts[dosha]}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
