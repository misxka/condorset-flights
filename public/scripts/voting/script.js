'use strict'

let voteInputs = document.querySelectorAll('.vote-input');

const enteredVotes = new Set();

let enteredRows = 1;

const datesSelect = document.querySelector('#dates');
const availableDates = [];

//Get available dates from server
fetch('http://localhost:3000/fetch-handlers/available-dates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    availableDates.push(...data);
    for(const date of availableDates) {
      const newOption = new Option(date, date);
      datesSelect.append(newOption);
    }
    return fetch('http://localhost:3000/fetch-handlers/get-temp-flights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"date": datesSelect.value})
    })
  })
  .then(response => response.json())
  .then(data => {
    fillTable(data);
  })
  .catch((error) => {
    console.error('Error:', error);
});


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

document.addEventListener('keydown', (e) => {
  if(e.target && e.target.className === 'vote-input') {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        e.preventDefault();
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

let flightsInfo;

sendButton.addEventListener('click', () => {
  votes.length = 0;
  voteInputs = document.querySelectorAll('.vote-input');
  if(voteInputs[0].closest('tr').querySelector('td:first-child').innerHTML !== '') {
    for(let i = 1; i <= voteInputs.length; i++) {
      if(voteInputs[i - 1].value === '') {
        sendButton.closest('.button-wrapper').querySelector('.warning-message').innerHTML = 'Оценки должны быть проставлены в каждом ряду';
        sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
        return;
      } else {
        sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.remove('active');
        votes.push({
          id: flightsInfo[i - 1].id,
          date: datesSelect.value,
          rate: voteInputs[i - 1].value
        });
      }
    }
    sendVotes();
  } else {
    sendButton.closest('.button-wrapper').querySelector('.warning-message').innerHTML = 'Таблица пустая';
    sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
    return;
  }
});

function sendVotes() {
  fetch('http://localhost:3000/fetch-handlers/voted-users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({date: datesSelect.value}),
  })
  .then(response => response.json())
  .then(result => {
    if(result.hasVoted) {
      sendButton.closest('.button-wrapper').querySelector('.warning-message').innerHTML = 'Вы уже голосовали! Повторное голосование невозможно.';
      sendButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
      return;
    }
    return fetch('http://localhost:3000/fetch-handlers/add-votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(votes),
    })
  })
  .then(response => response.json())
  .then(result => {
    
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function fillTable(data) {
  flightsInfo = data;
  let lastRow = 0;
  for(let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    const row = table.insertRow(i + 1);
    for(let i = 0; i < 5; i++) {
      const cell = row.insertCell(i);
      if(i === 4) {
        cell.innerHTML = '<input class="vote-input" type="number" min="1" max="1000"><div class="warning-message">Оценки должны быть различными</div>';
      }
    }
    voteInputs = document.querySelectorAll('.vote-input');
    for(let j = 0; j < 4; j++) {
      table.rows[i + 1].cells[j].innerHTML = values[j + 1];
    }
    enteredRows++;
  }
}


datesSelect.addEventListener('change', () => {
  clearTable();
  enteredRows = 1;

  fetch('http://localhost:3000/fetch-handlers/get-temp-flights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({date: datesSelect.value}),
  })
  .then(response => response.json())
  .then(data => {
    fillTable(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

function clearTable() {
  while(table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  }

  voteInputs = document.querySelectorAll('.vote-input');
  enteredVotes.clear();
}