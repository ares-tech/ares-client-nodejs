import Api = require('./lib/api');
import Config = require('./lib/config');


interface Constructor<T> {
  new (config: Config): T;
}


declare namespace ares {
  export const Api: Constructor<Api>;
}


export = ares;
