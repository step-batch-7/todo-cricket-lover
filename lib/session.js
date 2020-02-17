class Session {
  constructor() {
    this.session = {};
  }

  addUser(username) {
    const sesId = username + new Date().getTime();
    this.session[sesId] = username;
    return sesId;
  }

  deleteUser(sesId) {
    return delete this.session[sesId];
  }

  getUser(sesId) {
    return this.session[sesId];
  }
}

module.exports = { Session };
