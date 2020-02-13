const { assert } = require('chai');
const { TodoList } = require('../lib/todoList');
const { Todo } = require('../lib/todo');
const sinon = require('sinon');

describe('TodoList', function() {
  let todoList;
  beforeEach(function() {
    todoList = new TodoList();
  });

  afterEach(function() {
    sinon.restore();
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

  context('.editTitle', function() {
    let spy0, spy1;

    beforeEach(function() {
      todoList.addTodo('someTodo');
      todoList.addTodo('otherTodo');
      spy0 = sinon.spy();
      spy1 = sinon.spy();
      sinon.replace(todoList.todos[0], 'editTitle', spy0);
      sinon.replace(todoList.todos[1], 'editTitle', spy1);
    });

    it('should edit the title of the given todo only', function() {
      todoList.editTitle(1, 'newTitle');
      sinon.assert.calledWithExactly(spy1, 'newTitle');
      sinon.assert.notCalled(spy0);
    });
  });

  context('.addItem', function() {
    let spy0, spy1;

    beforeEach(function() {
      todoList.addTodo('someTodo');
      todoList.addTodo('otherTodo');
      spy0 = sinon.spy();
      spy1 = sinon.spy();
      sinon.replace(todoList.todos[0], 'addItem', spy0);
      sinon.replace(todoList.todos[1], 'addItem', spy1);
    });

    it('should add an item to the given todo only', function() {
      todoList.addItem(0, 'newTask');
      sinon.assert.calledWithExactly(spy0, 'newTask');
      sinon.assert.notCalled(spy1);
    });
  });

  context('.deleteItem', function() {
    let spy0, spy1;

    beforeEach(function() {
      todoList.addTodo('someTodo');
      todoList.addTodo('otherTodo');
      spy0 = sinon.spy();
      spy1 = sinon.spy();
      sinon.replace(todoList.todos[0], 'deleteItem', spy0);
      sinon.replace(todoList.todos[1], 'deleteItem', spy1);
    });

    it('should add an item to the given todo only', function() {
      todoList.addItem(0, 'newTask');
      todoList.deleteItem(0, 0);
      sinon.assert.calledWithExactly(spy0, 0);
      sinon.assert.notCalled(spy1);
    });
  });

  context('.editTask', function() {
    let spy0, spy1;

    beforeEach(function() {
      todoList.addTodo('someTodo');
      todoList.addTodo('otherTodo');
      spy0 = sinon.spy();
      spy1 = sinon.spy();
      sinon.replace(todoList.todos[0], 'editItem', spy0);
      sinon.replace(todoList.todos[1], 'editItem', spy1);
    });

    it('should add an item to the given todo only', function() {
      todoList.addItem(1, 'newTask');
      todoList.editTask(1, 0, 'editedTask');
      sinon.assert.calledWithExactly(spy1, 0, 'editedTask');
      sinon.assert.notCalled(spy0);
    });
  });

  context('.toggleItemStatus', function() {
    let spy0, spy1;

    beforeEach(function() {
      todoList.addTodo('someTodo');
      todoList.addTodo('otherTodo');
      spy0 = sinon.spy();
      spy1 = sinon.spy();
      sinon.replace(todoList.todos[0], 'toggleItemStatus', spy0);
      sinon.replace(todoList.todos[1], 'toggleItemStatus', spy1);
    });

    it('should add an item to the given todo only', function() {
      todoList.addItem(1, 'newTask');
      todoList.toggleItemStatus(1, 0);
      sinon.assert.calledWithExactly(spy1, 0);
      sinon.assert.notCalled(spy0);
    });
  });

  context('TodoList.load', function() {
    let todoList;
    const todos = [
      {
        title: 'picture',
        todoId: 1,
        items: [
          {
            task: 'fksahogd',
            taskId: 1,
            isDone: false
          }
        ]
      },
      {
        title: 'today',
        todoId: 2,
        items: []
      }
    ];

    beforeEach(function() {
      todoList = TodoList.load(todos);
    });

    it('should return an instance of TodoList', function() {
      assert.isTrue(todoList instanceof TodoList);
    });

    it('should load all the todos into todoList', function() {
      assert.strictEqual(todoList.todos.length, todos.length);
    });

    it('loaded todos should be instances of Todo', function() {
      assert.isTrue(todoList.todos.every(todo => todo instanceof Todo));
    });
  });
});
