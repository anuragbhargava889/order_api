const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const {googleHandler} = require('../../common/helper');
const {getDistance} = googleHandler;
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  distance: {type: String, required: true},
  status: {type: String, enum: ['UNASSIGN', 'TAKEN'], default: 'UNASSIGN', required: true},
  origin: {type: Array, required: true},
  destination: {type: Array, required: true}
});

orderSchema.plugin(mongoosePaginate);

/**
 * Hook After Order Save
 */
orderSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
});

/**
 *
 */
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

/**
 *
 * @param cb
 * @returns {Query|void|number|*|BigInt|T}
 */
orderSchema.findById = function (cb) {
  return this.model('Orders').find({id: this.id}, cb);
};

/**
 *
 * @type {Model}
 */
const Order = mongoose.model('Orders', orderSchema);

/**
 *
 * @param id
 * @returns {Promise}
 */
exports.findById = (id) => {
  return Order.findById(id)
    .then((result) => {
      result = result.toJSON();
      delete result._id;
      delete result.__v;
      return result;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 *
 * @param orderData
 * @returns {Promise}
 */
exports.createOrder = async (orderData) => {
  try {
    let origin = orderData.origin.toString();
    let destination = orderData.destination.toString();
    const distance = await getDistance(origin, destination);
    console.log(distance.rows[0].elements[0].distance.text);
    orderData.distance = distance.rows[0].elements[0].distance.text;
    let order = new Order(orderData);
    return order.save();
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @param perPage
 * @param page
 * @returns {*}
 */
exports.list = (perPage, page) => {
  try {
    return Order.paginate({}, {select: 'status origin destination distance', page: page, limit: perPage});
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @param id
 * @param orderData
 * @returns {Promise<any>}
 */
exports.updateOrder = (id, orderData) => {
  try {
    return Order.findByIdAndUpdate(id, orderData, {new: true, runValidators: true});
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @param id
 * @returns {*}
 */
exports.findOrderByID = (id) => {
  try {
    return Order.findOne({_id: id}, 'status');
  } catch (err) {
    console.log(err)
  }
};
