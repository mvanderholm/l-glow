import { createContext, useContext, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { hydrateFromSupabase, migrateLocalToSupabase } from '../data/user/storage';
import { hydrateIntake, migrateIntake } from '../app/intake';
import { hydrateJournal, migrateJournal } from '../app/journal';
import { registerForPushNotifications } from '../data/user/pushNotifications';

const AuthContext = createContext(null);

// Pulls existing Supabase data down into a fresh device's AsyncStorage —
// only fills in what's missing locally, never overwrites. Fire-and-forget:
// never blocks sign-in, and any failure is swallowed inside each hydrate
// helper (same best-effort spirit as the write path in data/user/storage.js).
function hydrateAll(userId) {
  hydrateFromSupabase();
  hydrateIntake(userId);
  hydrateJournal(userId);
}

// Reverse direction: pushes pre-existing local data (from before this device
// ever had an account) up to Supabase. Runs once per device — see
// migrateLocalToSupabase()'s own comment for the completion-flag and
// never-overwrite details. Fire-and-forget, same as hydrateAll above.
function migrateAll(userId) {
  migrateLocalToSupabase();
  migrateIntake(userId);
  migrateJournal(userId);
}

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

// role mirrors the same three-state shape as user, checked once here instead
// of in every screen that cares whether this account is a practitioner (the
// hamburger drawer's Practitioner Hub entry, and app/practitioner/_layout.js's
// route gate, which used to run this exact query itself — see that file):
//   undefined — still checking, or no session yet
//   null      — signed in but the role lookup failed or returned nothing
//   string    — the real value from users.role ('user' or 'practitioner')
//
// Returns false if the account's own row is invisible under RLS — the only
// signal the app gets that a soft-delete happened (a deactivated account's
// own "read their own row" policy excludes it entirely, see
// 20260730040000_soft_delete_users.sql). maybeSingle(), not single(), so a
// missing row is `data: null` instead of throwing.
async function fetchRole(userId, setRole) {
  const { data, error } = await supabase.from('users').select('role').eq('id', userId).maybeSingle();
  if (error) { console.error('Role fetch failed:', error.message, error); setRole(null); return true; }
  if (!data) return false;
  setRole(data.role ?? null);
  return true;
}

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(undefined);
  const [role, setRole]           = useState(undefined);
  const [pendingRecovery, setPendingRecovery] = useState(false);
  // Set when an incoming auth link (magic link, email confirmation) fails to
  // exchange for a session — most commonly because it was opened on a
  // different device than the one that requested it. Unlike Firebase's email
  // link flow, Supabase's PKCE links can't be completed with just an email on
  // a second device — the code verifier only exists in the requesting
  // device's local storage. So the recovery here is "request a new one from
  // this device," not "confirm your email and continue."
  const [magicLinkError, setMagicLinkError] = useState(null);
  // Set when a session turns out to belong to a soft-deleted account — see
  // fetchRole's comment. Forces sign-out the moment this is detected rather
  // than leaving a half-authenticated session with no visible data.
  const [accountDeactivated, setAccountDeactivated] = useState(false);

  // Initial session + auth state listener
  useEffect(() => {
    async function handleSession(session) {
      if (!session?.user) { setUser(null); setRole(null); return; }
      const stillActive = await fetchRole(session.user.id, setRole);
      if (!stillActive) {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        setAccountDeactivated(true);
        return;
      }
      setUser(session.user);
      hydrateAll(session.user.id);
      migrateAll(session.user.id);
      registerForPushNotifications(session.user.id);
    }

    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPendingRecovery(true);
        return; // hold off on treating this as a normal signed-in state
      }
      handleSession(session);
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

  function clearAccountDeactivated() {
    setAccountDeactivated(false);
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isPractitioner: role === 'practitioner',
      pendingRecovery,
      magicLinkError,
      accountDeactivated,
      signIn,
      signUp,
      signOut,
      resetPassword,
      completeRecovery,
      sendMagicLink,
      clearMagicLinkError,
      clearAccountDeactivated,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
