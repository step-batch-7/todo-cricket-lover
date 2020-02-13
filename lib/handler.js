'use strict';
const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
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

const ID = 1;

const serveTodoList = function(req, res) {
  const todoList = getTodoList();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todoList));
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

const createNewTodo = function(req, res, next) {
  const todoList = getTodoList();
  const { title } = req.body;
  const lastTodo = todoList[todoList.length - ID];
  const todoId = lastTodo ? lastTodo.todoId + ID : ID;
  const todo = { title, todoId, items: [] };
  todoList.push(todo);
  writeToTodoList(todoList);
  next();
};

const deleteTodo = function(req, res, next) {
  const todoList = getTodoList();
  const { todoId } = req.body;
  const todoIndex = todoList.findIndex(todo => todo.todoId === +todoId);
  todoList.splice(todoIndex, ID);
  writeToTodoList(todoList);
  next();
};

const createNewItem = function(req, res, next) {
  const todoList = getTodoList();
  const { task, todoId } = req.body;
  const todo = todoList.find(todo => todo.todoId === +todoId);
  const { items } = todo;
  const lastItem = items[items.length - ID];
  const taskId = lastItem ? lastItem.taskId + ID : ID;
  items.push({ task, taskId, isDone: false });
  writeToTodoList(todoList);
  next();
};

const deleteItem = function(req, res, next) {
  const todoList = getTodoList();
  const { taskId, todoId } = req.body;
  const { items } = todoList.find(todo => todo.todoId === +todoId);
  const itemIndex = items.findIndex(item => item.taskId === +taskId);
  items.splice(itemIndex, ID);
  writeToTodoList(todoList);
  next();
};

const changeItemStatus = function(req, res, next) {
  const todoList = getTodoList();
  const { taskId, todoId } = req.body;
  const todo = todoList.find(todo => todo.todoId === +todoId);
  const item = todo.items.find(item => item.taskId === +taskId);
  item.isDone = !item.isDone;
  writeToTodoList(todoList);
  next();
};

const renameTitle = function(req, res, next) {
  const todoList = getTodoList();
  const { todoId, newTitle } = req.body;
  const todo = todoList.find(todo => todo.todoId === +todoId);
  todo.title = newTitle;
  writeToTodoList(todoList);
  next();
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

const serveBadRequestPage = function(req, res) {
  res.statusCode = 404;
  res.end('Page not found');
};

const methodNotAllowed = function(req, res) {
  res.statusCode = 405;
  res.end();
};

const attachPostHandlers = function(app) {
  app.post('^/createNewTodo$', createNewTodo);
  app.post('^/deleteTodo$', deleteTodo);
  app.post('^/createNewItem$', createNewItem);
  app.post('^/deleteItem$', deleteItem);
  app.post('^/changeItemStatus$', changeItemStatus);
  app.post('^/renameTitle$', renameTitle);
  app.post('^/modifyItem$', modifyItem);
  app.post('', serveTodoList);
};

const initiateApp = function() {
  const app = new App();

  app.use(readBody);
  app.get('^/todoList$', serveTodoList);
  app.get('', serveStaticPage);
  attachPostHandlers(app);
  app.get('', serveBadRequestPage);
  app.post('', serveBadRequestPage);
  app.use(methodNotAllowed);

  return app;
};

const serveApp = function(req, res) {
  const app = initiateApp();
  app.serve(req, res);
};

module.exports = { serveApp };
