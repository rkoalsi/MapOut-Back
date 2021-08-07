const { declareApiRoutes } = require('../../../helpers/route-service');

const routes = [
  // users
  'get    /users                    user/find-all',
];

module.exports = declareApiRoutes(routes);
