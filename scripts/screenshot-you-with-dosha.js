const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // Use HTTP server — localStorage works on http://localhost
  const base = 'http://localhost:3456';

  // Inject dosha result directly then load You
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    localStorage.setItem('@lglow/primary_dosha', 'vata');
    localStorage.setItem('@lglow/dosha_scores', JSON.stringify({ vata: 5, pitta: 2, kapha: 1 }));
  });

  // Check it was stored
  const stored = await page.evaluate(() => ({
    dosha: localStorage.getItem('@lglow/primary_dosha'),
    scores: localStorage.getItem('@lglow/dosha_scores'),
  }));
  console.log('Injected:', stored);

  // Navigate to You screen (same origin, localStorage persists)
  await page.goto(`${base}/you.html`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);

  const storedYou = await page.evaluate(() => ({
    dosha: localStorage.getItem('@lglow/primary_dosha'),
    scores: localStorage.getItem('@lglow/dosha_scores'),
  }));
  console.log('On you page:', storedYou);

  await page.screenshot({ path: path.join(__dirname, '../docs/current-screenshots/you-with-dosha.png') });
  console.log('Captured');
  await browser.close();
})();
