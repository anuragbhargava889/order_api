const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const sinon_mongoose = require('sinon-mongoose');
const Order = require('../orders/models/orders.model');


/*
 * Test Suite for make DB connection
 */
describe('Test Suite', function() {
  before(function(done) {
    mongoose.connect('mongodb://localhost/logistic', function(error) {
      if (error) console.error('Error while connecting:\n%\n', error);
      console.log('connected');
      done(error);
    });
  });
});
