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


/*
 * Create order testcase
 */
describe('/POST order', () => {
  it('should return 500 with invalid format', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: [28, "77.111761"],
        destination: ["28.530264", "77.111761"]
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should create order with valid request', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: ["28.58484", "77.111761"],
        destination: ["28.530264", "77.111761"]
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
        data = res;
      });
  });

  it('should return response status UNASSIGN for new order', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: ["28.530264", "77.111761"],
        destination: ["28.530264", "77.111761"]
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('UNASSIGN');
        done();
      });
  });
});

/*
 * Order update testcase
 */
describe('/PATCH /orders/:id', () => {
  it('should return error for order not found', (done) => {
    chai.request(server)
      .patch('/orders/5bc07c1c478e1313f08333bb')
      .send({
        status: "taken"
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return success for updating status to taken', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=1')
      .end((err, res) => {
        chai.request(server)
          .put('/order/' + res.body[0].id)
          .send({
            status: "taken"
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it('should return failure for updating status to taken', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=1')
      .end((err, res) => {
        let orderResponse = res;
        chai.request(server)
          .put('/order/' + res.body[0].id)
          .send({
            status: "taken"
          }).end((err, res) => {
          expect(res).to.have.status(409);
          chai.request(server)
            .put('/order/' + orderResponse.body[0].id)
            .send({
              status: "UNASSIGN"
            }).end((err, res) => {
            done();
          });
        })
      });
  });
});

/*
 * Order listing testcase
 */
describe('GET /', () => {
  it('should return maximum two orders (limit=2)', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=2')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return wrong limit datatype error with (limit=abc)', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=abc')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return wrong page datatype error with (page=abc)', (done) => {
    chai.request(server)
      .get('/orders?page=abc&limit=1')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return error with limit value less than 1 (limit=-1)', (done) => {
    chai.request(server)
      .get('/orders?page=abc&limit=1')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return error with page value less than 1 (page=0)', (done) => {
    chai.request(server)
      .get('/orders?page=abc&limit=1')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        done();
      });
  });
});
