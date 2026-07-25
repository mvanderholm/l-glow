import { View, Text, Pressable } from 'react-native';
import { useState, Fragment } from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// A gap this long or longer breaks the line instead of connecting across it —
// real users don't check in daily (confirmed against live data before
// building this: a real early tester's 9 check-ins span 6 weeks with gaps up
// to 16 days). A straight line across a multi-week gap would visually imply
// a trend that was never measured; breaking it is the honest read. Chosen
// loosely rather than tuned — revisit if real usage patterns suggest
// otherwise once there's more data to look at.
const GAP_BREAK_DAYS = 4;

function parseDate(d) {
  return new Date(d + 'T12:00:00');
}

function formatShort(d) {
  return parseDate(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// data: [{ date: 'YYYY-MM-DD', value: number }], ascending, pre-filtered to
// one dimension with no null values. Caller (HabitsTab) owns the "not enough
// data yet" empty state — this component assumes at least 2 real points.
//
// Y-axis is always plain numeric (1/3/5), never the dimension's low/high
// hint text (e.g. "genuinely hungry") — that text wraps into an unreadable
// vertical stack in the ~24px axis column and collides with the x-axis date
// label below it. Caught by actually rendering and looking at it, not
// assumed. If the hint text matters, show it as a caption outside the chart.
export default function CheckinTrendChart({ data, color, min = 1, max = 5 }) {
  const { theme: { colors: c } } = useTheme();
  const [selected, setSelected] = useState(data.length - 1);

  if (data.length < 2) return null;

  const height = 190;
  const width = 320; // viewBox unit space; renders at width="100%" so this only sets the aspect ratio
  const padL = 30, padR = 12, padT = 16, padB = 4;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const times = data.map(d => parseDate(d.date).getTime());
  const minT = times[0];
  const span = Math.max(times[times.length - 1] - minT, 1);

  const xOf = t => padL + ((t - minT) / span) * plotW;
  const yOf = v => padT + (1 - (v - min) / (max - min)) * plotH;

  const points = data.map((d, i) => ({ ...d, t: times[i], x: xOf(times[i]), y: yOf(d.value) }));

  const segments = [];
  let current = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const gapDays = (points[i].t - points[i - 1].t) / 86400000;
    if (gapDays > GAP_BREAK_DAYS) { segments.push(current); current = [points[i]]; }
    else current.push(points[i]);
  }
  segments.push(current);

  const gridValues = [min, (min + max) / 2, max];
  const activePoint = points[selected];

  return (
    <View>
      <View style={{ height, position: 'relative' }}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {gridValues.map(v => (
            <Line key={v} x1={padL} x2={width - padR} y1={yOf(v)} y2={yOf(v)} stroke={c.border} strokeWidth={1} />
          ))}

          {segments.filter(seg => seg.length > 1).map((seg, si) => {
            const linePath = seg.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            const areaPath = `${linePath} L ${seg[seg.length - 1].x} ${yOf(min)} L ${seg[0].x} ${yOf(min)} Z`;
            return (
              <Fragment key={si}>
                <Path d={areaPath} fill={color} fillOpacity={0.14} />
                <Path d={linePath} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Fragment>
            );
          })}

          {points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x} cy={p.y}
              r={selected === i ? 5 : 3.5}
              fill={selected === i ? color : c.surface}
              stroke={color}
              strokeWidth={2}
            />
          ))}
        </Svg>

        {/* y-axis labels — always plain numeric, see the component comment above */}
        {gridValues.map(v => (
          <Text
            key={v}
            style={{ position: 'absolute', left: 0, top: yOf(v) - 7, fontSize: 10.5, fontFamily: 'Inter_500Medium', color: c.textMuted, width: padL - 8 }}
          >
            {Math.round(v)}
          </Text>
        ))}

        {/* tap targets, one per point */}
        {points.map((p, i) => (
          <Pressable
            key={i}
            onPress={() => setSelected(i)}
            style={{ position: 'absolute', left: `${(p.x / width) * 100}%`, top: p.y - 14, width: 28, height: 28, marginLeft: -14 }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
        <Text style={{ fontSize: 10.5, fontFamily: 'Inter_400Regular', color: c.textMuted }}>{formatShort(points[0].date)}</Text>
        <Text style={{ fontSize: 10.5, fontFamily: 'Inter_400Regular', color: c.textMuted }}>{formatShort(points[points.length - 1].date)}</Text>
      </View>

      {activePoint && (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, color: c.text }}>
            {activePoint.value} <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: c.textMuted }}>· {formatShort(activePoint.date)}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}
