const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const server = 'localhost:8080';

/*
 * No route found testcase
 */
describe('GET /', () => {
  it('should return 404 for Non configured Urls', (done) => {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        expect(res).to.have.status(404);
        done(); // <= Call done to signal callback end
      });
  });
});
