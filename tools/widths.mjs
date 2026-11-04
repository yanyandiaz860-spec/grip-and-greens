// Overflow + console check at all required widths (normal motion, after loader).
import { chromium } from '@playwright/test';
const out = process.argv[2];
const b = await chromium.launch();
for (const w of [360, 390, 768, 1024, 1280, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-loader]', { state: 'detached' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const wide = await p.evaluate(() => [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.right > window.innerWidth + 1 && !el.closest('[data-carousel-viewport]') && getComputedStyle(el).position !== 'fixed'; }).slice(0, 5).map((el) => el.tagName + '.' + el.className));
  if (out && (w === 768 || w === 1024)) {
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/w${w}-top.png` });
  }
  console.log(w, 'overflowPx', over, 'offenders', wide, 'errors', errs);
  await p.close();
}
await b.close();
