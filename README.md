# @ares-dev/client-nodejs

A node.js ares API helper library.

[![NPM](https://nodei.co/npm/@ares-dev/client-nodejs.png?downloads=true)](https://nodei.co/npm/@ares-dev/client-nodejs/)


## End User Docs

For detailed usage information and API docs, head out here:

[https://documenter.getpostman.com/view/5572603/RWgqUHvV](https://documenter.getpostman.com/view/5572603/RWgqUHvV)


## Installation

```bash
npm install --save @ares-dev/client-nodejs
```


## Compatibility

### Browser / Angular

```typescript
import * as Ares from '@ares-dev/client-nodejs';


const api = new Ares.Api();

const avatars = await api.avatars.resolve();
```

### Browser / Javascript

Browserified versions for plain javascript are located at `bundles/`.

```html
<script src="bundles/ares.standalone.js"></script>
```

```javascript
const api = new Ares.Api();

api.avatars.resolve().then(response => {
  console.log(response);
});
```

### node.js / Javascript

```typescript
const Ares = require('@ares-dev/client-nodejs');


const api = new Ares.Api();

const avatars = await api.avatars.resolve();
```

### Typescript

```typescript
import * as Ares from '@ares-dev/client-nodejs';


const api = new Ares.Api();

const avatars = await api.avatars.resolve();
```


## API

### Authentication

#### Immediate Authentication / oauth2 Client Credentials Flow

Authenticate with your client credentials and query the API on behalf of the user that is associated to those credentials (typically your user). Please refer to the [API docs](https://documenter.getpostman.com/view/5572603/RWgqUHvV) for details on how to obtain client credentials.

```javascript
// Setup authentication using oauth2 client credentials flow.
const api = new Ares.Api({
  grant_type: 'client_credentials',
  client_id: '{{client_id}}',
  client_secret: '{{client_secret}}'
});


// Resolve avatar(s) for authenticated user.
api.avatars.resolve().then(response => {
  console.log(response);
});
```

#### Intermediate Authentication / oauth2 Authorization Code Flow

You may request authorization of other users, for example users of your application, to query the API on their behalf. Please refer to the [API docs](https://documenter.getpostman.com/view/5572603/RWgqUHvV) for details on how to obtain client credentials.

Please note that the steps 2 - 5 are only necessary to initially request authorization. As soon as you have resolved an access & refresh token pair, and are able to store those securely, you may skip directly to step 6 and let the client sdk take care of refreshing your token.

```javascript
// 1. Setup authentication using oauth2 client authorization code flow.
const api = new Ares.Api({
  grant_type: 'authorization_code',
  client_id: '{{client_id}}',
  client_secret: '{{client_secret}}',
  redirect_uri: '{{redirect_uri}}'
});

// 2. Resolve authorization url.
const authorizationUrl = api.auth.resolveAuthorizationUrl();
// 3. Open the authorization url in a browser and present it to the user you want to ask for authorization.
// 4. Above configured redirect_uri will receive an authorization code if the user confirms the request.
// 5. Exchange authorization code for an access token.
api.auth.exchangeAuthorizationCode('3081034186f4cc10e7fec...')
  .then(ok => {
    if (ok) {
      // The access token will come together with a refresh token.
      // You may persist the refresh token (securely) to refresh your access token later
      // without asking the user again for permission.
      console.log(api.auth.getToken());
    }
  }
);

// 6. Configure previously persisted access/refresh token pair.
api.auth.setToken({
  access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  refresh_token: '4853e5d884ee5e928fc4ea4f2eea9681e83d...',
  token_type: 'Bearer',
  expiry: 3600
});

// Resolve avatar(s) for the user we obtained authorization of.
api.avatars.resolve().then(response => {
  console.log(response);
});
```

#### Intermediate Authentication w/ Public Client

There are cases where its not possible to securely store a secret, for example in mobile or desktop applications. For those situations you may create & use *public* client credentials. Those work without a secret, however only with the authorization_code flow, as detailed above. Please refer to the [API docs](https://documenter.getpostman.com/view/5572603/RWgqUHvV) for details on how to obtain client credentials.


### Avatars

#### resolve()

Resolve avatar(s) for the user we authenticated as / obtained authorization of.

```typescript
const avatars = await api.avatars.resolve();
```


### Wallet

#### balance(chain: Chain, scope?: Scope)

Resolve balance for given chain and the user we authenticated as / obtained authorization of.

```typescript
// Root-chain balance
const balance = await api.wallet.balance(Ares.Chain.Ethereum);

// Staked / child-chain balance
const balance = await api.wallet.balance(Ares.Chain.Ethereum, Ares.Scope.Child);
```

#### stake(chain: Chain, amount: string)

Stake `15.9 ETH` from root to child-chain. Amount is denominated in Wei. Returns an authorization challenge `TransactionAuthorizationChallenge`.

```typescript
const challenge = await api.wallet.stake(Ares.Chain.Ethereum, 15900000000000000000);
```

#### transfer(chain: Chain, amount: string)

Transfer `15.9 ETH` to `0x2b9bbd09ea584fccc972b069331a6ec5be390b39` on root chain. Amount is denominated in Wei. Returns an authorization challenge `TransactionAuthorizationChallenge`.

```typescript
const challenge = await api.wallet.transfer(Ares.Chain.Ethereum, Ares.Scope.Root, '0x2b9bbd09ea584fccc972b069331a6ec5be390b39', 15900000000000000000, 'Optional Message');
```


### Transactions

#### resolvePending(transactionId: string)

Resolve pending transaction for a previously received authorization challenge. Returns `TransactionHolder`.

```typescript
const transaction = await api.transactions.resolvePending(challenge.transactionId);
```

#### sign(transaction: TransactionHolder, keyPair: KeyPair)

Sign a pending transaction using a keypair.

```typescript
// Resolve keypair for chain specified in transaction, given client authorization and credentials.
const keyPair = await api.auth.keyPair(transaction.chain, 's3cr3t');

// Sign transaction.
const signed = await api.transactions.sign(transaction, keyPair);
```

#### commit(transactionId: string, signed: TransactionHolder)

Commit signed pending transaction using previously received authorization challenge.

```typescript
const transactionId = await api.transactions.commit(challenge.transactionId, signed);
```

#### signWithPrivateKeyAndCommit(challenge: TransactionAuthorizationChallenge, keyPair: KeyPair)

Convenience method - resolves pending transaction, signs & commits. Returns id of committed transaction for underlying blockchain.

```typescript
const transactionId = await api.transactions.signWithPrivateKeyAndCommit(challenge, keyPair);
```

#### resolveAuthorizationUrl(challenge: TransactionAuthorizationChallenge, callbackUrl: string)

Convenience method - If transaction has been created on behalf of another user and private key is not available. Use this method to generate an authorization url that can be presented to the user for confirmation & signing. On error / success, given callbackUrl is invoked accordingly with an error or the id of committed transaction, using query parameters `error` or `transaction_id` respectively.

```typescript
const authorizationUrl = await api.transactions.resolveAuthorizationUrl(challenge, callbackUrl);
```

#### resolve(chain: Chain, transactionId: string, scope?: Scope)

Resolve transaction for given chain and transaction id. Returns `TransactionHolder`.

```typescript
const transaction = await api.transactions.resolve(Ares.Chain.Ethereum, transactionId);
```
