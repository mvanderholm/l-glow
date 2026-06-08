const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function extractScreen(page, name, clickCoords) {
  if (clickCoords) {
    await page.mouse.click(clickCoords.x, clickCoords.y);
    await page.waitForTimeout(600);
  }

  // Full-size screenshot
  await page.screenshot({
    path: path.join(__dirname, `../docs/proto-hires/${name}.png`),
    fullPage: false,
  });

  // Extract all element bounding boxes, computed styles, and text
  const data = await page.evaluate(() => {
    function getStyle(el) {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        border: cs.border,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth,
        borderStyle: cs.borderStyle,
        gap: cs.gap,
        display: cs.display,
        flexDirection: cs.flexDirection,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        width: cs.width,
        height: cs.height,
        minHeight: cs.minHeight,
        boxShadow: cs.boxShadow,
        opacity: cs.opacity,
      };
    }

    function rect(el) {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
    }

    const results = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const r = rect(el);
      if (r.width < 4 || r.height < 4) continue;
      const text = (el.childElementCount === 0) ? el.textContent.trim().slice(0, 80) : '';
      if (!text && !['DIV', 'BUTTON', 'INPUT', 'A', 'svg'].includes(el.tagName)) continue;
      results.push({
        tag: el.tagName,
        text,
        rect: r,
        style: getStyle(el),
      });
    }
    return results;
  });

  fs.writeFileSync(
    path.join(__dirname, `../docs/proto-hires/${name}.json`),
    JSON.stringify(data, null, 2)
  );
  console.log(`${name}: ${data.length} elements`);
}

(async () => {
  const outDir = path.join(__dirname, '../docs/proto-hires');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  const proto = 'file:///C:/Users/admin/l-glow/public/prototype.html';
  await page.goto(proto, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Nav coords from earlier extraction
  const nav = {
    home:    { x: 75,  y: 741 },
    journey: { x: 140, y: 741 },
    tools:   { x: 200, y: 741 },
    journal: { x: 260, y: 741 },
    you:     { x: 320, y: 741 },
  };

  for (const [name, coords] of Object.entries(nav)) {
    await page.mouse.click(coords.x, coords.y);
    await page.waitForTimeout(700);
    await extractScreen(page, name, null);
  }

  await browser.close();
  console.log('\nDone. Files in docs/proto-hires/');
})();
