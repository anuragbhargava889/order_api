const orderController = require('./controllers/orders.controller');
const validationMiddleware = require('./middlewares/validation.middleware');

exports.routesConfig = function (app) {
  app.post('/orders', [
    validationMiddleware.verifyCreateOrderSchema,
    orderController.createOrder,
  ]);

  app.get('/orders', [
    validationMiddleware.verifyReadOrderSchema,
    orderController.getAllOrders
  ]);

  app.patch('/orders/:orderId', [
    validationMiddleware.verifyUpdateOrderSchema,
    validationMiddleware.verifyRaceCondition,
    orderController.patchOrderById
  ]);
};
