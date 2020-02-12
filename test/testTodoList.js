const { assert } = require('chai');
const { TodoList } = require('../lib/todoList');
const { Todo } = require('../lib/todo');
const sinon = require('sinon');

describe('TodoList', function() {
  let todoList;
  beforeEach(function() {
    todoList = new TodoList();
  });

  context('.addTodo', function() {
    it('should add the todo with given title to the todos', function() {
      todoList.addTodo('someTitle');
      assert.deepStrictEqual(todoList.todos, [
        {
          title: 'someTitle',
          todoId: 0,
          items: []
        }
      ]);
    });
    it('the added todo should be an instance of the Todo', function() {
      todoList.addTodo('someTitle');
      assert.isTrue(todoList.todos[0] instanceof Todo);
    });

    it('should generate the todoId according to the last todo', function() {
      todoList.addTodo('someTitle');
      todoList.addTodo('anotherTitle');
      assert.strictEqual(todoList.todos[1].todoId, 1);
    });
  });

  context('.deleteTodo', function() {
    let spliceSpy;

    beforeEach(function() {
      spliceSpy = sinon.spy();
      sinon.replace(Array.prototype, 'splice', spliceSpy);
    });

    afterEach(function() {
      sinon.restore();
    });

    it('should delete the item of given id if exists', function() {
      todoList.addTodo('someTask');
      todoList.deleteTodo(0);
      sinon.assert.calledWithExactly(spliceSpy, 0, 1);
      sinon.assert.calledOn(spliceSpy, todoList.todos);
    });

    it('should do nothing when todo does not exist for a given id', function() {
      todoList.addTodo('someTask');
      todoList.deleteTodo(2);
      sinon.assert.calledWithExactly(spliceSpy, Infinity, 1);
      sinon.assert.calledOn(spliceSpy, todoList.todos);
    });
  });
});
