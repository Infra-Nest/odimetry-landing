import type { AssetsListResponse, AssetsFilter, Asset } from '../types/assets';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function getAssets(filter: AssetsFilter): Promise<AssetsListResponse> {

  const orgId = localStorage.getItem('organization_id');
  
  if (!orgId) {
    throw new Error('Organization ID not found. Please log in again.');
  }

  const url = new URL('/assets', API_BASE);
  const params: Record<string, string> = {
    organization_id: orgId,
    page: (filter.page || 1).toString(),
    per_page: (filter.per_page || 25).toString(),
  };

  if (filter.status) {
    params.status = filter.status;
  }

  if (filter.search) {
    params.search = filter.search;
  }

  url.search = new URLSearchParams(params).toString();

  const res = await fetchWithAuth(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    
    // Parse API error message
    let errorMessage = 'Failed to fetch assets';
    if (Array.isArray(data) && data.length > 0 && data[0].msg) {
      errorMessage = data[0].msg;
    } else if (data?.detail) {
      errorMessage = typeof data.detail === 'string' ? data.detail : 'Failed to fetch assets';
    }
    
    throw new Error(errorMessage);
  }

  // Handle different response structures
  let normalizedData: AssetsListResponse;
  
  if (data?.items && data?.meta) {
    normalizedData = data;
  } else if (Array.isArray(data)) {
    normalizedData = {
      items: data,
      meta: {
        page: filter.page || 1,
        per_page: filter.per_page || 25,
        total: data.length,
        total_pages: 1,
      },
    };
  } else if (data?.data && Array.isArray(data.data)) {
    normalizedData = {
      items: data.data,
      meta: {
        page: data.pagination?.page || filter.page || 1,
        per_page: data.pagination?.per_page || filter.per_page || 25,
        total: data.pagination?.total || data.data.length,
        total_pages: data.pagination?.total_pages || 1,
      },
    };
  } else {
    throw new Error('Unexpected API response structure');
  }

  return normalizedData;
}

export async function createAsset(assetData: Partial<Asset>): Promise<Asset> {
  const res = await fetchWithAuth(`${API_BASE}/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assetData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    
    let errorMessage = 'Failed to create asset';
    if (data?.detail) {
      errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    } else if (Array.isArray(data) && data.length > 0 && data[0].msg) {
      errorMessage = data[0].msg;
    }
    
    throw new Error(errorMessage);
  }

  return data;
}
