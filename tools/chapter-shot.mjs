// Captures the two chapter bands, the carousel (static) and the plan cards.
// Usage: node tools/chapter-shot.mjs <outDir>
import { chromium } from '@playwright/test';
const out = process.argv[2] ?? '.';
const b = await chromium.launch();
for (const [n, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '[data-header]{position:absolute!important}' });
  const ch = await p.$$('nav.chapter');
  for (let i = 0; i < ch.length; i++) await ch[i].screenshot({ path: `${out}/r02-r05-chapter${i + 1}-${n}.png` });
  if (n === 'desktop') {
    await (await p.$('#brand-post .carousel')).screenshot({ path: `${out}/r08-carousel-static.png` });
    await (await p.$('#membership .plans')).screenshot({ path: `${out}/plans.png` });
  }
  await p.close();
}
await b.close();
console.log('ok');
