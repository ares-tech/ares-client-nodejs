import { Config } from './interfaces';

import Authenticator = require('./authenticator');
import Client = require('./client');
import Util = require('./util');

import Avatars = require('./avatars');
import Transactions = require('./transactions');
import Wallet = require('./wallet');


declare class Api {
  constructor(config: Config);


  auth: Authenticator;
  client: Client;
  util: Util;

  avatars: Avatars;
  transactions: Transactions;
  wallet: Wallet;
}


export = Api;
