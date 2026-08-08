-- L. Glow — admin-editable content: Agni Assessment questions, same pattern
-- as guna_questions (20260716040000). Run in the Supabase SQL Editor after
-- the prior migrations.
--
-- Each question always has exactly one option per agni type (sama/vishama/
-- tikshna/manda), so this is flattened into 4 label columns per question
-- rather than a nested options array — matches the real fixed shape, same
-- reasoning as guna_questions' 3-column layout.
--
-- Content is still [DRAFT] — see data/content/agniQuiz.js's header comment.
-- Making it admin-editable doesn't change that status; Thea still owns
-- final review before any of this ships as approved copy.

create table public.agni_questions (
  id            text primary key,
  prompt        text not null,
  sama_label    text not null,
  vishama_label text not null,
  tikshna_label text not null,
  manda_label   text not null,
  sort_order    int not null,
  updated_at    timestamptz not null default now()
);

alter table public.agni_questions enable row level security;

create policy "Anyone can read agni questions"
  on public.agni_questions for select
  using (true);

create policy "Practitioners can manage agni questions"
  on public.agni_questions for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/agniQuiz.js's agniQuestions export — do not hand-edit, regenerate if the source changes.
insert into public.agni_questions (id, prompt, sama_label, vishama_label, tikshna_label, manda_label, sort_order) values
  ($id$appetite$id$, $p$My appetite day to day is...$p$, $sm$Regular and reliable — I get hungry at roughly the same times each day$sm$, $vs$Unpredictable — sometimes ravenous, sometimes no appetite at all$vs$, $tk$Strong and urgent — I get very hungry and irritable if I miss a meal$tk$, $md$Slow to arrive — I'm often not hungry in the morning$md$, 1),
  ($id$digestion$id$, $p$After a meal, I usually feel...$p$, $sm$Satisfied and comfortable — digestion is smooth$sm$, $vs$Variable — sometimes fine, sometimes bloated or gassy$vs$, $tk$Quick — food moves through me fast, sometimes too fast$tk$, $md$Heavy — it takes a long time to feel light again$md$, 2),
  ($id$energy$id$, $p$My energy through the day is...$p$, $sm$Steady — consistent energy from morning through evening$sm$, $vs$Variable — swings between too high and too low, hard to predict$vs$, $tk$Intense — I push hard but sometimes burn out or overheat$tk$, $md$Low — I often feel sluggish, especially after meals$md$, 3),
  ($id$elimination$id$, $p$My digestion and elimination is...$p$, $sm$Regular and comfortable — once or twice a day, consistent$sm$, $vs$Irregular — sometimes constipated, sometimes loose$vs$, $tk$Loose or frequent — sometimes urgent$tk$, $md$Slow or infrequent — constipation is common$md$, 4),
  ($id$bloating$id$, $p$Gas and bloating...$p$, $sm$Rarely bother me$sm$, $vs$Come and go — especially if I eat at irregular times or rush$vs$, $tk$Mostly acid reflux or heartburn is the issue, not bloating$tk$, $md$Are a regular thing — I feel heavy and full even hours after eating$md$, 5),
  ($id$brain-fog$id$, $p$Mental clarity and focus for me tend to be...$p$, $sm$Sharp and reliable most of the time$sm$, $vs$Scattered — hard to concentrate, mind wanders or anxious$vs$, $tk$Intense — I can focus sharply but can get overly critical or sharp$tk$, $md$Foggy — especially in the morning or after meals$md$, 6),
  ($id$stress-digestion$id$, $p$When I'm stressed or anxious...$p$, $sm$I can usually maintain my digestion and routine$sm$, $vs$My digestion becomes erratic — appetite vanishes or swings wildly$vs$, $tk$I get heartburn, inflammation, or feel overheated$tk$, $md$I slow down and want to eat comfort foods, then feel heavy$md$, 7),
  ($id$morning$id$, $p$In the morning, the first thing I notice is...$p$, $sm$A clear tongue, genuine hunger, and a clear mind$sm$, $vs$Unpredictable — some mornings great, others rough$vs$, $tk$Heat or acidity — maybe a coated tongue or acid in the stomach$tk$, $md$Heaviness, a thick coating on my tongue, and a slow start to the day$md$, 8);
