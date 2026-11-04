/**
 * Header behaviour: scrolled state, mobile menu (focus-contained, Esc to close),
 * and active-section highlighting.
 */
export function initNav(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const page = document.querySelectorAll<HTMLElement>('main, footer');
  if (!header || !toggle || !menu) return;

  /* Scrolled state */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const mq = window.matchMedia('(max-width: 1179px)');
  const focusables = () =>
    [toggle, ...menu.querySelectorAll<HTMLElement>('a[href], button')].filter((el) => el.offsetParent !== null);

  const setOpen = (open: boolean, restoreFocus = true) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__text')!.textContent = open ? 'Close' : 'Menu';
    menu.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    page.forEach((el) => (open ? el.setAttribute('inert', '') : el.removeAttribute('inert')));
    if (open) menu.querySelector<HTMLElement>('a')?.focus();
    else if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a') && mq.matches) setOpen(false, false);
  });

  document.addEventListener('keydown', (e) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  mq.addEventListener('change', () => {
    if (!mq.matches && menu.classList.contains('is-open')) setOpen(false, false);
  });

  /* Active section highlighting */
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const byId = new Map(links.map((a) => [a.getAttribute('href')!.slice(1), a]));
  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id);
        const current = sections.find((s) => visible.has(s.id));
        links.forEach((a) => a.removeAttribute('aria-current'));
        if (current) byId.get(current.id)?.setAttribute('aria-current', 'true');
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }
}
