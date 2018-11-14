const OrderController = require('./controllers/orders.controller');
const ValidationMiddleware = require('./middlewares/validation.middleware');

exports.routesConfig = function (app) {
  app.post('/orders', [
    ValidationMiddleware.verifyCreateOrderSchema,
    OrderController.createOrder,
  ]);

  app.get('/orders', [
    ValidationMiddleware.verifyReadOrderSchema,
    OrderController.getAllOrders
  ]);

  app.patch('/orders/:orderId', [
    ValidationMiddleware.verifyUpdateOrderSchema,
    ValidationMiddleware.verifyRaceCondition,
    OrderController.patchOrderById
  ]);
};
