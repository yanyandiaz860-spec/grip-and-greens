// Generates favicons from the ORIGINAL icon-only logo (read-only).
// Crops to the measured icon area on its own white background, pads to a square, resizes.
// Run: node tools/make-favicons.mjs
import sharp from 'sharp';
const SRC = 'src/assets/originals/logos/icon-only-logo.png';
// measured content box (px) of the 2000×2000 original, padded to a square
const box = { left: 690, top: 510, width: 659, height: 1053 };
const side = 1180;
const left = Math.round(box.left + box.width / 2 - side / 2);
const top = Math.round(box.top + box.height / 2 - side / 2);
const base = sharp(SRC).extract({ left, top, width: side, height: side }).flatten({ background: '#ffffff' });
await base.clone().resize(32, 32).png().toFile('public/favicon-32.png');
await base.clone().resize(192, 192).png().toFile('public/icon-192.png');
await base.clone().resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('favicons written', { left, top, side });
