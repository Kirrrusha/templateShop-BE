const axi = require('axios');

class Request {
  constructor(options = {}) {
    this.instance = axi.create({
      headers: { 'X-Auth-Header': '' },
      ...options,
    });
  }

  getInstance() {
    return this.instance;
  }
}

module.exports = new Request().getInstance();
