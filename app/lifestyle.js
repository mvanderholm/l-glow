import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Flattened into /explore (nav restructure, Move 4) — Daily Check-in,
// Tongue Check, Journal, and Affirmations are all reachable from the new
// 4-tab structure already; this stub just catches old bookmarks/links.
export default function Lifestyle() {
  useEffect(() => { router.replace('/explore'); }, []);
  return <View />;
}
