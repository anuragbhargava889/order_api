const {getDistance} = require('../common/services/google.service');
const orderModel = require('../orders/models/orders.model');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;


describe('Check Google Api Working', () => {
  describe('getDistance()', () => {
    it('should return valid response', async () => {
      const origin = '28.4595, 77.0266';
      const destination = '26.2183, 78.1828';
      const distance = await getDistance(origin, destination);
      expect(distance).to.have.property('status');
    });

    it('should return zero result', async () => {
      const origin = '2, 3';
      const destination = '4, 5';
      const distance = await getDistance(origin, destination);
      expect(distance.rows[0].elements[0].status).equal('ZERO_RESULTS');
    });
  });
});
