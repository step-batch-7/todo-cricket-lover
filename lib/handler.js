'use strict';
const express = require('express');
const { TodoList } = require('./todoList');
const { getTodoList, writeToTodoList } = require('./fileSystem');

const methodNotAllowed = function(req, res) {
  res.status(405).end('Method not Allowed');
};

const serveBadRequestPage = function(req, res, next) {
  if (req.method === 'GET' || req.method === 'POST') {
    res.status(404).end('Page not found');
  }
  next();
};

const modifyItem = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { todoId, taskId, newTask } = req.body;
  todoList.editTask(+todoId, +taskId, newTask);
  writeToTodoList(todoList.todos);
  next();
};

const changeItemStatus = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { taskId, todoId } = req.body;
  todoList.toggleItemStatus(+todoId, +taskId);
  writeToTodoList(todoList.todos);
  next();
};

const deleteItem = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { taskId, todoId } = req.body;
  todoList.deleteItem(+todoId, +taskId);
  writeToTodoList(todoList.todos);
  next();
};

const createNewItem = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { task, todoId } = req.body;
  todoList.addItem(+todoId, task);
  writeToTodoList(todoList.todos);
  next();
};

const renameTitle = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { todoId, newTitle } = req.body;
  todoList.editTitle(+todoId, newTitle);
  writeToTodoList(todoList.todos);
  next();
};

const deleteTodo = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { todoId } = req.body;
  todoList.deleteTodo(+todoId);
  writeToTodoList(todoList.todos);
  next();
};

const createNewTodo = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { title } = req.body;
  todoList.addTodo(title);
  writeToTodoList(todoList.todos);
  next();
};

const serveTodoList = function(req, res) {
  const todoList = getTodoList();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todoList));
};

const requestLogger = function(req, res, next) {
  process.stdout.write(`${req.method} ${req.url} \n`);
  next();
};

const attachPostHandlers = function(app) {
  app.post(/^\/createNewTodo$/, createNewTodo);
  app.post(/^\/deleteTodo$/, deleteTodo);
  app.post(/^\/renameTitle$/, renameTitle);
  app.post(/^\/createNewItem$/, createNewItem);
  app.post(/^\/deleteItem$/, deleteItem);
  app.post(/^\/changeItemStatus$/, changeItemStatus);
  app.post(/^\/modifyItem$/, modifyItem);
  app.post(/[(item) | (todo) | (title)]/i, serveTodoList);
};

const initiateApp = function() {
  const app = express();

  app.use(requestLogger);
  app.use(express.urlencoded({ extended: true }));
  app.get(/^\/todoList$/, serveTodoList);
  app.get(/.*/, express.static('./public'));
  attachPostHandlers(app);
  app.use(serveBadRequestPage);
  app.use(methodNotAllowed);
  return app;
};

const app = initiateApp();

module.exports = { app };
