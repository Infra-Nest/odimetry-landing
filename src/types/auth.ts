export type OrgType = 'personal' | 'business';

export interface LoginRequest {
  email: string;
  password: string;
  rememberDevice?: boolean;
}

export interface CreateUserRequest {
  user: {
    organization_id?: number | null;
    email: string;
    password: string;
    firstname?: string | null;
    surname?: string | null;
    profile_image_url?: string | null;
    phone_number?: string | null;
  };
  organization?: {
    name: string;
    org_type: 'personal' | 'business';
    description?: string | null;
    website_url?: string | null;
    tax_id?: string | null;
    legal_address_line?: string | null;
    legal_city?: string | null;
    legal_postal_code?: string | null;
    legal_country?: string | null;
  } | null;
}