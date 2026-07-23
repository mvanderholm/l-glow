// Global search index (#44) — every source reduces to one flat entry shape
// so the matcher never needs to know what a "herb" or "journal entry" is.
// Content sources are static/Supabase-cached data/content/*.js files;
// "your data" sources are the signed-in user's own check-ins/journal.
// Matching is deliberately plain substring, same philosophy as app/herbs.js's
// existing search and this feature's own roadmap note: "never a real search
// index, it's client-side filtering."

import { concepts } from './content/learn';
import { herbs } from './content/herbs';
import { recommendations } from './content/recommendations';
import { doshaInfo } from './content/quiz';
import { SEASONAL_CONTENT, LUNAR_CONTENT } from './content/cycles';
import { tongueSteps, tongueSignList, tongueReadings, amaReadings, tongueMap } from './content/tongueCheck';
import { gunaResults } from './content/gunaQuiz';
import { agniResults } from './content/agniQuiz';
import { loadMythbusters } from './content/remote';
import { loadRecentCheckins } from './user/storage';
import { loadAllJournalEntries } from '../app/journal';

function joinText(...parts) {
  return parts.flat().filter(Boolean).join(' ').toLowerCase();
}

// ── Content builders ────────────────────────────────────────────────────

function buildLearnEntries() {
  return concepts.map(c => ({
    id: `learn:${c.id}`, source: 'learn', sourceLabel: 'Learn', group: 'content',
    title: c.title, subtitle: c.sanskrit,
    searchableText: joinText(c.title, c.sanskrit, c.teaser, c.body),
    snippet: c.teaser,
    route: '/learn', params: { conceptId: c.id },
  }));
}

function buildHerbEntries() {
  return Object.entries(herbs).map(([name, h]) => ({
    id: `herb:${name}`, source: 'herbs', sourceLabel: 'Herbs', group: 'content',
    title: name, subtitle: h.latin,
    searchableText: joinText(name, h.latin, h.summary, h.use, h.taste, h.balances, h.aggravates),
    snippet: h.summary,
    route: '/herbs', params: { herb: name },
  }));
}

function buildRecommendationEntries() {
  return Object.entries(recommendations).map(([dosha, rec]) => ({
    id: `recommendations:${dosha}`, source: 'recommendations', sourceLabel: 'Recommendations', group: 'content',
    title: `${dosha[0].toUpperCase()}${dosha.slice(1)} recommendations`, subtitle: null,
    searchableText: joinText(dosha, rec.foods?.favor, rec.foods?.avoid, rec.herbs, rec.meditation, rec.lifestyle),
    snippet: rec.lifestyle || (rec.foods?.favor || [])[0] || '',
    route: '/recommendations', params: { dosha },
  }));
}

function buildDoshaInfoEntries() {
  return Object.entries(doshaInfo).map(([dosha, info]) => ({
    id: `doshaInfo:${dosha}`, source: 'doshaInfo', sourceLabel: 'Your Constitution', group: 'content',
    title: info.name, subtitle: info.elements,
    searchableText: joinText(info.name, info.elements, info.qualities, info.summary, info.constitution, info.movementFocus),
    snippet: info.summary,
    route: '/recommendations', params: { dosha },
  }));
}

function buildCyclesEntries() {
  return [...SEASONAL_CONTENT, ...LUNAR_CONTENT].map(c => ({
    id: `cycles:${c.id}`, source: 'cycles', sourceLabel: 'Journey', group: 'content',
    title: c.title, subtitle: c.label,
    searchableText: joinText(c.label, c.title, c.body),
    snippet: c.body,
    route: '/journey', params: { tab: 'cycles' },
  }));
}

