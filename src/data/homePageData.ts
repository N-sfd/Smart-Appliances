export const tabCategoryMap: Record<string, string[]> = {
  HVAC: ['hvac-services'],
  Plumbing: ['plumbing-services'],
  Electrical: ['electrical-services'],
  'Smart Home': ['smart-home-setup'],
};

export const SERVICE_DETAIL_EXT: Record<string, { issues?: string[]; hasEmergency: boolean }> = {
  'refrigerator-repair': { issues: ['Not cooling', 'Ice maker issue', 'New install setup', 'Water line hookup'], hasEmergency: true },
  'washer-dryer': { issues: ["Won't spin", 'Not heating', 'Hose connection', 'Level and test'], hasEmergency: false },
  'washer-repair': { hasEmergency: false },
  'dishwasher-repair': { issues: ['Not cleaning', "Won't drain", 'Drain connection', 'Water line hookup'], hasEmergency: false },
  'oven-stove-repair': { issues: ['Not heating', 'Burner issue', 'Gas line hookup', 'Electrical hookup'], hasEmergency: true },
  'microwave-repair': { issues: ['Not heating', 'No power', 'OTR mounting', 'Countertop setup'], hasEmergency: false },
  'smart-appliance-setup': { hasEmergency: false },
  'garbage-disposal-repair': { issues: ['Humming but not working', 'Leaking under sink', 'Jammed blades', "Won't turn on"], hasEmergency: false },
  'ice-maker-repair': { issues: ['Not making ice', 'Ice tastes off', 'Water supply issue', 'Dispenser stuck'], hasEmergency: false },
  'refrigerator-installation': { hasEmergency: false },
  'dishwasher-installation': { hasEmergency: false },
  'washer-dryer-installation': { hasEmergency: false },
  'microwave-installation': { hasEmergency: false },
  'range-oven-installation': { hasEmergency: false },
  'dryer-repair': { hasEmergency: false },
  'ac-repair': { issues: ['No cooling', 'Warm air blowing', 'Refrigerant leak', 'Loud noise'], hasEmergency: true },
  'heating-furnace-repair': { issues: ['No heat', 'Burner not igniting', 'Short cycling', 'Unusual smell'], hasEmergency: true },
  'thermostat-installation': { issues: ['Thermostat not responding', 'Incorrect temperature', 'New smart thermostat', 'C-wire upgrade'], hasEmergency: false },
  'hvac-maintenance': { issues: ['Annual tune-up', 'Filter replacement', 'Coil cleaning', 'Efficiency check'], hasEmergency: false },
  'duct-cleaning': { issues: ['Dust and debris', 'Allergens in air', 'Poor airflow', 'Post-renovation cleaning'], hasEmergency: false },
  'emergency-hvac-service': { issues: ['Total system failure', 'No heat in winter', 'No AC in extreme heat', 'Gas smell'], hasEmergency: true },
  'leak-repair': { issues: ['Pipe leak', 'Under-sink leak', 'Water stains on walls', 'High water bill'], hasEmergency: true },
  'drain-cleaning': { issues: ['Slow drain', 'Complete blockage', 'Bad odor', 'Multiple drains affected'], hasEmergency: false },
  'faucet-repair': { issues: ['Dripping faucet', 'Low pressure', 'Leak at base', 'Handle issue'], hasEmergency: false },
  'toilet-repair': { issues: ['Running toilet', "Won't flush properly", 'Leaking at base', 'Clogged'], hasEmergency: false },
  'water-heater-service': { issues: ['No hot water', 'Insufficient hot water', 'Leak at tank', 'Strange sounds'], hasEmergency: true },
  'emergency-plumbing': { issues: ['Burst pipe', 'Major water leak', 'Sewage backup', 'Flooding'], hasEmergency: true },
  'outlet-switch-repair': { issues: ['Dead outlet', 'Switch not working', 'Warm or buzzing outlet', 'GFCI tripping'], hasEmergency: true },
  'light-fixture-installation': { issues: ['New fixture install', 'Flickering light', 'Buzzing sound', 'Dimmer upgrade'], hasEmergency: false },
  'ceiling-fan-installation': { issues: ['New fan install', 'Wobbling fan', 'Remote not working', 'Light kit issue'], hasEmergency: false },
  'breaker-panel-inspection': { issues: ['Breaker tripping', 'Panel overheating', 'Safety inspection', 'Capacity upgrade'], hasEmergency: true },
  'appliance-electrical-connection': { issues: ['Dryer circuit setup', 'Range outlet install', 'Dedicated circuit', 'Amperage upgrade'], hasEmergency: false },
  'emergency-electrical-service': { issues: ['Power outage', 'Sparking outlet', 'Burning smell', 'Circuit failure'], hasEmergency: true },
  'smart-thermostat-setup': { issues: ['Nest / Ecobee setup', 'C-wire installation', 'App pairing', 'Schedule configuration'], hasEmergency: false },
  'doorbell-installation': { issues: ['Ring doorbell setup', 'Existing wiring use', 'App setup', 'Motion zone config'], hasEmergency: false },
  'camera-installation': { issues: ['Indoor camera mount', 'Outdoor camera setup', 'Night vision config', 'Cloud storage setup'], hasEmergency: false },
  'smart-lock-installation': { issues: ['Smart lock fitting', 'App pairing', 'Access code setup', 'Keypad programming'], hasEmergency: false },
  'wifi-setup': { issues: ['Device connection', 'Wi-Fi troubleshooting', 'Mesh network setup', 'Range extension'], hasEmergency: false },
  'tv-mounting': { issues: ['Wall mount install', 'Cable management', 'Stud finding', 'Tilt / swivel bracket'], hasEmergency: false },
  'preventive-maintenance': { issues: ['Annual appliance check', 'Filter replacement', 'Seal inspection', 'Efficiency tune-up'], hasEmergency: false },
  'dryer-vent-cleaning': { issues: ['Lint buildup', 'Long dry times', 'Overheating dryer', 'Fire risk reduction'], hasEmergency: false },
  'air-duct-cleaning': { issues: ['Dust in vents', 'Allergy symptoms', 'Pet dander buildup', 'Post-reno debris'], hasEmergency: false },
  'seasonal-hvac-tune-up': { issues: ['Pre-season check', 'Filter change', 'Coil cleaning', 'Refrigerant check'], hasEmergency: false },
  'garage-door-repair': { issues: ["Won't open or close", 'Broken spring or cable', 'Noisy or off-track door', 'Opener not responding'], hasEmergency: false },
  'general-handyman': { issues: ['Minor repairs', 'Small installations', 'Home maintenance fixes', 'Seasonal tasks'], hasEmergency: false },
};

