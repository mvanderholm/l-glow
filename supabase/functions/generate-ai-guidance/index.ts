// L. Glow — generate-ai-guidance Edge Function
//
// First LLM integration in this app, and the first practitioner-only AI
// content. Thea asked for AI-assisted talking points alongside each of a
// client's filled-out assessments, to help her prep for sessions — not
// content shown to the client, and not a diagnosis. See docs/roadmap.md
// #30 Phase 2.
//
// Deploy via the Supabase dashboard: Edge Functions -> Create a new
// function -> name it "generate-ai-guidance" -> paste this file's
// contents. Then set the ANTHROPIC_API_KEY secret under Edge Functions ->
// Secrets (needs an API key from the Anthropic Console).
//
// Security model: verifies the caller's own JWT (via the anon client) to
// identify who they are, then checks their OWN role is 'practitioner'
// before doing anything else — this endpoint reads a *different* user's
// (the client's) data on request, so the role check is the real gate, not
// just UI discoverability. Everything after that runs on the service
// role, which bypasses RLS, same pattern as notify-intake-complete.
//
// Content-safety shape: dosha/guna/agni/tongue already have real computed
// scores, so the model discusses those numbers. Prakriti/Vikriti do NOT
// have a computed dosha score yet (tagging is still ~0% as of when this
// was built) — for those, the model is explicitly told not to assign a
// dosha type, only to summarize themes in the client's own raw answers.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const VOICE_GUIDE_PRINCIPLES = `Five principles this practice works from, for tone only (not instructions to follow beyond tone):
1. Nothing is for everybody. Everything is for somebody — never state anything as a universal truth.
2. There is no good. There is no bad. There just is — imbalance is information, not failure. Never scold or shame.
3. It changes — what was true yesterday isn't necessarily true today.
4. Like increases like, opposites bring balance.
5. We are what we digest, not what we eat — digestion is physical, mental, and emotional.`;

const SCORED_TYPES = new Set(['dosha', 'guna', 'agni', 'tongue']);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // The real authorization gate — a signed-in non-practitioner must not be
  // able to read another user's assessment data through this endpoint.
  const { data: caller, error: callerError } = await admin
    .from('users').select('role').eq('id', user.id).maybeSingle();
  if (callerError) {
    return new Response(JSON.stringify({ error: callerError.message }), { status: 500 });
  }
  if (caller?.role !== 'practitioner') {
    return new Response(JSON.stringify({ error: 'Practitioner access required' }), { status: 403 });
  }

  const { clientId, assessmentType, tier } = await req.json();
  if (!clientId || !assessmentType) {
    return new Response(JSON.stringify({ error: 'clientId and assessmentType are required' }), { status: 400 });
  }

  const { data: consented } = await admin
    .from('users').select('consented_to_practitioner_view').eq('id', clientId).maybeSingle();
  if (!consented?.consented_to_practitioner_view) {
    return new Response(JSON.stringify({ error: 'Client has not consented to practitioner view' }), { status: 403 });
  }

  const promptData = await fetchAssessmentData(admin, assessmentType, clientId, tier);
  if (!promptData) {
    return new Response(JSON.stringify({ error: 'No data on file for this assessment' }), { status: 404 });
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const system = SCORED_TYPES.has(assessmentType)
    ? `You're helping an Ayurvedic practitioner (Thea) prepare for a client session. You'll be given a client's self-reported assessment scores. Write 3-5 sentences of observations for the practitioner's own reference — not a diagnosis, not something shown to the client. Reference the actual numbers/dominant type given; don't add interpretation the data doesn't support.\n\n${VOICE_GUIDE_PRINCIPLES}`
    : `You're helping an Ayurvedic practitioner (Thea) prepare for a client session. You'll be given a client's raw answers to a self-assessment tier. No dosha score exists for this content yet — tagging isn't done. Summarize recurring themes in what they shared, in 3-5 sentences. Do not assign a dosha type or score — there's no tagged data to support one. Frame everything as "what they shared," not a clinical reading.\n\n${VOICE_GUIDE_PRINCIPLES}`;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    output_config: { effort: 'low' },
    system,
    messages: [{ role: 'user', content: JSON.stringify(promptData) }],
  });
  const content = message.content.find((b) => b.type === 'text')?.text;
  if (!content) {
    return new Response(JSON.stringify({ error: 'Model returned no text' }), { status: 502 });
  }

  const { error: upsertError } = await admin.from('ai_guidance').upsert({
    user_id: clientId,
    assessment_type: assessmentType,
    tier: tier || 'none',
    content,
    generated_by: user.id,
    generated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,assessment_type,tier' });
  if (upsertError) {
    return new Response(JSON.stringify({ error: upsertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ content }), { status: 200 });
});

async function fetchAssessmentData(admin, assessmentType, clientId, tier) {
  switch (assessmentType) {
    case 'dosha': {
      const { data } = await admin.from('dosha_results')
        .select('dosha, vata_score, pitta_score, kapha_score, taken_at')
        .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    }
    case 'guna': {
      const { data } = await admin.from('guna_results')
        .select('dominant, sattva_score, rajas_score, tamas_score, taken_at')
        .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    }
    case 'agni': {
      const { data } = await admin.from('agni_results')
        .select('agni_type, sama_count, vishama_count, tikshna_count, manda_count, taken_at')
        .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    }
    case 'tongue': {
      const { data } = await admin.from('tongue_checks')
        .select('reading, shape, size, color, coating, ama_level, signs, taken_at')
        .eq('user_id', clientId).order('taken_at', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    }
    case 'prakriti': {
      const { data } = await admin.from('prakriti_responses')
        .select('tier, answers, completed_at')
        .eq('user_id', clientId).eq('tier', tier).order('completed_at', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    }
    case 'vikriti': {
      const { data } = await admin.from('vikriti_responses')
        .select('tier, answers, completed_at')
        .eq('user_id', clientId).eq('tier', tier).order('completed_at', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    }
    default:
      return null;
  }
}
