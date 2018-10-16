'use strict';


const Authenticator = require('./authenticator');
const Avatars = require('./avatars');
const Client = require('./client');


function Api(config) {
  config.base_url = config.base_url || 'https://fad7177qfa.execute-api.eu-central-1.amazonaws.com/alpha/';

  if (!config.base_url.endsWith('/')) {
    config.base_url += '/';
  }

  config.auth_url = config.auth_url || config.base_url + 'auth';
  config.token_url = config.token_url || config.base_url + 'auth/token';

  this.auth = new Authenticator(config);
  this.client = new Client(this.auth, config);
  this.avatars = new Avatars(this.client);
}


module.exports = Api;
