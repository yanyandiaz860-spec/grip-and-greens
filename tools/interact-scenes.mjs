// Checks for the scroll scenes, dial, text strips, hero headline and dial lens.
// Needs a running server. Port 4321 is the default.
// Usage: node tools/interact-scenes.mjs <outDir> [url]
import { chromium } from '@playwright/test';

const out = process.argv[2] ?? '.';
const URL = process.argv[3] ?? 'http://127.0.0.1:4321/';
const b = await chromium.launch();
const r = {};

const ready = (p) => p.waitForSelector('[data-loader]', { state: 'detached', timeout: 12000 }).catch(() => {});
const errorsOn = (p, list) => {
  p.on('pageerror', (e) => list.push(e.message));
  p.on('console', (m) => m.type() === 'error' && list.push(m.text()));
};

/* Wheel to a fraction of a scene, as a person would */
async function wheelTo(p, selector, fraction) {
  const target = await p.$eval(selector, (el, f) => {
    const rect = el.getBoundingClientRect();
    const stage = el.querySelector('[data-scene-stage]');
    const range = rect.height - stage.offsetHeight;
    return window.scrollY + rect.top - parseFloat(getComputedStyle(stage).top) + range * f;
  }, fraction);
  for (let i = 0; i < 400; i++) {
    const y = await p.evaluate(() => window.scrollY);
    const d = target - y;
    if (Math.abs(d) < 4) break;
    await p.mouse.wheel(0, Math.sign(d) * Math.min(Math.abs(d), 300));
    await p.waitForTimeout(16);
  }
  await p.waitForTimeout(1100);
}

/* ---------- Desktop ---------- */
{
  const errors = [];
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  errorsOn(p, errors);
  await p.goto(URL, { waitUntil: 'load' });
  await ready(p);
  await p.waitForTimeout(1600);
  await p.mouse.move(720, 300);

  r.fxOn = await p.evaluate(() => document.documentElement.classList.contains('fx'));
  r.heroWordsSettled = await p.$$eval('.word__in', (w) => w.every((x) => new DOMMatrix(getComputedStyle(x).transform).m42 === 0));
  await p.screenshot({ path: `${out}/d-hero.png` });

  // dial
  const needle = () => p.$eval('[data-scroll-dial]', (d) => d.style.getPropertyValue('--scroll'));
  r.dialStart = await needle();

  // logo story: five steps, pinned
  const pinned = (sel) => p.$eval(sel, (s) => Math.round(s.getBoundingClientRect().top));
  r.story = [];
  for (const [i, f] of [0.1, 0.3, 0.5, 0.7, 0.92].entries()) {
    await wheelTo(p, '.story', f);
    r.story.push({
      step: await p.$eval('.story', (s) => s.dataset.activeStep),
      stageTop: await pinned('.story__stage'),
      rail: await p.$eval('.rail__item.is-active', (x) => x.textContent.trim()),
    });
    await p.screenshot({ path: `${out}/d-story-${i}.png` });
  }

  // lightbox still opens from a pinned sheet, and closing keeps the place
  await wheelTo(p, '.story', 0.3);
  const yBefore = await p.evaluate(() => window.scrollY);
  await p.click('.process__item.is-active a');
  await p.waitForTimeout(500);
  r.storyLightbox = await p.evaluate(() => document.querySelector('[data-lightbox-dialog]').open);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  r.storyScrollDriftAfterLightbox = Math.round(Math.abs((await p.evaluate(() => window.scrollY)) - yBefore));

  // meanings
  r.meanings = [];
  for (const [i, f] of [0.15, 0.5, 0.85].entries()) {
    await wheelTo(p, '.meanings', f);
    r.meanings.push({
      step: await p.$eval('.meanings', (s) => s.dataset.activeStep),
      name: await p.$eval('.symbols li.is-active .symbols__name', (x) => x.textContent),
    });
    await p.screenshot({ path: `${out}/d-meaning-${i}.png` });
  }

  // strip moves
  await p.locator('[data-strip]').first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  const stripX = () => p.$eval('[data-strip-track]', (t) => new DOMMatrix(getComputedStyle(t).transform).m41);
  const s1 = await stripX(); await p.waitForTimeout(500); const s2 = await stripX();
  r.stripMoves = s1 !== s2;
  await p.screenshot({ path: `${out}/d-strip.png` });

  // walkthrough opening
  const walkTop = await p.$eval('.walk', (w) => window.scrollY + w.getBoundingClientRect().top);
  await p.evaluate((y) => window.scrollTo({ top: y - 520, behavior: 'instant' }), walkTop);
  await p.waitForTimeout(500);
  r.walkOpenPartway = await p.$eval('.walk', (w) => w.style.getPropertyValue('--open'));
  await p.screenshot({ path: `${out}/d-walk-opening.png` });

  // every mockup gets its turn
  const n = await p.$$eval('.walk__item', (l) => l.length);
  r.walkItems = n;
  r.walk = [];
  for (let i = 0; i < n; i++) {
    await wheelTo(p, '.walk', (i + 0.5) / n);
    const box = await p.$eval('.walk__item.is-active img', (im) => {
      const q = im.getBoundingClientRect();
      return { complete: im.complete && im.naturalWidth > 0, w: Math.round(q.width), h: Math.round(q.height), bottom: Math.round(q.bottom), right: Math.round(q.right) };
    });
    r.walk.push({ title: await p.$eval('.walk__item.is-active .walk__title', (x) => x.textContent), count: await p.textContent('[data-scene-count]'), ...box });
    if (i === 0 || i === 4 || i === n - 1) await p.screenshot({ path: `${out}/d-walk-${i}.png` });
  }

  // lens
  await wheelTo(p, '.walk', 0.5 / n);
  const box = await (await p.$('.walk__item.is-active img')).boundingBox();
  await p.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.35, { steps: 6 });
  await p.waitForTimeout(700);
  r.lens = await p.$eval('[data-lens]', (l) => ({ on: l.classList.contains('is-on'), bg: !!l.firstElementChild.style.backgroundImage }));
  await p.screenshot({ path: `${out}/d-lens.png` });
  await p.mouse.move(40, 500);
  await p.waitForTimeout(300);
  r.lensOffImage = await p.$eval('[data-lens]', (l) => l.classList.contains('is-on'));

  // lightbox can browse all mockups
  await p.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await p.mouse.down(); await p.mouse.up();
  await p.waitForTimeout(500);
  r.walkLightboxCount = await p.textContent('[data-lb-count]');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);

  // keyboard: focusing a later step brings it on screen
  await p.$$eval('.walk__media', (l) => l[5].focus());
  await p.waitForTimeout(900);
  r.keyboardStep = await p.$eval('.walk', (w) => w.dataset.activeStep);

  // leaving the scene and scrolling on
  await p.evaluate(() => document.querySelector('#contact').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(500);
  r.dialAtContact = await needle();
  r.pageHeight = await p.evaluate(() => document.documentElement.scrollHeight);
  r.errorsDesktop = errors;
  await ctx.close();
}

