const UsersController = require('./controllers/orders.controller');
const ValidationMiddleware = require('../common/middlewares/input.validation.middleware');

exports.routesConfig = function (app) {
  app.post('/orders', [
    ValidationMiddleware.verifyIsCoordinates,
    ValidationMiddleware.verifyIsValidCoordinates,
    UsersController.insert
  ]);

  app.get('/orders', [
    UsersController.list
  ]);

  app.patch('/orders/:orderId', [
    ValidationMiddleware.raceCondition,
    UsersController.patchById
  ]);
};
