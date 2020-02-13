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
    it('should delete the item of given id if exists', function() {
      todoList.addTodo('someTodo');
      assert.deepStrictEqual(todoList.deleteTodo(0), [
        { todoId: 0, title: 'someTodo', items: [] }
      ]);
    });

    it('should do nothing when todo does not exist for a given id', function() {
      assert.isUndefined(todoList.deleteTodo(0));
    });
  });

  context('.editTitle', function() {
    it('should edit the title of the given todo only', function() {
      todoList.addTodo('someTitle');
      assert.isTrue(todoList.editTitle(0, 'newTitle'));
    });

    it('should return false when todo is not found', function() {
      assert.isFalse(todoList.editTitle(0, 'newTitle'));
    });
  });

  context('.addItem', function() {
    it('should add an item to the given todo when exists', function() {
      todoList.addTodo('someTodo');
      assert.isTrue(todoList.addItem(0, 'newTask'));
    });

    it('should return false when todo is not found', function() {
      assert.isFalse(todoList.addItem(0, 'newTask'));
    });
  });

  context('.deleteItem', function() {
    it('should delete the item if it is found', function() {
      todoList.addTodo('newTodo');
      todoList.addItem(0, 'newTask');
      assert.deepStrictEqual(todoList.deleteItem(0, 0), [
        { taskId: 0, task: 'newTask', isDone: false }
      ]);
    });

    it('should do nothing if item is not found', function() {
      todoList.addTodo('newTodo');
      assert.isUndefined(todoList.deleteItem(0, 0));
      assert.isUndefined(todoList.deleteItem(0, 0));
    });

    it('should do nothing if todo is not found', function() {
      assert.isUndefined(todoList.deleteItem(0, 0));
    });
  });

  context('.editTask', function() {
    it('should edit the task if item is found', function() {
      todoList.addTodo('newTodo');
      todoList.addItem(0, 'newTask');
      assert.isTrue(todoList.editTask(0, 0, 'editedTask'));
    });

    it('should do nothing if item is not found', function() {
      todoList.addTodo('newTodo');
      assert.isFalse(todoList.editTask(0, 0, 'editedTask'));
      assert.isFalse(todoList.editTask(0, 0, 'editedTask'));
    });

    it('should do nothing if todo is not found', function() {
      assert.isFalse(todoList.editTask(0, 0, 'editedTask'));
    });
  });

  context('.toggleItemStatus', function() {
    it('should edit the task if item is found', function() {
      todoList.addTodo('newTodo');
      todoList.addItem(0, 'newTask');
      assert.isTrue(todoList.toggleItemStatus(0, 0));
    });

    it('should do nothing if item is not found', function() {
      todoList.addTodo('newTodo');
      assert.isFalse(todoList.toggleItemStatus(0, 0));
      assert.isFalse(todoList.toggleItemStatus(0, 0));
    });

    it('should do nothing if todo is not found', function() {
      assert.isFalse(todoList.toggleItemStatus(0, 0));
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
