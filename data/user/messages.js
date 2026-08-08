import { supabase } from '../../config/supabase';

// In-app messaging (roadmap #59) — one flat thread per client, `user_id`
// identifies whose thread a row belongs to regardless of who actually sent
// it (see supabase/migrations/20260807030000_messages.sql for the full
// reasoning). No AsyncStorage layer here unlike most of data/user/storage.js
// — messages only make sense signed-in and synced, there's no useful
// offline-local version of someone else's reply.

export async function loadMessages(threadUserId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', threadUserId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Fire-and-forget notify, same "insert first, notify after, swallow push
// failures" shape as app/intake.js's notifyIntakeComplete — the message
// send itself has already succeeded by the time this runs.
async function notifyNewMessage(recipientUserId) {
  try {
    await supabase.functions.invoke('notify-new-message', {
      body: recipientUserId ? { recipientUserId } : {},
    });
  } catch (err) {
    console.warn('Message notification failed:', err.message);
  }
}

// Called from the client side — always sends into their own thread.
export async function sendMessageAsClient(userId, body) {
  const { error } = await supabase.from('messages').insert({ user_id: userId, sender_id: userId, body });
  if (error) throw error;
  notifyNewMessage(); // no recipient id — function looks up all practitioners
}

// Called from the Practitioner Hub — sends into a specific client's thread.
export async function sendMessageAsPractitioner(clientUserId, senderId, body) {
  const { error } = await supabase.from('messages').insert({ user_id: clientUserId, sender_id: senderId, body });
  if (error) throw error;
  notifyNewMessage(clientUserId);
}
