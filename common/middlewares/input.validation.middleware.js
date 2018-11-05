const isCoordinates = require('is-coordinates');
const isValidCoordinates = require('is-valid-coordinates');

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
