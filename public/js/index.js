const generateItemAdder = function(todo) {
  const { title, id } = todo;
  const itemAdder = `
	<div class="task-header">
	<h2>${title}</h2>
	<button onclick="deleteTask()">delete</button>
	</div>
	<hr>
	<input type="text" name="add item" class="addItem"
	placeholder="Enter your item here">
	<input type="submit" value="add item" onclick="createNewItem()" />
	`;
  return itemAdder;
};

const generateItem = function(html, task) {
  const previousHtml = html;
  const { item, id } = task;
  const newHtml = `
	<div class="item" id="${id}">
	<input type="checkbox" name="checkbox" class="checkbox">
	<p>${item}</p>
	<button onclick="deleteItem()">delete</button>
	</div>
	`;
  return previousHtml + newHtml;
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

const deleteTask = function() {
  const [, , todo] = event.path;
  sendXHR('POST', 'deleteTask', `todoId=${todo.id}`, showTodoList);
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

const createNewTask = function() {
  const input = event.target.previousElementSibling;
  sendXHR('POST', 'createNewTask', `title=${input.value}`, showTodoList);
  input.value = '';
};

const createNewItem = function() {
  const input = event.target.previousElementSibling;
  const [, todo] = event.path;
  sendXHR(
    'POST',
    'createNewItem',
    `item=${input.value}&todoId=${todo.id}`,
    showTodoList
  );
  input.value = '';
};

const createTodo = function(todo) {
  const { items, id } = todo;
  const itemAdder = generateItemAdder(todo);
  const generatedItems = items.reduce(generateItem, '');
  const todoContainer = `<div class="todo" id="${id}">${itemAdder +
    generatedItems}</div>`;
  return todoContainer;
};

const showTodoList = function(tasks) {
  const todoListContainer = document.querySelector('#todo-list-container');
  const html = tasks.map(createTodo);
  todoListContainer.innerHTML = html.join('');
};

const load = function() {
  sendXHR('GET', 'todoList', '', showTodoList);
};

window.onload = load;
