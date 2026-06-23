export interface MembershipPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  bestFor: string;
  benefits: string[];
  highlighted?: boolean;
  ctaLabel: string;
}

export type ComparisonCell = boolean | string;

export interface MembershipComparisonFeature {
  id: string;
  label: string;
  basic: ComparisonCell;
  plus: ComparisonCell;
  wholeHome: ComparisonCell;
}

export const MEMBERSHIP_DISCLAIMER =
  'Smart Care Membership provides discounts, reminders, and priority service benefits. It is not insurance or a full home warranty. Final pricing depends on diagnosis, parts, labor, and service availability.';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Smart Care Basic',
    monthlyPrice: 14.99,
    yearlyPrice: 149,
    description: 'Best for homeowners who want priority support and savings.',
    bestFor: 'Best for occasional appliance support.',
    benefits: [
      'Priority scheduling when available',
      '10% off repair labor',
      'No extra same-day priority fee when available',
      'Annual appliance maintenance reminder',
      'Member-only seasonal offers',
      'Request ID tracking',
      'Email support',
    ],
    ctaLabel: 'Choose Basic',
  },
  {
    id: 'plus',
    name: 'Smart Care Plus',
    monthlyPrice: 24.99,
    yearlyPrice: 249,
    description: 'Best for appliance and HVAC service savings.',
    bestFor: 'Best for appliance and HVAC savings.',
    highlighted: true,
    benefits: [
      'Everything in Basic',
      '15% off repair labor',
      'Annual HVAC tune-up reminder',
      'Appliance maintenance checklist',
      'Priority emergency callback',
      'Discounted diagnostic visit',
      'Member-only booking support',
    ],
    ctaLabel: 'Choose Plus',
  },
  {
    id: 'whole-home',
    name: 'Whole Home Care',
    monthlyPrice: 49.99,
    yearlyPrice: 499,
    description:
      'Best for appliance, HVAC, plumbing, electrical, smart home, and garage door support.',
    bestFor: 'Best for whole-home service support.',
    benefits: [
      'Everything in Plus',
      '20% off repair labor',
      'Whole-home seasonal maintenance reminders',
      'Priority scheduling across all service categories',
      'Discounted emergency service visit',
      'Dedicated support follow-up',
      'Future-ready for protection coverage',
    ],
    ctaLabel: 'Choose Whole Home',
  },
];

export const MEMBERSHIP_COMPARISON_FEATURES: MembershipComparisonFeature[] = [
  { id: 'priority', label: 'Priority scheduling', basic: true, plus: true, wholeHome: true },
  { id: 'labor', label: 'Repair labor discount', basic: '10%', plus: '15%', wholeHome: '20%' },
  {
    id: 'same-day',
    label: 'Same-day priority fee waiver when available',
    basic: true,
    plus: true,
    wholeHome: true,
  },
  { id: 'hvac-reminder', label: 'HVAC maintenance reminder', basic: false, plus: true, wholeHome: true },
  {
    id: 'appliance-reminder',
    label: 'Appliance maintenance reminder',
    basic: true,
    plus: true,
    wholeHome: true,
  },
  { id: 'emergency-callback', label: 'Emergency callback priority', basic: false, plus: true, wholeHome: true },
  { id: 'diagnostic', label: 'Discounted diagnostic visit', basic: false, plus: true, wholeHome: true },
  { id: 'whole-home', label: 'Whole-home service categories', basic: false, plus: false, wholeHome: true },
  { id: 'follow-up', label: 'Dedicated support follow-up', basic: false, plus: false, wholeHome: true },
];

export const HERO_BENEFITS = [
  'Save up to 20% on eligible repair labor',
  'Priority scheduling when available',
  'Seasonal maintenance reminders',
  'Easy online request tracking',
];

export const WHY_SMART_CARE = [
  { title: 'Save on eligible repairs', description: 'Members receive labor discounts on covered repair visits.' },
  { title: 'Get priority scheduling', description: 'Earlier appointment options when technician capacity allows.' },
  { title: 'Stay ahead with reminders', description: 'Seasonal maintenance prompts help you avoid bigger repairs.' },
  { title: 'Track every request online', description: 'Every booking gets a request ID you can track anytime.' },
];

export const MEMBERSHIP_INCLUDED = [
  { title: 'Appliance support', description: 'Member savings and reminders for major home appliances.' },
  { title: 'HVAC support', description: 'Seasonal tune-up reminders and priority booking when available.' },
  { title: 'Plumbing support', description: 'Eligible for member labor discounts on plumbing repairs.' },
  { title: 'Electrical support', description: 'Savings on eligible electrical service labor.' },
  { title: 'Smart home setup', description: 'Member pricing on setup and troubleshooting visits.' },
  { title: 'Garage door service', description: 'Whole Home Care includes garage door category support.' },
  { title: 'Seasonal reminders', description: 'Proactive maintenance prompts throughout the year.' },
  { title: 'Priority scheduling', description: 'Earlier appointment options when technician capacity allows.' },
];

export const COVERAGE_NOTE_INTRO =
  'Smart Care is a service membership plan, not insurance or a full home warranty.';

export const MEMBERSHIP_EXCLUSIONS = [
  'Parts are not automatically included',
  'Replacement appliances are not included',
  'Emergency availability is not guaranteed',
  'Final pricing depends on technician diagnosis',
  'Service availability depends on ZIP/service area',
];

export const ONE_TIME_VS_MEMBERSHIP = {
  oneTime: {
    title: 'One-Time Service',
    items: [
      'Pay per request',
      'Standard scheduling',
      'Standard diagnostic / service fee',
      'No membership discount',
    ],
  },
  membership: {
    title: 'Smart Care',
    items: [
      'Priority scheduling when available',
      'Repair labor discounts',
      'Seasonal reminders',
      'Member-only offers',
      'Request tracking',
    ],
  },
};

export const MEMBERSHIP_FAQS = [
  {
    q: 'Is Smart Care a warranty?',
    a: 'No. Smart Care is a service membership that provides scheduling benefits, reminders, and eligible repair labor discounts. It is not a full home warranty or insurance policy.',
  },
  {
    q: 'Does it cover parts?',
    a: 'Parts are quoted separately based on diagnosis. Membership discounts apply to eligible labor unless otherwise stated at the time of service.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. If you activate a paid plan in the future, cancellation terms will be provided before checkout. For now, membership interest requests can be updated anytime by contacting our team.',
  },
  {
    q: 'Do members get same-day service?',
    a: 'Members receive priority scheduling when same-day appointments are available in your service area. Same-day service is not guaranteed.',
  },
  {
    q: 'Does the plan include emergency service?',
    a: 'Emergency service may be requested separately. Whole Home Care includes discounted emergency visit options where available, but emergency availability is not guaranteed.',
  },
  {
    q: 'Can I use it for HVAC, plumbing, and electrical?',
    a: 'Yes. Plus and Whole Home Care include broader category benefits. Whole Home Care is designed for whole-home support across all listed service types.',
  },
  {
    q: 'How do I track my service request?',
    a: 'Every booking receives a request ID. Use Track Request on our website to check status updates.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Yes. You can request an upgrade to Plus or Whole Home Care by contacting Smart Appliances support.',
  },
];

export const HOW_IT_WORKS_STEPS = [
  'Choose a Smart Care plan',
  'Book service or request help anytime',
  'Receive priority scheduling and member benefits',
  'Track your service request online',
  'Save on eligible repairs and services',
];

export function formatMembershipPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getMembershipPlanById(id: string): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find((p) => p.id === id);
}

export function getMembershipPlanByName(name: string): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find((p) => p.name === name);
}
