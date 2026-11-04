/**
 * MEMBERSHIP PACKAGES
 * - Package names, access and privileges: verbatim from the PDF table (p.4).
 * - Prices: SAMPLE prices taken from the team's own promo-02 poster
 *   (confirmed 2026-11-04). Grip & Greens is a proposed concept; nothing here is for sale.
 */
export interface Plan {
  id: string;
  name: string;
  /** Sample price in PHP */
  price: number;
  period: 'day' | 'month';
  access: string;
  privileges: string[];
  /** Visually emphasised card */
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'one-day',
    name: 'One-Day Pass',
    price: 150,
    period: 'day',
    access: 'Gym access for one day',
    privileges: ['Access to gym equipment', 'Cardio area', 'Functional training area', 'Café'],
  },
  {
    id: 'basic',
    name: 'Basic Membership',
    price: 1200,
    period: 'month',
    access: 'Regular gym access',
    privileges: ['Access to gym equipment', 'Cardio area', 'Functional training area', 'Member pricing on selected café items'],
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    price: 1800,
    period: 'month',
    access: 'Full gym access',
    featured: true,
    privileges: ['All Basic privileges', 'Selected group classes', 'Discounts on healthy meals and drinks', 'Basic fitness assessment'],
  },
  {
    id: 'elite',
    name: 'Elite Membership',
    price: 2500,
    period: 'month',
    access: 'Full gym access + premium services',
    privileges: [
      'All Premium privileges',
      'Personal training sessions',
      'Greater café discounts',
      'Nutrition consultation',
      'Priority access to selected services',
    ],
  },
];
