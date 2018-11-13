'use strict';


const Chain = require('./chain');


function Wallet(client) {
  this.client = client;
}


Wallet.prototype.balance = function(chain) {
  return new Promise((resolve, reject) => {
    if (!chain) {
      chain = Chain.Ethereum;
    }

    if (Chain.BigchainDb === chain) {
      throw new Error('BigchainDB is currently not supported.');
    }

    const request = this.client.get('wallet/' + chain + '/balance');

    this.client.resolve(request)
      .then(response => {
        if (200 === response.status) {
          resolve(JSON.parse(response.body));
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
};

Wallet.prototype.stake = function(chain, amount) {
  return new Promise((resolve, reject) => {
    if (!chain) {
      chain = Chain.Ethereum;
    }

    if (Chain.BigchainDb === chain) {
      throw new Error('BigchainDB is currently not supported.');
    }

    const data = {
      amount: amount
    };

    const request = this.client.put('wallet/' + chain);

    this.client.resolve(request, data)
      .then(response => {
        if (201 === response.status) {
          resolve({
            transactionId: response.header['x-ares-created-id'],
            authorizationUrl: response.header['location']
          });
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
};

Wallet.prototype.transfer = function(chain, scope, recipient, amount, message) {
  return new Promise((resolve, reject) => {
    if (!chain) {
      chain = Chain.Ethereum;
    }

    if (Chain.BigchainDb === chain) {
      throw new Error('BigchainDB is currently not supported.');
    }

    const data = {
      scope: scope,
      recipient: recipient,
      amount: amount,
      message: message ? message : ''
    };

    const request = this.client.post('wallet/' + chain);

    this.client.resolve(request, data)
      .then(response => {
        if (201 === response.status) {
          resolve({
            transactionId: response.header['x-ares-created-id'],
            authorizationUrl: response.header['location']
          });
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
};


module.exports = Wallet;
