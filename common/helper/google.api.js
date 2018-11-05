const distanceGoogleAPI = require('google-distance-matrix');
const {google_key} = require('../../common/config/env.config');
distanceGoogleAPI.key(google_key);

async function getDistance(origin, destination) {
  console.log(origin);
  console.log(destination);
  return new Promise((resolve, reject) => {
    distanceGoogleAPI.matrix([origin], [destination], (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = {
  getDistance,
};
