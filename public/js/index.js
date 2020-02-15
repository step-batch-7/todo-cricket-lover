const signUserUp = function() {
  const userName = document.querySelector('.username.sign-up').value;
  const password = document.querySelector('.password.sign-up').value;

  const signUpReq = new XMLHttpRequest();

  signUpReq.onerror = function() {
    document.body.innerHTML = '<h1>Error while processing please reload</h1>';
  };

  signUpReq.onload = function() {
    document.querySelector('.popup').innerText = this.responseText;
  };

  signUpReq.open('POST', '/signUserUp');

  signUpReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  signUpReq.send(`userName=${userName}&password=${password}`);
};
