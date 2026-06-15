export interface PopularService {
  id: string;
  label: string;
  subtitle: string;
  image: string;
  imageBg: string;
  category: string;
  serviceId: string;
  description: string;
  chips: string[];
}

export const popularServices: PopularService[] = [
  {
    id: 'refrigerator-repair',
    label: 'Refrigerator',
    subtitle: 'Cooling, leaks, ice maker',
    image: '/images/services/refrigerator-repair.webp',
    imageBg: '#E8F1FF',
    category: 'appliance-repair',
    serviceId: 'refrigerator-repair',
    description:
      'Expert service for refrigerator cooling failure, ice maker problems, water leaks, unusual noises, and door seal damage.',
    chips: ['Not cooling', 'Ice maker issue', 'Leaking water', 'Strange noise', 'Door seal issue'],
  },
  {
    id: 'washer-dryer',
    label: 'Washer / Dryer',
    subtitle: "Won't spin, drain, or heat",
    image: '/images/services/hero-appliance-technician.webp',
    imageBg: '#E8F1FF',
    category: 'appliance-repair',
    serviceId: 'washer-dryer',
    description:
      'Service for washing machines and dryers that won\'t spin, drain, start, or heat — plus leaks, long dry times, and error codes.',
    chips: ["Won't spin", "Won't drain", 'Not heating', 'Leaking', 'Error code'],
  },
  {
    id: 'dishwasher-repair',
    label: 'Dishwasher',
    subtitle: 'Not cleaning or draining',
    image: '/images/services/dishwasher-repair.webp',
    imageBg: '#E8F1FF',
    category: 'appliance-repair',
    serviceId: 'dishwasher-repair',
    description:
      'Professional dishwasher service for poor cleaning results, drainage problems, door latch issues, and control board failures.',
    chips: ['Not cleaning', "Won't drain", "Won't start", 'Leaking', 'Door issue'],
  },
  {
    id: 'oven-stove-repair',
    label: 'Oven / Stove',
    subtitle: 'Not heating or ignition issues',
    image: '/images/services/oven-stove-repair.webp',
    imageBg: '#E8F1FF',
    category: 'appliance-repair',
    serviceId: 'oven-stove-repair',
    description:
      'Oven and stove service covering heating failures, burner problems, ignition issues, display errors, and door seal or hinge problems.',
    chips: ['Not heating', 'Burner issue', 'Ignition problem', 'Display error', 'Door issue'],
  },
  {
    id: 'microwave-repair',
    label: 'Microwave',
    subtitle: 'Power, heating, or control issues',
    image: '/images/services/appliances/microwave-repair.webp',
    imageBg: '#E8F1FF',
    category: 'appliance-repair',
    serviceId: 'microwave-repair',
    description:
      'Microwave diagnostics for power failures, heating problems, turntable issues, sparking, and control panel errors.',
    chips: ['Not heating', 'No power', 'Turntable issue', 'Sparking inside', 'Display error'],
  },
  {
    id: 'smart-appliance-setup',
    label: 'Smart Appliance Setup',
    subtitle: 'Wi-Fi pairing, app setup, smart controls',
    image: '/images/services/smart-home/hero-installer.webp',
    imageBg: '#E8F1FF',
    category: 'appliance-installation',
    serviceId: 'smart-appliance-setup',
    description:
      'Get your smart appliances connected with Wi-Fi pairing, mobile app setup, voice assistant integration, and feature configuration.',
    chips: ['Wi-Fi pairing', 'App setup', 'Voice assistant', 'Smart controls', 'Feature config'],
  },
];
