import React from 'react';
import ServiceLandingPageLayout from '../components/ServiceLandingPageLayout';
import { getServiceLandingPageConfig } from '../data/serviceLandingPages';

interface ServiceLandingPageProps {
  slug: string;
}

const ServiceLandingPage: React.FC<ServiceLandingPageProps> = ({ slug }) => {
  const config = getServiceLandingPageConfig(slug);
  if (!config) return null;
  return <ServiceLandingPageLayout config={config} />;
};

export default ServiceLandingPage;
