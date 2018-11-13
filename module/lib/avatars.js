'use strict';


function Avatars(client) {
  this.client = client;
}


Avatars.prototype.resolve = function() {
  return new Promise((resolve, reject) => {
    const request = this.client.get('avatars');

    this.client.resolve(request)
      .then(response => {
        if (200 === response.status) {
          resolve(JSON.parse(response.body));
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
};


module.exports = Avatars;
