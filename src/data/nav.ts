/** Single-page anchor navigation, grouped by the page's two halves. */
export const navGroups = [
  {
    label: 'The Business',
    links: [
      { href: '#story', label: 'Concept' },
      { href: '#gym', label: 'Gym' },
      { href: '#cafe', label: 'Café' },
      { href: '#membership', label: 'Plans' },
      { href: '#owners', label: 'Owners' },
    ],
  },
  {
    label: 'Brand Portfolio',
    links: [
      { href: '#logo', label: 'Logo' },
      { href: '#brand-post', label: 'Brand Post' },
      { href: '#posters', label: 'Posters' },
      { href: '#applications', label: 'Applications' },
    ],
  },
] as const;

export const contactLink = { href: '#contact', label: 'Contact' } as const;
