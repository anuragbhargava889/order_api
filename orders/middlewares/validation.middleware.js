const isCoordinates = require('is-coordinates');
const isValidCoordinates = require('is-valid-coordinates');
const {orderNewSchema, orderUpdateSchema} = require('../../schemas');
const {validate} = require('jsonschema');
const OrderModel = require('../models/orders.model');
const errorMessages = require('../../common/error/error.messages');


verifyCreateOrderSchema = (req, res, next) => {
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

verifyUpdateOrderSchema = (req, res, next) => {
  const validation = validate(req.body, orderUpdateSchema);
  if (!validation.valid) {
    return res.status(errorMessages.requestBodyIncorrect.code).send(
      {
        error: errorMessages.requestBodyIncorrect.message
      });
  } else {
    return next();
  }
};

verifyRaceCondition = (req, res, next) => {
  if (!req.params.orderId) {
    return res.status(errorMessages.missingOrderId.code).send(
      {
        error: errorMessages.missingOrderId.message
      });
  }

  let query = OrderModel.findOrderByID(req.params.orderId);

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
    console.log(err);
    return res.status(errorMessages.orderIdNotFound.code).send(
      {
        error: errorMessages.orderIdNotFound.message
      });
  });
};

module.exports = {
  verifyCreateOrderSchema,
  verifyUpdateOrderSchema,
  verifyRaceCondition
};
