'use strict';
const { APP_DATA_PATH } = require('./config');
const { users, sessions, unloadUserTodos } = require(`${APP_DATA_PATH}`);

const methodNotAllowed = function(req, res) {
  res.status(405).end('Method not Allowed');
};

const serveBadRequestPage = function(req, res, next) {
  if (req.method === 'GET' || req.method === 'POST') {
    res.status(404).end('Page not found');
  }
  next();
};

const modifyItem = function(req, res) {
  const { todoId, taskId, newTask } = req.body;
  const { todoList } = req.data;
  if (todoList.editTask(+todoId, +taskId, newTask)) {
    unloadUserTodos(req.dependencies.users.getUserTodos());
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const changeItemStatus = function(req, res) {
  const { taskId, todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.toggleItemStatus(+todoId, +taskId)) {
    unloadUserTodos(req.dependencies.users.getUserTodos());
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const deleteItem = function(req, res) {
  const { taskId, todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.deleteItem(+todoId, +taskId)) {
    unloadUserTodos(req.dependencies.users.getUserTodos());
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const createNewItem = function(req, res) {
  const { task, todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.addItem(+todoId, task)) {
    unloadUserTodos(req.dependencies.users.getUserTodos());
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const renameTitle = function(req, res) {
  const { todoId, newTitle } = req.body;
  const { todoList } = req.data;
  if (todoList.editTitle(+todoId, newTitle)) {
    unloadUserTodos(req.dependencies.users.getUserTodos());
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const deleteTodo = function(req, res) {
  const { todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.deleteTodo(+todoId)) {
    unloadUserTodos(req.dependencies.users.getUserTodos());
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const createNewTodo = function(req, res) {
  const { title } = req.body;
  const { todoList } = req.data;
  todoList.addTodo(title);
  unloadUserTodos(req.dependencies.users.getUserTodos());
  res.json(todoList.todos);
};

const serveTodoList = function(req, res) {
  const { todoList } = req.data;
  res.json(todoList.todos);
};

const logout = function(req, res) {
  const { sessions } = req.dependencies;
  sessions.deleteSession(req.cookies.sesId);
  res.clearCookie('sesId');
  res.set('Location', '/').end();
};

const userLogin = function(req, res) {
  const { users, sessions } = req.dependencies;
  const { userName, password } = req.body;
  if (!users.authUser(userName, password)) {
    res.status(401).end('Wrong username or password');
    return;
  }

  const sessionId = sessions.addSession(userName);
  res.cookie('sesId', sessionId);
  res.set('Location', '/homePage.html').end();
};

const signUserUp = function(req, res) {
  const { users } = req.dependencies;
  const { userName, password } = req.body;
  if (users.doesExist(userName)) {
    res.status(409).end('Username already exists');
    return;
  }
  users.addUser(userName, password);
  unloadUserTodos(users.getUserTodos());
  res.end('Successfully Registered');
};

const injectData = function(req, res, next) {
  const { users } = req.dependencies;
  const todoList = users.getData(req.user);
  req.data = { todoList };
  next();
};

const isLoginPageResource = url => url === '/' || url.match(/index/);

// eslint-disable-next-line complexity
const authUser = function(req, res, next) {
  const { sessions } = req.dependencies;
  const { sesId } = req.cookies;
  if (!sessions.getUser(sesId) && !isLoginPageResource(req.url)) {
    res.status(401).end('session expired');
    return;
  }

  if (sessions.getUser(sesId) && req.url === '/') {
    req.url = 'homePage.html';
  }

  req.user = sessions.getUser(sesId);
  next();
};

const injectDependencies = function(req, res, next) {
  req.dependencies = { users, sessions };
  next();
};

const requestLogger = function(req, res, next) {
  process.stdout.write(`${req.method} ${req.url} \n`);
  next();
};

module.exports = {
  requestLogger,
  injectDependencies,
  authUser,
  injectData,
  signUserUp,
  userLogin,
  logout,
  serveTodoList,
  createNewTodo,
  deleteTodo,
  renameTitle,
  createNewItem,
  deleteItem,
  changeItemStatus,
  modifyItem,
  serveBadRequestPage,
  methodNotAllowed
};
