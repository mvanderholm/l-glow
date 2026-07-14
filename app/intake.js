import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import { BOOKING_URL } from '../data/booking';
import { supabase } from '../config/supabase';
import { syncToSupabase } from '../data/user/storage';
import BackButton from '../components/BackButton';
import Svg, { Path, Circle } from 'react-native-svg';

const INTAKE_KEY = '@lglow/intake';

// ── Section definitions ────────────────────────────────────────────────────

// Exported so app/practitioner.js can render a read-only view of a client's
// answers using the same section/field labels, without duplicating this list.
export const SECTIONS = [
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
      // DRAFT — Thea to review and rewrite before launch. This flag must stay a
      // code comment, never inside `text` below — it was previously part of the
      // displayed string and shown to users verbatim. Fixed July 2026.
      { type: 'info', text: 'Welcome. I am an ayurvedic practitioner and Registered Yoga Teacher. My work with you is rooted in the classical tradition of Ayurveda — a system of health that looks at you as a whole person, in your whole life, in this moment.\n\nI am not a medical doctor, naturopath, or licensed therapist. This practice is not a substitute for clinical care. I do not diagnose conditions, prescribe medications, or treat disease. If you have a serious health concern, please see a licensed provider.\n\nEverything you share with me is held in confidence. My notes and this intake form inform our work together and will not be shared without your explicit consent.\n\nBy agreeing below, you confirm that you understand the scope of this practice and consent to working with me under these terms.' },
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
  {
    id: 'prakriti',
    title: 'Your Constitution',
    description: 'Physical, functional, and psychological traits',
    fields: [
      { type: 'coaching_cta' },
      { type: 'info', text: 'This section helps identify your original constitution — your prakriti. Answer based on how you naturally are, without outside influences. There are no right or wrong answers.\n\nSkip anything you\'re unsure about — you can always come back.' },

      { type: 'divider', label: 'Physical structure' },
      { type: 'prakriti_single', key: 'prak_body_frame', label: 'Body frame', options: [
        { dosha: 'Vata', text: 'Thin — naturally, without outside influences' },
        { dosha: 'Pitta', text: 'Medium and muscular' },
        { dosha: 'Kapha', text: 'Stocky or stout' },
      ]},
      { type: 'prakriti_single', key: 'prak_bone_structure', label: 'Bone structure', options: [
        { dosha: 'Vata', text: 'Light, narrow — joints may be prominent' },
        { dosha: 'Pitta', text: 'Moderate, medium build' },
        { dosha: 'Kapha', text: 'Thick and heavy' },
      ]},
      { type: 'prakriti_single', key: 'prak_body_weight', label: 'Body weight', options: [
        { dosha: 'Vata', text: 'Light and variable' },
        { dosha: 'Pitta', text: 'Moderate and muscular' },
        { dosha: 'Kapha', text: 'Can tend toward heavier' },
      ]},
      { type: 'info', text: 'Wrist check: wrap your middle finger and thumb around your other wrist.' },
      { type: 'prakriti_single', key: 'prak_wrist', label: 'Wrist circumference', options: [
        { dosha: 'Vata', text: 'Middle finger and thumb overlap' },
        { dosha: 'Pitta', text: 'Middle finger and thumb just touch' },
        { dosha: 'Kapha', text: 'There\'s a gap between them' },
      ]},
      { type: 'prakriti_single', key: 'prak_complexion', label: 'Complexion / skin', options: [
        { dosha: 'Vata', text: 'Dry, rough, cool — can be grayish or thin' },
        { dosha: 'Pitta', text: 'Rosy, oily, moderate thickness — can be ruddy' },
        { dosha: 'Kapha', text: 'Pale, moist, cool, thick' },
      ]},
      { type: 'prakriti_single', key: 'prak_hair', label: 'Hair', options: [
        { dosha: 'Vata', text: 'Dry, coarse, curly, brittle' },
        { dosha: 'Pitta', text: 'Fine, light-colored, oily — grays early' },
        { dosha: 'Kapha', text: 'Thick, oily, luxurious, wavy' },
      ]},
      { type: 'prakriti_single', key: 'prak_teeth', label: 'Teeth (before orthodontics)', options: [
        { dosha: 'Vata', text: 'Irregular or crooked' },
        { dosha: 'Pitta', text: 'Moderate — can be yellowish' },
        { dosha: 'Kapha', text: 'Large, strong, white, healthy' },
      ]},
      { type: 'prakriti_single', key: 'prak_eyes', label: 'Eyes', options: [
        { dosha: 'Vata', text: 'Small' },
        { dosha: 'Pitta', text: 'Medium, deep-set, sharp — often blue or green' },
        { dosha: 'Kapha', text: 'Large with long lashes' },
      ]},
      { type: 'prakriti_single', key: 'prak_nose', label: 'Nose', options: [
        { dosha: 'Vata', text: 'Small and narrow' },
        { dosha: 'Pitta', text: 'Medium' },
        { dosha: 'Kapha', text: 'Large with a wide bridge' },
      ]},
      { type: 'prakriti_single', key: 'prak_lips', label: 'Lips', options: [
        { dosha: 'Vata', text: 'Thin, small, often chapped' },
        { dosha: 'Pitta', text: 'Medium' },
        { dosha: 'Kapha', text: 'Large and thick' },
      ]},
      { type: 'prakriti_single', key: 'prak_chin', label: 'Chin', options: [
        { dosha: 'Vata', text: 'Thin and angular' },
        { dosha: 'Pitta', text: 'Tapered and angular' },
        { dosha: 'Kapha', text: 'Doubled and round' },
      ]},
      { type: 'prakriti_single', key: 'prak_neck', label: 'Neck', options: [
        { dosha: 'Vata', text: 'Long and thin' },
        { dosha: 'Pitta', text: 'Medium' },
        { dosha: 'Kapha', text: 'Short and thick' },
      ]},
      { type: 'prakriti_single', key: 'prak_fingers', label: 'Fingers and palms', options: [
        { dosha: 'Vata', text: 'Thin, long, narrow' },
        { dosha: 'Pitta', text: 'Medium or square' },
        { dosha: 'Kapha', text: 'Thick, fleshy, short' },
      ]},
      { type: 'prakriti_single', key: 'prak_face', label: 'Face shape', options: [
        { dosha: 'Vata', text: 'Oval or angular — thinner' },
        { dosha: 'Pitta', text: 'Angular' },
        { dosha: 'Kapha', text: 'Round' },
      ]},

      { type: 'divider', label: 'Physical function' },
      { type: 'prakriti_multi', key: 'prak_appetite', label: 'Appetite', options: [
        { dosha: 'Vata', text: 'Varied, scanty, or swings to extremes' },
        { dosha: 'Pitta', text: 'Good and strong' },
        { dosha: 'Kapha', text: 'Steady but consistently low' },
      ]},
      { type: 'prakriti_multi', key: 'prak_sweat', label: 'Sweat and body odor', options: [
        { dosha: 'Vata', text: 'Little, slightly smelly' },
        { dosha: 'Pitta', text: 'Profuse and strong' },
        { dosha: 'Kapha', text: 'Pleasant or sweet-smelling' },
      ]},
      { type: 'prakriti_multi', key: 'prak_sleep', label: 'Sleep', options: [
        { dosha: 'Vata', text: 'Light, interrupted, restless' },
        { dosha: 'Pitta', text: 'Light to moderate — can wake and fall back asleep easily' },
        { dosha: 'Kapha', text: 'Deep — difficult to wake up' },
      ]},
      { type: 'prakriti_multi', key: 'prak_digestion', label: 'Digestion and elimination', options: [
        { dosha: 'Vata', text: 'Dry, hard, variable — tends toward gas and constipation' },
        { dosha: 'Pitta', text: 'Soft, sometimes loose or burning — 1–3 times per day' },
        { dosha: 'Kapha', text: 'Regular, solid, sometimes sluggish' },
      ]},
      { type: 'prakriti_multi', key: 'prak_body_temp', label: 'Body temperature', options: [
        { dosha: 'Vata', text: 'I run cold' },
        { dosha: 'Pitta', text: 'I run warm or hot' },
        { dosha: 'Kapha', text: 'I run cool' },
      ]},
      { type: 'prakriti_multi', key: 'prak_menstruation', label: 'Menstruation (if applicable)', options: [
        { dosha: 'Vata', text: 'Painful, crampy, irregular cycles' },
        { dosha: 'Pitta', text: 'Heavy flow, fairly regular' },
        { dosha: 'Kapha', text: 'Mild cramping, moderate flow' },
      ]},

      { type: 'divider', label: 'Psychological function' },
      { type: 'prakriti_multi', key: 'prak_mind', label: 'Mind', options: [
        { dosha: 'Vata', text: 'Restless, always active, scattered or timid' },
        { dosha: 'Pitta', text: 'Adventurous and bold' },
        { dosha: 'Kapha', text: 'Conservative and shy' },
      ]},
      { type: 'prakriti_multi', key: 'prak_stress', label: 'Under stress', options: [
        { dosha: 'Vata', text: 'Anxious and variable' },
        { dosha: 'Pitta', text: 'Focused and intense' },
        { dosha: 'Kapha', text: 'Calm, stable, retreating' },
      ]},
      { type: 'prakriti_multi', key: 'prak_speech', label: 'Speech', options: [
        { dosha: 'Vata', text: 'Rambling and very quick' },
        { dosha: 'Pitta', text: 'Clear but can be argumentative' },
        { dosha: 'Kapha', text: 'Steady, gentle, slow to change' },
      ]},
      { type: 'prakriti_multi', key: 'prak_memory', label: 'Memory', options: [
        { dosha: 'Vata', text: 'Quick to understand, quick to forget' },
        { dosha: 'Pitta', text: 'Sharp' },
        { dosha: 'Kapha', text: 'Slow to take in, but won\'t forget' },
      ]},
      { type: 'prakriti_multi', key: 'prak_nature', label: 'Nature', options: [
        { dosha: 'Vata', text: 'Independent' },
        { dosha: 'Pitta', text: 'A natural leader' },
        { dosha: 'Kapha', text: 'A natural supporter' },
      ]},
      { type: 'prakriti_multi', key: 'prak_moods', label: 'Moods', options: [
        { dosha: 'Vata', text: 'Adaptable and playful' },
        { dosha: 'Pitta', text: 'Courageous and passionate' },
        { dosha: 'Kapha', text: 'Loving, stable, calm' },
      ]},
      { type: 'prakriti_multi', key: 'prak_negative_emotions', label: 'Negative emotions', options: [
        { dosha: 'Vata', text: 'Fear' },
        { dosha: 'Pitta', text: 'Anger' },
        { dosha: 'Kapha', text: 'Attachment' },
      ]},
      { type: 'prakriti_multi', key: 'prak_focus', label: 'Focus', options: [
        { dosha: 'Vata', text: 'Trouble staying focused' },
        { dosha: 'Pitta', text: 'Detail-oriented' },
        { dosha: 'Kapha', text: 'Big-picture' },
      ]},
      { type: 'prakriti_multi', key: 'prak_decisions', label: 'Decision-making', options: [
        { dosha: 'Vata', text: 'Trouble making choices' },
        { dosha: 'Pitta', text: 'Quick to decide' },
        { dosha: 'Kapha', text: 'Slow to decide' },
      ]},
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
  // Section 14 — Prakriti constitution
  prak_body_frame: '', prak_bone_structure: '', prak_body_weight: '', prak_wrist: '',
  prak_complexion: '', prak_hair: '', prak_teeth: '', prak_eyes: '', prak_nose: '',
  prak_lips: '', prak_chin: '', prak_neck: '', prak_fingers: '', prak_face: '',
  prak_appetite: [], prak_sweat: [], prak_sleep: [], prak_digestion: [],
  prak_body_temp: [], prak_menstruation: [],
  prak_mind: [], prak_stress: [], prak_speech: [], prak_memory: [], prak_nature: [],
  prak_moods: [], prak_negative_emotions: [], prak_focus: [], prak_decisions: [],
};

// ── Storage helpers ────────────────────────────────────────────────────────

async function loadIntake() {
  const raw = await AsyncStorage.getItem(INTAKE_KEY);
  if (!raw) return { ...EMPTY_INTAKE };
  try { return { ...EMPTY_INTAKE, ...JSON.parse(raw) }; } catch { return { ...EMPTY_INTAKE }; }
}

async function saveIntake(intake) {
  await AsyncStorage.setItem(INTAKE_KEY, JSON.stringify(intake));
  await syncToSupabase(userId => supabase.from('intake_forms').upsert({
    user_id: userId,
    data: intake,
  }, { onConflict: 'user_id' }));
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

const DOSHA_COLORS = c => ({ Vata: c.vata, Pitta: c.accent, Kapha: c.kapha });

function PrakritiSingleField({ field, value, onChange, colors: c }) {
  const dc = DOSHA_COLORS(c);
  return (
    <View style={fs.fieldWrap}>
      <FieldLabel label={field.label} colors={c} />
      <View style={{ gap: 6 }}>
        {field.options.map(opt => {
          const sel = value === opt.dosha;
          const col = dc[opt.dosha] || c.accent;
          return (
            <Pressable
              key={opt.dosha}
              style={[fs.prakRow, { backgroundColor: sel ? col + '1A' : c.surfaceAlt, borderColor: sel ? col : c.border }]}
              onPress={() => onChange(sel ? '' : opt.dosha)}
            >
              <View style={[fs.prakDot, { backgroundColor: sel ? col : c.border }]} />
              <View style={{ flex: 1 }}>
                <Text style={[fs.prakDosha, { color: sel ? col : c.textMuted }]}>{opt.dosha}</Text>
                <Text style={[fs.prakDesc, { color: c.text }]}>{opt.text}</Text>
              </View>
              {sel && <CheckIcon color={col} />}
            </Pressable>
          );
        })}
        <Pressable
          style={[fs.prakSkip, { borderColor: value === 'skip' ? c.accent : c.border }]}
          onPress={() => onChange(value === 'skip' ? '' : 'skip')}
        >
          <Text style={[fs.prakSkipText, { color: value === 'skip' ? c.accent : c.textMuted }]}>
            {value === 'skip' ? '✓ Skipped' : 'Skip / I don\'t know'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function PrakritiMultiField({ field, value = [], onChange, colors: c }) {
  const dc = DOSHA_COLORS(c);
  const skipped = value.includes('skip');
  function toggle(dosha) {
    const withoutSkip = value.filter(v => v !== 'skip'); // picking a real option clears skip
    onChange(withoutSkip.includes(dosha) ? withoutSkip.filter(v => v !== dosha) : [...withoutSkip, dosha]);
  }
  function toggleSkip() {
    onChange(skipped ? [] : ['skip']);
  }
  return (
    <View style={fs.fieldWrap}>
      <FieldLabel label={field.label} colors={c} />
      <View style={{ gap: 6 }}>
        {field.options.map(opt => {
          const sel = !skipped && value.includes(opt.dosha);
          const col = dc[opt.dosha] || c.accent;
          return (
            <Pressable
              key={opt.dosha}
              style={[fs.prakRow, { backgroundColor: sel ? col + '1A' : c.surfaceAlt, borderColor: sel ? col : c.border, opacity: skipped ? 0.5 : 1 }]}
              onPress={() => toggle(opt.dosha)}
            >
              <View style={[fs.prakCheck, { backgroundColor: sel ? col : 'transparent', borderColor: sel ? col : c.border }]}>
                {sel && <CheckIcon color="#FBF9F4" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[fs.prakDosha, { color: sel ? col : c.textMuted }]}>{opt.dosha}</Text>
                <Text style={[fs.prakDesc, { color: c.text }]}>{opt.text}</Text>
              </View>
            </Pressable>
          );
        })}
        <Pressable
          style={[fs.prakSkip, { borderColor: skipped ? c.accent : c.border }]}
          onPress={toggleSkip}
        >
          <Text style={[fs.prakSkipText, { color: skipped ? c.accent : c.textMuted }]}>
            {skipped ? '✓ Skipped' : 'Skip / I don\'t know'}
          </Text>
        </Pressable>
      </View>
      <Text style={[fs.prakHint, { color: c.textMuted }]}>Select all that apply</Text>
    </View>
  );
}

function CoachingCtaBlock({ colors: c }) {
  return (
    <Pressable
      style={({ pressed }) => [fs.ctaCard, { backgroundColor: c.surfaceAlt, borderColor: c.accent, opacity: pressed ? 0.8 : 1 }]}
      onPress={() => Linking.openURL(BOOKING_URL)}
    >
      <View style={[fs.ctaBadge, { backgroundColor: c.accent + '1A' }]}>
        <Text style={[fs.ctaBadgeText, { color: c.accent }]}>Book a session</Text>
      </View>
      <Text style={[fs.ctaTitle, { color: c.text }]}>Go through this with Thea</Text>
      <Text style={[fs.ctaBody, { color: c.textMedium }]}>
        Identifying your original constitution is easier with a trained eye. Tap to book a session and walk through this together.
      </Text>
    </Pressable>
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
    case 'info':            return <InfoBlock          key={field.text?.slice(0, 20)} field={field} colors={colors} />;
    case 'divider':         return <Divider            key={field.label} label={field.label} colors={colors} />;
    case 'prakriti_single': return <PrakritiSingleField key={field.key} field={field} value={v} onChange={onChange} colors={colors} />;
    case 'prakriti_multi':  return <PrakritiMultiField  key={field.key} field={field} value={v} onChange={onChange} colors={colors} />;
    case 'coaching_cta':    return <CoachingCtaBlock    key="coaching_cta" colors={colors} />;
    default:                return null;
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
        <BackButton onPress={onBack} color={c.text} />
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

        <Pressable style={[fs.gateBtn, { backgroundColor: c.accent, marginTop: 8 }]} onPress={onBack}>
          <Text style={fs.gateBtnText}>Back to sections</Text>
        </Pressable>
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
        <BackButton onPress={() => router.back()} color={c.text} />
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

  // Prakriti fields
  prakRow:       { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 12, borderWidth: 1, padding: 12, gap: 12 },
  prakDot:       { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  prakCheck:     { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  prakDosha:     { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  prakDesc:      { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 19 },
  prakSkip:      { borderRadius: 999, borderWidth: 1, paddingVertical: 7, paddingHorizontal: 14, alignSelf: 'flex-start', marginTop: 4 },
  prakSkipText:  { fontFamily: 'Inter_400Regular', fontSize: 12.5 },
  prakHint:      { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 6 },

  // Disabled coaching CTA
  ctaCard:      { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  ctaBadge:     { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 10 },
  ctaBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.5 },
  ctaTitle:     { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17, lineHeight: 22, marginBottom: 6 },
  ctaBody:      { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
});
