

export interface Config {
  base_url?: string;

  auth_url?: string;
  token_url?: string;

  grant_type: string;
  client_id: string;
  client_secret?: string;
  redirect_uri?: string;
}
