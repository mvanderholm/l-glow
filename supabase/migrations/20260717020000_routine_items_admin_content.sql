-- L. Glow — admin-editable content: Daily Rhythms routine items (sixth
-- content type, same pattern as the others). Run in the Supabase SQL Editor
-- after the prior migrations.
--
-- data/content/routines.js had two separate exports — routineAnchors (fixed,
-- universal) and routines (empty per-dosha arrays awaiting Thea). Both are
-- the same shape (id, time, label) rendered by the same RoutineRow component
-- in app/recommendations.js, so they're unified into one table here with
-- dosha='universal' standing in for the old routineAnchors list.

create table public.routine_items (
  id         text primary key,
  dosha      text not null check (dosha in ('universal', 'vata', 'pitta', 'kapha')),
  time       text not null check (time in ('morning', 'evening')),
  label      text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.routine_items enable row level security;

create policy "Anyone can read routine items"
  on public.routine_items for select
  using (true);

create policy "Practitioners can manage routine items"
  on public.routine_items for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/routines.js's routineAnchors export — do not hand-edit, regenerate if the source changes.
insert into public.routine_items (id, dosha, time, label, sort_order) values
  ($id$wake$id$, $d$universal$d$, $tm$morning$tm$, $l$Wake before 6am$l$, 1),
  ($id$phone$id$, $d$universal$d$, $tm$evening$tm$, $l$Phone down after 9pm$l$, 2),
  ($id$sleep$id$, $d$universal$d$, $tm$evening$tm$, $l$In bed before 10pm$l$, 3);
