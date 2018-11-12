const OrderModel = require('../models/orders.model');

/**
 * Create New Order
 *
 * @param req
 * @param res
 * @param next
 */
insert = (req, res, next) => {
  OrderModel.createOrder(req.body)
    .then((result) => {
      res.status(200).send(
        {
          id: result._id,
          distance: result.distance,
          status: result.status
        });
    })
    .catch((error) => {
      res.status(500).send(
        {
          error: error.message || "Some error occurred while creating the Note."
        });
    });
};

/**
 * Get All Order
 *
 * @param req
 * @param res
 * @param next
 */
list = (req, res, next) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = req.query.page ? parseInt(req.query.page) : 1;

  OrderModel.listOrder(limit, page)
    .then((result) => {
      const newDocs = result.docs.map(({ _id, ...item }) => item);
      result.docs = newDocs;
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(500).send(
        {
          error: error.message || "Some error occurred while creating the Note."
        });
    });
};

/**
 * Update Order by it's ID
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
patchById = (req, res, next) => {
  OrderModel.updateOrder(req.params.orderId, req.body)
    .then((result) => {
      res.status(200).send(
        {
          status: "SUCCESS"
        });
    })
    .catch((error) => {
      res.status(500).send(
        {
          error: error.message || "Some error occurred while creating the Note."
        });
    });
};

module.exports = {
  insert,
  list,
  patchById
};
