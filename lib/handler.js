'use strict';
const fs = require('fs');
const express = require('express');
const { TodoList } = require('./todoList');
const { TODOS_PATH } = require('./config');
const INDENT = 2;

const getTodoList = function() {
  if (fs.existsSync(TODOS_PATH)) {
    return JSON.parse(fs.readFileSync(TODOS_PATH, 'utf8'));
  }
  return [];
};

const writeToTodoList = function(todoList) {
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todoList.todos, null, INDENT));
};

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
  writeToTodoList(todoList);
  next();
};

const changeItemStatus = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { taskId, todoId } = req.body;
  todoList.toggleItemStatus(+todoId, +taskId);
  writeToTodoList(todoList);
  next();
};

const deleteItem = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { taskId, todoId } = req.body;
  todoList.deleteItem(+todoId, +taskId);
  writeToTodoList(todoList);
  next();
};

const createNewItem = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { task, todoId } = req.body;
  todoList.addItem(+todoId, task);
  writeToTodoList(todoList);
  next();
};

const renameTitle = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { todoId, newTitle } = req.body;
  todoList.editTitle(+todoId, newTitle);
  writeToTodoList(todoList);
  next();
};

const deleteTodo = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { todoId } = req.body;
  todoList.deleteTodo(+todoId);
  writeToTodoList(todoList);
  next();
};

const createNewTodo = function(req, res, next) {
  const todos = getTodoList();
  const todoList = TodoList.load(todos);
  const { title } = req.body;
  todoList.addTodo(title);
  writeToTodoList(todoList);
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
