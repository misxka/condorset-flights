const reportsSelect = document.getElementById('reports');
const chartCanvas = document.getElementById('chart');
const chartWrapper = document.querySelector('.chart-wrapper');
const tableWrapper = document.querySelector('.table-wrapper');

const ctx = chartCanvas.getContext('2d');

const datesSelect = document.querySelector('#dates');
const availableDates = [];

const votesStats = [];

const flights = [];

//Get available dates from server
fetch('http://localhost:3000/fetch-handlers/entered-dates', {
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
  reportsSelect.value = 'pie-chart';
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
      tableWrapper.classList.remove('hidden');
      fillTable(await getSchedule());
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
      drawLineChart(votesStats);
    }
  }
}

function changeDate(data) {
  // const selectedDate = datesSelect.value;
  if(reportsSelect.value === 'pie-chart' && chart?.type !== 'doughnut') {
    drawDoughnutChart(data);
  }
  else if(reportsSelect.value === 'graph' && chart?.type !== 'bar') {
    drawLineChart(data);
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

function drawLineChart(data) {
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
    type: 'line',
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
  if(data.length > 0) {
    const array = [];
    for(let i = 0; i < data.length; i++) {
      array[i] = Object.values(data[i]);
      let date = new Date(array[i][4]);
      array[i][4] = `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
      date = new Date(array[i][5]);
      array[i][5] = `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
    }



    $(document).ready( function() {
      $('#table').DataTable({
        paging: false,
        info: false,
        destroy: true,
        data: array,
        order: [[ 4, "asc" ]],
        language: {
          zeroRecords: "Совпадений не найдено",
          search: "Поиск:"
        },
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'pdfHtml5',
            title: `Отчёт ${datesSelect.value.slice(-2)}.${datesSelect.value.slice(5, 7)}.${datesSelect.value.slice(0, 4)}`,
            text: 'Отчёт в PDF',
            message: `Расписание Национального Аэропорта Минск на ${datesSelect.value.slice(-2)}.${datesSelect.value.slice(5, 7)}.${datesSelect.value.slice(0, 4)}`,
            customize: function(doc) {
              doc.defaultStyle.fontSize = 14;
              doc.defaultStyle.alignment = 'center'; 
            }
          }
        ],
        columnDefs: [
          {
            targets: '_all',
            className: 'dt-body-center'
          }
        ]
      });
    });
  } else {
    tableWrapper.classList.add('hidden');
    noInfoMessage.innerHTML = 'Данные отсутствуют. Голосование ещё не завершено.';
    noInfoMessage.classList.add('active');
  }
}


//Export to Word and Excel
const exportWordButton = document.querySelector('.export-word');
const exportExcelButton = document.querySelector('.export-excel');
const table = document.querySelector('#table');

exportWordButton.addEventListener('click', () => {
  exportTable('table', `${datesSelect.value}`, 'doc');
});

exportExcelButton.addEventListener('click', () => {
  exportTable('table', `${datesSelect.value}`, 'xls');
});

function exportTable(tableID, filename = '', doctype){
  let downloadLink;
  let dataType;
  if(doctype === 'doc') dataType = 'application/msword';
  else dataType = 'application/vnd.ms-excel';
  const tableSelect = document.getElementById(tableID);
  const tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  filename = filename ? (filename + `.${doctype}`) : `document.${doctype}`;
  
  downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
    const blob = new Blob(['\ufeff', tableHTML], {
      type: dataType
    });
    navigator.msSaveOrOpenBlob( blob, filename);
  } else {
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    downloadLink.download = filename;
    downloadLink.click();
  }
}