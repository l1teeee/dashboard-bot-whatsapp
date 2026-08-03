export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiErrorBody };

export interface ApiErrorBody {
  code: string;
  message: string;
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message = 'No se pudo conectar con el servidor') {
    super(message);
    this.name = 'NetworkError';
  }
}

export type Role = 'owner' | 'staff';

export interface Account {
  id: number;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'disabled';
  created_at: string;
}

export interface TenantSummary {
  id: number;
  name: string;
  menu_link: string | null;
}

export interface SessionData {
  account: Account;
  tenant: TenantSummary | null;
  access_token: string;
  expires_in: number;
}

export interface Invitation {
  id: number;
  email: string;
  role: Role;
  expires_at: string;
}

export interface Settings {
  id: number;
  name: string;
  slug: string;
  menu_link: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp_token_configured: boolean;
}

export interface RegistrationStatus {
  open: boolean;
  requires_code: boolean;
}
