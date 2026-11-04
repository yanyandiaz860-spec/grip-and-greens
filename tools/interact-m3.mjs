// M3 interaction checks: lightbox, carousel loop, demo form, plan prefill.
// Usage: node tools/interact-m3.mjs <outDir>
import { chromium } from '@playwright/test';

const out = process.argv[2] ?? '.';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
let posts = 0;
p.on('request', (req) => { if (req.method() !== 'GET') posts++; });

await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
const r = {};

// Lightbox via keyboard
await p.locator('#logo a[data-lightbox]').first().focus();
await p.keyboard.press('Enter');
await p.waitForTimeout(400);
r.lbOpen = await p.evaluate(() => document.querySelector('[data-lightbox-dialog]').open);
r.lbTitle1 = await p.textContent('[data-lb-title]');
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(500);
r.lbTitle2 = await p.textContent('[data-lb-title]');
r.lbCount = await p.textContent('[data-lb-count]');
await p.screenshot({ path: `${out}/lightbox.png` });
await p.keyboard.press('Escape');
await p.waitForTimeout(200);
r.lbClosed = await p.evaluate(() => !document.querySelector('[data-lightbox-dialog]').open);
r.focusReturned = await p.evaluate(() => !!document.activeElement?.matches('#logo a[data-lightbox]'));

// Carousel: loops from last back to first, and prev from first goes to last
await p.locator('#brand-post [data-carousel]').scrollIntoViewIfNeeded();
const pos = () => p.$eval('[data-carousel-track]', (t) => Math.round(t.scrollLeft));
const positions = [];
for (let i = 0; i < 5; i++) { await p.click('[data-carousel-next]'); await p.waitForTimeout(700); positions.push(await pos()); }
r.carouselNextPositions = positions;
await p.click('[data-carousel-prev]');
await p.waitForTimeout(700);
r.carouselAfterPrev = await pos();
r.toggleState = await p.getAttribute('[data-carousel-toggle]', 'data-state');

// Plan prefill from membership card
await p.click('#membership a[data-plan="premium"]');
await p.waitForTimeout(800);
r.planPrefill = await p.$eval('#f-plan', (s) => s.value);

// Empty submit -> error summary
await p.click('[data-demo-form] [type=submit]');
await p.waitForTimeout(250);
r.summaryVisible = await p.isVisible('[data-error-summary]');
r.summaryItems = await p.$$eval('[data-error-summary] li', (l) => l.map((x) => x.textContent));
r.focusOnSummary = await p.evaluate(() => !!document.activeElement?.hasAttribute('data-error-summary'));
await p.locator('#contact .contact__card').screenshot({ path: `${out}/form-errors.png` });

// Invalid values, then valid values
await p.fill('#f-name', 'Juan Dela Cruz');
await p.fill('#f-email', 'juan@example');
await p.fill('#f-phone', '12345');
await p.fill('#f-message', 'Hi!');
await p.click('[data-demo-form] [type=submit]');
await p.waitForTimeout(250);
r.errorsAfterInvalid = await p.$$eval('[data-error-summary] li', (l) => l.length);
await p.fill('#f-email', 'juan@example.com');
await p.fill('#f-phone', '0917 123 4567');
await p.fill('#f-message', 'I would like to know more about the Premium plan.');
await p.click('[data-demo-form] [type=submit]');
await p.waitForTimeout(300);
r.successVisible = await p.isVisible('[data-form-success]');
r.successText = (await p.textContent('[data-form-success]')).replace(/\s+/g, ' ').trim();
await p.locator('#contact .contact__card').screenshot({ path: `${out}/form-success.png` });

r.nonGetRequests = posts;
r.errors = errors;
console.log(JSON.stringify(r, null, 1));
await b.close();
