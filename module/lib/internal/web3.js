'use strict';


const Web3 = require('web3');


function DefaultWeb3Provider(config) {
  if ('undefined' !== typeof(web3)
    && 'currentProvider' in web3
    && web3.currentProvider) {
    return web3.currentProvider;
  }

  // TODO Resolve from api.
  config.web3_provider_url = config.web3_provider_url || 'http://localhost:8545/';

  if (!config.web3_provider_url.endsWith('/')) {
    config.web3_provider_url += '/';
  }

  return new Web3.providers.HttpProvider(config.web3_provider_url);
}


module.exports = DefaultWeb3Provider;
