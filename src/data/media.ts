/**
 * GRIP & GREENS — CENTRAL MEDIA REGISTRY
 * ------------------------------------------------------------
 * Single source of truth for every image on the page.
 *
 * 1) `art`   — ORIGINAL submitted artwork (logos, process sheets, posts, posters,
 *              owner photos). Byte-identical copies live in src/assets/originals/.
 *              Never edited; Astro only generates optimized derivatives at build.
 *
 * 2) `slots` — REPLACEABLE media containers for images not supplied yet
 *              (gym, café, menu, memberships).
 *              Zero-code swap: save a file as  src/media/<folder>/<name>.<ext>
 *              (jpg, jpeg, png, webp or avif — any letter case) and rebuild.
 *              If no file exists, a labeled placeholder is rendered instead.
 *
 * 3) `mockupGallery()` — the team's signage, stationery and packaging mockups,
 *              which feed the slideshows in Brand Applications.
 *
 * See ASSET_MAP.md for the full slot list.
 */
import type { ImageMetadata } from 'astro';

/* ---------- Original artwork imports ---------- */
import logoPrimary from '@/assets/originals/logos/primary-logo.png';
import logoSecondary from '@/assets/originals/logos/secondary-logo.png';
import logoIcon from '@/assets/originals/logos/icon-only-logo.png';

import process01 from '@/assets/originals/logo-process/01-icon-exploration.webp';
import process02 from '@/assets/originals/logo-process/02-wordmark-exploration.webp';
import process03 from '@/assets/originals/logo-process/03-combined-mark.webp';
import process04 from '@/assets/originals/logo-process/04-final-sketch.webp';

import post01 from '@/assets/originals/brand-posts/brand-post-01-train-eat-thrive.png';
import post02 from '@/assets/originals/brand-posts/brand-post-02.png';
import post03 from '@/assets/originals/brand-posts/brand-post-03.png';
import post04 from '@/assets/originals/brand-posts/brand-post-04.png';
import post05 from '@/assets/originals/brand-posts/brand-post-05.png';

import promo01 from '@/assets/originals/promotional-posters/promo-01-grand-opening.png';
import promo02 from '@/assets/originals/promotional-posters/promo-02.png';
import promo03 from '@/assets/originals/promotional-posters/promo-03.png';

import brandMockup01 from '@/assets/originals/brand-applications/promo-04.png';

import owner01 from '@/assets/originals/owners/owner-photo-01.png';
import owner02 from '@/assets/originals/owners/owner-photo-02.png';
import owner03 from '@/assets/originals/owners/owner-photo-03.png';
import owner04 from '@/assets/originals/owners/owner-photo-04.png';

export interface ArtItem {
  src: ImageMetadata;
  alt: string;
  /** Short visible caption / title. */
  title: string;
  /**
   * Max CSS display width in px. Used for low-resolution originals so they are
   * never stretched far beyond their native size. Omit for full-size assets.
   */
  maxDisplay?: number;
}

/* To swap in a higher-resolution version later: replace the import above with the
   new file and remove `maxDisplay`. Nothing else needs to change. */
