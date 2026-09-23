// L. Glow — generate-cleanse-recipe Edge Function
//
// Live regeneration path for one recipe in the 15-Day Ayurvedic Cleanse.
// The default experience uses the static, pre-generated content in
// data/content/cleanseRecipes.js (generated once from Thea's own prompts
// in data/content/cleanse.js, flagged there as draft pending her review).
// This function exists only for on-demand personalization — a user
// asking for the olive-oil version worded differently, a different
// serving count, or a "regenerate" tap — same shape as
// generate-user-manual's "Regenerate from scratch" action, not a
// replacement for the reviewed static content.
//
// Deploy via the Supabase dashboard: Edge Functions -> Create a new
// function -> name it "generate-cleanse-recipe" -> paste this file's
// contents. Reuses the existing ANTHROPIC_API_KEY secret.
//
// Security model: verify the caller's own JWT, confirm they own the
// cleanse_plans row they're regenerating a recipe for (RLS on
// cleanse_plans already enforces this for the plan lookup; this function
// re-checks explicitly since it writes to cleanse_recipe_overrides on
// their behalf via the service role).

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

// Narrow on purpose — this isn't a narrative-voice generator like
// generate-user-manual, it's executing one of Thea's own fixed recipe
// prompts (see data/content/cleanse.js's RECIPES) with a light,
// user-requested tweak layered on top. The model should follow the
// prompt, not reinterpret the cleanse.
const SYSTEM_PROMPT = `You are generating one recipe for L. Glow's 15-Day Ayurvedic Cleanse, a gentle elimination/kitchari/reintroduction protocol designed by Thea, an ayurvedic practitioner. You will be given one of her exact recipe prompts, plus an optional user preference (such as substituting olive oil for ghee, or a different serving count).

Follow the prompt exactly as written -- do not add ingredients, change the dish, or introduce anything the prompt didn't ask for. Apply the user's preference as a straightforward substitution or scaling, nothing more.

Respond with ONLY a JSON object, no other text, in this exact shape:
{"servings": <number>, "ingredients": ["<ingredient with quantity>", ...], "steps": ["<step>", ...]}`;

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

  const { planId, recipeId, prompt, preference } = await req.json();
  if (!planId || !recipeId || !prompt) {
    return jsonResponse({ error: 'planId, recipeId, and prompt are required' }, 400);
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: plan, error: planError } = await admin
    .from('cleanse_plans').select('user_id').eq('id', planId).maybeSingle();
  if (planError) {
    return jsonResponse({ error: planError.message }, 500);
  }
  if (!plan || plan.user_id !== user.id) {
    return jsonResponse({ error: 'Not your cleanse plan' }, 403);
  }

  const userMessage = preference
    ? `${prompt}\n\nAdditional preference: ${preference}`
    : prompt;

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let message;
  try {
    message = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: `Claude API call failed: ${msg}` }, 502);
  }

  const text = message.content.find((b) => b.type === 'text')?.text;
  if (!text) {
    return jsonResponse({ error: 'Model returned no text' }, 502);
  }

  let content;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    content = JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch {
    return jsonResponse({ error: 'Model returned unparseable content' }, 502);
  }

  const { error: upsertError } = await admin.from('cleanse_recipe_overrides').upsert({
    plan_id: planId,
    recipe_id: recipeId,
    content,
    generated_at: new Date().toISOString(),
  }, { onConflict: 'plan_id,recipe_id' });
  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  return jsonResponse({ content });
});
