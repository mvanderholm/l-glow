import {
  CLEANSE_META, PHASES, ONE_RULE, DAILY_RHYTHM, GROUND_RULES, GROUND_RULES_NOTE,
  HOW_WE_EAT, BETWEEN_MEALS, DAILY_CHANGES, DAILY_CHANGES_NOTE, MEAL_PLAN, MEAL_PLAN_NOTES,
  COOKING_FRESH, SHOPPING_LIST, SHOPPING_LIST_INTRO, REINTRODUCTION_JOURNAL_DAYS,
  REINTRODUCTION_JOURNAL_PROMPT, REINTRODUCTION_JOURNAL_NOTE, RECIPES, RECIPE_TIPS, findRecipe,
} from '../content/cleanse';
import { getRecipeContent } from '../content/cleanseRecipes';

// Builds the same 17-ish page participant guide as
// "LGlow 15-Day Ayurvedic Cleanse Guide.pdf", personalized with the
// user's start date and ghee/olive-oil preference, and with the actual
// generated recipes filled in (static content, or a per-plan override —
// see data/user/cleanse.js's resolveRecipeContent). Rendered to PDF via
// expo-print's Print.printToFileAsync — see app/cleanse.js's
// exportPlanToPdf().

const COLORS = {
  bg: '#ECE7DD',
  page: '#F7F3EC',
  text: '#443733',
  muted: '#8A7A6E',
  accent: '#9A5151',
  accentSoft: '#B76D67',
  sage: '#7A8B6F',
  amber: '#C38B52',
  border: 'rgba(75,62,58,0.15)',
};

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function substituteGhee(text, gheePreference) {
  if (gheePreference !== 'olive_oil') return text;
  return text.replace(/ghee \(or olive oil\)/gi, 'olive oil').replace(/\bghee\b/gi, 'olive oil');
}

function mealCell(ids) {
  if (!ids) return '';
  const list = Array.isArray(ids) ? ids : [ids];
  return list.map(id => {
    const r = findRecipe(id);
    return r ? esc(r.title) : '';
  }).filter(Boolean).join(', ');
}

function recipeSection(gheePreference, overrides) {
  const byCategory = {};
  RECIPES.forEach(r => {
    byCategory[r.category] = byCategory[r.category] || [];
    byCategory[r.category].push(r);
  });

  return Object.entries(byCategory).map(([category, recipes]) => `
    <h3 class="section-sub">${esc(category)}</h3>
    ${recipes.map(r => {
      const content = overrides?.[r.id] ?? getRecipeContent(r.id);
      if (!content) return '';
      const daysLabel = Array.isArray(r.days) ? `Days ${r.days.join(', ')}` : 'All days';
      return `
        <div class="recipe-card">
          <div class="recipe-title">${esc(r.title)} <span class="recipe-days">(${daysLabel})</span></div>
          <div class="recipe-cols">
            <div>
              <div class="label">Ingredients</div>
              <ul>${content.ingredients.map(i => `<li>${esc(substituteGhee(i, gheePreference))}</li>`).join('')}</ul>
            </div>
            <div>
              <div class="label">Steps</div>
              <ol>${content.steps.map(s => `<li>${esc(substituteGhee(s, gheePreference))}</li>`).join('')}</ol>
            </div>
          </div>
          ${content.dairyReintroNote ? `<div class="note">${esc(content.dairyReintroNote)}</div>` : ''}
        </div>
      `;
    }).join('')}
  `).join('');
}

