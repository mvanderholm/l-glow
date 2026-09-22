// L. Glôw's Weekly Habit Tracker — digitized from "The Habit Ayurveda: My
// Vedic Practice" worksheet (embedded in the cleanse developer guide,
// Sept 2026). The closing quote is a public-domain/widely-attributed
// Gautama Buddha quote already on the source worksheet, used verbatim
// with its existing attribution — not written for this app.

export const HABIT_TRACKER_META = {
  eyebrow: 'The Habit Ayurveda',
  title: 'My Vedic Practice',
  tagline: 'Observe the positive results of small daily actions.',
  closingQuote: 'Do not overlook tiny good actions, thinking they are of no benefit; even tiny drops of water in the end will fill a huge vessel. Do not overlook negative actions merely because they are small; however small a spark may be, it can burn down a haystack as big as a mountain.',
  closingQuoteAttribution: 'Gautama Buddha',
};

export const HABIT_CATEGORIES = [
  { id: 'uponWaking', label: 'Upon Waking' },
  { id: 'mealsFocus', label: 'Meals Focus' },
  { id: 'pocketsOfTime', label: 'Pockets of Time' },
  { id: 'beforeBed', label: 'Before Bed' },
];

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Suggested starting habits, matching the cleanse's own rules — editable
// or replaceable, per the dev guide ("the user should be able to edit or
// replace any of them and fill the empty slots with their own"). Each
// category has 3 slots; where the guide only names 1-2 concrete habits,
// the remaining slots start blank.
export const DEFAULT_HABITS = {
  uponWaking: ['Wake with the sun. Drink hot lemon water first thing.', '', ''],
  mealsFocus: ['Eat 2-3 times a day, always including lunch, with no snacking.', 'Eat mindfully, without distractions.', ''],
  pocketsOfTime: ['After each meal, lie on your left side for 5-20 minutes, then take a gentle 5-20 minute walk.', 'Nothing to drink for 1 hour after eating; between meals, only water, CCF tea, or lemon water.', ''],
  beforeBed: ['Finish dinner before 6:30 pm.', 'Asleep by 10 pm, if possible.', ''],
};

export const REFLECTION_PROMPTS = [
  { id: 'why', label: 'Why is this important?', hint: 'How will the week be more awesome if I do this?' },
  { id: 'whatsInTheWay', label: "What's in the way?", hint: "What's going to get in the way of me doing these things?" },
  { id: 'howCanIHelp', label: 'How can I help/hold myself?', hint: 'What strategies can I think of to overcome any obstacles to my self care?' },
];

export const DAILY_JOURNAL_PROMPTS = {
  morning: 'What does my body want today?',
  evening: 'The good things from today.',
};

// Sunday-start week key, e.g. for Sept 21 2026 (a Monday) -> Sept 20 2026.
// Matches the worksheet's own S M T W T F S ordering.
export function weekStartFor(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

export function emptyHabitsGrid() {
  return {
    uponWaking: DEFAULT_HABITS.uponWaking.map(label => ({ label, days: [false, false, false, false, false, false, false] })),
    mealsFocus: DEFAULT_HABITS.mealsFocus.map(label => ({ label, days: [false, false, false, false, false, false, false] })),
    pocketsOfTime: DEFAULT_HABITS.pocketsOfTime.map(label => ({ label, days: [false, false, false, false, false, false, false] })),
    beforeBed: DEFAULT_HABITS.beforeBed.map(label => ({ label, days: [false, false, false, false, false, false, false] })),
  };
}

export function emptyDailyJournal() {
  return WEEKDAY_NAMES.reduce((acc, _, i) => { acc[i] = { morning: '', evening: '' }; return acc; }, {});
}
