'use strict';


const Request = require('./request');


function Client(auth, config) {
  this.auth = auth;
  this.config = config;
}


Client.prototype.resolve = function(request, data) {
  return this.auth.resolve(request, data);
}


Client.prototype.request = function(method, resource) {
  return new Request(method, this.uri(resource));
}

Client.prototype.delete = function(resource) {
  return this.request('DELETE', resource);
}

Client.prototype.get = function(resource) {
  return this.request('GET', resource);
}

Client.prototype.head = function(resource) {
  return this.request('HEAD', resource);
}

Client.prototype.patch = function(resource) {
  return this.request('PATCH', resource);
}

Client.prototype.post = function(resource) {
  return this.request('POST', resource);
}

Client.prototype.put = function(resource) {
  return this.request('PUT', resource);
}


Client.prototype.uri = function(resource) {
  return this.config.base_url + resource;
}


module.exports = Client;
