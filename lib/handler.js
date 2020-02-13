'use strict';
const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { TodoList } = require('./todoList');
const { TODOS_PATH } = require('./config');
const CONTENT_TYPES = require('./mimeTypes');
const INDENT = 2;

const getTodoList = function() {
  if (fs.existsSync(TODOS_PATH)) {
    return JSON.parse(fs.readFileSync(TODOS_PATH, 'utf8'));
  }
  return [];
};

const writeToTodoList = function(todoList) {
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todoList, null, INDENT));
};

const methodNotAllowed = function(req, res) {
  res.statusCode = 405;
  res.end();
};

const serveBadRequestPage = function(req, res) {
  res.statusCode = 404;
  res.end('Page not found');
};

const modifyItem = function(req, res, next) {
  const todoList = getTodoList();
  const { todoId, taskId, newTask } = req.body;
  const todo = todoList.find(todo => todo.todoId === +todoId);
  const item = todo.items.find(item => item.taskId === +taskId);
  item.task = newTask;
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

const serveStaticPage = function(req, res, next) {
  const filename = req.url === '/' ? '/index.html' : req.url;

  if (!fs.existsSync(`./public${filename}`)) {
    return next();
  }
  const fileContent = fs.readFileSync(`./public${filename}`);
  const [, extension] = filename.split('.');
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(fileContent);
};

const serveTodoList = function(req, res) {
  const todoList = getTodoList();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todoList));
};

const readBody = function(req, res, next) {
  let userDetails = '';
  req.on('data', chunk => {
    userDetails += chunk;
  });
  req.on('end', () => {
    req.body = querystring.parse(userDetails);
    next();
  });
};

const attachPostHandlers = function(app) {
  app.post('^/createNewTodo$', createNewTodo);
  app.post('^/deleteTodo$', deleteTodo);
  app.post('^/renameTitle$', renameTitle);
  app.post('^/createNewItem$', createNewItem);
  app.post('^/deleteItem$', deleteItem);
  app.post('^/changeItemStatus$', changeItemStatus);
  app.post('^/modifyItem$', modifyItem);
  app.post('', serveTodoList);
  app.post('', serveBadRequestPage);
};

const initiateApp = function() {
  const app = new App();

  app.use(readBody);
  app.get('^/todoList$', serveTodoList);
  app.get('', serveStaticPage);
  attachPostHandlers(app);
  app.get('', serveBadRequestPage);
  app.use(methodNotAllowed);

  return app;
};

const serveApp = function(req, res) {
  const app = initiateApp();
  app.serve(req, res);
};

module.exports = { serveApp };
