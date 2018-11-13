import { Chain, KeyPair, Scope, TransactionAuthorizationChallenge, TransactionHolder } from './interfaces';

import Client = require('./client');


declare class Transactions {
  constructor(client: Client);


  resolve(chain: Chain, transactionId: string, scope?: Scope): Promise<TransactionHolder>;
  resolvePending(transactionId: string): Promise<TransactionHolder>;

  sign(transaction: TransactionHolder, keyPair: KeyPair): Promise<TransactionHolder>;
  signWithPrivateKeyAndCommit(challenge: TransactionAuthorizationChallenge, keyPair: KeyPair): Promise<string>;

  commit(transactionId: string, transaction: TransactionHolder): Promise<string>;

  resolveAuthorizationUrl(challenge: TransactionAuthorizationChallenge, callbackUrl: string): string;
}


export = Transactions;
