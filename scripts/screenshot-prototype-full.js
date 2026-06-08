const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = path.join(__dirname, '../docs/prototype-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  const protoPath = 'file:///C:/Users/admin/l-glow/public/prototype.html';
  await page.goto(protoPath, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click Home first
  await page.mouse.click(75, 797);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'full-home-top.png') });

  // Scroll down on home
  await page.evaluate(() => { window.scrollBy(0, 400); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'full-home-mid.png') });
  await page.evaluate(() => { window.scrollBy(0, 400); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'full-home-bot.png') });

  // Journey
  await page.mouse.click(140, 797);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'full-journey-top.png') });
  await page.evaluate(() => { window.scrollBy(0, 400); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'full-journey-mid.png') });

  // Tools
  await page.mouse.click(200, 797);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'full-tools.png') });

  // Journal
  await page.mouse.click(260, 797);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'full-journal-top.png') });
  await page.evaluate(() => { window.scrollBy(0, 400); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'full-journal-bot.png') });

  // You
  await page.mouse.click(320, 797);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'full-you-top.png') });
  await page.evaluate(() => { window.scrollBy(0, 400); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'full-you-bot.png') });

  await browser.close();
  console.log('Done. Screenshots in:', outDir);
})();
