import { createContext, useContext, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

// Native builds open the app via the custom l-glow:// scheme. Browsers have no
// handler for that, so web needs a real https URL on the same site instead —
// otherwise Supabase's post-verification redirect goes nowhere (confirmed via
// a live signup: the email link itself works, but lands on a dead redirect).
function getRedirectUrl() {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://l-glow.vercel.app/login';
  }
  return 'l-glow://login';
}

// user states:
//   undefined — still checking (initial getSession() hasn't resolved yet)
//   null      — confirmed not signed in
//   object    — Supabase User object (signed in)

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(undefined);
  const [pendingRecovery, setPendingRecovery] = useState(false);
  // Set when an incoming auth link (magic link, email confirmation) fails to
  // exchange for a session — most commonly because it was opened on a
  // different device than the one that requested it. Unlike Firebase's email
  // link flow, Supabase's PKCE links can't be completed with just an email on
  // a second device — the code verifier only exists in the requesting
  // device's local storage. So the recovery here is "request a new one from
  // this device," not "confirm your email and continue."
  const [magicLinkError, setMagicLinkError] = useState(null);

  // Initial session + auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPendingRecovery(true);
        return; // hold off on treating this as a normal signed-in state
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Incoming URL listener — handles magic link / email confirmation / recovery taps.
  // All three arrive as a `code` param under Supabase's PKCE flow; which
  // onAuthStateChange event fires afterward (SIGNED_IN vs PASSWORD_RECOVERY)
  // is what tells them apart, not the URL itself.
  useEffect(() => {
    async function handleUrl(url) {
      if (!url || !url.includes('code=')) return;
      const { error } = await supabase.auth.exchangeCodeForSession(url);
      if (error) {
        setMagicLinkError('That link has expired or was opened on a different device than the one that requested it.');
      }
    }

    Linking.getInitialURL().then(url => { if (url) handleUrl(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  // Returns { needsEmailConfirmation: boolean } — Supabase projects default to
  // requiring email confirmation before a session exists, so signup.js needs
  // to know whether it can navigate the user straight in or should show a
  // "check your email" state instead.
  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: getRedirectUrl() },
    });
    if (error) throw error;
    return { needsEmailConfirmation: !data.session };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectUrl(),
    });
    if (error) throw error;
  }

  // Called from the in-app "set new password" form once a PASSWORD_RECOVERY
  // session is active (see pendingRecovery above).
  async function completeRecovery(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    setPendingRecovery(false);
  }

  async function sendMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: getRedirectUrl() },
    });
    if (error) throw error;
  }

  function clearMagicLinkError() {
    setMagicLinkError(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      pendingRecovery,
      magicLinkError,
      signIn,
      signUp,
      signOut,
      resetPassword,
      completeRecovery,
      sendMagicLink,
      clearMagicLinkError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
