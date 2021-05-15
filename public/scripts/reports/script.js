const reportsSelect = document.getElementById('reports');
const chartCanvas = document.getElementById('chart');
const chartWrapper = document.querySelector('.chart-wrapper');
const tableWrapper = document.querySelector('.table-wrapper');
const table = tableWrapper.querySelector('table');

const ctx = chartCanvas.getContext('2d');

const datesSelect = document.querySelector('#dates');
const availableDates = [];

const votesStats = [];

const flights = [];

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
    return fetch('http://localhost:3000/fetch-handlers/votes-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"date": datesSelect.value})
    })
  })
  .then(response => response.json())
  .then(data => {
    votesStats.length = 0;
    votesStats.push(...data);
    return votesStats;
  })
  .then((votesStats) => {
    changeDate(votesStats);
  })
  .catch((error) => {
    console.error('Error:', error);
});


//Get information based on selected date
datesSelect.addEventListener('change', () => {
  fetch('http://localhost:3000/fetch-handlers/votes-stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"date": datesSelect.value})
  })
  .then(response => response.json())
  .then(data => {
    votesStats.length = 0;
    votesStats.push(...data);
    return votesStats;
  })
  .then((votesStats) => {
    changeDate(votesStats);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

let chart;
const noInfoMessage = document.querySelector('.no-info-message');

reportsSelect.addEventListener('change', () => {
  reportsSelectHandler();
});

async function reportsSelectHandler() {
  if(reportsSelect.value === 'table') {
    chart?.destroy();
    chartWrapper.classList.add('hidden');
    if(await checkStatus()) {
      noInfoMessage.classList.remove('active');
      fillTable(await getSchedule());
      tableWrapper.classList.remove('hidden');
    } else {
      noInfoMessage.innerHTML = 'Данные отсутствуют. Голосование ещё не завершено.';
      noInfoMessage.classList.add('active');
    }
  } else {
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    if(reportsSelect.value === 'pie-chart' && chart?.type !== 'doughnut') {
      drawDoughnutChart(votesStats);
    }
    else if(reportsSelect.value === 'graph' && chart?.type !== 'bar') {
      drawBarChart(votesStats);
    }
  }
}

function changeDate(data) {
  // const selectedDate = datesSelect.value;
  if(reportsSelect.value === 'pie-chart' && chart?.type !== 'doughnut') {
    drawDoughnutChart(data);
  }
  else if(reportsSelect.value === 'graph' && chart?.type !== 'bar') {
    drawBarChart(data);
  }
}

function interpolateColors(dataLength, colorScale, colorRangeInfo) {
  const { colorStart, colorEnd } = colorRangeInfo;
  const colorRange = colorEnd - colorStart;
  const intervalSize = colorRange / dataLength;
  let i, colorPoint;
  const colorArray = [];

  for (i = 0; i < dataLength; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
}

function calculatePoint(i, intervalSize, colorRangeInfo) {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return (useEndAsStart
    ? (colorEnd - (i * intervalSize))
    : (colorStart + (i * intervalSize)));
}

const colorRangeInfo = {
  colorStart: 0.3,
  colorEnd: 1,
  useEndAsStart: false,
}


function drawDoughnutChart(data) {
  chart?.destroy();

  tableWrapper.classList.add('hidden');

  if(data.length === 0) {
    noInfoMessage.innerHTML = 'Данные отсутствуют. Ещё никто не проголосовал.';
    noInfoMessage.classList.add('active');
    chartWrapper.classList.add('hidden');
    return;
  }

  chartWrapper.classList.remove('hidden');
  noInfoMessage.classList.remove('active');
  
  const customLabels = data.map(elem => `Порядок приоритета: ${elem.order}`);
  const votesNumber = data.map(elem => elem.amount);

  const colors = interpolateColors(data.length, d3.interpolateInferno, colorRangeInfo);
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: customLabels,
      datasets: [{
        label: "Количество голосов",
        data: votesNumber,
        backgroundColor: colors,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 10
        }
      }
    }
  });
}

function drawBarChart(data) {
  chart?.destroy();

  tableWrapper.classList.add('hidden');

  if(data.length === 0) {
    noInfoMessage.innerHTML = 'Данные отсутствуют. Ещё никто не проголосовал.';
    noInfoMessage.classList.add('active');
    chartWrapper.classList.add('hidden');
    return;
  }

  chartWrapper.classList.remove('hidden');
  noInfoMessage.classList.remove('active');
  
  const customLabels = data.map(elem => `Порядок приоритета: ${elem.order}`);
  const votesNumber = data.map(elem => elem.amount);

  const colors = interpolateColors(data.length, d3.interpolateInferno, colorRangeInfo);

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: customLabels,
      datasets: [{
        label: "Количество голосов",
        data: votesNumber,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          },
          max: Math.ceil(Math.max(...votesNumber) * 1.1)
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 10
        }
      }
    }
  });
}

async function checkStatus() {
  const response = await fetch('http://localhost:3000/fetch-handlers/check-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({"date": datesSelect.value})
  });
  const result = await response.json();
  return result.status;
}

async function getSchedule() {
  const response = await fetch('http://localhost:3000/fetch-handlers/get-final-schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({"date": datesSelect.value})
  });
  const schedule = await response.json();
  return schedule;
}

function fillTable(data) {
  clearTable();
  for(let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    const row = table.insertRow(i + 1);
    for(let j = 0; j < 6; j++) {
      row.insertCell(j);
    }
    for(let j = 0; j < 6; j++) {
      table.rows[i + 1].cells[j].innerHTML = values[j];
    }
  }
}

function clearTable() {
  while(table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  }
}