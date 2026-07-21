-- L. Glow — admin-editable content: Prakriti/Vikriti constitution questions
-- (eighth content type). Run in the Supabase SQL Editor after the prior
-- migrations.
--
-- One shared table across all six planned question sets (Prakriti
-- Foundation/Level 2/Level 3, Vikriti Level 1/Level 2/Level 3) rather than
-- six near-duplicate tables — they're the identical shape (prompt, section,
-- options), differing only in which `assessment` + `tier` they belong to.
--
-- `options` is jsonb, not flattened columns like guna_questions' fixed
-- sattva/rajas/tamas labels — each option's dosha tag is now variable
-- length (an option can be tagged with one dosha, e.g. ["vata"], or a
-- blend, e.g. ["vata","kapha"]), which maps directly to a JS array and
-- doesn't force a fixed number of options per question.
--
-- Seeded here: the 21-question Prakriti Foundation set (Matt/Thea, July
-- 2026) with real option label text, but every option's "dosha" array
-- starts EMPTY — the label text is Thea's authored content, but which
-- dosha(s) each option represents is a clinical categorization call for
-- her/Matt to make, not something to guess at from the outside (one
-- question in the source set already broke the obvious "option 1 = vata,
-- 2 = pitta, 3 = kapha" pattern, which is exactly why this isn't inferred).
-- Assign tags via the practitioner admin editor once ready. The other five
-- sets (prakriti/level2, prakriti/level3, vikriti/level1-3) have no rows
-- yet — add via the same admin editor or a follow-up migration as that
-- content arrives.

create table public.constitution_questions (
  id          text primary key,
  assessment  text not null check (assessment in ('prakriti', 'vikriti')),
  tier        text not null check (tier in ('foundation', 'level1', 'level2', 'level3')),
  section     text,
  prompt      text not null,
  options     jsonb not null,
  sort_order  int not null,
  updated_at  timestamptz not null default now()
);

alter table public.constitution_questions enable row level security;

create policy "Anyone can read constitution questions"
  on public.constitution_questions for select
  using (true);

create policy "Practitioners can manage constitution questions"
  on public.constitution_questions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from Matt's Prakriti Foundation content, July 17 2026 — option dosha tags intentionally left empty, assign via admin editor.
insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order) values
  ($id$followed-sentence$id$, 'prakriti', 'foundation', 'identity', $p$Which sentence has followed you around for most of your life?$p$, $opts$[
    {"label": "You need to slow down.", "dosha": []},
    {"label": "You always give 110%.", "dosha": []},
    {"label": "You're the rock everyone leans on.", "dosha": []}
  ]$opts$::jsonb, 1),

  ($id$natural-pace$id$, 'prakriti', 'foundation', 'identity', $p$Which pace has always felt the most like you?$p$, $opts$[
    {"label": "My engine has always idled high.", "dosha": []},
    {"label": "I like momentum and purpose.", "dosha": []},
    {"label": "I've never been in a hurry.", "dosha": []}
  ]$opts$::jsonb, 2),

  ($id$room-presence$id$, 'prakriti', 'foundation', 'identity', $p$When you walk into a room, people usually notice your...$p$, $opts$[
    {"label": "Energy", "dosha": []},
    {"label": "Presence", "dosha": []},
    {"label": "Calm", "dosha": []}
  ]$opts$::jsonb, 3),

  ($id$childhood-role$id$, 'prakriti', 'foundation', 'identity', $p$Growing up, you were the kid who...$p$, $opts$[
    {"label": "Could never sit still.", "dosha": []},
    {"label": "Wanted to win.", "dosha": []},
    {"label": "Was happy doing my own thing.", "dosha": []}
  ]$opts$::jsonb, 4),

  ($id$real-you$id$, 'prakriti', 'foundation', 'identity', $p$If someone had to describe the REAL you...$p$, $opts$[
    {"label": "Creative and unpredictable.", "dosha": []},
    {"label": "Focused and driven.", "dosha": []},
    {"label": "Loyal and dependable.", "dosha": []}
  ]$opts$::jsonb, 5),

  ($id$common-compliment$id$, 'prakriti', 'foundation', 'identity', $p$Which compliment have you heard the most throughout your life?$p$, $opts$[
    {"label": "You're so creative.", "dosha": []},
    {"label": "You always get things done.", "dosha": []},
    {"label": "I always know I can count on you.", "dosha": []}
  ]$opts$::jsonb, 6),

  ($id$body-frame$id$, 'prakriti', 'foundation', 'physical', $p$Your natural body has always been closest to...$p$, $opts$[
    {"label": "Lean and lighter framed.", "dosha": []},
    {"label": "Athletic or medium build.", "dosha": []},
    {"label": "Broad or sturdy.", "dosha": []}
  ]$opts$::jsonb, 7),

  ($id$joints$id$, 'prakriti', 'foundation', 'physical', $p$Your joints have naturally been...$p$, $opts$[
    {"label": "Small or more noticeable.", "dosha": []},
    {"label": "Average.", "dosha": []},
    {"label": "Larger, well-cushioned, or naturally sturdy.", "dosha": []}
  ]$opts$::jsonb, 8),

  ($id$hands-feet-temp$id$, 'prakriti', 'foundation', 'physical', $p$Throughout most of your life, your hands and feet have usually been...$p$, $opts$[
    {"label": "Cold more often than others.", "dosha": []},
    {"label": "Usually comfortable.", "dosha": []},
    {"label": "Warm most of the time.", "dosha": []}
  ]$opts$::jsonb, 9),

  ($id$skin$id$, 'prakriti', 'foundation', 'physical', $p$Your skin has naturally been...$p$, $opts$[
    {"label": "Dry or rough.", "dosha": []},
    {"label": "Warm, sensitive, or quick to flush.", "dosha": []},
    {"label": "Soft, thicker, or naturally moisturized.", "dosha": []}
  ]$opts$::jsonb, 10),

  ($id$hair$id$, 'prakriti', 'foundation', 'physical', $p$Your hair has naturally been...$p$, $opts$[
    {"label": "Fine, dry, or prone to frizz.", "dosha": []},
    {"label": "Soft, silky, or fine.", "dosha": []},
    {"label": "Thick, full, or coarse.", "dosha": []}
  ]$opts$::jsonb, 11),

  ($id$eyes$id$, 'prakriti', 'foundation', 'physical', $p$People have commented that your eyes are...$p$, $opts$[
    {"label": "Bright, expressive, and always moving.", "dosha": []},
    {"label": "Sharp, focused, or intense.", "dosha": []},
    {"label": "Large, calm, or gentle.", "dosha": []}
  ]$opts$::jsonb, 12),

  ($id$speaking-style$id$, 'prakriti', 'foundation', 'physical', $p$My natural speaking style is...$p$, $opts$[
    {"label": "Fast and animated.", "dosha": []},
    {"label": "Clear, confident, and direct.", "dosha": []},
    {"label": "Calm, steady, and thoughtful.", "dosha": []}
  ]$opts$::jsonb, 13),

  ($id$appetite$id$, 'prakriti', 'foundation', 'rhythms', $p$If you zoom out over your whole life, your appetite has mostly been...$p$, $opts$[
    {"label": "Easy to forget about.", "dosha": []},
    {"label": "Strong. Don't make me skip meals.", "dosha": []},
    {"label": "Slow but steady.", "dosha": []}
  ]$opts$::jsonb, 14),

  ($id$digestion$id$, 'prakriti', 'foundation', 'rhythms', $p$Throughout your life, your digestion has mostly been...$p$, $opts$[
    {"label": "Unpredictable.", "dosha": []},
    {"label": "Strong and efficient.", "dosha": []},
    {"label": "Slow but consistent.", "dosha": []}
  ]$opts$::jsonb, 15),

  ($id$sleep-need$id$, 'prakriti', 'foundation', 'rhythms', $p$When life isn't getting in the way, your body naturally wants...$p$, $opts$[
    {"label": "Less sleep than most people.", "dosha": []},
    {"label": "A typical night's sleep.", "dosha": []},
    {"label": "Long, deep sleep.", "dosha": []}
  ]$opts$::jsonb, 16),

  ($id$recovery$id$, 'prakriti', 'foundation', 'rhythms', $p$After physical activity, I naturally...$p$, $opts$[
    {"label": "Recover quickly but sometimes overdo it.", "dosha": []},
    {"label": "Recover well and enjoy being challenged.", "dosha": []},
    {"label": "Recover more slowly but have great endurance.", "dosha": []}
  ]$opts$::jsonb, 17),

  ($id$learning-style$id$, 'prakriti', 'foundation', 'mind', $p$I usually learn best by...$p$, $opts$[
    {"label": "Jumping in and figuring it out.", "dosha": []},
    {"label": "Understanding how it works first.", "dosha": []},
    {"label": "Watching it done before trying it myself.", "dosha": []}
  ]$opts$::jsonb, 18),

  ($id$social-style$id$, 'prakriti', 'foundation', 'mind', $p$Socially, I've naturally been someone who...$p$, $opts$[
    {"label": "Loves meeting lots of different people.", "dosha": []},
    {"label": "Enjoys meaningful conversations and healthy debate.", "dosha": []},
    {"label": "Prefers a smaller circle of close relationships.", "dosha": []}
  ]$opts$::jsonb, 19),

  ($id$stress-response$id$, 'prakriti', 'foundation', 'mind', $p$When life gets messy, my brain naturally goes to...$p$, $opts$[
    {"label": "Every possible outcome.", "dosha": []},
    {"label": "How do I fix this?", "dosha": []},
    {"label": "It'll work itself out.", "dosha": []}
  ]$opts$::jsonb, 20),

  ($id$feels-like-home$id$, 'prakriti', 'foundation', 'mind', $p$What has always felt most like home?$p$, $opts$[
    {"label": "Freedom.", "dosha": []},
    {"label": "Challenge.", "dosha": []},
    {"label": "Comfort.", "dosha": []}
  ]$opts$::jsonb, 21);
