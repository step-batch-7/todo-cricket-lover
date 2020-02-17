const { Sessions } = require('../../lib/sessions');
const { Users } = require('../../lib/users');
const { getUserTodos } = require('../../lib/fileSystem');

const userTodos = getUserTodos();
const userInfo = { userName: 'pswd123' };
const sessions = new Sessions();
sessions.session = { abc123: 'userName' };
const unloadUserTodos = () => {};

const users = Users.load(userInfo, userTodos);

module.exports = {
  users,
  sessions,
  unloadUserTodos
};
