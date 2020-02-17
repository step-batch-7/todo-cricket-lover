const { TodoList } = require('./todoList');
const { updateUserInfo } = require('./fileSystem');

class Users {
  constructor() {
    this.users = [];
  }

  findUser(username) {
    return this.users.find(user => user.username === username);
  }

  doesExist(username) {
    if (this.findUser(username)) {
      return true;
    }
    return false;
  }

  getData(username) {
    const user = this.findUser(username);
    if (!user) {
      return;
    }
    return user.data;
  }

  getUserInfo() {
    const userInfo = {};
    this.users.forEach(user => {
      const { username, password } = user;
      userInfo[username] = password;
    });
    return userInfo;
  }

  getUserTodos() {
    const userTodos = {};
    this.users.forEach(user => {
      const { username, data } = user;
      userTodos[username] = data;
    });
    return userTodos;
  }

  addUser(username, password) {
    this.users.push({ username, password, data: TodoList.load([]) });
    updateUserInfo(this.getUserInfo());
  }

  authUser(username, password) {
    const user = this.findUser(username);
    if (user) {
      return user.password === password;
    }
    return false;
  }

  static load(userCredentials, userData) {
    const users = new Users();
    for (const user in userCredentials) {
      const username = user;
      const password = userCredentials[user];
      const data = TodoList.load(userData[user]);
      users.users.push({ username, password, data });
    }
    return users;
  }
}

module.exports = { Users };
