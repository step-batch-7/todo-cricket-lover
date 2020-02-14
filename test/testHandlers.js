const sinon = require('sinon');
const request = require('supertest');
const fs = require('fs');
const { app } = require('../lib/handler');

describe('GET', function() {
  context('/', function() {
    it('should get index.html when the path is /', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8', done)
        .expect(/Todo/);
    });
  });

  context('/js/index.js', function() {
    it('should get the js file', function(done) {
      request(app)
        .get('/js/index.js')
        .expect(200)
        .expect('Content-Type', 'application/javascript; charset=UTF-8')
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    context('/css/index.css', function() {
      it('should get the css file', function(done) {
        request(app)
          .get('/css/index.css')
          .expect(200)
          .expect('Content-Type', 'text/css; charset=UTF-8')
          .end(err => {
            if (err) {
              done(err);
              return;
            }
            done();
          });
      });
    });
  });

  context('/images/plus.svg', function() {
    it('should get the image file', function(done) {
      request(app)
        .get('/images/plus.svg')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('/todoList', function() {
    it('should get the todoList', function(done) {
      request(app)
        .get('/todoList')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
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
      request(app)
        .post('/createNewTodo')
        .send('title=phani')
        .expect(200, done);
    });
  });

  context('/deleteTodo', function() {
    it('should delete todo from index page', function(done) {
      request(app)
        .post('/deleteTodo')
        .send('todoId=1')
        .expect(200, done);
    });
  });

  context('/createNewItem', function() {
    it('should create new item in a todo and post on index page', function(done) {
      request(app)
        .post('/createNewItem')
        .send('item=picture&todoId=2')
        .expect(200, done);
    });
  });

  context('/deleteItem', function() {
    it('should delete item in a todo from index page', function(done) {
      request(app)
        .post('/deleteItem')
        .send('taskId=1&todoId=2')
        .expect(200, done);
    });
  });

  context('/changeItemStatus', function() {
    it('should change status of an item in a todo from index page', function(done) {
      request(app)
        .post('/changeItemStatus')
        .send('taskId=1&todoId=2')
        .expect(200, done);
    });
  });

  context('/renameTitle', function() {
    it('should rename the title of a todo', function(done) {
      request(app)
        .post('/renameTitle')
        .send('todoId=2&newTitle=phani')
        .expect(200, done);
    });
  });

  context('/modifyItem', function() {
    it('should modify the item of a todo', function(done) {
      request(app)
        .post('/modifyItem')
        .send('todoId=2&newItem=phani&taskId=1')
        .expect(200, done);
    });
  });
});

describe('GET /badFile', function() {
  it('should give not found when incorrect path is given', function(done) {
    request(app)
      .get('/badFile')
      .expect(404, done);
  });
});

describe('PUT /', function() {
  it('should give method not allowed when wrong method is asked', function(done) {
    request(app)
      .put('/')
      .expect(405, done);
  });
});
