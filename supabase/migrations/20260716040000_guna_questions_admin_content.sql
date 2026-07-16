-- L. Glow — admin-editable content: Guna Quiz questions (fourth content
-- type, same pattern as the others). Run in the Supabase SQL Editor after
-- the prior migrations.
--
-- Each question always has exactly one option per guna (sattva/rajas/
-- tamas), so this is flattened into 3 label columns per question rather
-- than a nested options array — simpler admin edit form, matches the real
-- fixed shape. Order (sattva=A, rajas=B, tamas=C) is fixed by which column
-- the label is in, same as the original data.

create table public.guna_questions (
  id            text primary key,
  prompt        text not null,
  sattva_label  text not null,
  rajas_label   text not null,
  tamas_label   text not null,
  sort_order    int not null,
  updated_at    timestamptz not null default now()
);

alter table public.guna_questions enable row level security;

create policy "Anyone can read guna questions"
  on public.guna_questions for select
  using (true);

create policy "Practitioners can manage guna questions"
  on public.guna_questions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/gunaQuiz.js's gunaQuestions export — do not hand-edit, regenerate if the source changes.
insert into public.guna_questions (id, prompt, sattva_label, rajas_label, tamas_label, sort_order) values
  ($id$diet$id$, $p$My diet is...$p$, $sa$Strictly vegetarian, organic and locally sourced where possible$sa$, $ra$Pretty clean — but I sometimes enjoy meat, comfort foods, or the occasional processed food$ra$, $ta$Meat, and I'll pair it with chips, fries, and other processed and comfort foods$ta$, 1),
  ($id$alcohol$id$, $p$When it comes to alcoholic beverages...$p$, $sa$I never drink$sa$, $ra$I drink sometimes$ra$, $ta$Almost daily$ta$, 2),
  ($id$intimacy$id$, $p$I would consider my desire for intimacy or sex to be...$p$, $sa$Low — I'm not really feeling drawn to it these days$sa$, $ra$Pretty average$ra$, $ta$Everyday — maybe even more than once$ta$, 3),
  ($id$impulse$id$, $p$When I crave something but know it isn't what I need in the moment, my ability to stay the course is...$p$, $sa$Good — I have amazing willpower$sa$, $ra$Okay — I do a pretty good job making healthy decisions for myself$ra$, $ta$I'll try again next time$ta$, 4),
  ($id$speech$id$, $p$Others would describe the way I speak as...$p$, $sa$Angelic, soft, and smooth$sa$, $ra$A little overwhelming — it can be agitating$ra$, $ta$Lacking some oomph — kind of melancholy$ta$, 5),
  ($id$cleanliness$id$, $p$When it comes to cleanliness...$p$, $sa$Next to godly — I keep my house, my workspace, and myself clean. It's a priority.$sa$, $ra$I do a pretty good job and manage to keep up with my space$ra$, $ta$Honestly not important to me — I'm very busy and have a lot of other things to do$ta$, 6),
  ($id$work$id$, $p$I would define my work as...$p$, $sa$A benefit to others$sa$, $ra$Being successful and getting that promotion$ra$, $ta$I could do a little more, but I prefer to do the bare minimum until I can retire$ta$, 7),
  ($id$anger$id$, $p$Things that rile me up — I find myself getting angry...$p$, $sa$Rarely$sa$, $ra$Every once in a while$ra$, $ta$Quite frequently$ta$, 8),
  ($id$melancholy$id$, $p$I find myself feeling down or melancholy...$p$, $sa$Never — I'm really pretty content$sa$, $ra$Sometimes$ra$, $ta$More than I would like$ta$, 9),
  ($id$relationships$id$, $p$In my relationships, people consider me...$p$, $sa$Very generous with love$sa$, $ra$Taking more than I give$ra$, $ta$Needy$ta$, 10),
  ($id$forgiveness$id$, $p$When I am wronged, I forgive...$p$, $sa$Immediately — it really comes easily$sa$, $ra$It takes time and energy, but I get there$ra$, $ta$No way. I am holding onto that grudge for life.$ta$, 11),
  ($id$meditation$id$, $p$Meditation...$p$, $sa$Daily without fail$sa$, $ra$Here and there — maybe once a week, inconsistent$ra$, $ta$Almost never$ta$, 12),
  ($id$spiritual$id$, $p$My spiritual practice is...$p$, $sa$Daily$sa$, $ra$Weeklyish$ra$, $ta$Very rare$ta$, 13),
  ($id$honesty$id$, $p$Honesty is the best policy...$p$, $sa$All the time — even when it's painful. I'd rather tell the truth.$sa$, $ra$Most of the time. I usually tell the truth, though sometimes I may tell tiny lies or leave things out.$ra$, $ta$All the time... wink wink. Maybe I stretch the truth if I'm going to get in trouble, or if it's fun.$ta$, 14),
  ($id$focus$id$, $p$My ability to focus on any one given task is...$p$, $sa$Good — I bring full attention to the situation, person, or thing$sa$, $ra$Sometimes able and sometimes it's a challenge$ra$, $ta$Poor — I tend to multitask a lot$ta$, 15);