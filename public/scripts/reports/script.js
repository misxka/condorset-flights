const reportsSelect = document.getElementById('reports');
const chartCanvas = document.getElementById('chart');

const ctx = chartCanvas.getContext('2d');

const datesSelect = document.querySelector('#dates');
const availableDates = [];

const votesStats = [];

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

reportsSelect.addEventListener('change', () => {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  if(reportsSelect.value === 'pie-chart' && chart?.type !== 'doughnut') {
    drawDoughnutChart(votesStats);
  }
  else if(reportsSelect.value === 'graph' && chart?.type !== 'bar') {
    drawBarChart(votesStats);
  }
});

//Generating random color

function changeDate(data) {
  const selectedDate = datesSelect.value;
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
  
  const customLabels = data.map(elem => elem.label);
  const votesNumber = data.map(elem => elem.numberOfVotes);

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

  const customLabels = data.map(elem => elem.label);
  const votesNumber = data.map(elem => elem.numberOfVotes);

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
          }
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