export const art = {
  /* Logos */
  'logo.primary': {
    src: logoPrimary,
    title: 'Primary logo',
    alt: 'Grip & Greens primary logo: a lowercase g whose bowl holds a scale dial and a green leaf, a thin green divider, the words GRIP & GREENS with a green ampersand, and the tagline Train. Eat. Thrive. between two green rules.',
  },
  'logo.secondary': {
    src: logoSecondary,
    title: 'Secondary logo',
    alt: 'Grip & Greens secondary logo: a wide flowing g mark joined to the scale-dial-and-leaf circle, above a letter-spaced GRIP & GREENS wordmark and the Train. Eat. Thrive. tagline.',
  },
  'logo.icon': {
    src: logoIcon,
    title: 'Icon-only logo',
    alt: 'Grip & Greens icon: a hand-drawn lowercase g in charcoal whose upper bowl is a scale dial split by a green leaf.',
  },

  /* Logo process — fixed order 01 → 04 */
  'process.01': {
    src: process01,
    title: '01 · Icon Exploration',
    alt: 'Logo process sheet, Concept 01 Icon Exploration: twelve pencil thumbnail sketches of a g combined with a scale dial and leaf, a refined annotated sketch, detail studies of the dial, leaf and letter g, and five cleaner refinements.',
  },
  'process.02': {
    src: process02,
    title: '02 · Wordmark & Lockup Exploration',
    alt: 'Logo process sheet, Concept 02 Wordmark and Lockup Exploration: six GRIP & GREENS wordmark styles, five ampersand studies with the custom curved one marked as preferred, four lockup arrangements and four tagline divider treatments.',
  },
  'process.03': {
    src: process03,
    title: '03 · Combined Mark Development',
    alt: 'Logo process sheet, Concept 03 Combined Mark Development: idea explorations, the refined horizontal lockup with notes on the green ampersand and tagline rules, icon construction circles, wordmark grid, clear-space diagram and alternate lockups.',
  },
  'process.04': {
    src: process04,
    title: '04 · Final Sketch',
    alt: 'Logo process sheet, Concept 04 Final Sketch on cream paper: the hero icon sketch with annotations for the scale dial, leaf and lowercase g, detail explorations, pencil palette swatches of charcoal black, natural green and soft white, and the final lockup sketch.',
  },

  /* First ever brand post + supporting posts */
  'post.01': {
    src: post01,
    title: 'First brand post — Train. Eat. Thrive.',
    alt: 'First Grip & Greens brand post: dark gym background with large distressed white and green text reading TRAIN EAT THRIVE, an athlete stretching, a branded black shaker, a green protein shake bottle and a fresh salad, the line Begin your journey with Grip & Greens, and a Join Us Now button.',
  },
  'post.02': {
    src: post02,
    title: 'Supporting post 02',
    maxDisplay: 480,
    alt: 'Grip & Greens post: dark flat-lay with the GRIP & GREENS wordmark and tagline, a bowl of greens, chicken, sweet potato and avocado, dumbbells, a water bottle and a notebook printed with the secondary logo.',
  },
  'post.03': {
    src: post03,
    title: 'Supporting post 03',
    alt: 'Grip & Greens post on a light green background: the secondary logo surrounded by illustrated peppers, tomatoes, almonds, coffee beans and leaves, with the text Train • Eat • Thrive, Your daily fuel for movement, nourishment & good coffee, Discover your full potential, and Join our community.',
  },
  'post.04': {
    src: post04,
    title: 'Supporting post 04',
    alt: 'Grip & Greens post: cream and dark green layout with a G-and-leaf mark, large text TRAIN. EAT. THRIVE., Healthy choices for a stronger, happier you, a chicken and avocado bowl with a green smoothie, a gym photo, and a Join Us Now button.',
  },
  'post.05': {
    src: post05,
    title: 'Supporting post 05',
    maxDisplay: 480,
    alt: 'Grip & Greens post: off-white layout with the secondary logo, the words Train Eat Thrive, Stronger Happier You, Gym + healthy café under one roof, three icons for Train, Eat and Thrive, and a collage of gym equipment and a fresh salad.',
  },

  /* Promotional event posters (conceptual designs) */
  'promo.01': {
    src: promo01,
    title: 'Grand Opening — main poster',
    alt: 'Grand Opening event poster: black-and-white café and gym photo with neon green GRAND and white OPENING lettering, event details October 18, 2026, Saturday, 08:00 AM to 08:00 PM, 123 Kanya-Kanya Maskel St., Gain City, a Join Us Now button and 50% off membership.',
  },
  'promo.02': {
    src: promo02,
    title: 'Grand Opening — membership poster',
    alt: 'Grand Opening poster with the secondary logo above a dumbbell, a chicken grain bowl and a green smoothie; event details Nov 21, 2026, Saturday, 8:00 AM to 8:00 PM, Rizal Avenue, Cabanatuan City, Nueva Ecija; and four membership cards: One-Day Pass ₱150, Basic ₱1,200, Premium ₱1,800 and Elite ₱2,500.',
  },
  'promo.03': {
    src: promo03,
    title: 'Fitness & Healthy Food Experience',
    alt: 'Event poster: dark gym and café interior with distressed text FITNESS & HEALTHY FOOD EXPERIENCE, the line Train Hard. Eat Clean. Thrive Daily., icons for healthy meals, fresh smoothies, workout area and member promos, and Opening Oct 17, 2026.',
  },

  /* Brand applications — original mockup */
  'application.mockup-01': {
    src: brandMockup01,
    title: 'Original branding mockup',
    maxDisplay: 480,
    alt: 'Branding mockup: the Grip & Greens icon, wordmark and tagline on a grey concrete wall above a dark mat with two dumbbells and a kale leaf.',
  },

  /* Owners — confirmed mapping (see owners.ts) */
  'owner.01': { src: owner01, title: 'Mark Francis A. Polinar', alt: 'Mark Francis A. Polinar, Co-Owner, in a white T-shirt at the gym.' },
  'owner.02': { src: owner02, title: 'John Eidref C. Buenaventura', alt: 'John Eidref C. Buenaventura, Co-Owner, in a black sleeveless top at the gym.' },
  'owner.03': { src: owner03, title: 'Ricky Yan F. Diaz', alt: 'Ricky Yan F. Diaz, Co-Owner, in a black tank top and shorts at the gym.' },
  'owner.04': { src: owner04, title: 'Areown Dapne E. Venus', alt: 'Areown Dapne E. Venus, Co-Owner, in a black T-shirt and track pants at the gym.' },
} satisfies Record<string, ArtItem>;

