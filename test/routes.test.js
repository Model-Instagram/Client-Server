process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');

const should = chai.should();

chai.use(chaiHttp);

describe('API Routes', () => {

  describe('Server is running', () => {
    it( 'should return a response', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Get more feed', () => {
    it('should return a feed', (done) => {
      chai.request(server)
        .get('/test/users/1/more_feed')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].should.have.property('post_id');
          res.body[1].should.have.property('ad_id');
          done();
        });
    });
  });
});