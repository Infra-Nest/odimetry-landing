export type AuthorityFileStatus = 'pending' | 'approved' | 'rejected';
export type StorageBackend = 'database' | 's3';

export interface AuthorityFile {
  id: number;
  organization_id: number;
  client_id?: number | null;
  asset_id?: number | null;
  domain?: string | null;
  filename: string;
  content_type: string;
  file_size: number;
  storage_backend: StorageBackend;
  status: AuthorityFileStatus;
  consent_accepted: boolean;
  terms_accepted: boolean;
  uploaded_by_user_id: number;
  reviewed_by_user_id?: number | null;
  review_note?: string | null;
  verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadAuthorityFileRequest {
  organization_id: number;
  file: File;
  consent_accepted: boolean;
  terms_accepted: boolean;
  client_id?: number | null;
  asset_id?: number | null;
  domain?: string | null;
}
