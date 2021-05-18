const forms = document.querySelectorAll('form');
const changeButtons = document.querySelectorAll('.change-wrapper a');

changeButtons.forEach(button => {
  button.addEventListener('click', () => {
    for(const elem of forms) {
      elem.classList.toggle('active-form');
    }
  });
});

const signInButton = document.querySelector('.sign-in-button');
const signUpButton = document.querySelector('.sign-up-button');

const signInForm = document.querySelector('.login-form');
const signUpForm = document.querySelector('.register-form');

const signInWarning = document.querySelector('.sign-in-warning');
const signUpWarning = document.querySelector('.sign-up-warning');

const signInWarnings = document.querySelectorAll('.login-form .warning-message');
const signUpWarnings = document.querySelectorAll('.register-form .warning-message');

signInButton.addEventListener('click', () => {
  const data = {};
  
  let counter = 0;

  const username = signInForm.querySelector('.username').value;
  const password = signInForm.querySelector('.password').value;

  signInWarnings.forEach(elem => elem.classList.remove('active'));

  if(!username || !password) {
    signInWarning.innerHTML = 'Должны быть заполнены все поля!';
    signInWarning.classList.add('active');
    return;
  } else {
    signInWarning.classList.remove('active');
  }

  if(!/^([a-zA-Z0-9_\-]+){6,}$/.test(username)) {
    signInForm.querySelector('.username-message').classList.add('active');
    counter++;
  } else {
    signInForm.querySelector('.username-message').classList.remove('active');
  }

  if(!/^([a-zA-Z0-9]+){8,}$/.test(password)) {
    signInForm.querySelector('.password-message').classList.add('active');
    counter++;
  } else {
    signInForm.querySelector('.password-message').classList.remove('active');
  }

  if(counter > 0) return;
  
  data.username = username;
  data.password = password;
  fetch("http://localhost:3000/authenticate/sign-in", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if(!result.exists) {
      signInWarning.innerHTML = 'Такого пользователя не существует!';
      signInWarning.classList.add('active');
    }
    else if(!result.correctPassword) {
      signInWarning.innerHTML = 'Неверный пароль!';
      signInWarning.classList.add('active');
    } else {
      signInWarning.classList.remove('active');
      window.location.href = '/pages/reports';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

signUpButton.addEventListener('click', () => {
  const data = {};

  let counter = 0;

  const username = signUpForm.querySelector('.username').value;
  const password = signUpForm.querySelector('.password').value;
  const email = signUpForm.querySelector('.email').value;

  signUpWarnings.forEach(elem => elem.classList.remove('active'));

  if(!username || !password || !email) {
    signUpWarning.innerHTML = 'Должны быть заполнены все поля!';
    signUpWarning.classList.add('active');
    return;
  } else {
    signUpWarning.classList.remove('active');
  }

  if(!/^([a-zA-Z0-9_\-]+){6,}$/.test(username)) {
    signUpForm.querySelector('.username-message').classList.add('active');
    counter++;
  } else {
    signUpForm.querySelector('.username-message').classList.remove('active');
  }

  if(!/^([a-zA-Z0-9]+){8,}$/.test(password)) {
    signUpForm.querySelector('.password-message').classList.add('active');
    counter++;
  } else {
    signUpForm.querySelector('.password-message').classList.remove('active');
  }

  if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,4})$/.test(email)) {
    signUpForm.querySelector('.email-message').classList.add('active');
    counter++;
  } else {
    signUpForm.querySelector('.email-message').classList.remove('active');
  }

  if(counter > 0) return;

  data.username = username;
  data.password = password;
  data.email = email;
  fetch("http://localhost:3000/authenticate/sign-up", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if(!result.successful) {
      signUpWarning.innerHTML = 'Пользователь с таким именем или эл. почтой уже существует!';
      signUpWarning.classList.add('active');
    } else {
      signUpWarning.classList.remove('active');
      window.location.href = '/pages/reports';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});