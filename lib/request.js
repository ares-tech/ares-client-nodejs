const https = require('https');
const http = require('http');
const url = require('url');
const querystring = require('querystring');


function Request(method, uri) {
  this.uri = uri;
  this.query = {};
  this.options = {
    headers: {},
    method: method
  };
}


Request.prototype.setHeader = function(name, value) {
  this.options.headers[name] = value;
}

Request.prototype.resolve = function(data) {
  const uri = url.parse(this.uri);
  const port = null === uri.port ? (0 === uri.protocol.indexOf('https') ? 443 : 80) : uri.port;

  const query = {};

  if (uri.query) {
    query = querystring.parse(uri.query);
  }

  if (this.query) {
    for (const key of Object.keys(this.query)) {
      query[key] = this.query[key];
    }
  }

  const options = this.options;
  options.protocol = uri.protocol;
  options.hostname = uri.hostname;
  options.port = port;
  options.path = uri.path;

  if (0 < Object.keys(query).length) {
    options.path += '?' + querystring.stringify(query);
  }

  var serialized = '';

  if (data && 'GET' !== options.method) {
    if (false === 'Content-Type' in options.headers) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if ('string' === typeof(data)) {
      serialized = data;
    } else if ('application/json' === options.headers['Content-Type']) {
      serialized = JSON.stringify(data);
    } else if ('application/x-www-form-urlencoded' === options.headers['Content-Type']) {
      serialized = querystring.stringify(data);
    }

    options.headers['Content-Length'] = serialized.length;
  }

  return new Promise(resolve => {
    let handler = http;
    if (-1 < options.protocol.indexOf('https')) {
      handler = https;
    }

    const request = handler.request(options, response => {
      const result = {
        status: response.statusCode,
        body: ''
      };

      response.on('data', chunk => {
        result.body += chunk;
      });

      response.on('end', () => {
        resolve(result);
      });
    });

    if (serialized) {
      request.write(serialized);
    }

    request.end();
  });
}


module.exports = Request;
