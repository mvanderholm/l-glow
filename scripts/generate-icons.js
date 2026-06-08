// Generates icon.png (1024×1024, cream bg) and adaptive-icon.png (1024×1024, transparent bg)
// Source: assets/logo-o-glyph.svg
// Run with: node scripts/generate-icons.js

const { Resvg } = require('@resvg/resvg-js');
const fs   = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const svgBase   = fs.readFileSync(path.join(assetsDir, 'logo-o-glyph.svg'), 'utf-8');

// Inject a solid rect immediately after the opening <svg> tag
function addBackground(svg, color) {
  return svg.replace(/(<svg[^>]*>)/, `$1\n  <rect width="1024" height="1024" fill="${color}"/>`);
}

function write(svgStr, outFile) {
  const png = new Resvg(svgStr, { fitTo: { mode: 'width', value: 1024 } }).render().asPng();
  fs.writeFileSync(outFile, png);
  console.log(`Written: ${path.basename(outFile)} (${png.length} bytes)`);
}

// icon.png — cream background; iOS App Store rejects transparent icons
write(addBackground(svgBase, '#FBF9F4'), path.join(assetsDir, 'icon.png'));

// adaptive-icon.png — transparent; Android fills background from app.json backgroundColor
write(svgBase, path.join(assetsDir, 'adaptive-icon.png'));

console.log('Done.');
