const inputContainer = document.querySelector('.add-flight .input-fields');
const main = document.querySelector('main');

//Airports input
function autocomplete(input, arr) {
  let currentFocus;

  let a, b, i, val = input.value;

  closeAllLists();
  if (!val) { return false;}
  currentFocus = -1;
  a = document.createElement("DIV");
  a.setAttribute("id", "autocomplete-list");
  a.setAttribute("class", "autocomplete-items");

  input.parentNode.appendChild(a);

  for (i = 0; i < arr.length; i++) {
    b = document.createElement("DIV");
    b.innerHTML = arr[i].substr(0, val.length);
    b.innerHTML += arr[i].substr(val.length);
    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
    b.addEventListener("mousedown", function(e) {
        input.value = this.getElementsByTagName("input")[0].value;
        closeAllLists();
    });
    a.appendChild(b);
  }

  input.addEventListener("keydown", function(e) {
      var x = document.getElementById("autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(element) {
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (element != x[i] && element != input) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  main.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

const fromInput = inputContainer.querySelector('#from-input');
const fromMessage = inputContainer.querySelector('.from-input-wrapper .warning-message');

const toInput = inputContainer.querySelector('#to-input');
const toMessage = inputContainer.querySelector('.to-input-wrapper .warning-message');

const homeAirport = 'MSQ ???????????????????????? ???????????????? ??????????';

fromInput.addEventListener('input', () => {
  const airports = [];
  connectAirportAPI(fromInput, airports);
});

fromInput.addEventListener('change', () => {
  airportInputValidator(fromInput, toInput, fromMessage);
});

toInput.addEventListener('input', () => {
  const airports = [];
  connectAirportAPI(toInput, airports);
});

toInput.addEventListener('change', () => {
  airportInputValidator(toInput, fromInput, toMessage);
});

function airportInputValidator(firstInput, secondInput, message) {
  if(firstInput.value === '' || (firstInput.value === homeAirport && firstInput.readOnly === false)) {
    secondInput.value = '';
    secondInput.readOnly = false;
    secondInput.style.backgroundColor = 'var(--input-field-color)';
  } else if(firstInput.value !== homeAirport) {
    secondInput.value = homeAirport;
    secondInput.readOnly = true;
    secondInput.style.backgroundColor = 'var(--input-readonly-color)';
    secondInput.closest('div').querySelector('.warning-message').classList.remove('active');
    secondInput.classList.remove('wrong');
  }
  if(!/^[a-zA-Z]{3}\s[??-??]{1}[??-????-??]{1,}/.test(firstInput.value)) {
    message.classList.add('active');
    firstInput.classList.add('wrong');
    return false;
  } else {
    message.classList.remove('active');
    firstInput.classList.remove('wrong');
    return true;
  }
}

function connectAirportAPI(input, arr) {
  if(input.value !== '') {
    fetch(`http://autocomplete.travelpayouts.com/places2?term=${input.value}&locale=ru&types[]=airport&token=dea89e2f6bc0c6824094311a1d179aa0`, {
      "method": "GET",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      }
    })
    .then(response => {
      response.json().then(function(result) {
        arr = result.map(elem => {
          return `${elem.code} ${elem.name}`;
        });
        if(homeAirport.toLowerCase().includes(input.value.toLowerCase())) arr.unshift(homeAirport);
        autocomplete(input, arr);
      });
    })
    .catch(err => {
      console.error(err);
    });
  }
}

//IATA code validation
const iataInput = inputContainer.querySelector('#airline-input');
const iataMessage = inputContainer.querySelector('.airline-input-wrapper .warning-message');

iataInput.addEventListener('change', () => {
  checkIataAPI(iataInput, iataMessage);
});

function checkIataAPI(input, message) {
  if(input.value !== '') {
    let isTrue;
    input.value = input.value.toUpperCase();
    fetch(`https://iata-and-icao-codes.p.rapidapi.com/airline?iata_code=${input.value}`, {
      "method": "GET",
      "headers": {
        "accept": "application/json",
        "x-rapidapi-key": "084c5a5523msh7586622455669c0p11cc96jsn7750a16fff50",
        "x-rapidapi-host": "iata-and-icao-codes.p.rapidapi.com"
      }
    })
    .then(response => {
      response.text().then(function(text) {
        const result = text ? JSON.parse(text) : {};
        if(_.isEmpty(result)) {
          message.classList.add('active');
          input.classList.add('wrong');
        } else {
          message.classList.remove('active');
          input.classList.remove('wrong');
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
  }
}

function checkIata(input, message) {
  if(!/^[a-zA-Z]{1}[a-zA-Z0-9]{1}$/m.test(input.value)) {
    message.classList.add('active');
    input.classList.add('wrong');
    return false;
  } else {
    message.classList.remove('active');
    input.classList.remove('wrong');
    return true;
  }
}

//Flight number
const flightNumberInput = inputContainer.querySelector('#flight-number-input');
const flightNumberMessage = inputContainer.querySelector('.flight-number-input-wrapper .warning-message');

flightNumberInput.addEventListener('change', () => {
  checkFlightNumber(flightNumberInput, flightNumberMessage);
});

function checkFlightNumber(input, message) {
  if(!/^\d{4}$/.test(input.value)) {
    message.classList.add('active');
    input.classList.add('wrong');
    return false;
  } else {
    message.classList.remove('active');
    input.classList.remove('wrong');
    return true;
  }
}

//Checking date input
const dateInput = document.querySelector('#date-1');
const dateMessage = document.querySelector('.date-warning');

const table = document.querySelector('.table-wrapper #table-1');
const deleteRowButtons = table.querySelectorAll('.delete-row');

const submitButton = document.querySelector('.submit-schedule-button');

let enteredRows = 1;

dateInput.addEventListener('change', () => {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const enteredDate = new Date(dateInput.value).setHours(0, 0, 0, 0);
  if(enteredDate < currentDate) {
    dateMessage.classList.add('active');
    dateInput.classList.add('wrong');
    submitButton.disabled = true;
    return;
  } else {
    dateMessage.classList.remove('active');
    dateInput.classList.remove('wrong');
    submitButton.disabled = false; 
  }

  clearTable(table);

  enteredRows = 1;
});

function clearTable(table) {
  while(table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  }
}


//Delete row button and edit cells
const cover = document.querySelector('.cover');
const popup = document.querySelector('.popup');
const saveButton = popup.querySelector('button');
const editInput = popup.querySelector('input');
const popUpMessage = popup.querySelector('.warning-message');

let currentCell;

table.addEventListener('click', (e) => {
  if(e.target && e.target.className === 'delete-row') {
    table.deleteRow(e.target.closest('tr').rowIndex);
    enteredRows--;
  } else if(e.target && e.target.classList.contains('filled')) {
    currentCell = e.target;
    editInput.value = currentCell.innerHTML;
    popup.classList.remove('hidden');
    cover.classList.remove('hidden');
    document.documentElement.classList.add('notScrollable');
  }
});

cover.addEventListener('click', ()=> {
  closeModal();
  editInput.value = '';
});

saveButton.addEventListener('click', ()=> {
  if(currentCell.classList.contains('from')) {
    popUpMessage.innerHTML = fromMessage.innerHTML;
    if(!airportEditValidator(editInput, currentCell.closest('tr').querySelector('.to'), popUpMessage)) return;
  } else if(currentCell.classList.contains('to')) {
    popUpMessage.innerHTML = toMessage.innerHTML;
    if(!airportEditValidator(editInput, currentCell.closest('tr').querySelector('.from'), popUpMessage)) return;
  } else if(currentCell.classList.contains('iata-code')) {
    popUpMessage.innerHTML = iataMessage.innerHTML;
    if(!checkIata(editInput, popUpMessage)) return;
  } else if(currentCell.classList.contains('flight-number')) {
    popUpMessage.innerHTML = flightNumberMessage.innerHTML;
    if(!checkFlightNumber(editInput, popUpMessage)) return;
  }
  closeModal();
  currentCell.innerHTML = editInput.value.toUpperCase();
  editInput.value = '';
});

function airportEditValidator(first, second, message) {
  if(first.value === homeAirport) {
    second.innerHTML = '';
  } else {
    second.innerHTML = homeAirport;
  }
  if(!/^[a-zA-Z]{3}\s[??-??]{1}[??-????-??]{1,}/.test(first.value)) {
    message.classList.add('active');
    return false;
  } else {
    message.classList.remove('active');
    return true;
  }
}

function closeModal() {
  popup.classList.add('hidden');
  cover.classList.add('hidden');
  document.documentElement.classList.remove('notScrollable');
}

//Add row button
const addRowButton = document.querySelector('.add-button');
const inputs = inputContainer.querySelectorAll('input');
const inputContainerMessage = document.querySelector('.add-flight .input-fields>.warning-message')
const addFlightSection = document.querySelector('.add-flight');

addRowButton.addEventListener('click', () => {
  for(let i = 0; i < inputs.length; i++) {
    if(inputs[i].value === '' || inputs[i].classList.contains('wrong')) {
      addFlightSection.classList.add('wrong');
      inputContainerMessage.innerHTML = '???????????? ???????? ?????????????????? ?????? ????????';
      inputContainerMessage.classList.add('active');
      return;
    } else {
      addFlightSection.classList.remove('wrong');
      inputContainerMessage.classList.remove('active');
    }
  }

  for(let i = 0; i < table.rows.length; i++) {
    let counter = 0;
    for(let j = 0; j < 4; j++) {
      if(table.rows[i].cells[j].innerHTML === inputs[j].value) counter++;
    }
    if(counter === 4) {
      inputContainerMessage.innerHTML = '?????????? ???????????????????? ?????? ???????? ??????????????';
      inputContainerMessage.classList.add('active');
      return;
    }
  }

  if(enteredRows < 5) {
    let i = 0;
    while(table.rows[i].cells[0].innerHTML !== '') i++;
    for(let j = 0; j < 4; j++) {
      table.rows[i].cells[j].innerHTML = inputs[j].value;
      table.rows[i].cells[j].classList.add('filled');
    }
    enteredRows++;
  } else {
    const row = table.insertRow();
    for(let i = 0; i < 5; i++) {
      const cell = row.insertCell(i);
      if(i === 4) {
        cell.innerHTML = '<button class="delete-row"></button>';
      }
    }
    for(let i = 0; i < 4; i++) {
      table.rows[table.rows.length - 1].cells[i].innerHTML = inputs[i].value;
    }
    enteredRows++;
  }

  for(let i = 0; i < 4; i++) {
    inputs[i].value = '';
    inputs[i].readOnly = false;
    inputs[i].style.backgroundColor = 'var(--input-field-color)';
  }
});


//Send data to server
import FlightTemplate from './flight-template.js';

submitButton.addEventListener('click', () => {
  if(dateInput.value === '' || enteredRows < 4) {
    submitButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
    return;
  } else {
    submitButton.closest('.button-wrapper').querySelector('.warning-message').classList.remove('active');
  }
  const flights = [];
  for(let i = 1; i < enteredRows; i++) {
    const row = [];
    for(let j = 0; j < 4; j++) {
      row.push(table.rows[i].cells[j].innerHTML);
    }
    flights.push(new FlightTemplate(dateInput.value, row[0], row[1], row[2], row[3]));
  }
  fetch('http://localhost:3000/fetch-handlers/temp-tables', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(flights)
  })
  .then(response => response.json())
  .then(data => {
    if(data.existed) {
      submitButton.closest('.button-wrapper').querySelector('.warning-message').innerHTML = data.message;
      submitButton.closest('.button-wrapper').querySelector('.warning-message').classList.add('active');
    } else {
      clearTable(table);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


//Stop voting
const stopVotingButton = document.querySelector('.stop-voting-button');
const datesSelect = document.querySelector('#dates-1');
const availableDates = [];

const getAvailableDates = function() {
  datesSelect.innerHTML = null;
  availableDates.length = 0;
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
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

getAvailableDates();

stopVotingButton.addEventListener('click', () => {
  stopVoting();
});

function stopVoting() {
  fetch('http://localhost:3000/fetch-handlers/stop-voting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({"date": datesSelect.value})
  })
  .then(response => response.json())
  .then(data => {
    if(data.status === true) {
      getAvailableDates();
      getEditableDates();
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

//Set departure and arrival time
const finalTable = document.querySelector('#table-2');
const finalDatesSelect = document.querySelector('#dates-2');
const editableDates = [];

const setTimeWarning = document.querySelector('.set-time-section .warning-message');

function fillTable(data) {
  for(let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    const row = finalTable.insertRow(i + 1);
    row.id = `row-${i + 1}`;
    for(let j = 0; j < 6; j++) {
      const cell = row.insertCell(j);
      if(j === 4) {
        cell.innerHTML = '<input class="time-input departure-time" type="time">';
      } else if(j === 5) {
        cell.innerHTML = '<input class="time-input arrival-time" type="time">';
      }
    }
    for(let j = 0; j < 4; j++) {
      finalTable.rows[i + 1].cells[j].innerHTML = values[j];
    }
  }
}

const times = new Map();

function checkMap(map, inputValue, index) {
  for(let i = index - 1; i >= 0; i--) {
    const value = map.get(i);
    if(value !== undefined) {
      if(new Date(`01/01/1970 ${inputValue}`) < new Date(`01/01/1970 ${value}`)) return false;
      else {
        map.set(index, inputValue);
        return true;
      }
    } else if(i === 0) {
      map.set(index, inputValue);
      return true;
    }
  }
}

finalTable.addEventListener('focusout', (e) => {
  if(e.target && e.target.classList.contains('time-input')) {
    const fromCell = e.target.closest('tr').querySelector('td:first-child');
    const toCell = e.target.closest('tr').querySelector('td:nth-child(2)');
    if(e.target.classList.contains('departure-time') && fromCell.innerHTML === homeAirport || e.target.classList.contains('arrival-time') && toCell.innerHTML === homeAirport) {
      if(!checkMap(times, e.target.value, Number(e.target.closest('tr').id.slice(4)))) {
        e.target.value = '';
        setTimeWarning.innerHTML = '?????????? ???????????? ???????? ???????????? ????????????????, ?????????????????? ?? ???????????????????? ?????????????? (????????????/?????????? ???? ????????????)';
        setTimeWarning.classList.add('active');
      } else {
        setTimeWarning.classList.remove('active');
      }
    }
  }
});

const getEditableDates = function() {
  finalDatesSelect.innerHTML = null;
  editableDates.length = 0;
  fetch('http://localhost:3000/fetch-handlers/editable-dates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      editableDates.push(...data);
      for(const date of editableDates) {
        const newOption = new Option(date, date);
        finalDatesSelect.append(newOption);
      }
      return fetch('http://localhost:3000/fetch-handlers/get-pre-final-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"date": finalDatesSelect.value})
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.length > 0)
        fillTable(data);
    })
    .catch((error) => {
      console.error('Error:', error);
  });
}

getEditableDates();

finalDatesSelect.addEventListener('change', () => {
  clearTable(finalTable);
  fetch('http://localhost:3000/fetch-handlers/get-pre-final-schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({date: finalDatesSelect.value}),
  })
  .then(response => response.json())
  .then(data => {
    fillTable(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


//Apply flights
const applyFlightsButton = document.querySelector('.apply-flights-button');

import Flight from './flight.js';

applyFlightsButton.addEventListener('click', () => {
  const finalTableInputs = finalTable.querySelectorAll('input[type="time"]');
  for(let i = 0; i < finalTableInputs.length; i++) {
    if(finalTableInputs[i].value === '') {
      setTimeWarning.innerHTML = '???????????? ???????? ?????????????????? ?????? ???????????? ?? ????????????????';
      setTimeWarning.classList.add('active');
      return;
    } else setTimeWarning.classList.remove('active');
  }

  const flights = [];
  for(let i = 1; i < finalTable.rows.length; i++) {
    const row = [];
    for(let j = 0; j < 6; j++) {
      if(j > 3) {
        row.push(finalTable.rows[i].cells[j].querySelector('INPUT').value);
      } else row.push(finalTable.rows[i].cells[j].innerHTML);
    }
    flights.push(new Flight(finalDatesSelect.value, row[0], row[1], row[2], row[3], row[4], row[5]));
  }
  fetch('http://localhost:3000/fetch-handlers/add-final-schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(flights)
  })
  .then(response => response.json())
  .then(data => {
    if(data.completed) console.log("???????????????????? ?????????????? ?? ???????????????? ???????????????????? ?????????????? ??????????????????!");
    getEditableDates();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});