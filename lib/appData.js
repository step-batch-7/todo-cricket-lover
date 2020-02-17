const { Sessions } = require('./sessions');
const { Users } = require('./users');
const { getUserTodos, updateUserTodos, getUserInfo } = require('./fileSystem');

const unloadUserTodos = function(userTodos) {
  const userTodosJson = {};
  for (const user in userTodos) {
    userTodosJson[user] = userTodos[user].todos;
  }
  updateUserTodos(userTodosJson);
};

const userTodos = getUserTodos();
const userInfo = getUserInfo();
const users = Users.load(userInfo, userTodos);
const sessions = new Sessions();

module.exports = {
  users,
  sessions,
  unloadUserTodos
};
