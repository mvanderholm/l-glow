import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { recommendations } from '../data/content/recommendations';
import { asanas } from '../data/content/movement';
import { loadTodayPracticeCompletions, togglePracticeCompletion } from '../data/user/storage';

// Extracted verbatim from app/journey.js's OverviewTab (nav restructure,
// Move 1) so both `/` and `/journey` can render the same checklist without
// duplicating buildPractices()/completion logic during the migration.

// Stable ids for the checked-state initializer — independent of whatever
// personalized content buildPractices() fills in, so toggling a checkbox
// never breaks when the dosha/routines data finishes loading after mount.
const PRACTICE_IDS = ['morning', 'move', 'meal', 'mind', 'eve'];

// Deterministic daily pick — stable on refresh, rotates each day. Same
// helper as app/today.js's picks; duplicated rather than shared since it's
// a 3-line pure function, not worth a new module for.
function dailyPick(arr) {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return arr[dayIndex % arr.length];
}

function pickForTime(pool, time) {
  const candidates = pool.filter(item => item.time === time);
  return candidates.length ? dailyPick(candidates) : null;
}

// Daily Practices, personalized where real content exists — pulls from the
// same authored sources already used elsewhere (Daily Rhythms routine
// items, movement.js asanas, recommendations.js foods/meditation) rather
// than inventing anything new. Falls back to the original generic line for
// any slot without dosha-specific content yet.
function buildPractices(dosha, routinesData) {
  const rec = dosha && recommendations[dosha];
  const asanaList = dosha && asanas[dosha];
  const pool = dosha && routinesData
    ? [...(routinesData.anchors ?? []), ...(routinesData.routines[dosha] ?? [])]
    : [];
  const morningPick = pickForTime(pool, 'morning');
  const eveningPick = pickForTime(pool, 'evening');
  const asanaPick = asanaList?.length ? dailyPick(asanaList) : null;
  const foodPick = rec?.foods?.favor?.length ? dailyPick(rec.foods.favor) : null;
  const meditationLine = rec?.meditation ? rec.meditation.split('. ')[0].replace(/\.$/, '') + '.' : null;

  return [
    { id: 'morning', title: 'Morning Ritual',   desc: morningPick?.label ?? 'Warm water, oil pulling, tongue scrape', time: '10 min',                    Icon: SunIcon,    done: false },
    { id: 'move',    title: 'Movement',          desc: asanaPick?.name ?? 'Gentle flow + breath',                     time: asanaPick?.duration ?? '20 min', Icon: BreathIcon, done: false },
    { id: 'meal',    title: 'Nourishing Meal',   desc: foodPick ?? 'Breakfast — warm & grounding',                    time: 'Breakfast',                 Icon: BowlIcon,   done: false },
    { id: 'mind',    title: 'Mindful Moment',    desc: meditationLine ?? 'Seated stillness',                          time: '10 min',                    Icon: LotusIcon,  done: false },
    { id: 'eve',     title: 'Evening Wind Down', desc: eveningPick?.label ?? 'Abhyanga + early rest',                 time: '15 min',                    Icon: MoonIcon,   done: false },
  ];
}

export default function DailyPractices({ dosha, routinesData }) {
  const { theme: { colors: c } } = useTheme();
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(PRACTICE_IDS.map(id => [id, false]))
  );

  useEffect(() => {
    loadTodayPracticeCompletions().then(saved =>
      setChecked(prev => ({ ...prev, ...saved }))
    );
  }, []);

  function toggleChecked(id) {
    setChecked(prev => {
      const done = !prev[id];
      togglePracticeCompletion(id, done);
      return { ...prev, [id]: done };
    });
  }

  const practices = buildPractices(dosha, routinesData);
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
        <Text style={[styles.sectionH, { color: c.text }]}>Daily Practices</Text>
        <Text style={[styles.doneCount, { color: c.textMedium }]}>{doneCount} of {practices.length} completed</Text>
      </View>

      <View style={[styles.track, { backgroundColor: c.border }]}>
        <View style={[styles.fill, { backgroundColor: c.accent, width: `${(doneCount / practices.length) * 100}%` }]} />
      </View>

      <View style={[styles.checkList, { backgroundColor: c.surface, ...card }]}>
        {practices.map((p, idx) => {
          const done = checked[p.id];
          return (
            <Pressable
              key={p.id}
              style={[styles.checkRow, idx < practices.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
              onPress={() => toggleChecked(p.id)}
            >
              <View style={[styles.iconCircle, { backgroundColor: c.surfaceAlt }]}>
                <p.Icon color={c.textMuted} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkTitle, { color: c.text }]}>{p.title}</Text>
                <Text style={[styles.checkDesc, { color: c.textMuted }]}>{p.desc} · {p.time}</Text>
              </View>
              <View style={[styles.checkbox, {
                backgroundColor: done ? c.accent : 'transparent',
                borderColor: done ? c.accent : 'rgba(75,62,58,0.22)',
              }]}>
                {done && <CheckIcon />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function CheckIcon() {
  return <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12l5 5 9-9" stroke="#FFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function SunIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function BreathIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 8c3 0 5 3 5 3s2-3 5-3 5 3 5 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M3 14c2 0 4 2 4 2s2-2 5-2 5 2 5 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function BowlIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3C10 3 7 5 7 8h10c0-3-3-5-5-5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M7 8h10l-1.5 9H8.5L7 8Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function LotusIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={1.4} />
    <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function MoonIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>;
}

const styles = StyleSheet.create({
  sectionH:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
  doneCount:  { fontFamily: 'Inter_500Medium', fontSize: 12.5 },
  track:      { height: 3, borderRadius: 2, marginTop: 10 },
  fill:       { height: 3, borderRadius: 2 },
  checkList:  { borderRadius: 26, overflow: 'hidden', marginTop: 14 },
  checkRow:   { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  checkTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15.5, lineHeight: 20 },
  checkDesc:  { fontFamily: 'Inter_400Regular',  fontSize: 12.5, lineHeight: 17, marginTop: 1 },
  checkbox:   { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
