import * as Interfaces from './lib/interfaces';

import Api = require('./lib/api');


interface Constructor<T> {
  new (config: Interfaces.Config): T;
}


declare namespace Ares {
  export const Api: Constructor<Api>;

  export const Chain: typeof Interfaces.Chain;
  export const GrantType: typeof Interfaces.GrantType;
  export const Method: typeof Interfaces.Method;
  export const Scope: typeof Interfaces.Scope;

  export type Avatar = Interfaces.Avatar;
  export type Config = Interfaces.Config;
  export type KeyPair = Interfaces.KeyPair;
  export type Response = Interfaces.Response;
  export type Token = Interfaces.Token;
  export type TransactionAuthorizationChallenge = Interfaces.TransactionAuthorizationChallenge;
  export type TransactionHolder = Interfaces.TransactionHolder;
}


export = Ares;
