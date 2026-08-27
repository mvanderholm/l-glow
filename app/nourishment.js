import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Flattened into /explore (nav restructure, Move 4) — its "coming soon"
// teasers (Food Guide, Freedom with Food, Weight Balancing) moved there
// verbatim; Today's Guidance already carries the real nourishment content.
export default function Nourishment() {
  useEffect(() => { router.replace('/explore'); }, []);
  return <View />;
}