export function buildCleansePdfHtml({ startDate, gheePreference, overrides = {} }) {
  const gheeLabel = gheePreference === 'olive_oil' ? 'Olive oil (in place of ghee)' : 'Ghee';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { margin: 36pt; }
  body { font-family: Georgia, 'Times New Roman', serif; color: ${COLORS.text}; background: ${COLORS.bg}; margin: 0; }
  .page { background: ${COLORS.page}; padding: 28pt; }
  h1, h2, h3 { font-family: Georgia, serif; margin: 0 0 8pt; }
  h1 { font-size: 26pt; letter-spacing: 1px; }
  h2 { font-size: 18pt; border-bottom: 1pt solid ${COLORS.border}; padding-bottom: 6pt; margin-top: 20pt; }
  h3.section-sub { font-size: 13pt; color: ${COLORS.accent}; margin-top: 16pt; }
  p { font-size: 10.5pt; line-height: 1.55; }
  .cover { text-align: center; padding-top: 100pt; }
  .cover .mark { font-size: 30pt; letter-spacing: 6px; }
  .cover .tagline { color: ${COLORS.accent}; letter-spacing: 2px; font-size: 10pt; margin-top: 4pt; }
  .cover hr { width: 100pt; border: none; border-top: 1pt solid ${COLORS.amber}; margin: 24pt auto; }
  .cover .title { font-size: 24pt; margin-top: 20pt; }
  .cover .based-on { font-style: italic; color: ${COLORS.muted}; margin-top: 40pt; font-size: 10.5pt; }
  .meta-row { display: flex; gap: 20pt; font-size: 10pt; color: ${COLORS.muted}; margin: 8pt 0 16pt; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 8pt 0 14pt; }
  th { background: ${COLORS.accent}; color: white; text-align: left; padding: 6pt 8pt; font-size: 9pt; }
  td { padding: 6pt 8pt; border-bottom: 0.5pt solid ${COLORS.border}; vertical-align: top; }
  tr:nth-child(even) td { background: rgba(154,81,81,0.05); }
  .callout { border-left: 3pt solid ${COLORS.sage}; background: rgba(122,139,111,0.08); padding: 10pt 14pt; margin: 10pt 0; border-radius: 4pt; }
  .callout.amber { border-left-color: ${COLORS.amber}; background: rgba(195,139,82,0.1); }
  .callout.accent { border-left-color: ${COLORS.accent}; background: rgba(154,81,81,0.08); }
  .callout h4 { margin: 0 0 4pt; font-size: 11pt; }
  ul, ol { margin: 4pt 0; padding-left: 18pt; font-size: 10pt; }
  li { margin-bottom: 3pt; }
  .label { font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.5px; color: ${COLORS.muted}; font-weight: bold; margin-bottom: 3pt; }
  .recipe-card { border: 0.5pt solid ${COLORS.border}; border-left: 3pt solid ${COLORS.accentSoft}; border-radius: 4pt; padding: 10pt 12pt; margin-bottom: 10pt; break-inside: avoid; }
  .recipe-title { font-size: 12pt; font-weight: bold; margin-bottom: 6pt; }
  .recipe-days { font-weight: normal; color: ${COLORS.muted}; font-size: 9pt; }
  .recipe-cols { display: flex; gap: 16pt; }
  .recipe-cols > div { flex: 1; }
  .note { font-size: 9pt; font-style: italic; color: ${COLORS.muted}; margin-top: 6pt; }
  .footer { text-align: center; font-size: 8.5pt; color: ${COLORS.muted}; margin-top: 20pt; }
  .journal-table td { height: 30pt; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>

<div class="page cover">
  <div class="mark">L . G L Ô W</div>
  <div class="tagline">WELLNESS, ROOTED IN YOU</div>
  <hr />
  <div class="title">${esc(CLEANSE_META.title)}</div>
  <p style="text-align:center; letter-spacing: 1px; text-transform: uppercase; font-size: 10pt;">${esc(CLEANSE_META.subtitle)}</p>
  <p style="text-align:center; font-size: 9.5pt; color: ${COLORS.muted};">${esc(CLEANSE_META.tagline)}</p>
  <p class="based-on">${esc(CLEANSE_META.basedOn)}</p>
  <div class="meta-row" style="justify-content:center; margin-top: 60pt;">
    <div><strong>Start date:</strong> ${esc(startDate)}</div>
    <div><strong>Cooking fat:</strong> ${esc(gheeLabel)}</div>
  </div>
</div>

<div class="page page-break">
  <h2>Your 15-day cleanse</h2>
  <p>${esc(CLEANSE_META.intro)}</p>
  <table>
    <tr><th>Phase</th><th>Days</th><th>What you'll do</th></tr>
    ${PHASES.map(p => `<tr><td><strong>${esc(p.label)}</strong></td><td>${esc(p.days)}</td><td>${esc(p.description)}</td></tr>`).join('')}
  </table>
  <div class="callout">
    <h4>${esc(ONE_RULE.title)}</h4>
    <p>${esc(ONE_RULE.body).replace(/\n\n/g, '</p><p>')}</p>
  </div>
  <div class="callout amber">
    <h4>Before you begin: please read</h4>
    <p>This is a gentle dietary reset, not medical treatment or a test for food intolerances. It does not include extended fasting, laxatives, or enemas. Talk with your doctor before starting if any of the safety-gate conditions apply to you.</p>
  </div>
</div>

<div class="page page-break">
  <h2>Your daily rhythm</h2>
  <table>
    <tr><th>When</th><th>What to do</th></tr>
    ${DAILY_RHYTHM.map(r => `<tr><td><strong>${esc(r.when)}</strong></td><td>${esc(r.what)}</td></tr>`).join('')}
  </table>
  <div class="label" style="margin-top:10pt;">Ground rules</div>
  <ul>${GROUND_RULES.map(g => `<li><strong>${esc(g.title)}:</strong> ${esc(g.body)}</li>`).join('')}</ul>
  <p class="note">${esc(GROUND_RULES_NOTE)}</p>

  <h2>How we eat</h2>
  ${HOW_WE_EAT.map(h => `<p><strong>${esc(h.title)}</strong> — ${esc(h.body)}</p>`).join('')}
  <p>${esc(BETWEEN_MEALS)}</p>
</div>

<div class="page page-break">
  <h2>What changes each day</h2>
  <table>
    <tr><th>Day</th><th>What changes</th><th>Details</th></tr>
    ${DAILY_CHANGES.map(c => `<tr><td>${esc(c.day)}</td><td>${esc(c.change)}</td><td>${esc(c.details)}</td></tr>`).join('')}
  </table>
  <p class="note">${esc(DAILY_CHANGES_NOTE)}</p>
</div>

<div class="page page-break">
  <h2>Your meal plan</h2>
  <p>Personalized to your start date of <strong>${esc(startDate)}</strong>. Lunch is always your biggest meal.</p>
  <table>
    <tr><th>Day</th><th>Date</th><th>Phase note</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>
    ${MEAL_PLAN.map(m => {
      const d = new Date(startDate + 'T12:00:00');
      d.setDate(d.getDate() + (m.day - 1));
      const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const note = m.remove || m.addBack || '';
      return `<tr><td>${m.day}</td><td>${dateLabel}</td><td>${esc(note)}</td><td>${mealCell(m.breakfast)}</td><td>${mealCell(m.lunch)}</td><td>${mealCell(m.dinner)}</td></tr>`;
    }).join('')}
  </table>
  <p class="note">${esc(MEAL_PLAN_NOTES.phase1)}</p>
  <p class="note">${esc(MEAL_PLAN_NOTES.phase2)}</p>
  <p class="note">${esc(MEAL_PLAN_NOTES.phase3)}</p>
</div>

<div class="page page-break">
  <h2>Cooking fresh each day</h2>
  <div class="label">Cook it the day you eat it</div>
  <ul>${COOKING_FRESH.cookItTheDayYouEatIt.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  <div class="label">Keeping fruits and vegetables cooked</div>
  <ul>${COOKING_FRESH.keepingCooked.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  <div class="callout">
    <h4>Food safety</h4>
    <ul>${COOKING_FRESH.foodSafety.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  </div>
</div>

<div class="page page-break">
  <h2>Your shopping list</h2>
  <p>${esc(SHOPPING_LIST_INTRO)}</p>
  ${SHOPPING_LIST.map(section => `
    <div class="label" style="margin-top:10pt;">${esc(section.category)}</div>
    <table>
      ${section.items.map(i => `<tr><td style="width:14pt;">☐</td><td><strong>${esc(i.item)}</strong></td><td>${esc(i.usedIn)}</td></tr>`).join('')}
    </table>
  `).join('')}
</div>

<div class="page page-break">
  <h2>Reintroduction journal</h2>
  <p>${esc(REINTRODUCTION_JOURNAL_PROMPT)}</p>
  <table class="journal-table">
    <tr><th>Day</th><th>Added back</th><th>Digestion</th><th>Energy</th><th>Mood</th><th>Skin</th><th>Notes</th></tr>
    ${REINTRODUCTION_JOURNAL_DAYS.map(d => `<tr><td>${d.day}</td><td>${esc(d.addedBack)}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}
  </table>
  <p class="note">${esc(REINTRODUCTION_JOURNAL_NOTE)}</p>
</div>

<div class="page page-break">
  <h2>Recipe guide</h2>
  <p>Every dish below was generated from Thea's own recipe design, personalized to your ${esc(gheeLabel.toLowerCase())} preference. <em>Draft — awaiting Thea's final review; treat quantities as a starting point.</em></p>
  <div class="label">Tips</div>
  <ul>${RECIPE_TIPS.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  ${recipeSection(gheePreference, overrides)}
</div>

<div class="page">
  <p style="text-align:center; font-style: italic; margin-top: 200pt;">${esc(CLEANSE_META.closing)}</p>
  <p style="text-align:center; letter-spacing: 3px;">L . G L Ô W</p>
</div>

</body>
</html>`;
}
