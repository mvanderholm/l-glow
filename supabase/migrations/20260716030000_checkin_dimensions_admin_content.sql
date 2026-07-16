-- L. Glow — admin-editable content: check-in question wording (third
-- content type, same pattern as mythbusters/affirmations).
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- Different from the other two: this is edit-only, not a free collection.
-- The 5 keys (physical/mental/emotional/hunger/tongue) are fixed — they're
-- literal typed columns on the checkins table, so adding/removing a
-- dimension here would require a schema migration, not just a content edit.
-- The admin screen for this only lets Thea reword label/description/hints
-- for the 5 that exist, not add or delete rows.

create table public.checkin_dimensions (
  key         text primary key,
  label       text not null,
  description text not null,
  hint_low    text,
  hint_high   text,
  sort_order  int not null,
  updated_at  timestamptz not null default now()
);

alter table public.checkin_dimensions enable row level security;

create policy "Anyone can read checkin dimensions"
  on public.checkin_dimensions for select
  using (true);

create policy "Practitioners can manage checkin dimensions"
  on public.checkin_dimensions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

insert into public.checkin_dimensions (key, label, description, hint_low, hint_high, sort_order) values
  ('physical',  'Physical',       'Energy, digestion, body', null, null, 1),
  ('mental',    'Mental',         'Focus, clarity, sharpness', null, null, 2),
  ('emotional', 'Emotional',      'Mood, calm, openness', null, null, 3),
  ('hunger',    'Morning hunger', 'One of the cleanest signals of your digestive fire.', 'none at all', 'genuinely hungry', 4),
  ('tongue',    'Tongue coating', 'Check before eating or drinking anything. That coating is information.', 'clear', 'heavy coating', 5);
