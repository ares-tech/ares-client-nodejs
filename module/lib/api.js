'use strict';


const Authenticator = require('./authenticator');
const Client = require('./client');
const Util = require('./util');

const Avatars = require('./avatars');
const Transactions = require('./transactions');
const Wallet = require('./wallet');

const DefaultWeb3Provider = require('./internal/web3');


function Api(config) {
  config.base_url = config.base_url || 'http://localhost:3000/';
//  config.base_url = config.base_url || 'https://fad7177qfa.execute-api.eu-central-1.amazonaws.com/alpha/';

  if (!config.base_url.endsWith('/')) {
    config.base_url += '/';
  }

  config.auth_url = config.auth_url || config.base_url + 'auth';
  config.token_url = config.token_url || config.base_url + 'auth/token';

  config.web3_provider = config.web3_provider || DefaultWeb3Provider(config);

  this.auth = new Authenticator(config);
  this.client = new Client(this.auth, config);
  this.util = new Util(this.client);

  this.avatars = new Avatars(this.client);
  this.transactions = new Transactions(this.client);
  this.wallet = new Wallet(this.client);
}


module.exports = Api;
