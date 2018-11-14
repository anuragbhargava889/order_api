const {orderReadSchema, orderNewSchema, orderUpdateSchema} = require('../../schemas');
const {validate} = require('jsonschema');
const OrderModel = require('../models/orders.model');
const errorMessages = require('../error/error.messages');


const verifyCreateOrderSchema = (req, res, next) => {
  const validation = validate(req.body, orderNewSchema);
  if (!validation.valid) {
    return res.status(errorMessages.requestBodyIncorrect.code).send(
      {
        error: errorMessages.requestBodyIncorrect.message
      });
  } else {
    return next();
  }
};

const verifyUpdateOrderSchema = (req, res, next) => {
  const validation = validate(req.body, orderUpdateSchema);
  if (!validation.valid) {
    return res.status(errorMessages.invalidOrderStatus.code).send(
      {
        error: errorMessages.invalidOrderStatus.message
      });
  } else {
    return next();
  }
};

const verifyReadOrderSchema = (req, res, next) => {
  const validation = validate(req.query, orderReadSchema);
  if (!validation.valid) {
    return res.status(errorMessages.invalidQueryParameters.code).send(
      {
        error: errorMessages.invalidQueryParameters.message
      });
  } else {
    return next();
  }
};

const verifyRaceCondition = (req, res, next) => {
  if (!req.params.orderId) {
    return res.status(errorMessages.missingOrderId.code).send(
      {
        error: errorMessages.missingOrderId.message
      });
  }

  const query = OrderModel.findOrderByID(req.params.orderId);

  query.then(function (reuslt) {
    if ((reuslt.status === 'TAKEN') && (req.body.status === 'TAKEN')) {
      return res.status(errorMessages.orderAlreadyBeenTaken.code).send(
        {
          error: errorMessages.orderAlreadyBeenTaken.message
        });
    } else {
      return next();
    }
  }).catch(function (err) {
    return res.status(errorMessages.orderIdNotFound.code).send(
      {
        error: errorMessages.orderIdNotFound.message
      });
  });
};

module.exports = {
  verifyReadOrderSchema,
  verifyCreateOrderSchema,
  verifyUpdateOrderSchema,
  verifyRaceCondition
};
