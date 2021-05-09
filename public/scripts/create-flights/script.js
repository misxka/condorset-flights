const inputContainer = document.querySelector('.add-flight .input-fields');

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
    b.addEventListener("click", function(e) {
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
const toInput = inputContainer.querySelector('#to-input');

const homeAirport = 'MSQ Национальный Аэропорт Минск';

fromInput.addEventListener('input', () => {
  const airports = [];
  connectAirportAPI(fromInput, airports);
});

fromInput.addEventListener('focusout', () => {
  if(fromInput.value === '') {
    toInput.value = '';
    toInput.readOnly = false;
  }
  else if(fromInput.value !== homeAirport) {
    toInput.value = homeAirport;
    toInput.readOnly = true;
  }
});

toInput.addEventListener('input', () => {
  const airports = [];
  connectAirportAPI(toInput, airports);
});

toInput.addEventListener('focusout', () => {
  if(toInput.value === '') {
    fromInput.value = '';
    fromInput.readOnly = false;
  }
  else if(toInput.value !== homeAirport) {
    fromInput.value = homeAirport;
    fromInput.readOnly = true;
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