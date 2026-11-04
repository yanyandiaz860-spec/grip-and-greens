import { chromium } from '@playwright/test';
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await p.click('[data-menu-toggle]');
await p.waitForTimeout(350);
await p.screenshot({ path: `${out}/phone-menu-open.png` });
const focused = await p.evaluate(() => document.activeElement?.textContent?.trim());
await p.keyboard.press('Escape');
const afterEsc = await p.evaluate(() => ({ expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'), focus: document.activeElement?.hasAttribute('data-menu-toggle'), inert: document.querySelector('main').hasAttribute('inert') }));
// tabs keyboard
await p.focus('#tab-muscle-gain');
await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
const tabs = await p.evaluate(() => ({ selected: document.querySelector('[role=tab][aria-selected=true]').id, focus: document.activeElement.id, visible: [...document.querySelectorAll('[role=tabpanel]')].filter(x=>!x.hidden).map(x=>x.id) }));
await p.locator('#cafe .menu').screenshot({ path: `${out}/phone-menu-drinks.png` });
console.log({ focused, afterEsc, tabs });
await b.close();
