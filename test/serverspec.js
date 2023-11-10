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

  // ===========================================================================
  // TO-DO: Part A login unit test case
  //We are checking POST /login API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  //Positive case
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

  // Part B: Other test cases
  
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ userName: 'John Doe1', password: '1212' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  //We are checking POST /register API by passing the user info in in incorrect manner (name/pass cannot be null). This test case should pass and return a status 200 along with a "Invalid input" message.
  it('Negative : /register. Checking invalid name', done => {
    chai
      .request(server)
      .post('/register')
      .send({ userName: "Test" })
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Error during registration');
        done();
      });
  });
});
