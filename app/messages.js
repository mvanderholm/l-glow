import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// Merged into /thea (nav restructure, Move 3) — the same thread/composer
// logic (loadMessages/sendMessageAsClient) now lives there.
export default function Messages() {
  useEffect(() => { router.replace('/thea'); }, []);
  return <View />;
}
