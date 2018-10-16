

export interface Avatar {
  id?: string;
  name?: string;
  uri?: string;
  image?: string;
}


export type GrantType = 'authorization_code'|'client_credentials';


export interface Config {
  base_url?: string;

  auth_url?: string;
  token_url?: string;

  grant_type: GrantType;
  client_id: string;
  client_secret?: string;
  redirect_uri?: string;
}


export type Method = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';


export interface Response {
  status: number;
  body: string;
}


export interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expiry: number;
}
