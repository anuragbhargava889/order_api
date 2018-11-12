const OrderController = require('./controllers/orders.controller');
const ValidationMiddleware = require('./middlewares/validation.middleware');

exports.routesConfig = function (app) {
  app.post('/orders', [
    ValidationMiddleware.verifyCreateOrderSchema,
    OrderController.insert,
  ]);

  app.get('/orders', [
    OrderController.list
  ]);

  app.patch('/orders/:orderId', [
    ValidationMiddleware.verifyUpdateOrderSchema,
    ValidationMiddleware.verifyRaceCondition,
    OrderController.patchById
  ]);
};
