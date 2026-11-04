/**
 * Copy sourced from assets/business-concept/Business-Concept-Development.pdf
 * (Performance Task #1, BSIT-4G, dated August 21, 2025).
 * Wordy passages are summarized; meaning is preserved. No unsupported claims.
 * See CONTENT_SOURCES.md for the PDF-vs-illustrative breakdown.
 */

export const brand = {
  name: 'Grip & Greens',
  tagline: 'Train. Eat. Thrive.',
  // PDF §7 Value Proposition (summarized)
  promise:
    'A gym and a healthy café under one roof — so you never have to choose between a good workout and a good meal.',
} as const;

/* PDF §2 Brand Story (summarized) */
export const story = {
  lead: 'Grip & Greens started with a pattern we noticed in real fitness and food businesses.',
  paragraphs: [
    'Life Time Fitness in the United States grew from a single club into a chain that eventually added its own LifeCafe, because members wanted proper food, not just equipment. SaladStop!, founded in Singapore and later launched in the Philippines, grew because healthy, convenient food was still hard to find even as more people wanted to eat better.',
    'Both cases point to the same gap: people who care about their health often have to choose between a good workout and a good meal, because gyms rarely serve real food and healthy cafés rarely have workout facilities.',
    'We designed Grip & Greens to close that gap for our own community — a fully equipped gym and a healthy café under one roof, so members do not have to go somewhere else to properly fuel their results.',
  ],
  // Dates as stated in the PDF
  milestones: [
    { year: '1992', text: 'Life Time Fitness is founded in the US — it later adds LifeCafe for members.' },
    { year: '2009', text: 'SaladStop! is founded in Singapore around healthy, convenient food.' },
    { year: '2014', text: 'SaladStop! launches in the Philippines (December).' },
    { year: '2025', text: 'The Grip & Greens concept is developed: gym + healthy café, one roof.' },
  ],
  gap: {
    gym: { title: 'Typical gym', has: 'Equipment & training', lacks: 'Rarely serves real food' },
    cafe: { title: 'Typical healthy café', has: 'Nutritious food', lacks: 'No workout facilities' },
    us: { title: 'Grip & Greens', has: 'Training + goal-based food, one roof' },
  },
} as const;

/* PDF p.2 — verbatim */
export const mission =
  'To help every member reach their fitness goals by giving them access to quality training facilities, guided workouts, and nutritious food and drinks that support their specific goals, whether that is building muscle, losing weight, or simply living a healthier lifestyle.';

export const vision =
  'To become the go-to fitness and wellness destination known for making healthy living simple, practical, and enjoyable by bringing fitness and nutrition together in one convenient space.';

/* PDF p.2 Unique Appeal (summarized) */
export const uniqueAppeal =
  'Hybrid memberships already work in the Philippine market. Grip & Greens applies the same bundling idea to something gyms rarely offer: real, goal-specific nutrition. Workouts, meals and nutrition guidance come together in one membership, tailored to each member’s fitness goal.';

/* PDF §3 Tagline meaning */
export const taglineParts = [
  { word: 'Train', meaning: 'Working out — with the equipment, space and guidance to do it well.' },
  { word: 'Eat', meaning: 'Eating healthy — food and drinks matched to your fitness goal.' },
  { word: 'Thrive', meaning: 'Improving your overall lifestyle, one habit at a time.' },
] as const;

/* PDF §5 Target Market */
export const audience = {
  summary:
    'Teenagers, college students, young professionals and adults around 16–40 years old who are interested in fitness and healthy living.',
  ageRange: '16–40',
  /** Display copy next to the large age figure (same meaning, without repeating the range) */
  who: 'Teenagers, college students, young professionals and adults who are interested in fitness and healthy living.',
  interests: ['Exercise and fitness', 'Healthy eating', 'Weight management', 'Muscle building', 'Active lifestyle', 'Wellness'],
  needs: [
    'Affordable fitness services',
    'Convenient healthy meals',
    'Fitness-friendly food choices',
    'A comfortable place to exercise and eat',
    'Support in reaching their fitness goals',
  ],
} as const;

/* PDF §6 Competitor Analysis */
export const competitors = [
  { type: 'Traditional gyms', note: 'Equipment and training, but usually no healthy meals or drinks.' },
  { type: 'Local cafés', note: 'Food and drinks, but limited healthy or fitness-focused options.' },
  { type: 'Healthy food shops', note: 'Nutritious meals, but no gym or workout facilities.' },
  { type: 'Large fitness centers', note: 'More facilities, but often pricier and less focused on personalized healthy food.' },
] as const;

export const competitiveAdvantage =
  'Grip & Greens combines the services of a gym and a healthy café, so customers can exercise and eat in the same location.';

/* PDF §7 Why choose Grip & Greens */
export const reasons = [
  'Gym and café in one location',
  'Convenient healthy food after workouts',
  'Food options for different fitness goals',
  'Variety of fitness services',
  'Membership options for different budgets',
  'Comfortable and modern environment',
  'Helps you keep a healthier lifestyle more conveniently',
] as const;

/* PDF §4 Fitness Services — all 11, PDF order */
export const gymServices = [
  { name: 'Weight Training', icon: 'dumbbell' },
  { name: 'Cardio Equipment', icon: 'heart' },
  { name: 'Functional Training Area', icon: 'kettlebell' },
  { name: 'Personal Training', icon: 'coach' },
  { name: 'Group Fitness Classes', icon: 'users' },
  { name: 'Fitness Assessment', icon: 'clipboard' },
  { name: 'Locker / Changing Area', icon: 'locker' },
  { name: 'Membership Packages', icon: 'card' },
  { name: 'One-Day Gym Pass', icon: 'ticket' },
  { name: 'Body Composition Analysis', icon: 'scale' },
  { name: 'Fitness Progress Tracking', icon: 'chart' },
] as const;

/* PDF §4 Healthy Café Services — all 7, PDF order */
export const cafeServices = [
  { name: 'Muscle Gain Meals', icon: 'bowl' },
  { name: 'Weight Loss Meals', icon: 'leaf' },
  { name: 'Healthy Drinks', icon: 'shake' },
  { name: 'Healthy Snacks', icon: 'apple' },
  { name: 'Protein-Rich Meals and Drinks', icon: 'cup' },
  { name: 'Meal Prep Service', icon: 'chef' },
  { name: 'Health and Nutrition Consultation', icon: 'chat' },
] as const;

/* Footer academic credit — from the PDF header */
export const academic = {
  task: 'Performance Task #1: Business Concept Development',
  program: 'BSIT-4G',
  college: 'College of Information and Communications Technology',
  school: 'Nueva Ecija University of Science and Technology',
} as const;
