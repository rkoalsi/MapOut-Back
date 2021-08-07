const { declareApiRoutes } = require('~helpers/route-service');

const routes = [
  // admin auth
  'post   /admin/login                            admin/login',
];

module.exports = declareApiRoutes(routes);
