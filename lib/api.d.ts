import Client = require('./client');
import Config = require('./config');
import Authenticator = require('./authenticator');
import Avatars = require('./avatars');


declare class Api {
  constructor(config: Config);


  auth: Authenticator;
  client: Client;
  avatars: Avatars;
}


export = Api;
