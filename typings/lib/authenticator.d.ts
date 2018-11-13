import { Chain, Config, KeyPair, Token } from './interfaces';


declare class Authenticator {
  constructor(config: Config);


  resolveToken(): Promise<Token>;

  getToken(): Token;
  setToken(token: Token);

  getAuthorizationUrl(state?: string): string;
  exchangeAuthorizationCode(code: string): Promise<boolean>;

  keyPair(chain: Chain, credentials: string): Promise<KeyPair>;

  keyPairBigchainDb(credentials: string): Promise<KeyPair>;
  keyPairEthereum(credentials: string): Promise<KeyPair>;
}


export = Authenticator;
