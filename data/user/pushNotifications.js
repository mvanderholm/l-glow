import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '../../config/supabase';

// Registers this device for push notifications and upserts the Expo push
// token to Supabase under the signed-in user. Best-effort, fire-and-forget —
// same spirit as storage.js's syncToSupabase — a failure here must never
// block sign-in or crash the app, it just means this device won't receive
// pushes yet.
//
// Infrastructure only, Aug 7 2026 — no messaging feature exists yet to
// notify about (see roadmap #59). First real consumer wired: pushing Thea
// when a client completes an intake form, alongside the existing
// notify-intake-complete email. Cannot be verified end to end without a
// real native build — expo-notifications does not deliver real remote push
// in Expo Go or a web browser, only local/simulated notifications.
export async function registerForPushNotifications(userId) {
  if (!userId || Platform.OS === 'web') return null;
  try {
    if (!Device.isDevice) return null; // simulators/emulators can't receive real push

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    if (!token) return null;

    await supabase.from('push_tokens').upsert(
      { user_id: userId, token, platform: Platform.OS },
      { onConflict: 'user_id,token' }
    );

    return token;
  } catch (err) {
    console.warn('Push notification registration failed (non-fatal):', err.message);
    return null;
  }
}
