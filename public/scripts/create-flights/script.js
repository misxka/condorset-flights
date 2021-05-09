const inputContainer = document.querySelector('.add-flight .input-fields');

//Airports input
function autocomplete(input, arr) {
  let currentFocus;

  let a, b, i, val = input.value;

  closeAllLists();
  if (!val) { return false;}
  currentFocus = -1;
  a = document.createElement("DIV");
  a.setAttribute("id", this.id + "__autocomplete-list");
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
      var x = document.getElementById(this.id + "autocomplete-list");
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
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != input) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

const fromInput = inputContainer.querySelector('#from-input');
const fromMessage = inputContainer.querySelector('.from-input-wrapper .warning-message');

const toInput = inputContainer.querySelector('#to-input');
const toMessage = inputContainer.querySelector('.to-input-wrapper .warning-message');

const homeAirport = 'MSQ Национальный Аэропорт Минск';

fromInput.addEventListener('input', () => {
  const airports = [];
  connectAirportAPI(fromInput, airports);
});

fromInput.addEventListener('focusout', () => {
  if(fromInput.value === '' || (fromInput.value === homeAirport && fromInput.readOnly === false)) {
    toInput.value = '';
    toInput.readOnly = false;
    toInput.style.backgroundColor = 'var(--input-field-color)';
  } else if(fromInput.value !== homeAirport) {
    toInput.value = homeAirport;
    toInput.readOnly = true;
    toInput.style.backgroundColor = 'var(--input-readonly-color)';
  }
  if(!/^[a-zA-Z]{3}\s[А-Я]{1}[а-яА-Я]{1,}/.test(fromInput.value)) {
    fromMessage.classList.add('active');
    fromInput.classList.add('wrong');
  } else {
    fromMessage.classList.remove('active');
    fromInput.classList.remove('wrong');
  }
});

toInput.addEventListener('input', () => {
  const airports = [];
  connectAirportAPI(toInput, airports);
});

toInput.addEventListener('focusout', () => {
  if(toInput.value === '' || (toInput.value === homeAirport && toInput.readOnly === false)) {
    fromInput.value = '';
    fromInput.readOnly = false;
    fromInput.style.backgroundColor = 'var(--input-field-color)';
  } else if(toInput.value !== homeAirport) {
    fromInput.value = homeAirport;
    fromInput.readOnly = true;
    fromInput.style.backgroundColor = 'var(--input-readonly-color)';
  }
  if(!/^[a-zA-Z]{3}\s[А-Я]{1}[а-яА-Я]{1,}/.test(toInput.value)) {
    toMessage.classList.add('active');
    toInput.classList.add('wrong');
  } else {
    toMessage.classList.remove('active');
    toInput.classList.remove('wrong');
  }
});

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

iataInput.addEventListener('focusout', () => {
  if(iataInput.value !== '') {
    iataInput.value = iataInput.value.toUpperCase();
    fetch(`https://iata-and-icao-codes.p.rapidapi.com/airline?iata_code=${iataInput.value}`, {
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
          iataMessage.classList.add('active');
          iataInput.classList.add('wrong');
        } else {
          iataMessage.classList.remove('active');
          iataInput.classList.remove('wrong');
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
  }
});

//Flight number
const flightNumberInput = inputContainer.querySelector('#flight-number-input');
const flightNumberMessage = inputContainer.querySelector('.flight-number-input-wrapper .warning-message');

flightNumberInput.addEventListener('focusout', () => {
  if(!/^\d{4}$/.test(flightNumberInput.value)) {
    flightNumberMessage.classList.add('active');
    flightNumberInput.classList.add('wrong');
  } else {
    flightNumberMessage.classList.remove('active');
    flightNumberInput.classList.remove('wrong');
  }
});
