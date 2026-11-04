// Brand Applications slideshow + gallery checks.
// Usage: node tools/interact-mockups.mjs <outDir>
import { chromium } from '@playwright/test';
const out = process.argv[2] ?? '.';
const URL = 'http://127.0.0.1:4321/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await p.goto(URL, { waitUntil: 'networkidle' });
await p.waitForSelector('[data-loader]', { state: 'detached', timeout: 12000 });

const r = {};
const titles = () => p.$$eval('[data-slideshow]', (l) => l.map((x) => x.querySelector('[data-slide].is-active .mock__title').textContent));
r.counts = await p.$$eval('[data-slideshow]', (l) => l.map((x) => x.querySelectorAll('[data-slide]').length));
await p.locator('#applications .groups').scrollIntoViewIfNeeded();
await p.mouse.move(5, 5);
await p.waitForTimeout(1500);
await p.locator('#applications').screenshot({ path: `${out}/apps-desktop.png` });
const t1 = await titles();
await p.waitForTimeout(6000);
const t2 = await titles();
r.autoAdvance = { before: t1, after: t2, allChanged: t1.every((t, i) => t !== t2[i]) };

// Only the active slide is reachable
r.tabbableSlides = await p.$$eval('[data-slideshow]', (l) => l.map((x) => [...x.querySelectorAll('[data-slide]')].filter((s) => s.tabIndex === 0).length));

// Pause button stops one card
const first = p.locator('[data-slideshow]').first();
await first.locator('[data-slide-toggle]').click();
await p.mouse.move(5, 5);
const a = await first.locator('[data-slide].is-active .mock__title').textContent();
await p.waitForTimeout(5000);
r.pauseHolds = a === (await first.locator('[data-slide].is-active .mock__title').textContent());
r.toggleLabel = await first.locator('[data-slide-toggle]').getAttribute('aria-label');

// Dot jumps
await first.locator('[data-slide-dot="2"]').click();
await p.waitForTimeout(200);
r.dotJump = await first.locator('[data-slide].is-active .mock__title').textContent();

// Click opens gallery with details
const pack = p.locator('[data-slideshow]').nth(2);
await pack.hover();
await pack.locator('[data-slide-dot="0"]').click();
await p.waitForTimeout(1300);
await pack.locator('[data-slide].is-active').click({ position: { x: 120, y: 160 } });
await p.waitForTimeout(800);
const lb = async () => ({
  open: await p.evaluate(() => document.querySelector('[data-lightbox-dialog]').open),
  title: await p.textContent('[data-lb-title]'),
  count: await p.textContent('[data-lb-count]'),
  detail: await p.textContent('[data-lb-detail]'),
});
r.gallery1 = await lb();
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}/apps-gallery.png` });
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(500);
r.gallery2 = await lb();
await p.keyboard.press('Escape');
await p.waitForTimeout(300);
r.closed = await p.evaluate(() => !document.querySelector('[data-lightbox-dialog]').open);

// Other galleries still have no detail line
await p.locator('#logo a[data-lightbox]').first().scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
await p.locator('#logo a[data-lightbox]').first().click();
await p.waitForTimeout(500);
r.artDetailHidden = await p.$eval('[data-lb-detail]', (x) => x.hidden);
await p.keyboard.press('Escape');

r.errors = errors;
console.log(JSON.stringify(r, null, 1));

// Reduced motion: no auto-advance, no pause button, dots work
const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const q = await c2.newPage();
await q.goto(URL, { waitUntil: 'networkidle' });
await q.locator('#applications .groups').scrollIntoViewIfNeeded();
await q.waitForTimeout(800);
const f = q.locator('[data-slideshow]').first();
const s1 = await f.locator('[data-slide].is-active .mock__title').textContent();
await q.waitForTimeout(5000);
const s2 = await f.locator('[data-slide].is-active .mock__title').textContent();
await f.locator('[data-slide-dot="1"]').click();
console.log('reduced-motion', JSON.stringify({
  static: s1 === s2,
  toggleHidden: await f.locator('[data-slide-toggle]').evaluate((x) => x.hidden),
  dotWorks: await f.locator('[data-slide].is-active .mock__title').textContent(),
}));
await q.addStyleTag({ content: '[data-header]{position:absolute!important}' });
await q.locator('#applications .groups').screenshot({ path: `${out}/apps-phone.png` });
await b.close();
