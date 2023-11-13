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

  // ===========================================================================
  // --- Simple test to make sure server is started ---

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

  // End of simple test
  // ===========================================================================

  // ===========================================================================
  // --- Login tests ---

  //Positive case
  it('positive : /testLogin', done => {
    chai
      .request(server)
      .post('/testLogin')
      .send({ username: 'test', password: 'test' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('User logged in');
        done();
      });
  });
  //Negative case
  it('negative : /testLogin - wrong password', done => {
    chai
      .request(server)
      .post('/testLogin')
      .send({ username: 'test', password: '1111' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Incorrect password');
        done();
      });
  });

  // End of login tests
  // ===========================================================================


  // ===========================================================================
  // --- Register tests ---

  //normal behavior
  it('Normal behaviors : /testRegister', done => {
    chai
      .request(server)
      .post('/testRegister')
      .send({ username: 'John Doe (testing user)', password: '1212' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // Negative case (missing fields)
  it('Negative : /testRegister. Checking missing fields', done => {
    chai
      .request(server)
      .post('/testRegister')
      .send({ username: "Test" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });

  // End of register tests
  // ===========================================================================


  // ===========================================================================
  // --- Search tests ---

  //normal behavior, with a valid search that we know will return results
  it('Normal behaviors : /search. Checking for known results', done => {
    chai
      .request(server)
      .get('/search?movieName=Five')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        //two movies will be returned
        expect(res.body.movies.length).to.equals(2);
        //check name of first is "Five Nights at Freddy's"
        expect(res.body.movies[0].title).to.equals("Five Nights at Freddy's");
        //check name of second is "The Hobbit: The Battle of the Five Armies"
        expect(res.body.movies[1].title).to.equals("The Hobbit: The Battle of the Five Armies");
        done();
      });
  });

  //normal behavior, but with a search that we know will not return results
  it('Normal behaviors : /search. Checking for no results', done => {
    chai
      .request(server)
      .get('/search?movieName=dflsjdkfldjkslfj')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        //no movies will be returned
        expect(res.body.movies.length).to.equals(0);
        done();
      });
  });

  //negative case, missing query
  it('Negative : /search. Checking missing query', done => {
    chai
      .request(server)
      .get('/search')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('movieName query expected.');
        done();
      });
  });

  
  // End of search tests
  // ===========================================================================


  //end of server tests
});
