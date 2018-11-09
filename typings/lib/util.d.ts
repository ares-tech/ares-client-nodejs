import { Chain, KeyPair, TransactionHolder } from './interfaces';

import Client = require('./client');


declare class Util {
  constructor(client: Client);


  keyPair(chain: Chain, credentials: string): KeyPair;

  keyPairBigchainDb(credentials: string): KeyPair;
  keyPairEthereum(credentials: string): KeyPair;
}


export = Util;
