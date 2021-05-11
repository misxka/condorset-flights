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
  if(voteInputs[0].closest('tr').querySelector('td:first-child').innerHTML !== '') {
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
    return;
  }
});

function fillTable(data) {
  for(let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    if(i > 3) {
      const row = table.insertRow(i + 1);
      for(let i = 0; i < 5; i++) {
        const cell = row.insertCell(i);
        if(i === 4) {
          cell.innerHTML = '<input class="vote-input" type="number" min="1" max="1000"><div class="warning-message">Оценки должны быть различными</div>';
        }
      }
    }
    for(let j = 0; j < 4; j++) {
      table.rows[i + 1].cells[j].innerHTML = values[i];
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
    },
    body: JSON.stringify(dateInput.value),
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
  while(table.rows.length > 5) {
    table.deleteRow(table.rows.length - 1);
  }

  for(let i = 1; i < 5; i++) {
    for(let j = 0; j < 4; j++) {
      table.rows[i].cells[j].innerHTML = '';
    }
  }
}