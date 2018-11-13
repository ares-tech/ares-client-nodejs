'use strict';


const atob = require('atob');
const base58 = require('bs58');
const nacl = require('tweetnacl');
const querystring = require('querystring');

const CryptoJS = require('crypto-js');
const HDKey = require('ethereumjs-wallet/hdkey');


const Chain = require('./chain');
const Method = require('./method');
const GrantType = require('./granttype');
const Request = require('./request');


function Authenticator(config) {
  this.config = config;
  this.token = null;
  this.authorizationCode = null;
}


Authenticator.prototype.resolveAuthorizationUrl = function(state) {
  const parameters = {
    response_type: 'code',
    client_id: this.config.client_id,
    redirect_uri: this.config.redirect_uri,
    scope: 'account'
  };

  if (state) {
    parameters.state = state;
  }

  return this.config.auth_url + '?' + querystring.stringify(parameters);
}

Authenticator.prototype.exchangeAuthorizationCode = function(code) {
  return new Promise(resolve => {
    const request = new Request(Method.POST, this.config.token_url);

    const data = {};
    data.grant_type = GrantType.AuthorizationCode;
    data.code = code;
    data.client_id = this.config.client_id;
    if (this.config.client_secret) {
      data.client_secret = this.config.client_secret;
    }
    data.redirect_uri = this.config.redirect_uri;

    request.resolve(data).then(response => {
      var exchanged = false;

      if (response.body) {
        this.setToken(JSON.parse(response.body));

        exchanged = true;
      }

      resolve(exchanged);
    });
  });
}

Authenticator.prototype.resolveToken = function(token) {
  return new Promise(resolve => {
    if (this.token) {
      resolve(this.token);

      return;
    }

    this.refresh().then(resolve);
  });
}

Authenticator.prototype.getToken = function(token) {
  return this.token;
}

Authenticator.prototype.setToken = function(token) {
  this.token = token;
}

Authenticator.prototype.refresh = function() {
  return new Promise(resolve => {
    const request = new Request(Method.POST, this.config.token_url);

    const data = {};

    if (this.token && this.token.refresh_token) {
      data.grant_type = 'refresh_token';
      data.client_id = this.config.client_id;
      if (this.config.client_secret) {
        data.client_secret = this.config.client_secret;
      }
      data.refresh_token = this.token.refresh_token;
    } else if (GrantType.ClientCredentials === this.config.grant_type) {
      data.grant_type = GrantType.ClientCredentials;
      data.client_id = this.config.client_id;
      if (this.config.client_secret) {
        data.client_secret = this.config.client_secret;
      }
      data.scope = 'account owner';
    }

    request.resolve(data).then(response => {
      if (response.body) {
        this.setToken(JSON.parse(response.body));
      }

      resolve(this.token);
    });
  });
}

Authenticator.prototype.resolve = function(request, data) {
  if (this.token) {
    request.setHeader('Authorization', this.token.token_type + ' ' + this.token.access_token);
  }

  return new Promise(resolve => {
    request.resolve(data).then(response => {
      if (401 === response.status) {
        this.refresh().then(token => {
          if (token && token.access_token) {
            request.setHeader('Authorization', token.token_type + ' ' + token.access_token);
          }

          request.resolve(data).then(response => {
            resolve(response);
          });
        });
      } else {
        resolve(response);
      }
    });
  });
}


Authenticator.prototype.keyPair = function(chain, credentials) {
  if (Chain.BigchainDb === chain) {
    return this.keyPairBigchainDb(credentials);
  }

  if (Chain.Ethereum === chain) {
    return this.keyPairEthereum(credentials);
  }

  throw new Error('Failed to resolve keypair - unsupported chain [' + chain + '].');
}

Authenticator.prototype.keyPairBigchainDb = function(credentials) {
  return new Promise(resolve => {
    this.resolveToken().then(token => {
      const claims = JSON.parse(atob(token.access_token.split('.')[1]));
      const seed = this.mnemonicToSeed(claims['sub'] + credentials);

      const keyPair = nacl.sign.keyPair.fromSeed(seed);

      resolve({
        publicKey: base58.encode(Buffer.from(keyPair.publicKey)),
        privateKey: base58.encode(Buffer.from(keyPair.secretKey.slice(0, 32)))
      });
    });
  });
}

Authenticator.prototype.keyPairEthereum = function(credentials) {
  return new Promise(resolve => {
    this.keyPairBigchainDb(credentials).then(keyPairEd25519 => {
      const keyHd = HDKey.fromMasterSeed(keyPairEd25519.privateKey);
      const wallet = keyHd.getWallet();

      resolve({
        publicKey: wallet.getAddressString(),
        privateKey: wallet.getPrivateKey().toString('hex')
      });
    });
  });
}


Authenticator.prototype.mnemonicToSeed = function(mnemonic) {
  const key = CryptoJS.PBKDF2(
    CryptoJS.enc.Utf8.parse(mnemonic),
    CryptoJS.enc.Utf8.parse('mnemonic'),
    {hasher: CryptoJS.algo.SHA512, keySize: 64, iterations: 2048}
  );

  return Buffer.from(this.wordArrayToByteArray(key, 32));
};

Authenticator.prototype.wordToByteArray = function(word, length) {
  const ba = [];
  const xFF = 0xFF;

  if (0 < length) {
    ba.push(word >>> 24);
  }

  if (1 < length) {
    ba.push((word >>> 16) & xFF);
  }

  if (2 < length) {
    ba.push((word >>> 8) & xFF);
  }

  if (3 < length) {
    ba.push(word & xFF);
  }

  return ba;
};

Authenticator.prototype.wordArrayToByteArray = function(wordArray, length) {
  const result = [];

  let bytes;
  let i = 0;

  while (0 < length) {
    bytes = this.wordToByteArray(wordArray.words[i], Math.min(4, length));
    length -= bytes.length;
    result.push(bytes);
    i++;
  }

  return new Uint8Array([].concat.apply([], result));
};


module.exports = Authenticator;
