import React from 'react';
import { Box } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
import type { SvgIconComponent } from '@mui/icons-material';

export const SERVICE_CATEGORY_TABS = [
  'Appliances',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Smart Home',
] as const;

export type ServiceCategoryTab = (typeof SERVICE_CATEGORY_TABS)[number];

const TAB_ICONS: Record<ServiceCategoryTab, SvgIconComponent> = {
  Appliances: KitchenIcon,
  HVAC: AcUnitIcon,
  Plumbing: WaterDropIcon,
  Electrical: BoltIcon,
  'Smart Home': HomeIcon,
};

interface ServiceCategoryTabsProps {
  activeCategory: ServiceCategoryTab;
  onChange: (category: ServiceCategoryTab) => void;
}

const ServiceCategoryTabs: React.FC<ServiceCategoryTabsProps> = ({
  activeCategory,
  onChange,
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: { xs: 'flex-start', md: 'center' },
      width: '100%',
      mb: 3.5,
      px: { xs: 0.5, sm: 1 },
    }}
  >
    <Box className="service-segment-scroll">
      <Box
        className="service-segment-track"
        role="group"
        aria-label="Service categories"
      >
        {SERVICE_CATEGORY_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeCategory === tab;

          return (
            <button
              key={tab}
              type="button"
              {...(isActive ? { 'aria-pressed': 'true' as const } : { 'aria-pressed': 'false' as const })}
              className={`service-segment-tab${isActive ? ' is-active' : ''}`}
              onClick={() => onChange(tab)}
            >
              <Icon className="service-segment-icon" aria-hidden="true" />
              <span>{tab}</span>
            </button>
          );
        })}
      </Box>
    </Box>
  </Box>
);

export default ServiceCategoryTabs;