export const howItWorks = [
  { step: '1', title: 'Choose a service', description: 'Pick the category and specific service for your appliance or home system.' },
  { step: '2', title: 'Regular or emergency', description: 'Schedule at a convenient time or request same-day emergency response.' },
  { step: '3', title: 'Tell us the problem', description: 'Share the issue, appliance brand, model, and any photos for faster service.' },
  { step: '4', title: 'Get contacted & booked', description: 'We confirm availability, service details, and next steps with clear pricing.' },
];

export const faqs = [
  { question: 'Do you offer emergency service?', answer: 'Yes. We provide 24/7 emergency service for urgent issues including water leaks, burning smells, electrical hazards, and complete appliance failures. Emergency requests are prioritized and receive same-day response.' },
  { question: 'What appliances do you repair?', answer: 'We repair all major home appliances including refrigerators, washers, dryers, dishwashers, ovens, stoves, microwaves, and more. We also service HVAC systems, plumbing, electrical, and smart home equipment.' },
  { question: 'Is there a diagnostic fee?', answer: 'A diagnostic fee may apply depending on the appliance type and service needed. This covers the technician visit and initial assessment. The technician will explain the full cost before any repair work begins.' },
  { question: 'How soon can a technician come?', answer: 'For regular service, we typically schedule within 1–3 business days based on your preferred time window. Same-day requests depend on availability. Emergency requests receive priority response.' },
  { question: 'Do you service HVAC, plumbing, or electrical issues?', answer: 'Yes. In addition to appliance repair, we offer HVAC support, plumbing services, and electrical services through our licensed technician network.' },
  { question: 'Can I track my service request?', answer: 'Yes. Use the Track Request section on our homepage or contact us directly by phone or email. We will provide status updates as your request moves from scheduling through completion.' },
];

export const serviceCoverageItems = [
  { label: 'Appliance Care', icon: 'appliance' as const },
  { label: 'Installations', icon: 'install' as const },
  { label: 'HVAC Service', icon: 'hvac' as const },
  { label: 'Plumbing Service', icon: 'plumbing' as const },
  { label: 'Same-Day / Emergency Priority', icon: 'emergency' as const },
];

// Text-only — avoids any trademark/logo-licensing question while still naming the brands served.
export const BRANDS_WE_SERVICE: string[] = [
  'Samsung', 'LG', 'Whirlpool', 'GE', 'Maytag', 'Frigidaire', 'Bosch',
  'KitchenAid', 'Electrolux', 'Amana', 'Kenmore', 'Sub-Zero', 'Viking', 'Wolf',
];
