const isCoordinates = require('is-coordinates');
const isValidCoordinates = require('is-valid-coordinates');
const {orderNewSchema, orderUpdateSchema} = require('../../schemas');
const {validate} = require('jsonschema');
const OrderModel = require('../models/orders.model');
const errorMessages = require('../../common/error/error.messages');


verifyCreateOrderSchema = (req, res, next) => {
  const validation = validate(req.body, orderNewSchema);
  if (!validation.valid) {
    return res.status(errorMessages.REQUEST_BODY_INCORRECT.code).send(
      {
        error: errorMessages.REQUEST_BODY_INCORRECT.message
      });
  } else {
    return next();
  }
};

verifyUpdateOrderSchema = (req, res, next) => {
  const validation = validate(req.body, orderUpdateSchema);
  if (!validation.valid) {
    return res.status(errorMessages.REQUEST_BODY_INCORRECT.code).send(
      {
        error: errorMessages.REQUEST_BODY_INCORRECT.message
      });
  } else {
    return next();
  }
};

verifyIsCoordinates = (req, res, next) => {
  if ((isCoordinates(req.body.origin) && (isCoordinates(req.body.destination)))) {
    return next();
  } else {
    return res.status(400).send({error: 'Origin and destination should be floating numbers in array format.'});
  }
};

verifyIsValidCoordinates = (req, res, next) => {
  let originLat = req.body.origin[0];
  let originLong = req.body.origin[1];
  let destinationLat = req.body.destination[0];
  let destinationLong = req.body.destination[1];
  if (isValidCoordinates(originLat, originLong) && isValidCoordinates(destinationLat, destinationLong)) {
    return next();
  } else {
    return res.status(400).send({error: 'Origin and destination should be valid lat long.'});
  }
};

raceCondition = (req, res, next) => {
  if (!req.params.orderId) {
    return res.status(errorMessages.MISSING_ORDER_ID.code).send(
      {
        error: errorMessages.MISSING_ORDER_ID.message
      });
  }

  let query = OrderModel.findOrderByID(req.params.orderId);

  query.then(function (reuslt) {
    if ((reuslt.status === 'TAKEN') && (req.body.status === 'TAKEN')) {
      return res.status(errorMessages.ORDER_ALREADY_BEEN_TAKEN.code).send(
        {
          error: errorMessages.ORDER_ALREADY_BEEN_TAKEN.message
        });
    } else {
      return next();
    }
  }).catch(function (err) {
    console.log(err);
    return res.status(errorMessages.ORDER_ID_NOT_FOUND.code).send(
      {
        error: errorMessages.ORDER_ID_NOT_FOUND.message
      });
  });
};

module.exports = {
  verifyCreateOrderSchema,
  verifyUpdateOrderSchema,
  verifyIsCoordinates,
  verifyIsValidCoordinates,
  raceCondition
};
