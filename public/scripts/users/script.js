const table = document.querySelector('#table');

fetch('http://localhost:3000/fetch-handlers/get-users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => {
  fillTable(data);
})
.catch((error) => {
  console.error('Error:', error);
});

function fillTable(data) {
  for(let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    const row = table.insertRow(i + 1);
    row.id = `row-${i + 1}`;
    for(let j = 0; j < 3; j++) {
      const cell = row.insertCell(j);
      if(j === 2) {
        cell.innerHTML = '<button class="delete-row"></button>';
      }
    }
    for(let j = 0; j < 2; j++) {
      table.rows[i + 1].cells[j].innerHTML = values[j];
    }
  }
}

table.addEventListener('click', (e) => {
  if(e.target && e.target.className === 'delete-row') {
    const username = table.rows[e.target.closest('tr').rowIndex].cells[0].innerHTML;
    deleteUser(username);
    table.deleteRow(e.target.closest('tr').rowIndex);
    enteredRows--;
  }
});

function deleteUser(username) {
  fetch('http://localhost:3000/fetch-handlers/delete-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"username": username})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}