class Sessions {
  constructor() {
    this.session = {};
  }

  addSession(username) {
    const sesId = username + new Date().getTime();
    this.session[sesId] = username;
    return sesId;
  }

  deleteSession(sesId) {
    return delete this.session[sesId];
  }

  getUser(sesId) {
    return this.session[sesId];
  }
}

module.exports = { Sessions };
