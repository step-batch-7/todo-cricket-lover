'use strict';
const matchRoute = function(route, req) {
  if (route.method) {
    const path = new RegExp(route.path);
    return req.method === route.method && req.url.match(path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }

  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }

  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }

  use(handler) {
    this.routes.push({ handler });
  }

  serve(req, res) {
    const matchingHandlers = this.routes.filter(route => {
      return matchRoute(route, req);
    });

    const next = function() {
      const router = matchingHandlers.shift();
      router.handler(req, res, next);
    };

    next();
  }
}

module.exports = { App };
