const generateItemAdder = function(todo) {
  const { title } = todo;
  const itemAdder = `
	<div class="task-header">
	<h2>${title}</h2>
	<button onclick="deleteTodo()">delete</button>
	</div>
	<hr>
	<input type="text" name="add item" class="addItem"
	placeholder="Enter your item here">
	<input type="submit" value="Add Item" onclick="createNewItem()" />
	`;
  return itemAdder;
};

const generateItem = function(html, task) {
  const previousHtml = html;
  const { item, id, isDone } = task;
  const newHtml = `
	<div class="item" id="${id}">
	<input type="checkbox" name="checkbox"
	 class="checkbox" onclick="changeStatus()" ${isDone ? 'checked' : ''}>
	<p>${item}</p>
	<button onclick="deleteItem()">delete</button>
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
  const [, , todo] = event.path;
  sendXHR('POST', 'deleteTodo', `todoId=${todo.id}`, showTodoList);
};

const createNewItem = function() {
  const input = event.target.previousElementSibling;
  const [, todo] = event.path;
  const message = `item=${input.value}&todoId=${todo.id}`;
  input.value && sendXHR('POST', 'createNewItem', message, showTodoList);
  input.value = '';
};

const deleteItem = function() {
  const [, item, todo] = event.path;
  sendXHR(
    'POST',
    'deleteItem',
    `taskId=${item.id}&todoId=${todo.id}`,
    showTodoList
  );
};

const changeStatus = function() {
  const [, item, todo] = event.path;
  const message = `taskId=${item.id}&todoId=${todo.id}`;
  sendXHR('POST', changeStatus, message, showTodoList);
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
