/**
 * Accessible tabs (WAI-ARIA Tabs pattern, automatic activation).
 * ←/→ move between tabs, Home/End jump to first/last.
 * Without JS every panel is shown in sequence (see Cafe.astro styles).
 */
export function initTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
    if (!tabs.length) return;

    const select = (index: number, focus = true) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].classList.toggle('is-active', on);
        panels[i].hidden = !on;
      });
      if (focus) {
        tabs[index].focus();
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    select(Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')), false);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', (e) => {
        let next = -1;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next >= 0) {
          e.preventDefault();
          select(next);
        }
      });
    });
  });
}
