import Authenticator = require('./authenticator');
import Config = require('./config');
import Method = require('./method');
import Request = require('./request');
import Response = require('./response');
import Token = require('./token');


declare class Client {
  constructor(auth: Authenticator, config: Config);


  resolve(request: Request): Promise<Response>;
  request(method: Method, resource: string): Request;
  get(resource: string): Request;

  uri(resource: string): string;
}


export = Client;
