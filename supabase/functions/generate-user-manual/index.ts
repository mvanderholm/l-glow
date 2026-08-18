// L. Glow — generate-user-manual Edge Function
//
// The first AI-drafted content in this app that is ever meant to reach the
// client. Everything generate-ai-guidance produces is practitioner-only and
// never shown to a client; this synthesizes a client's full intake +
// assessment + check-in/journal history into a narrative "User's Manual" in
// Thea's voice, but it lands in user_manuals with status='draft' — a
// practitioner must review, optionally edit, and explicitly approve it
// before the client-read RLS policy on user_manuals allows the client to
// see any of it. See docs/roadmap.md #48 and the plan this was built from.
//
// Deploy via the Supabase dashboard: Edge Functions -> Create a new
// function -> name it "generate-user-manual" -> paste this file's
// contents. Reuses the existing ANTHROPIC_API_KEY secret already set for
// generate-ai-guidance — nothing new to configure there.
//
// Security model: identical to generate-ai-guidance — verify the caller's
// own JWT, confirm their OWN role is 'practitioner', confirm the target
// client has consented_to_practitioner_view, then read on the service role
// (bypasses RLS) since this endpoint necessarily reads a different user's
// data across many tables at once.
//
// CORS: same as generate-ai-guidance — every response goes through
// jsonResponse() so the browser's preflight OPTIONS doesn't block the real
// POST.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

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

// Fuller than generate-ai-guidance's 5-line version on purpose — this is a
// full client-facing document, not a one-paragraph practitioner note, so
// it's worth grounding the model in more of the voice guide (v1.0, approved
// by Thea, July 2026).
const VOICE_GUIDE = `You are drafting in Thea's voice for L. Glow, her ayurvedic practice. Five principles underneath everything:
1. Nothing is for everybody. Everything is for somebody — never state a recommendation or observation as universal truth; it's contextual to this specific person.
2. Like increases like, opposites bring balance — the operating principle behind any pattern you name.
3. We are what we digest, not what we eat — digestion is physical, mental, and emotional, not just food.
4. There is no good. There is no bad. There just is — imbalance is information, not failure. Never scold, shame, or use guilt-inducing language.
5. It changes — what was true for them yesterday isn't necessarily true today. Avoid permanent-sounding pronouncements.

Tone: warm, funny, a little irreverent — a friend on a walk, not a guru on a cushion. Specific over abstract ("sit on the floor and cross your legs" beats "create a mindful eating environment"). No spa-speak — no "sacred," no "journey," no "temple." If a sentence would sound at home on a candle, don't write it. Reframe restriction as discernment: no food is "bad" or "off-limits." Never use the word "should" without immediately complicating it. Never make a medical claim, diagnose, or contradict "see a doctor" for anything serious.

Here is a real excerpt from Thea, in her own words, that models the register and structure to aim for:

"Your body has been handing you pieces of your user's manual your entire life, hoping you'd slow down long enough to notice."

"Nothing in this app is about becoming someone else. It's about remembering who you've been all along."`;

const SYSTEM_PROMPT = `${VOICE_GUIDE}

You're drafting a personal "User's Manual" document for one specific client of this ayurvedic practice, to eventually be reviewed and possibly edited by the practitioner (Thea) before the client ever sees it. You'll be given everything this client has told the app: their intake form answers, their most recent results on any assessments they've completed (dosha, guna, agni, tongue), their raw answers to any Prakriti/Vikriti self-assessment tiers they've completed, a condensed summary of their recent daily check-ins, and their most recent journal entries.

Write a warm, specific, personal narrative — not a clinical report, not a bulleted list of scores. Organize it around real patterns you can actually see in what they've reported: what their body/mind seem to be telling them, what's been consistent, what's been shifting. Sign off in first person as Thea, speaking directly to this client ("you").

Hard constraints:
- Never invent a fact this client didn't report. If a data source is missing or thin, don't paper over the gap — just don't write about it.
- Prakriti and Vikriti answers do NOT have a computed dosha type or score attached (tagging isn't built yet) — never assign a dosha type from that data. You may describe themes in what they wrote, never a "you are X dosha" conclusion drawn from Prakriti/Vikriti alone. Dosha type from the dedicated dosha_results assessment is fine to reference directly since that one is scored.
- Never make a medical claim, diagnosis, or treatment recommendation. Wellness framing only.
- Follow principle 4 throughout: describe patterns as information, never as good/bad/failure.
- Length: roughly 400-700 words. This is meant to be read in one sitting, not skimmed.`;

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

  const { data: caller, error: callerError } = await admin
    .from('users').select('role').eq('id', user.id).maybeSingle();
  if (callerError) {
    return jsonResponse({ error: callerError.message }, 500);
  }
  if (caller?.role !== 'practitioner') {
    return jsonResponse({ error: 'Practitioner access required' }, 403);
  }

  const { clientId } = await req.json();
  if (!clientId) {
    return jsonResponse({ error: 'clientId is required' }, 400);
  }

  const { data: consented } = await admin
    .from('users').select('consented_to_practitioner_view').eq('id', clientId).maybeSingle();
  if (!consented?.consented_to_practitioner_view) {
    return jsonResponse({ error: 'Client has not consented to practitioner view' }, 403);
  }

  const promptData = await gatherClientData(admin, clientId);

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let message;
  try {
    message = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      thinking: { type: 'adaptive' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(promptData) }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: `Claude API call failed: ${msg}` }, 502);
  }
  const content = message.content.find((b) => b.type === 'text')?.text;
  if (!content) {
    return jsonResponse({ error: 'Model returned no text' }, 502);
  }

  const { error: upsertError } = await admin.from('user_manuals').upsert({
    user_id: clientId,
    ai_draft: content,
    content,
    status: 'draft',
    generated_by: user.id,
    generated_at: new Date().toISOString(),
    edited_at: null,
    approved_at: null,
    approved_by: null,
  }, { onConflict: 'user_id' });
  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  return jsonResponse({ content });
});

