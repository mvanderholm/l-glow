import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import Svg, { Path, Circle } from 'react-native-svg';

const INTAKE_KEY = '@lglow/intake';

// ── Section definitions ────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Name, contact, and emergency info',
    fields: [
      { type: 'text',    key: 'name',              label: 'Full name' },
      { type: 'text',    key: 'dob',               label: 'Date of birth', placeholder: 'MM/DD/YYYY' },
      { type: 'text',    key: 'phone',             label: 'Phone number' },
      { type: 'text',    key: 'email',             label: 'Email address' },
      { type: 'text',    key: 'address',           label: 'Street address' },
      { type: 'text',    key: 'city',              label: 'City' },
      { type: 'text',    key: 'state',             label: 'State' },
      { type: 'text',    key: 'zip',               label: 'ZIP code' },
      { type: 'text',    key: 'genderIdentity',    label: 'Gender identity' },
      { type: 'divider', label: 'Emergency contact' },
      { type: 'text',    key: 'emergencyName',     label: 'Name' },
      { type: 'text',    key: 'emergencyRelation', label: 'Relationship' },
      { type: 'text',    key: 'emergencyPhone',    label: 'Phone' },
      { type: 'text',    key: 'referralSource',    label: 'How did you hear about L. Glow?' },
    ],
  },
  {
    id: 'consent',
    title: 'Scope & Consent',
    description: 'Please read before continuing',
    fields: [
      { type: 'info', text: 'DRAFT — Thea to review and rewrite before launch.\n\nWelcome. I am an ayurvedic practitioner and Registered Yoga Teacher. My work with you is rooted in the classical tradition of Ayurveda — a system of health that looks at you as a whole person, in your whole life, in this moment.\n\nI am not a medical doctor, naturopath, or licensed therapist. This practice is not a substitute for clinical care. I do not diagnose conditions, prescribe medications, or treat disease. If you have a serious health concern, please see a licensed provider.\n\nEverything you share with me is held in confidence. My notes and this intake form inform our work together and will not be shared without your explicit consent.\n\nBy agreeing below, you confirm that you understand the scope of this practice and consent to working with me under these terms.' },
      { type: 'check', key: 'consentAgreed', label: 'I have read this and I agree.' },
    ],
  },
  {
    id: 'concerns',
    title: 'Presenting Concerns',
    description: 'What brought you here',
    fields: [
      { type: 'textarea', key: 'reasonHere',        label: 'What brings you here?' },
      { type: 'text',     key: 'reasonDuration',    label: 'How long has this been present?' },
      { type: 'textarea', key: 'healthChallenges',  label: 'Your biggest current health challenges' },
      { type: 'text',     key: 'challengeDuration', label: 'How long have these been going on?' },
    ],
  },
  {
    id: 'history',
    title: 'Health History',
    description: 'Current care and past conditions',
    fields: [
      { type: 'textarea', key: 'currentProviders',   label: 'Current healthcare providers (name, specialty, what they\'re treating)' },
      { type: 'textarea', key: 'providersNotes',     label: 'Any improvements you\'ve noticed from current care?' },
      { type: 'textarea', key: 'pastMentalTrauma',   label: 'Past mental health conditions, trauma, addiction, or significant stress' },
      { type: 'textarea', key: 'familyHistory',      label: 'Family history of diagnosed illness' },
      { type: 'textarea', key: 'childhoodHealth',    label: 'Describe your health as a child' },
    ],
  },
  {
    id: 'routine',
    title: 'Daily Routine',
    description: 'How you move through your days',
    fields: [
      { type: 'textarea', key: 'morningRoutine',   label: 'Typical morning (waking to midday)' },
      { type: 'textarea', key: 'afternoonRoutine', label: 'Typical afternoon' },
      { type: 'textarea', key: 'eveningRoutine',   label: 'Typical evening' },
      { type: 'textarea', key: 'idealVsActual',    label: 'Your ideal routine — how does it differ from what actually happens?' },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Rest quality and patterns',
    fields: [
      { type: 'text',   key: 'wakeTime',          label: 'Usual wake time', placeholder: 'e.g. 6:30am' },
      { type: 'radio',  key: 'wakeConsistency',   label: 'Wake time consistency', options: ['Very consistent', 'Somewhat consistent', 'Varies a lot'] },
      { type: 'radio',  key: 'wakingFeeling',     label: 'How you feel on waking', options: ['Rested and alert', 'Groggy — takes time', 'Tired regardless of hours', 'Anxious or unsettled', 'It varies'] },
      { type: 'multi',  key: 'sleepIssues',       label: 'Sleep quality (check all that apply)', options: ['Wake frequently', 'Nightmares or vivid dreams', 'Hard to fall asleep', 'Sleep very deeply', 'Restless or active'] },
      { type: 'text',   key: 'napping',           label: 'Do you nap? How often and for how long?' },
      { type: 'text',   key: 'bedtime',           label: 'Usual bedtime', placeholder: 'e.g. 10:30pm' },
      { type: 'radio',  key: 'bedtimeConsistency',label: 'Bedtime consistency', options: ['Very consistent', 'Somewhat consistent', 'Varies a lot'] },
      { type: 'textarea', key: 'eveningPreSleep', label: 'What do you do in the 2–4 hours before bed?' },
      { type: 'textarea', key: 'idealSleep',      label: 'Describe your ideal sleep state' },
    ],
  },
  {
    id: 'worklife',
    title: 'Work & Life',
    description: 'Occupation, hobbies, and spiritual practice',
    fields: [
      { type: 'text',     key: 'currentWork',       label: 'Current work or primary occupation' },
      { type: 'textarea', key: 'workEnjoyment',     label: 'Do you enjoy it? What lights you up and what drains you?' },
      { type: 'textarea', key: 'currentHobbies',    label: 'Hobbies you currently practice, and how often' },
      { type: 'textarea', key: 'wishedHobbies',     label: 'Hobbies or activities you wish you had more time for' },
      { type: 'textarea', key: 'passions',          label: 'What are you most passionate about?' },
      { type: 'textarea', key: 'spiritualPractice', label: 'Describe your spiritual practice, if any' },
      { type: 'textarea', key: 'culturalPractices', label: 'Any cultural or ritual practices that are meaningful to you?' },
    ],
  },
  {
    id: 'diet',
    title: 'Diet',
    description: 'What and how you eat',
    fields: [
      { type: 'divider', label: 'Consumption frequency' },
      { type: 'radio', key: 'freq_carbs',      label: 'Grains and carbohydrates', options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_vegetables', label: 'Vegetables',               options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_meats',      label: 'Meat, fish, or poultry',   options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_fruits',     label: 'Fruits',                   options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_dairy',      label: 'Dairy',                    options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_alcohol',    label: 'Alcohol',                  options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_coffee',     label: 'Coffee',                   options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_tea',        label: 'Tea',                      options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_soda',       label: 'Soda or soft drinks',      options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_sugar',      label: 'Sugar or sweets',          options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_tobacco',    label: 'Tobacco',                  options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'radio', key: 'freq_substances', label: 'Recreational substances',  options: ['Never', 'Few/week', 'Once/week', 'Multi/week', 'Daily'], compact: true },
      { type: 'divider', label: 'Water and cooking' },
      { type: 'text',   key: 'waterIntake',  label: 'How much water do you drink daily?' },
      { type: 'radio',  key: 'waterTemp',    label: 'Water temperature preference', options: ['Cold / iced', 'Room temperature', 'Warm'] },
      { type: 'textarea', key: 'cookingHabits', label: 'Who cooks your food? How often do you cook at home?' },
      { type: 'textarea', key: 'disorderedEating', label: 'Any history of a complicated relationship with food? (optional — share only what feels right)' },
      { type: 'divider', label: 'Recent meals' },
      { type: 'textarea', key: 'recentBreakfast', label: 'Recent breakfast — is it typical? What would be ideal?' },
      { type: 'textarea', key: 'recentLunch',     label: 'Recent lunch — is it typical? What would be ideal?' },
      { type: 'textarea', key: 'recentDinner',    label: 'Recent dinner — is it typical? What would be ideal?' },
      { type: 'textarea', key: 'eatingEnvironment', label: 'Describe how you eat — environment, distractions, pace, presence.' },
      { type: 'textarea', key: 'currentHerbsMeds',  label: 'Current herbs, supplements, or medications' },
    ],
  },
  {
    id: 'appetite',
    title: 'Appetite & Elimination',
    description: 'Hunger and digestion signals',
    fields: [
      { type: 'multi',  key: 'tasteCravings',      label: 'Tastes you crave most', options: ['Sweet', 'Salty', 'Sour', 'Bitter', 'Pungent / spicy', 'Astringent'] },
      { type: 'text',   key: 'snackingFrequency',  label: 'How often do you snack?' },
      { type: 'text',   key: 'snackingWhat',       label: 'What do you typically snack on?' },
      { type: 'radio',  key: 'morningHunger',      label: 'Morning hunger', options: ['No appetite at all', 'Light hunger', 'Moderate hunger', 'Strong hunger', 'Ravenous'] },
      { type: 'radio',  key: 'preMealHunger',      label: 'Hunger before meals (typical)', options: ['Rarely hungry', 'Sometimes hungry', 'Usually hungry', 'Always hungry'] },
      { type: 'multi',  key: 'postMealSymptoms',   label: 'Post-meal symptoms (check all that apply)', options: ['Bloating', 'Belching', 'Acid reflux', 'Nausea', 'Sleepiness', 'Gas', 'Abdominal pain', 'Sluggishness', 'Fatigue', 'Heartburn', 'Heaviness', 'Indigestion'] },
      { type: 'radio',  key: 'eliminationFrequency', label: 'Bowel movement frequency', options: ['Multiple times/day', 'Once per day', 'Every other day', 'Every 2–3 days', 'Less frequently'] },
      { type: 'textarea', key: 'eliminationNotes', label: 'Describe your elimination — consistency, color, any issues (straining, burning, urgency, incomplete feeling)' },
    ],
  },
  {
    id: 'movement',
    title: 'Movement',
    description: 'Exercise, travel, and daily activity',
    fields: [
      { type: 'text',     key: 'travelFrequency',   label: 'How often do you travel? Describe the pattern.' },
      { type: 'text',     key: 'commuteDetails',    label: 'How do you commute, how far, and how often?' },
      { type: 'textarea', key: 'exerciseType',      label: 'What type(s) of exercise do you do?' },
      { type: 'text',     key: 'exerciseFrequency', label: 'How often?' },
      { type: 'text',     key: 'exerciseDuration',  label: 'Duration per session?' },
      { type: 'radio',    key: 'exerciseIntensity', label: 'Typical intensity', options: ['Light', 'Moderate', 'Vigorous'] },
    ],
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Intimate relationships and sensual health',
    gate: true,
    fields: [
      { type: 'radio',    key: 'relationshipStatus',  label: 'Current relationship status', options: ['Single', 'Dating', 'Partnered', 'Married', 'Separated / divorced', 'Widowed', 'Prefer not to say'] },
      { type: 'textarea', key: 'relationshipQuality', label: 'How would you describe the quality of your intimate relationships?' },
      { type: 'textarea', key: 'relationshipHistory', label: 'Past intimate relationships — any patterns you\'ve noticed?' },
      { type: 'textarea', key: 'sensualHealth',       label: 'Any past or present sensual health concerns or changes you\'d like Thea to know about?' },
    ],
  },
  {
    id: 'reproductive',
    title: 'Reproductive Health',
    description: 'Optional · Share only what feels right',
    gate: true,
    fields: [
      { type: 'radio',    key: 'menstrualStatus',    label: 'Menstrual status', options: ['Pre-menopausal', 'Peri-menopausal', 'Post-menopausal', 'Not applicable'] },
      { type: 'textarea', key: 'cycleDetails',       label: 'Describe your cycle — regularity, duration, flow, color, cramping, PMS symptoms' },
      { type: 'textarea', key: 'contraception',      label: 'Current contraception and any hormonal history' },
      { type: 'textarea', key: 'pregnancyHistory',   label: 'Pregnancy history — share only what feels right' },
    ],
  },
  {
    id: 'mental',
    title: 'Mind & Emotional Health',
    description: 'Mental wellbeing and stress',
    fields: [
      { type: 'info', text: 'Take a breath before this section. None of these questions have a right answer — and you can skip anything that doesn\'t feel right to share today.' },
      { type: 'textarea', key: 'familyMentalHistory', label: 'Family history of mental illness' },
      { type: 'multi',    key: 'emotionalSymptoms',   label: 'Which of the following do you experience regularly?', options: ['Anxious', 'Overwhelmed', 'Resentful', 'Angry', 'Depressed', 'Melancholy', 'Stubborn', 'Lonely', 'Irritated', 'Fear / panic', 'High stress', 'Lethargy', 'Worry', 'Intense emotions'] },
      { type: 'textarea', key: 'stressManagement',    label: 'How do you currently manage stress?' },
      { type: 'textarea', key: 'substanceHistory',    label: 'Any history of substance use or addiction you\'d like to share? (optional)' },
    ],
  },
];

