import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Refrigerator,
  Droplets,
  Snowflake,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { serviceCategories } from '../data/services';
import { getServiceImage } from '../data/serviceImages';
import {
  APPLIANCE_SHOWCASE_IDS,
  BROWSE_TAB_CATEGORY,
  EMERGENCY_SERVICE_IDS,
  SERVICES_BROWSE_TABS,
  ServicesBrowseTab,
} from '../data/serviceCategoryHubs';
import ServiceShowcaseCard from './ServiceShowcaseCard';

const TAB_ICONS: Record<ServicesBrowseTab, LucideIcon> = {
  appliances: Refrigerator,
  plumbing: Droplets,
  hvac: Snowflake,
  electrical: Zap,
};

interface ShowcaseItem {
  id: string;
  title: string;
  image: string;
  categoryId: string;
}

interface ServiceCategoryShowcaseProps {
  activeTab?: ServicesBrowseTab;
  onTabChange?: (tab: ServicesBrowseTab) => void;
  /** When set, only show this category (hub detail pages) */
  lockedTab?: ServicesBrowseTab;
  /** Hide Appliances / Plumbing / HVAC / Electrical tab bar (e.g. main /services page) */
  hideTabs?: boolean;
}

const ServiceCategoryShowcase: React.FC<ServiceCategoryShowcaseProps> = ({
  activeTab = 'appliances',
  onTabChange = () => {},
  lockedTab,
  hideTabs = false,
}) => {
  const navigate = useNavigate();
  const tab = lockedTab ?? activeTab;

  const items = useMemo((): ShowcaseItem[] => {
    if (hideTabs && !lockedTab) {
      const applianceItems: ShowcaseItem[] = APPLIANCE_SHOWCASE_IDS.map((id) => {
        const repairCat = serviceCategories.find((c) => c.id === 'appliance-repair');
        const svc = repairCat?.services.find((s) => s.id === id);
        const img = getServiceImage(id, 'appliance-repair');
        return {
          id,
          title: svc?.label ?? img.title,
          image: img.image,
          categoryId: 'appliance-repair',
        };
      });

      const hubItems: ShowcaseItem[] = (['plumbing', 'hvac', 'electrical'] as const).flatMap((hubTab) => {
        const categoryId = BROWSE_TAB_CATEGORY[hubTab];
        const category = serviceCategories.find((c) => c.id === categoryId);
        if (!category) return [];
        return category.services
          .filter((s) => !EMERGENCY_SERVICE_IDS.has(s.id))
          .map((s) => {
            const img = getServiceImage(s.id, categoryId);
            return {
              id: s.id,
              title: s.label,
              image: img.image,
              categoryId,
            };
          });
      });

      return [...applianceItems, ...hubItems];
    }

    if (tab === 'appliances') {
      const repairCat = serviceCategories.find((c) => c.id === 'appliance-repair');
      return APPLIANCE_SHOWCASE_IDS.map((id) => {
        const svc = repairCat?.services.find((s) => s.id === id);
        const img = getServiceImage(id, 'appliance-repair');
        return {
          id,
          title: svc?.label ?? img.title,
          image: img.image,
          categoryId: 'appliance-repair',
        };
      });
    }

    const categoryId = BROWSE_TAB_CATEGORY[tab];
    const category = serviceCategories.find((c) => c.id === categoryId);
    if (!category) return [];

    return category.services
      .filter((s) => !EMERGENCY_SERVICE_IDS.has(s.id))
      .map((s) => {
        const img = getServiceImage(s.id, categoryId);
        return {
          id: s.id,
          title: s.label,
          image: img.image,
          categoryId,
        };
      });
  }, [tab, hideTabs, lockedTab]);

  const showTabs = !lockedTab && !hideTabs;

  return (
    <Box>
      {showTabs && (
        <Box className="services-browse-tabs-scroll" sx={{ mb: { xs: 3, md: 4 } }}>
          <Box className="services-browse-tabs">
            {SERVICES_BROWSE_TABS.map(({ id, label }) => {
              const Icon = TAB_ICONS[id];
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  className={`services-browse-tab${isActive ? ' is-active' : ''}`}
                  onClick={() => onTabChange(id)}
                >
                  <Icon className="services-browse-tab-icon" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: { xs: 2, md: 2.5 },
        }}
      >
        {items.map((item) => (
          <ServiceShowcaseCard
            key={item.id}
            title={item.title}
            image={item.image}
            onClick={() => navigate(`/services/${item.id}`)}
          />
        ))}
      </Box>

      {items.length === 0 && (
        <Typography
          sx={{
            textAlign: 'center',
            py: 6,
            fontFamily: "'Inter', sans-serif",
            color: '#64748B',
          }}
        >
          No services in this category yet.
        </Typography>
      )}
    </Box>
  );
};

export default ServiceCategoryShowcase;
