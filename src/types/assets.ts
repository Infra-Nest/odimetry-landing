export type AssetStatus = 'active' | 'inactive' | 'maintenance' | 'retired' | 'pending';

export interface Asset {
  id: string;
  name: string;
  label?: string;
  type: string;
  category?: string;
  serial?: string;
  asset_tag?: string;
  status?: AssetStatus;
  organization_id: string;
  owner_id?: string;
  assigned_to?: string;
  location?: string;
  purchase_date?: string;
  warranty?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface AssetsListResponse {
  items: Asset[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface AssetsFilter {
  status?: AssetStatus;
  search?: string;
  page?: number;
  per_page?: number;
}
