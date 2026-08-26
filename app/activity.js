import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { loadRecentCheckins, loadRecentIntentions, loadRecentPracticeCompletions } from '../data/user/storage';
import { smartBack } from '../components/BackButton';
import Header from '../components/Header';

// Your Activity — Matt's ask, Aug 12 2026: check-ins already had a
// practitioner-side log (ClientDetail's Check-ins tab), but nothing showed
// the client their own history, and "Just for today I will..." picks were
// never logged anywhere at all, for anyone, past today. This merges the
// three things a person actually does day to day — check-ins, intentions,
// completed daily practices — into one chronological log, same spirit as
// the practitioner Dashboard's "Recent activity" feed, just scoped to one
// person instead of every client.
//
// Keep in sync with app/journey.js's PRACTICE_IDS/buildPractices if the
// slot set ever changes — not shared as a real import since journey.js's
// titles live inline in a JSX-returning function, not a standalone export.
const PRACTICE_TITLES = {
  morning: 'Morning Ritual',
  move:    'Movement',
  meal:    'Nourishing Meal',
  mind:    'Mindful Moment',
  eve:     'Evening Wind Down',
};

const DAYS = 90; // matches the window CheckinTrendChart / Journey's Habits tab already established

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function buildDays(checkins, intentions, practices) {
  const byDate = {};
  const touch = date => (byDate[date] ??= { date, checkin: null, intention: null, practices: [] });

  for (const ci of checkins) touch(ci.date).checkin = ci;
  for (const it of intentions) touch(it.date).intention = it.text;
  for (const p of practices) {
    const done = Object.entries(p.completions ?? {}).filter(([, v]) => v).map(([id]) => PRACTICE_TITLES[id] ?? id);
    if (done.length) touch(p.date).practices = done;
  }

  return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
}

export default function Activity() {
  const { theme: { colors: c } } = useTheme();
  const [days, setDays] = useState(null); // null = loading

  useEffect(() => {
    Promise.all([
      loadRecentCheckins(DAYS),
      loadRecentIntentions(DAYS),
      loadRecentPracticeCompletions(DAYS),
    ]).then(([checkins, intentions, practices]) => {
      setDays(buildDays(checkins, intentions, practices));
    });
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <Header title="Your Activity" left="back" onBack={() => smartBack('/you')} bordered />
      {days === null ? (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          <Text style={[s.intro, { color: c.textMuted }]}>
            Every check-in, intention, and daily practice you've logged — last {DAYS} days.
          </Text>

          {days.length === 0 ? (
            <Text style={[s.emptyText, { color: c.textMuted }]}>
              Nothing here yet — your check-ins, intentions, and daily practices will show up here as you go.
            </Text>
          ) : (
            days.map(day => (
              <View key={day.date} style={[s.dayCard, { backgroundColor: c.surface, ...card }]}>
                <Text style={[s.dayDate, { color: c.text }]}>{formatDate(day.date)}</Text>

                {day.checkin && (
                  <Text style={[s.line, { color: c.textMedium }]}>
                    Check-in — P{day.checkin.values?.physical} M{day.checkin.values?.mental} E{day.checkin.values?.emotional}
                    {day.checkin.values?.hunger != null ? ` H${day.checkin.values.hunger}` : ''}
                    {day.checkin.values?.tongue != null ? ` T${day.checkin.values.tongue}` : ''}
                    {day.checkin.note ? ` — "${day.checkin.note}"` : ''}
                  </Text>
                )}

                {day.intention && (
                  <Text style={[s.line, s.intentionLine, { color: c.text }]}>
                    "Just for today, {day.intention}"
                  </Text>
                )}

                {day.practices.length > 0 && (
                  <View style={s.practiceRow}>
                    {day.practices.map(title => (
                      <View key={title} style={[s.practiceTag, { backgroundColor: c.surfaceAlt }]}>
                        <Text style={[s.practiceTagText, { color: c.textMedium }]}>{title}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  centerPad:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  intro:      { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginBottom: 18 },
  emptyText:  { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 40 },
  dayCard:    { borderRadius: 16, padding: 16, marginBottom: 10 },
  dayDate:    { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, marginBottom: 8 },
  line:       { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, marginBottom: 4 },
  intentionLine: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 14.5, lineHeight: 20 },
  practiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  practiceTag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  practiceTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
});
