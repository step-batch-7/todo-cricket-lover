const express = require('express');
const {
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
} = require('./handler');

const attachPatchHandlers = function(app) {
  app.patch(/^\/modifyItem$/, modifyItem);
  app.patch(/^\/renameTitle$/, renameTitle);
};

const attachDeleteHandlers = function(app) {
  app.delete(/^\/deleteTodo$/, deleteTodo);
  app.delete(/^\/deleteItem$/, deleteItem);
};

const attachPostHandlers = function(app) {
  app.post(/^\/signUserUp$/, signUserUp);
  app.post(/^\/userLogin$/, userLogin);
  app.post(/^\/createNewTodo$/, createNewTodo);
  app.post(/^\/createNewItem$/, createNewItem);
  app.post(/^\/changeItemStatus$/, changeItemStatus);
};

const attachGetHandlers = function(app) {
  app.get(/^\/todoList$/, serveTodoList);
  app.get(/.*/, express.static('./public'));
};

const app = express();

app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(injectDependencies);
attachGetHandlers(app);
attachPostHandlers(app);
attachDeleteHandlers(app);
attachPatchHandlers(app);
app.use(serveBadRequestPage);
app.use(methodNotAllowed);

module.exports = { app };
