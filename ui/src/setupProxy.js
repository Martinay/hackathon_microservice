const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/get', { target: 'http://localhost:5002' }));
};