import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Project URL + anon (publishable) key — from Supabase dashboard: Settings → API.
// Not a secret — this key is safe on the client. Data access is enforced by
// Postgres Row Level Security policies, not by keeping this key hidden.
// Real values live in .env.local (gitignored) as EXPO_PUBLIC_* vars.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // We handle incoming auth deep links ourselves (see AuthContext), so the
    // client shouldn't also try to parse the URL — that's a web-only concern.
    detectSessionInUrl: false,
  },
});
