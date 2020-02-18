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

const showPopup = function(text, category) {
  document.querySelector('.popup-text').innerText = text;
  document.querySelector('.popup').classList.remove('affirm', 'warn');
  document.querySelector('.popup').classList.add(category, 'unhide');
};

const closePopup = function() {
  document.querySelector('.popup').classList.remove('unhide', 'affirm', 'warn');
};

const signUserUp = function() {
  const userName = document.querySelector('.username.sign-up').value;
  const password = document.querySelector('.password.sign-up').value;
  document.querySelector('.username.sign-up').value = '';
  document.querySelector('.password.sign-up').value = '';

  if (!userName || !password) {
    showPopup('Fields can not be left empty', 'warn');
    return;
  }

  const onloadHandler = res => {
    const responseText = res.responseText;
    let category = 'warn';
    if (res.status === 200) {
      category = 'affirm';
    }
    showPopup(responseText, category);
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
    if (res.status === 200) {
      document.location.href = res.getResponseHeader('location');
      return;
    }
    showPopup(res.responseText, 'warn');
  };

  sendXHR(
    'POST',
    '/userLogin',
    `userName=${userName}&password=${password}`,
    onloadHandler
  );
};
