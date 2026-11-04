/**
 * Scroll-triggered motion system (IntersectionObserver + CSS transitions on
 * transform/opacity/clip-path only — no scroll hijacking, no layout work).
 *
 * Markup:
 *   data-reveal="up | left | right | scale | fade | clip"   animate the element itself
 *   data-stagger                                            animate direct children in sequence
 *
 * • Elements animate when they enter the viewport, scrolling DOWN or UP.
 * • When an element fully leaves the viewport it is reset, remembering whether it
 *   left above or below, so a re-entry slides in from the correct side.
 * • Reduced motion: everything is shown immediately, no movement.
 * • Starts after the loader finishes (event `gg:ready`), so the hero entrance is seen.
 */
const SELECTOR = '[data-reveal], [data-stagger]';

export function initMotion(): void {
  const root = document.documentElement;
  root.dataset.motion = 'on'; // tells the loader's safety net that motion started

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const items = [...document.querySelectorAll<HTMLElement>(SELECTOR)];

  // Stagger indexes (capped so long lists don't lag behind the scroll)
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset.stagger) || 70;
    [...group.children].forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--stagger', `${Math.min(i, 8) * step}ms`);
    });
  });

  const showAll = () => items.forEach((el) => el.classList.add('is-visible'));

  if (reduced.matches || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }
  reduced.addEventListener('change', () => reduced.matches && showAll());

  const start = () => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const el = en.target as HTMLElement;
          if (en.isIntersecting) {
            el.classList.add('is-visible');
          } else if (el.classList.contains('is-visible')) {
            // fully out of view → reset, and remember which side it left from
            el.dataset.from = en.boundingClientRect.top < 0 ? 'above' : 'below';
            el.classList.remove('is-visible');
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' },
    );
    items.forEach((el) => io.observe(el));
    initParallax();
  };

  if (root.dataset.ready === '1') start();
  else document.addEventListener('gg:ready', start, { once: true });
}

/** Light parallax for elements with data-parallax="<factor>" (uses the CSS `translate` property). */
function initParallax(): void {
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length) return;
  let ticking = false;
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? visible.add(en.target as HTMLElement) : visible.delete(en.target as HTMLElement)));
  });
  els.forEach((el) => io.observe(el));

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    visible.forEach((el) => {
      const r = el.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 around the viewport centre
      const factor = Number(el.dataset.parallax) || 0.05;
      el.style.translate = `0 ${(progress * factor * 100).toFixed(2)}px`;
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
