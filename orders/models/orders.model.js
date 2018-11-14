const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const {getDistance} = require('../../common/services/google.service');
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
 * @param cb
 * @returns {Query|void|number|*|BigInt|T}
 */
orderSchema.findById = function (cb) {
  return this.model('Orders').find({id: this.id}, cb);
};

// Duplicate the ID field.
orderSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orderSchema.set('toJSON', {
  virtuals: true
});

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
findById = (id) => {
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
createOrder = async (orderData) => {
  try {
    const origin = orderData.origin.toString();
    const destination = orderData.destination.toString();
    const distance = await getDistance(origin, destination);
    if (distance.status === 'OK') {
      orderData.distance = distance.rows[0].elements[0].distance.value;
      const order = new Order(orderData);
      return order.save();
    } else {
      return Promise.reject({message: 'GOOGLE_API_ISSUE'});
    }
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
listOrder = (perPage, page) => {
  try {
    return Order.paginate({}, {select: 'id status distance', page: page, limit: perPage});
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
updateOrder = (id, orderData) => {
  try {
    return Order.findOneAndUpdate({ _id : id } , orderData);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @param id
 * @returns {*}
 */
findOrderByID = (id) => {
  try {
    return Order.findOne({_id: id}, 'status');
  } catch (err) {
    console.log(err)
  }
};

module.exports = {
  findById,
  createOrder,
  updateOrder,
  findOrderByID,
  listOrder
};
