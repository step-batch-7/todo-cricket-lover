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
    const lastItemId = this.items[itemsLength - 1].getId();
    return lastItemId + 1;
  }

  addItem(task, id, isDone = false) {
    const taskId = id || this.generateId();
    this.items.push(new Item(task, taskId, isDone));
  }

  findItem(taskId) {
    const item = this.items.find(item => item.taskId === taskId);
    return item;
  }

  deleteItem(taskId) {
    let itemIndex = this.items.findIndex(item => item.taskId === taskId);
    if (itemIndex === -1) {
      itemIndex = Infinity;
    }
    this.items.splice(itemIndex, 1);
  }

  editItem(taskId, newTask) {
    const item = this.findItem(taskId);
    item.editTask(newTask);
  }

  toggleItemStatus(taskId) {
    const item = this.findItem(taskId);
    item.toggleStatus();
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
