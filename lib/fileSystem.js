const fs = require('fs');
const { TODOS_PATH } = require('./config');
const INDENT = 2;

const getTodoList = function() {
  if (fs.existsSync(TODOS_PATH)) {
    return JSON.parse(fs.readFileSync(TODOS_PATH, 'utf8'));
  }
  return [];
};

const writeToTodoList = function(todos) {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, INDENT));
};

module.exports = { getTodoList, writeToTodoList };
