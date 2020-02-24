const axios = require('axios');

class Request {
  constructor(options = {}) {
    this.instance = axios.create({
      headers: {'X-Auth-Header': ''},
      ...options
    });
  }

  getInstance() {
    return this.instance;
  }
}

module.exports = new Request().getInstance();
