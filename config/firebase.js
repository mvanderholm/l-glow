import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace these values with your Firebase project config.
// Firebase console → Project Settings → General → Your apps → Web app config.
// Firebase client config is not a secret — security is enforced by Firebase Security Rules.
const firebaseConfig = {
  apiKey:            'REPLACE_WITH_YOUR_API_KEY',
  authDomain:        'REPLACE_WITH_YOUR_AUTH_DOMAIN',
  projectId:         'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket:     'REPLACE_WITH_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_YOUR_MESSAGING_SENDER_ID',
  appId:             'REPLACE_WITH_YOUR_APP_ID',
};

// Guard against double-initialization in Expo fast refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
