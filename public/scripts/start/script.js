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

signInButton.addEventListener('click', () => {
  const data = {};
  data.username = signInForm.querySelector('.username').value;
  data.password = signInForm.querySelector('.password').value;
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