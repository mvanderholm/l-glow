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

import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Thea's real notification inbox. Change here if that ever changes —
// deliberately not read from a client-supplied value.
const NOTIFY_TO = 'thea@lglowliving.com';
const NOTIFY_FROM = 'L. Glow <notifications@lglowliving.com>';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }

  // Identify the caller from their own JWT — never trust a client-supplied user id.
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: intake, error: intakeError } = await admin
    .from('intake_forms')
    .select('notified_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (intakeError) {
    return new Response(JSON.stringify({ error: intakeError.message }), { status: 500 });
  }
  if (!intake) {
    return new Response(JSON.stringify({ error: 'No intake form on file for this user' }), { status: 404 });
  }
  if (intake.notified_at) {
    // Already notified — idempotent no-op, not an error.
    return new Response(JSON.stringify({ status: 'already_notified' }), { status: 200 });
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
    return new Response(JSON.stringify({ error: 'Email send failed', detail }), { status: 502 });
  }

  await admin.from('intake_forms').update({ notified_at: new Date().toISOString() }).eq('user_id', user.id);

  return new Response(JSON.stringify({ status: 'sent' }), { status: 200 });
});
