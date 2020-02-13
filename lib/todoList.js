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
    const todoIndex = this.todos.findIndex(todo => todo.todoId === todoId);
    if (todoIndex === -1) {
      return { index: Infinity };
    }
    const found = this.todos[todoIndex];
    return { found, index: todoIndex };
  }

  deleteTodo(todoId) {
    const { index } = this.findTodo(todoId);
    this.todos.splice(index, 1);
  }

  editTitle(newTitle, todoId) {
    const { found } = this.findTodo(todoId);
    found.editTitle(newTitle);
  }

  addItem(newTask, todoId) {
    const { found } = this.findTodo(todoId);
    found.addItem(newTask);
  }
}

module.exports = { TodoList };