export type ArtKey = keyof typeof art;

/* ============================================================
   REPLACEABLE SLOTS
   ============================================================ */

export type SlotIcon =
  | 'dumbbell' | 'heart' | 'kettlebell' | 'users' | 'cup' | 'bowl' | 'shake'
  | 'chef' | 'card' | 'image' | 'leaf';

export interface SlotDef {
  /** Folder under src/media/ */
  folder: 'hero' | 'gym' | 'cafe' | 'menu' | 'memberships';
  /** File name without extension */
  name: string;
  /** Short visible label shown on the placeholder */
  label: string;
  /** Alt text used once a real image is supplied */
  alt: string;
  /** CSS aspect-ratio, e.g. '4 / 3' */
  ratio: string;
  /** Optional CSS object-position for the supplied image */
  position?: string;
  icon: SlotIcon;
}

const S = (d: SlotDef) => d;

export const slots = {
  /* hero (2) */
  'hero.gym': S({ folder: 'hero', name: 'gym', label: 'Gym floor', alt: 'Dark gym interior with green accent lighting, dumbbell racks along the left wall, squat racks, green-padded benches and tall windows.', ratio: '825 / 1024', icon: 'dumbbell' }),
  'hero.cafe': S({ folder: 'hero', name: 'cafe', label: 'Healthy café', alt: 'Bright café interior with oak tables and chairs, green columns, a wooden counter, pendant lights, potted plants and tall windows.', ratio: '825 / 1024', icon: 'cup' }),

  /* gym (4) */
  'gym.weight-training': S({ folder: 'gym', name: 'weight-training', label: 'Weight training area', alt: 'Weight training area with racks and free weights.', ratio: '4 / 3', icon: 'dumbbell' }),
  'gym.cardio': S({ folder: 'gym', name: 'cardio', label: 'Cardio equipment', alt: 'Cardio machines in the gym.', ratio: '4 / 3', icon: 'heart' }),
  'gym.functional-area': S({ folder: 'gym', name: 'functional-area', label: 'Functional training area', alt: 'Open functional training area.', ratio: '4 / 3', icon: 'kettlebell' }),
  'gym.group-class': S({ folder: 'gym', name: 'group-class', label: 'Group fitness class', alt: 'A group fitness class in session.', ratio: '4 / 3', icon: 'users' }),

  /* café (3) */
  'cafe.interior': S({ folder: 'cafe', name: 'interior', label: 'Café interior', alt: 'Inside the Grip & Greens café.', ratio: '16 / 10', icon: 'cup' }),
  'cafe.drinks-bar': S({ folder: 'cafe', name: 'drinks-bar', label: 'Shakes & drinks bar', alt: 'The café drinks and protein shake bar.', ratio: '4 / 5', icon: 'shake' }),
  'cafe.meal-prep': S({ folder: 'cafe', name: 'meal-prep', label: 'Meal prep service', alt: 'Packed meal prep containers.', ratio: '4 / 5', icon: 'chef' }),

  /* menu (12) — keys match src/data/menu.ts */
  'menu.muscle-gain-1': S({ folder: 'menu', name: 'muscle-gain-1', label: 'Grilled Chicken Rice Bowl', alt: 'Grilled Chicken Rice Bowl.', ratio: '4 / 3', icon: 'bowl' }),
  'menu.muscle-gain-2': S({ folder: 'menu', name: 'muscle-gain-2', label: 'Beef & Sweet Potato Plate', alt: 'Beef & Sweet Potato Plate.', ratio: '4 / 3', icon: 'bowl' }),
  'menu.muscle-gain-3': S({ folder: 'menu', name: 'muscle-gain-3', label: 'Tuna Whole-Wheat Pasta', alt: 'Tuna Whole-Wheat Pasta.', ratio: '4 / 3', icon: 'bowl' }),
  'menu.weight-loss-1': S({ folder: 'menu', name: 'weight-loss-1', label: 'Garden Chicken Salad', alt: 'Garden Chicken Salad.', ratio: '4 / 3', icon: 'leaf' }),
  'menu.weight-loss-2': S({ folder: 'menu', name: 'weight-loss-2', label: 'Tofu & Veggie Stir-Fry', alt: 'Tofu & Veggie Stir-Fry.', ratio: '4 / 3', icon: 'leaf' }),
  'menu.weight-loss-3': S({ folder: 'menu', name: 'weight-loss-3', label: 'Fish & Greens Bowl', alt: 'Fish & Greens Bowl.', ratio: '4 / 3', icon: 'leaf' }),
  'menu.drinks-1': S({ folder: 'menu', name: 'drinks-1', label: 'Green Protein Shake', alt: 'Green Protein Shake.', ratio: '4 / 3', icon: 'shake' }),
  'menu.drinks-2': S({ folder: 'menu', name: 'drinks-2', label: 'Banana Peanut Butter Shake', alt: 'Banana Peanut Butter Shake.', ratio: '4 / 3', icon: 'shake' }),
  'menu.drinks-3': S({ folder: 'menu', name: 'drinks-3', label: 'Iced Black Coffee', alt: 'Iced Black Coffee.', ratio: '4 / 3', icon: 'cup' }),
  'menu.snacks-1': S({ folder: 'menu', name: 'snacks-1', label: 'Overnight Oats', alt: 'Overnight Oats.', ratio: '4 / 3', icon: 'bowl' }),
  'menu.snacks-2': S({ folder: 'menu', name: 'snacks-2', label: 'Protein Energy Bites', alt: 'Protein Energy Bites.', ratio: '4 / 3', icon: 'leaf' }),
  'menu.snacks-3': S({ folder: 'menu', name: 'snacks-3', label: 'Fruit & Yogurt Cup', alt: 'Fruit & Yogurt Cup.', ratio: '4 / 3', icon: 'cup' }),

  /* memberships (1) */
  'memberships.banner': S({ folder: 'memberships', name: 'banner', label: 'Membership visual', alt: 'Four Grip & Greens membership cards on a stone surface: a cream One-Day Pass at ₱150 per day, a green Basic card at ₱1,200 per month, a black Premium card at ₱1,800 per month, and a black and dark green Elite card at ₱2,500 per month.', ratio: '2048 / 1144', icon: 'card' }),
} as const satisfies Record<string, SlotDef>;

