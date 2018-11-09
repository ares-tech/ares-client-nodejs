'use strict';


const atob = require('atob');
const base58 = require('bs58');
const nacl = require('tweetnacl');

const CryptoJS = require('crypto-js');
const HDKey = require('hdkey');


function Util(client) {
  this.client = client;
}


Util.prototype.keyPair = function(chain, credentials) {
  if ('bdb' === chain) {
    return this.keyPairBigchainDb(credentials);
  }

  if ('eth' === chain) {
    return this.keyPairEthereum(credentials);
  }

  throw new Error("Failed to resolve keypair - unsupported chain [" + chain + "].");
}

Util.prototype.keyPairBigchainDb = function(credentials) {
  const token = this.client.auth.getToken();

  if (!token || !token.access_token) {
    throw new Error("Unauthorized.");
  }

  const claims = JSON.parse(atob(token.access_token.split('.')[1]));
  const seed = this.mnemonicToSeed(claims['sub'] + credentials);

  const keyPair = nacl.sign.keyPair.fromSeed(seed);

  return {
    publicKey: base58.encode(Buffer.from(keyPair.publicKey)),
    privateKey: base58.encode(Buffer.from(keyPair.secretKey.slice(0, 32)))
  };
}

Util.prototype.keyPairEthereum = function(credentials) {
  const keyPairEd25519 = this.keyPairBigchainDb(credentials);

  const keyHd = HDKey.fromMasterSeed(keyPairEd25519.privateKey);
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

  return Buffer.from(this.wordArrayToByteArray(key, 32));
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
