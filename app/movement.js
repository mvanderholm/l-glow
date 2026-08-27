import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Flattened into /explore's Practices section (nav restructure, Move 4) —
// Breathwork/Meditation/Self-Massage are ported there directly.
export default function Movement() {
  useEffect(() => { router.replace('/explore'); }, []);
  return <View />;
}
