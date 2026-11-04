// Loader checks: frame captures, first vs repeat visit timing, skip, hard cap.
// Usage: node tools/loader-shot.mjs <outDir>
import { chromium } from '@playwright/test';
const out = process.argv[2] ?? '.';
const URL = 'http://127.0.0.1:4321/';
const b = await chromium.launch();
const gone = (p) => p.waitForSelector('[data-loader]', { state: 'detached', timeout: 12000 });

// 1) Frames during a first visit (desktop)
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto(URL, { waitUntil: 'commit' });
  for (const ms of [900, 2100, 3300, 4300, 5000]) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await p.waitForTimeout(wait);
    await p.screenshot({ path: `${out}/loader-${String(ms).padStart(4, '0')}ms.png` });
  }
  await gone(p);
  console.log('first visit: loader removed after', Date.now() - t0, 'ms');
  // 2) repeat visit in the same session
  const t1 = Date.now();
  await p.goto(URL, { waitUntil: 'commit' });
  await gone(p);
  console.log('repeat visit: loader removed after', Date.now() - t1, 'ms');
  await ctx.close();
}
// 3) Skip by click
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(600);
  const t = Date.now();
  await p.mouse.click(700, 450);
  await gone(p);
  console.log('skip: loader removed', Date.now() - t, 'ms after click');
  await ctx.close();
}
// 4) Hard cap: fonts never become ready
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => { Object.defineProperty(document, 'fonts', { value: { ready: new Promise(() => {}) } }); });
  const t = Date.now();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/loader-phone.png` });
  const held = await p.$eval('[data-loader-count]', (x) => x.textContent);
  await gone(p);
  console.log('hard cap (fonts never ready): counter held at', held + '%', '— removed after', Date.now() - t, 'ms');
  await ctx.close();
}
await b.close();
