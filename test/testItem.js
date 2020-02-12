const { assert } = require('chai');
const { Item } = require('../lib/item');

describe('Item', function() {
  let item;
  beforeEach(function() {
    item = new Item('helloWorld', 1, false);
  });

  context('.editTask', function() {
    it('should edit the task', function() {
      item.editTask('newTask');
      assert.strictEqual(item.task, 'newTask');
    });
  });

  context('.toggleStatus', function() {
    it('should toggle the status of the task', function() {
      item.toggleStatus();
      assert.isTrue(item.isDone);
    });
  });

  context('.getId', function() {
    it('should get the id of the task', function() {
      assert.strictEqual(item.getId(), 1);
    });
  });
});
