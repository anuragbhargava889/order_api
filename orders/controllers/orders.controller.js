const OrderModel = require('../models/orders.model');

/**
 * Create New Order
 *
 * @param req
 * @param res
 */
createOrder = (req, res) => {
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
          error: error.message || 'Some error occurred while creating the Note.'
        });
    });
};

/**
 * Get All Order
 *
 * @param req
 * @param res
 */
getAllOrders = (req, res) => {
  const limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;

  OrderModel.listOrder(limit, page)
    .then((result) => {
      result.docs = result.docs.map(({_id, ...item}) => item);
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(500).send(
        {
          error: error.message || 'Some error occurred while creating the Note.'
        });
    });
};

/**
 * Update Order by it's ID
 *
 * @param req
 * @param res
 * @returns {*}
 */
patchOrderById = (req, res) => {
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
          error: error.message || 'Some error occurred while creating the Note.'
        });
    });
};

module.exports = {
  createOrder,
  getAllOrders,
  patchOrderById
};
