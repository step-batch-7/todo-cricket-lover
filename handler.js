'use strict';
const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const COMMENTS_PATH = `${__dirname}/data/todo.json`;

const CONTENT_TYPES = require('./public/lib/mimeTypes');

const serveBadRequestPage = function(req, res) {
  res.statusCode = 404;
  res.end('Page not found');
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

const getTodos = function() {
  if (fs.existsSync(COMMENTS_PATH)) {
    return JSON.parse(fs.readFileSync(COMMENTS_PATH, 'utf8'));
  }
  return [];
};
const todos = getTodos();

const deleteTask = function(req, res) {
  const id = +req.body;
  const index = todos.findIndex(todo => todo.id === id);
  todos.splice(index, ID);
  serveTodoList(req, res);
};

const deleteItem = function(req, res) {
  const { taskId, todoId } = querystring.parse(req.body);
  const todo = todos.find(todo => todo.id === +todoId);
  const index = todo.items.findIndex(item => item.id === +taskId);
  todo.items.splice(index, ID);
  serveTodoList(req, res);
};

const serveTodoList = function(req, res) {
  fs.writeFileSync(COMMENTS_PATH, JSON.stringify(todos));
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todos));
};

const ID = 1;

const createNewTask = function(req, res) {
  const { title } = querystring.parse(req.body);
  const lastTodo = todos[todos.length - ID];
  const id = lastTodo ? lastTodo.id + ID : ID;
  const todo = { title, items: [], id };
  todos.push(todo);
  serveTodoList(req, res);
};

const createNewItem = function(req, res) {
  const { item, todoId } = querystring.parse(req.body);
  const todo = todos.find(todo => todo.id === +todoId);
  const { items } = todo;
  const lastItem = items[items.length - ID];
  const itemId = lastItem ? lastItem.id + ID : ID;
  items.push({ item, id: itemId, isDone: false });
  serveTodoList(req, res);
};

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

const methodNotAllowed = function(req, res) {
  res.statusCode = 405;
  res.end();
};

const app = new App();

app.use(readBody);
app.get('todoList', serveTodoList);
app.get('', serveStaticPage);
app.post('createNewTask', createNewTask);
app.post('deleteTask', deleteTask);
app.post('createNewItem', createNewItem);
app.post('deleteItem', deleteItem);
app.get('', serveBadRequestPage);
app.post('', serveBadRequestPage);
app.use(methodNotAllowed);

module.exports = { app };