export type SlotKey = keyof typeof slots;

/* ---------- Automatic replacement lookup ---------- */
const userMedia = import.meta.glob<{ default: ImageMetadata }>(
  '/src/media/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const userIndex = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(userMedia)) {
  const m = path.match(/\/src\/media\/([^/]+)\/([^/]+)\.[a-z0-9]+$/i);
  if (m) userIndex.set(`${m[1]}/${m[2]}`.toLowerCase(), mod.default);
}

export interface ResolvedSlot extends SlotDef {
  key: SlotKey;
  /** Present only when a matching file exists in src/media/<folder>/ */
  src?: ImageMetadata;
}

export function resolveSlot(key: SlotKey): ResolvedSlot {
  const def: SlotDef = slots[key];
  const src = userIndex.get(`${def.folder}/${def.name}`.toLowerCase());
  return { ...def, key, src };
}

export const SLOT_COUNT = Object.keys(slots).length; // 22

/* ============================================================
   BRAND APPLICATION MOCKUPS (team-supplied, shown unchanged)
   Every image in src/media/<signage|stationery|packaging>/ joins that card's
   slideshow and gallery automatically. Add a matching entry below to give it
   its own title and details; otherwise the title comes from the file name.
   ============================================================ */
export type MockupFolder = 'signage' | 'stationery' | 'packaging';