// All keys with defaults
const EMPTY_INTAKE = {
  name: '', dob: '', phone: '', email: '', address: '', city: '', state: '', zip: '',
  genderIdentity: '', emergencyName: '', emergencyRelation: '', emergencyPhone: '', referralSource: '',
  consentAgreed: false,
  reasonHere: '', reasonDuration: '', healthChallenges: '', challengeDuration: '',
  currentProviders: '', providersNotes: '', pastMentalTrauma: '', familyHistory: '', childhoodHealth: '',
  morningRoutine: '', afternoonRoutine: '', eveningRoutine: '', idealVsActual: '',
  wakeTime: '', wakeConsistency: '', wakingFeeling: '', sleepIssues: [], napping: '', bedtime: '', bedtimeConsistency: '', eveningPreSleep: '', idealSleep: '',
  currentWork: '', workEnjoyment: '', currentHobbies: '', wishedHobbies: '', passions: '', spiritualPractice: '', culturalPractices: '',
  freq_carbs: '', freq_vegetables: '', freq_meats: '', freq_fruits: '', freq_dairy: '',
  freq_alcohol: '', freq_coffee: '', freq_tea: '', freq_soda: '', freq_sugar: '', freq_tobacco: '', freq_substances: '',
  waterIntake: '', waterTemp: '', cookingHabits: '', disorderedEating: '', recentBreakfast: '', recentLunch: '', recentDinner: '', eatingEnvironment: '', currentHerbsMeds: '',
  tasteCravings: [], snackingFrequency: '', snackingWhat: '', morningHunger: '', preMealHunger: '', postMealSymptoms: [], eliminationFrequency: '', eliminationNotes: '',
  travelFrequency: '', commuteDetails: '', exerciseType: '', exerciseFrequency: '', exerciseDuration: '', exerciseIntensity: '',
  ageGateAcknowledged: false,
  relationshipStatus: '', relationshipQuality: '', relationshipHistory: '', sensualHealth: '',
  menstrualStatus: '', cycleDetails: '', contraception: '', pregnancyHistory: '',
  familyMentalHistory: '', emotionalSymptoms: [], stressManagement: '', substanceHistory: '',
};

