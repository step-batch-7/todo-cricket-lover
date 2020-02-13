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
    const todo = this.todos[todoIndex];
    return { todo, index: todoIndex };
  }

  deleteTodo(todoId) {
    const { index } = this.findTodo(todoId);
    this.todos.splice(index, 1);
  }

  editTitle(todoId, newTitle) {
    const { todo } = this.findTodo(todoId);
    todo.editTitle(newTitle);
  }

  addItem(todoId, newTask) {
    const { todo } = this.findTodo(todoId);
    todo.addItem(newTask);
  }

  deleteItem(todoId, taskId) {
    const { todo } = this.findTodo(todoId);
    todo.deleteItem(taskId);
  }

  editTask(todoId, taskId, newTask) {
    const { todo } = this.findTodo(todoId);
    todo.editItem(taskId, newTask);
  }

  toggleItemStatus(todoId, itemId) {
    const { todo } = this.findTodo(todoId);
    todo.toggleItemStatus(itemId);
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
