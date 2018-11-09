'use strict';


const BigchainDb = require('bigchaindb-driver');
const CryptoJS = require('crypto-js');
const HDKey = require('ethereumjs-wallet/hdkey');
const SafeBuffer = require('safe-buffer');


function Util(client) {
  this.client = client;
}


Util.prototype.keyPair = function(chain, credentials) {
  if ('bdb' === transaction.chain) {
    return this.keyPairBigchainDb(transaction, keyPair);
  }

  if ('eth' === transaction.chain) {
    return this.keyPairEthereum(transaction, keyPair);
  }

  throw new Error("Failed to resolve keypair - unsupported chain [" + transaction.chain + "].");
}

Util.prototype.keyPairBigchainDb = function(credentials) {
  const token = this.client.auth.getToken();

  if (!token || !token.access_token) {
    throw new Error("Unauthorized.");
  }

  const claims = JSON.parse(atob(token.access_token.split('.')[1]));
  const seed = this.mnemonicToSeed(claims['sub'] + credentials);

  return new BigchainDb.Ed25519Keypair(seed);
}

Util.prototype.keyPairEthereum = function(credentials) {
  const keyPair = this.keyPairBigchainDb(credentials);
  const keyHd = HDKey.fromMasterSeed(SafeBuffer.from(keyPair.privateKey));
  const wallet = keyHd.getWallet();

  return {
    publicKey: wallet.getAddressString(),
    privateKey: wallet.getPrivateKey().toString('hex')
  }
}


Util.prototype.mnemonicToSeed = function(mnemonic) {
  const key = CryptoJS.PBKDF2(
    CryptoJS.enc.Utf8.parse(mnemonic),
    CryptoJS.enc.Utf8.parse('mnemonic'),
    {hasher: CryptoJS.algo.SHA512, keySize: 64, iterations: 2048}
  );

  return this.wordArrayToByteArray(key, 32);
};

Util.prototype.wordToByteArray = function(word, length) {
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

Util.prototype.wordArrayToByteArray = function(wordArray, length) {
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


module.exports = Util;
