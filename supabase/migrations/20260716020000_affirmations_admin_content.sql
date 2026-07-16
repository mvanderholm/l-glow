-- L. Glow — admin-editable content: affirmations (second content type,
-- same pattern as mythbusters — see supabase/migrations/20260716010000).
-- Run in the Supabase SQL Editor after the prior migrations.

create table public.affirmations (
  id         text primary key,
  text       text not null,
  dosha      text not null check (dosha in ('universal', 'vata', 'pitta', 'kapha')),
  season     text,
  state      text,
  updated_at timestamptz not null default now()
);

alter table public.affirmations enable row level security;

create policy "Anyone can read affirmations"
  on public.affirmations for select
  using (true);

create policy "Practitioners can manage affirmations"
  on public.affirmations for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/affirmations.js — do not hand-edit, regenerate if the source changes.
insert into public.affirmations (id, text, dosha, season, state) values
  ($id$u-1$id$, $t$I am exactly where I need to be.$t$, $d$universal$d$, null, null),
  ($id$u-2$id$, $t$I trust what my body is telling me.$t$, $d$universal$d$, null, null),
  ($id$u-3$id$, $t$Stillness is also movement.$t$, $d$universal$d$, null, null),
  ($id$u-4$id$, $t$I digest what I take in.$t$, $d$universal$d$, null, null),
  ($id$u-5$id$, $t$What I needed last week isn't what I need today.$t$, $d$universal$d$, null, null),
  ($id$u-6$id$, $t$There is no bad here. Only information.$t$, $d$universal$d$, null, null),
  ($id$u-7$id$, $t$My body is not broken. It's talking.$t$, $d$universal$d$, null, null),
  ($id$u-8$id$, $t$80% is enough.$t$, $d$universal$d$, null, null),
  ($id$u-9$id$, $t$I eat with presence. The rest takes care of itself.$t$, $d$universal$d$, null, null),
  ($id$u-10$id$, $t$I am all three. One just speaks louder right now.$t$, $d$universal$d$, null, null),
  ($id$u-11$id$, $t$The fire doesn't need to be huge. Just alive.$t$, $d$universal$d$, null, null),
  ($id$v-1$id$, $t$I am rooted, but I flow.$t$, $d$vata$d$, null, null),
  ($id$v-2$id$, $t$I slow down without losing myself.$t$, $d$vata$d$, null, null),
  ($id$v-3$id$, $t$The ground is always here.$t$, $d$vata$d$, null, null),
  ($id$v-4$id$, $t$You don't need another plan. What you need is a safe place to land.$t$, $d$vata$d$, null, null),
  ($id$v-5$id$, $t$One thing at a time. The rest will wait.$t$, $d$vata$d$, null, null),
  ($id$v-6$id$, $t$My nervous system gets to rest now.$t$, $d$vata$d$, null, null),
  ($id$v-7$id$, $t$I don't have to figure it out today.$t$, $d$vata$d$, null, null),
  ($id$v-8$id$, $t$My creativity doesn't need chaos to work.$t$, $d$vata$d$, null, null),
  ($id$v-9$id$, $t$I come back to my body. It knows where to land.$t$, $d$vata$d$, null, null),
  ($id$v-10$id$, $t$Warm. Slow. Here.$t$, $d$vata$d$, null, null),
  ($id$p-1$id$, $t$I lead without needing to control.$t$, $d$pitta$d$, null, null),
  ($id$p-2$id$, $t$My fire serves me. I don't serve it.$t$, $d$pitta$d$, null, null),
  ($id$p-3$id$, $t$Rest is not retreat.$t$, $d$pitta$d$, null, null),
  ($id$p-4$id$, $t$You were never meant to carry the whole world. Put something down.$t$, $d$pitta$d$, null, null),
  ($id$p-5$id$, $t$Done is better than perfect. Today, anyway.$t$, $d$pitta$d$, null, null),
  ($id$p-6$id$, $t$Cool is also a kind of power.$t$, $d$pitta$d$, null, null),
  ($id$p-7$id$, $t$I can want it and let it land wherever it lands.$t$, $d$pitta$d$, null, null),
  ($id$p-8$id$, $t$My intensity is mine. I don't owe it to the room.$t$, $d$pitta$d$, null, null),
  ($id$p-9$id$, $t$I compete with who I was. That's the only comparison that matters.$t$, $d$pitta$d$, null, null),
  ($id$p-10$id$, $t$The destination isn't going anywhere. I don't have to sprint.$t$, $d$pitta$d$, null, null),
  ($id$k-1$id$, $t$I move, even when staying feels easier.$t$, $d$kapha$d$, null, null),
  ($id$k-2$id$, $t$My steadiness is a gift, not a limit.$t$, $d$kapha$d$, null, null),
  ($id$k-3$id$, $t$Something new is always beginning.$t$, $d$kapha$d$, null, null),
  ($id$k-4$id$, $t$You don't have to earn your worth by carrying everyone else.$t$, $d$kapha$d$, null, null),
  ($id$k-5$id$, $t$I am not stuck. I am gathering.$t$, $d$kapha$d$, null, null),
  ($id$k-6$id$, $t$I don't need to feel ready to begin.$t$, $d$kapha$d$, null, null),
  ($id$k-7$id$, $t$My loyalty belongs here too.$t$, $d$kapha$d$, null, null),
  ($id$k-8$id$, $t$The heaviness is real. And it is also moving.$t$, $d$kapha$d$, null, null),
  ($id$k-9$id$, $t$Slow is still moving.$t$, $d$kapha$d$, null, null),
  ($id$k-10$id$, $t$Something loosened today. I can feel it.$t$, $d$kapha$d$, null, null),
  ($id$s-fall-1$id$, $t$The leaves let go. I can too.$t$, $d$universal$d$, $se$fall$se$, null),
  ($id$s-fall-2$id$, $t$I am warmth on purpose.$t$, $d$universal$d$, $se$fall$se$, null),
  ($id$s-win-1$id$, $t$Rest is the right thing right now.$t$, $d$universal$d$, $se$winter$se$, null),
  ($id$s-win-2$id$, $t$Stillness isn't absence. It's winter doing its job.$t$, $d$universal$d$, $se$winter$se$, null),
  ($id$s-spr-1$id$, $t$The body wants to clear. I'm helping it.$t$, $d$universal$d$, $se$spring$se$, null),
  ($id$s-spr-2$id$, $t$I release what I've been carrying since winter.$t$, $d$universal$d$, $se$spring$se$, null),
  ($id$s-sum-1$id$, $t$I bring cool to everything I touch today.$t$, $d$universal$d$, $se$summer$se$, null),
  ($id$s-sum-2$id$, $t$The heat is high. I am steady.$t$, $d$universal$d$, $se$summer$se$, null),
  ($id$st-dep-1$id$, $t$Nourishment before output. Always.$t$, $d$universal$d$, null, $st$depleted$st$),
  ($id$st-dep-2$id$, $t$I am refilling, not falling behind.$t$, $d$universal$d$, null, $st$depleted$st$),
  ($id$st-dep-3$id$, $t$This tired is information, not failure.$t$, $d$universal$d$, null, $st$depleted$st$),
  ($id$st-hot-1$id$, $t$I lower the temperature by one degree. That's enough.$t$, $d$universal$d$, null, $st$overheated$st$),
  ($id$st-hot-2$id$, $t$I don't have to match the intensity of this moment.$t$, $d$universal$d$, null, $st$overheated$st$),
  ($id$st-hot-3$id$, $t$Cool isn't checked out. It's recalibrated.$t$, $d$universal$d$, null, $st$overheated$st$),
  ($id$st-hvy-1$id$, $t$One movement. That's the whole ask.$t$, $d$universal$d$, null, $st$heavy$st$),
  ($id$st-hvy-2$id$, $t$I don't wait to feel like it. I start, and then I feel it.$t$, $d$universal$d$, null, $st$heavy$st$),
  ($id$st-hvy-3$id$, $t$Light enters slowly. I'm letting it in.$t$, $d$universal$d$, null, $st$heavy$st$);