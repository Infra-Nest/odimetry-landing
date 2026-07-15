export type OrgType = 'personal' | 'business';

export interface UserOrganization {
  id: number;
  name: string;
  org_type: OrgType;
  role: string;
}
