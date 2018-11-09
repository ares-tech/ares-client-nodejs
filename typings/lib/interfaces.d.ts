

export interface Avatar {
  id?: string;
  name?: string;
  uri?: string;
  image?: string;
}


export interface Balance {
  available: string;
  staked: string;
}


export interface KeyPair {
  publicKey: string;
  privateKey: string;
}


export interface TransactionHolder {
  chain: string;
  scope: string;
  value: any;
}


export interface TransactionAuthorizationChallenge {
  transactionId: string;
  authorizationUrl: string;
}


export type Chain = 'eth'|'bdb';
export type Scope = 'root'|'child';


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
