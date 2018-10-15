

function Avatars(client) {
  this.client = client;
}

Avatars.prototype.get = function() {
  return new Promise(resolve => {
    const request = this.client.get('avatars');

    this.client.resolve(request).then(response => {
      if (200 === response.status) {
        resolve(JSON.parse(response.body));
      } else {
        resolve([]);
      }
    });
  });
};


module.exports = Avatars;
