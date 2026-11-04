/**
 * PALETTES & TYPOGRAPHY SPECS
 * All HEX values were pixel-sampled from the original files on 2026-11-04 and
 * font names were identified visually. Both are ESTIMATES, not verified source values.
 */
export interface Swatch {
  name: string;
  hex: string;
  role: string;
  /** true when the swatch text should be light */
  dark?: boolean;
}

export interface TypeSpec {
  family: string;
  usage: string;
  sample: string;
  /** CSS font stack used to render the specimen on the site (closest available) */
  css: string;
  weight?: number;
  tracking?: string;
  upper?: boolean;
  /** Relative sample size (1 = default) */
  scale?: number;
}

/* ---------- Logo ---------- */
export const logoPalette: Swatch[] = [
  { name: 'Brand Green', hex: '#2E7D32', role: 'Ampersand, divider & tagline rules', dark: true },
  { name: 'Ink Charcoal', hex: '#1F1F1F', role: 'Wordmark letters', dark: true },
  { name: 'Ring Slate', hex: '#2C3135', role: 'Icon g & dial ring', dark: true },
  { name: 'Leaf Olive', hex: '#3D5E2C', role: 'Leaf fill', dark: true },
  { name: 'Earth Brown', hex: '#5D422F', role: 'Tagline text', dark: true },
  { name: 'Dial Cream', hex: '#DED4CA', role: 'Scale dial face' },
];

export const logoType: TypeSpec[] = [
  { family: 'Bebas Neue', usage: 'Wordmark — GRIP & GREENS', sample: 'GRIP & GREENS', css: 'var(--font-display)', upper: true, tracking: '0.02em' },
  { family: 'Open Sans', usage: 'Tagline — wide letter-spacing', sample: 'TRAIN . EAT . THRIVE.', css: 'var(--font-specimen-opensans)', weight: 400, tracking: '0.3em', upper: true, scale: 0.62 },
];

/* ---------- First brand post ---------- */
export const postPalette: Swatch[] = [
  { name: 'Gym Black', hex: '#000000', role: 'Background & shadows', dark: true },
  { name: 'Post Green', hex: '#369C3C', role: '“EAT” and the opening line', dark: true },
  { name: 'Glow Green', hex: '#36FC12', role: 'Button outline glow' },
  { name: 'Pure White', hex: '#FFFFFF', role: 'Headline & body text' },
];

export const postType: TypeSpec[] = [
  { family: 'Bebas Neue (distressed texture)', usage: 'Headline — TRAIN EAT THRIVE', sample: 'TRAIN EAT THRIVE', css: 'var(--font-display)', upper: true, tracking: '0.04em' },
  { family: 'Bebas Neue', usage: 'Body copy', sample: 'Begin your journey with Grip & Greens', css: 'var(--font-display)', upper: true, tracking: '0.04em' },
  { family: 'Montserrat Bold', usage: 'Button & footer details', sample: 'JOIN US NOW →', css: 'var(--font-specimen-montserrat)', weight: 700, tracking: '0.14em', upper: true },
];

/* ---------- Main promotional poster ---------- */
export const promoPalette: Swatch[] = [
  { name: 'Night Black', hex: '#000000', role: 'Background', dark: true },
  { name: 'Neon Green', hex: '#72E472', role: '“GRAND”, event details' },
  { name: 'Mint Mist', hex: '#DEEADE', role: '“50% off” offer text' },
  { name: 'Pure White', hex: '#FFFFFF', role: '“OPENING”, labels' },
];

export const promoType: TypeSpec[] = [
  { family: 'Montserrat Black', usage: 'Headline — GRAND OPENING', sample: 'GRAND OPENING', css: 'var(--font-specimen-montserrat)', weight: 900, upper: true, tracking: '-0.01em' },
  { family: 'Montserrat SemiBold', usage: 'Event details', sample: 'October 18, 2026 · 08:00 AM', css: 'var(--font-specimen-montserrat)', weight: 600 },
  { family: 'Archivo Black', usage: 'Offer — 50% off MEMBERSHIP', sample: '50% off', css: 'var(--font-specimen-archivo)', weight: 400 },
];

/* ---------- First brand post caption (Facebook artifacts removed) ---------- */
export const firstPostCaption = {
  headline: 'TRAIN. EAT. THRIVE.',
  paragraphs: [
    'Welcome to Grip & Greens — where fitness meets good food and great energy.',
    'We believe getting stronger isn’t just about how hard you train. It’s also about fueling your body. From workouts to protein shakes and nourishing food, we’re here to help you build better habits and become a stronger version of yourself.',
    'Train hard. Eat well. Thrive.',
    '💚 Follow @grip&greens and join us on the journey!',
  ],
  hashtags: ['#GripAndGreens', '#TrainEatThrive', '#HealthandWellness', '#FitnessJourney'],
  signature: ['Grip & Greens', 'Buenaventura, John Eidref C.', 'Diaz, Ricky Yan F.', 'Polinar, Mark Francis A.', 'Venus, Areown Dapne E.'],
} as const;
