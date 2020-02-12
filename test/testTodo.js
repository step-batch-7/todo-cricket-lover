const { assert } = require('chai');
const sinon = require('sinon');
const { Todo } = require('../lib/todo');
const { Item } = require('../lib/item');

describe('Todo', function() {
  let todo;
  beforeEach(function() {
    todo = new Todo('someTitle', 3);
  });

  context('.editTitle', function() {
    it('should edit the title of the todo', function() {
      todo.editTitle('newTitle');
      assert.strictEqual(todo.title, 'newTitle');
    });
  });

  context('.getId', function() {
    it('should get the id of the todo', function() {
      assert.strictEqual(todo.getId(), 3);
    });
  });

  context('.addItem', function() {
    it('should add the new instance of given item to the items', function() {
      todo.addItem('someTask');
      assert.isTrue(todo.items[0] instanceof Item);
      assert.deepStrictEqual(todo.items[0], {
        task: 'someTask',
        taskId: 0,
        isDone: false
      });
    });

    it('should generate appropriate id according to the previous item', function() {
      todo.addItem('someTask');
      todo.addItem('anotherTask');
      assert.strictEqual(todo.items[1].taskId, 1);
    });

    it('should generate the item accordingly when id and isDone are given', function() {
      todo.addItem('someTask', 2, true);
      assert.deepStrictEqual(todo.items[0], {
        task: 'someTask',
        taskId: 2,
        isDone: true
      });
    });
  });

  context('.deleteItem', function() {
    let spliceSpy;

    beforeEach(function() {
      spliceSpy = sinon.spy();
      sinon.replace(Array.prototype, 'splice', spliceSpy);
    });

    afterEach(function() {
      sinon.restore();
    });

    it('should delete the item of given id if exists', function() {
      todo.addItem('someTask');
      todo.deleteItem(0);
      sinon.assert.calledWithExactly(spliceSpy, 0, 1);
      sinon.assert.calledOn(spliceSpy, todo.items);
    });

    it('should not do anything if the item does not exist', function() {
      todo.addItem('someTask');
      todo.deleteItem(1);
      sinon.assert.calledWith(spliceSpy, Infinity, 1);
      sinon.assert.calledOn(spliceSpy, todo.items);
    });
  });

  context('.editItem', function() {
    it('should edit the task of the given item ', function() {
      todo.addItem('someTask');
      todo.editItem(0, 'newTask');
      assert.strictEqual(todo.items[0].task, 'newTask');
    });
  });

  context('.toggleItemStatus', function() {
    it('should toggle the status of the given item', function() {
      todo.addItem('someTask');
      todo.toggleItemStatus(0);
      assert.isTrue(todo.items[0].isDone);
    });
  });

  context('Todo.load', function() {
    let todoObject;
    beforeEach(function() {
      todoObject = {
        title: 'someTitle',
        todoId: 1,
        items: [{ task: 'someTask', taskId: 2, isDone: false }]
      };
      todo = Todo.load(todoObject);
    });

    it('should load an instance of Todo and Item', function() {
      assert.isTrue(todo instanceof Todo);
      assert.isTrue(todo.items[0] instanceof Item);
    });

    it('should create a todo out of actual given data', function() {
      assert.deepStrictEqual(todo, todoObject);
    });
  });
});
