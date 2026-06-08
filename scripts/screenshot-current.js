const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = path.join(__dirname, '../docs/current-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });

  // Serve the exported app via file protocol
  const appDir = 'C:/Users/admin/AppData/Local/Temp/lglow-web';
  const routes = [
    { name: 'home',    url: `file:///${appDir}/index.html` },
    { name: 'journey', url: `file:///${appDir}/journey.html` },
    { name: 'tools',   url: `file:///${appDir}/tools.html` },
    { name: 'journal', url: `file:///${appDir}/journal.html` },
    { name: 'you',     url: `file:///${appDir}/you.html` },
  ];

  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(route.url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `${route.name}.png`) });
    console.log(`Captured: ${route.name}`);
    await page.close();
  }

  await browser.close();
  console.log('Done:', outDir);
})();
