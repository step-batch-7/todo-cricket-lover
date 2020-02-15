const sendXHR = function(method, url, message, onloadHandler) {
  const request = new XMLHttpRequest();
  request.onerror = function() {
    document.body.innerHTML = '<h1>Error while processing please reload</h1>';
  };

  request.onload = function() {
    onloadHandler(this);
  };

  request.open(method, url);

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(message);
};

const signUserUp = function() {
  const userName = document.querySelector('.username.sign-up').value;
  const password = document.querySelector('.password.sign-up').value;
  document.querySelector('.username.sign-up').value = '';
  document.querySelector('.password.sign-up').value = '';

  if (!userName || !password) {
    document.querySelector('.popup').innerText = 'Fields can not be left empty';
    return;
  }

  const onloadHandler = res => {
    document.querySelector('.popup').innerText = res.responseText;
  };

  sendXHR(
    'POST',
    '/signUserUp',
    `userName=${userName}&password=${password}`,
    onloadHandler
  );
};

const userLogin = function() {
  const userName = document.querySelector('.username.login').value;
  const password = document.querySelector('.password.login').value;
  document.querySelector('.username.login').value = '';
  document.querySelector('.password.login').value = '';

  const onloadHandler = res => {
    document.querySelector('.popup').innerText = res.responseText;
  };

  sendXHR(
    'POST',
    '/userLogin',
    `userName=${userName}&password=${password}`,
    onloadHandler
  );
};
