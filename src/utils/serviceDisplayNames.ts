// Internal service/product names (used for scheduler URL params, pricing lookups, and
// Supabase product_name values) stay unchanged for backward compatibility. This map
// supplies a cleaner, less repetitive label for anything rendered to the customer.
const SERVICE_DISPLAY_NAMES: Record<string, string> = {
  'Refrigerator Repair': 'Refrigerator Service',
  'Washer / Dryer Repair': 'Washer & Dryer Service',
  'Dishwasher Repair': 'Dishwasher Service',
  'Oven / Stove Repair': 'Oven & Stove Service',
  'Microwave Repair': 'Microwave Service',
  'AC Repair': 'AC Service',
  'Heating / Furnace Repair': 'Heating & Furnace Service',
  'Garbage Disposal Repair': 'Garbage Disposal Service',
  'Faucet Repair / Replacement': 'Faucet Service',
  'Toilet Repair': 'Toilet Service',
  'Outlet / Switch Repair': 'Outlet & Switch Service',
  'Garage Door Repair': 'Garage Door Service',
  'Spring Repair': 'Spring Service',
  'Opener Repair': 'Opener Service',
};

/** Returns a polished, customer-facing label for a service/product name, falling back to the original string if no cleaner label is defined. */
export function getServiceDisplayName(productName?: string | null): string {
  if (!productName) return '';
  return SERVICE_DISPLAY_NAMES[productName] ?? productName;
}
