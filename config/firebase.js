import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace these values with your Firebase project config.
// Firebase console → Project Settings → General → Your apps → Web app config.
// Firebase client config is not a secret — security is enforced by Firebase Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyBc8T2WYASuzHHNU-Zj-_4jfq92AQjxC6E",
  authDomain: "l-glow.firebaseapp.com",
  projectId: "l-glow",
  storageBucket: "l-glow.firebasestorage.app",
  messagingSenderId: "996011676131",
  appId: "1:996011676131:web:b1a72c63a5a3bd214850d6"
};

// Guard against double-initialization in Expo fast refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
