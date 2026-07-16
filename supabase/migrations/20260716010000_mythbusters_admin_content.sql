-- L. Glow — admin-editable content, first content type: mythbusters
-- Run in the Supabase SQL Editor after the prior migrations.
--
-- First piece of the "Thea can edit her own content" admin hub (Matt's call,
-- July 2026). Content tables are public-read (this is app content shipped to
-- every user regardless of account, same as it being bundled in the JS
-- today) and practitioner-write only, using the same is_practitioner()
-- SECURITY DEFINER function from the practitioner dashboard's RLS fix —
-- avoids re-introducing that recursion bug.
--
-- Seeded with everything currently in data/content/mythbusters.js so nothing
-- regresses when the app switches to reading from here. That static file
-- stays in the repo as the offline fallback (see data/content/remote.js) —
-- this table is the live, editable copy.

create table public.mythbusters (
  id              text primary key,
  series          text not null,
  week_start      date not null,
  myth            text not null,
  take            text,
  reframe         text,
  dosha_breakdown jsonb,
  app_prompt      text,
  challenge       jsonb,
  updated_at      timestamptz not null default now()
);

alter table public.mythbusters enable row level security;

create policy "Anyone can read mythbusters"
  on public.mythbusters for select
  using (true);

create policy "Practitioners can manage mythbusters"
  on public.mythbusters for all
  using (public.is_practitioner())
  with check (public.is_practitioner());

