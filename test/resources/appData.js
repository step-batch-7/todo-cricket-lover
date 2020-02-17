const { TodoList } = require('../../lib/todoList');
const { getUserTodos } = require('../../lib/fileSystem');

const todos = getUserTodos();
const userTodos = { userName: TodoList.load(todos) };
const userInfo = { userName: 'pswd123' };
const session = { abc123: 'userName' };
const updateUserInfo = () => {};
const unloadUserTodos = () => {};

module.exports = {
  TodoList,
  userTodos,
  userInfo,
  session,
  updateUserInfo,
  unloadUserTodos
};
