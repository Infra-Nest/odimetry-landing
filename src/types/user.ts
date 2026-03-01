export interface User {
  id: string;
  email: string;
  firstname?: string;
  surname?: string;
  phone_number?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Organization {
  id: string;
  organization_id: string;
  name: string;
  org_type: 'personal' | 'business';
  description?: string;
  website_url?: string;
  tax_id?: string;
  created_at: string;
}

export interface UserOrganization {
  organization_id: string;
  name: string;
  org_type: 'personal' | 'business';
  role?: string;
}
