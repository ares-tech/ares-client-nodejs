import { Balance, Chain, Scope, TransactionAuthorizationChallenge } from './interfaces';

import Client = require('./client');


declare class Wallet {
  constructor(client: Client);


  balance(chain?: Chain): Promise<Balance>;

  stake(chain: Chain, amount: string): Promise<TransactionAuthorizationChallenge>;
  transfer(chain: Chain, scope: Scope, recipient: string, amount: string, message?: string): Promise<TransactionAuthorizationChallenge>;
}


export = Wallet;
