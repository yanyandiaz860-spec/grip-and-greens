/**
 * Scroll-driven effects, on one shared scroll/resize pass. No library, no scroll hijacking:
 * pinning is plain `position: sticky`, this file only reports how far along it is.
 *
 * • Scenes    `[data-scene]` wraps a sticky `[data-scene-stage]` holding `[data-step]` items.
 *             The current step gets `.is-active`, earlier ones `.is-past`. The scene gets
 *             `data-active-step` and `--lp` (0–1 progress inside the step), and `--open`
 *             (0–1) when it has `data-scene-opens`.
 * • Dial      `[data-scroll-dial]` receives `--scroll` (0–1 through the page).
 * • Strips    `[data-strip]` loop sideways and speed up with scrolling.
 * • Lens      `[data-lens]` magnifies the active mockup in `[data-lens-area]`.
 *
 * `html.fx` turns the pinned layouts on. It is only set on large screens without
 * reduced motion, so phones, reduced motion and no-JS all get the plain static layout.
 */
const FX_QUERY = '(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)';
const LENS_ZOOM = 2;

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

interface Scene {
  root: HTMLElement;
  stage: HTMLElement;
  steps: HTMLElement[];
  rail: HTMLElement[];
  count: HTMLElement | null;
  opens: boolean;
  active: number;
  warmed: number;
}

