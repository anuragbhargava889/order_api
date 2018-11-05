const OrderModel = require('../models/orders.model');

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.insert = (req, res, next) => {
  OrderModel.createOrder(req.body)
    .then((result) => {
      res.status(201).send({id: result._id});
    })
    .catch((err) => {
      res.status(500).send({
        err: err.message || "Some error occurred while creating the Note."
      });
    });
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.list = (req, res, next) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = req.query.page ? parseInt(req.query.page) : 1;

  OrderModel.list(limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        err: err.message || "Some error occurred while creating the Note."
      });
    });
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.patchById = (req, res, next) => {
  console.log(req.body);
  if (!req.params.orderId) {
    return res.status(400).send({
      err: "Order ID can not be empty"
    });
  }

  OrderModel.findById(req.params.orderId).then((results) => {
    if (results.status === 'TAKEN') {
      res.status(500).send({
        err: "ORDER ALREADY TAKEN"
      });
    }
  });

  OrderModel.updateOrder(req.params.orderId, req.body)
    .then((result) => {
      res.status(200).send({status: result.status});
    })
    .catch((err) => {
      res.status(500).send({
        err: err.message || "Some error occurred while creating the Note."
      });
    });
};
