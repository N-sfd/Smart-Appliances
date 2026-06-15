import React from 'react';
import ServiceCategoryPageLayout from '../components/ServiceCategoryPageLayout';
import { SERVICE_CATEGORY_PAGE_MAP } from '../data/serviceCategoryPages';

interface ServiceCategoryPageProps {
  slug: keyof typeof SERVICE_CATEGORY_PAGE_MAP;
}

const ServiceCategoryPage: React.FC<ServiceCategoryPageProps> = ({ slug }) => {
  const config = SERVICE_CATEGORY_PAGE_MAP[slug];
  return <ServiceCategoryPageLayout config={config} />;
};

export default ServiceCategoryPage;
