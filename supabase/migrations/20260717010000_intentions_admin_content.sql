-- L. Glow — admin-editable content: "Just for today" intention suggestions
-- (fifth content type, same pattern as the others). Run in the Supabase SQL
-- Editor after the prior migrations.
--
-- Named intention_suggestions, not intentions — public.intentions already
-- exists (20260711000000_init_schema.sql) and is a completely different
-- table: each user's own saved daily intention (user_id, date, text), one
-- row per user per day, written by saveIntention()/loadTodayIntention().
-- This table is the opposite: Thea's shared suggestion pool that
-- intentionSuggestions() reads from to populate the picker, same row for
-- every user. Caught by a "relation already exists" error on first run —
-- worth remembering before naming a new admin-content table.
--
-- The vata/pitta/kapha arrays in data/content/intentions.js have sat empty
-- since #8 shipped, waiting on Thea to author dosha-specific suggestions.
-- Moving this to the admin hub means she can fill them in herself instead
-- of the gap sitting on someone else's task list.

create table public.intention_suggestions (
  id         text primary key,
  text       text not null,
  dosha      text not null check (dosha in ('universal', 'vata', 'pitta', 'kapha')),
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.intention_suggestions enable row level security;

create policy "Anyone can read intention suggestions"
  on public.intention_suggestions for select
  using (true);

create policy "Practitioners can manage intention suggestions"
  on public.intention_suggestions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/intentions.js — do not hand-edit, regenerate if the source changes.
insert into public.intention_suggestions (id, text, dosha, sort_order) values
  ($id$warm-water$id$, $t$drink warm water$t$, $d$universal$d$, 1),
  ($id$present-eating$id$, $t$be present when I eat$t$, $d$universal$d$, 2),
  ($id$phone-down$id$, $t$put my phone down after 9pm$t$, $d$universal$d$, 3);
