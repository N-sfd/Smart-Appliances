import { ServiceRequest } from '../data/services';
import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface ServiceRequestRow {
  customer_name: string;
  email: string;
  phone: string;
  zip_code: string;
  service_type: string;
  service_category: string;
  product_name: string | null;
  appliance_brand: string | null;
  appliance_model: string | null;
  issue_description: string;
  urgency: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  address: string;
  city: string;
  state: string;
  status: string;
}

export function mapServiceRequestToRow(request: ServiceRequest): ServiceRequestRow {
  const urgency =
    request.servicePriority === 'emergency'
      ? request.urgencyLevel ?? request.requestedResponseTime ?? 'Emergency'
      : request.urgencyLevel;

  return {
    customer_name: request.customerName,
    email: request.email,
    phone: request.phone,
    zip_code: request.zipCode,
    service_type: request.serviceType,
    service_category: request.serviceCategory,
    product_name: request.applianceType ?? request.serviceType,
    appliance_brand: request.applianceBrand,
    appliance_model: request.applianceModel,
    issue_description: request.issueDescription,
    urgency,
    preferred_date: request.preferredDate,
    preferred_time: request.preferredTime ?? request.timeWindow,
    address: request.address,
    city: request.city,
    state: request.state || 'MD',
    status: 'New',
  };
}

export async function saveServiceRequestToSupabase(
  request: ServiceRequest,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from('service_requests')
    .insert([mapServiceRequestToRow(request)]);

  if (error) {
    console.error('Supabase booking error:', error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}
