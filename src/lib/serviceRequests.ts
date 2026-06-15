import { ServiceRequest } from '../data/services';
import { saveServiceRequestToSupabase } from './supabase';

export const STORAGE_KEY = 'smart-appliances-service-requests';

export function saveServiceRequestLocal(request: ServiceRequest): void {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const requests: ServiceRequest[] = existing ? (JSON.parse(existing) as ServiceRequest[]) : [];
    requests.unshift(request);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore localStorage failures
  }
}

export async function persistServiceRequest(request: ServiceRequest): Promise<void> {
  saveServiceRequestLocal(request);

  const { error } = await saveServiceRequestToSupabase(request);
  if (error) {
    throw error;
  }
}
