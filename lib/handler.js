'use strict';
const { TodoList } = require('./todoList');
const {
  getTodoList,
  writeToTodoList,
  getUserInfo,
  updateUserInfo
} = require('./fileSystem');

const userInfo = getUserInfo();
const todos = getTodoList();
const todoList = TodoList.load(todos);
const session = {};

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
  todoList.editTask(+todoId, +taskId, newTask);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const changeItemStatus = function(req, res) {
  const { taskId, todoId } = req.body;
  const { todoList } = req.data;
  todoList.toggleItemStatus(+todoId, +taskId);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const deleteItem = function(req, res) {
  const { taskId, todoId } = req.body;
  const { todoList } = req.data;
  todoList.deleteItem(+todoId, +taskId);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const createNewItem = function(req, res) {
  const { task, todoId } = req.body;
  const { todoList } = req.data;
  todoList.addItem(+todoId, task);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const renameTitle = function(req, res) {
  const { todoId, newTitle } = req.body;
  const { todoList } = req.data;
  todoList.editTitle(+todoId, newTitle);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const deleteTodo = function(req, res) {
  const { todoId } = req.body;
  const { todoList } = req.data;
  todoList.deleteTodo(+todoId);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const createNewTodo = function(req, res) {
  const { title } = req.body;
  const { todoList } = req.data;
  todoList.addTodo(title);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const serveTodoList = function(req, res) {
  res.json(todoList.todos);
};

const generateSesId = function(name) {
  return name + new Date().getTime();
};

const userLogin = function(req, res) {
  const { userName, password } = req.body;
  if (!userInfo[userName] || userInfo[userName] !== password) {
    res.status(401).end('Wrong username or password');
    return;
  }
  const sessionId = generateSesId(userName);
  session[sessionId] = userName;
  res.cookie('_sesId', sessionId);
  res.set('Location', '/homePage.html');
  res.end();
};

const signUserUp = function(req, res) {
  const { userName, password } = req.body;
  if (Object.keys(userInfo).includes(userName)) {
    res.status(409).end('Username already exists');
    return;
  }
  userInfo[userName] = password;
  updateUserInfo(userInfo);
  res.end('Successfully Registered');
};

const injectDependencies = function(req, res, next) {
  req.data = { todoList };
  next();
};

const requestLogger = function(req, res, next) {
  process.stdout.write(`${req.method} ${req.url} \n`);
  next();
};

module.exports = {
  requestLogger,
  injectDependencies,
  signUserUp,
  userLogin,
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
