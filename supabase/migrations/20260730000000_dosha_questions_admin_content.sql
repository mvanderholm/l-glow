-- L. Glow — admin-editable content: the standalone Dosha Quiz (`/quiz`, 14
-- questions), same pattern as guna_questions/prakriti_questions/
-- vikriti_questions. Run in the Supabase SQL Editor after the prior
-- migrations.
--
-- Each question always has exactly one option per dosha (vata/pitta/kapha),
-- so — same reasoning as guna_questions's own comment — this is flattened
-- into 3 label columns per question rather than a nested options array:
-- simpler admin edit form, matches the real fixed shape. `multi_select`
-- carries over the static file's per-question `multiSelect` flag (skin and
-- hair allow checking more than one option; everything else is single-pick).
-- `section` is one of 'physical' | 'physiological' | 'psychological',
-- matching app/quiz.js's SECTION_LABELS lookup — not DB-constrained since
-- the admin editor's own chip picker is the real guard, same as how
-- guna_questions doesn't constrain its column values either.
--
-- Seed data is transcribed verbatim from data/content/quiz.js's
-- quizQuestions export (Thea-approved content, replaced July 2026 per
-- transcript 15 — see that file's own header comment). `id` slugs below are
-- new (the static array never had per-question ids) — structural keys only,
-- no wording invented or changed.

create table public.dosha_questions (
  id           text primary key,
  section      text,
  prompt       text not null,
  vata_label   text not null,
  pitta_label  text not null,
  kapha_label  text not null,
  multi_select boolean not null default false,
  sort_order   int not null,
  updated_at   timestamptz not null default now()
);

alter table public.dosha_questions enable row level security;

create policy "Anyone can read dosha questions"
  on public.dosha_questions for select
  using (true);

create policy "Practitioners can manage dosha questions"
  on public.dosha_questions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/quiz.js's quizQuestions export — do not hand-edit, regenerate if the source changes.
insert into public.dosha_questions (id, section, prompt, vata_label, pitta_label, kapha_label, multi_select, sort_order) values
  ($id$body-frame$id$, $sec$physical$sec$, $p$Think back as far as you can — before the gym, before stress changed things. What's your natural body frame?$p$, $va$Thin and narrow — light bones, joints that show, hard to build muscle$va$, $pi$Medium and proportional — moderate build, decent muscle without much effort$pi$, $ka$Broad and solid — larger frame, well-developed, naturally strong$ka$, false, 1),
  ($id$weight-tendency$id$, $sec$physical$sec$, $p$Your natural relationship with weight — the default your body wants to return to:$p$, $va$I stay light without trying — sometimes I actually struggle to gain weight$va$, $pi$Pretty steady — I gain and lose at a moderate, predictable pace$pi$, $ka$Weight comes on easily and it's slow to leave$ka$, false, 2),
  ($id$skin$id$, $sec$physical$sec$, $p$Your skin at its most natural — no products, no seasons messing with it. Check everything that fits.$p$, $va$Dry, rough, or flaky — cracks easily, cool to the touch$va$, $pi$Warm and tends toward oily — flushes easily, some redness$pi$, $ka$Smooth, moist, and cool — oily, pale, thicker than average$ka$, true, 3),
  ($id$hair$id$, $sec$physical$sec$, $p$Your natural hair — before color, heat, and styling products. Check everything that fits.$p$, $va$Dry, coarse, or curly — tends toward frizz$va$, $pi$Fine, silky, or straight — tends to thin or gray early$pi$, $ka$Thick, wavy, and heavy — usually oily, lots of volume$ka$, true, 4),
  ($id$teeth$id$, $sec$physical$sec$, $p$Think about your teeth before braces, orthodontics — what you were born with:$p$, $va$Crooked, crowded, or with gaps — sometimes stuck out a little$va$, $pi$Medium-sized and even — on the softer side, gums that bled easily$pi$, $ka$Strong, white, and well-formed — healthy gums, rarely had issues$ka$, false, 5),
  ($id$eyes$id$, $sec$physical$sec$, $p$Your eyes:$p$, $va$Small and active — dark brown or black, sometimes dry or sunken$va$, $pi$Sharp and penetrating — green, gray, hazel, or copper; sensitive to bright light$pi$, $ka$Large and soft — blue or deep brown, long lashes, naturally moist$ka$, false, 6),
  ($id$appetite$id$, $sec$physiological$sec$, $p$Your appetite, day to day:$p$, $va$All over the place — sometimes ravenous, sometimes I forget to eat entirely$va$, $pi$Strong and on schedule — I notice when a meal is late. I get irritable.$pi$, $ka$Slow to arrive — I can skip meals without much trouble and not feel it$ka$, false, 7),
  ($id$digestion$id$, $sec$physiological$sec$, $p$Your digestion and elimination, honestly:$p$, $va$Irregular — constipation, dryness, gas. Things don't move on any real schedule.$va$, $pi$Fast and loose — soft and frequent, sometimes a little too fast$pi$, $ka$Slow and heavy — things move on their own timetable, stools are thick and pale$ka$, false, 8),
  ($id$sleep$id$, $sec$physiological$sec$, $p$Your natural sleep:$p$, $va$Light and interrupted — I wake easily, vivid or anxious dreams, don't need a lot$va$, $pi$Moderate and sound — I sleep less than most but wake feeling clear$pi$, $ka$Deep and long — I could always sleep more. Hard to get up in the morning.$ka$, false, 9),
  ($id$hands-feet$id$, $sec$physiological$sec$, $p$Your hands and feet tend to be:$p$, $va$Cold — I'm the one looking for a sweater when everyone else is fine$va$, $pi$Warm — I run hot and don't love direct sun or humid heat$pi$, $ka$Neutral — not particularly hot or cold, usually comfortable$ka$, false, 10),
  ($id$energy-style$id$, $sec$psychological$sec$, $p$Your energy style:$p$, $va$Quick bursts — I move fast and get a lot done, but I crash. Easily fatigued.$va$, $pi$Purposeful and driven — strong endurance when I'm motivated$pi$, $ka$Slow to start, slow to stop — takes a while to get going but I can sustain for a long time$ka$, false, 11),
  ($id$mind-style$id$, $sec$psychological$sec$, $p$How your mind naturally works:$p$, $va$Fast and restless — I jump between ideas, pick things up quickly, get distracted$va$, $pi$Sharp and focused — analytical, decisive, I like to understand things fully$pi$, $ka$Calm and deliberate — I take my time, but what I learn, I keep$ka$, false, 12),
  ($id$memory$id$, $sec$psychological$sec$, $p$Your memory:$p$, $va$Quick to pick up, quick to forget — great in the moment, not so much long-term$va$, $pi$Sharp — I remember what I need to, especially what matters to me$pi$, $ka$Takes time to absorb, but once it's in, it stays for good$ka$, false, 13),
  ($id$stress-response$id$, $sec$psychological$sec$, $p$When things get hard, what shows up first?$p$, $va$Anxiety and overwhelm — fear, indecision, scattered energy, can't sit still$va$, $pi$Anger and frustration — impatience, sharp words, the need to get control back$pi$, $ka$Withdrawal and heaviness — I get quiet, stubborn, don't want to move$ka$, false, 14);
