import * as Interfaces from './lib/interfaces';

import Api = require('./lib/api');


interface Constructor<T> {
  new (config: Interfaces.Config): T;
}


declare namespace Ares {
  export const Api: Constructor<Api>;

  export type Avatar = Interfaces.Avatar;
  export type Balance = Interfaces.Balance;
  export type Config = Interfaces.Config;
  export type Chain = Interfaces.Chain;
  export type GrantType = Interfaces.GrantType;
  export type KeyPair = Interfaces.KeyPair;
  export type Method = Interfaces.Method;
  export type Response = Interfaces.Response;
  export type Scope = Interfaces.Scope;
  export type Token = Interfaces.Token;
  export type TransactionAuthorizationChallenge = Interfaces.TransactionAuthorizationChallenge;
  export type TransactionHolder = Interfaces.TransactionHolder;
}


export = Ares;
