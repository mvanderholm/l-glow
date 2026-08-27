import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Merged into /explore's own search bar (nav restructure, Move 4), reusing
// the same data/searchIndex.js this screen used to own.
export default function Search() {
  useEffect(() => { router.replace('/explore'); }, []);
  return <View />;
}
