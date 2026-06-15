export interface ApplianceBrand {
  name: string;
  displayName: string;
  logo: string;
}

/** Brands shown on Home Appliances hub — logo + name marquee */
export const homeApplianceBrands: ApplianceBrand[] = [
  { name: 'GE', displayName: 'General Electric', logo: '/images/brands/ge.svg' },
  { name: 'Sharp', displayName: 'Sharp', logo: '/images/brands/sharp.svg' },
  { name: 'Bosch', displayName: 'Bosch', logo: '/images/brands/bosch.svg' },
  { name: 'Samsung', displayName: 'Samsung', logo: '/images/brands/samsung.svg' },
  { name: 'LG', displayName: 'LG', logo: '/images/brands/lg.svg' },
  { name: 'Frigidaire', displayName: 'Frigidaire', logo: '/images/brands/frigidaire.svg' },
  { name: 'Kenmore', displayName: 'Kenmore', logo: '/images/brands/kenmore.svg' },
  { name: 'Whirlpool', displayName: 'Whirlpool', logo: '/images/brands/whirlpool.svg' },
  { name: 'Maytag', displayName: 'Maytag', logo: '/images/brands/maytag.svg' },
  { name: 'Electrolux', displayName: 'Electrolux', logo: '/images/brands/electrolux.svg' },
];
