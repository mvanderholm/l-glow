// L. Glow — notify-new-message Edge Function (roadmap #59)
//
// Called by the app right after a message insert succeeds — same
// "client calls the function directly" pattern as notify-intake-complete
// and generate-ai-guidance, not a database trigger. Pushes the *other*
// party in the thread via Expo's push API, using push_tokens
// (data/user/pushNotifications.js).
//
// Deploy via the Supabase dashboard: Edge Functions -> Create a new
// function -> name it "notify-new-message" -> paste this file's contents.
// No new secrets needed — Expo's push endpoint takes no auth for this
// project's setup, same as notify-intake-complete's push half.
//
// Direction depends on who sent the message:
// - A client sending to Thea: no body needed. Every practitioner-role user
//   with a token gets pushed (mirrors notify-intake-complete's
//   pushPractitioners) — there's exactly one practitioner right now, but
//   this doesn't hardcode that.
// - Thea sending to a client: body must include { recipientUserId }, the
//   specific client whose thread this is — there's no way to infer that
//   from the sender alone. Re-checked against consented_to_practitioner_view
//   server-side (not just trusting the client-supplied id), even though the
//   insert's own RLS policy already enforced this at write time — belt and
//   suspenders for a function running under the service role.
//
// Security model: verifies the caller's own JWT (via the anon client) to
// identify who they are, same as notify-intake-complete. Never trusts a
// client-supplied sender identity.
//
// CORS: same preflight handling as every other function here — Supabase
// Edge Functions don't add CORS headers automatically.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// deno-lint-ignore no-explicit-any
async function pushTokensForUsers(admin: any, userIds: string[], title: string, body: string) {
  if (!userIds.length) return;
  const { data: tokens } = await admin.from('push_tokens').select('token').in('user_id', userIds);
  if (!tokens?.length) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(tokens.map((t: { token: string }) => ({ to: t.token, title, body }))),
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Missing Authorization header' }, 401);
  }

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Not authenticated' }, 401);
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: sender } = await admin
    .from('users')
    .select('role, display_name, email')
    .eq('id', user.id)
    .maybeSingle();

  const senderLabel = sender?.display_name || sender?.email || 'Someone';

  try {
    if (sender?.role === 'practitioner') {
      const body = await req.json().catch(() => ({}));
      const recipientUserId = body?.recipientUserId;
      if (!recipientUserId) {
        return jsonResponse({ error: 'recipientUserId is required when a practitioner sends a message' }, 400);
      }
      const { data: client } = await admin
        .from('users')
        .select('id, consented_to_practitioner_view')
        .eq('id', recipientUserId)
        .maybeSingle();
      if (!client?.consented_to_practitioner_view) {
        return jsonResponse({ error: 'That client has not consented to practitioner contact' }, 403);
      }
      await pushTokensForUsers(admin, [recipientUserId], 'New message from Thea', 'Open L. Glow to read it.');
    } else {
      const { data: practitioners } = await admin.from('users').select('id').eq('role', 'practitioner');
      const ids = (practitioners ?? []).map((p: { id: string }) => p.id);
      await pushTokensForUsers(admin, ids, 'New message', `${senderLabel} sent you a message.`);
    }
  } catch (err) {
    // Best-effort, same as notify-intake-complete's push half — a push
    // failure shouldn't read as "the message failed to send," since the
    // insert already succeeded before this function was ever called.
    console.warn('Push notification failed (non-fatal):', (err as Error).message);
  }

  return jsonResponse({ status: 'sent' });
});
