import React from 'react';
import { Box } from '@mui/material';
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  Home,
  LucideIcon,
} from 'lucide-react';

export const SERVICE_CATEGORY_TABS = [
  'Appliances',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Smart Home',
] as const;

export type ServiceCategoryTab = (typeof SERVICE_CATEGORY_TABS)[number];

const TAB_ICONS: Record<ServiceCategoryTab, LucideIcon> = {
  Appliances: Refrigerator,
  HVAC: Snowflake,
  Plumbing: Droplets,
  Electrical: Zap,
  'Smart Home': Home,
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
      <Box className="service-segment-track" role="tablist" aria-label="Service categories">
        {SERVICE_CATEGORY_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeCategory === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
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