/* ---------- Wide screens: mockups have different shapes, so only one may show at rest ---------- */
r.wide = {};
for (const [w, h] of [[1540, 780], [1920, 1080], [2560, 1300]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load' });
  await ready(p);
  const showing = () => p.$$eval('.walk__item', (l) => l.filter((x) => getComputedStyle(x).opacity !== '0').length);
  const n = await p.$$eval('.walk__item', (l) => l.length);
  const overlaps = [];
  const order = [...Array(n).keys(), ...[...Array(n).keys()].reverse()]; // forward, then back
  for (const i of order) {
    await wheelTo(p, '.walk', (i + 0.5) / n);
    const count = await showing();
    if (count !== 1) overlaps.push({ step: i + 1, count });
    if (w === 1540 && i === 3) await p.screenshot({ path: `${out}/w-cups.png` });
  }
  r.wide[`${w}x${h}`] = overlaps;
  await ctx.close();
}

/* ---------- Header fit ---------- */
r.headerFit = {};
for (const w of [1024, 1180, 1280, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load' });
  r.headerFit[w] = await p.evaluate(() => {
    const bar = document.querySelector('.site-header__bar');
    return { overflow: bar.scrollWidth > bar.clientWidth, dialX: Math.round(document.querySelector('[data-scroll-dial]').getBoundingClientRect().left) };
  });
  await ctx.close();
}

/* ---------- Phone ---------- */
{
  const errors = [];
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  errorsOn(p, errors);
  await p.goto(URL, { waitUntil: 'load' });
  await ready(p);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/m-hero.png` });
  r.phone = await p.evaluate(() => ({
    fx: document.documentElement.classList.contains('fx'),
    overflowX: document.documentElement.scrollWidth > innerWidth,
    height: document.documentElement.scrollHeight,
    primaryLogoShown: getComputedStyle(document.querySelector('.artboard--static')).display !== 'none',
    finalStepHidden: getComputedStyle(document.querySelector('.process__item--final')).display === 'none',
    sheets: document.querySelectorAll('.process__item:not(.process__item--final)').length,
  }));
  await p.evaluate(() => document.querySelector('.walk').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(900);
  await p.$eval('[data-swipe]', (l) => l.scrollTo({ left: l.scrollWidth, behavior: 'instant' }));
  await p.waitForTimeout(600);
  r.phoneSwipeEnd = await p.textContent('[data-scene-count]');
  await p.screenshot({ path: `${out}/m-walk.png` });
  await p.evaluate(() => document.querySelector('.story').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `${out}/m-story.png` });
  r.errorsPhone = errors;
  await ctx.close();
}

/* ---------- Reduced motion on a large screen ---------- */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load' });
  r.reduced = await p.evaluate(() => ({
    fx: document.documentElement.classList.contains('fx'),
    hidden: [...document.querySelectorAll('[data-reveal], [data-stagger] > *, .word__in')].filter((x) => getComputedStyle(x).display !== 'none' && (getComputedStyle(x).opacity !== '1' || getComputedStyle(x).transform !== 'none')).length,
    mockups: [...document.querySelectorAll('.walk__item')].filter((x) => x.getBoundingClientRect().height > 100).length,
  }));
  const a = await p.$eval('[data-strip-track]', (t) => t.style.transform);
  await p.evaluate(() => document.querySelector('[data-strip]').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(500);
  r.reducedStripStill = a === (await p.$eval('[data-strip-track]', (t) => t.style.transform));
  await p.evaluate(() => document.querySelector('.walk').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/r-walk.png` });
  await ctx.close();
}

/* ---------- No JavaScript ---------- */
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load' });
  r.noJs = {
    hidden: await p.$$eval('[data-reveal], [data-stagger] > *, .word__in', (l) => l.filter((x) => getComputedStyle(x).display !== 'none' && getComputedStyle(x).opacity !== '1').length),
    wordsMoved: await p.$$eval('.word__in', (l) => l.filter((x) => getComputedStyle(x).transform !== 'none').length),
    dial: await p.$eval('[data-scroll-dial]', (d) => getComputedStyle(d).display),
    mockups: await p.$$eval('.walk__item', (l) => l.length),
  };
  await ctx.close();
}

console.log(JSON.stringify(r, null, 1));
await b.close();
