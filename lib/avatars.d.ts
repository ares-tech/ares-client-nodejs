import Avatar = require('./avatar');
import Client = require('./client');


declare class Avatars {
  constructor(client: Client);


  get(): Promise<Avatar[]>;
}


export = Avatars;