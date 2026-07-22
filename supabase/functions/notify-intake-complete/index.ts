// L. Glow — notify-intake-complete Edge Function
//
// Called by the app once a client's intake form reaches 100% complete.
// Emails Thea a heads-up so she can check the practitioner dashboard,
// instead of her having to check manually with no signal at all (the gap
// flagged in roadmap #30 as "explicitly deferred").
//
// Deploy via the Supabase dashboard: Edge Functions -> Create a new
// function -> name it "notify-intake-complete" -> paste this file's
// contents. Then set the RESEND_API_KEY secret under Edge Functions ->
// Secrets (or Project Settings -> Edge Functions).
//
// Security model: verifies the caller's own JWT (via the anon client) to
// identify who they are, then does everything else — reading their
// display name/email, checking/writing notified_at — with the service
// role, which bypasses RLS. A client can only ever trigger a notification
// about themselves; they can never pass another user's id.
//
// CORS: this is called from a browser (the web build), which sends a
// preflight OPTIONS request before the real POST whenever custom headers
// like Authorization are involved. Supabase Edge Functions don't add CORS
// headers automatically — every response below goes through jsonResponse()
// so the browser doesn't silently block the real request on the preflight
// (found and fixed the same way on generate-ai-guidance, July 2026).

import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Thea's real notification inbox. Change here if that ever changes —
// deliberately not read from a client-supplied value.
const NOTIFY_TO = 'thea@lglowliving.com';
const NOTIFY_FROM = 'L. Glow <notifications@lglowliving.com>';

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

  // Identify the caller from their own JWT — never trust a client-supplied user id.
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Not authenticated' }, 401);
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: intake, error: intakeError } = await admin
    .from('intake_forms')
    .select('notified_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (intakeError) {
    return jsonResponse({ error: intakeError.message }, 500);
  }
  if (!intake) {
    return jsonResponse({ error: 'No intake form on file for this user' }, 404);
  }
  if (intake.notified_at) {
    // Already notified — idempotent no-op, not an error.
    return jsonResponse({ status: 'already_notified' });
  }

  const { data: profile } = await admin
    .from('users')
    .select('email, display_name')
    .eq('id', user.id)
    .maybeSingle();

  const clientLabel = profile?.display_name || profile?.email || 'A client';

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `${clientLabel} completed their intake form`,
      text: `${clientLabel} (${profile?.email ?? 'no email on file'}) just finished their intake form.\n\nOpen the practitioner dashboard to review it: https://l-glow.vercel.app/practitioner`,
    }),
  });

  if (!emailRes.ok) {
    const detail = await emailRes.text();
    return jsonResponse({ error: 'Email send failed', detail }, 502);
  }

  await admin.from('intake_forms').update({ notified_at: new Date().toISOString() }).eq('user_id', user.id);

  return jsonResponse({ status: 'sent' });
});
