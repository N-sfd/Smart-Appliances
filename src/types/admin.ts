// DB-shaped types for the admin module. Named with a `Db` prefix where a
// same-named type already exists for the static fallback data in
// src/data/experts.ts (Expert/ExpertService/ExpertReview) to avoid collisions.

export interface DbExpert {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  review_count: number;
  jobs_completed: string | null;
  response_time: string | null;
  service_areas: string[] | null;
  specialties: string[] | null;
  starting_fee: number | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbExpertService {
  id: string;
  expert_id: string;
  service_name: string;
  service_category: string | null;
  service_type: string | null;
  starting_price: number | null;
  quote_required: boolean;
  product_name: string | null;
  display_order: number;
}

export interface DbExpertReview {
  id: string;
  expert_id: string;
  customer_first_name: string | null;
  rating: number | null;
  service_type: string | null;
  review_text: string | null;
  review_date: string | null;
  is_verified: boolean;
  is_demo: boolean;
}

export interface MembershipLead {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  selected_membership_plan: string | null;
  request_number: string | null;
  created_at?: string;
  membership_status: string;
}

export interface AdminKpi {
  total: number;
  newCount: number;
  newLeads: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  emergency: number;
  emailSent: number;
  emailPending: number;
  membershipInterested: number;
  expertRequestedCount: number;
}