// ── Storage helpers ────────────────────────────────────────────────────────

async function loadIntake() {
  const raw = await AsyncStorage.getItem(INTAKE_KEY);
  if (!raw) return { ...EMPTY_INTAKE };
  try { return { ...EMPTY_INTAKE, ...JSON.parse(raw) }; } catch { return { ...EMPTY_INTAKE }; }
}

async function saveIntake(intake) {
  await AsyncStorage.setItem(INTAKE_KEY, JSON.stringify(intake));
}

// ── Field-level progress ───────────────────────────────────────────────────

function sectionProgress(section, intake) {
  const fields = section.fields.filter(f => f.key && f.type !== 'info' && f.type !== 'divider' && f.type !== 'check');
  if (!fields.length) return null;
  const filled = fields.filter(f => {
    const v = intake[f.key];
    return Array.isArray(v) ? v.length > 0 : (v !== '' && v !== null && v !== undefined);
  }).length;
  return { filled, total: fields.length };
}

// ── Field renderers ────────────────────────────────────────────────────────

function FieldLabel({ label, colors: c }) {
  return <Text style={[fs.fieldLabel, { color: c.textMuted }]}>{label}</Text>;
}

function TextField({ field, value, onChange, colors: c, multiline = false }) {
  return (
    <View style={fs.fieldWrap}>
      <FieldLabel label={field.label} colors={c} />
      <TextInput
        style={[fs.input, multiline && fs.textarea, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={value || ''}
        onChangeText={onChange}
        placeholder={field.placeholder || ''}
        placeholderTextColor={c.textMuted}
        multiline={multiline}
        autoCorrect
      />
    </View>
  );
}

function RadioField({ field, value, onChange, colors: c }) {
  return (
    <View style={fs.fieldWrap}>
      <FieldLabel label={field.label} colors={c} />
      <View style={field.compact ? fs.radioCol : fs.radioRow}>
        {field.options.map(opt => {
          const sel = value === opt;
          return (
            <Pressable
              key={opt}
              style={[fs.radioPill, field.compact && fs.radioPillCompact,
                { backgroundColor: sel ? c.accent : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
              onPress={() => onChange(sel ? '' : opt)}
            >
              <Text style={[fs.radioPillText, { color: sel ? '#FBF9F4' : c.textMedium }]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MultiSelect({ field, value = [], onChange, colors: c }) {
  function toggle(opt) {
    const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
    onChange(next);
  }
  return (
    <View style={fs.fieldWrap}>
      <FieldLabel label={field.label} colors={c} />
      <View style={fs.chipRow}>
        {field.options.map(opt => {
          const sel = value.includes(opt);
          return (
            <Pressable
              key={opt}
              style={[fs.chip, { backgroundColor: sel ? c.accent + '22' : c.surfaceAlt, borderColor: sel ? c.accent : c.border }]}
              onPress={() => toggle(opt)}
            >
              <Text style={[fs.chipText, { color: sel ? c.accent : c.textMedium }]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function CheckField({ field, value, onChange, colors: c }) {
  return (
    <Pressable style={[fs.checkRow, { backgroundColor: c.surfaceAlt, borderColor: c.border }]} onPress={() => onChange(!value)}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={[fs.checkLabel, { color: c.text }]}>{field.label}</Text>
      </View>
      <Switch
        value={!!value}
        onValueChange={onChange}
        trackColor={{ false: c.border, true: c.accent }}
        thumbColor="#FBF9F4"
      />
    </Pressable>
  );
}

function InfoBlock({ field, colors: c }) {
  return (
    <View style={[fs.infoBlock, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
      <Text style={[fs.infoText, { color: c.textMedium }]}>{field.text}</Text>
    </View>
  );
}

function Divider({ label, colors: c }) {
  return (
    <View style={[fs.dividerWrap, { borderTopColor: c.border }]}>
      <Text style={[fs.dividerLabel, { color: c.textMuted }]}>{label}</Text>
    </View>
  );
}

function renderField(field, intake, update, colors) {
  const v = intake[field.key];
  const onChange = val => update(field.key, val);

  switch (field.type) {
    case 'text':     return <TextField    key={field.key} field={field} value={v} onChange={onChange} colors={colors} />;
    case 'textarea': return <TextField    key={field.key} field={field} value={v} onChange={onChange} colors={colors} multiline />;
    case 'radio':    return <RadioField   key={field.key} field={field} value={v} onChange={onChange} colors={colors} />;
    case 'multi':    return <MultiSelect  key={field.key} field={field} value={v} onChange={onChange} colors={colors} />;
    case 'check':    return <CheckField   key={field.key} field={field} value={v} onChange={onChange} colors={colors} />;
    case 'info':     return <InfoBlock    key={field.text?.slice(0, 20)} field={field} colors={colors} />;
    case 'divider':  return <Divider      key={field.label} label={field.label} colors={colors} />;
    default:         return null;
  }
}

// ── 18+ gate screen ────────────────────────────────────────────────────────

function AgeGate({ onAcknowledge, onSkip, colors: c }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 28 }}>
      <Text style={[fs.gateTitle, { color: c.text }]}>A note before this section</Text>
      <Text style={[fs.gateBody, { color: c.textMedium }]}>
        The next sections include questions about relationships and reproductive health. These are optional — tap Pass on any question that doesn't feel right.{'\n\n'}Continue only if you are 18 or older.
      </Text>
      <Pressable style={[fs.gateBtn, { backgroundColor: c.accent }]} onPress={onAcknowledge}>
        <Text style={fs.gateBtnText}>I'm 18+ — Continue</Text>
      </Pressable>
      <Pressable style={[fs.gateSkipBtn, { borderColor: c.border }]} onPress={onSkip}>
        <Text style={[fs.gateSkipText, { color: c.textMuted }]}>I'm under 18 — Skip these sections</Text>
      </Pressable>
    </View>
  );
}

// ── Section form view ──────────────────────────────────────────────────────

function SectionForm({ section, intake, update, onBack, colors: c }) {
  const progress = sectionProgress(section, intake);
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <View style={[fs.sectionHeader, { borderBottomColor: c.border }]}>
        <Pressable style={fs.backBtn} onPress={onBack} hitSlop={8}>
          <BackIcon color={c.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[fs.sectionTitle, { color: c.text }]}>{section.title}</Text>
          {progress && (
            <Text style={[fs.sectionProgress, { color: c.textMuted }]}>
              {progress.filled} of {progress.total} answered
            </Text>
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {section.fields.map(f => renderField(f, intake, update, c))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Section list view ──────────────────────────────────────────────────────

function SectionList({ intake, onSelect, colors: c }) {
  const totalFilled   = SECTIONS.reduce((sum, s) => sum + (sectionProgress(s, intake)?.filled || 0), 0);
  const totalFields   = SECTIONS.reduce((sum, s) => sum + (sectionProgress(s, intake)?.total || 0), 0);
  const overallPct    = totalFields ? Math.round((totalFilled / totalFields) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <Text style={[fs.listOverline, { color: c.textMuted }]}>Clinical Intake</Text>
      <Text style={[fs.listTitle, { color: c.text }]}>Your information</Text>
      <Text style={[fs.listSub, { color: c.textMedium }]}>
        Fill out at your own pace. Your answers are saved automatically and shared only with Thea.
      </Text>

      <View style={[fs.progressCard, { backgroundColor: c.surface, ...card }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={[fs.progressLabel, { color: c.textMuted }]}>Overall progress</Text>
          <Text style={[fs.progressPct, { color: c.accent }]}>{overallPct}%</Text>
        </View>
        <View style={[fs.trackBg, { backgroundColor: c.border }]}>
          <View style={[fs.trackFill, { backgroundColor: c.accent, width: `${overallPct}%` }]} />
        </View>
      </View>

      <View style={{ marginTop: 24, gap: 10 }}>
        {SECTIONS.map((section, idx) => {
          const progress = sectionProgress(section, intake);
          const done = progress ? progress.filled === progress.total && progress.total > 0 : false;
          const isGated = section.gate && !intake.ageGateAcknowledged;

          return (
            <Pressable
              key={section.id}
              style={({ pressed }) => [fs.sectionCard, { backgroundColor: c.surface, ...card, opacity: pressed ? 0.8 : 1 }]}
              onPress={() => onSelect(section.id)}
            >
              <View style={[fs.sectionNum, { backgroundColor: done ? c.accent : c.surfaceAlt }]}>
                {done
                  ? <CheckIcon color="#FBF9F4" />
                  : <Text style={[fs.sectionNumText, { color: c.textMuted }]}>{idx + 1}</Text>
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[fs.sectionCardTitle, { color: c.text }]}>{section.title}</Text>
                <Text style={[fs.sectionCardDesc, { color: c.textMuted }]}>{section.description}</Text>
              </View>
              {isGated
                ? <LockIcon color={c.textMuted} />
                : progress
                  ? <Text style={[fs.progressMini, { color: done ? c.accent : c.textMuted }]}>
                      {progress.filled}/{progress.total}
                    </Text>
                  : null
              }
              <ChevronIcon color={c.textMuted} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Intake() {
  const { theme: { colors: c } } = useTheme();
  const [intake, setIntake]         = useState(null);
  const [activeId, setActiveId]     = useState(null);
  const [showGate, setShowGate]     = useState(false);
  const [pendingId, setPendingId]   = useState(null);

  useEffect(() => { loadIntake().then(setIntake); }, []);

  const update = useCallback((key, val) => {
    setIntake(prev => {
      const next = { ...prev, [key]: val };
      saveIntake(next);
      return next;
    });
  }, []);

  if (!intake) return null;

  const activeSection = SECTIONS.find(s => s.id === activeId);

  function handleSelect(id) {
    const section = SECTIONS.find(s => s.id === id);
    if (section?.gate && !intake.ageGateAcknowledged) {
      setPendingId(id);
      setShowGate(true);
    } else {
      setActiveId(id);
    }
  }

  function handleGateAcknowledge() {
    update('ageGateAcknowledged', true);
    setShowGate(false);
    setActiveId(pendingId);
    setPendingId(null);
  }

  function handleGateSkip() {
    setShowGate(false);
    setPendingId(null);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={[fs.header, { borderBottomColor: c.border }]}>
        {activeId ? (
          <View style={{ width: 40 }} />
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={[fs.headerTitle, { color: c.text }]}>Intake</Text>
        <View style={{ width: 40 }} />
      </View>

      {showGate ? (
        <AgeGate onAcknowledge={handleGateAcknowledge} onSkip={handleGateSkip} colors={c} />
      ) : activeSection ? (
        <SectionForm
          section={activeSection}
          intake={intake}
          update={update}
          onBack={() => setActiveId(null)}
          colors={c}
        />
      ) : (
        <SectionList intake={intake} onSelect={handleSelect} colors={c} />
      )}
    </SafeAreaView>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function BackIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function ChevronIcon({ color }) {
  return <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function LockIcon({ color }) {
  return <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke={color} strokeWidth={1.5} />
  </Svg>;
}
function CheckIcon({ color }) {
  return <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

// ── Styles ─────────────────────────────────────────────────────────────────

const fs = StyleSheet.create({
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20 },

  listOverline: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98, textTransform: 'uppercase', marginBottom: 6 },
  listTitle:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 30, lineHeight: 36, marginBottom: 8 },
  listSub:      { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginBottom: 20 },

  progressCard:  { borderRadius: 26, padding: 18, marginBottom: 4 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 12.5 },
  progressPct:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18 },
  trackBg:       { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 4 },
  trackFill:     { height: 4, borderRadius: 2 },

  sectionCard:      { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 16, gap: 12 },
  sectionNum:       { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionNumText:   { fontFamily: 'Inter_700Bold', fontSize: 13 },
  sectionCardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 20 },
  sectionCardDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18, marginTop: 1 },
  progressMini:     { fontFamily: 'Inter_400Regular', fontSize: 12 },

  sectionHeader:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  backBtn:         { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sectionTitle:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18 },
  sectionProgress: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },

  fieldWrap:  { marginBottom: 20 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input:      { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, fontFamily: 'Inter_400Regular' },
  textarea:   { minHeight: 80, paddingTop: 12, textAlignVertical: 'top' },

  radioRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  radioCol:         { flexDirection: 'column', gap: 6 },
  radioPill:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  radioPillCompact: { paddingHorizontal: 12, paddingVertical: 6 },
  radioPillText:    { fontFamily: 'Inter_400Regular', fontSize: 13.5 },

  chipRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:     { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 13 },

  checkRow:   { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14 },
  checkLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, lineHeight: 22 },

  infoBlock: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 20 },
  infoText:  { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 },

  dividerWrap:  { borderTopWidth: StyleSheet.hairlineWidth, marginBottom: 16, paddingTop: 16, marginTop: 4 },
  dividerLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },

  gateTitle:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 32, marginBottom: 16 },
  gateBody:     { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24, marginBottom: 32 },
  gateBtn:      { borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  gateBtnText:  { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 14, letterSpacing: 0.5 },
  gateSkipBtn:  { borderRadius: 999, paddingVertical: 13, alignItems: 'center', borderWidth: 1 },
  gateSkipText: { fontFamily: 'Inter_400Regular', fontSize: 14 },
});
