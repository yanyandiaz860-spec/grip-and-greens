/**
 * Infinite, continuously moving carousel — content drifts LEFT → RIGHT.
 *
 * How the seamless loop works: the original slides (the accessible set) are
 * cloned twice → [clone][original][clone]. The track is translated by
 * (-setWidth + p). As p grows the content moves right; when p passes one full
 * set width it wraps by exactly setWidth, which is pixel-identical, so there is
 * never a visible jump.
 *
 * • Prev / Next glide by one slide; drag / swipe with mouse or touch.
 * • A drag never opens the lightbox (click suppressed after movement).
 * • Auto-movement pauses on hover, keyboard focus, off-screen, hidden tab,
 *   while dragging, and via the Pause / Play button (WCAG 2.2.2).
 * • prefers-reduced-motion: no automatic movement; buttons jump instantly.
 * • Clones are aria-hidden and untabbable; clicking a clone opens the matching
 *   original in the lightbox (data-lightbox-proxy).
 * • Without JS the track is a normal horizontally scrollable list.
 */
const SPEED = 38; // px per second

export function initCarousels(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]');
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const toggle = root.querySelector<HTMLButtonElement>('[data-carousel-toggle]');
    if (!viewport || !track || !prev || !next) return;

    const originals = [...track.children] as HTMLElement[];
    if (!originals.length) return;

    /* ---------- Build clone sets ---------- */
    const makeClones = () =>
      originals.map((li, i) => {
        const c = li.cloneNode(true) as HTMLElement;
        c.setAttribute('aria-hidden', 'true');
        c.classList.add('is-clone');
        c.removeAttribute('aria-roledescription');
        c.removeAttribute('aria-label');
        c.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
          a.tabIndex = -1;
          a.removeAttribute('data-lightbox');
          a.dataset.lightboxProxy = `${originals[i].querySelector('a')?.dataset.lightbox}:${i}`;
        });
        return c;
      });
    track.prepend(...makeClones());
    track.append(...makeClones());
    root.classList.add('is-enhanced');
    // disable native image/link dragging so pointer drags and clicks behave predictably
    track.querySelectorAll<HTMLElement>('img, a').forEach((el) => (el.draggable = false));
    viewport.addEventListener('dragstart', (e) => e.preventDefault());

    /* ---------- Geometry ---------- */
    let setW = 0;
    let step = 0;
    const measure = () => {
      const first = originals[0];
      const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      setW = originals.reduce((w, li) => w + li.getBoundingClientRect().width + gap, 0);
      step = first.getBoundingClientRect().width + gap;
    };

    let p = 0; // offset; content moves right as p increases
    const wrap = () => {
      if (!setW) return;
      while (p >= setW) p -= setW;
      while (p <= -setW) p += setW;
    };
    const render = () => {
      wrap();
      track.style.transform = `translate3d(${(-setW + p).toFixed(2)}px, 0, 0)`;
    };

    /* ---------- State ---------- */
    let userPaused = reduced.matches;
    let hover = false;
    let focusWithin = false;
    let inView = false;
    let dragging = false;
    let tween: { from: number; to: number; t0: number; dur: number } | null = null;
    const running = () =>
      !userPaused && !hover && !focusWithin && inView && !document.hidden && !reduced.matches && !dragging;

    /* ---------- Animation loop ---------- */
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (tween) {
        const k = Math.min(1, (now - tween.t0) / tween.dur);
        const e = 1 - Math.pow(1 - k, 3);
        p = tween.from + (tween.to - tween.from) * e;
        if (k >= 1) tween = null;
        render();
      } else if (running()) {
        p += SPEED * dt;
        render();
      }
      requestAnimationFrame(frame);
    };

    const glide = (delta: number) => {
      if (reduced.matches) { p += delta; render(); return; }
      tween = { from: p, to: p + delta, t0: performance.now(), dur: 560 };
    };

    // Next = reveal the following post (content shifts left); Prev = the opposite.
    next.addEventListener('click', () => glide(-step));
    prev.addEventListener('click', () => glide(step));

    viewport.addEventListener('keydown', (e) => {
      if (e.target !== viewport) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); glide(-step); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); glide(step); }
    });

    /* ---------- Drag / swipe ---------- */
    let startX = 0;
    let startP = 0;
    let moved = false;
    let pointerId: number | null = null;
    viewport.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startP = p;
      moved = false;
      tween = null;
    });
    viewport.addEventListener('pointermove', (e) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        dragging = true;
        viewport.setPointerCapture(e.pointerId);
        root.classList.add('is-dragging');
      }
      if (moved) { p = startP + dx; render(); }
    });
    const endDrag = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      if (moved) {
        dragging = false;
        root.classList.remove('is-dragging');
        // a drag must never open the lightbox
        const block = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
        viewport.addEventListener('click', block, { capture: true, once: true });
        setTimeout(() => viewport.removeEventListener('click', block, { capture: true }), 50);
      }
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    /* ---------- Pause conditions ---------- */
    const renderToggle = () => {
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', userPaused ? 'Play automatic scrolling' : 'Pause automatic scrolling');
      toggle.dataset.state = userPaused ? 'paused' : 'playing';
    };
    toggle?.addEventListener('click', () => { userPaused = !userPaused; renderToggle(); });
    if (toggle && reduced.matches) toggle.hidden = true;

    viewport.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    viewport.addEventListener('pointerleave', () => { hover = false; });
    root.addEventListener('focusin', (e) => {
      if (e.target === toggle) return;
      focusWithin = true;
      // keep a KEYBOARD-focused original slide fully in view (never on mouse/touch focus,
      // which would move the strip between press and release and swallow the click)
      if (!(e.target as HTMLElement).matches(':focus-visible')) return;
      const li = (e.target as HTMLElement).closest('li');
      const idx = li ? originals.indexOf(li) : -1;
      if (idx >= 0) {
        const k = originals.slice(0, idx).reduce((w, el) => w + el.getBoundingClientRect().width, 0) +
          idx * (parseFloat(getComputedStyle(track).columnGap || '0') || 0);
        tween = null;
        p = 8 - k;
        render();
      }
    });
    root.addEventListener('focusout', (e) => {
      if (!root.contains(e.relatedTarget as Node)) focusWithin = false;
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) { userPaused = true; if (toggle) toggle.hidden = true; }
      renderToggle();
    });
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: 0.1 }).observe(root);

    /* ---------- Start ---------- */
    const relayout = () => { measure(); render(); };
    relayout();
    window.addEventListener('resize', relayout, { passive: true });
    track.querySelectorAll('img').forEach((img) => { if (!img.complete) img.addEventListener('load', relayout, { once: true }); });
    renderToggle();
    requestAnimationFrame(frame);
  });
}
