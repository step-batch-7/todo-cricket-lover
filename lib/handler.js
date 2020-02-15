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
  todoList.editTask(+todoId, +taskId, newTask);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const changeItemStatus = function(req, res) {
  const { taskId, todoId } = req.body;
  todoList.toggleItemStatus(+todoId, +taskId);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const deleteItem = function(req, res) {
  const { taskId, todoId } = req.body;
  todoList.deleteItem(+todoId, +taskId);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const createNewItem = function(req, res) {
  const { task, todoId } = req.body;
  todoList.addItem(+todoId, task);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const renameTitle = function(req, res) {
  const { todoId, newTitle } = req.body;
  todoList.editTitle(+todoId, newTitle);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const deleteTodo = function(req, res) {
  const { todoId } = req.body;
  todoList.deleteTodo(+todoId);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const createNewTodo = function(req, res) {
  const { title } = req.body;
  todoList.addTodo(title);
  writeToTodoList(todoList.todos);
  res.json(todoList.todos);
};

const serveTodoList = function(req, res) {
  res.json(todoList.todos);
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

const requestLogger = function(req, res, next) {
  process.stdout.write(`${req.method} ${req.url} \n`);
  next();
};

module.exports = {
  requestLogger,
  signUserUp,
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
