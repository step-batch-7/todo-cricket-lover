'use strict';
const { APP_DATA_PATH } = require('./config');
const {
  TodoList,
  userTodos,
  userInfo,
  session,
  updateUserInfo,
  unloadUserTodos
} = require(`${APP_DATA_PATH}`);

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
    unloadUserTodos(req.dependencies.userTodos);
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const changeItemStatus = function(req, res) {
  const { taskId, todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.toggleItemStatus(+todoId, +taskId)) {
    unloadUserTodos(req.dependencies.userTodos);
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const deleteItem = function(req, res) {
  const { taskId, todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.deleteItem(+todoId, +taskId)) {
    unloadUserTodos(req.dependencies.userTodos);
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const createNewItem = function(req, res) {
  const { task, todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.addItem(+todoId, task)) {
    unloadUserTodos(req.dependencies.userTodos);
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const renameTitle = function(req, res) {
  const { todoId, newTitle } = req.body;
  const { todoList } = req.data;
  if (todoList.editTitle(+todoId, newTitle)) {
    unloadUserTodos(req.dependencies.userTodos);
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const deleteTodo = function(req, res) {
  const { todoId } = req.body;
  const { todoList } = req.data;
  if (todoList.deleteTodo(+todoId)) {
    unloadUserTodos(req.dependencies.userTodos);
    res.json(todoList.todos);
  }
  res.status(400).end();
};

const createNewTodo = function(req, res) {
  const { title } = req.body;
  const { todoList } = req.data;
  todoList.addTodo(title);
  unloadUserTodos(req.dependencies.userTodos);
  res.json(todoList.todos);
};

const serveTodoList = function(req, res) {
  const { todoList } = req.data;
  res.json(todoList.todos);
};

const logout = function(req, res) {
  const { session } = req.dependencies;
  delete session[req.cookies.sesId];
  res.clearCookie('sesId');
  res.set('Location', '/').end();
};

const userLogin = function(req, res) {
  const { userInfo, session } = req.dependencies;
  const { userName, password } = req.body;
  if (!userInfo[userName] || userInfo[userName] !== password) {
    res.status(401).end('Wrong username or password');
    return;
  }
  const sessionId = userName + new Date().getTime();
  session[sessionId] = userName;
  res.cookie('sesId', sessionId);
  res.set('Location', '/homePage.html').end();
};

const signUserUp = function(req, res) {
  const { userInfo, userTodos } = req.dependencies;
  const { userName, password } = req.body;
  if (Object.keys(userInfo).includes(userName)) {
    res.status(409).end('Username already exists');
    return;
  }
  userInfo[userName] = password;
  updateUserInfo(userInfo);
  userTodos[userName] = TodoList.load([]);
  unloadUserTodos(userTodos);
  res.end('Successfully Registered');
};

const injectData = function(req, res, next) {
  const { userTodos } = req.dependencies;
  const todoList = userTodos[req.user];
  req.data = { todoList };
  next();
};

const isLoginPageResource = url => url === '/' || url.match(/index/);

// eslint-disable-next-line complexity
const authUser = function(req, res, next) {
  const { session } = req.dependencies;
  if (!session[req.cookies.sesId] && !isLoginPageResource(req.url)) {
    res.status(401).end('session expired');
    return;
  }

  if (session[req.cookies.sesId] && req.url === '/') {
    req.url = 'homePage.html';
  }

  req.user = session[req.cookies.sesId];
  next();
};

const injectDependencies = function(req, res, next) {
  req.dependencies = { userTodos, userInfo, session };
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
