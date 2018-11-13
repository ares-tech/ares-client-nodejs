import { Config } from './interfaces';

import Authenticator = require('./authenticator');
import Client = require('./client');

import Avatars = require('./avatars');
import Transactions = require('./transactions');
import Wallet = require('./wallet');


declare class Api {
  constructor(config: Config);


  auth: Authenticator;
  client: Client;

  avatars: Avatars;
  transactions: Transactions;
  wallet: Wallet;
}


export = Api;
