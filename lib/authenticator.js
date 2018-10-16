const querystring = require('querystring');

const Request = require('./request');


function Authenticator(config) {
  this.config = config;
  this.token = null;
  this.authorizationCode = null;
}

Authenticator.prototype.getAuthorizationUrl = function(state) {
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
  const self = this;

  return new Promise(resolve => {
    const request = new Request('POST', this.config.token_url);

    const data = {};
    data.grant_type = 'authorization_code';
    data.code = code;
    data.client_id = self.config.client_id;
    if (self.config.client_secret) {
      data.client_secret = self.config.client_secret;
    }
    data.redirect_uri = self.config.redirect_uri;

    request.resolve(data).then(response => {
      var exchanged = false;

      if (response.body) {
        self.setToken(JSON.parse(response.body));

        exchanged = true;
      }

      resolve(exchanged);
    });
  });
}

Authenticator.prototype.getToken = function(token) {
  return this.token;
}

Authenticator.prototype.setToken = function(token) {
  this.token = token;
}

Authenticator.prototype.refresh = function() {
  const self = this;

  return new Promise(resolve => {
    const request = new Request('POST', this.config.token_url);

    const data = {};

    if (self.token && self.token.refresh_token) {
      data.grant_type = 'refresh_token';
      data.client_id = self.config.client_id;
      if (self.config.client_secret) {
        data.client_secret = self.config.client_secret;
      }
      data.refresh_token = self.token.refresh_token;
    } else if ('client_credentials' === self.config.grant_type) {
      data.grant_type = 'client_credentials';
      data.client_id = self.config.client_id;
      if (self.config.client_secret) {
        data.client_secret = self.config.client_secret;
      }
      data.scope = 'account owner';
    }

    request.resolve(data).then(response => {
      if (response.body) {
        self.setToken(JSON.parse(response.body));
      }

      resolve(self.token);
    });
  });
}

Authenticator.prototype.resolve = function(request) {
  const self = this;

  if (self.token) {
    request.setHeader('Authorization', self.token.token_type + ' ' + self.token.access_token);
  }

  return new Promise(resolve => {
    request.resolve().then(response => {
      if (401 === response.status) {
        self.refresh().then(token => {
          if (token && token.access_token) {
            request.setHeader('Authorization', token.token_type + ' ' + token.access_token);
          }

          request.resolve().then(response => {
            resolve(response);
          });
        });
      } else {
        resolve(response);
      }
    });
  });
}


module.exports = Authenticator;
