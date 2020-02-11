const generateTodoHeader = function(title) {
  const todoHeader = `
	<div class="todo-header">
	<h2 onfocusout="renameTitle()">${title}</h2>
	<span>
	<img src="./svg/edit.svg" alt="edit" class="edit-img" onclick="editTitle()">
	<img src="./svg/remove.svg" alt="remove" class="remove-img" 
	onclick="deleteTodo()">
	</span>
	</div>
	<hr>
	<div class="item-adder">
	<input type="text" name="add item" class="addItem"
	placeholder="Enter your item here">
	<img src="./svg/plus.svg" alt="add" class="add-icon" 
	onclick="createNewItem()">
	</div>
	`;
  return todoHeader;
};

const generateItemTemplate = function(html, task) {
  const previousHtml = html;
  const { item, id, isDone } = task;
  const newHtml = `
	<div class="item" id="${id}">
	<p><input type="checkbox" name="checkbox"
	 class="checkbox" onclick="changeItemStatus()" ${isDone ? 'checked' : ''}>
	<span onfocusout="modifyItem()">${item}</span>
	</p><div><img src="./svg/edit.svg" alt="edit" onclick="editItem()">
	<img src="./svg/remove.svg" alt="delete" onclick="deleteItem()"></div>
	</div>
	`;
  return previousHtml + newHtml;
};

const generateTodo = function(todo) {
  const { title, items, id } = todo;
  const todoHeader = generateTodoHeader(title);
  const itemContainer = items.reduce(generateItemTemplate, '');
  const todoContainer = `<div class="todo" id="${id}">
	<div>${todoHeader}</div>
	<div class="item-container">${itemContainer}</div></div>`;
  return todoContainer;
};

let TODO_LIST = [];

const showTodoList = function(todoList = TODO_LIST) {
  const todoListContainer = document.querySelector('.todo-list-container');
  const todo = todoList.map(generateTodo);
  todoListContainer.innerHTML = todo.join('\n');
};

const sendXHR = function(method, url, message) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    TODO_LIST = JSON.parse(this.responseText);
    showTodoList();
  };
  request.open(method, url);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(message);
};

const createNewTodo = function() {
  const input = event.target.previousElementSibling;
  const message = `title=${input.value}`;
  input.value && sendXHR('POST', 'createNewTodo', message);
  input.value = '';
};

const deleteTodo = function() {
  const [, , , , todo] = event.path;
  sendXHR('POST', 'deleteTodo', `todoId=${todo.id}`);
};

const createNewItem = function() {
  const input = event.target.previousElementSibling;
  const [, , , todo] = event.path;
  const message = `item=${input.value}&todoId=${todo.id}`;
  input.value && sendXHR('POST', 'createNewItem', message);
  input.value = '';
};

const deleteItem = function() {
  const [, , item, , todo] = event.path;
  sendXHR('POST', 'deleteItem', `taskId=${item.id}&todoId=${todo.id}`);
};

const changeItemStatus = function() {
  const [, , item, , todo] = event.path;
  const message = `taskId=${item.id}&todoId=${todo.id}`;
  sendXHR('POST', changeItemStatus, message);
};

const editTitle = function() {
  const [, , taskAdder] = event.path;
  const title = taskAdder.querySelector('h2');
  title.setAttribute('contenteditable', true);
  title.focus();
};

const renameTitle = function() {
  const [, taskAdder, , todo] = event.path;
  const newTitle = taskAdder.querySelector('h2').innerText;
  const message = `todoId=${todo.id}&newTitle=${newTitle}`;
  sendXHR('POST', renameTitle, message);
};

const editItem = function() {
  const [, , taskAdder] = event.path;
  const title = taskAdder.querySelector('span');
  title.setAttribute('contenteditable', true);
  title.focus();
};

const modifyItem = function() {
  const [span, , task, , todo] = event.path;
  const newItem = span.innerText;
  const message = `todoId=${todo.id}&taskId=${task.id}&newItem=${newItem}`;
  sendXHR('POST', modifyItem, message);
};

const searchByTitle = function(calledOn) {
  const matcher = new RegExp(calledOn.value, 'i');
  const matchedList = TODO_LIST.filter(todo => todo.title.match(matcher));
  showTodoList(matchedList);
};

const searchByTask = function(calledOn) {
  if (calledOn.value === '') {
    showTodoList();
    return;
  }
  const matcher = new RegExp(calledOn.value, 'i');
  const matchedList = TODO_LIST.filter(todo =>
    todo.items.some(item => item.item.match(matcher))
  );
  showTodoList(matchedList);
};

const load = function() {
  sendXHR('GET', 'todoList', '');
};

window.onload = load;
