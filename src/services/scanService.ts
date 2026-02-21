import type { ScanHistoryFilters, ScanHistoryResponse, Scan } from '../types/scan';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

export interface ScansListResponse {
  items: Scan[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export async function getScans(filter: ScanHistoryFilters & { page?: number; per_page?: number }): Promise<ScansListResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const orgId = localStorage.getItem('organization_id');
  if (!orgId) {
    throw new Error('Organization ID not found. Please log in again.');
  }

  const url = new URL('/scans/history', API_BASE);
  
  const params: Record<string, string> = {
    organization_id: orgId,
    page: (filter.page || 1).toString(),
    per_page: (filter.per_page || 25).toString(),
  };

  if (filter.client_id) {
    params.client_id = filter.client_id.toString();
  }

  if (filter.asset_id) {
    params.asset_id = filter.asset_id.toString();
  }

  if (filter.asset_name) {
    params.asset_name = filter.asset_name;
  }

  if (filter.status && filter.status.length > 0) {
    params.status = filter.status.join(',');
  }

  if (filter.scan_type && filter.scan_type.length > 0) {
    params.scan_type = filter.scan_type.join(',');
  }

  url.search = new URLSearchParams(params).toString();

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      let errorMessage = 'Failed to fetch scans';
      if (Array.isArray(data) && data.length > 0 && data[0].msg) {
        errorMessage = data[0].msg;
      } else if (data?.detail) {
        errorMessage = typeof data.detail === 'string' ? data.detail : 'Failed to fetch scans';
      }
      
      throw new Error(errorMessage);
    }

    // Normalize response to standard format
    let normalizedData: ScansListResponse;
    
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
      normalizedData = {
        items: [],
        meta: {
          page: 1,
          per_page: 25,
          total: 0,
          total_pages: 0,
        },
      };
    }

    return normalizedData;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch scans');
  }
}
