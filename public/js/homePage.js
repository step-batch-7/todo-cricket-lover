const generateItemTemplate = function(todoId, html, item) {
  const previousHtml = html;
  const { task, taskId, isDone } = item;
  const checkStat = isDone ? 'checked' : '';
  const newHtml = `
	<div class="item" id="task-${todoId}_${taskId}">
	<p><input type="checkbox" name="checkbox"
	class="checkbox" onclick="changeItemStatus(${todoId}, ${taskId})" 
	${checkStat}>
	<span onfocusout="modifyItem(${todoId}, ${taskId})">${task}</span>
	</p><div><img src="./images/edit.svg" alt="edit" 
	onclick="editItem(${todoId}, ${taskId})">
	<img src="./images/remove.svg" alt="delete" 
	onclick="deleteItem(${todoId}, ${taskId})"></div>
	</div>
	`;
  return previousHtml + newHtml;
};

const generateTodoHeader = function(title, todoId) {
  const todoHeader = `
	<div class="todo-header">
	<h2 onfocusout="renameTitle(${todoId})">${title}</h2>
	<span>
	<img src="./images/edit.svg" alt="edit" class="edit-img" 
	onclick="editTitle(${todoId})">
	<img src="./images/remove.svg" alt="remove" class="remove-img"
	onclick="deleteTodo(${todoId})">
	</span>
	</div>
	<hr>
	<div class="item-adder">
	<input type="text" name="add item" class="addItem"
	placeholder="Enter your item here">
	<img src="./images/plus.svg" alt="add" class="add-icon" 
	onclick="createNewItem(${todoId})">
	</div>
	`;
  return todoHeader;
};

const generateTodo = function(todo) {
  const { title, items, todoId } = todo;
  const todoHeader = generateTodoHeader(title, todoId);
  const itemContainer = items.reduce(
    generateItemTemplate.bind(null, todoId),
    ''
  );
  const todoContainer = `<div class="todo" id="todo-${todoId}">
	<div>${todoHeader}</div>
	<div class="item-container">${itemContainer}</div></div>`;
  return todoContainer;
};

const showTodoList = function(todoList) {
  const todoListContainer = document.querySelector('.todo-list-container');
  const todo = todoList.map(generateTodo);
  todoListContainer.innerHTML = todo.join('\n');
};

const sendXHR = function(method, url, message, onloadHandler = showTodoList) {
  const request = new XMLHttpRequest();
  request.onerror = function() {
    document.body.innerHTML =
      '<h1>Error while processing please come back after sometime</h1>';
  };

  request.onload = function() {
    const todoList = this.responseText && JSON.parse(this.responseText);
    onloadHandler(todoList);
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

const deleteTodo = function(todoId) {
  sendXHR('DELETE', 'deleteTodo', `todoId=${todoId}`);
};

const createNewItem = function(todoId) {
  const input = event.target.previousElementSibling;
  const message = `task=${input.value}&todoId=${todoId}`;
  input.value && sendXHR('POST', 'createNewItem', message);
  input.value = '';
};

const deleteItem = function(todoId, taskId) {
  sendXHR('DELETE', 'deleteItem', `taskId=${taskId}&todoId=${todoId}`);
};

const changeItemStatus = function(todoId, taskId) {
  const message = `taskId=${taskId}&todoId=${todoId}`;
  sendXHR('POST', 'changeItemStatus', message);
};

const editTitle = function(todoId) {
  const title = document.querySelector(`#todo-${todoId} .todo-header h2`);
  title.setAttribute('contenteditable', true);
  title.focus();
};

const renameTitle = function(todoId) {
  const newTitle = document.querySelector(`#todo-${todoId} .todo-header h2`)
    .innerText;

  const message = `todoId=${todoId}&newTitle=${newTitle}`;
  sendXHR('PATCH', 'renameTitle', message);
};

const editItem = function(todoId, taskId) {
  const title = document.querySelector(`#task-${todoId}_${taskId} p span`);
  title.setAttribute('contenteditable', true);
  title.focus();
};

const modifyItem = function(todoId, taskId) {
  const newTask = document.querySelector(`#task-${todoId}_${taskId} p span`)
    .innerText;
  const message = `todoId=${todoId}&taskId=${taskId}&newTask=${newTask}`;
  sendXHR('PATCH', 'modifyItem', message);
};

const searchByTitle = function(calledOn, todoList) {
  const matcher = new RegExp(calledOn.value, 'i');
  const matchedList = todoList.filter(todo => todo.title.match(matcher));
  showTodoList(matchedList);
};

const searchByTask = function(calledOn, todoList) {
  if (calledOn.value === '') {
    showTodoList(todoList);
    return;
  }
  const matcher = new RegExp(calledOn.value, 'i');
  const matchedList = todoList.filter(todo =>
    todo.items.some(item => item.task.match(matcher))
  );
  showTodoList(matchedList);
};

const attachSearchFunction = function(calledOn) {
  const className = calledOn.getAttribute('class');
  const searchFunctionLookup = {
    'title-search': searchByTitle,
    'task-search': searchByTask
  };
  const handler = searchFunctionLookup[className];

  const attachHandlerToSearchSection = todoList => {
    const handlerBoundWithData = handler.bind(null, calledOn, todoList);
    document
      .querySelector(`.${className}`)
      .addEventListener('input', handlerBoundWithData);
  };

  sendXHR('GET', '/todoList', '', attachHandlerToSearchSection);
};

const logout = function() {
  const goToLoginPage = () => {
    document.location.href = '/';
  };
  sendXHR('GET', '/logout', '', goToLoginPage);
};

const load = function() {
  sendXHR('GET', '/todoList', '');
};

window.onload = load;
