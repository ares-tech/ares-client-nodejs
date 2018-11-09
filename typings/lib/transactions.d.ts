import { Chain, KeyPair, Scope, TransactionAuthorizationChallenge, TransactionHolder } from './interfaces';

import Client = require('./client');


declare class Transactions {
  constructor(client: Client);


  get(chain: Chain, transactionId: string, scope?: Scope): Promise<TransactionHolder>;

  pending(transactionId: string): Promise<TransactionHolder>;

  sign(transaction: TransactionHolder, keyPair: KeyPair): Promise<TransactionHolder>;
  commit(transactionId: string, transaction: TransactionHolder): Promise<string>;

  signWithPrivateKeyAndCommit(challenge: TransactionAuthorizationChallenge, keyPair: KeyPair): Promise<string>;
  signWithAuthorizationUrlAndCommit(challenge: TransactionAuthorizationChallenge, callbackUrl: string): Promise<any>;
}


export = Transactions;
