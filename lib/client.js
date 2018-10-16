'use strict';


const Request = require('./request');


function Client(auth, config) {
  this.auth = auth;
  this.config = config;
}


Client.prototype.resolve = function(request) {
  return this.auth.resolve(request);
}

Client.prototype.request = function(method, resource) {
  return new Request(method, this.uri(resource));
}

Client.prototype.get = function(resource) {
  return this.request('GET', resource);
}

Client.prototype.uri = function(resource) {
  return this.config.base_url + resource;
}


module.exports = Client;
