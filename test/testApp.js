const fs = require('fs');
const sinon = require('sinon');
const request = require('supertest');
const { app } = require('../lib/app');
const { TodoList } = require('../lib/todoList');

describe('GET', function() {
  context('/', function() {
    it('should get index.html when not logged in', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(/Login/)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should serve the homePage.html when logged in', function(done) {
      request(app)
        .get('/')
        .set('Cookie', ['sesId=abc123'])
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(/TODO/)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
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

  context('/images/plus.svg', function() {
    it('should get the image file only when logged in', function(done) {
      request(app)
        .get('/images/plus.svg')
        .set('Cookie', ['sesId=abc123'])
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
    it('should get the todoList only when logged in', function(done) {
      request(app)
        .get('/todoList')
        .set('Cookie', ['sesId=abc123'])
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
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

describe('PATCH', function() {
  beforeEach(function() {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  afterEach(function() {
    sinon.restore();
  });

  context('/renameTitle', function() {
    it('should rename the title of a todo when logged in and if it exists', function(done) {
      request(app)
        .patch('/renameTitle')
        .set('Cookie', ['sesId=abc123'])
        .send('todoId=2&newTitle=phani')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with 400 if id is invalid', function(done) {
      request(app)
        .patch('/renameTitle')
        .set('Cookie', ['sesId=abc123'])
        .send('todoId=3&newTitle=phani')
        .expect(400)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should not allow the operation when not logged in', function(done) {
      request(app)
        .patch('/renameTitle')
        .send('todoId=2&newTitle=phani')
        .expect(401)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('/modifyItem', function() {
    it('should modify the item of a todo when logged in and if it exists', function(done) {
      request(app)
        .patch('/modifyItem')
        .set('Cookie', ['sesId=abc123'])
        .send('todoId=2&newItem=phani&taskId=1')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with 400 if id is invalid', function(done) {
      request(app)
        .patch('/modifyItem')
        .set('Cookie', ['sesId=abc123'])
        .send('todoId=2&newItem=phani&taskId=3')
        .expect(400)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should not allow the operation when not logged in', function(done) {
      request(app)
        .patch('/modifyItem')
        .send('todoId=2&newItem=phani&taskId=1')
        .expect(401)
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

describe('DELETE', function() {
  beforeEach(function() {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  afterEach(function() {
    sinon.restore();
  });

  context('/deleteTodo', function() {
    let fakeDelete;
    beforeEach(function() {
      fakeDelete = sinon.stub();
      fakeDelete.returns(true);
      sinon.replace(TodoList.prototype, 'deleteTodo', fakeDelete);
    });

    it('should delete todo from home Page only when logged in', function(done) {
      request(app)
        .delete('/deleteTodo')
        .set('Cookie', ['sesId=abc123'])
        .send('todoId=1')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with 400 when id does not exist', function(done) {
      fakeDelete.returns(false);
      request(app)
        .delete('/deleteTodo')
        .set('Cookie', ['sesId=abc123'])
        .send('todoId=3')
        .expect(400)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with unauthorized when not logged in', function(done) {
      request(app)
        .delete('/deleteTodo')
        .send('todoId=1')
        .expect(401)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('/deleteItem', function() {
    let fakeDelete;
    beforeEach(function() {
      fakeDelete = sinon.stub();
      fakeDelete.returns(true);
      sinon.replace(TodoList.prototype, 'deleteItem', fakeDelete);
    });
    it('should delete item in a todo from home Page when logged in', function(done) {
      request(app)
        .delete('/deleteItem')
        .set('Cookie', ['sesId=abc123'])
        .send('taskId=1&todoId=2')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with 400 when id does not exist', function(done) {
      fakeDelete.returns(false);
      request(app)
        .delete('/deleteItem')
        .set('Cookie', ['sesId=abc123'])
        .send('taskId=7&todoId=2')
        .expect(400)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with unauthorized when not logged in', function(done) {
      request(app)
        .delete('/deleteItem')
        .send('taskId=1&todoId=2')
        .expect(401)
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
    it('should create new todo and post on home Page when logged in', function(done) {
      request(app)
        .post('/createNewTodo')
        .set('Cookie', ['sesId=abc123'])
        .send('title=phani')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should create new todo and post on home Page when logged in', function(done) {
      request(app)
        .post('/createNewTodo')
        .send('title=phani')
        .expect(401)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('/createNewItem', function() {
    it('should create new item in a todo and post on home Page when logged in', function(done) {
      request(app)
        .post('/createNewItem')
        .set('Cookie', ['sesId=abc123'])
        .send('item=picture&todoId=2')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with 400 when id does not exist', function(done) {
      request(app)
        .post('/createNewItem')
        .set('Cookie', ['sesId=abc123'])
        .send('item=picture&todoId=4')
        .expect(400)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with unauthorized when not logged in', function(done) {
      request(app)
        .post('/createNewItem')
        .send('item=picture&todoId=2')
        .expect(401)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('/changeItemStatus', function() {
    it('should change status of an item in a todo from home Page when logged in', function(done) {
      request(app)
        .post('/changeItemStatus')
        .set('Cookie', ['sesId=abc123'])
        .send('taskId=1&todoId=2')
        .expect(200)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with 400 when id does not exist', function(done) {
      request(app)
        .post('/changeItemStatus')
        .set('Cookie', ['sesId=abc123'])
        .send('taskId=1&todoId=5')
        .expect(400)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });

    it('should respond with unauthorized when not logged in', function(done) {
      request(app)
        .post('/changeItemStatus')
        .send('taskId=1&todoId=2')
        .expect(401)
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

describe('GET /homePage', function() {
  it('should give unauthorized when not logged in', function(done) {
    request(app)
      .get('/homePage.html')
      .expect(401)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('GET /indexHome.html', function() {
  it('should give not found when incorrect path is given', function(done) {
    request(app)
      .get('/indexHome.html')
      .expect(404)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('PUT /', function() {
  it('should give method not allowed when wrong method is asked', function(done) {
    request(app)
      .put('/')
      .expect(405)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});
