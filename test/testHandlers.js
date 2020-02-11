const sinon = require('sinon');
const request = require('supertest');
const fs = require('fs');
const { app } = require('../handler');

describe('GET request', function() {
  it('should get index.html when the path is /', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html', done)
      .expect(/Todo/)
      .expect(200);
  });
  it('should give not found when incorrect path is given', function(done) {
    request(app.serve.bind(app))
      .get('/badFile')
      .expect(404, done);
  });
});

describe('POST todo', function() {
  beforeEach(function() {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  afterEach(function() {
    sinon.restore();
  });

  it('should create new todo and post on index page', function(done) {
    request(app.serve.bind(app))
      .post('/createNewTodo')
      .send('title=phani')
      .expect(200, done);
  });

  it('should delete todo from index page', function(done) {
    request(app.serve.bind(app))
      .post('/deleteTodo')
      .send('todoId=1')
      .expect(200, done);
  });

  it('should create new item in a todo and post on index page', function(done) {
    request(app.serve.bind(app))
      .post('/createNewItem')
      .send('item=picture&todoId=2')
      .expect(200, done);
  });

  it('should delete item in a todo from index page', function(done) {
    request(app.serve.bind(app))
      .post('/deleteItem')
      .send('taskId=1&todoId=2')
      .expect(200, done);
  });

  it('should change status of an item in a todo from index page', function(done) {
    request(app.serve.bind(app))
      .post('/changeItemStatus')
      .send('taskId=1&todoId=2')
      .expect(200, done);
  });

  it('should rename the title of a todo', function(done) {
    request(app.serve.bind(app))
      .post('/renameTitle')
      .send('todoId=2&newTitle=phani')
      .expect(200, done);
  });

  it('should modify the item of a todo', function(done) {
    request(app.serve.bind(app))
      .post('/modifyItem')
      .send('todoId=2&newItem=phani&taskId=1')
      .expect(200, done);
  });
});

describe('PUT request', function() {
  it('should give method not allowed when wrong method is asked', function(done) {
    request(app.serve.bind(app))
      .put('/')
      .expect(405, done);
  });
});
