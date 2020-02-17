const { TodoList } = require('./todoList');
const {
  getUserTodos,
  updateUserTodos,
  getUserInfo,
  updateUserInfo
} = require('./fileSystem');

const loadUserTodos = function() {
  const userTodos = getUserTodos();
  if (Object.keys(userTodos).length === 0) {
    return {};
  }
  for (const usr in userTodos) {
    userTodos[usr] = TodoList.load(userTodos[usr]);
  }
  return userTodos;
};

const unloadUserTodos = function(userTodos) {
  const userTodosJson = {};
  for (const user in userTodos) {
    userTodosJson[user] = userTodos[user].todos;
  }
  updateUserTodos(userTodosJson);
};

const userTodos = loadUserTodos();
const userInfo = getUserInfo();
const session = {};

module.exports = {
  TodoList,
  userTodos,
  userInfo,
  session,
  updateUserInfo,
  unloadUserTodos
};
