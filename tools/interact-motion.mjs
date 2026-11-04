// Motion / redesign checks with NORMAL motion: loader, scroll reveals (down + up),
// infinite carousel direction, drag-vs-click, palette copy, radios, reduced-motion path.
// Usage: node tools/interact-motion.mjs <outDir>
import { chromium } from '@playwright/test';

const out = process.argv[2] ?? '.';
const URL = 'http://127.0.0.1:4321/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const r = {};

// ---- R01 loader ----
const t0 = Date.now();
await p.goto(URL, { waitUntil: 'commit' });
await p.waitForSelector('[data-loader]', { state: 'attached', timeout: 3000 }).catch(() => {});
await p.waitForTimeout(450);
await p.screenshot({ path: `${out}/r01-loader.png` });
await p.waitForSelector('[data-loader]', { state: 'detached', timeout: 12000 });
r.loaderGoneMs = Date.now() - t0;
r.ready = await p.evaluate(() => document.documentElement.dataset.ready);
r.motionOn = await p.evaluate(() => document.documentElement.dataset.motion);
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/r12-hero-after-loader.png` });

// ---- R12 reveals: down, then up ----
const vis = (sel) => p.$eval(sel, (el) => el.classList.contains('is-visible'));
r.ownersBefore = await vis('#owners .owners__list');
await p.locator('#owners').scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
r.ownersAfterScrollDown = await vis('#owners .owners__list');
await p.evaluate(() => window.scrollTo(0, document.querySelector('#contact').offsetTop));
await p.waitForTimeout(600);
r.ownersAfterLeaving = await vis('#owners .owners__list');
r.ownersLeftFrom = await p.$eval('#owners .owners__list', (el) => el.dataset.from);
await p.evaluate(() => window.scrollTo(0, document.querySelector('#owners').offsetTop - 80));
await p.waitForTimeout(1200);
r.ownersAfterScrollUp = await vis('#owners .owners__list');
await p.screenshot({ path: `${out}/r12-owners-scroll-up.png` });

// ---- R03 timeline alignment (geometry) ----
await p.locator('#story .timeline').scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
r.timelineDesktop = await p.$$eval('#story .timeline__item', (items) => items.map((it) => {
  const dot = it.querySelector('.timeline__dot').getBoundingClientRect();
  const track = it.querySelector('.timeline__track');
  const tr = track.getBoundingClientRect();
  const lineY = tr.top + tr.height / 2; // ::before is top:50%, 2px tall centred
  return Math.round((dot.top + dot.height / 2 - lineY) * 10) / 10;
}));
r.timelineDotCentersY = await p.$$eval('#story .timeline__dot', (d) => d.map((x) => Math.round(x.getBoundingClientRect().top + x.getBoundingClientRect().height / 2)));
await p.locator('#story .timeline').screenshot({ path: `${out}/r03-timeline-desktop.png` });

// ---- R08 carousel ----
await p.locator('#brand-post [data-carousel]').scrollIntoViewIfNeeded();
await p.mouse.move(5, 5); // not hovering
await p.waitForTimeout(1500);
const tx = () => p.$eval('[data-carousel-track]', (t) => new DOMMatrix(getComputedStyle(t).transform).m41);
const a1 = await tx(); await p.waitForTimeout(1000); const a2 = await tx();
r.carouselMovesRight = a2 > a1;
r.carouselPxPerSec = Math.round(a2 - a1);
r.carouselClones = await p.$$eval('[data-carousel-track] > li.is-clone', (l) => l.length);
r.clonesHidden = await p.$$eval('[data-carousel-track] > li.is-clone', (l) => l.every((x) => x.getAttribute('aria-hidden') === 'true'));
r.cloneLinksUntabbable = await p.$$eval('[data-carousel-track] > li.is-clone a', (l) => l.every((x) => x.tabIndex === -1));
await p.locator('#brand-post .carousel').screenshot({ path: `${out}/r08-carousel.png` });
// pause button
await p.click('[data-carousel-toggle]');
const b1 = await tx(); await p.waitForTimeout(700); const b2 = await tx();
r.pauseStops = Math.abs(b2 - b1) < 0.5;
r.toggleState = await p.getAttribute('[data-carousel-toggle]', 'data-state');
// next / prev glide
const n0 = await tx(); await p.click('[data-carousel-next]'); await p.waitForTimeout(800); const n1 = await tx();
r.nextMovesLeftBy = Math.round(n0 - n1);
// drag must not open lightbox
const vp = await p.$('[data-carousel-viewport]');
const box = await vp.boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await p.mouse.down();
await p.mouse.move(box.x + box.width / 2 + 160, box.y + box.height / 2, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(300);
r.dragOpenedLightbox = await p.evaluate(() => document.querySelector('[data-lightbox-dialog]').open);
// plain click on a visible slide opens lightbox (original or clone proxy)
const vis1 = await p.evaluate(() => {
  const v = document.querySelector('[data-carousel-viewport]').getBoundingClientRect();
  const li = [...document.querySelectorAll('[data-carousel-track] > li')].find((x) => {
    const rr = x.getBoundingClientRect(); return rr.left > v.left + 10 && rr.right < v.right - 10;
  });
  const rr = li.getBoundingClientRect();
  return { x: rr.left + rr.width / 2, y: rr.top + rr.height / 2, clone: li.classList.contains('is-clone') };
});
await p.mouse.click(vis1.x, vis1.y);
await p.waitForTimeout(500);
r.clickOpensLightbox = await p.evaluate(() => document.querySelector('[data-lightbox-dialog]').open);
r.clickedWasClone = vis1.clone;
r.lightboxCount = await p.textContent('[data-lb-count]');
await p.keyboard.press('Escape');
await p.waitForTimeout(200);

// ---- R06/07/09 palette hover + copy ----
const sw = p.locator('#logo .swatch').first();
await sw.scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
const y0 = (await sw.boundingBox()).y;
await sw.hover(); await p.waitForTimeout(500);
r.swatchLiftPx = Math.round(y0 - (await sw.boundingBox()).y);
await sw.click(); await p.waitForTimeout(150);
r.swatchCopied = await sw.getAttribute('data-copied');
r.clipboard = await p.evaluate(() => navigator.clipboard.readText());
await p.locator('#logo .palette').screenshot({ path: `${out}/r06-logo-palette-hover.png` });
const dsw = p.locator('#brand-post .swatch').nth(1);
await dsw.scrollIntoViewIfNeeded(); await p.waitForTimeout(1000); await dsw.hover(); await p.waitForTimeout(500);
await p.locator('#brand-post .palette').screenshot({ path: `${out}/r07-post-palette-hover.png` });
const psw = p.locator('#posters .swatch').nth(1);
await psw.scrollIntoViewIfNeeded(); await p.waitForTimeout(1000); await psw.hover(); await p.waitForTimeout(500);
await p.locator('#posters .palette').screenshot({ path: `${out}/r09-poster-palette-hover.png` });
r.paletteCards = await p.$$eval('.swatch', (l) => l.length);

// ---- R11 radios ----
await p.locator('#contact .choices').scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
r.radioGeometry = await p.$$eval('#contact .choice', (cs) => cs.map((c) => {
  const cr = c.getBoundingClientRect(); const d = c.querySelector('.choice__dot').getBoundingClientRect();
  return { h: Math.round(cr.height), dotLeftPad: Math.round(d.left - cr.left), dotVOffset: Math.round((d.top + d.height / 2) - (cr.top + cr.height / 2)) };
}));
await p.click('#contact .choice:nth-child(2) .choice__text');
r.generalChecked = await p.$eval('input[name=type][value=general]', (i) => i.checked);
r.planHiddenForGeneral = await p.$eval('[data-plan-row]', (x) => x.hidden);
await p.click('#contact .choice:nth-child(1)');
await p.locator('#contact .contact__card').screenshot({ path: `${out}/r10-r11-form.png` });

r.errors = errors;
console.log(JSON.stringify(r, null, 1));

// ---- Reduced motion path: no loader, everything visible ----
const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const p2 = await ctx2.newPage();
await p2.goto(URL, { waitUntil: 'networkidle' });
const rm = {};
rm.loaderPresent = !!(await p2.$('[data-loader]'));
rm.hiddenReveals = await p2.$$eval('[data-reveal], [data-stagger] > *', (l) => l.filter((x) => getComputedStyle(x).opacity !== '1').length);
const c1 = await p2.$eval('[data-carousel-track]', (t) => t.style.transform); await p2.waitForTimeout(800);
const c2 = await p2.$eval('[data-carousel-track]', (t) => t.style.transform);
rm.carouselStatic = c1 === c2;
rm.toggleHidden = await p2.$eval('[data-carousel-toggle]', (x) => x.hidden);
await p2.locator('#story .timeline').screenshot({ path: `${out}/r03-timeline-phone.png` });
console.log('reduced-motion', JSON.stringify(rm));

// ---- No-JS path: loader never shows, content visible ----
const ctx3 = await b.newContext({ viewport: { width: 1280, height: 860 }, javaScriptEnabled: false });
const p3 = await ctx3.newPage();
await p3.goto(URL, { waitUntil: 'networkidle' });
const nj = {};
nj.loaderVisible = await p3.$eval('[data-loader]', (x) => getComputedStyle(x).display !== 'none');
nj.hiddenReveals = await p3.$$eval('[data-reveal], [data-stagger] > *', (l) => l.filter((x) => getComputedStyle(x).opacity !== '1').length);
console.log('no-js', JSON.stringify(nj));
await b.close();