-- Auto-generated seed from data/content/mythbusters.js — do not hand-edit, regenerate if the source changes.
insert into public.mythbusters (id, series, week_start, myth, take, reframe, dosha_breakdown, app_prompt, challenge) values
  ($id$healthy-eat-more$id$, $s$agni$s$, '2026-08-17', $m$If it's healthy, eat more of it.$m$, $t$Girl, no. I've seen people destroy their digestion with kale, smoothies, and enough supplements to stock a GNC. Your body doesn't care what Instagram says. If you can't digest it, it's not helping you.$t$, $r$Healthy is contextual. If you can't digest it, that's information — not failure.$r$, null, null, null),
  ($id$snacking-metabolism$id$, $s$agni$s$, '2026-08-24', $m$Snacking all day boosts metabolism.$m$, $t$Or you're just keeping your digestive system clocked in for a double shift. Your gut deserves lunch breaks too.$t$, $r$Your digestion needs rest between meals. Space is part of how it heals.$r$, null, null, null),
  ($id$cold-smoothies$id$, $s$agni$s$, '2026-08-31', $m$Cold smoothies are the pinnacle of health.$m$, $t$For some people? Absolutely. For others? That's basically putting ice cubes on a campfire and wondering why dinner isn't cooking.$t$, $r$Nothing works for everyone. Cold can extinguish a low fire as easily as it can refresh an overheated one.$r$, null, null, null),
  ($id$more-hunger-better$id$, $s$agni$s$, '2026-09-07', $m$More hunger = better metabolism.$m$, $t$Not always. Sometimes that's your body thriving. Sometimes that's your body screaming: "Ma'am, where are the nutrients?"$t$, $r$Hunger is information. Learn the difference between Agni asking for fuel and Agni asking for help.$r$, null, null, null),
  ($id$eating-less-fixes-all$id$, $s$agni$s$, '2026-09-14', $m$Eating less fixes everything.$m$, $t$Your body isn't a Tesla. You can't run it on 4% battery and expect peak performance.$t$, $r$You can't run on empty and call it a practice. Quality and rhythm matter more than subtraction.$r$, null, null, null),
  ($id$bloating-normal$id$, $s$agni$s$, '2026-09-21', $m$Bloating is normal.$m$, $t$Common? Yep. Normal? Not necessarily. Your stomach isn't supposed to look six months pregnant after a salad.$t$, $r$Common and normal aren't the same thing. Bloating is a signal — and signals deserve curiosity, not acceptance.$r$, null, null, null),
  ($id$more-fiber$id$, $s$agni$s$, '2026-09-28', $m$More fiber. More better.$m$, $t$If digestion is weak, throwing more fiber at it can be like adding more traffic to a highway that's already backed up.$t$, $r$Fiber supports strong Agni. When Agni is weak, you work with the fire first.$r$, null, null, null),
  ($id$spicy-fixes-digestion$id$, $s$agni$s$, '2026-10-05', $m$Spicy food fixes digestion.$m$, $t$Until it doesn't. Medicine and poison often share the same address. The difference is dose.$t$, $r$Spice can kindle a low fire — or inflame one that's already burning too hot. Dose and context are everything.$r$, null, null, null),
  ($id$calories-all-that-matters$id$, $s$agni$s$, '2026-10-12', $m$Calories are all that matter.$m$, $t$Ayurveda respectfully disagrees. You are not a math problem. You are a living, breathing ecosystem.$t$, $r$How you eat, when you eat, and what state you're in when you eat matters as much as what's on the plate.$r$, null, null, null),
  ($id$digestion-starts-stomach$id$, $s$agni$s$, '2026-10-19', $m$Digestion starts when food hits your stomach.$m$, $t$Digestion starts when you smell the food. See the food. Think about the food. Or when you're answering emails while inhaling a protein bar in your car.$t$, $r$Presence at the meal is part of the practice. Distracted eating is partially undigested eating.$r$, null, null, null),
  ($id$food-problem$id$, $s$agni$s$, '2026-10-26', $m$You have a food problem.$m$, $t$Maybe. But you might actually have a stress problem. A sleep problem. A speed problem. A "trying to do everything for everyone" problem.$t$, $r$Fix the conditions around the meal — stress, speed, sleep — and food often takes care of itself.$r$, null, null, null),
  ($id$another-supplement$id$, $s$agni$s$, '2026-11-02', $m$The answer is another supplement.$m$, $t$The supplement aisle is not a personality trait. Sometimes the answer is: slow down, chew your food, go outside, stop eating standing over the sink.$t$, $r$Supplements can support a strong foundation. They can't replace one.$r$, null, null, null),
  ($id$more-water-better$id$, $s$general$s$, '2026-11-09', $m$More water is always better.$m$, $t$Hydration matters. But Ayurveda asks a different question: can your body actually process the water you're drinking?

If digestion and metabolism are weak — especially in Kapha types — excess water can contribute to puffiness, water retention, sluggish digestion, reduced appetite, and weaker digestive fire.$t$, $r$Instead of "How much water did I drink?" — ask "How thirsty am I? How is my digestion? How is my energy?"$r$, $db${"vata":{"medicine":["Warm water","Herbal tea","Small frequent sips"],"poison":["Forgetting to drink all day","Ice water","Chugging huge amounts at once"]},"pitta":{"medicine":["Room temp water","Coconut water","Cooling herbal infusions"],"poison":["Dehydration","Excess alcohol","Excess coffee"]},"kapha":{"medicine":["Warm water","Ginger tea","Cinnamon tea","Hot lemon water"],"poison":["Gallons of cold water","Drinking when not thirsty","Constant sipping all day"]}}$db$::jsonb, $ap$Do you feel thirsty, or are you drinking because you think you should?$ap$, null),
  ($id$water-before-meals$id$, $s$general$s$, '2026-11-16', $m$Drink a giant glass of water before meals to lose weight.$m$, $t$For some people this may help with appetite. But from an Ayurvedic perspective, you may also be diluting your digestive strength.

Think of digestion as a campfire. A few drops? Fine. A bucket? Problem.$t$, $r$Hydrate between meals. Small sips during. Listen to thirst.$r$, null, $ap$Agni doesn't need flooding. It needs support.$ap$, null),
  ($id$hungry-eat$id$, $s$general$s$, '2026-11-23', $m$If you're hungry, eat.$m$, $t$There's a difference between hunger — your body asking for fuel — and appetite — your mind asking for stimulation.

Real hunger feels gradual, steady, patient, open to many foods. Appetite often feels urgent, specific, emotional, bored, or stress-driven.$t$, $r$Are you hungry? Or do you need rest, water, connection, movement, or just a break?$r$, null, $ap$What sounds good right now? If the answer is "only chips," "only chocolate," "only wine" — that's often appetite talking. Not hunger.$ap$, null),
  ($id$eating-less-healthier$id$, $s$general$s$, '2026-11-30', $m$Eating less is always healthier.$m$, $t$Not if you're growing, recovering, pregnant, breastfeeding, training hard, healing, or under stress.

A teenager needs different fuel than a sedentary adult. A marathon runner needs different fuel than an office worker. A postpartum mother needs different fuel than both.$t$, $r$The question isn't how little you can eat. It's what your body actually needs right now.$r$, null, null, null),
  ($id$big-appetite-wrong$id$, $s$general$s$, '2026-12-07', $m$A big appetite means something is wrong.$m$, $t$Sometimes. But sometimes it means your digestive fire is strong. A healthy appetite generally signals digestion is working, metabolism is functioning, and the body is asking for fuel.$t$, $r$The goal isn't suppressing hunger. The goal is understanding it.$r$, null, null, null),
  ($id$drink-while-eating$id$, $s$general$s$, '2026-12-14', $m$You should drink while eating.$m$, $t$You shouldn't avoid liquids — you also shouldn't wash your meal down.

Before a meal: a little water, maybe tea, maybe digestive bitters. During: small sips, warm or room temperature. After: allow digestion to begin before reaching for a big drink.$t$, $r$Sip. Don't flood.$r$, null, null, null),
  ($id$weight-calories$id$, $s$general$s$, '2026-12-21', $m$Weight gain is always about calories.$m$, $t$Digestion matters. Metabolism matters. Absorption matters. Inflammation, hormones, stress, and sleep all matter.

Not everyone processes food the same way — and a calorie count doesn't tell you any of that.$t$, $r$Instead of "How many calories did I eat?" — ask how your digestion was, whether you were satisfied, whether you had energy after.$r$, null, $ap$How was your digestion today? Were you bloated, satisfied, energized?$ap$, null),
  ($id$cold-drinks-healthy$id$, $s$general$s$, '2026-12-28', $m$Cold drinks are healthy.$m$, $t$Cold isn't automatically bad. But for many people — especially Vata and Kapha types, those with weak Agni, during meals, or in cold seasons — cold drinks can weaken digestion.$t$, $r$Warm tea, warm lemon water, room temp water. Ice water with meals is the one worth reconsidering.$r$, null, null, $ch${"title":"The Ice Water Test","instructions":"For one week, replace ice water with room temperature or warm water.","track":["Bloating","Energy","Bowel movements","Hunger","Cravings"]}$ch$::jsonb),
  ($id$cravings-problem$id$, $s$general$s$, '2027-01-04', $m$Your cravings are the problem.$m$, $t$Your cravings are information. Not instructions. Not enemies.

A craving might mean low blood sugar, poor sleep, emotional depletion, missing taste categories, hormonal changes, or weak digestion.$t$, $r$The goal is curiosity. Not guilt.$r$, null, null, null);