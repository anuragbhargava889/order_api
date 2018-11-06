const distance = require('google-distance-matrix');
const {googleKey} = require('../config/config');
distance.key(googleKey);

function getDistance(origin, destination) {
  return new Promise((resolve, reject) => {
    distance.matrix([origin], [destination], (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = {
  getDistance
};
