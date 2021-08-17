const { Router } = require('express');

const controllerHoc = (fn) => (req, res, next) => {
  if (typeof fn === 'function') {
    fn(req, res).catch(next);
  }
};

const declareApiRoutes = (routes = []) => {
  const router = Router();
  routes.forEach((route) => {
    const properties = route.replace(/\s+/g, ' ').trim().split(' ');
    if (properties.length < 3) {
      throw new Error(`'${route}' is not a valid route definition`);
    }
    const [method, pathPattern, ...controllers] = properties;
    const loadedControllers = controllers.reduce((acc, c) => {
      const path = `~controllers/${c}`;
      // eslint-disable-next-line import/no-dynamic-require
      const exported = require(path);
      if (Array.isArray(exported)) {
        exported.forEach((ex) => {
          acc.push(controllerHoc(ex));
        });
      } else if (typeof exported === 'function') {
        acc.push(controllerHoc(exported));
      } else {
        throw new Error(
          'Controller exports should be of type Function  / Array of functions'
        );
      }
      return acc;
    }, []);
    router[method](pathPattern, ...loadedControllers);
  });
  return router;
};

module.exports = { declareApiRoutes };
