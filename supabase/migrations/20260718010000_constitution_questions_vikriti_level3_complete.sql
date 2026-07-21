-- L. Glow — Vikriti Level 3: "Your Story" — completes the tier, 51
-- questions (36 new + 15 replacing 3 placeholder/condensed ones from the
-- prior partial migration). Run in the Supabase SQL Editor after the prior
-- migrations. No schema changes.
--
-- The four sections left as bare topic words in the prior migration are
-- now fully written by Matt: Adolescence & Early Adulthood (12 questions),
-- Women's Health (12), Health Timeline (6), Lifestyle (6). All new, all
-- inserted below.
--
-- Three sections from the prior migration are being REPLACED, not just
-- added to — the first migration where this feature deletes previously-
-- live rows rather than only appending:
--   - story-life-chapters (one consolidated question, 11 options) ->
--     6 real questions (life_chapters section). The first one,
--     story-life-seasons-impact, is a revised/expanded version of the
--     same question (added Military service, Financial hardship, Grief or
--     loss as options) — not a new concept, the old row is superseded.
--   - story-relationship-with-food (PLACEHOLDER prompt, 8 options) ->
--     5 real questions. story-relationship-with-food itself gets its real
--     prompt now ("Which statements feel true for you?") plus 2 new
--     options (I eat when I'm bored / I use food for comfort) — same id
--     reused since it's the same question, just completed, not replaced
--     with something different.
--   - story-mindset (PLACEHOLDER prompt, 7 options) -> 4 real questions.
--     story-mindset itself gets its real prompt ("Which of these sound
--     like you?") plus 2 new options (I hold myself to very high
--     standards / I carry more than most people realize) — same id
--     reused for the same reason.
--
-- Untouched by this migration: childhood (6), family_patterns (5),
-- whole_story (3), and the closing reflection — not resent by Matt this
-- round, so left exactly as loaded.
--
-- sort_order fully replanned to fit real section sizes (the prior
-- migration's reserved gaps assumed sizes before real content existed).
-- Final order: childhood(10-60, unchanged) -> family_patterns(200-240,
-- unchanged) -> adolescence(300-410) -> womens_health(450-560) ->
-- life_chapters(600-650) -> health_timeline(680-730) -> lifestyle(750-800)
-- -> relationship_with_food(820-860) -> mindset(870-885) ->
-- whole_story(900-920, unchanged) -> closing(999, unchanged). Verified no
-- overlap with the untouched rows' existing sort_order values.
--
-- Same pattern as every Level 3/Level 2 question: every question ends
-- with its own uniquely worded catch-all as the last option, allow_none
-- false throughout. IDs prefixed story-, matching the existing convention.

delete from public.constitution_questions
where id in ('story-life-chapters', 'story-relationship-with-food', 'story-mindset');

insert into public.constitution_questions (id, assessment, tier, section, prompt, options, sort_order, allow_none, photo_enabled, input_type) values

  ($id$story-puberty-season$id$, 'vikriti', 'level3', 'adolescence', $p$Looking back at puberty, how would you describe that season of life?$p$, $opts$[
    {"label": "It felt smooth and relatively easy.", "dosha": [], "imageUrl": null},
    {"label": "My body changed earlier than most people my age.", "dosha": [], "imageUrl": null},
    {"label": "My body changed later than most people my age.", "dosha": [], "imageUrl": null},
    {"label": "Puberty felt confusing or overwhelming.", "dosha": [], "imageUrl": null},
    {"label": "My emotions became much more intense.", "dosha": [], "imageUrl": null},
    {"label": "I developed significant acne.", "dosha": [], "imageUrl": null},
    {"label": "My weight changed dramatically.", "dosha": [], "imageUrl": null},
    {"label": "I began comparing my body to others.", "dosha": [], "imageUrl": null},
    {"label": "I don't remember much about that time.", "dosha": [], "imageUrl": null},
    {"label": "That chapter of my life tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 300, false, false, 'multi_select'),

  ($id$story-teen-body-relationship$id$, 'vikriti', 'level3', 'adolescence', $p$During your teen years, what best described your relationship with your body?$p$, $opts$[
    {"label": "I generally felt comfortable in my body.", "dosha": [], "imageUrl": null},
    {"label": "I constantly compared myself to others.", "dosha": [], "imageUrl": null},
    {"label": "I was self-conscious about my appearance.", "dosha": [], "imageUrl": null},
    {"label": "I felt disconnected from my body.", "dosha": [], "imageUrl": null},
    {"label": "I learned to appreciate my body over time.", "dosha": [], "imageUrl": null},
    {"label": "My body image changed depending on the season of life.", "dosha": [], "imageUrl": null},
    {"label": "My relationship with my body has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 310, false, false, 'multi_select'),

  ($id$story-teen-food-relationship$id$, 'vikriti', 'level3', 'adolescence', $p$Growing up, what was your relationship with food?$p$, $opts$[
    {"label": "Meals felt enjoyable and predictable.", "dosha": [], "imageUrl": null},
    {"label": "Food was comforting.", "dosha": [], "imageUrl": null},
    {"label": "Food created stress.", "dosha": [], "imageUrl": null},
    {"label": "I often skipped meals.", "dosha": [], "imageUrl": null},
    {"label": "I ate whenever food was available.", "dosha": [], "imageUrl": null},
    {"label": "I learned to ignore my hunger.", "dosha": [], "imageUrl": null},
    {"label": "Dieting started early.", "dosha": [], "imageUrl": null},
    {"label": "Food was never discussed much.", "dosha": [], "imageUrl": null},
    {"label": "My relationship with food has always been unique.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 320, false, false, 'multi_select'),

  ($id$story-teen-energy$id$, 'vikriti', 'level3', 'adolescence', $p$What do you remember about your energy during adolescence?$p$, $opts$[
    {"label": "I always had plenty of energy.", "dosha": [], "imageUrl": null},
    {"label": "I often felt exhausted.", "dosha": [], "imageUrl": null},
    {"label": "My energy changed dramatically.", "dosha": [], "imageUrl": null},
    {"label": "I pushed through fatigue.", "dosha": [], "imageUrl": null},
    {"label": "I rarely slowed down.", "dosha": [], "imageUrl": null},
    {"label": "I needed more rest than my friends.", "dosha": [], "imageUrl": null},
    {"label": "My energy tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 330, false, false, 'multi_select'),

  ($id$story-teen-sleep$id$, 'vikriti', 'level3', 'adolescence', $p$Sleep during your teenage years looked like...$p$, $opts$[
    {"label": "I slept well most nights.", "dosha": [], "imageUrl": null},
    {"label": "I stayed up very late.", "dosha": [], "imageUrl": null},
    {"label": "I struggled falling asleep.", "dosha": [], "imageUrl": null},
    {"label": "I struggled waking up.", "dosha": [], "imageUrl": null},
    {"label": "I rarely felt rested.", "dosha": [], "imageUrl": null},
    {"label": "Sleep wasn't something I paid attention to.", "dosha": [], "imageUrl": null},
    {"label": "My sleep story has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 340, false, false, 'multi_select'),

  ($id$story-teen-exercise$id$, 'vikriti', 'level3', 'adolescence', $p$Exercise during adolescence...$p$, $opts$[
    {"label": "I loved moving my body.", "dosha": [], "imageUrl": null},
    {"label": "Sports were a huge part of my life.", "dosha": [], "imageUrl": null},
    {"label": "Exercise felt like punishment.", "dosha": [], "imageUrl": null},
    {"label": "I exercised to change my body.", "dosha": [], "imageUrl": null},
    {"label": "I avoided exercise.", "dosha": [], "imageUrl": null},
    {"label": "My movement story has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 350, false, false, 'multi_select'),

  ($id$story-teen-stress-source$id$, 'vikriti', 'level3', 'adolescence', $p$Stress during those years usually came from...$p$, $opts$[
    {"label": "School", "dosha": [], "imageUrl": null},
    {"label": "Sports", "dosha": [], "imageUrl": null},
    {"label": "Family", "dosha": [], "imageUrl": null},
    {"label": "Friendships", "dosha": [], "imageUrl": null},
    {"label": "Dating", "dosha": [], "imageUrl": null},
    {"label": "Perfectionism", "dosha": [], "imageUrl": null},
    {"label": "Financial concerns", "dosha": [], "imageUrl": null},
    {"label": "I don't remember feeling particularly stressed.", "dosha": [], "imageUrl": null},
    {"label": "My stress story has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 360, false, false, 'multi_select'),

  ($id$story-teen-self-connection$id$, 'vikriti', 'level3', 'adolescence', $p$Looking back, how connected did you feel to yourself?$p$, $opts$[
    {"label": "Very connected.", "dosha": [], "imageUrl": null},
    {"label": "I mostly followed what others expected.", "dosha": [], "imageUrl": null},
    {"label": "I often ignored what I needed.", "dosha": [], "imageUrl": null},
    {"label": "I felt like I was constantly trying to fit in.", "dosha": [], "imageUrl": null},
    {"label": "I've become much more connected over time.", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 370, false, false, 'multi_select'),

  ($id$story-teen-health-messages$id$, 'vikriti', 'level3', 'adolescence', $p$What messages did you receive about health growing up?$p$, $opts$[
    {"label": "Food is medicine.", "dosha": [], "imageUrl": null},
    {"label": "Finish everything on your plate.", "dosha": [], "imageUrl": null},
    {"label": "Thin equals healthy.", "dosha": [], "imageUrl": null},
    {"label": "Exercise burns calories.", "dosha": [], "imageUrl": null},
    {"label": "Health wasn't talked about.", "dosha": [], "imageUrl": null},
    {"label": "We ate whatever we could afford.", "dosha": [], "imageUrl": null},
    {"label": "My family had its own beliefs about health.", "dosha": [], "imageUrl": null},
    {"label": "My experience was different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 380, false, false, 'multi_select'),

  ($id$story-teen-shaped-by$id$, 'vikriti', 'level3', 'adolescence', $p$Looking back, what shaped you most?$p$, $opts$[
    {"label": "Family dynamics", "dosha": [], "imageUrl": null},
    {"label": "Athletics", "dosha": [], "imageUrl": null},
    {"label": "Academics", "dosha": [], "imageUrl": null},
    {"label": "Faith", "dosha": [], "imageUrl": null},
    {"label": "Creativity", "dosha": [], "imageUrl": null},
    {"label": "Illness", "dosha": [], "imageUrl": null},
    {"label": "Responsibility", "dosha": [], "imageUrl": null},
    {"label": "Independence", "dosha": [], "imageUrl": null},
    {"label": "My story was different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 390, false, false, 'multi_select'),

  ($id$story-teen-lessons$id$, 'vikriti', 'level3', 'adolescence', $p$During adolescence I learned to...$p$, $opts$[
    {"label": "Trust my body.", "dosha": [], "imageUrl": null},
    {"label": "Ignore my body.", "dosha": [], "imageUrl": null},
    {"label": "Push through discomfort.", "dosha": [], "imageUrl": null},
    {"label": "Care for others first.", "dosha": [], "imageUrl": null},
    {"label": "Stay busy.", "dosha": [], "imageUrl": null},
    {"label": "Stay small.", "dosha": [], "imageUrl": null},
    {"label": "Stay strong.", "dosha": [], "imageUrl": null},
    {"label": "My lessons were different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 400, false, false, 'multi_select'),

  ($id$story-teen-summary$id$, 'vikriti', 'level3', 'adolescence', $p$If you could describe those years in one sentence...$p$, $opts$[
    {"label": "They gave me confidence.", "dosha": [], "imageUrl": null},
    {"label": "They taught me resilience.", "dosha": [], "imageUrl": null},
    {"label": "They were emotionally difficult.", "dosha": [], "imageUrl": null},
    {"label": "They shaped who I am today.", "dosha": [], "imageUrl": null},
    {"label": "I'm still healing from that season.", "dosha": [], "imageUrl": null},
    {"label": "That chapter can't be summarized by these choices.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 410, false, false, 'multi_select'),

  ($id$story-menstrual-cycle$id$, 'vikriti', 'level3', 'womens_health', $p$My menstrual cycle has generally been...$p$, $opts$[
    {"label": "Very regular.", "dosha": [], "imageUrl": null},
    {"label": "Mostly predictable.", "dosha": [], "imageUrl": null},
    {"label": "Irregular.", "dosha": [], "imageUrl": null},
    {"label": "Painful.", "dosha": [], "imageUrl": null},
    {"label": "Heavy.", "dosha": [], "imageUrl": null},
    {"label": "Very light.", "dosha": [], "imageUrl": null},
    {"label": "Missing for periods of time.", "dosha": [], "imageUrl": null},
    {"label": "I no longer menstruate.", "dosha": [], "imageUrl": null},
    {"label": "My cycle tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 450, false, false, 'multi_select'),

  ($id$story-cycle-symptoms$id$, 'vikriti', 'level3', 'womens_health', $p$During my cycle I commonly experience...$p$, $opts$[
    {"label": "Stable energy.", "dosha": [], "imageUrl": null},
    {"label": "Mood changes.", "dosha": [], "imageUrl": null},
    {"label": "Cramping.", "dosha": [], "imageUrl": null},
    {"label": "Fatigue.", "dosha": [], "imageUrl": null},
    {"label": "Food cravings.", "dosha": [], "imageUrl": null},
    {"label": "Bloating.", "dosha": [], "imageUrl": null},
    {"label": "Headaches.", "dosha": [], "imageUrl": null},
    {"label": "Very few symptoms.", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 460, false, false, 'multi_select'),

  ($id$story-hormonal-changes$id$, 'vikriti', 'level3', 'womens_health', $p$Hormonal changes throughout life have felt...$p$, $opts$[
    {"label": "Fairly smooth.", "dosha": [], "imageUrl": null},
    {"label": "Noticeable but manageable.", "dosha": [], "imageUrl": null},
    {"label": "Difficult.", "dosha": [], "imageUrl": null},
    {"label": "Unpredictable.", "dosha": [], "imageUrl": null},
    {"label": "Life-changing.", "dosha": [], "imageUrl": null},
    {"label": "My hormones have told a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 470, false, false, 'multi_select'),

  ($id$story-pregnancy$id$, 'vikriti', 'level3', 'womens_health', $p$Pregnancy has been...$p$, $opts$[
    {"label": "Not part of my story.", "dosha": [], "imageUrl": null},
    {"label": "A joyful chapter.", "dosha": [], "imageUrl": null},
    {"label": "Physically demanding.", "dosha": [], "imageUrl": null},
    {"label": "Emotionally challenging.", "dosha": [], "imageUrl": null},
    {"label": "Both beautiful and difficult.", "dosha": [], "imageUrl": null},
    {"label": "A different experience than these choices.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 480, false, false, 'multi_select'),

  ($id$story-postpartum$id$, 'vikriti', 'level3', 'womens_health', $p$If you've experienced postpartum...$p$, $opts$[
    {"label": "Recovery felt smooth.", "dosha": [], "imageUrl": null},
    {"label": "It took longer than expected.", "dosha": [], "imageUrl": null},
    {"label": "I struggled emotionally.", "dosha": [], "imageUrl": null},
    {"label": "I struggled physically.", "dosha": [], "imageUrl": null},
    {"label": "I needed more support than I received.", "dosha": [], "imageUrl": null},
    {"label": "This chapter tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 490, false, false, 'multi_select'),

  ($id$story-birth-control$id$, 'vikriti', 'level3', 'womens_health', $p$Birth control has...$p$, $opts$[
    {"label": "Worked well for me.", "dosha": [], "imageUrl": null},
    {"label": "Improved symptoms.", "dosha": [], "imageUrl": null},
    {"label": "Caused unwanted side effects.", "dosha": [], "imageUrl": null},
    {"label": "Changed how I felt emotionally.", "dosha": [], "imageUrl": null},
    {"label": "Been an important part of my health journey.", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 500, false, false, 'multi_select'),

  ($id$story-fertility$id$, 'vikriti', 'level3', 'womens_health', $p$Fertility has been...$p$, $opts$[
    {"label": "Straightforward.", "dosha": [], "imageUrl": null},
    {"label": "A journey.", "dosha": [], "imageUrl": null},
    {"label": "Something I've worried about.", "dosha": [], "imageUrl": null},
    {"label": "Not part of my story.", "dosha": [], "imageUrl": null},
    {"label": "My fertility story has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 510, false, false, 'multi_select'),

  ($id$story-pregnancy-loss$id$, 'vikriti', 'level3', 'womens_health', $p$If you've experienced pregnancy loss...$p$, $opts$[
    {"label": "It isn't part of my story.", "dosha": [], "imageUrl": null},
    {"label": "It changed me deeply.", "dosha": [], "imageUrl": null},
    {"label": "It affected my physical health.", "dosha": [], "imageUrl": null},
    {"label": "It affected my emotional health.", "dosha": [], "imageUrl": null},
    {"label": "My experience is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 520, false, false, 'multi_select'),

  ($id$story-perimenopause$id$, 'vikriti', 'level3', 'womens_health', $p$Perimenopause has felt...$p$, $opts$[
    {"label": "Too early to answer.", "dosha": [], "imageUrl": null},
    {"label": "Gentle.", "dosha": [], "imageUrl": null},
    {"label": "Noticeable.", "dosha": [], "imageUrl": null},
    {"label": "Challenging.", "dosha": [], "imageUrl": null},
    {"label": "Completely unexpected.", "dosha": [], "imageUrl": null},
    {"label": "Different than these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 530, false, false, 'multi_select'),

  ($id$story-menopause$id$, 'vikriti', 'level3', 'womens_health', $p$Menopause has been...$p$, $opts$[
    {"label": "A smooth transition.", "dosha": [], "imageUrl": null},
    {"label": "A difficult transition.", "dosha": [], "imageUrl": null},
    {"label": "A relief.", "dosha": [], "imageUrl": null},
    {"label": "Still unfolding.", "dosha": [], "imageUrl": null},
    {"label": "My menopause story is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 540, false, false, 'multi_select'),

  ($id$story-reproductive-health-overall$id$, 'vikriti', 'level3', 'womens_health', $p$Looking at your reproductive health as a whole...$p$, $opts$[
    {"label": "I feel connected to it.", "dosha": [], "imageUrl": null},
    {"label": "I've learned a lot over time.", "dosha": [], "imageUrl": null},
    {"label": "It has felt confusing.", "dosha": [], "imageUrl": null},
    {"label": "It has required advocacy.", "dosha": [], "imageUrl": null},
    {"label": "It's still evolving.", "dosha": [], "imageUrl": null},
    {"label": "My story looks different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 550, false, false, 'multi_select'),

  ($id$story-reproductive-lessons$id$, 'vikriti', 'level3', 'womens_health', $p$Overall, this chapter has taught me...$p$, $opts$[
    {"label": "Strength.", "dosha": [], "imageUrl": null},
    {"label": "Patience.", "dosha": [], "imageUrl": null},
    {"label": "Trust.", "dosha": [], "imageUrl": null},
    {"label": "Resilience.", "dosha": [], "imageUrl": null},
    {"label": "Compassion.", "dosha": [], "imageUrl": null},
    {"label": "Lessons I can't summarize here.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 560, false, false, 'multi_select'),

  ($id$story-life-seasons-impact$id$, 'vikriti', 'level3', 'life_chapters', $p$Which seasons of life have had the biggest impact on your health?$p$, $opts$[
    {"label": "College or higher education", "dosha": [], "imageUrl": null},
    {"label": "Working night shifts", "dosha": [], "imageUrl": null},
    {"label": "Parenting", "dosha": [], "imageUrl": null},
    {"label": "Marriage or long-term partnership", "dosha": [], "imageUrl": null},
    {"label": "Divorce or separation", "dosha": [], "imageUrl": null},
    {"label": "Caring for aging parents or loved ones", "dosha": [], "imageUrl": null},
    {"label": "Starting or running a business", "dosha": [], "imageUrl": null},
    {"label": "Career burnout", "dosha": [], "imageUrl": null},
    {"label": "A major move or relocation", "dosha": [], "imageUrl": null},
    {"label": "Retirement", "dosha": [], "imageUrl": null},
    {"label": "Military service", "dosha": [], "imageUrl": null},
    {"label": "Financial hardship", "dosha": [], "imageUrl": null},
    {"label": "Grief or loss", "dosha": [], "imageUrl": null},
    {"label": "My journey has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 600, false, false, 'multi_select'),

  ($id$story-life-season-most-change$id$, 'vikriti', 'level3', 'life_chapters', $p$Which life season changed you the most?$p$, $opts$[
    {"label": "Becoming an adult", "dosha": [], "imageUrl": null},
    {"label": "Becoming a parent", "dosha": [], "imageUrl": null},
    {"label": "My career", "dosha": [], "imageUrl": null},
    {"label": "A health challenge", "dosha": [], "imageUrl": null},
    {"label": "Loss or grief", "dosha": [], "imageUrl": null},
    {"label": "Retirement", "dosha": [], "imageUrl": null},
    {"label": "My story is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 610, false, false, 'multi_select'),

  ($id$story-transition-response$id$, 'vikriti', 'level3', 'life_chapters', $p$During life's biggest transitions I usually...$p$, $opts$[
    {"label": "Adapt quickly.", "dosha": [], "imageUrl": null},
    {"label": "Push through.", "dosha": [], "imageUrl": null},
    {"label": "Feel overwhelmed.", "dosha": [], "imageUrl": null},
    {"label": "Lean on others.", "dosha": [], "imageUrl": null},
    {"label": "Become more independent.", "dosha": [], "imageUrl": null},
    {"label": "My pattern is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 620, false, false, 'multi_select'),

  ($id$story-body-response-to-change$id$, 'vikriti', 'level3', 'life_chapters', $p$Looking back, my body usually responded to major life changes by...$p$, $opts$[
    {"label": "Becoming stronger.", "dosha": [], "imageUrl": null},
    {"label": "Becoming exhausted.", "dosha": [], "imageUrl": null},
    {"label": "Developing new symptoms.", "dosha": [], "imageUrl": null},
    {"label": "Needing more rest.", "dosha": [], "imageUrl": null},
    {"label": "Becoming more resilient.", "dosha": [], "imageUrl": null},
    {"label": "My body responded differently.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 630, false, false, 'multi_select'),

  ($id$story-resilience-source$id$, 'vikriti', 'level3', 'life_chapters', $p$My greatest source of resilience has been...$p$, $opts$[
    {"label": "Family", "dosha": [], "imageUrl": null},
    {"label": "Friends", "dosha": [], "imageUrl": null},
    {"label": "Faith", "dosha": [], "imageUrl": null},
    {"label": "Nature", "dosha": [], "imageUrl": null},
    {"label": "Work", "dosha": [], "imageUrl": null},
    {"label": "Movement", "dosha": [], "imageUrl": null},
    {"label": "Creativity", "dosha": [], "imageUrl": null},
    {"label": "Community", "dosha": [], "imageUrl": null},
    {"label": "My resilience comes from somewhere else.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 640, false, false, 'multi_select'),

  ($id$story-chapters-metaphor$id$, 'vikriti', 'level3', 'life_chapters', $p$If you looked at your life as chapters...$p$, $opts$[
    {"label": "They built me.", "dosha": [], "imageUrl": null},
    {"label": "They challenged me.", "dosha": [], "imageUrl": null},
    {"label": "They transformed me.", "dosha": [], "imageUrl": null},
    {"label": "I'm still writing the next one.", "dosha": [], "imageUrl": null},
    {"label": "My story doesn't fit into these choices.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 650, false, false, 'multi_select'),

  ($id$story-health-events$id$, 'vikriti', 'level3', 'health_timeline', $p$Which health events have shaped your life?$p$, $opts$[
    {"label": "Major surgery", "dosha": [], "imageUrl": null},
    {"label": "Significant injury", "dosha": [], "imageUrl": null},
    {"label": "Frequent antibiotics", "dosha": [], "imageUrl": null},
    {"label": "COVID-19 illness", "dosha": [], "imageUrl": null},
    {"label": "Hospitalization", "dosha": [], "imageUrl": null},
    {"label": "Chronic pain", "dosha": [], "imageUrl": null},
    {"label": "Digestive illness", "dosha": [], "imageUrl": null},
    {"label": "Autoimmune diagnosis", "dosha": [], "imageUrl": null},
    {"label": "Concussions or head injuries", "dosha": [], "imageUrl": null},
    {"label": "Cancer", "dosha": [], "imageUrl": null},
    {"label": "Chronic infections", "dosha": [], "imageUrl": null},
    {"label": "My health timeline has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 680, false, false, 'multi_select'),

  ($id$story-post-event-body$id$, 'vikriti', 'level3', 'health_timeline', $p$Since those experiences, my body has...$p$, $opts$[
    {"label": "Fully recovered.", "dosha": [], "imageUrl": null},
    {"label": "Changed in noticeable ways.", "dosha": [], "imageUrl": null},
    {"label": "Become more sensitive.", "dosha": [], "imageUrl": null},
    {"label": "Become more resilient.", "dosha": [], "imageUrl": null},
    {"label": "Continued to surprise me.", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 690, false, false, 'multi_select'),

  ($id$story-recovery-pattern$id$, 'vikriti', 'level3', 'health_timeline', $p$Recovery has usually been...$p$, $opts$[
    {"label": "Quick.", "dosha": [], "imageUrl": null},
    {"label": "Slow.", "dosha": [], "imageUrl": null},
    {"label": "Up and down.", "dosha": [], "imageUrl": null},
    {"label": "Better than expected.", "dosha": [], "imageUrl": null},
    {"label": "Harder than expected.", "dosha": [], "imageUrl": null},
    {"label": "Different for me.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 700, false, false, 'multi_select'),

  ($id$story-medical-care-feeling$id$, 'vikriti', 'level3', 'health_timeline', $p$Medical care has generally felt...$p$, $opts$[
    {"label": "Supportive.", "dosha": [], "imageUrl": null},
    {"label": "Frustrating.", "dosha": [], "imageUrl": null},
    {"label": "Empowering.", "dosha": [], "imageUrl": null},
    {"label": "Confusing.", "dosha": [], "imageUrl": null},
    {"label": "Like I had to advocate for myself.", "dosha": [], "imageUrl": null},
    {"label": "My experience has been different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 710, false, false, 'multi_select'),

  ($id$story-health-looking-back$id$, 'vikriti', 'level3', 'health_timeline', $p$Looking back...$p$, $opts$[
    {"label": "My body has always bounced back.", "dosha": [], "imageUrl": null},
    {"label": "Recovery takes me longer.", "dosha": [], "imageUrl": null},
    {"label": "My health changed after one major event.", "dosha": [], "imageUrl": null},
    {"label": "My story is more gradual.", "dosha": [], "imageUrl": null},
    {"label": "My health journey has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 720, false, false, 'multi_select'),

  ($id$story-today-feeling$id$, 'vikriti', 'level3', 'health_timeline', $p$Today I feel...$p$, $opts$[
    {"label": "Strong.", "dosha": [], "imageUrl": null},
    {"label": "Healing.", "dosha": [], "imageUrl": null},
    {"label": "Still searching for answers.", "dosha": [], "imageUrl": null},
    {"label": "Learning to trust my body again.", "dosha": [], "imageUrl": null},
    {"label": "My experience is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 730, false, false, 'multi_select'),

  ($id$story-daily-schedule$id$, 'vikriti', 'level3', 'lifestyle', $p$My daily schedule has generally been...$p$, $opts$[
    {"label": "Consistent.", "dosha": [], "imageUrl": null},
    {"label": "Busy but manageable.", "dosha": [], "imageUrl": null},
    {"label": "Constantly changing.", "dosha": [], "imageUrl": null},
    {"label": "Shift work or irregular.", "dosha": [], "imageUrl": null},
    {"label": "My rhythm has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 750, false, false, 'multi_select'),

  ($id$story-technology-relationship$id$, 'vikriti', 'level3', 'lifestyle', $p$My relationship with technology is...$p$, $opts$[
    {"label": "Healthy.", "dosha": [], "imageUrl": null},
    {"label": "Constantly connected.", "dosha": [], "imageUrl": null},
    {"label": "Hard to disconnect from.", "dosha": [], "imageUrl": null},
    {"label": "Balanced most days.", "dosha": [], "imageUrl": null},
    {"label": "Different than these choices.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 760, false, false, 'multi_select'),

  ($id$story-nature-time$id$, 'vikriti', 'level3', 'lifestyle', $p$Time in nature has been...$p$, $opts$[
    {"label": "Part of my routine.", "dosha": [], "imageUrl": null},
    {"label": "Occasional.", "dosha": [], "imageUrl": null},
    {"label": "Rare.", "dosha": [], "imageUrl": null},
    {"label": "Where I feel most like myself.", "dosha": [], "imageUrl": null},
    {"label": "My experience is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 770, false, false, 'multi_select'),

  ($id$story-lifetime-movement$id$, 'vikriti', 'level3', 'lifestyle', $p$Looking at movement across your lifetime...$p$, $opts$[
    {"label": "I've stayed consistently active.", "dosha": [], "imageUrl": null},
    {"label": "It has come in seasons.", "dosha": [], "imageUrl": null},
    {"label": "I've struggled to stay active.", "dosha": [], "imageUrl": null},
    {"label": "My movement story is unique.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 780, false, false, 'multi_select'),

  ($id$story-lifestyle-stress-source$id$, 'vikriti', 'level3', 'lifestyle', $p$Looking back, stress has usually come from...$p$, $opts$[
    {"label": "Work", "dosha": [], "imageUrl": null},
    {"label": "Family", "dosha": [], "imageUrl": null},
    {"label": "Finances", "dosha": [], "imageUrl": null},
    {"label": "Health", "dosha": [], "imageUrl": null},
    {"label": "Relationships", "dosha": [], "imageUrl": null},
    {"label": "Perfectionism", "dosha": [], "imageUrl": null},
    {"label": "Caregiving", "dosha": [], "imageUrl": null},
    {"label": "My story has looked different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 790, false, false, 'multi_select'),

  ($id$story-lifestyle-overall$id$, 'vikriti', 'level3', 'lifestyle', $p$Overall, my lifestyle has felt...$p$, $opts$[
    {"label": "Balanced.", "dosha": [], "imageUrl": null},
    {"label": "Full.", "dosha": [], "imageUrl": null},
    {"label": "Overwhelming.", "dosha": [], "imageUrl": null},
    {"label": "Purposeful.", "dosha": [], "imageUrl": null},
    {"label": "Always evolving.", "dosha": [], "imageUrl": null},
    {"label": "Different than these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 800, false, false, 'multi_select'),

  ($id$story-relationship-with-food$id$, 'vikriti', 'level3', 'relationship_with_food', $p$Which statements feel true for you?$p$, $opts$[
    {"label": "I've dieted for years.", "dosha": [], "imageUrl": null},
    {"label": "I don't trust my hunger.", "dosha": [], "imageUrl": null},
    {"label": "Food sometimes causes stress.", "dosha": [], "imageUrl": null},
    {"label": "I eat emotionally.", "dosha": [], "imageUrl": null},
    {"label": "I forget to eat.", "dosha": [], "imageUrl": null},
    {"label": "I've tried almost every diet.", "dosha": [], "imageUrl": null},
    {"label": "I eat when I'm bored.", "dosha": [], "imageUrl": null},
    {"label": "I use food for comfort.", "dosha": [], "imageUrl": null},
    {"label": "I have a peaceful relationship with food.", "dosha": [], "imageUrl": null},
    {"label": "My relationship with food tells a different story.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 820, false, false, 'multi_select'),

  ($id$story-hunger-feeling$id$, 'vikriti', 'level3', 'relationship_with_food', $p$Hunger usually feels...$p$, $opts$[
    {"label": "Easy to recognize.", "dosha": [], "imageUrl": null},
    {"label": "Easy to ignore.", "dosha": [], "imageUrl": null},
    {"label": "Unpredictable.", "dosha": [], "imageUrl": null},
    {"label": "Constant.", "dosha": [], "imageUrl": null},
    {"label": "Rare.", "dosha": [], "imageUrl": null},
    {"label": "Different for me.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 830, false, false, 'multi_select'),

  ($id$story-stress-eating-response$id$, 'vikriti', 'level3', 'relationship_with_food', $p$When life gets stressful, I usually...$p$, $opts$[
    {"label": "Eat more.", "dosha": [], "imageUrl": null},
    {"label": "Eat less.", "dosha": [], "imageUrl": null},
    {"label": "Crave sugar.", "dosha": [], "imageUrl": null},
    {"label": "Crave salty foods.", "dosha": [], "imageUrl": null},
    {"label": "Lose my appetite.", "dosha": [], "imageUrl": null},
    {"label": "My pattern is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 840, false, false, 'multi_select'),

  ($id$story-food-meaning$id$, 'vikriti', 'level3', 'relationship_with_food', $p$Food has mostly been...$p$, $opts$[
    {"label": "Nourishment.", "dosha": [], "imageUrl": null},
    {"label": "Comfort.", "dosha": [], "imageUrl": null},
    {"label": "Celebration.", "dosha": [], "imageUrl": null},
    {"label": "Control.", "dosha": [], "imageUrl": null},
    {"label": "Stress.", "dosha": [], "imageUrl": null},
    {"label": "Connection.", "dosha": [], "imageUrl": null},
    {"label": "Something else entirely.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 850, false, false, 'multi_select'),

  ($id$story-food-today$id$, 'vikriti', 'level3', 'relationship_with_food', $p$Today, my relationship with food feels...$p$, $opts$[
    {"label": "Peaceful.", "dosha": [], "imageUrl": null},
    {"label": "Better than it used to.", "dosha": [], "imageUrl": null},
    {"label": "Like a work in progress.", "dosha": [], "imageUrl": null},
    {"label": "Confusing.", "dosha": [], "imageUrl": null},
    {"label": "Healing.", "dosha": [], "imageUrl": null},
    {"label": "Different than these choices.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 860, false, false, 'multi_select'),

  ($id$story-mindset$id$, 'vikriti', 'level3', 'mindset', $p$Which of these sound like you?$p$, $opts$[
    {"label": "I usually put myself last.", "dosha": [], "imageUrl": null},
    {"label": "I struggle asking for help.", "dosha": [], "imageUrl": null},
    {"label": "I feel guilty resting.", "dosha": [], "imageUrl": null},
    {"label": "I have trouble slowing down.", "dosha": [], "imageUrl": null},
    {"label": "I'm hard on myself.", "dosha": [], "imageUrl": null},
    {"label": "I hold myself to very high standards.", "dosha": [], "imageUrl": null},
    {"label": "I carry more than most people realize.", "dosha": [], "imageUrl": null},
    {"label": "I'm learning to trust my body.", "dosha": [], "imageUrl": null},
    {"label": "My inner story feels different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 870, false, false, 'multi_select'),

  ($id$story-hard-times-response$id$, 'vikriti', 'level3', 'mindset', $p$When life gets hard, I usually...$p$, $opts$[
    {"label": "Push through.", "dosha": [], "imageUrl": null},
    {"label": "Withdraw.", "dosha": [], "imageUrl": null},
    {"label": "Stay busy.", "dosha": [], "imageUrl": null},
    {"label": "Ask for support.", "dosha": [], "imageUrl": null},
    {"label": "Try to fix everything.", "dosha": [], "imageUrl": null},
    {"label": "My response is different.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 875, false, false, 'multi_select'),

  ($id$story-inner-voice$id$, 'vikriti', 'level3', 'mindset', $p$My inner voice is most often...$p$, $opts$[
    {"label": "Compassionate.", "dosha": [], "imageUrl": null},
    {"label": "Critical.", "dosha": [], "imageUrl": null},
    {"label": "Encouraging.", "dosha": [], "imageUrl": null},
    {"label": "Demanding.", "dosha": [], "imageUrl": null},
    {"label": "Curious.", "dosha": [], "imageUrl": null},
    {"label": "Different than these options.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 880, false, false, 'multi_select'),

  ($id$story-current-chapter-feeling$id$, 'vikriti', 'level3', 'mindset', $p$Right now, the chapter I'm living feels like...$p$, $opts$[
    {"label": "Growth.", "dosha": [], "imageUrl": null},
    {"label": "Healing.", "dosha": [], "imageUrl": null},
    {"label": "Reinvention.", "dosha": [], "imageUrl": null},
    {"label": "Survival.", "dosha": [], "imageUrl": null},
    {"label": "Peace.", "dosha": [], "imageUrl": null},
    {"label": "A chapter I haven't found words for yet.", "dosha": [], "imageUrl": null}
  ]$opts$::jsonb, 885, false, false, 'multi_select');
