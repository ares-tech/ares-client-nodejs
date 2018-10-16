import { Config } from './lib/interfaces';

import Api = require('./lib/api');


interface Constructor<T> {
  new (config: Config): T;
}


declare namespace ares {
  export const Api: Constructor<Api>;
}


export = ares;
