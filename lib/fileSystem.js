const fs = require('fs');
const { TODOS_PATH } = require('./config');
const USER_INFO_PATH = './data/userInfo.json';
const INDENT = 2;

const updateData = function(path, data) {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }
  fs.writeFileSync(path, JSON.stringify(data, null, INDENT));
};

const getData = function(dataPath) {
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  return {};
};

const getUserInfo = getData.bind(null, USER_INFO_PATH);
const getUserTodos = getData.bind(null, TODOS_PATH);
const updateUserInfo = updateData.bind(null, USER_INFO_PATH);
const updateUserTodos = updateData.bind(null, TODOS_PATH);

module.exports = { getUserTodos, updateUserTodos, getUserInfo, updateUserInfo };
