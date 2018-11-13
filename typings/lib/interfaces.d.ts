

export enum Chain {
  BigchainDb = 'bdb',
  Ethereum = 'eth'
}


export enum Scope {
  Root = 'root',
  Child = 'child'
}


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
  chain: Chain;
  scope: Scope;
  value: any;
}


export interface TransactionAuthorizationChallenge {
  transactionId: string;
  authorizationUrl: string;
}


export enum GrantType {
  AuthorizationCode = 'authorization_code',
  ClientCredentials = 'client_credentials'
}


export interface Config {
  base_url?: string;

  auth_url?: string;
  token_url?: string;

  grant_type: GrantType;
  client_id: string;
  client_secret?: string;
  redirect_uri?: string;
}


export enum Method {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT'
}


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
