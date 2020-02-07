const request = require('supertest');
const { app } = require('../handler');

describe('GET request', function() {
  it('should give not found when incorrect path is given', function(done) {
    request(app.serve.bind(app))
      .get('/badFile')
      .expect(404, done);
  });
});

describe('PUT request', function() {
  it('should give method not allowed when wrong method is asked', function(done) {
    request(app.serve.bind(app))
      .put('/')
      .expect(405, done);
  });
});
