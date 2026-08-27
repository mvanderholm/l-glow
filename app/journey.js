import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Retired into /you (nav restructure, Move 3) — Daily Practices moved to
// components/DailyPractices.js (shared with Today), the Prakriti/Vikriti
// wheels became components/Constitution.js's percentage bars, the
// Ayurveda history/herbs essays and Cycles content moved to
// data/content/ayurvedaEssays.js + app/cycles.js (linked from /explore's
// "From Thea"), and the check-in trend chart's simple version now lives
// inline on /you's History card. Kept as a redirect so old bookmarks/deep
// links (including the ?tab=cycles one data/searchIndex.js used to build)
// still resolve.
export default function Journey() {
  useEffect(() => { router.replace('/you'); }, []);
  return <View />;
}
