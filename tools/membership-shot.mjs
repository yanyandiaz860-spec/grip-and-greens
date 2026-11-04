// Captures the Memberships section and checks the banner image.
// Usage: node tools/membership-shot.mjs <outDir>
import { chromium } from '@playwright/test';
const out = process.argv[2] ?? '.';
const b = await chromium.launch();
for (const [n, vp] of [['desktop', { width: 1440, height: 900 }], ['tablet', { width: 768, height: 1024 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '[data-header]{position:absolute!important}' });
  const slot = p.locator('[data-slot="memberships.banner"]');
  await slot.scrollIntoViewIfNeeded();
  await p.waitForFunction(() => {
    const i = document.querySelector('[data-slot="memberships.banner"] img');
    return i && i.complete && i.naturalWidth > 0;
  });
  const info = await slot.evaluate((el) => {
    const i = el.querySelector('img');
    const r = el.getBoundingClientRect();
    return { filled: el.classList.contains('slot--filled'), box: `${Math.round(r.width)}x${Math.round(r.height)}`, ratio: +(r.width / r.height).toFixed(3), natural: +(i.naturalWidth / i.naturalHeight).toFixed(3), file: i.currentSrc.split('/').pop() };
  });
  console.log(n, JSON.stringify(info));
  await p.locator('#membership .membership__top').screenshot({ path: `${out}/membership-${n}.png` });
  await p.close();
}
await b.close();
