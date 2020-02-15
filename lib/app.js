const express = require('express');
const {
  requestLogger,
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

const attachPostHandlers = function(app) {
  app.post(/^\/createNewTodo$/, createNewTodo);
  app.post(/^\/deleteTodo$/, deleteTodo);
  app.post(/^\/renameTitle$/, renameTitle);
  app.post(/^\/createNewItem$/, createNewItem);
  app.post(/^\/deleteItem$/, deleteItem);
  app.post(/^\/changeItemStatus$/, changeItemStatus);
  app.post(/^\/modifyItem$/, modifyItem);
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
