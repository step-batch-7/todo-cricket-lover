const fs = require('fs');
const { TODOS_PATH } = require('./config');
const USER_INFO_PATH = './data/userInfo.json';
const INDENT = 2;

const updateUserInfo = function(updatedUsers) {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }
  fs.writeFileSync(USER_INFO_PATH, JSON.stringify(updatedUsers, null, INDENT));
};

const getUserInfo = function() {
  if (fs.existsSync(USER_INFO_PATH)) {
    return JSON.parse(fs.readFileSync(USER_INFO_PATH, 'utf8'));
  }
  return {};
};

const writeToTodoList = function(todos) {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, INDENT));
};

const getTodoList = function() {
  if (fs.existsSync(TODOS_PATH)) {
    return JSON.parse(fs.readFileSync(TODOS_PATH, 'utf8'));
  }
  return [];
};

module.exports = { getTodoList, writeToTodoList, getUserInfo, updateUserInfo };
