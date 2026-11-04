/**
 * Self-playing crossfade slideshows for the Brand Applications mockup cards.
 * • Only the visible slide is focusable and exposed to screen readers.
 * • Auto-advance pauses on mouse hover, keyboard focus, off-screen, hidden tab,
 *   while the lightbox is open, and via the Pause / Play button (WCAG 2.2.2).
 * • prefers-reduced-motion: never auto-advances; the dots still work.
 */
const INTERVAL = 4200;

export function initSlideshows(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-slideshow]').forEach((root) => {
    const slides = [...root.querySelectorAll<HTMLAnchorElement>('[data-slide]')];
    const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-slide-dot]')];
    const toggle = root.querySelector<HTMLButtonElement>('[data-slide-toggle]');
    if (slides.length < 2) return;

    let index = 0;
    let userPaused = false;
    let hover = false;
    let keyboardFocus = false;
    let inView = false;

    const show = (i: number) => {
      const wasFocused = slides[index] === document.activeElement;
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const on = n === index;
        s.classList.toggle('is-active', on);
        s.tabIndex = on ? 0 : -1;
        if (on) s.removeAttribute('aria-hidden');
        else s.setAttribute('aria-hidden', 'true');
      });
      dots.forEach((d, n) => {
        if (n === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      if (wasFocused) slides[index].focus({ preventScroll: true });
    };

    const running = () =>
      !userPaused && !hover && !keyboardFocus && inView && !document.hidden && !reduced.matches &&
      !document.querySelector('dialog[open]');

    window.setTimeout(() => {
      window.setInterval(() => { if (running()) show(index + 1); }, INTERVAL);
    }, Number(root.dataset.offset) || 0);

    dots.forEach((d, n) => d.addEventListener('click', () => show(n)));

    const label = toggle?.getAttribute('aria-label')?.replace(/^Pause /, '') ?? 'slideshow';
    const renderToggle = () => {
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', `${userPaused ? 'Play' : 'Pause'} ${label}`);
      toggle.dataset.state = userPaused ? 'paused' : 'playing';
    };
    toggle?.addEventListener('click', () => { userPaused = !userPaused; renderToggle(); });
    if (toggle) toggle.hidden = reduced.matches;
    reduced.addEventListener('change', () => { if (toggle) toggle.hidden = reduced.matches; });

    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    root.addEventListener('pointerleave', () => { hover = false; });
    root.addEventListener('focusin', (e) => {
      const t = e.target as HTMLElement;
      if (t !== toggle && t.matches(':focus-visible')) keyboardFocus = true;
    });
    root.addEventListener('focusout', (e) => {
      if (!root.contains(e.relatedTarget as Node)) keyboardFocus = false;
    });
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: 0.25 }).observe(root);

    renderToggle();
  });
}
