export interface GoogleIntegrationStatus {
  configured: boolean;
  connected: boolean;
  calendar_id: string | null;
  connected_at: string | null;
}

export interface GoogleConnectUrl {
  url: string;
}

export interface GoogleDisconnectResponse {
  disconnected: true;
}
