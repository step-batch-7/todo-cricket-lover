const { Item } = require('./item');

class Todo {
  constructor(title, id) {
    this.title = title;
    this.todoId = id;
    this.items = [];
  }

  editTitle(newTitle) {
    this.title = newTitle;
  }

  getId() {
    return this.todoId;
  }

  generateId() {
    const itemsLength = this.items.length;
    if (!itemsLength) {
      return itemsLength;
    }
    const lastItemId = this.items[itemsLength - 1].taskId;
    return lastItemId + 1;
  }

  addItem(task, id, isDone = false) {
    const taskId = id || this.generateId();
    this.items.push(new Item(task, taskId, isDone));
  }

  findItem(taskId) {
    const itemIndex = this.items.findIndex(item => item.taskId === taskId);
    if (itemIndex === -1) {
      return { index: Infinity };
    }
    const found = this.items[itemIndex];
    return { found, index: itemIndex };
  }

  deleteItem(taskId) {
    const { index } = this.findItem(taskId);
    this.items.splice(index, 1);
  }

  editItem(taskId, newTask) {
    const { found } = this.findItem(taskId);
    found.editTask(newTask);
  }

  toggleItemStatus(taskId) {
    const { found } = this.findItem(taskId);
    found.toggleStatus();
  }

  static load({ title, todoId, items }) {
    const todo = new Todo(title, todoId);
    items.forEach(({ task, taskId, isDone }) => {
      todo.addItem(task, taskId, isDone);
    });
    return todo;
  }
}

module.exports = { Todo };
