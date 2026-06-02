// Generates icon.png (1024×1024, midnight bg) and adaptive-icon.png (1024×1024, transparent bg)
// Run with: node scripts/generate-icons.js

const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const SAFFRON = '#E8A030';
const MIDNIGHT = '#0E0B08';
const SIZE = 1024;

function buildSvg(transparent) {
  const bg = transparent
    ? `<rect width="${SIZE}" height="${SIZE}" fill="none"/>`
    : `<rect width="${SIZE}" height="${SIZE}" fill="${MIDNIGHT}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  ${bg}
  <text
    x="${SIZE / 2}"
    y="780"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="660"
    text-anchor="middle"
    fill="${SAFFRON}">Ô</text>
</svg>`;
}

function write(svgStr, outFile) {
  const resvg = new Resvg(svgStr, {
    fitTo: { mode: 'width', value: SIZE },
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(outFile, png);
  console.log(`Written: ${outFile} (${png.length} bytes)`);
}

const assetsDir = path.join(__dirname, '..', 'assets');

write(buildSvg(false), path.join(assetsDir, 'icon.png'));
write(buildSvg(true),  path.join(assetsDir, 'adaptive-icon.png'));

console.log('Done.');
