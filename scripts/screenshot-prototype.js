const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = path.join(__dirname, '../docs/prototype-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile viewport (375x812 = iPhone 13-ish)
  await page.setViewportSize({ width: 390, height: 844 });

  const protoPath = 'file:///C:/Users/admin/l-glow/public/prototype.html';
  console.log('Loading prototype...');
  await page.goto(protoPath, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Screenshot home/initial state
  await page.screenshot({ path: path.join(outDir, '00-home.png'), fullPage: false });
  console.log('Captured: home');

  // Try to find and click all bottom nav tabs
  const navSelectors = [
    { label: 'home', selectors: ['[aria-label*="home" i]', '[aria-label*="Home" i]', 'text=Home', 'text=home'] },
    { label: 'checkin', selectors: ['[aria-label*="check" i]', 'text=Check', 'text=check'] },
    { label: 'tools', selectors: ['[aria-label*="tool" i]', 'text=Tools', 'text=tools'] },
    { label: 'learn', selectors: ['[aria-label*="learn" i]', 'text=Learn', 'text=learn'] },
    { label: 'you', selectors: ['[aria-label*="you" i]', 'text=You', 'text=you'] },
    { label: 'journey', selectors: ['[aria-label*="journey" i]', 'text=Journey', 'text=journey'] },
  ];

  for (const nav of navSelectors) {
    for (const sel of nav.selectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          await el.click();
          await page.waitForTimeout(1000);
          await page.screenshot({ path: path.join(outDir, `01-${nav.label}.png`) });
          console.log(`Captured: ${nav.label}`);
          break;
        }
      } catch (e) {}
    }
  }

  // Try to find all clickable nav items by looking at bottom nav area
  // Dump all text content so we know what's on screen
  const textContent = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const texts = new Set();
    for (const el of elements) {
      if (el.children.length === 0 && el.textContent.trim()) {
        texts.add(el.textContent.trim());
      }
    }
    return Array.from(texts).filter(t => t.length < 50);
  });
  console.log('Text on page:', textContent.slice(0, 50).join(' | '));

  // Get all clickable elements in the bottom 15% of viewport (nav bar area)
  const bottomNavItems = await page.evaluate(() => {
    const vh = window.innerHeight;
    const threshold = vh * 0.82;
    const items = [];
    const allElements = document.querySelectorAll('[role="button"], [role="tab"], a, button');
    for (const el of allElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top > threshold && rect.width > 10) {
        items.push({
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 30),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    return items;
  });
  console.log('Bottom nav items:', JSON.stringify(bottomNavItems, null, 2));

  // Click each nav item
  let i = 0;
  for (const item of bottomNavItems) {
    try {
      await page.mouse.click(item.left + item.width / 2, item.top + item.height / 2);
      await page.waitForTimeout(800);
      const label = (item.text || item.ariaLabel || `nav-${i}`).replace(/\s+/g, '-').toLowerCase().slice(0, 20);
      await page.screenshot({ path: path.join(outDir, `tab-${String(i).padStart(2,'0')}-${label}.png`) });
      console.log(`Captured tab: ${label}`);
      i++;
    } catch (e) {
      console.log(`Failed to click nav item: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`\nScreenshots saved to: ${outDir}`);
})();
