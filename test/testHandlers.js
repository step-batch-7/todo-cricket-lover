const sinon = require('sinon');
const request = require('supertest');
const fs = require('fs');
const { serveApp } = require('../lib/handler');

describe('GET', function() {
  context('/', function() {
    it('should get index.html when the path is /', function(done) {
      request(serveApp)
        .get('/')
        .expect('Content-Type', 'text/html', done)
        .expect(/Todo/)
        .expect(200);
    });
  });

  context('/badFile', function() {
    it('should give not found when incorrect path is given', function(done) {
      request(serveApp)
        .get('/badFile')
        .expect(404, done);
    });
  });
});

describe('POST', function() {
  beforeEach(function() {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  afterEach(function() {
    sinon.restore();
  });

  context('/createNewTodo', function() {
    it('should create new todo and post on index page', function(done) {
      request(serveApp)
        .post('/createNewTodo')
        .send('title=phani')
        .expect(200, done);
    });
  });

  context('/deleteTodo', function() {
    it('should delete todo from index page', function(done) {
      request(serveApp)
        .post('/deleteTodo')
        .send('todoId=1')
        .expect(200, done);
    });
  });

  context('/createNewItem', function() {
    it('should create new item in a todo and post on index page', function(done) {
      request(serveApp)
        .post('/createNewItem')
        .send('item=picture&todoId=2')
        .expect(200, done);
    });
  });

  context('/deleteItem', function() {
    it('should delete item in a todo from index page', function(done) {
      request(serveApp)
        .post('/deleteItem')
        .send('taskId=1&todoId=2')
        .expect(200, done);
    });
  });

  context('/changeItemStatus', function() {
    it('should change status of an item in a todo from index page', function(done) {
      request(serveApp)
        .post('/changeItemStatus')
        .send('taskId=1&todoId=2')
        .expect(200, done);
    });
  });

  context('/renameTitle', function() {
    it('should rename the title of a todo', function(done) {
      request(serveApp)
        .post('/renameTitle')
        .send('todoId=2&newTitle=phani')
        .expect(200, done);
    });
  });

  context('/modifyItem', function() {
    it('should modify the item of a todo', function(done) {
      request(serveApp)
        .post('/modifyItem')
        .send('todoId=2&newItem=phani&taskId=1')
        .expect(200, done);
    });
  });
});

describe('PUT /', function() {
  it('should give method not allowed when wrong method is asked', function(done) {
    request(serveApp)
      .put('/')
      .expect(405, done);
  });
});