export function initScrollFx(): void {
  const html = document.documentElement;
  const fx = window.matchMedia(FX_QUERY);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const scenes: Scene[] = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map((root) => ({
    root,
    stage: root.querySelector<HTMLElement>('[data-scene-stage]')!,
    steps: [...root.querySelectorAll<HTMLElement>('[data-step]')],
    rail: [...root.querySelectorAll<HTMLElement>('[data-rail] > *')],
    count: root.querySelector<HTMLElement>('[data-scene-count]'),
    opens: 'sceneOpens' in root.dataset,
    active: -1,
    warmed: -1,
  }));

  /* Fetch the coming steps ahead of time, so they never wipe in empty.
     Only once the scene is close, so nothing extra loads with the page. */
  const warm = (scene: Scene, i: number) => {
    if (i <= scene.warmed) return;
    scene.warmed = i;
    [i, i + 1, i + 2].forEach((n) => {
      const step = scene.steps[n];
      step?.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
      const link = step?.querySelector<HTMLAnchorElement>('a[data-lightbox]');
      if (link && 'lensArea' in scene.root.dataset && n <= i + 1) new Image().src = link.href;
    });
  };

  const setActive = (scene: Scene, i: number) => {
    scene.active = i;
    scene.root.dataset.activeStep = String(i);
    scene.steps.forEach((s, n) => {
      s.classList.toggle('is-active', n === i);
      s.classList.toggle('is-past', n < i);
    });
    scene.rail.forEach((r, n) => {
      r.classList.toggle('is-active', n === i);
      r.classList.toggle('is-past', n < i);
    });
    if (scene.count) scene.count.textContent = String(i + 1).padStart(2, '0');
  };

  const stickyTop = (scene: Scene) => parseFloat(getComputedStyle(scene.stage).top) || 0;

  const updateScene = (scene: Scene) => {
    const rect = scene.root.getBoundingClientRect();
    const top = stickyTop(scene);
    const range = rect.height - scene.stage.offsetHeight;
    const n = scene.steps.length;
    if (range <= 0 || !n) return;
    const position = clamp((top - rect.top) / range) * n;
    const active = Math.min(n - 1, Math.floor(position));
    scene.root.style.setProperty('--lp', (position - active).toFixed(3));
    scene.root.style.setProperty('--p', ((active + 1) / n).toFixed(3));
    if (scene.opens) {
      // The stage grows from a card to the full screen as it rises into place
      const open = clamp(1 - (rect.top - top) / (window.innerHeight * 0.75));
      scene.root.style.setProperty('--open', open.toFixed(3));
    }
    if (active !== scene.active) setActive(scene, active);
    if (rect.top < window.innerHeight * 2.5 && rect.bottom > 0) warm(scene, active);
  };

  /* Keyboard: tabbing to a hidden step scrolls the page to that step */
  scenes.forEach((scene) => {
    scene.root.addEventListener('focusin', (e) => {
      if (!fx.matches) return;
      const i = scene.steps.findIndex((s) => s.contains(e.target as Node));
      if (i < 0 || i === scene.active) return;
      const rect = scene.root.getBoundingClientRect();
      const range = rect.height - scene.stage.offsetHeight;
      const y = window.scrollY + rect.top - stickyTop(scene) + ((i + 0.5) / scene.steps.length) * range;
      window.scrollTo({ top: y, behavior: 'instant' });
    });
  });

  const applyMode = () => {
    html.classList.toggle('fx', fx.matches);
    scenes.forEach((scene) => {
      scene.active = -1;
      if (!fx.matches) {
        scene.steps.concat(scene.rail).forEach((s) => s.classList.remove('is-active', 'is-past'));
        delete scene.root.dataset.activeStep;
        ['--lp', '--p', '--open'].forEach((v) => scene.root.style.removeProperty(v));
      }
    });
  };

  /* Dial */
  const dial = document.querySelector<HTMLElement>('[data-scroll-dial]');
  const updateDial = () => {
    const max = html.scrollHeight - window.innerHeight;
    dial?.style.setProperty('--scroll', (max > 0 ? clamp(window.scrollY / max) : 0).toFixed(4));
  };

  /* Text strips */
  const strips = initStrips(reduced);

  /* Lens */
  const lens = initLens(fx);

  /* Phone / static swipe row: keeps the counter and bar in step with the swipe */
  initSwipeCounters(fx);

  let ticking = false;
  let lastY = window.scrollY;
  const frame = () => {
    ticking = false;
    if (fx.matches) scenes.forEach(updateScene);
    updateDial();
    lens.refresh();
  };
  const request = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  };

  window.addEventListener('scroll', () => {
    strips.nudge(Math.abs(window.scrollY - lastY));
    lastY = window.scrollY;
    request();
  }, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  fx.addEventListener('change', () => { applyMode(); request(); });

  applyMode();
  frame();

  // The pinned scenes change the page height, so a link straight to a section must land again
  if (fx.matches && location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' });
}

/** Endless sideways loop. Runs only while a strip is on screen. */
function initStrips(reduced: MediaQueryList) {
  const strips = [...document.querySelectorAll<HTMLElement>('[data-strip]')].map((el) => ({
    el,
    track: el.querySelector<HTMLElement>('[data-strip-track]')!,
    group: el.querySelector<HTMLElement>('[data-strip-group]')!,
    direction: el.dataset.strip === 'reverse' ? 1 : -1,
    x: 0,
    visible: false,
  }));

  const BASE_SPEED = 70; // px per second
  const MAX_BOOST = 900;
  let boost = 0;
  let last = 0;
  let running = false;

  const loop = (now: number) => {
    const dt = Math.min(64, now - last) / 1000;
    last = now;
    boost *= 0.93;
    strips.forEach((s) => {
      if (!s.visible) return;
      const width = s.group.offsetWidth;
      if (!width) return;
      s.x = (s.x + s.direction * (BASE_SPEED + boost) * dt) % width;
      if (s.x > 0) s.x -= width;
      s.track.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`;
    });
    if (strips.some((s) => s.visible) && !reduced.matches) requestAnimationFrame(loop);
    else running = false;
  };
  const start = () => {
    if (running || reduced.matches) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const strip = strips.find((s) => s.el === en.target);
      if (strip) strip.visible = en.isIntersecting;
    });
    if (strips.some((s) => s.visible)) start();
  });
  strips.forEach((s) => io.observe(s.el));

  return { nudge: (delta: number) => { boost = Math.min(MAX_BOOST, boost + delta * 4); } };
}

/** Round magnifier with the brand's dial ring, for mouse users in the pinned walkthrough. */
function initLens(fx: MediaQueryList) {
  const lens = document.querySelector<HTMLElement>('[data-lens]');
  const glass = lens?.querySelector<HTMLElement>('[data-lens-glass]');
  const area = document.querySelector<HTMLElement>('[data-lens-area]');
  if (!lens || !glass || !area) return { refresh: () => {} };

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  let x = 0;
  let y = 0;
  let inside = false;
  let current = '';

  const refresh = () => {
    if (!inside) return;
    const link = area.querySelector<HTMLAnchorElement>('.is-active a[data-lightbox]');
    const rect = link?.querySelector('img')?.getBoundingClientRect();
    const on = !!rect && fx.matches && fine.matches && !document.querySelector('dialog[open]') &&
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    lens.classList.toggle('is-on', on);
    area.classList.toggle('is-lens', on);
    if (!on || !link || !rect) return;

    const size = lens.offsetWidth;
    if (current !== link.href) {
      current = link.href;
      glass.style.backgroundImage = `url("${link.href}")`;
    }
    lens.style.translate = `${x}px ${y}px`;
    lens.style.setProperty('--needle', `${(-150 + 300 * clamp((x - rect.left) / rect.width)).toFixed(1)}deg`);
    glass.style.backgroundSize = `${rect.width * LENS_ZOOM}px ${rect.height * LENS_ZOOM}px`;
    glass.style.backgroundPosition =
      `${size / 2 - (x - rect.left) * LENS_ZOOM}px ${size / 2 - (y - rect.top) * LENS_ZOOM}px`;
  };

  const hide = () => {
    inside = false;
    lens.classList.remove('is-on');
    area.classList.remove('is-lens');
  };

  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    inside = true;
    x = e.clientX;
    y = e.clientY;
    refresh();
  });
  area.addEventListener('pointerleave', hide);
  area.addEventListener('click', hide);

  return { refresh };
}

/** In the static layout the mockups are a swipe row: report which one is showing. */
function initSwipeCounters(fx: MediaQueryList) {
  document.querySelectorAll<HTMLElement>('[data-swipe]').forEach((list) => {
    const scene = list.closest<HTMLElement>('[data-scene]');
    const count = scene?.querySelector<HTMLElement>('[data-scene-count]');
    const items = [...list.children] as HTMLElement[];
    if (!scene || !count || !items.length) return;

    const update = () => {
      if (fx.matches) return;
      const max = list.scrollWidth - list.clientWidth;
      const progress = max > 0 ? clamp(list.scrollLeft / max) : 0;
      const i = Math.round(progress * (items.length - 1));
      count.textContent = String(i + 1).padStart(2, '0');
      scene.style.setProperty('--p', ((i + 1) / items.length).toFixed(3));
    };
    list.addEventListener('scroll', update, { passive: true });
    update();
  });
}