function buildTongueCheckEntries() {
  const stepEntries = tongueSteps.map(s => ({
    id: `tongue-step:${s.id}`, source: 'tongueCheck', sourceLabel: 'Tongue Check', group: 'content',
    title: s.prompt, subtitle: null,
    searchableText: joinText(s.prompt, s.instruction, (s.options || []).map(o => o.label)),
    snippet: s.instruction || '',
    route: null, params: null,
  }));
  const signEntries = tongueSignList.map(s => ({
    id: `tongue-sign:${s.id}`, source: 'tongueCheck', sourceLabel: 'Tongue Check', group: 'content',
    title: s.label, subtitle: null,
    searchableText: joinText(s.label, s.meaning),
    snippet: s.meaning,
    route: null, params: null,
  }));
  const readingEntries = Object.entries(tongueReadings).map(([key, r]) => ({
    id: `tongue-reading:${key}`, source: 'tongueCheck', sourceLabel: 'Tongue Check', group: 'content',
    title: r.name, subtitle: null,
    searchableText: joinText(r.name, r.summary, r.clues),
    snippet: r.summary,
    route: null, params: null,
  }));
  const amaEntries = amaReadings.map(a => ({
    id: `tongue-ama:${a.level}`, source: 'tongueCheck', sourceLabel: 'Tongue Check', group: 'content',
    title: a.label, subtitle: null,
    searchableText: joinText(a.label, a.desc),
    snippet: a.desc,
    route: null, params: null,
  }));
  const mapEntries = tongueMap.map(m => ({
    id: `tongue-map:${m.zone}`, source: 'tongueCheck', sourceLabel: 'Tongue Check', group: 'content',
    title: m.zone, subtitle: null,
    searchableText: joinText(m.zone, m.meaning),
    snippet: m.meaning,
    route: null, params: null,
  }));
  return [...stepEntries, ...signEntries, ...readingEntries, ...amaEntries, ...mapEntries];
}

function buildGunaResultEntries() {
  return Object.entries(gunaResults).map(([key, r]) => ({
    id: `gunaResult:${key}`, source: 'gunaResults', sourceLabel: 'Gunas', group: 'content',
    title: r.name, subtitle: null,
    searchableText: joinText(r.name, r.summary, r.gifts, r.watchFor, r.pathForward, r.reflection,
      r.practices?.diet, r.practices?.lifestyle, r.practices?.spiritual),
    snippet: r.summary,
    route: null, params: null,
  }));
}

function buildAgniResultEntries() {
  return Object.entries(agniResults).map(([key, r]) => ({
    id: `agniResult:${key}`, source: 'agniResults', sourceLabel: 'Agni', group: 'content',
    title: r.name, subtitle: r.subtitle,
    searchableText: joinText(r.name, r.subtitle, r.summary, r.gifts, r.watchFor, r.pathForward, r.reflection,
      r.practices?.diet, r.practices?.lifestyle, r.practices?.spiritual),
    snippet: r.summary,
    route: null, params: null,
  }));
}

function buildMythbusterEntries(mythbusters) {
  return (mythbusters || []).map(m => ({
    id: `mythbuster:${m.id}`, source: 'mythbusters', sourceLabel: 'Mythbusters', group: 'content',
    title: m.myth, subtitle: null,
    searchableText: joinText(m.myth, m.take, m.reframe),
    snippet: m.take,
    route: null, params: null,
  }));
}

export async function buildContentIndex() {
  const mythbusters = await loadMythbusters();
  return [
    ...buildLearnEntries(),
    ...buildHerbEntries(),
    ...buildRecommendationEntries(),
    ...buildDoshaInfoEntries(),
    ...buildCyclesEntries(),
    ...buildTongueCheckEntries(),
    ...buildGunaResultEntries(),
    ...buildAgniResultEntries(),
    ...buildMythbusterEntries(mythbusters),
  ];
}

// ── Your data builders ──────────────────────────────────────────────────

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function buildUserIndex() {
  const [checkins, journalEntries] = await Promise.all([
    loadRecentCheckins(365),
    loadAllJournalEntries(),
  ]);

  const checkinEntries = checkins.filter(c => c.note?.trim()).map(c => ({
    id: `checkin:${c.date}`, source: 'checkin', sourceLabel: 'Your Check-ins', group: 'yours',
    title: formatDate(c.date), subtitle: null,
    searchableText: c.note.toLowerCase(),
    snippet: c.note,
    route: null, params: { date: c.date },
  }));

  const journalSearchEntries = journalEntries.map(e => ({
    id: `journal:${e.date}`, source: 'journal', sourceLabel: 'Your Journal', group: 'yours',
    title: formatDate(e.date), subtitle: null,
    searchableText: joinText(e.grateful, e.showed, e.tomorrow),
    snippet: e.grateful || e.showed || e.tomorrow,
    route: '/journal', params: { date: e.date },
  }));

  return [...checkinEntries, ...journalSearchEntries];
}

// ── Matcher ──────────────────────────────────────────────────────────────

export function matchEntries(entries, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter(e => e.searchableText.includes(q));
}
