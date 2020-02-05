const toHtml = function(tasks) {
  const { items, title } = tasks[tasks.length - 1];
  const taskContainer = document.getElementById('task-container');
  let htmlItems = '';

  items.forEach(item => {
    htmlItems = htmlItems + `<p>${item.item}</p>`;
  });

  const html = `
	${taskContainer.innerHTML}
<div class="task">
<h3>${title}</h3>
<hr>
${htmlItems}
</div>`;

  taskContainer.innerHTML = html;
};

const main = function() {
  const input = Array.from(document.getElementsByTagName('input'));

  const body = input.map(element => {
    const key = element.getAttribute('name');
    const value = element.value;
    return `${key}=${value}`;
  });
  body.pop();

  const pattern = new RegExp(' ', 'g');

  const request = new XMLHttpRequest();
  request.onload = function() {
    toHtml(JSON.parse(this.responseText));
  };
  request.open('POST', 'createNewTask');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(body.join('&').replace(pattern, '+'));
};
