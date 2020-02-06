const toHtml = function(task) {
  const { items, title, id } = task;
  const htmlItems = items.map(item => `<li class="items">${item.item}</li>`);

  const html = `
<div class="task" id="${id}">
<button onclick="deleteTask(${id})">delete</button>
<h2>${title}</h2>
<hr>
${htmlItems.join('')}
</div>`;
  return html;
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

const deleteTask = function(id) {
  sendXHR('POST', 'deleteTask', id, showTodoList);
};

const createNewTask = function() {
  const input = event.target.previousElementSibling;
  sendXHR('POST', 'createNewTask', `title=${input.value}`, showTodoList);
  input.value = '';
};

const showTodoList = function(tasks) {
  const taskContainer = document.querySelector('#task-container');
  const html = tasks.map(toHtml);
  taskContainer.innerHTML = html.join('');
};

const load = function() {
  sendXHR('GET', '/todoList', '', showTodoList);
};

window.onload = load;
