import { Avatar } from './interfaces';

import Client = require('./client');


declare class Avatars {
  constructor(client: Client);


  resolve(): Promise<Avatar[]>;
}


export = Avatars;
