export type AssetType = 'domain' | 'host' | 'ip';

export interface Asset {
  id: number;
  organization_id: number;
  client_id: number;
  type: AssetType;
  value: string;
  label?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetListFilters {
  organization_id: number;
  client_id?: number;
  authorized_only?: boolean;
  limit?: number;
  offset?: number;
}