const PRAKRITI_TIERS = ['foundation', 'level2', 'level3'];
const VIKRITI_TIERS = ['level1', 'level2', 'level3'];

async function gatherClientData(admin, clientId: string) {
  const [
    intake,
    dosha,
    guna,
    agni,
    tongue,
    prakritiTiers,
    vikritiTiers,
    checkinSummary,
    journalEntries,
  ] = await Promise.all([
    admin.from('intake_forms').select('data').eq('user_id', clientId).maybeSingle(),
    admin.from('dosha_results').select('dosha, vata_score, pitta_score, kapha_score, taken_at')
      .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('guna_results').select('dominant, sattva_score, rajas_score, tamas_score, taken_at')
      .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('agni_results').select('agni_type, sama_count, vishama_count, tikshna_count, manda_count, taken_at')
      .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('tongue_checks').select('reading, shape, size, color, coating, ama_level, signs, taken_at')
      .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle(),
    fetchLatestPerTier(admin, 'prakriti_responses', clientId, PRAKRITI_TIERS),
    fetchLatestPerTier(admin, 'vikriti_responses', clientId, VIKRITI_TIERS),
    fetchCheckinSummary(admin, clientId),
    admin.from('journal_entries').select('date, grateful, showed, tomorrow')
      .eq('user_id', clientId).order('date', { ascending: false }).limit(5),
  ]);

  return {
    intake_form: intake.data?.data ?? null,
    dosha_result: dosha.data ?? null,
    guna_result: guna.data ?? null,
    agni_result: agni.data ?? null,
    tongue_check: tongue.data ?? null,
    prakriti_tiers_completed: prakritiTiers,
    vikriti_tiers_completed: vikritiTiers,
    checkin_summary_last_30_days: checkinSummary,
    recent_journal_entries: journalEntries.data ?? [],
  };
}

async function fetchLatestPerTier(admin, table: string, clientId: string, tiers: string[]) {
  const results = await Promise.all(tiers.map((tier) =>
    admin.from(table).select('tier, answers, completed_at')
      .eq('user_id', clientId).eq('tier', tier)
      .order('completed_at', { ascending: false }).limit(1).maybeSingle()
  ));
  return results.map((r) => r.data).filter(Boolean);
}

// Condensed, not raw — a year of daily rows would be mostly numeric noise
// in a narrative-document prompt. Last 30 days' averages + streak + any
// notes actually written, which is where the real signal is.
async function fetchCheckinSummary(admin, clientId: string) {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data } = await admin.from('checkins')
    .select('date, physical, mental, emotional, hunger, tongue, note')
    .eq('user_id', clientId)
    .gte('date', since.toISOString().slice(0, 10))
    .order('date', { ascending: false });

  if (!data || data.length === 0) return null;

  const avg = (key: string) => {
    const vals = data.map((d) => d[key]).filter((v) => v !== null && v !== undefined);
    return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
  };

  return {
    days_checked_in: data.length,
    avg_physical: avg('physical'),
    avg_mental: avg('mental'),
    avg_emotional: avg('emotional'),
    avg_hunger: avg('hunger'),
    avg_tongue: avg('tongue'),
    notes: data.filter((d) => d.note && d.note.trim()).map((d) => ({ date: d.date, note: d.note })),
  };
}
