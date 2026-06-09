import { createContext, useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);
const MAGIC_EMAIL_KEY = '@lglow/magic_link_email';

// actionCodeSettings for email link sign-in.
// The url must be authorized in Firebase console → Authentication → Settings → Authorized domains.
// 'https://l-glow.firebaseapp.com' is authorized by default for every Firebase project.
const ACTION_CODE_SETTINGS = {
  url: 'https://l-glow.firebaseapp.com',
  handleCodeInApp: true,
  iOS:     { bundleId: 'com.lglow.app' },
  android: { packageName: 'com.lglow.app', installApp: true },
};

// user states:
//   undefined — still checking (Firebase resolves onAuthStateChanged async)
//   null      — confirmed not signed in
//   object    — Firebase User object (signed in)

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(undefined);
  // If the magic link is opened on a device with no stored email, we surface
  // this URL so the login screen can prompt the user to confirm their address.
  const [pendingMagicUrl, setPendingMagicUrl] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null));
    return unsub;
  }, []);

  // Incoming URL listener — handles magic link taps
  useEffect(() => {
    async function handleUrl(url) {
      if (!url || !isSignInWithEmailLink(auth, url)) return;
      const stored = await AsyncStorage.getItem(MAGIC_EMAIL_KEY);
      if (stored) {
        // Happy path: email is cached on this device
        try {
          await signInWithEmailLink(auth, stored, url);
          await AsyncStorage.removeItem(MAGIC_EMAIL_KEY);
        } catch (_) {
          // Link expired or already used — let user try again
          setPendingMagicUrl(null);
        }
      } else {
        // Link opened on a different device — surface so login screen can prompt
        setPendingMagicUrl(url);
      }
    }

    Linking.getInitialURL().then(url => { if (url) handleUrl(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function sendMagicLink(email) {
    await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS);
    await AsyncStorage.setItem(MAGIC_EMAIL_KEY, email);
  }

  // Called by login screen when user confirms their email on the "wrong device" prompt
  async function completeMagicLink(email, url) {
    await signInWithEmailLink(auth, email, url ?? pendingMagicUrl);
    await AsyncStorage.removeItem(MAGIC_EMAIL_KEY);
    setPendingMagicUrl(null);
  }

  function clearPendingMagicUrl() {
    setPendingMagicUrl(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      pendingMagicUrl,
      signIn,
      signUp,
      signOut,
      resetPassword,
      sendMagicLink,
      completeMagicLink,
      clearPendingMagicUrl,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
