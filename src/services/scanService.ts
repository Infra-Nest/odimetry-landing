import type { ScanHistoryFilters, ScanHistoryResponse } from '../types/scan';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function getScanHistory(
  filters: ScanHistoryFilters,
  token: string
): Promise<ScanHistoryResponse> {
  const params = new URLSearchParams();

  // Add filters to query params
  if (filters.organization_id) params.append('organization_id', String(filters.organization_id));
  if (filters.client_id) params.append('client_id', String(filters.client_id));
  if (filters.asset_id) params.append('asset_id', String(filters.asset_id));
  if (filters.requested_by_user_id) params.append('requested_by_user_id', String(filters.requested_by_user_id));
  if (filters.status?.length) {
    filters.status.forEach(s => params.append('status', s));
  }
  if (filters.scan_type?.length) {
    filters.scan_type.forEach(t => params.append('scan_type', t));
  }
  if (filters.created_from) params.append('created_from', filters.created_from);
  if (filters.created_to) params.append('created_to', filters.created_to);
  if (filters.started_from) params.append('started_from', filters.started_from);
  if (filters.finished_to) params.append('finished_to', filters.finished_to);
  if (filters.has_error !== undefined) params.append('has_error', String(filters.has_error));
  if (filters.include_deleted) params.append('include_deleted', String(filters.include_deleted));
  if (filters.asset_name) params.append('asset_name', filters.asset_name);
  if (filters.hostname) params.append('hostname', filters.hostname);
  if (filters.ip_address) params.append('ip_address', filters.ip_address);
  if (filters.port) params.append('port', String(filters.port));
  if (filters.protocol) params.append('protocol', filters.protocol);
  if (filters.state) params.append('state', filters.state);
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.offset !== undefined) params.append('offset', String(filters.offset));
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.order) params.append('order', filters.order);

  const res = await fetch(`${API_BASE}/scans/history?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error('Scan history error response:', data);
    throw new Error(
      data?.detail
        ? JSON.stringify(data.detail, null, 2)
        : 'Failed to fetch scan history'
    );
  }

  return data;
}
