const generateItemAdder = function(todo) {
  const { title } = todo;
  const itemAdder = `
	<div class="task-header">
	<h2 onfocusout="renameTitle()">${title}</h2>
	<span><img src="./svg/edit.svg" alt="edit" width="30px" onclick="editTitle()">
	<img src="./svg/remove.svg" alt="delete" width="30px" onclick="deleteTodo()"></span>
	</div>
	<hr>
	<div class="itemAdder">
	<input type="text" name="add item" class="addItem"
	placeholder="Enter your item here">
	<img src="./svg/plus.svg" alt="add" width="20px" onclick="createNewItem()" style="border: 1px solid lightgray;">
	</div>
	`;
  return itemAdder;
};

const generateItem = function(html, task) {
  const previousHtml = html;
  const { item, id, isDone } = task;
  const newHtml = `
	<div class="item" id="${id}">
	<p><input type="checkbox" name="checkbox"
	 class="checkbox" onclick="changeStatus()" ${isDone ? 'checked' : ''}>
	<span onfocusout="modifyItem()">${item}</span>
	</p><div><img src="./svg/edit.svg" alt="edit" width="18px" onclick="editItem()">
	<img src="./svg/remove.svg" alt="delete" width="18px" onclick="deleteItem()"></div>
	</div>
	`;
  return previousHtml + newHtml;
};

const generateTodo = function(todo) {
  const { items, id } = todo;
  const itemAdder = generateItemAdder(todo);
  const generatedItems = items.reduce(generateItem, '');
  const todoContainer = `<div class="todo" id="${id}">${itemAdder +
    generatedItems}</div>`;
  return todoContainer;
};

const sendXHR = function(method, url, message, callback) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    callback(JSON.parse(this.responseText));
  };
  request.open(method, url);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(message);
};

const createNewTodo = function() {
  const input = event.target.previousElementSibling;
  const message = `title=${input.value}`;
  input.value && sendXHR('POST', 'createNewTodo', message, showTodoList);
  input.value = '';
};

const deleteTodo = function() {
  const [, , , todo] = event.path;
  sendXHR('POST', 'deleteTodo', `todoId=${todo.id}`, showTodoList);
};

const createNewItem = function() {
  const input = event.target.previousElementSibling;
  const [, , todo] = event.path;
  const message = `item=${input.value}&todoId=${todo.id}`;
  input.value && sendXHR('POST', 'createNewItem', message, showTodoList);
  input.value = '';
};

const deleteItem = function() {
  const [, , item, todo] = event.path;
  sendXHR(
    'POST',
    'deleteItem',
    `taskId=${item.id}&todoId=${todo.id}`,
    showTodoList
  );
};

const changeItemStatus = function() {
  const [, , item, todo] = event.path;
  const message = `taskId=${item.id}&todoId=${todo.id}`;
  sendXHR('POST', changeItemStatus, message, showTodoList);
};

const editTitle = function() {
  const [, , taskAdder] = event.path;
  const title = taskAdder.querySelector('h2');
  title.setAttribute('contenteditable', true);
  title.focus();
};

const renameTitle = function() {
  const [, taskAdder, todo] = event.path;
  const newTitle = taskAdder.querySelector('h2').innerText;
  const message = `todoId=${todo.id}&newTitle=${newTitle}`;
  sendXHR('POST', renameTitle, message, showTodoList);
};

const editItem = function() {
  const [, , taskAdder] = event.path;
  const title = taskAdder.querySelector('span');
  title.setAttribute('contenteditable', true);
  title.focus();
};

const modifyItem = function() {
  const [span, , task, todo] = event.path;
  const newItem = span.innerText;

  const message = `todoId=${todo.id}&taskId=${task.id}&newItem=${newItem}`;
  console.log(message);
  sendXHR('POST', modifyItem, message, showTodoList);
};

const showTodoList = function(todoList) {
  const todoListContainer = document.querySelector('#todo-list-container');
  const todo = todoList.map(generateTodo);
  todoListContainer.innerHTML = todo.join('');
};

const load = function() {
  sendXHR('GET', 'todoList', '', showTodoList);
};

window.onload = load;
