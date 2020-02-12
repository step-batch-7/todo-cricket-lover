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

  addItem(task) {
    const id = this.generateId();
    this.items.push(new Item(task, id, false));
  }

  deleteItem(taskId) {
    const itemIndex = this.items.findIndex(item => item.taskId === taskId);
    if (itemIndex === -1) {
      return;
    }
    this.items.splice(itemIndex, 1);
  }
}

module.exports = { Todo };
