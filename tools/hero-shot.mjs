// Captures the hero after the loader and checks both hero images.
// Usage: node tools/hero-shot.mjs <outDir>
import { chromium } from '@playwright/test';
const out = process.argv[2] ?? '.';
const b = await chromium.launch();
for (const [n, vp] of [['desktop', { width: 1440, height: 900 }], ['laptop', { width: 1280, height: 720 }], ['tablet', { width: 768, height: 1024 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-loader]', { state: 'detached', timeout: 12000 });
  await p.waitForTimeout(1300);
  const info = await p.$$eval('#home [data-slot]', (l) => l.map((el) => {
    const i = el.querySelector('img');
    const r = el.getBoundingClientRect();
    return { slot: el.dataset.slot, filled: el.classList.contains('slot--filled'), box: `${Math.round(r.width)}x${Math.round(r.height)}`, loaded: !!i && i.complete && i.naturalWidth > 0, file: i?.currentSrc.split('/').pop() };
  }));
  console.log(n, JSON.stringify(info), 'errors', JSON.stringify(errs));
  await p.screenshot({ path: `${out}/hero-${n}.png` });
  if (n === 'phone') {
    await p.locator('#home .hero__media').scrollIntoViewIfNeeded();
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}/hero-phone-media.png` });
  }
  await p.close();
}
await b.close();
