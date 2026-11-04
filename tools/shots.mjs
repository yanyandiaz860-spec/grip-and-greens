// Usage: node tools/shots.mjs <outDir> [url]
// Captures full-page + per-section screenshots at desktop and phone widths, and logs console errors.
import { chromium } from '@playwright/test';
const out = process.argv[2] ?? 'shots';
const url = process.argv[3] ?? 'http://127.0.0.1:4321/';
const ids = ['home','story','mission','why','gym','cafe','membership','owners','logo','brand-post','posters','applications','contact'];
const browser = await chromium.launch();
for (const [name, vp] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const errors = [];
  page.on('console', m => m.type()==='error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => errors.push('FAILED ' + r.url()));
  await page.goto(url, { waitUntil: 'networkidle' });
  // force lazy images to load
  await page.evaluate(async () => { for (let y=0; y<document.body.scrollHeight; y+=600){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); } window.scrollTo(0,0); });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${out}/${name}-00-viewport.png` });
  await page.addStyleTag({ content: '[data-header]{position:absolute!important}' });
  for (const id of ids) {
    const el = await page.$('#'+id); if (!el) continue;
    await el.screenshot({ path: `${out}/${name}-${id}.png` });
  }
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const ow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(name, 'height', h, 'horizontal-overflow', ow, 'errors', errors);
  await page.close();
}
await browser.close();
