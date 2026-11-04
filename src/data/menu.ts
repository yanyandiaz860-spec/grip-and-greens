/**
 * SAMPLE MENU — illustrative only (approved by the team 2026-11-04).
 * Categories come from the PDF's Healthy Café Services; item names,
 * descriptions and prices are design examples, not products for sale.
 * No nutrition figures or health claims are made.
 */
import type { SlotKey } from './media';

export interface MenuItem {
  name: string;
  description: string;
  /** Sample price in PHP */
  price: number;
  slot: SlotKey;
}

export interface MenuCategory {
  id: string;
  label: string;
  intro: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: 'muscle-gain',
    label: 'Muscle Gain',
    intro: 'Hearty, protein-forward plates for training days.',
    items: [
      { name: 'Grilled Chicken Rice Bowl', price: 220, slot: 'menu.muscle-gain-1', description: 'Grilled chicken breast over rice with sautéed vegetables and a light garlic sauce.' },
      { name: 'Beef & Sweet Potato Plate', price: 260, slot: 'menu.muscle-gain-2', description: 'Lean beef strips with roasted sweet potato and steamed greens.' },
      { name: 'Tuna Whole-Wheat Pasta', price: 210, slot: 'menu.muscle-gain-3', description: 'Whole-wheat pasta tossed with tuna, tomatoes, olive oil and herbs.' },
    ],
  },
  {
    id: 'weight-loss',
    label: 'Weight Loss',
    intro: 'Lighter plates built around vegetables and lean protein.',
    items: [
      { name: 'Garden Chicken Salad', price: 190, slot: 'menu.weight-loss-1', description: 'Mixed greens, grilled chicken, cucumber and cherry tomatoes with a citrus dressing.' },
      { name: 'Tofu & Veggie Stir-Fry', price: 180, slot: 'menu.weight-loss-2', description: 'Crispy tofu and seasonal vegetables in a light soy-ginger glaze.' },
      { name: 'Fish & Greens Bowl', price: 230, slot: 'menu.weight-loss-3', description: 'Pan-seared fish fillet on a bed of greens with brown rice on the side.' },
    ],
  },
  {
    id: 'drinks',
    label: 'Healthy Drinks',
    intro: 'Shakes and coffee for before or after your session.',
    items: [
      { name: 'Green Protein Shake', price: 150, slot: 'menu.drinks-1', description: 'Spinach, banana and protein blended smooth with milk or a plant-based option.' },
      { name: 'Banana Peanut Butter Shake', price: 140, slot: 'menu.drinks-2', description: 'Banana, peanut butter, oats and milk — thick, creamy and filling.' },
      { name: 'Iced Black Coffee', price: 100, slot: 'menu.drinks-3', description: 'Freshly brewed coffee over ice, served unsweetened.' },
    ],
  },
  {
    id: 'snacks',
    label: 'Healthy Snacks',
    intro: 'Easy bites between meals or on the way out.',
    items: [
      { name: 'Overnight Oats', price: 120, slot: 'menu.snacks-1', description: 'Rolled oats soaked overnight with milk, topped with fruit and seeds.' },
      { name: 'Protein Energy Bites', price: 90, slot: 'menu.snacks-2', description: 'No-bake oat, nut butter and honey bites — a grab-and-go favourite.' },
      { name: 'Fruit & Yogurt Cup', price: 110, slot: 'menu.snacks-3', description: 'Plain yogurt layered with fresh seasonal fruit and granola.' },
    ],
  },
];

export const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`;
