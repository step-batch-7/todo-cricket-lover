'use strict';
const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { TODOS_PATH } = require('./config');
const CONTENT_TYPES = require('./public/lib/mimeTypes');

const readBody = function(req, res, next) {
  let userDetails = '';
  req.on('data', chunk => {
    userDetails += chunk;
    return userDetails;
  });
  req.on('end', () => {
    req.body = userDetails;
    next();
  });
};

const serveTodoList = function(req, res) {
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todoList));
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todoList));
};

const STATIC_FOLDER = `${__dirname}/public`;

const serveStaticPage = function(req, res, next) {
  const filename = req.url === '/' ? '/index.html' : req.url;

  if (!fs.existsSync(`./public${filename}`)) {
    return next();
  }
  const fileContent = fs.readFileSync(`${STATIC_FOLDER}${filename}`);
  const [, extension] = filename.split('.');
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(fileContent);
};

const getTodoList = function() {
  if (fs.existsSync(TODOS_PATH)) {
    return JSON.parse(fs.readFileSync(TODOS_PATH, 'utf8'));
  }
  return [];
};

const todoList = getTodoList();
const ID = 1;

const createNewTodo = function(req, res) {
  const { title } = querystring.parse(req.body);
  const lastTodo = todoList[todoList.length - ID];
  const id = lastTodo ? lastTodo.id + ID : ID;
  const todo = { title, items: [], id };
  todoList.push(todo);
  serveTodoList(req, res);
};

const deleteTodo = function(req, res) {
  const { todoId } = querystring.parse(req.body);
  const todoIndex = todoList.findIndex(todo => todo.id === +todoId);
  todoList.splice(todoIndex, ID);
  serveTodoList(req, res);
};

const createNewItem = function(req, res) {
  const { item, todoId } = querystring.parse(req.body);
  const todo = todoList.find(todo => todo.id === +todoId);
  const { items } = todo;
  const lastItem = items[items.length - ID];
  const itemId = lastItem ? lastItem.id + ID : ID;
  items.push({ item, id: itemId, isDone: false });
  serveTodoList(req, res);
};

const deleteItem = function(req, res) {
  const { taskId, todoId } = querystring.parse(req.body);
  const { items } = todoList.find(todo => todo.id === +todoId);
  const itemIndex = items.findIndex(item => item.id === +taskId);
  items.splice(itemIndex, ID);
  serveTodoList(req, res);
};

const changeStatus = function(req, res) {
  const { taskId, todoId } = querystring.parse(req.body);
  const todo = todoList.find(todo => todo.id === +todoId);
  const item = todo.items.find(item => item.id === +taskId);
  item.isDone = !item.isDone;
  serveTodoList(req, res);
};

const serveBadRequestPage = function(req, res) {
  res.statusCode = 404;
  res.end('Page not found');
};

const methodNotAllowed = function(req, res) {
  res.statusCode = 405;
  res.end();
};

const app = new App();

app.use(readBody);
app.get('todoList', serveTodoList);
app.get('', serveStaticPage);
app.post('createNewTodo', createNewTodo);
app.post('deleteTodo', deleteTodo);
app.post('createNewItem', createNewItem);
app.post('deleteItem', deleteItem);
app.post('changeStatus', changeStatus);
app.get('', serveBadRequestPage);
app.post('', serveBadRequestPage);
app.use(methodNotAllowed);

module.exports = { app };
