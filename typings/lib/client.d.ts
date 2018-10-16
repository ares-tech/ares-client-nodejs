import { Config, Method, Response, Token } from './interfaces';

import Authenticator = require('./authenticator');
import Request = require('./request');


declare class Client {
  constructor(auth: Authenticator, config: Config);


  resolve(request: Request): Promise<Response>;
  request(method: Method, resource: string): Request;
  get(resource: string): Request;

  uri(resource: string): string;
}


export = Client;
