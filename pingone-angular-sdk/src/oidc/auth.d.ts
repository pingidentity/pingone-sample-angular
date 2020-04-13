
interface ReqOptions {
  scope?: string;
  response_type?: string;
  max_age?: string;
  acr_values?: string;
  nonce?: string;
  prompt?: string;
  state?: string;
}

interface AuthOIDCConfig {
  client_id: string;
  environment_id: string;
  redirect_uri: string;
  post_logout_redirect_uri?: string;
  api_uri?: string;
  auth_uri?: string;
}

export declare class AuthOIDC {
  constructor(config: AuthOIDCConfig);
  init(): Promise<void>;
  signIn(reqOptions: ReqOptions): void;
  signOff(): void;
  isAuthenticated(): boolean;
  showTokenClaimsInfo(): string;
  formatIntoTable(data: any): string;
  setConfig(config: AuthOIDCConfig): void;
  showUserInfo(): string;
  updateUser(firstName: string, lastName: string): Promise<any>;
  formatIntoDescription(json: string): string;
}
