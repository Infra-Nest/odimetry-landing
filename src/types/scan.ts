export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ScanType = 'full' | 'quick' | 'custom';
export type PortProtocol = 'tcp' | 'udp';
export type PortState = 'open' | 'closed' | 'filtered';

export interface ScanHost {
  id: number;
  hostname?: string;
  ip_address: string;
}

export interface ScanPort {
  id: number;
  port: number;
  protocol: PortProtocol;
  state: PortState;
  service?: string;
}

export interface Scan {
  id: number;
  organization_id: number;
  client_id?: number;
  asset_id: number;
  asset_name?: string;
  requested_by_user_id: number;
  status: ScanStatus;
  scan_type: ScanType;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  error_message?: string;
  hosts?: ScanHost[];
  ports?: ScanPort[];
}

export interface ScanHistoryFilters {
  organization_id?: number;
  client_id?: number;
  asset_id?: number;
  requested_by_user_id?: number;
  status?: ScanStatus[];
  scan_type?: ScanType[];
  created_from?: string;
  created_to?: string;
  started_from?: string;
  finished_to?: string;
  has_error?: boolean;
  include_deleted?: boolean;
  asset_name?: string;
  hostname?: string;
  ip_address?: string;
  port?: number;
  protocol?: PortProtocol;
  state?: PortState;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'started_at' | 'finished_at';
  order?: 'asc' | 'desc';
}

export interface ScanHistoryResponse {
  total: number;
  limit: number;
  offset: number;
  results: Scan[];
}
