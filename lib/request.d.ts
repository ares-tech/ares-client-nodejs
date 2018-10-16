import Method = require('./method');
import Response = require('./response');


declare class Request {
  constructor(method: Method, uri: string);


  setHeader(name: string, value: string);

  resolve(): Promise<Response>;
}


export = Request;
