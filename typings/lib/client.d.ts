import { Config, Method, Response, Token } from './interfaces';

import Authenticator = require('./authenticator');
import Request = require('./request');


declare class Client {
  constructor(auth: Authenticator, config: Config);


  resolve(request: Request, data?: any): Promise<Response>;

  request(method: Method, resource: string): Request;
  delete(resource: string): Request;
  get(resource: string): Request;
  head(resource: string): Request;
  patch(resource: string): Request;
  post(resource: string): Request;
  put(resource: string): Request;

  uri(resource: string): string;
}


export = Client;
