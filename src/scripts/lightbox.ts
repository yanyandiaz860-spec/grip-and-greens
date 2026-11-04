/**
 * Lightbox for original artwork.
 * - Native <dialog> (modal): focus is contained, background is inert, Esc closes.
 * - ←/→ browse items in the same `data-lightbox` group; swipe on touch.
 * - Focus returns to the image that opened it.
 * - Images are never shown larger than their native/generated width.
 * Without JS, each trigger is a plain link to the large image.
 */
interface Item {
  href: string;
  title: string;
  detail: string;
  alt: string;
  w: number;
  h: number;
  trigger: HTMLAnchorElement;
}

export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const title = dialog.querySelector<HTMLElement>('[data-lb-title]')!;
  const detail = dialog.querySelector<HTMLElement>('[data-lb-detail]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lb-count]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;

  let items: Item[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;

  const collect = (group: string): Item[] =>
    [...document.querySelectorAll<HTMLAnchorElement>(`a[data-lightbox="${CSS.escape(group)}"]`)].map((a) => ({
      href: a.href,
      title: a.dataset.lightboxTitle ?? '',
      detail: a.dataset.lightboxDetail ?? '',
      alt: a.dataset.lightboxAlt ?? '',
      w: Number(a.dataset.lightboxW) || 0,
      h: Number(a.dataset.lightboxH) || 0,
      trigger: a,
    }));

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const it = items[index];
    img.classList.remove('is-loaded');
    img.onload = () => img.classList.add('is-loaded');
    img.src = it.href;
    img.alt = it.alt;
    if (it.w) {
      img.width = it.w;
      img.height = it.h;
      img.style.maxWidth = `min(${it.w}px, 92vw)`;
    }
    title.textContent = it.title;
    detail.textContent = it.detail;
    detail.hidden = !it.detail;
    dialog.classList.toggle('has-detail', !!it.detail);
    count.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
    const multi = items.length > 1;
    prev.hidden = !multi;
    next.hidden = !multi;
    // preload neighbour
    if (multi) new Image().src = items[(index + 1) % items.length].href;
  };

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-lightbox], a[data-lightbox-proxy]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    opener = a;
    if (a.dataset.lightboxProxy) {
      // carousel clone → open the matching original
      const [group, i] = a.dataset.lightboxProxy.split(':');
      items = collect(group);
      show(Number(i) || 0);
    } else {
      items = collect(a.dataset.lightbox!);
      show(Math.max(0, items.findIndex((x) => x.trigger === a)));
    }
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    close.focus();
  });

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (e) => {
    if (items.length < 2) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });

  // click on backdrop (outside the figure) closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as HTMLElement).hasAttribute('data-lb-stage')) dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    img.removeAttribute('src');
    opener?.focus();
  });

  // swipe
  let x0: number | null = null;
  dialog.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  dialog.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50 && items.length > 1) show(index + (dx < 0 ? 1 : -1));
  });
}
