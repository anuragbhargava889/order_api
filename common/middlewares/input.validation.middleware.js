const isCoordinates = require('is-coordinates');
const isValidCoordinates = require('is-valid-coordinates');
const OrderModel = require('../../orders/models/orders.model');

exports.verifyIsCoordinates = (req, res, next) => {
  if ((isCoordinates(req.body.origin) && (isCoordinates(req.body.destination)))) {
    return next();
  } else {
    return res.status(400).send({err: 'Origin and destination should be floating numbers in array format.'});
  }
};

exports.verifyIsValidCoordinates = (req, res, next) => {
  let originLat = req.body.origin[0];
  let originLong = req.body.origin[1];
  let destinationLat = req.body.destination[0];
  let destinationLong = req.body.destination[1];
  if (isValidCoordinates(originLat, originLong) && isValidCoordinates(destinationLat, destinationLong)) {
    return next();
  } else {
    return res.status(400).send({err: 'Origin and destination should be valid lat long.'});
  }
};

exports.raceCondition = (req, res, next) => {
  if (!req.params.orderId) {
    return res.status(400).send({err: "Order ID can not be empty"});
  }
  let query = OrderModel.findOrderByID(req.params.orderId);

  query.then(function (reuslt) {
    if (reuslt.status === 'TAKEN') {
      return res.status(400).send({err: 'Order already taken.'});
    } else {
      return next();
    }
  }).catch(function (err) {
    return res.status(400).send({err: 'Order ID Not Found.'});
  });
};
