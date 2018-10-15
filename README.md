# ares-client-nodejs

A node.js ares API helper library.

[![NPM](https://nodei.co/npm/@ares-dev/arena-client-nodejs.png)](https://nodei.co/npm/@ares-dev/arena-client-nodejs/)


## End User Docs

For detailed usage information and API docs, head out here:

[https://documenter.getpostman.com/view/5572603/RWgqUHvV](https://documenter.getpostman.com/view/5572603/RWgqUHvV)


## Installation

```bash
npm i --save @ares-dev/arena-client-nodejs
```

## Examples


### Include the library

```javascript
const Ares = require('@ares-dev/arena-client-nodejs');
```

### Query the API

Authenticate with your client credentials and query the API on behalf of the (your) user that is associated to those credentials. Please refer to the [API docs]((https://documenter.getpostman.com/view/5572603/RWgqUHvV)) for details on how to obtain client credentials.

```javascript
// Setup authentication using oauth2 client credentials flow.
const api = new Ares.Api({
  grant_type: 'client_credentials',
  client_id: '{{client_id}}',
  client_secret: '{{client_secret}}'
});


// Resolve avatar(s) for authenticated user.
api.avatars.get().then(response => {
  console.log(response);
});
```

### Query the API on behalf of another user

You may obtain authorization of other users, for example users of your client application, to query the API on their behalf. Please refer to the [API docs]((https://documenter.getpostman.com/view/5572603/RWgqUHvV)) for details on how to obtain client credentials.

Please Note that the steps 2 - 5 are only necessary to obtain initial authorization. As soon as you have obtained an access & refresh token, and are able to store those securely, you may skip directly to step 6 and let the client sdk take care of refreshing your token.

```javascript
// 1. Setup authentication using oauth2 client authorization code flow.
const api = new Ares.Api({
  grant_type: 'authorization_code',
  client_id: '{{client_id}}',
  client_secret: '{{client_secret}}',
  redirect_uri: '{{redirect_uri}}'
});

// 2. Resolve authorization url.
const authorizationUrl = api.auth.getAuthorizationUrl();
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
api.avatars.get().then(response => {
  console.log(response);
});
```
