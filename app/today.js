import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

// Merged into `/` (nav restructure, Move 1) — the multi-check-in dot rows,
// pillar cards, and Today's Rhythm strip this screen used to render now
// live inline on Home (TodayCheckIn, DailyPractices, TodaysGuidance, the
// always-visible Daily Rhythms section). Kept as a redirect so old
// bookmarks/deep links still resolve.
export default function Today() {
  useEffect(() => { router.replace('/'); }, []);
  return <View />;
}
