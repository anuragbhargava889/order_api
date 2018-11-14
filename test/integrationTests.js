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
  it('should return 422 with invalid origin format like if we send integer ' +
    'instead of string example [28, "77.111761"]', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: [28, "77.111761"],
        destination: ["28.530264", "77.111761"]
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return 422 with invalid origin format if we send more than two ' +
    'string in origin array like ["77.111761", "77.111761", "77.111761"]', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: ["77.111761", "77.111761", "77.111761"],
        destination: ["28.530264", "77.111761"]
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return 422 with invalid origin format if we send more than two ' +
    'string in destination array like ["77.111761", "77.111761", "77.111761"]', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: ["77.111761", "77.111761"],
        destination: ["28.530264", "28.530264", "77.111761"]
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should create order with valid request', (done) => {
    chai.request(server)
      .post('/orders')
      .send({
        origin: ["28.4595", "77.0266"],
        destination: ["28.5355", "77.3910"]
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
        status: "TAKEN"
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 500 for bad request', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=1')
      .end((err, res) => {
        chai.request(server)
          .patch('/orders/' + res.body.docs[0].id)
          .send({
            wrong_parm: "TAKEN" //Wrong format as param not supported
          }).end((err, res) => {
          expect(res).to.have.status(422);
          done();
        })
      });
  });

  it('should return 500 for bad request like all order status should be capitalize like TAKEN', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=1')
      .end((err, res) => {
        chai.request(server)
          .patch('/orders/' + res.body.docs[0].id)
          .send({
            status: "taken"
          }).end((err, res) => {
          expect(res).to.have.status(500);
          done();
        })
      });
  });

  it('should return 200 for successfully update', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=1')
      .end((err, res) => {
        let orderResponse = res;
        chai.request(server)
          .patch('/orders/' + res.body.docs[0].id)
          .send({
            status: "TAKEN"
          }).end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
      });
  });

  it('should return 409 for order status conflict', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=1')
      .end((err, res) => {
        let orderResponse = res;
        chai.request(server)
          .patch('/orders/' + res.body.docs[0].id)
          .send({
            status: "TAKEN"
          }).end((err, res) => {
          expect(res).to.have.status(409);
          done();
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

  it('should return wrong limit data type error with (limit=abc)', (done) => {
    chai.request(server)
      .get('/orders?page=1&limit=abc')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return wrong page data type error with (page=abc)', (done) => {
    chai.request(server)
      .get('/orders?page=abc&limit=1')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return error if we pass page query value as string like ?page=abc&limit=1', (done) => {
    chai.request(server)
      .get('/orders?page=abc&limit=1')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return error if we pass limit query value less than zero like ?limit=0', (done) => {
    chai.request(server)
      .get('/orders?limit=0')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return error if we pass page query value less than zero like ?page=0', (done) => {
    chai.request(server)
      .get('/orders?page=0')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return error if we pass limit query value as negative integer ?limit=-2', (done) => {
    chai.request(server)
      .get('/orders?limit=-2')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should return error if we pass invalid query string like ?test=abc', (done) => {
    chai.request(server)
      .get('/orders?test=abc')
      .end(function (err, res) {
        expect(res).to.have.status(422);
        done();
      });
  });
});
