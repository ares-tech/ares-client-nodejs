import { Method, Response } from './interfaces';


declare class Request {
  constructor(method: Method, uri: string);


  setHeader(name: string, value: string);

  resolve(): Promise<Response>;
}


export = Request;
