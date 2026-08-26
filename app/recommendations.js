import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Merged into `/` (nav restructure, Move 1) — Today's Guidance (collapsed to
// 4 rows), Agni, and Daily Rhythms now live inline on Home. Kept as a
// redirect so old bookmarks/deep links (including search results that used
// to pass ?dosha=) still resolve.
export default function Recommendations() {
  useEffect(() => { router.replace('/'); }, []);
  return <View />;
}
