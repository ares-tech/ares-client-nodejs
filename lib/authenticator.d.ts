import Config = require('./config');
import Token = require('./token');


declare class Authenticator {
  constructor(config: Config);


  getToken(): Token;
  setToken(token: Token);

  getAuthorizationUrl(state?: string): string;
  exchangeAuthorizationCode(code: string): Promise<boolean>;
}


export = Authenticator;
