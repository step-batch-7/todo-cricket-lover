const { Todo } = require('./todo');

class TodoList {
  constructor() {
    this.todos = [];
  }

  generateId() {
    const todoListLength = this.todos.length;
    if (!todoListLength) {
      return todoListLength;
    }
    const lastTodoId = this.todos[todoListLength - 1].getId();
    return lastTodoId + 1;
  }

  addTodo(title) {
    const todoId = this.generateId();
    this.todos.push(new Todo(title, todoId));
  }

  findTodo(todoId) {
    const todo = this.todos.find(todo => todo.getId() === todoId);
    return todo;
  }

  deleteTodo(todoId) {
    const todoIndex = this.todos.findIndex(todo => todo.getId() === todoId);
    if (todoIndex === -1) {
      return;
    }
    return this.todos.splice(todoIndex, 1);
  }

  editTitle(todoId, newTitle) {
    const todo = this.findTodo(todoId);
    if (todo) {
      todo.editTitle(newTitle);
      return true;
    }
    return false;
  }

  addItem(todoId, newTask) {
    const todo = this.findTodo(todoId);
    if (todo) {
      todo.addItem(newTask);
      return true;
    }
    return false;
  }

  deleteItem(todoId, taskId) {
    const todo = this.findTodo(todoId);
    if (todo) {
      return todo.deleteItem(taskId);
    }
  }

  editTask(todoId, taskId, newTask) {
    const todo = this.findTodo(todoId);
    if (todo) {
      return todo.editItem(taskId, newTask);
    }
    return false;
  }

  toggleItemStatus(todoId, itemId) {
    const todo = this.findTodo(todoId);
    if (todo) {
      return todo.toggleItemStatus(itemId);
    }
    return false;
  }

  static load(todos) {
    const todoList = new TodoList();
    todos.forEach(todo => {
      todoList.todos.push(Todo.load(todo));
    });
    return todoList;
  }
}

module.exports = { TodoList };