export interface MockupItem {
  src: ImageMetadata;
  title: string;
  detail: string;
  alt: string;
}

const mockupDetails: Record<MockupFolder, Record<string, Omit<MockupItem, 'src'>>> = {
  signage: {
    storefront: {
      title: 'Storefront sign',
      detail: 'An illuminated sign with the primary logo on a dark green storefront, the first thing people see from the street.',
      alt: 'Grip & Greens storefront at dusk: a lit cream sign with the primary logo above glass doors, on a dark green facade with planters.',
    },
    'wall-sign': {
      title: 'Interior wall sign',
      detail: 'The primary logo on a mounted panel over a wood-slat feature wall, placed between the café and the gym entrance.',
      alt: 'Cream wall panel with the Grip & Greens primary logo on a wood-slat wall with hanging plants, between a café on the left and a gym on the right.',
    },
    wayfinding: {
      title: 'Wayfinding directory',
      detail: 'A freestanding directory in brand colors pointing to the training floor, Greens Café, locker rooms and restrooms.',
      alt: 'Freestanding Grip & Greens directory sign in a bright hallway, with arrows to the Training Floor, Greens Café, Locker Rooms and Restrooms.',
    },
  },
  stationery: {
    'business-cards': {
      title: 'Business cards',
      detail: 'A cream card with the primary logo, paired with a solid green card carrying the icon.',
      alt: 'Two stacks of business cards on stone: a cream stack with the Grip & Greens primary logo and a green stack with the icon.',
    },
    envelopes: {
      title: 'Envelopes & note cards',
      detail: 'A green envelope with the icon on its flap, paired with a cream note card carrying the primary logo.',
      alt: 'A green envelope with the Grip & Greens icon on the flap beside a cream note card with the primary logo, on stone.',
    },
    letterhead: {
      title: 'Letterhead',
      detail: 'Cream letterhead with the primary logo at the top, leaving clean space for correspondence.',
      alt: 'A stack of cream letterhead with the Grip & Greens primary logo at the top, on a light wooden desk.',
    },
  },
  packaging: {
    cups: {
      title: 'Drink cups',
      detail: 'A hot cup with a green lid and a cold cup with a branded sleeve, both carrying the primary logo.',
      alt: 'A cream hot cup with a green lid and a clear cup of green drink with a cream sleeve, both showing the Grip & Greens primary logo.',
    },
    bowls: {
      title: 'Meal bowls',
      detail: 'Kraft bowls with clear lids, finished with a green band and a cream logo label.',
      alt: 'Two kraft food bowls with clear lids, each wrapped in a green band with a cream Grip & Greens label.',
    },
    boxes: {
      title: 'Meal boxes',
      detail: 'Kraft takeaway boxes wrapped in green and cream paper bands with the logo.',
      alt: 'Two kraft takeaway boxes on a counter, one wrapped in a green band and one in a cream band, both with the Grip & Greens logo.',
    },
    bags: {
      title: 'Carry bags',
      detail: 'Kraft paper bags with twisted handles, printed with the primary logo.',
      alt: 'Two kraft paper carry bags with twisted handles, printed with the Grip & Greens primary logo.',
    },
  },
};

const prettify = (name: string) =>
  name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** All images for a mockup card: described items first (in order), then any extras. */
export function mockupGallery(folder: MockupFolder): MockupItem[] {
  const details = mockupDetails[folder];
  const items: MockupItem[] = [];
  for (const [name, info] of Object.entries(details)) {
    const src = userIndex.get(`${folder}/${name}`.toLowerCase());
    if (src) items.push({ src, ...info });
  }
  const known = new Set(Object.keys(details).map((n) => n.toLowerCase()));
  for (const [key, src] of userIndex) {
    const [dir, name] = key.split('/');
    if (dir === folder && !known.has(name)) {
      const title = prettify(name);
      items.push({ src, title, detail: '', alt: `Grip & Greens ${folder} mockup: ${title}.` });
    }
  }
  return items;
}
