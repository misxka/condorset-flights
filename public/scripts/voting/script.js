let voteInputs = document.querySelectorAll('.vote-input');

const enteredVotes = new Set();

document.addEventListener('focusout', (e) => {
  if(e.target && e.target.className === 'vote-input') {
    if(enteredVotes.has(e.target.value)) {
      e.target.closest('td').querySelector('.warning-message').classList.add('active');
    } else {
      e.target.closest('td').querySelector('.warning-message').classList.remove('active');
      enteredVotes.add(e.target.value);
    }
  }
});

const table = document.querySelector('table');

table.addEventListener('mousedown', (e) => {
  if(e.target && e.target.className === 'vote-input') {
    enteredVotes.delete(e.target.value);
  }
});

const sendButton = document.querySelector('.send-rates-button');

const votes = [];

sendButton.addEventListener('click', () => {
  votes.length = 0;
  voteInputs = document.querySelectorAll('.vote-input');
  if(voteInputs.length > 0) {
    for(let i = 1; i <= voteInputs.length; i++) {
      if(voteInputs[i - 1].value === '') {
        sendButton.closest('.button-wrapper').querySelector('.warning-message').innerHTML = 'Оценки должны быть проставлены в каждом ряду';
        sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
        return;
      } else {
        sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.remove('active');
        votes.push(voteInputs[i - 1].value);
      }
    }
  } else {
    sendButton.closest('.button-wrapper').querySelector('.warning-message').innerHTML = 'Таблица пустая';
    sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
  }
  fetch('http://localhost:3000/fetch-handlers/votes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(votes),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});