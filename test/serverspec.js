// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  //TODO cases
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({ userName: 'John Doe', password: '1212' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success');
        done();
      });
  });
  //Negative case
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({ userName: 'Jane R', password: '1111' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A register unit test case
  it('positive : /testRegister', done => {
    chai
      .request(server)
      .post('/testRegister')
      .send({username: 'John Doe (testing user)', password: '1212'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  //We are checking POST /register API by passing the user info in in incorrect manner (name/pass cannot be null). This test case should pass and return a status 200 along with a "Invalid input" message.


it('Negative : /testRegister. Checking missing fields', done => {
  chai
    .request(server)
    .post('/testRegister')
    .send({userName: "Test"})
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body.message).to.equals('Invalid input');
      done();
    });
});


});
